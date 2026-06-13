# magic-judge-mcp

Servidor MCP (Model Context Protocol) do Magic Judge em **NestJS**. Expõe as
capacidades do projeto como ferramentas que qualquer cliente MCP consome —
Claude (app e web), ChatGPT, Cursor, VS Code e afins.

Em produção: **`https://mcp-magic.tcgagents.com/mcp`**

## Ferramentas

| Ferramenta | O que faz |
|---|---|
| `buscar_regra` | Busca nas Comprehensive Rules oficiais (número da regra ou termo em inglês) |
| `info_brackets` | Guia completo dos brackets 1–5 do Commander + Game Changers |
| `buscar_carta` | Carta por nome (EN ou PT-BR) — texto oficial, legalidade, preço |
| `busca_avancada` | Busca com a sintaxe da Scryfall (cor, tipo, formato, preço...) |
| `rulings_carta` | Rulings oficiais de uma carta |
| `recomendacoes_comandante` | Sinergias e staples do EDHREC por comandante (com variante budget) |
| `verificar_game_changers` | Confere uma lista contra a lista viva de Game Changers |

A base de regras é lida de `../conhecimento/` (configurável via env
`CONHECIMENTO_DIR`).

## Rodando

Requer **Node 24** (`.nvmrc` incluso — `nvm use` resolve).

```bash
npm install
npm run build
npm start           # porta 3333 (env PORT para mudar)
```

Endpoint MCP (Streamable HTTP): `http://localhost:3333/mcp`

## Teste rápido

```bash
curl -s -X POST http://localhost:3333/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"buscar_regra","arguments":{"termo":"702.2"}}}'
```

## Conectando

Em qualquer cliente MCP, adicione um conector apontando para a URL pública
(`https://mcp-magic.tcgagents.com/mcp`) ou para a instância local
(`http://localhost:3333/mcp`):

```bash
claude mcp add --transport http magic-judge https://mcp-magic.tcgagents.com/mcp
```

No app/web do Claude: Configurações → Conectores → Adicionar conector.

## Deploy

Containerizado via `mcp-server/Dockerfile` (build multi-stage, Node 24) e
orquestrado pelo `docker-compose.yml` na raiz do repositório. O serviço é
publicado automaticamente a cada push na branch `main`. A base de regras é
embarcada na imagem a partir de `conhecimento/`.
