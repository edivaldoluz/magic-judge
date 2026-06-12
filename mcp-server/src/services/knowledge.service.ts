import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Carrega a base de conhecimento (pasta conhecimento/ na raiz do repositório)
 * e oferece busca nas Comprehensive Rules.
 */
@Injectable()
export class KnowledgeService implements OnModuleInit {
  private readonly logger = new Logger(KnowledgeService.name);
  private linhasRegras: string[] = [];
  private bracketsMd = '';

  onModuleInit() {
    const dir =
      process.env.CONHECIMENTO_DIR ??
      path.resolve(__dirname, '..', '..', '..', 'conhecimento');

    const regrasPath = path.join(dir, 'comprehensive-rules.txt');
    const bracketsPath = path.join(dir, 'commander-brackets.md');

    this.linhasRegras = fs
      .readFileSync(regrasPath, 'utf8')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    this.bracketsMd = fs.readFileSync(bracketsPath, 'utf8');

    this.logger.log(
      `Base carregada: ${this.linhasRegras.length} linhas de regras (${regrasPath})`,
    );
  }

  /** Data de vigência das regras (primeiras linhas do arquivo). */
  versaoRegras(): string {
    const linha = this.linhasRegras.find((l) =>
      l.startsWith('These rules are effective as of'),
    );
    return linha ?? 'versão desconhecida';
  }

  /**
   * Busca nas Comprehensive Rules.
   * - Se o termo for um número de regra (ex: "702.19" ou "601"), retorna a
   *   regra e todas as sub-regras.
   * - Caso contrário, busca textual (case-insensitive) e retorna as linhas
   *   que casam — cada linha já começa com o número da regra.
   */
  buscarRegra(termo: string, maxResultados = 12): string[] {
    const t = termo.trim();

    if (/^\d{3}(\.\d+)?[a-z]?\.?$/.test(t)) {
      const prefixo = t.replace(/\.$/, '');
      const re = new RegExp(
        `^${prefixo.replace(/\./g, '\\.')}(?![0-9])`,
      );
      return this.linhasRegras.filter((l) => re.test(l)).slice(0, maxResultados);
    }

    const re = new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return this.linhasRegras.filter((l) => re.test(l)).slice(0, maxResultados);
  }

  brackets(): string {
    return this.bracketsMd;
  }
}
