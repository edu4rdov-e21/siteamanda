# Quiz Cirurgia

App web local-first para estudo ativo de Cirurgia, baseado em 26 aulas transcritas. O usuário responde questões em diferentes modos (aula única, bloco temático, eixo transversal, simulado, revisão de erros, marcadas), recebe feedback e acompanha desempenho ao longo do tempo.

- **Frontend único** rodando inteiro no navegador. Sem backend, sem login, sem servidor.
- **340 questões** em 26 aulas + 8 eixos transversais (todas curadas a partir das transcrições).
- **Persistência local** em `localStorage`. Export/import do progresso em JSON.

## Stack

| Camada | Escolha |
|---|---|
| Framework | React 19 + Vite |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v3 |
| Roteamento | React Router v7 |
| Estado | Zustand 5 |
| Charts | Recharts |
| Ícones | lucide-react |

## Como rodar

```bash
npm install
npm run dev      # dev server em http://localhost:5173
npm run build    # build de produção em dist/
npm run preview  # serve o dist/
```

Requer Node ≥ 20.

## Modos de quiz

| Modo | count | Feedback | Explicação | Timer |
|---|---|---|---|---|
| Aula única | 10 | imediato | sim | — |
| Bloco temático | 15 | imediato | sim | — |
| Eixo transversal | 10 | imediato | sim | — |
| Tudo embaralhado | 20 | imediato | sim | — |
| Simulado | 30 | só no fim | só no fim | 60 min |
| Treino | 15 | imediato | sim | — |
| Revisão de erros | até 20 | imediato | sim | — |
| Marcadas | até 20 | imediato | sim | — |

Todos os modos aceitam filtros de **dificuldade** e **número de questões**, com contador reativo de "X disponíveis no banco" para a combinação atual.

## Atalhos de teclado (sessão de quiz)

| Tecla | Ação |
|---|---|
| `A`–`E` ou `1`–`5` | Selecionar alternativa |
| `Enter` | Responder / próxima |
| `F` | Marcar/desmarcar para revisão (após responder) |
| `Esc` | Sair da sessão |

## Estrutura de pastas

```
src/
├── components/
│   ├── quiz/           # cards da sessão de quiz
│   ├── selector/       # (vazio na v1; placeholders)
│   ├── stats/          # (vazio na v1; charts em StatsPage)
│   └── shared/         # Button, Card, EmptyState
├── pages/              # 6 páginas (uma por rota)
├── store/
│   ├── quizStore.ts        # sessão ativa (não persiste)
│   ├── progressStore.ts    # progresso (persiste)
│   └── settingsStore.ts    # darkMode (persiste)
├── data/
│   ├── aulas/          # 26 JSONs, um por aula
│   ├── transversais/   # 8 JSONs, um por eixo
│   ├── meta/           # metadados (aulas, blocos, eixos)
│   └── index.ts        # carregador unificado
├── lib/
│   ├── types.ts        # tipos canônicos
│   ├── modes.ts        # presets dos 8 modos
│   ├── questionSelector.ts
│   ├── scoring.ts
│   └── storage.ts
├── App.tsx             # aplica classe dark na raiz
├── router.tsx          # rotas (Stats e Settings via lazy)
└── main.tsx
```

## Adicionando ou editando questões

Cada arquivo em `src/data/aulas/` é um JSON com a forma:

```json
{
  "aulaId": 1,
  "titulo": "Abdome Agudo Obstrução Intestinal",
  "questoes": [ /* 10 objetos no schema Question */ ]
}
```

Cada questão segue o tipo `Question` definido em `src/lib/types.ts`. Após editar JSONs, basta recarregar o dev server — o Vite resolve os imports estáticos em build, então o bundle é atualizado automaticamente.

Ver `data/CONTENT_GUIDELINES.md` (na TESE original) para regras de calibração e estilo das questões.

## Persistência

- `quiz-cirurgia:progress:v1` — progresso (UserProgress: byAula, byBloco, byEixo, errorPool, favorites, history).
- `quiz-cirurgia:settings:v1` — preferências (darkMode).

Ambas em `localStorage`. Em `/settings` há export/import JSON e reset.

## Acessibilidade

- Foco visível com `focus-visible:ring` em todos os interativos.
- ARIA: `role="radiogroup"` + `role="radio"` nas alternativas, `role="progressbar"` na barra de progresso, `role="timer"` + `aria-label` no relógio do simulado, `role="switch"` no toggle de dark mode, `aria-live="polite"` no painel de explicação.
- Hierarquia consistente de `<h1>` / `<h2>`.
- Feedback nunca depende só de cor — sempre cor + ícone + texto.

## Deploy

### Vercel (recomendado)

```bash
# Uma vez
npm i -g vercel
vercel login

# Deploy
vercel        # preview
vercel --prod # produção
```

`vercel.json` já configura o rewrite para SPA (todas as rotas servem `index.html`).

### GitHub Pages

```bash
npm run build
# servir o conteúdo de dist/ — apontar o GitHub Pages para a branch que contém dist/
```

Para SPA em GitHub Pages, configure 404.html como cópia de index.html.

## Roadmap (v2 — fora do escopo atual)

- Spaced repetition (SM-2 simplificado)
- PWA instalável
- Comentários do usuário em questões
- Compartilhamento de resultado
