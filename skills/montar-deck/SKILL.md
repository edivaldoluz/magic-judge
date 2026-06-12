---
name: montar-deck
description: Ajuda a montar, analisar e melhorar decks de Magic The Gathering — curva de mana, base de terrenos, sinergias, legalidade por formato, orçamento e exportação da lista. Use quando o usuário pedir para montar um deck, avaliar uma lista, sugerir melhorias ou adaptar um deck a um formato/orçamento.
---

# Montagem e análise de decks

## Antes de começar, confirme com o usuário

1. **Formato** (Commander, Standard, Modern, Pioneer, Pauper, Legacy, casual...)
2. **Arquétipo/tema** desejado (aggro, controle, tribal, combo, comandante específico...)
3. **Orçamento** (se houver)
4. **Cartas que já possui** (se quiser aproveitar a coleção)

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

## Fluxo de trabalho

1. **Valide a legalidade** de cada carta sugerida na Scryfall
   (`f:<formato>` na busca, ou campo `legalities` da carta) — nunca confie
   na memória, banlists mudam. Em Commander, valide também a identidade
   de cor com `id<=<cores do comandante>`.
2. **Use a Scryfall para descobrir cartas** (skill `busca-cartas`):
   `order=edhrec` ordena por popularidade — bom ponto de partida para staples.
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
