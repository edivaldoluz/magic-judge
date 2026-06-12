---
name: busca-cartas
description: Busca cartas de Magic The Gathering na API da Scryfall — por nome (inglês ou português), cor, tipo, custo, formato, preço, texto. Use quando o usuário perguntar sobre uma carta específica, pedir sugestões de cartas, preços, legalidade em formatos, rulings oficiais ou qualquer busca de cards.
---

# Busca de cartas — API Scryfall

A Scryfall (https://api.scryfall.com) é gratuita e não exige autenticação.

## Etiqueta obrigatória

- Sempre envie os headers: `-H "User-Agent: magic-judge-plugin/1.0" -H "Accept: application/json"`
- Máximo ~10 requisições/segundo. Em loops, aguarde ~100ms entre chamadas.
- Use `curl` via Bash (funciona em Windows, Mac e Linux).

## Endpoints principais

### Carta por nome (tolerante a erros de grafia — nome em INGLÊS)
```bash
curl -s --get "https://api.scryfall.com/cards/named" \
  --data-urlencode "fuzzy=lightning bolt" \
  -H "User-Agent: magic-judge-plugin/1.0" -H "Accept: application/json"
```

### Nome em PORTUGUÊS
O endpoint `named` só aceita inglês. Para nome em PT, use busca com `lang:pt`:
```bash
curl -s --get "https://api.scryfall.com/cards/search" \
  --data-urlencode "q=lang:pt \"Relâmpago\"" \
  --data-urlencode "include_multilingual=true" \
  -H "User-Agent: magic-judge-plugin/1.0" -H "Accept: application/json"
```
No resultado, `printed_name` é o nome em PT e `name` é o nome oficial em inglês —
use o nome em inglês para as buscas seguintes.

### Busca avançada
```bash
curl -s --get "https://api.scryfall.com/cards/search" \
  --data-urlencode "q=c:r t:instant mv<=2 f:pauper o:damage" \
  --data-urlencode "order=edhrec" \
  -H "User-Agent: magic-judge-plugin/1.0" -H "Accept: application/json"
```

### Rulings oficiais de uma carta
```bash
# 1º: buscar a carta e pegar o campo "id"; depois:
curl -s "https://api.scryfall.com/cards/<ID>/rulings" \
  -H "User-Agent: magic-judge-plugin/1.0" -H "Accept: application/json"
```

### Carta aleatória (com filtro opcional)
```bash
curl -s --get "https://api.scryfall.com/cards/random" --data-urlencode "q=t:legendary t:creature"
```

## Sintaxe de busca (parâmetro q)

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
| Preço | `usd` / `eur` | `usd<=0.50` |
| Raridade | `r:` | `r:common`, `r<=uncommon` |
| Coleção | `s:` ou `e:` | `s:mh3` |
| Idioma | `lang:` | `lang:pt` |
| É de um tipo especial | `is:` | `is:commander`, `is:fetchland` |
| Ordenação | `order=` (parâmetro) | `order=edhrec`, `order=usd` |
| Negação | `-` | `-t:land` |
| OU lógico | `or` | `(c:r or c:w) t:instant` |

## Campos úteis na resposta JSON

`name`, `printed_name` (se idioma ≠ en), `mana_cost`, `cmc`, `type_line`,
`oracle_text`, `power`, `toughness`, `colors`, `color_identity`,
`legalities` (objeto por formato: legal/not_legal/banned/restricted),
`prices.usd`, `prices.usd_foil`, `set_name`, `rarity`,
`image_uris.normal`, `scryfall_uri`, `id` (para rulings).

A resposta de `/cards/search` é paginada: `total_cards`, `has_more` e
`next_page`. Busque a próxima página apenas se necessário.

## Como apresentar os resultados

- Nome em inglês + nome em português (se conhecido) na primeira menção.
- Custo de mana, tipo, texto resumido em PT, poder/resistência.
- Preço em USD quando relevante (avise que é referência internacional;
  preços no Brasil variam — consultar Liga Magic/lojas locais).
- Legalidade apenas nos formatos que interessam à conversa.
- Em listas longas, apresente as 5–10 mais relevantes e diga quantas existem no total.
