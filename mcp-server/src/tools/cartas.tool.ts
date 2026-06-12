import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { ScryfallService } from '../services/scryfall.service';

@Injectable()
export class CartasTool {
  constructor(private readonly scryfall: ScryfallService) {}

  @Tool({
    name: 'buscar_carta',
    description:
      'Busca uma carta de Magic pelo nome (inglês ou português, tolerante a erros de grafia) na Scryfall. ' +
      'Retorna o texto oficial (oracle), custo, tipo, legalidade por formato e preço em USD. ' +
      'SEMPRE use esta ferramenta antes de afirmar o que uma carta faz — o texto oficial muda com erratas.',
    parameters: z.object({
      nome: z.string().describe('Nome da carta, em inglês ou português (ex: "Lightning Bolt" ou "Relâmpago")'),
    }),
  })
  async buscarCarta({ nome }: { nome: string }) {
    try {
      const c = await this.scryfall.porNome(nome);
      return JSON.stringify(c, null, 2);
    } catch (e: any) {
      return `Erro: ${e.message}`;
    }
  }

  @Tool({
    name: 'busca_avancada',
    description:
      'Busca avançada de cartas na Scryfall com a sintaxe oficial. Filtros: c: cor, id: identidade de cor ' +
      '(Commander), t: tipo, o: texto, mv valor de mana, f: formato legal, usd preço, r: raridade, ' +
      '-is:gamechanger exclui Game Changers, pow/tou poder/resistência. ' +
      'Exemplos: "c:r t:instant mv<=2 f:pauper" | "id<=gw t:creature o:lifelink usd<=1". ' +
      'Use para descobrir cartas para decks, respeitando formato, bracket e orçamento.',
    parameters: z.object({
      consulta: z.string().describe('Consulta na sintaxe Scryfall (em inglês)'),
      ordem: z
        .enum(['name', 'usd', 'cmc', 'edhrec', 'released'])
        .default('edhrec')
        .optional()
        .describe('Ordenação: edhrec = popularidade (padrão)'),
      max_resultados: z.number().int().min(1).max(40).default(15).optional(),
    }),
  })
  async buscaAvancada({
    consulta,
    ordem,
    max_resultados,
  }: {
    consulta: string;
    ordem?: 'name' | 'usd' | 'cmc' | 'edhrec' | 'released';
    max_resultados?: number;
  }) {
    try {
      const [cartas, total] = await Promise.all([
        this.scryfall.busca(consulta, ordem ?? 'edhrec', max_resultados ?? 15),
        this.scryfall.totalDaBusca(consulta),
      ]);
      const resumo = cartas.map((c) => ({
        nome: c.nome,
        custo: c.custo_de_mana,
        tipo: c.tipo,
        texto: c.texto_oracle,
        pt: c.poder_resistencia,
        usd: c.preco_usd,
      }));
      return `${total} cartas no total. Primeiras ${resumo.length}:\n${JSON.stringify(resumo, null, 2)}`;
    } catch (e: any) {
      return `Erro: ${e.message}`;
    }
  }

  @Tool({
    name: 'rulings_carta',
    description:
      'Retorna os rulings oficiais (decisões de juiz publicadas pela Wizards) de uma carta. ' +
      'Use em dúvidas de interação envolvendo uma carta específica — os rulings esclarecem casos não-óbvios.',
    parameters: z.object({
      nome: z.string().describe('Nome da carta (inglês ou português)'),
    }),
  })
  async rulingsCarta({ nome }: { nome: string }) {
    try {
      const r = await this.scryfall.rulings(nome);
      if (r.rulings.length === 0) {
        return `${r.carta}: não há rulings publicados para esta carta.`;
      }
      return [
        `Rulings oficiais de ${r.carta}:`,
        ...r.rulings.map((x) => `• [${x.data}] ${x.texto}`),
      ].join('\n');
    } catch (e: any) {
      return `Erro: ${e.message}`;
    }
  }
}
