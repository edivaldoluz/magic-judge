import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as crypto from 'crypto';

/**
 * Protege o painel/stats com Basic Auth lido de PANEL_USER / PANEL_PASS.
 * Sem as variáveis definidas, o painel fica desativado (não expõe nada).
 */
@Injectable()
export class BasicAuthMiddleware implements NestMiddleware {
  private safeEqual(a: string, b: string): boolean {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const user = process.env.PANEL_USER;
    const pass = process.env.PANEL_PASS;

    if (!user || !pass) {
      res
        .status(503)
        .send('Painel desativado: defina PANEL_USER e PANEL_PASS no ambiente.');
      return;
    }

    const header = req.headers['authorization'] || '';
    const [scheme, token] = header.split(' ');
    if (scheme === 'Basic' && token) {
      const decoded = Buffer.from(token, 'base64').toString('utf8');
      const idx = decoded.indexOf(':');
      const u = decoded.slice(0, idx);
      const p = decoded.slice(idx + 1);
      if (this.safeEqual(u, user) && this.safeEqual(p, pass)) {
        next();
        return;
      }
    }

    res.set('WWW-Authenticate', 'Basic realm="Magic Judge - Painel"');
    res.status(401).send('Autenticação necessária.');
  }
}
