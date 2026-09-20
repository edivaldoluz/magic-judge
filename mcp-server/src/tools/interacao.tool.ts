import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { ScryfallService } from '../services/scryfall.service';
import { KnowledgeService } from '../services/knowledge.service';

const MAX_RULINGS = 8;
const MAX_LINHAS_POR_REGRA = 6;
const MAX_PALAVRAS_CHAVE = 10;

@Injectable()
export class InteracaoTool {
  constructor(
    private readonly scryfall: ScryfallService,
    private readonly knowledge: KnowledgeService,
  ) {}

  @Tool({
    name: 'interacao',
    description:
      'Explica a interação entre DUAS cartas. Devolve, numa só chamada: o texto oficial (oracle) das duas, ' +
      'os rulings dos DOIS lados (não é preciso adivinhar em qual carta está o ruling) e as regras oficiais ' +
      'das palavras-chave envolvidas (ex: atropelar + toque mortífero → 702.19 e 702.2). ' +
      'Use SEMPRE que a dúvida for do tipo "o que acontece quando A encontra B". ' +
      'Se os rulings não cobrirem o caso, complemente com buscar_regra: conjurar/resolver (601/608), ' +
      'habilidades desencadeadas (603), ações baseadas em estado (704), camadas (613), prioridade (117).',
    parameters: z.object({
      carta_a: z.string().describe('Nome da primeira carta (inglês ou português)'),
      carta_b: z.string().describe('Nome da segunda carta (inglês ou português)'),
    }),
  })
  async interacao({ carta_a, carta_b }: { carta_a: string; carta_b: string }) {
    try {
      const [a, b] = await Promise.all([
        this.scryfall.porNome(carta_a),
        this.scryfall.porNome(carta_b),
      ]);

      const [rulingsA, rulingsB] = await Promise.all([
        this.scryfall.rulings(a.nome).catch(() => ({ carta: a.nome, rulings: [] })),
        this.scryfall.rulings(b.nome).catch(() => ({ carta: b.nome, rulings: [] })),
      ]);

      const bloco = (
        c: typeof a,
        r: { rulings: { data: string; texto: string }[] },
      ): string[] => {
        const linhas = [
          `## ${c.nome}${c.custo_de_mana ? ` ${c.custo_de_mana}` : ''}`,
          `${c.tipo}${c.poder_resistencia ? ` — ${c.poder_resistencia}` : ''}`,
          `Texto oficial: ${c.texto_oracle ?? '(sem texto)'}`,
        ];
        if (r.rulings.length === 0) {
          linhas.push('Rulings: nenhum publicado para esta carta.');
        } else {
          linhas.push(`Rulings (${r.rulings.length}):`);
          for (const x of r.rulings.slice(0, MAX_RULINGS)) {
            linhas.push(`• [${x.data}] ${x.texto}`);
          }
          if (r.rulings.length > MAX_RULINGS) {
            linhas.push(`(… mais ${r.rulings.length - MAX_RULINGS}; use rulings_carta para ver todos)`);
          }
        }
        return linhas;
      };

      // palavras-chave das duas cartas → regras oficiais aplicáveis
      const kwA = this.knowledge.detectarPalavrasChave(
        `${a.texto_oracle ?? ''} ${a.tipo ?? ''}`,
      );
      const kwB = this.knowledge.detectarPalavrasChave(
        `${b.texto_oracle ?? ''} ${b.tipo ?? ''}`,
      );

      const mapa = new Map<string, { nome: string; regra: string; de: string[] }>();
      for (const [lista, quem] of [
        [kwA, a.nome],
        [kwB, b.nome],
      ] as const) {
        for (const kw of lista) {
          const atual = mapa.get(kw.regra);
          if (atual) {
            if (!atual.de.includes(quem)) atual.de.push(quem);
          } else {
            mapa.set(kw.regra, { ...kw, de: [quem] });
          }
        }
      }

      const regrasLinhas: string[] = [];
      const chaves = [...mapa.values()].slice(0, MAX_PALAVRAS_CHAVE);
      if (chaves.length === 0) {
        regrasLinhas.push(
          'Nenhuma palavra-chave oficial detectada no texto das duas cartas. ' +
            'Use buscar_regra com os conceitos envolvidos (em inglês) para achar as regras aplicáveis.',
        );
      } else {
        for (const kw of chaves) {
          regrasLinhas.push(`### ${kw.nome} (${kw.regra}) — em: ${kw.de.join(', ')}`);
          for (const l of this.knowledge.regrasDoNumero(kw.regra, MAX_LINHAS_POR_REGRA)) {
            regrasLinhas.push(`• ${l}`);
          }
        }
      }

      return [
        `Interação: ${a.nome} × ${b.nome}`,
        `(base de regras: ${this.knowledge.versaoRegras()})`,
        '',
        ...bloco(a, rulingsA),
        '',
        ...bloco(b, rulingsB),
        '',
        '## Regras oficiais das palavras-chave envolvidas',
        ...regrasLinhas,
        '',
        'Como responder: dê o veredito na primeira frase, explique a resolução passo a passo ' +
          '(ordem na pilha, prioridade, estado final) e CITE os números das regras usadas. ' +
          'Se os rulings acima não resolverem o caso, chame buscar_regra para 601/608 (conjurar e resolver), ' +
          '603 (desencadeadas), 704 (ações baseadas em estado) ou 613 (camadas).',
      ].join('\n');
    } catch (e: any) {
      return `Erro: ${e.message}. Confira os nomes das cartas (inglês ou português) e tente de novo.`;
    }
  }
}
