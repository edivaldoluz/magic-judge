---
name: regras-mtg
description: Responde dúvidas de regras de Magic The Gathering citando as regras oficiais (Comprehensive Rules). Use sempre que o usuário perguntar sobre regras, interações entre cartas, palavras-chave (trample, deathtouch, etc.), prioridade, pilha, camadas, fases do turno, combate ou qualquer dúvida do tipo "o que acontece se...". Nunca responda regras de Magic apenas de memória — consulte sempre o conector Magic Judge.
---

# Regras de Magic: The Gathering

Esta skill orquestra o **conector Magic Judge** (MCP). Ela não lê arquivos
locais nem faz requisições próprias — todo o conhecimento vem das ferramentas
do conector. **Pré-requisito:** o conector Magic Judge precisa estar ligado
(no claude.ai: Configurações → Conectores; no Claude Code: `claude mcp add`).
Se as ferramentas abaixo não existirem, avise o usuário que o conector não
está conectado.

## Princípio fundamental

**NUNCA responda uma dúvida de regras apenas de memória.** Sempre confirme com
a ferramenta `buscar_regra` antes de responder e **cite o número da regra**
(ex: regra 702.19c) na resposta. Se a dúvida envolve uma carta específica,
confirme o texto oficial com `buscar_carta` e consulte `rulings_carta`.

## Ferramentas do conector que esta skill usa

| Ferramenta | Para quê |
|---|---|
| `buscar_regra` | Busca nas Comprehensive Rules. Aceita número (`702.19`) ou termo em inglês (`trample assign lethal`). |
| `buscar_carta` | Texto oficial (oracle), tipo, legalidade e preço de uma carta. |
| `rulings_carta` | Rulings oficiais (decisões de juiz) de uma carta. |

## Como buscar — da dúvida à regra

O usuário **nunca** vai informar número de regra — ele pergunta em linguagem
natural ("posso responder com contramágica depois que ele pagou o mana?").
**Identificar a regra certa é trabalho seu.** Fluxo:

1. **Extraia os conceitos da dúvida.** Que mecânicas estão envolvidas?
   (ex: "bloqueei com deathtouch e ele tem trample" → dano de combate,
   dano letal, atribuição de dano, deathtouch, trample)
2. **Traduza os conceitos para inglês** (tabela abaixo) — as Comprehensive
   Rules são em inglês, então `buscar_regra` espera termos em inglês.
3. **Mire a seção certa** pelo mapa abaixo: palavra-chave de habilidade → 702;
   combate → 5xx; conjurar/responder → 601/117; "morreu/destruído quando" →
   704. Em dúvida, busque o termo direto (o conector também acha pelo glossário).
4. **Chame `buscar_regra` com mais de um termo candidato** se o primeiro não
   resolver — sinônimos, forma verbal diferente, ou o número da regra que
   apareceu num resultado anterior para puxar todas as sub-regras.
5. **Leia a regra e TODAS as sub-regras** (702.2a, 702.2b...) — a resposta
   quase sempre está no detalhe de uma sub-regra.
6. **Se a dúvida envolve carta específica**, chame `buscar_carta` para o texto
   exato e `rulings_carta` para os rulings — a interação pode depender disso.

## Estrutura da Comprehensive Rules (para escolher o termo/numero de busca)

- **1xx** — Conceitos do jogo (cores, mana, zonas, vida, contadores)
- **2xx** — Partes de um card (custo, tipos, poder/resistência)
- **3xx** — Tipos de card (criatura, terreno, instantâneo, planeswalker...)
- **4xx** — Zonas (grimório, mão, campo de batalha, cemitério, pilha, exílio)
- **5xx** — Estrutura do turno (fases, etapas, combate)
- **6xx** — Mágicas, habilidades e efeitos (601 conjurar, 603 desencadeadas, 613 camadas)
- **7xx** — Regras adicionais (**702 = TODAS as palavras-chave**, 704 ações baseadas em estado)
- **8xx** — Multiplayer
- **9xx** — Variantes casuais (903 = Commander)

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
4. Se houver rulings da carta (via `rulings_carta`) que esclarecem o caso, cite-os.
5. Se a interação depender de timing, monte o passo a passo da pilha
   (o que resolve primeiro, quem tem prioridade).
