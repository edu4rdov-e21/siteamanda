# Amanda: Rumo ao Diploma de Medicina

Jogo de plataforma 2D estilo Super Mario World — versão turbinada. Tudo HTML5 + CSS + JS puro com Canvas 2D e Web Audio API. Zero dependências.

Amanda atravessa **biblioteca → laboratório → hospital → cerimônia**, enfrenta as lichias, conta com o parceiro Eduardo, derrota o **Lichião** e pega o **Diploma de Medicina**.

## Controles

- **← →** ou **A / D** — mover
- **Espaço**, **W** ou **↑** — pular (segurar pula mais alto)
- **J** ou **X** — atirar seringa (precisa de munição do estetoscópio)
- **R** — reiniciar (Game Over / Vitória)
- **Enter** — começar (tela de menu)
- **M** — mute/unmute

## Features

1. **Tutorial integrado** com plaquinhas que abrem balão de fala ao se aproximar.
2. **Telas**: menu inicial com narrativa, Game Over e Vitória com nota final.
3. **Paralaxe** com 3 camadas (céu+nuvens, prédios, plataformas).
4. **Partículas + juice**: poeira ao pousar, estrelas ao matar inimigo, popups "+N", screen shake ao tomar dano, Amanda pisca enquanto invencível.
5. **Tema médico**: cenário evolui de biblioteca → laboratório → hospital → formatura; coletáveis temáticos (livros, estetoscópios, café).
6. **Eduardo (NPC parceiro)**: aparece em 2 pontos com balões de fala; entrega um **jaleco-escudo** antes do chefe.
7. **Chefão Lichião**: lichia gigante com 3 HP, pula e solta filhotes, barra de vida no topo.
8. **Power-ups**:
   - 🍓 **Yogoberry** — recupera 1 coração
   - ☕ **Café** — velocidade boost por 10s
   - 🩺 **Estetoscópio** — +2 seringas pra atirar nas lichias (J ou X)
   - 🥼 **Jaleco** — escudo que absorve 1 hit (entregue pelo Eduardo)
9. **Nota final**: A+/A/B/C calculada por itens coletados + tempo + vidas restantes. Rejogabilidade!
10. **Áudio** 100% gerado: música em loop com osciladores, SFX para pulo/dano/coleta/stomp/power-up/boss/vitória.

## Como rodar local

O jogo precisa ser servido via HTTP (não funciona com `file://`).

**Opção 1 — Live Server (VSCode):**
1. Instale a extensão "Live Server"
2. Clique com o botão direito em `index.html` → "Open with Live Server"

**Opção 2 — Python:**
```bash
cd amanda-medicina
python3 -m http.server 8000
```
Depois abra `http://localhost:8000` no navegador.

**Opção 3 — npx:**
```bash
cd amanda-medicina
npx serve
```

## Estrutura

```
amanda-medicina/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── utils.js        # AABB, clamp, lerp, random
│   ├── input.js        # teclado + jumpBuffer + edge keys
│   ├── audio.js        # Web Audio API: música + SFX + mute
│   ├── particles.js    # Particle, TextPopup, screen shake
│   ├── game.js         # estado global + máquina de estados + nota final
│   ├── background.js   # paralaxe + transição de zonas
│   ├── ui.js           # HUD, telas, plaquinhas, balões de fala
│   ├── player.js       # Amanda: movimento, power-ups, shield, render
│   ├── enemy.js        # Lichia (patrulha + colisão)
│   ├── eduardo.js      # NPC com balão e entrega de power-up
│   ├── boss.js         # Lichião com HP e mini-lichias
│   ├── items.js        # Yogoberry, Café, Estetoscópio, Livro, Diploma
│   ├── level.js        # mapa, zonas, posicionamento
│   └── main.js         # loop + orquestração
└── README.md
```
