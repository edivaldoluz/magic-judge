import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { McpModule } from '@rekog/mcp-nest';
import { KnowledgeService } from './services/knowledge.service';
import { ScryfallService } from './services/scryfall.service';
import { EdhrecService } from './services/edhrec.service';
import { RegrasTool } from './tools/regras.tool';
import { CartasTool } from './tools/cartas.tool';
import { DeckTool } from './tools/deck.tool';
import { UsageLoggerMiddleware } from './usage-logger.middleware';
import { BasicAuthMiddleware } from './basic-auth.middleware';
import { PanelController } from './panel.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [
    McpModule.forRoot({
      name: 'magic-judge',
      version: '1.0.0',
      instructions:
        'Servidor MCP do Magic Judge — assistente de regras, cartas e decks de Magic: The Gathering. ' +
        'Ao responder dúvidas de regras, SEMPRE use buscar_regra e cite o número da regra oficial na resposta ' +
        '(buscar_regra aceita o número da regra, o nome da palavra-chave, ou a dúvida em palavras-chave em inglês). ' +
        'Ao falar de UMA carta, confirme o texto oficial com buscar_carta (nunca confie na memória). ' +
        'Para VÁRIAS cartas de uma vez, use busca_avancada com nomes exatos em OR — `!"Carta A" or !"Carta B"` — ' +
        'que traz texto e legalidade de todas numa só chamada; evite dezenas de buscar_carta separadas. ' +
        'Antes de recomendar uma carta para um formato, cheque o campo legalidades (busca por nome exato ignora o filtro f:formato). ' +
        'Para interações não-óbvias entre cartas, consulte rulings_carta dos DOIS lados. ' +
        'Ao montar ou avaliar decks de Commander, use info_brackets e verificar_game_changers para respeitar o bracket alvo.',
    }),
  ],
  controllers: [PanelController],
  providers: [
    KnowledgeService,
    ScryfallService,
    EdhrecService,
    RegrasTool,
    CartasTool,
    DeckTool,
    StatsService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(UsageLoggerMiddleware).forRoutes('mcp');
    consumer.apply(BasicAuthMiddleware).forRoutes('painel', 'stats');
  }
}
