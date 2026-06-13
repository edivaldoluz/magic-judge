---
name: montar-deck
description: Ajuda a montar, analisar e melhorar decks de Magic The Gathering — curva de mana, base de terrenos, sinergias, legalidade por formato, orçamento, brackets de Commander (1-5, Game Changers) e exportação da lista. Use quando o usuário pedir para montar um deck, avaliar uma lista, classificar o bracket/nível de poder de um deck, sugerir melhorias ou adaptar um deck a um formato/orçamento/bracket.
---

# Montagem e análise de decks

Esta skill orquestra o **conector Magic Judge** (MCP) — ele consulta Scryfall,
EDHREC e a lista de Game Changers server-side. Ela não lê arquivos locais nem
faz requisições próprias (nada de `curl`). **Pré-requisito:** o conector
Magic Judge precisa estar ligado (no claude.ai: Configurações → Conectores;
no Claude Code: `claude mcp add`). Se as ferramentas abaixo não existirem,
avise que o conector não está conectado.

## Ferramentas do conector

| Ferramenta | Para quê | Entrada |
|---|---|---|
| `info_brackets` | Guia dos brackets 1–5 do Commander + lista de Game Changers | — |
| `recomendacoes_comandante` | Sinergias e staples de um comandante (EDHREC) | `comandante`, `orcamento` |
| `busca_avancada` | Descobrir cartas por critério (formato, cor, preço...) | `consulta`, `ordem`, `max_resultados` |
| `verificar_game_changers` | Quais cartas de uma lista são Game Changers | `cartas[]` |
| `buscar_carta` | Confirmar texto/legalidade/preço de uma carta | `nome` |

## Antes de começar, confirme com o usuário

1. **Formato** (Commander, Standard, Modern, Pioneer, Pauper, Legacy, casual...)
2. **Se for Commander: o bracket alvo (1–5)** — chame `info_brackets` para o
   guia. Se o usuário não souber, pergunte como é a mesa dele (casual de
   precon? otimizada?) e sugira o bracket adequado.
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

Chame `info_brackets` antes de montar ou analisar qualquer deck de Commander.
Pontos inegociáveis:

- **Respeite as restrições do bracket alvo**: Game Changers (0 em B1–B2, até 3
  em B3), combos infinitos de 2 cartas, mass land denial, turnos extras.
- **Valide Game Changers ao vivo**: passe a lista final por
  `verificar_game_changers` (a lista muda; nunca confie na memória). Para
  brackets 1–2, filtre as sugestões com `-is:gamechanger` na `busca_avancada`.
- **Ao entregar o deck, informe o bracket resultante** e o que o faria subir
  ou descer (ex: "trocar X por Y desce para Bracket 2").
- Ao **analisar** um deck existente, classifique-o no menor nível cujos
  critérios cumpre (confirme os Game Changers da lista com `verificar_game_changers`).

## EDHREC — recomendações por comandante (Commander)

Use `recomendacoes_comandante` (passe o nome oficial do comandante em inglês;
`orcamento: true` para a versão econômica) como ponto de partida — ele agrega
dezenas de milhares de decks reais e devolve as cartas de maior sinergia e as
mais jogadas.

Como usar bem:
- **High Synergy Cards** = identidade do deck; **Top Cards** = staples do
  comandante. Combine os dois com o tema pedido pelo usuário.
- EDHREC indica POPULARIDADE, não adequação ao bracket/orçamento — valide
  cada carta com `busca_avancada`/`buscar_carta` (legalidade, `is:gamechanger`,
  preço) antes de incluir.

## Fluxo de trabalho

1. **Valide a legalidade** de cada carta sugerida com `busca_avancada`
   (`f:<formato>` na consulta) ou `buscar_carta` (campo de legalidade) — nunca
   confie na memória, banlists mudam. Em Commander, valide também a identidade
   de cor com `id<=<cores do comandante>`.
2. **Descubra cartas candidatas**: em Commander, comece por
   `recomendacoes_comandante` (High Synergy + Top Cards); nos demais formatos,
   use `busca_avancada` com `ordem: edhrec` para staples.
3. **Orçamento:** filtre com `usd<=X` na consulta. Avise que preços são em USD
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
- Em Commander: o bracket resultante (validado com `verificar_game_changers`)
- 3–5 sugestões de upgrade futuro (opcional)
