import { Injectable, Logger } from '@nestjs/common';

const BASE = 'https://api.scryfall.com';
const HEADERS = {
  'User-Agent': 'magic-judge-mcp/1.0',
  Accept: 'application/json',
};

export interface CartaResumo {
  nome: string;
  nome_impresso?: string;
  custo_de_mana?: string;
  tipo: string;
  texto_oracle?: string;
  poder_resistencia?: string;
  cores?: string[];
  identidade_de_cor?: string[];
  legalidades: Record<string, string>;
  preco_usd?: string | null;
  raridade?: string;
  colecao?: string;
  link?: string;
  id: string;
  aviso?: string;
}

@Injectable()
export class ScryfallService {
  private readonly logger = new Logger(ScryfallService.name);
  private gameChangersCache: { nomes: string[]; em: number } | null = null;

  private async get(url: string): Promise<any> {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) {
      const corpo = await res.text().catch(() => '');
      throw new Error(`Scryfall ${res.status}: ${corpo.slice(0, 300)}`);
    }
    return res.json();
  }

  private resumir(c: any): CartaResumo {
    return {
      nome: c.name,
      nome_impresso: c.printed_name,
      custo_de_mana: c.mana_cost,
      tipo: c.type_line,
      texto_oracle: c.oracle_text ?? c.card_faces?.map((f: any) => `${f.name}: ${f.oracle_text}`).join(' // '),
      poder_resistencia: c.power != null ? `${c.power}/${c.toughness}` : undefined,
      cores: c.colors,
      identidade_de_cor: c.color_identity,
      legalidades: c.legalities,
      preco_usd: c.prices?.usd ?? null,
      raridade: c.rarity,
      colecao: c.set_name,
      link: c.scryfall_uri,
      id: c.id,
    };
  }

  private normaliza(s: string): string {
    return s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim();
  }

  /**
   * Busca por nome. Tenta fuzzy em inglês; se o resultado não parecer com o
   * nome pedido (ex: nome em português), tenta a busca por nome impresso PT
   * antes de aceitar.
   */
  async porNome(nome: string): Promise<CartaResumo> {
    const alvo = this.normaliza(nome);

    let fuzzy: CartaResumo | null = null;
    try {
      const c = await this.get(
        `${BASE}/cards/named?fuzzy=${encodeURIComponent(nome)}`,
      );
      fuzzy = this.resumir(c);
    } catch {
      // segue para a tentativa em português
    }

    if (fuzzy) {
      const candidatos = [fuzzy.nome, fuzzy.nome_impresso]
        .filter((n): n is string => !!n)
        .map((n) => this.normaliza(n));
      if (candidatos.some((c) => c.includes(alvo) || alvo.includes(c))) {
        return fuzzy;
      }
    }

    // nome impresso em português (a Scryfall exige acentos corretos aqui)
    try {
      const r = await this.get(
        `${BASE}/cards/search?q=${encodeURIComponent(`lang:pt "${nome}"`)}&include_multilingual=true`,
      );
      if (r.data?.length) {
        const exata = r.data.find(
          (c: any) => c.printed_name && this.normaliza(c.printed_name) === alvo,
        );
        return this.resumir(exata ?? r.data[0]);
      }
    } catch {
      // sem resultado em português
    }

    if (fuzzy) {
      return {
        ...fuzzy,
        aviso:
          `Nenhuma carta casou exatamente com "${nome}" — este é um resultado aproximado. ` +
          'Se o nome era em português, repita a busca escrevendo com os acentos corretos (ex: "Relâmpago").',
      };
    }
    throw new Error(`Carta não encontrada: ${nome}`);
  }

  /** Busca avançada com a sintaxe da Scryfall (c:, t:, o:, mv, f:, usd...). */
  async busca(q: string, ordem = 'edhrec', max = 15): Promise<CartaResumo[]> {
    const r = await this.get(
      `${BASE}/cards/search?q=${encodeURIComponent(q)}&order=${encodeURIComponent(ordem)}`,
    );
    return (r.data ?? []).slice(0, max).map((c: any) => this.resumir(c));
  }

  async totalDaBusca(q: string): Promise<number> {
    const r = await this.get(`${BASE}/cards/search?q=${encodeURIComponent(q)}`);
    return r.total_cards ?? 0;
  }

  /** Rulings oficiais de uma carta (resolve o nome primeiro). */
  async rulings(nome: string): Promise<{ carta: string; rulings: { data: string; texto: string }[] }> {
    const carta = await this.porNome(nome);
    const r = await this.get(`${BASE}/cards/${carta.id}/rulings`);
    return {
      carta: carta.nome,
      rulings: (r.data ?? []).map((x: any) => ({
        data: x.published_at,
        texto: x.comment,
      })),
    };
  }

  /** Lista atual de Game Changers (cache de 24h). */
  async gameChangers(): Promise<string[]> {
    const DIA = 24 * 60 * 60 * 1000;
    if (this.gameChangersCache && Date.now() - this.gameChangersCache.em < DIA) {
      return this.gameChangersCache.nomes;
    }
    const r = await this.get(`${BASE}/cards/search?q=is%3Agamechanger&order=name`);
    const nomes = (r.data ?? []).map((c: any) => c.name as string);
    this.gameChangersCache = { nomes, em: Date.now() };
    this.logger.log(`Game Changers atualizados: ${nomes.length} cartas`);
    return nomes;
  }
}
