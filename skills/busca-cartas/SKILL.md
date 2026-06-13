---
name: busca-cartas
description: Busca cartas de Magic The Gathering — por nome (inglês ou português), cor, tipo, custo, formato, preço, texto. Use quando o usuário perguntar sobre uma carta específica, pedir sugestões de cartas, preços, legalidade em formatos, rulings oficiais ou qualquer busca de cards.
---

# Busca de cartas

Esta skill orquestra o **conector Magic Judge** (MCP), que consulta a Scryfall
server-side. Ela não faz requisições próprias (nada de `curl`) — use as
ferramentas do conector. **Pré-requisito:** o conector Magic Judge precisa
estar ligado (no claude.ai: Configurações → Conectores; no Claude Code:
`claude mcp add`). Se as ferramentas abaixo não existirem, avise que o conector
não está conectado.

## Princípio

**NUNCA afirme o que uma carta faz de memória** — o texto oficial muda com
erratas. Sempre confirme com `buscar_carta` antes de descrever uma carta.

## Ferramentas do conector

| Ferramenta | Quando usar | Entrada |
|---|---|---|
| `buscar_carta` | Uma carta específica pelo nome (EN ou PT, tolera erro de grafia) | `nome` |
| `busca_avancada` | Descobrir cartas por critérios (cor, tipo, formato, preço...) | `consulta` (sintaxe Scryfall), `ordem`, `max_resultados` |
| `rulings_carta` | Rulings oficiais de uma carta | `nome` |

- Nome em **português** funciona direto em `buscar_carta` e `rulings_carta`
  (ex: "Relâmpago"). Na resposta, use o nome oficial em inglês na primeira
  menção, com o nome em PT entre parênteses quando souber.
- `busca_avancada` espera a **consulta em inglês** na sintaxe Scryfall (abaixo).
  Por padrão ordena por `edhrec` (popularidade).

## Sintaxe de busca (campo `consulta` da `busca_avancada`)

| Filtro | Sintaxe | Exemplo |
|---|---|---|
| Cor | `c:` | `c:rg` (vermelho-verde), `c<=ub` (no máx. azul-preto) |
| Identidade de cor (Commander) | `id:` | `id<=esper` |
| Tipo | `t:` | `t:creature t:goblin` |
| Texto do oráculo | `o:` | `o:"draw a card"` |
| Valor de mana | `mv` | `mv<=2`, `mv=7` |
| Poder/resistência | `pow` / `tou` | `pow>=4 tou<=2` |
| Legalidade | `f:` ou `legal:` | `f:pauper`, `legal:commander` |
| Banida/restrita | `banned:` / `restricted:` | `banned:modern` |
| Preço (USD) | `usd` | `usd<=0.50` |
| Raridade | `r:` | `r:common`, `r<=uncommon` |
| Coleção | `s:` ou `e:` | `s:mh3` |
| É de um tipo especial | `is:` | `is:commander`, `is:gamechanger`, `is:fetchland` |
| Negação | `-` | `-t:land`, `-is:gamechanger` |
| OU lógico | `or` | `(c:r or c:w) t:instant` |

## Como apresentar os resultados

- Nome em inglês + nome em português (se conhecido) na primeira menção.
- Custo de mana, tipo, texto resumido em PT, poder/resistência.
- Preço em USD quando relevante (avise que é referência internacional;
  preços no Brasil variam — consultar Liga Magic/lojas locais).
- Legalidade apenas nos formatos que interessam à conversa.
- Em listas longas, apresente as 5–10 mais relevantes e diga quantas existem
  no total. Para puxar mais, aumente `max_resultados` (até 40).
