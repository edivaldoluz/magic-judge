# magic-judge 🧙‍♂️

Plugin do [Claude Code](https://claude.com/claude-code) que transforma o Claude em um
assistente completo de **Magic: The Gathering**:

- ⚖️ **Tira-dúvidas de regras** — responde citando a regra oficial (Comprehensive Rules)
- 🔍 **Busca de cartas** — integração com a [API da Scryfall](https://scryfall.com/docs/api) (preços, legalidade, rulings, busca avançada)
- 🃏 **Montagem de decks** — curva de mana, sinergias, legalidade, orçamento, lista exportável
- 📚 **Base de conhecimento local** — regras oficiais + manuais em português

## Instalação (qualquer máquina com Claude Code)

```bash
git clone https://github.com/edivaldoluz/magic-judge.git
claude
```

Dentro do Claude Code:

```
/plugin marketplace add edivaldoluz/magic-judge
/plugin install magic-judge@edi-magic
```

(Quem abrir o Claude Code dentro da pasta clonada já recebe o plugin
automaticamente via `.claude/settings.json` — inclusive em sessões na nuvem
pela aba Code do app.)

Pronto. Funciona em Windows, Mac e Linux — só precisa do Claude Code logado.

## Como usar

Converse naturalmente em qualquer sessão:

- *"Se eu bloquear uma criatura com trample usando uma com deathtouch, o que acontece?"*
- *"Busca remoções pretas até 2 de mana legais em Pauper"*
- *"Quanto custa um Sol Ring? É legal em Modern?"*
- *"Monta um deck Commander do Krenko com orçamento de 50 dólares"*
- *"Analisa essa lista e melhora a curva de mana: ..."*

Para interações complexas de regras, peça o agente juiz: *"usa o juiz-mtg pra resolver isso"*.

## Estrutura

```
magic-judge/
├── .claude-plugin/
│   ├── plugin.json          # manifesto do plugin
│   └── marketplace.json     # permite instalar via /plugin
├── agents/
│   └── juiz-mtg.md          # agente juiz para interações complexas
├── skills/
│   ├── regras-mtg/          # como buscar e citar regras oficiais
│   ├── busca-cartas/        # API Scryfall e sintaxe de busca
│   └── montar-deck/         # metodologia de deckbuilding
├── conhecimento/
│   ├── comprehensive-rules.txt   # regras oficiais completas (EN)
│   ├── commander-brackets.md     # brackets 1-5 do Commander + Game Changers
│   ├── manual-basico-ptbr.txt    # manual básico oficial (PT-BR)
│   └── guia-rapido-ptbr.txt      # guia rápido para iniciantes (PT-BR)
├── mcp-server/                   # servidor MCP em NestJS (conector p/ app do Claude)
├── claude-ai-project/            # kit para criar o Project no claude.ai (mobile)
└── docs/                         # prompt da landing page e materiais
```

## Atualizando as regras

A Wizards publica a Comprehensive Rules atualizada a cada coleção em
<https://magic.wizards.com/en/rules>. Para atualizar, baixe o arquivo `.txt`
mais recente e substitua `conhecimento/comprehensive-rules.txt`.

## Adicionando mais material (PDFs, guias)

1. Converta o PDF para texto (ex.: `pdftotext arquivo.pdf arquivo.txt`)
2. Coloque o `.txt`/`.md` em `conhecimento/`
3. Adicione uma linha na tabela "Base de conhecimento" em `skills/regras-mtg/SKILL.md`
   para o agente saber que o arquivo existe

## Fontes

- Comprehensive Rules © Wizards of the Coast — versão de 17/04/2026
- Manuais básicos oficiais em PT-BR (M14/M15) © Wizards of the Coast
- Dados de cartas: [Scryfall](https://scryfall.com) (API gratuita)

Material não-oficial de fã, sob a [Fan Content Policy](https://company.wizards.com/en/legal/fancontentpolicy) da Wizards of the Coast.
