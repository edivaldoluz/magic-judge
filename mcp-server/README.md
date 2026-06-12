# magic-judge-mcp

Servidor MCP (Model Context Protocol) do Magic Judge em **NestJS**. Expõe as
capacidades do projeto como ferramentas que qualquer cliente MCP consome —
incluindo o **conector do claude.ai** (app do celular) e o Claude Code.

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

**Claude Code (local):** adicione ao `.mcp.json` do projeto ou via
`claude mcp add --transport http magic-judge http://localhost:3333/mcp`.

**Conector no claude.ai (app do celular):** publique o servidor numa URL
HTTPS pública e adicione em Configurações → Conectores. *(Fase de deploy/CI-CD
no servidor próprio — pendente.)*

## Próximos passos (roadmap)

- [ ] Deploy no servidor próprio com CI/CD (GitHub Actions)
- [ ] HTTPS público + URL do conector divulgada no site
- [ ] Autenticação opcional (se necessário limitar uso)
