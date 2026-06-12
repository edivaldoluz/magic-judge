# Prompt para gerar a landing page do Magic Judge

> Substitua os `[COLCHETES]` antes de enviar: URL do repositório, link do
> conector MCP (quando existir), chave PIX, links de doação e email.

---

Crie uma landing page one-page, em português do Brasil, para um projeto open
source chamado "Magic Judge" — um assistente de IA especialista em Magic: The
Gathering que funciona dentro do Claude (Claude Code e app do Claude).

## O que o projeto faz (use isso na hero e na seção de features)
- ⚖️ Tira dúvidas de regras citando a regra oficial pelo número (base local com
  as Comprehensive Rules sempre atualizadas — nunca responde "de memória")
- 🧑‍⚖️ Veredito de juiz passo a passo para interações complexas entre cartas
  (ordem da pilha, prioridade, estado final)
- 🔍 Busca de cartas ao vivo na API da Scryfall: nome em inglês ou português,
  legalidade por formato, preços, rulings oficiais
- 🃏 Montagem e análise de decks: curva de mana, sinergias via EDHREC,
  brackets do Commander (1–5) e Game Changers validados ao vivo
- 📚 Base de conhecimento em português para iniciantes

## Seção "Veja funcionando" (exemplo real, em destaque tipo card/quote)
Pergunta: "Bloqueei um Colossal Dreadmaw (6/6, atropelar) com um Typhoid Rats
(1/1, toque mortífero). O que acontece?"
Resposta: "⚖️ Veredito: o oponente leva 5 de dano e as duas criaturas morrem.
O Dreadmaw só precisa atribuir 1 de dano letal ao bloqueador (regra 702.19,
Trample) — os 5 restantes atropelam. O Rats destrói o Dreadmaw com 1 de dano
de toque mortífero (regras 702.2b e 704.5h)."

## Seção "Como usar" — 3 cards, um por perfil:
1. "No Claude Code (PC)" — clone e instale em 2 comandos:
   git clone [URL-DO-REPO]
   /plugin marketplace add ./magic-judge
   /plugin install magic-judge@edi-magic
2. "No app do Claude (celular)" — adicione o Conector MCP com o link
   [URL-DO-CONECTOR] nas configurações do claude.ai e baixe o pacote de
   skills recomendado para a experiência completa. (marcar como "em breve"
   se não houver link ainda)
3. "Requisitos" — conta do Claude (a IA roda na assinatura de cada usuário;
   o projeto em si é gratuito e open source)

## Seção "Apoie o projeto" (doações)
- PIX: [CHAVE-PIX] (com botão de copiar)
- GitHub Sponsors / Ko-fi: [LINKS]
- Texto curto: projeto gratuito e de código aberto, doações mantêm o servidor
  e a base de regras atualizada a cada coleção

## Seção "Sugestões e melhorias"
- Convite para abrir issue no GitHub: [URL-DO-REPO]/issues
- Email de contato: [SEU-EMAIL]
- Mini-roadmap público (lista com checkbox): ✅ Plugin Claude Code •
  ✅ Brackets do Commander + EDHREC • 🔜 Servidor MCP (NestJS) e conector
  público • 🔜 Pacote de skills para o app • 💡 Em estudo: bot de Telegram

## Rodapé obrigatório
"Magic Judge é conteúdo de fã não-oficial, sob a Fan Content Policy da
Wizards of the Coast. Magic: The Gathering © Wizards of the Coast. Dados de
cartas por Scryfall. Recomendações de decks por EDHREC."

## Direção de arte
- Tema dark fantasy elegante (fundo escuro tipo mesa de jogo/pergaminho
  envelhecido), sem parecer site de cassino
- Use as cinco cores de mana do Magic como acentos: branco #F8F6D8,
  azul #0E68AB, preto #A69F9D, vermelho #D3202A, verde #00733E — por exemplo,
  uma linha/borda com as 5 cores, ícones das seções alternando as cores
- Tipografia: serifada imponente nos títulos (clima de fantasia), sans-serif
  limpa no corpo
- Responsiva (mobile first — o público vai abrir no celular na mesa de jogo)
- Single-file HTML/CSS/JS, sem dependências externas além de Google Fonts
- Microinterações sutis: hover nos cards, botão de copiar comandos/PIX
