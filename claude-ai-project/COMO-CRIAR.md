# Como criar o projeto "Magic Judge" no claude.ai (para usar no iPhone)

Leva ~5 minutos. Mais fácil pelo site no computador; depois aparece
automaticamente no app do celular.

## Passos

1. Acesse <https://claude.ai> → **Projects** → **New project**
2. Nome: `Magic Judge` (ícone/descrição à vontade)
3. Em **Instructions** (instruções do projeto), cole o conteúdo de
   [INSTRUCOES-DO-PROJETO.md](INSTRUCOES-DO-PROJETO.md) (tudo abaixo da linha `---`)
4. Em **Knowledge** (conhecimento), anexe estes arquivos da pasta `conhecimento/`:
   - `comprehensive-rules.txt` — regras oficiais completas
   - `commander-brackets.md` — brackets 1–5 + Game Changers
   - `manual-basico-ptbr.txt` — manual básico em português
   - `guia-rapido-ptbr.txt` — guia rápido em português
5. Pronto. No iPhone: abrir o app do Claude → aba **Projects** → **Magic Judge** →
   perguntar por texto ou voz.

## O que muda em relação ao plugin do Claude Code

| | Plugin (PC / aba Code) | Project (chat do celular) |
|---|---|---|
| Regras citadas da base oficial | ✅ | ✅ |
| Brackets e metodologia de deck | ✅ | ✅ |
| Scryfall | API direta (precisa, rápida) | busca web (boa, menos precisa) |
| EDHREC | API JSON | busca web |
| Voz | ❌ | ✅ |

## Manutenção

Quando a base do repositório for atualizada (novas regras, novos PDFs),
reenvie os arquivos alterados no Knowledge do projeto.
