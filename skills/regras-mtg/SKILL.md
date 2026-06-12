---
name: regras-mtg
description: Responde dúvidas de regras de Magic The Gathering citando as regras oficiais (Comprehensive Rules). Use sempre que o usuário perguntar sobre regras, interações entre cartas, palavras-chave (trample, deathtouch, etc.), prioridade, pilha, camadas, fases do turno, combate ou qualquer dúvida do tipo "o que acontece se...". Nunca responda regras de Magic apenas de memória — consulte sempre a base oficial.
---

# Regras de Magic: The Gathering

## Princípio fundamental

**NUNCA responda uma dúvida de regras apenas de memória.** Sempre confirme na
Comprehensive Rules oficial antes de responder e **cite o número da regra**
(ex: regra 702.19c) na resposta. Se a dúvida envolve uma carta específica,
consulte também os rulings oficiais dela na Scryfall (ver skill `busca-cartas`).

## Base de conhecimento

| Arquivo | Conteúdo | Idioma |
|---|---|---|
| `${CLAUDE_PLUGIN_ROOT}/conhecimento/comprehensive-rules.txt` | Regras completas oficiais (autoridade máxima) | Inglês |
| `${CLAUDE_PLUGIN_ROOT}/conhecimento/manual-basico-ptbr.txt` | Manual básico oficial — explicações didáticas | Português |
| `${CLAUDE_PLUGIN_ROOT}/conhecimento/guia-rapido-ptbr.txt` | Guia rápido para iniciantes | Português |

A versão e data de vigência da Comprehensive Rules estão nas primeiras linhas
do arquivo ("These rules are effective as of ...").

## Estrutura da Comprehensive Rules

As regras são numeradas por seção — use isso para direcionar a busca:

- **1xx** — Conceitos do jogo (cores, mana, zonas, vida, contadores)
- **2xx** — Partes de um card (custo, tipos, poder/resistência)
- **3xx** — Tipos de card (criatura, terreno, instantâneo, planeswalker...)
- **4xx** — Zonas (grimório, mão, campo de batalha, cemitério, pilha, exílio)
- **5xx** — Estrutura do turno (fases, etapas, combate)
- **6xx** — Mágicas, habilidades e efeitos (601 conjurar, 603 habilidades desencadeadas, 613 camadas/layers)
- **7xx** — Regras adicionais (**702 = TODAS as palavras-chave**, 704 ações baseadas em estado)
- **8xx** — Multiplayer
- **9xx** — Variantes casuais (903 = Commander)
- **Glossário** — no final do arquivo, ordem alfabética

## Como buscar

1. A Comprehensive Rules está em **inglês** — traduza o termo da pergunta antes
   de buscar (tabela abaixo).
2. Use Grep no arquivo com o termo em inglês ou o número da regra:
   - Palavra-chave de habilidade: `Grep "702\.\d+\. NomeDaHabilidade"` ou apenas o nome
   - Regra específica: `Grep "^603\.6"` (com contexto -A 5)
3. Leia a regra completa e as sub-regras (601.2a, 601.2b...) — a resposta
   geralmente está nos detalhes das sub-regras.
4. Para perguntas de iniciante, complemente com os manuais em português
   (explicação didática) mas a autoridade é sempre a Comprehensive Rules.

## Glossário PT-BR → EN (termos mais comuns)

| Português | Inglês | Português | Inglês |
|---|---|---|---|
| atropelar | trample | toque mortífero | deathtouch |
| ímpeto | haste | vínculo com a vida | lifelink |
| voar | flying | alcance | reach |
| vigilância | vigilance | defensor | defender |
| iniciativa | first strike | golpe duplo | double strike |
| lampejo | flash | ameaçar | menace |
| indestrutível | indestructible | resistência a magia | hexproof |
| proteção contra | protection from | rompante | prowess |
| sobrecarregar | overload | regenerar | regenerate |
| anular (mágica) | counter (a spell) | marcador | counter (on object) |
| ficha | token | virar / desvirar | tap / untap |
| comprar card | draw | descartar | discard |
| sacrificar | sacrifice | exilar | exile |
| terreno | land | criatura | creature |
| feitiço | sorcery | mágica instantânea | instant |
| encantamento | enchantment | artefato | artifact |
| campo de batalha | battlefield | cemitério | graveyard |
| grimório | library | mão | hand |
| pilha | stack | exílio | exile |
| poder / resistência | power / toughness | valor de mana | mana value |
| custo de mana | mana cost | dano de combate | combat damage |
| habilidade desencadeada | triggered ability | habilidade ativada | activated ability |
| camadas | layers | prioridade | priority |
| ações baseadas em estado | state-based actions | etapa | step |

## Formato da resposta

1. **Resposta direta** em português, logo na primeira frase.
2. **Explicação** do porquê, em linguagem acessível.
3. **Citação da regra**: número + tradução/resumo do trecho relevante
   (ex: *"Regra 702.2c: deathtouch faz qualquer quantidade de dano ser
   considerada letal"*).
4. Se houver rulings da carta na Scryfall que esclarecem o caso, cite-os.
5. Se a interação for ambígua ou depender de timing, monte o passo a passo
   da pilha (o que resolve primeiro, quem tem prioridade).
