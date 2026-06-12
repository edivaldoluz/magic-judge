import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { EdhrecService } from '../services/edhrec.service';
import { ScryfallService } from '../services/scryfall.service';

@Injectable()
export class DeckTool {
  constructor(
    private readonly edhrec: EdhrecService,
    private readonly scryfall: ScryfallService,
  ) {}

  @Tool({
    name: 'recomendacoes_comandante',
    description:
      'Recomendações do EDHREC para um comandante: cartas de maior sinergia (High Synergy Cards), ' +
      'as mais jogadas (Top Cards) e por categoria, com base em dezenas de milhares de decks reais. ' +
      'Use como ponto de partida ao montar deck de Commander. ' +
      'ATENÇÃO: popularidade não considera bracket nem orçamento — valide cada carta com ' +
      'busca_avancada/verificar_game_changers antes de incluir no deck.',
    parameters: z.object({
      comandante: z.string().describe('Nome oficial do comandante em inglês (ex: "Krenko, Mob Boss")'),
      orcamento: z
        .boolean()
        .default(false)
        .optional()
        .describe('true = versão budget (decks econômicos) do EDHREC'),
    }),
  })
  async recomendacoes({ comandante, orcamento }: { comandante: string; orcamento?: boolean }) {
    try {
      const r = await this.edhrec.comandante(comandante, orcamento ?? false);
      const linhas: string[] = [
        r.titulo + (orcamento ? ' (versão budget)' : ''),
        r.precoMedio != null ? `Preço médio do deck no EDHREC: US$ ${r.precoMedio}` : '',
        r.similares?.length ? `Comandantes similares: ${r.similares.join(', ')}` : '',
        '',
      ];
      for (const cat of r.categorias) {
        linhas.push(`## ${cat.categoria}`);
        for (const c of cat.cartas) {
          const sin = c.sinergia != null ? ` (sinergia ${(c.sinergia * 100).toFixed(0)}%)` : '';
          linhas.push(`• ${c.nome}${sin}`);
        }
        linhas.push('');
      }
      linhas.push(
        'Lembrete: valide bracket (verificar_game_changers / info_brackets), legalidade e preço antes de montar a lista final.',
      );
      return linhas.filter((l) => l !== null).join('\n');
    } catch (e: any) {
      return `Erro: ${e.message}. Alternativa: use busca_avancada com order=edhrec para staples do formato.`;
    }
  }

  @Tool({
    name: 'verificar_game_changers',
    description:
      'Verifica quais cartas de uma lista são Game Changers (lista oficial da Wizards, viva na Scryfall). ' +
      'Essencial para brackets de Commander: 1 Game Changer já coloca o deck no Bracket 3+; ' +
      'até 3 no Bracket 3; livre nos Brackets 4-5. Use ao montar ou classificar decks de Commander.',
    parameters: z.object({
      cartas: z
        .array(z.string())
        .min(1)
        .max(120)
        .describe('Nomes das cartas a verificar (inglês)'),
    }),
  })
  async verificarGameChangers({ cartas }: { cartas: string[] }) {
    try {
      const lista = await this.scryfall.gameChangers();
      const listaLower = lista.map((n) => n.toLowerCase());

      const sao: string[] = [];
      const naoSao: string[] = [];
      for (const carta of cartas) {
        const c = carta.trim().toLowerCase();
        const hit = listaLower.findIndex(
          (n) => n === c || n.startsWith(c + ' //') || n.split(' // ')[0] === c,
        );
        if (hit >= 0) sao.push(lista[hit]);
        else naoSao.push(carta);
      }

      return [
        `Game Changers na lista (${sao.length}): ${sao.length ? sao.join(', ') : 'nenhum'}`,
        `Não são Game Changers (${naoSao.length}): ${naoSao.join(', ') || '—'}`,
        '',
        `Total de Game Changers existentes hoje: ${lista.length}.`,
        sao.length === 0
          ? 'Deck compatível com Brackets 1-2 neste critério.'
          : sao.length <= 3
            ? 'Compatível com Bracket 3 (até 3 Game Changers) ou superior.'
            : 'Apenas Brackets 4-5 (mais de 3 Game Changers).',
      ].join('\n');
    } catch (e: any) {
      return `Erro: ${e.message}`;
    }
  }
}
