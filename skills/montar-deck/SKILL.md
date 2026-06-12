---
name: montar-deck
description: Ajuda a montar, analisar e melhorar decks de Magic The Gathering — curva de mana, base de terrenos, sinergias, legalidade por formato, orçamento, brackets de Commander (1-5, Game Changers) e exportação da lista. Use quando o usuário pedir para montar um deck, avaliar uma lista, classificar o bracket/nível de poder de um deck, sugerir melhorias ou adaptar um deck a um formato/orçamento/bracket.
---

# Montagem e análise de decks

## Antes de começar, confirme com o usuário

1. **Formato** (Commander, Standard, Modern, Pioneer, Pauper, Legacy, casual...)
2. **Se for Commander: o bracket alvo (1–5)** — ver
   `${CLAUDE_PLUGIN_ROOT}/conhecimento/commander-brackets.md`. Se o usuário
   não souber, pergunte como é a mesa dele (casual de precon? otimizada?) e
   sugira o bracket adequado.
3. **Arquétipo/tema** desejado (aggro, controle, tribal, combo, comandante específico...)
4. **Orçamento** (se houver)
5. **Cartas que já possui** (se quiser aproveitar a coleção)

Se o usuário já deu essas informações, não pergunte de novo.

## Regras de construção por formato

| Formato | Tamanho | Cópias máx. | Particularidades |
|---|---|---|---|
| Standard / Pioneer / Modern / Legacy / Vintage | mín. 60 | 4 | Sideboard de até 15 |
| Pauper | mín. 60 | 4 | Só comuns; sideboard 15 |
| Commander (EDH) | exatamente 100 | 1 (singleton) | 1 comandante lendário; identidade de cor obrigatória; 40 de vida |
| Brawl | exatamente 60 | 1 | Cartas de Standard; 1 comandante |
| Limitado (draft/selado) | mín. 40 | sem limite | ~17 mágicas + 17-18 terrenos |

Terrenos básicos são sempre ilimitados (exceto restrições de identidade de cor).

## Esqueleto recomendado

### Deck de 60 cartas
- **Aggro:** 20–22 terrenos, curva concentrada em 1–3 de mana, 28+ criaturas
- **Midrange:** 23–24 terrenos, curva 2–5
- **Controle:** 25–27 terrenos, remoções + contramágicas + poucos finalizadores

### Commander (100 cartas) — proporções de referência
- 36–38 terrenos
- 10–12 ramp (aceleração de mana, idealmente até 2–3 de mana)
- 10+ fontes de compra de cards
- 8–10 remoções pontuais + 3–5 remoções em massa
- 25–30 cartas do plano de jogo/sinergia do comandante
- 2–4 formas claras de fechar o jogo

## Brackets do Commander (obrigatório em decks de Commander)

Leia `${CLAUDE_PLUGIN_ROOT}/conhecimento/commander-brackets.md` antes de montar
ou analisar qualquer deck de Commander. Pontos inegociáveis:

- **Respeite as restrições do bracket alvo**: Game Changers (0 em B1–B2, até 3
  em B3), combos infinitos de 2 cartas, mass land denial, turnos extras.
- **Valide Game Changers ao vivo na Scryfall** (`is:gamechanger`) — a lista
  muda; nunca confie na memória. Para brackets 1–2, filtre sugestões com
  `-is:gamechanger`.
- **Ao entregar o deck, informe o bracket resultante** e o que o faria subir
  ou descer (ex: "trocar X por Y desce para Bracket 2").
- Ao **analisar** um deck existente, classifique o bracket dele no menor
  nível cujos critérios cumpre.

## EDHREC — recomendações por comandante (Commander)

O EDHREC agrega dezenas de milhares de decklists reais. Use-o como ponto de
partida para descobrir as cartas mais jogadas e mais sinérgicas com um
comandante. Endpoints JSON (sem autenticação):

```bash
# Página do comandante (slug: nome em minúsculas, sem pontuação, espaços viram hífens)
# Ex.: "Krenko, Mob Boss" -> krenko-mob-boss
curl -s "https://json.edhrec.com/pages/commanders/krenko-mob-boss.json" \
  -H "User-Agent: magic-judge-plugin/1.0"

# Variante econômica do mesmo comandante
curl -s "https://json.edhrec.com/pages/commanders/krenko-mob-boss/budget.json" ...

# Deck médio (lista média agregada)
curl -s "https://json.edhrec.com/pages/average-decks/krenko-mob-boss.json" ...
```

Campos úteis na resposta:
- Raiz: `avg_price`, contagens por tipo (`creature`, `land`...), `similar`
  (comandantes parecidos), `num_decks_avg` (popularidade)
- `container.json_dict.cardlists[]` — listas por categoria, cada uma com
  `header` ("High Synergy Cards", "Top Cards", "Game Changers", "Creatures",
  "Instants"...) e `cardviews[]` contendo:
  - `name` — nome da carta
  - `synergy` — taxa de sinergia com ESTE comandante (0.30 = aparece 30 p.p.
    mais em decks dele do que na média geral; é o melhor sinal de sinergia)
  - `num_decks` / `potential_decks` — em quantos decks aparece

Como usar bem:
- **High Synergy Cards** = identidade do deck; **Top Cards** = staples do
  comandante. Combine os dois com o tema pedido pelo usuário.
- EDHREC indica POPULARIDADE, não adequação ao bracket/orçamento — valide
  cada carta na Scryfall (legalidade, `is:gamechanger`, preço) antes de
  incluir.
- É API não-oficial da comunidade: se o endpoint falhar, siga só com a
  Scryfall (`order=edhrec` na busca já ordena por popularidade).

## Fluxo de trabalho

1. **Valide a legalidade** de cada carta sugerida na Scryfall
   (`f:<formato>` na busca, ou campo `legalities` da carta) — nunca confie
   na memória, banlists mudam. Em Commander, valide também a identidade
   de cor com `id<=<cores do comandante>`.
2. **Descubra cartas candidatas**: em Commander, comece pelo EDHREC (seção
   acima — High Synergy + Top Cards do comandante); nos demais formatos (ou
   se o EDHREC falhar), use a Scryfall com `order=edhrec` para staples.
3. **Orçamento:** filtre com `usd<=X` na busca. Avise que preços são em USD
   (referência) e variam no Brasil.
4. **Cheque a curva de mana** ao final: conte cartas por valor de mana e
   ajuste — a maioria dos decks quer o pico em 2–3 de mana.
5. **Aponte as sinergias**: explique POR QUE cada pacote de cartas está no
   deck (2–3 linhas por pacote, não carta a carta).

## Formato de entrega da lista

Sempre exportar em formato de texto padrão (importável em Moxfield, Archidekt, Liga Magic):

```
1 Krenko, Mob Boss
35 Mountain
1 Sol Ring
1 Goblin Chieftain
...
```

(quantidade + nome oficial em inglês, um por linha; em decks de 60,
sideboard separado após uma linha em branco com o título `Sideboard:`)

Junto com a lista, apresente:
- Distribuição da curva de mana (contagem por custo)
- Resumo do plano de jogo (como o deck vence)
- Custo total estimado (se orçamento foi mencionado)
- 3–5 sugestões de upgrade futuro (opcional)
