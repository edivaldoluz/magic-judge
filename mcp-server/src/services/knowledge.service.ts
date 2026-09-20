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
  /** Índice das palavras-chave oficiais: "Ward" -> "702.21". */
  private palavrasChave: { nome: string; regra: string }[] = [];

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

    // Índice de palavras-chave a partir dos títulos "702.N. Nome"
    this.palavrasChave = [];
    for (const l of this.linhasRegras) {
      const m = l.match(/^(702\.\d+)\.\s+(.+)$/);
      if (m && m[2].length >= 4) {
        this.palavrasChave.push({ nome: m[2].trim(), regra: m[1] });
      }
    }

    this.logger.log(
      `Base carregada: ${this.linhasRegras.length} linhas de regras, ` +
        `${this.palavrasChave.length} palavras-chave (${regrasPath})`,
    );
  }

  /** Data de vigência das regras (primeiras linhas do arquivo). */
  versaoRegras(): string {
    const linha = this.linhasRegras.find((l) =>
      l.startsWith('These rules are effective as of'),
    );
    return linha ?? 'versão desconhecida';
  }

  // Palavras muito comuns que só geram ruído no ranking (EN + PT).
  private static readonly STOPWORDS = new Set([
    'the', 'a', 'an', 'of', 'to', 'is', 'are', 'and', 'or', 'in', 'on', 'that',
    'this', 'with', 'as', 'at', 'be', 'it', 'its', 'for', 'do', 'not', 'can',
    'if', 'when', 'by', 'from', 'you', 'your', 'these', 'those', 'any', 'all',
    'no', 'than', 'then', 'into', 'de', 'da', 'dos', 'das', 'que', 'se', 'na',
    'os', 'as', 'um', 'uma', 'para', 'com',
  ]);

  private normaliza(s: string): string {
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  private escapaRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Busca nas Comprehensive Rules.
   * - Número de regra (ex: "702.19", "601") → retorna a regra e sub-regras.
   * - Texto (palavra-chave ou dúvida em palavras) → pontua cada linha por:
   *   limite de palavra (evita "Ward" casar "toward"), quantos termos casaram
   *   (AND preferido, degrada para OR) e boost se o termo bate no NOME da
   *   palavra-chave (ex: "Ward" prioriza "702.21. Ward"). Ordena por relevância.
   */
  buscarRegra(termo: string, maxResultados = 12): string[] {
    const t = termo.trim();

    if (/^\d{3}(\.\d+)?[a-z]?\.?$/.test(t)) {
      const prefixo = t.replace(/\.$/, '');
      const re = new RegExp(`^${prefixo.replace(/\./g, '\\.')}(?![0-9])`);
      return this.linhasRegras.filter((l) => re.test(l)).slice(0, maxResultados);
    }

    const tokens = this.normaliza(t)
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length >= 3 && !KnowledgeService.STOPWORDS.has(w));

    // termo curto / só stopwords → substring simples como rede de segurança
    if (tokens.length === 0) {
      const re = new RegExp(this.escapaRegex(this.normaliza(t)), 'i');
      return this.linhasRegras
        .filter((l) => re.test(this.normaliza(l)))
        .slice(0, maxResultados);
    }

    const regexes = tokens.map(
      (tk) => new RegExp(`\\b${this.escapaRegex(tk)}`, 'i'),
    );
    const pontuados: { linha: string; score: number }[] = [];

    for (const linha of this.linhasRegras) {
      const nl = this.normaliza(linha);
      let casados = 0;
      for (const re of regexes) if (re.test(nl)) casados++;
      if (casados === 0) continue;

      let boost = 0;
      const m = linha.match(/^\d{3}\.\d+[a-z]?\.\s+(.+)$/);
      if (m) {
        const titulo = this.normaliza(m[1]);
        for (const tk of tokens) {
          if (new RegExp(`^${this.escapaRegex(tk)}\\b`).test(titulo)) boost += 60;
        }
      }
      const bonusAnd = casados === tokens.length ? 25 : 0;
      pontuados.push({ linha, score: casados * 10 + boost + bonusAnd });
    }

    pontuados.sort((a, b) => b.score - a.score);
    return pontuados.slice(0, maxResultados).map((p) => p.linha);
  }

  /** Palavras-chave oficiais presentes num texto de carta (para a ferramenta interacao). */
  detectarPalavrasChave(texto: string): { nome: string; regra: string }[] {
    const t = this.normaliza(texto ?? '');
    const achadas: { nome: string; regra: string }[] = [];
    for (const kw of this.palavrasChave) {
      const n = this.normaliza(kw.nome);
      if (new RegExp(`\\b${this.escapaRegex(n)}\\b`).test(t)) {
        achadas.push(kw);
      }
    }
    return achadas;
  }

  /** Linhas de uma regra e suas sub-regras (ex: "702.19" → 702.19, 702.19a...). */
  regrasDoNumero(numero: string, max = 8): string[] {
    const re = new RegExp(`^${numero.replace(/\./g, '\\.')}(?![0-9])`);
    return this.linhasRegras.filter((l) => re.test(l)).slice(0, max);
  }

  brackets(): string {
    return this.bracketsMd;
  }
}
