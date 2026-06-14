import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Loga uma linha enxuta por chamada de ferramenta MCP (tools/call), para medir
 * uso sem expor dado pessoal:
 *   [USAGE] {"t":"<iso>","tool":"buscar_regra","cid":"<hash>"}
 *
 * - `cid` é um hash do IP + salt (não guarda IP cru). Serve como estimativa de
 *   "pessoas/dia" (IPs distintos), não identifica ninguém.
 * - O salt é gerado uma vez e guardado no volume (USAGE_LOG_DIR), então é
 *   estável entre deploys e nunca vai pro repositório.
 * - Além do stdout (visível no Coolify), grava em usage.log no volume para
 *   contagem durável. Tudo best-effort: nunca quebra a requisição.
 */
@Injectable()
export class UsageLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Usage');
  private readonly dir = process.env.USAGE_LOG_DIR || '';
  private salt = '';

  private resolveSalt(): string {
    if (this.salt) return this.salt;
    if (!this.dir) return (this.salt = 'mj-default');
    try {
      const p = path.join(this.dir, 'salt');
      if (fs.existsSync(p)) {
        this.salt = fs.readFileSync(p, 'utf8').trim();
      } else {
        this.salt = crypto.randomBytes(16).toString('hex');
        fs.writeFileSync(p, this.salt);
      }
    } catch {
      this.salt = 'mj-default';
    }
    return this.salt;
  }

  use(req: Request, _res: Response, next: NextFunction): void {
    try {
      const body = req.body as { method?: string; params?: { name?: string } };
      if (body && body.method === 'tools/call') {
        const tool = body.params?.name ?? 'unknown';
        const fwd = req.headers['x-forwarded-for'];
        const ip =
          (Array.isArray(fwd) ? fwd[0] : fwd)?.split(',')[0]?.trim() ||
          req.socket?.remoteAddress ||
          '';
        const cid = crypto
          .createHash('sha256')
          .update(this.resolveSalt() + ip)
          .digest('hex')
          .slice(0, 12);
        const entry = { t: new Date().toISOString(), tool, cid };
        this.logger.log(`[USAGE] ${JSON.stringify(entry)}`);
        if (this.dir) {
          try {
            fs.appendFileSync(
              path.join(this.dir, 'usage.log'),
              JSON.stringify(entry) + '\n',
            );
          } catch {
            /* volume indisponível — segue só com o stdout */
          }
        }
      }
    } catch {
      /* nunca interromper a requisição por causa do log */
    }
    next();
  }
}
