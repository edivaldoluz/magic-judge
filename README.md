# Magic Judge ⚖️

O juiz de **Magic: The Gathering** para a sua IA — um serviço online que
responde dúvidas de regras citando a regra oficial, dá vereditos passo a
passo, busca cartas ao vivo e ajuda a montar decks por bracket.

Feito de jogador para jogador. Gratuito e de código aberto.

**🌐 Site oficial: <https://edivaldoluz.github.io/magic-judge/>**

## Como usar

O Magic Judge fala [MCP](https://modelcontextprotocol.io) — o padrão aberto de
conectores para IAs. Funciona no Claude, ChatGPT, Cursor, VS Code e qualquer
cliente compatível. Não precisa instalar nada: é só conectar.

1. **No seu app de IA:** adicione um conector apontando para
   `https://mcp-magic.tcgagents.com/mcp`
   — ex.: Claude → Configurações → Conectores → Adicionar conector.
2. **No terminal:**
   ```bash
   claude mcp add --transport http magic-judge https://mcp-magic.tcgagents.com/mcp
   ```
3. **Pacote de skills (opcional, para o Claude):** baixe no
   [site](https://edivaldoluz.github.io/magic-judge/) e envie em
   Configurações → Skills — afia ainda mais o juiz.

Depois é só perguntar: *"Bloqueei com toque mortífero uma criatura com
atropelar — o que acontece?"*, *"Monta um Commander do Krenko bracket 2"*...

## O que o serviço oferece

| Ferramenta | O que faz |
|---|---|
| `buscar_regra` | Busca nas Comprehensive Rules oficiais (número da regra ou termo) |
| `info_brackets` | Guia dos brackets 1–5 do Commander + Game Changers |
| `buscar_carta` | Carta por nome (EN ou PT-BR) — texto oficial, legalidade, preço |
| `busca_avancada` | Busca avançada de cartas (cor, tipo, formato, preço...) |
| `rulings_carta` | Rulings oficiais de uma carta |
| `recomendacoes_comandante` | Sinergias e staples por comandante (com variante budget) |
| `verificar_game_changers` | Confere uma lista contra a lista viva de Game Changers |

## Para desenvolvedores

O serviço é um servidor MCP em NestJS — código em [`mcp-server/`](mcp-server/),
instruções de build e execução local no
[README do servidor](mcp-server/README.md).

Principais pastas:

```
magic-judge/
├── mcp-server/      # o serviço MCP (NestJS, Node 24) — Dockerfile incluso
├── skills/          # as 3 skills que orquestram o conector (distribuídas no site)
├── conhecimento/    # base oficial que o servidor consulta (Comprehensive Rules, brackets)
└── docs/            # site (GitHub Pages) + download das skills + traduções
```

O deploy roda em container (`docker-compose.yml` + `mcp-server/Dockerfile`),
publicado automaticamente a cada push na branch `main`.

## Atualizando as regras

A Wizards publica a Comprehensive Rules atualizada a cada coleção em
<https://magic.wizards.com/en/rules>. Baixe o `.txt` mais recente e substitua
`conhecimento/comprehensive-rules.txt`.

## Sugestões e melhorias

Abra uma [issue](https://github.com/edivaldoluz/magic-judge/issues).

## Fontes

- Comprehensive Rules © Wizards of the Coast — versão de 17/04/2026
- Manuais básicos oficiais em PT-BR (M14/M15) © Wizards of the Coast
- Dados de cartas: [Scryfall](https://scryfall.com) (API gratuita)
- Recomendações de decks: [EDHREC](https://edhrec.com)

Magic Judge é conteúdo de fã não-oficial, sob a
[Fan Content Policy](https://company.wizards.com/en/legal/fancontentpolicy)
da Wizards of the Coast. Magic: The Gathering © Wizards of the Coast.
