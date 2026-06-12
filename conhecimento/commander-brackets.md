# Sistema de Brackets do Commander (Commander Brackets)

Sistema oficial da Wizards of the Coast para classificar o nível de poder de
decks de Commander e alinhar expectativas da mesa antes do jogo. Um deck é
classificado no **menor bracket cujos critérios ele cumpre**.

## Os 5 brackets

| # | Nome | Perfil | Jogo costuma decidir |
|---|------|--------|----------------------|
| 1 | **Exhibition** (Exibição) | Ultra-casual, temático, vitória não é prioridade | turno 9+ |
| 2 | **Core** (Essencial) | Nível de precon — o deck mostra seu plano com clareza | turno 8+ |
| 3 | **Upgraded** (Aprimorado) | Acima da média, cartas bem curadas, mais rápido que precon | turno 6+ |
| 4 | **Optimized** (Otimizado) | Forte e eficiente, sem restrições além da banlist | turno 4+ |
| 5 | **cEDH** | Competitivo, focado no meta, vencer acima de tudo | qualquer turno |

## Restrições por bracket

| Critério | B1 | B2 | B3 | B4 | B5 |
|---|---|---|---|---|---|
| Game Changers | ❌ nenhum | ❌ nenhum | ⚠️ até 3 | ✅ livre | ✅ livre |
| Combo infinito de 2 cartas | ❌ | ❌ | ⚠️ só a partir do turno 6 (não cedo) | ✅ | ✅ |
| Negação de terrenos em massa (mass land denial) | ❌ | ❌ | ❌ | ✅ | ✅ |
| Turnos extras | ❌ | ⚠️ pontuais, sem encadear | ⚠️ sem encadear | ✅ | ✅ |
| Tutores | poucos/nenhum | poucos | moderado | ✅ | ✅ |

**Regra-chave:** incluir UM único Game Changer já coloca o deck no Bracket 3
ou superior.

## Game Changers — lista SEMPRE via Scryfall (nunca de memória)

A lista de Game Changers é mantida pela Wizards e **muda com o tempo**.
A Scryfall marca essas cartas — consulte a lista atual ao vivo:

```bash
curl -s --get "https://api.scryfall.com/cards/search" \
  --data-urlencode "q=is:gamechanger" --data-urlencode "order=name" \
  -H "User-Agent: magic-judge-plugin/1.0" -H "Accept: application/json"
```

Para verificar se UMA carta específica é Game Changer, adicione o nome:
`q=is:gamechanger !"Rhystic Study"` (resultado vazio = não é Game Changer).

Para sugerir cartas que NÃO sejam Game Changers (brackets 1–2):
adicione `-is:gamechanger` à busca.

### Snapshot da lista (53 cartas em 12/06/2026 — conferir na Scryfall antes de afirmar)

**Criaturas:** Braids, Cabal Minion · Consecrated Sphinx · Drannith Magistrate ·
Grand Arbiter Augustin IV · Notion Thief · Opposition Agent · Orcish Bowmasters ·
Seedborn Muse · Tergrid, God of Fright · Thassa's Oracle

**Planeswalker:** Narset, Parter of Veils

**Instantâneas:** Ad Nauseam · Crop Rotation · Cyclonic Rift · Enlightened Tutor ·
Fierce Guardianship · Force of Will · Gifts Ungiven · Intuition · Mystical Tutor ·
Teferi's Protection · Vampiric Tutor · Worldly Tutor

**Feitiços:** Biorhythm · Coalition Victory · Demonic Tutor · Farewell · Gamble ·
Imperial Seal · Jeska's Will · Natural Order

**Encantamentos:** Aura Shards · Humility · Necropotence · Rhystic Study ·
Smothering Tithe · Survival of the Fittest · Underworld Breach

**Artefatos:** Bolas's Citadel · Chrome Mox · Grim Monolith · Lion's Eye Diamond ·
Mana Vault · Mox Diamond · Panoptic Mirror · The One Ring

**Terrenos:** Ancient Tomb · Field of the Dead · Gaea's Cradle · Glacial Chasm ·
Mishra's Workshop · Serra's Sanctum · The Tabernacle at Pendrell Vale

Observação: **Sol Ring NÃO é Game Changer.** Esta lista é um snapshot — a
fonte de verdade é sempre a busca `is:gamechanger` na Scryfall.

## Como classificar um deck

1. Listar Game Changers presentes (validar via Scryfall, não de memória)
2. Identificar combos infinitos de 2 cartas e em que turno ficam ativos
3. Verificar mass land denial (Armageddon, Winter Orb etc.) e turnos extras encadeáveis
4. Avaliar densidade de tutores e velocidade média de fechamento
5. O bracket é o MENOR que comporta tudo isso

## Rule 0

Os brackets são um **guia de conversa, não regra rígida**. A "Rule 0" — a
conversa antes do jogo — continua valendo: a mesa pode ajustar o que quiser
de comum acordo. Ao montar um deck, sempre informe o bracket resultante e o
que o levaria a subir ou descer de bracket.

---
*Fontes: sistema oficial de brackets da Wizards of the Coast;
resumo baseado em https://draftsim.com/mtg-commander-power-bracket/ ;
lista de Game Changers ao vivo via Scryfall (`is:gamechanger`).*
