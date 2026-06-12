import { Injectable } from '@nestjs/common';

const HEADERS = { 'User-Agent': 'magic-judge-mcp/1.0' };

export interface RecomendacaoCategoria {
  categoria: string;
  cartas: { nome: string; sinergia?: number; decks?: number }[];
}

@Injectable()
export class EdhrecService {
  /** "Krenko, Mob Boss" -> "krenko-mob-boss" */
  slug(nome: string): string {
    const semAcentos = nome.normalize('NFD').replace(/[̀-ͯ]/g, '');
    return semAcentos
      .toLowerCase()
      .replace(/['’.,"]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Recomendações de cartas para um comandante.
   * @param orcamento true = variante budget do EDHREC
   */
  async comandante(
    nome: string,
    orcamento = false,
    porCategoria = 8,
  ): Promise<{ titulo: string; precoMedio?: number; similares?: string[]; categorias: RecomendacaoCategoria[] }> {
    const slug = this.slug(nome);
    const url = `https://json.edhrec.com/pages/commanders/${slug}${orcamento ? '/budget' : ''}.json`;

    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) {
      throw new Error(
        `EDHREC não encontrou "${nome}" (slug: ${slug}, HTTP ${res.status}). ` +
          'Confirme o nome oficial em inglês do comandante.',
      );
    }
    const d: any = await res.json();

    const categorias: RecomendacaoCategoria[] = (
      d.container?.json_dict?.cardlists ?? []
    ).map((lista: any) => ({
      categoria: lista.header,
      cartas: (lista.cardviews ?? []).slice(0, porCategoria).map((cv: any) => ({
        nome: cv.name,
        sinergia: cv.synergy,
        decks: cv.num_decks,
      })),
    }));

    return {
      titulo: d.header ?? nome,
      precoMedio: d.avg_price,
      similares: d.similar,
      categorias,
    };
  }
}
