import { Injectable } from '@nestjs/common';
import { Tool } from '@rekog/mcp-nest';
import { z } from 'zod';
import { KnowledgeService } from '../services/knowledge.service';

@Injectable()
export class RegrasTool {
  constructor(private readonly knowledge: KnowledgeService) {}

  @Tool({
    name: 'buscar_regra',
    description:
      'Busca nas Comprehensive Rules oficiais de Magic: The Gathering (em inglês). ' +
      'Aceita um número de regra (ex: "702.19") ou termos em inglês (ex: "deathtouch lethal"). ' +
      'Para dúvidas em português, traduza os termos antes (atropelar=trample, toque mortífero=deathtouch, ' +
      'ímpeto=haste, manto=shroud, anular=counter, pilha=stack). ' +
      'Seções úteis: 5xx turno/combate, 601 conjurar, 613 camadas, 702 todas as palavras-chave, ' +
      '704 ações baseadas em estado, 903 Commander. ' +
      'IMPORTANTE: ao responder ao usuário, cite o número da regra encontrada (ex: "regra 702.2c"). ' +
      'Faça mais de uma busca com termos diferentes se a primeira não resolver a dúvida.',
    parameters: z.object({
      termo: z
        .string()
        .describe('Número da regra (ex: "702.19") ou termo de busca em inglês (ex: "trample assign lethal")'),
      max_resultados: z.number().int().min(1).max(40).default(12).optional(),
    }),
  })
  async buscarRegra({ termo, max_resultados }: { termo: string; max_resultados?: number }) {
    const resultados = this.knowledge.buscarRegra(termo, max_resultados ?? 12);
    if (resultados.length === 0) {
      return (
        `Nenhuma regra encontrada para "${termo}". Tente sinônimos em inglês, ` +
        'o nome exato da palavra-chave (ex: "Deathtouch") ou o glossário (busque o termo isolado).'
      );
    }
    return [
      `Resultados para "${termo}" (${this.knowledge.versaoRegras()}):`,
      '',
      ...resultados.map((r) => `• ${r}`),
      '',
      'Lembrete: cite o número da regra na resposta ao usuário.',
    ].join('\n');
  }

  @Tool({
    name: 'info_brackets',
    description:
      'Retorna o guia completo do sistema de Brackets do Commander (níveis de poder 1 a 5): ' +
      'restrições de cada bracket (Game Changers, combos de 2 cartas, mass land denial, turnos extras), ' +
      'como classificar um deck e a lista snapshot de Game Changers. ' +
      'Use SEMPRE antes de montar ou avaliar um deck de Commander.',
    parameters: z.object({}),
  })
  async infoBrackets() {
    return this.knowledge.brackets();
  }
}
