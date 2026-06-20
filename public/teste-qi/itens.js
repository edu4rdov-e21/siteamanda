/* ============================================================
   Banco de itens do Teste de QI (auto-aplicável)
   Tudo original. Formatos genéricos (CHC / Wechsler / Raven).
   Exposto em window.ITENS e window.QI_CONFIG (sem fetch — roda em file://).
   ============================================================ */

// ── Config geral ────────────────────────────────────────────
window.QI_CONFIG = {
  dominios: [
    { id: 'abstrato',   nome: 'Lógico-Abstrato',     chc: 'Gf',     desc: 'Achar padrões e regras novas',            peso: 1.3 },
    { id: 'verbal',     nome: 'Verbal',              chc: 'Gc',     desc: 'Vocabulário, analogias, compreensão',     peso: 1.3 },
    { id: 'numerico',   nome: 'Numérico',            chc: 'Gq/Gf',  desc: 'Raciocínio com números e quantidades',    peso: 1.0 },
    { id: 'espacial',   nome: 'Espacial',            chc: 'Gv',     desc: 'Manipular formas mentalmente',            peso: 1.0 },
    { id: 'memoria',    nome: 'Memória de Trabalho', chc: 'Gsm',    desc: 'Reter e manipular informação na hora',    peso: 0.9 },
    { id: 'velocidade', nome: 'Velocidade',          chc: 'Gs',     desc: 'Rapidez em tarefas simples sob tempo',    peso: 0.9 },
  ],
  // tempo soft sugerido por seção (segundos)
  tempos: { abstrato: 420, verbal: 360, numerico: 480, espacial: 420 },
};

/* ============================================================
   Geradores de SVG (programáticos = gabarito garantido)
   ============================================================ */

// Matriz 3×3 de pontos: linha aumenta 1,2,3 / 4,5,6 / 7,8,?  (A5)
function _svgDots() {
  const counts = [1, 2, 3, 4, 5, 6, 7, 8, null];
  let s = '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Matriz 3 por 3 de pontos">';
  s += '<rect x="0" y="0" width="300" height="300" fill="white"/>';
  const cellPositions = [
    [10, 10], [105, 10], [200, 10],
    [10, 105], [105, 105], [200, 105],
    [10, 200], [105, 200], [200, 200],
  ];
  cellPositions.forEach(([cx, cy], idx) => {
    s += `<rect x="${cx}" y="${cy}" width="90" height="90" fill="none" stroke="#94a3b8" stroke-width="2"/>`;
    const n = counts[idx];
    if (n === null) {
      s += `<text x="${cx + 45}" y="${cy + 56}" font-family="sans-serif" font-size="34" font-weight="bold" fill="#cbd5e1" text-anchor="middle">?</text>`;
      return;
    }
    // posiciona n pontos numa mini-grade centralizada
    const cols = Math.min(3, n);
    const rows = Math.ceil(n / 3);
    const gap = 22;
    const startX = cx + 45 - ((cols - 1) * gap) / 2;
    const startY = cy + 45 - ((rows - 1) * gap) / 2;
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / 3);
      const c = i % 3;
      const dotsThisRow = Math.min(3, n - r * 3);
      const rowStartX = cx + 45 - ((dotsThisRow - 1) * gap) / 2;
      const x = rowStartX + c * gap;
      const y = startY + r * gap;
      s += `<circle cx="${x}" cy="${y}" r="6" fill="#0f766e"/>`;
    }
  });
  return s + '</svg>';
}

// Pilha isométrica de cubos. Estrutura fixa: base 2×2 (4) + 2 atrás em cima = 6. (E4)
function _svgCubos() {
  // posições (gx, gy, gz)
  const cubos = [
    [0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], // base 2×2
    [0, 0, 1], [1, 0, 1],                        // fileira de trás, 2º andar
  ];
  const W = 34, H = 17, CH = 34; // largura iso, altura iso, altura do cubo
  const ox = 150, oy = 90;
  const proj = (gx, gy, gz) => [ox + (gx - gy) * W, oy + (gx + gy) * H - gz * CH];
  // ordenar fundo→frente (maior gx+gy e menor gz por último)
  const ordem = cubos.slice().sort((a, b) => (a[0] + a[1] - a[2] * 2) - (b[0] + b[1] - b[2] * 2));
  let s = '<svg viewBox="0 0 300 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pilha de cubos isométrica">';
  s += '<rect x="0" y="0" width="300" height="260" fill="white"/>';
  for (const [gx, gy, gz] of ordem) {
    const [x, y] = proj(gx, gy, gz);
    // topo (losango)
    s += `<polygon points="${x},${y} ${x + W},${y + H} ${x},${y + 2 * H} ${x - W},${y + H}" fill="#5eead4" stroke="#0f766e" stroke-width="1.5"/>`;
    // face esquerda
    s += `<polygon points="${x - W},${y + H} ${x},${y + 2 * H} ${x},${y + 2 * H + CH} ${x - W},${y + H + CH}" fill="#14b8a6" stroke="#0f766e" stroke-width="1.5"/>`;
    // face direita
    s += `<polygon points="${x + W},${y + H} ${x},${y + 2 * H} ${x},${y + 2 * H + CH} ${x + W},${y + H + CH}" fill="#0d9488" stroke="#0f766e" stroke-width="1.5"/>`;
  }
  return s + '</svg>';
}

// Planificação: desenha um conjunto de células (cube net) num grid. (E5)
function _svgNet(cells, label) {
  const cell = 26;
  const pad = 8;
  const maxC = Math.max(...cells.map((c) => c[0])) + 1;
  const maxR = Math.max(...cells.map((c) => c[1])) + 1;
  const w = maxC * cell + pad * 2;
  const h = maxR * cell + pad * 2;
  // centraliza num viewbox fixo 140×140
  const VB = 140;
  const offX = (VB - w) / 2 + pad;
  const offY = (VB - h) / 2 + pad;
  let s = `<svg viewBox="0 0 ${VB} ${VB}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label || 'planificação'}">`;
  s += `<rect x="0" y="0" width="${VB}" height="${VB}" fill="white"/>`;
  for (const [c, r] of cells) {
    s += `<rect x="${offX + c * cell}" y="${offY + r * cell}" width="${cell}" height="${cell}" fill="#99f6e4" stroke="#0f766e" stroke-width="1.5"/>`;
  }
  return s + '</svg>';
}

// Letra "F" assimétrica, com transform (rotação/reflexão). (E6)
function _svgF(transform, label) {
  // F dentro de caixa 60×60, centro (30,30)
  let s = `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label || 'figura'}">`;
  s += '<rect x="0" y="0" width="60" height="60" fill="white"/>';
  s += `<g transform="${transform}" fill="#0d9488">`;
  s += '<rect x="18" y="10" width="10" height="40"/>'; // haste vertical
  s += '<rect x="18" y="10" width="26" height="9"/>';  // barra de cima
  s += '<rect x="18" y="26" width="20" height="8"/>';  // barra do meio
  s += '</g></svg>';
  return s;
}

/* ============================================================
   ITENS
   tipo: 'multipla' | 'numerica' | 'memoria' | 'velocidade'
   - multipla com alternativas de texto: alternativas:[str], gabarito:str
   - multipla com alternativas visuais: alternativas:[{svg, correta:bool}]
   - 'svg' (opcional): imagem do enunciado
   ============================================================ */

window.ITENS = [
  // ── Seção 1 — Lógico-Abstrato (Gf) ──────────────────────
  { id: 'A1', dominio: 'abstrato', tipo: 'multipla', peso: 1, enunciado: 'Complete a sequência de letras: A, C, E, G, ?', alternativas: ['I', 'H', 'J', 'K'], gabarito: 'I', dica: '+2 no alfabeto' },
  { id: 'A2', dominio: 'abstrato', tipo: 'multipla', peso: 1, enunciado: 'Complete: Z, X, V, T, ?', alternativas: ['R', 'S', 'U', 'Q'], gabarito: 'R', dica: '−2 no alfabeto' },
  { id: 'A3', dominio: 'abstrato', tipo: 'multipla', peso: 2, enunciado: 'Sequência de figuras: triângulo (3 lados), quadrado (4), pentágono (5), hexágono (6), ?', alternativas: ['Heptágono (7 lados)', 'Círculo', 'Octógono (8 lados)', 'Pentágono'], gabarito: 'Heptágono (7 lados)', dica: '+1 lado a cada figura' },
  { id: 'A4', dominio: 'abstrato', tipo: 'multipla', peso: 2, enunciado: 'Se todos os A são B, e todos os B são C, então todos os A são C?', alternativas: ['Verdadeiro', 'Falso', 'Indeterminado'], gabarito: 'Verdadeiro', dica: 'silogismo transitivo' },
  { id: 'A5', dominio: 'abstrato', tipo: 'multipla', peso: 2, svg: _svgDots(), enunciado: 'Cada célula tem mais pontos que a anterior (1,2,3 / 4,5,6 / 7,8,?). Quantos pontos faltam na última célula?', alternativas: ['9', '7', '8', '10'], gabarito: '9', dica: '8 + 1' },
  { id: 'A6', dominio: 'abstrato', tipo: 'multipla', peso: 3, enunciado: 'Complete a analogia de letras: ABCD : DCBA :: EFGH : ?', alternativas: ['HGFE', 'EFGH', 'GHEF', 'FEHG'], gabarito: 'HGFE', dica: 'inversão da ordem' },
  { id: 'A7', dominio: 'abstrato', tipo: 'multipla', peso: 3, enunciado: 'Complete: AZ, BY, CX, DW, ?', alternativas: ['EV', 'FU', 'EW', 'DV'], gabarito: 'EV', dica: '1ª letra +1, 2ª letra −1' },

  // ── Seção 2 — Verbal (Gc) ───────────────────────────────
  { id: 'V1', dominio: 'verbal', tipo: 'multipla', peso: 1, enunciado: 'Gato está para Felino assim como Cachorro está para…', alternativas: ['Canino', 'Mamífero', 'Animal', 'Lobo'], gabarito: 'Canino', dica: 'categoria taxonômica específica' },
  { id: 'V2', dominio: 'verbal', tipo: 'multipla', peso: 1, enunciado: 'Sinônimo de EFÊMERO:', alternativas: ['Passageiro', 'Eterno', 'Enorme', 'Belo'], gabarito: 'Passageiro', dica: 'que dura pouco' },
  { id: 'V3', dominio: 'verbal', tipo: 'multipla', peso: 2, enunciado: 'Qual palavra NÃO pertence ao grupo?', alternativas: ['Carvalho', 'Rosa', 'Margarida', 'Tulipa'], gabarito: 'Carvalho', dica: 'é árvore; as outras são flores' },
  { id: 'V4', dominio: 'verbal', tipo: 'multipla', peso: 2, enunciado: 'Médico : Hospital :: Professor : ?', alternativas: ['Escola', 'Aluno', 'Livro', 'Quadro'], gabarito: 'Escola', dica: 'local de trabalho' },
  { id: 'V5', dominio: 'verbal', tipo: 'multipla', peso: 2, enunciado: 'Antônimo de PRÓDIGO (que gasta sem moderação):', alternativas: ['Avarento', 'Generoso', 'Rico', 'Feliz'], gabarito: 'Avarento', dica: 'o oposto de gastador' },
  { id: 'V6', dominio: 'verbal', tipo: 'multipla', peso: 3, enunciado: 'Complete: "A erudição do professor era tão ___ que intimidava os alunos."', alternativas: ['Vasta', 'Superficial', 'Escassa', 'Medíocre'], gabarito: 'Vasta', dica: 'erudição que intimida é grande' },
  { id: 'V7', dominio: 'verbal', tipo: 'multipla', peso: 3, enunciado: 'Oásis : Deserto :: Ilha : ?', alternativas: ['Oceano', 'Praia', 'Areia', 'Palmeira'], gabarito: 'Oceano', dica: 'porção isolada cercada por…' },

  // ── Seção 3 — Numérico (Gq/Gf) — resposta livre ─────────
  { id: 'N1', dominio: 'numerico', tipo: 'numerica', peso: 1, enunciado: 'Complete: 2, 4, 6, 8, ?', aceitas: ['10'], dica: '+2' },
  { id: 'N2', dominio: 'numerico', tipo: 'numerica', peso: 1, enunciado: 'Complete: 5, 10, 20, 40, ?', aceitas: ['80'], dica: '×2' },
  { id: 'N3', dominio: 'numerico', tipo: 'numerica', peso: 2, enunciado: 'Complete: 1, 1, 2, 3, 5, 8, ?', aceitas: ['13'], dica: 'Fibonacci' },
  { id: 'N4', dominio: 'numerico', tipo: 'numerica', peso: 2, enunciado: 'Complete: 2, 6, 12, 20, 30, ?', aceitas: ['42'], dica: 'diferenças 4,6,8,10,12' },
  { id: 'N5', dominio: 'numerico', tipo: 'numerica', peso: 2, enunciado: 'Um produto custa R$ 200. Recebe 20% de desconto e, sobre esse valor, mais 10%. Qual o preço final? (em reais)', aceitas: ['144', 'r$144', 'r$ 144', '144,00', '144.00'], dica: '200 × 0,8 × 0,9' },
  { id: 'N6', dominio: 'numerico', tipo: 'numerica', peso: 3, enunciado: 'Complete: 1, 2, 6, 24, 120, ?', aceitas: ['720'], dica: '×2, ×3, ×4, ×5, ×6 (fatorial)' },
  { id: 'N7', dominio: 'numerico', tipo: 'numerica', peso: 3, enunciado: 'Se 3 máquinas produzem 3 peças em 3 minutos, quantos minutos 100 máquinas levam para produzir 100 peças?', aceitas: ['3', '3 minutos', '3min'], dica: 'cada máquina faz 1 peça em 3 min' },

  // ── Seção 4 — Espacial (Gv) ─────────────────────────────
  { id: 'E1', dominio: 'espacial', tipo: 'multipla', peso: 1, enunciado: 'Você está virado para o Norte. Gira 90° à direita e depois 180°. Para onde está virado?', alternativas: ['Oeste', 'Leste', 'Sul', 'Norte'], gabarito: 'Oeste', dica: 'Norte → Leste → Oeste' },
  { id: 'E2', dominio: 'espacial', tipo: 'multipla', peso: 1, enunciado: 'A letra "b" vista no espelho (reflexo esquerda-direita) parece com qual letra?', alternativas: ['d', 'p', 'q', 'b'], gabarito: 'd', dica: 'espelha a horizontal' },
  { id: 'E3', dominio: 'espacial', tipo: 'multipla', peso: 2, enunciado: 'Um dado tem faces opostas que somam 7. Se o topo é 2 e a frente é 3, qual é a face de baixo?', alternativas: ['5', '4', '1', '6'], gabarito: '5', dica: '7 − 2 = 5' },
  { id: 'E4', dominio: 'espacial', tipo: 'multipla', peso: 2, svg: _svgCubos(), enunciado: 'Quantos cubos existem no total, contando os que sustentam os de cima?', alternativas: ['5', '6', '7', '8'], gabarito: '6', dica: 'base 2×2 (4) + 2 atrás em cima' },
  {
    id: 'E5', dominio: 'espacial', tipo: 'multipla', peso: 2,
    enunciado: 'Qual destas planificações, dobrada, forma um cubo fechado?',
    alternativas: [
      // VÁLIDA: cruz (sem bloco 2×2)
      { svg: _svgNet([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]], 'planificação A'), correta: true },
      // inválidas: contêm bloco 2×2 (nunca forma cubo)
      { svg: _svgNet([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]], 'planificação B'), correta: false },
      { svg: _svgNet([[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [0, 3]], 'planificação C'), correta: false },
      { svg: _svgNet([[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [2, 2]], 'planificação D'), correta: false },
    ],
    dica: 'a cruz (sem quadrado 2×2) é a única válida',
  },
  {
    id: 'E6', dominio: 'espacial', tipo: 'multipla', peso: 3,
    svg: _svgF('rotate(0 30 30)', 'figura-modelo'),
    enunciado: 'Acima está a figura-modelo. Qual das opções é essa mesma figura apenas GIRADA (sem espelhar)?',
    alternativas: [
      // ÚNICA rotação pura
      { svg: _svgF('rotate(90 30 30)', 'opção A'), correta: true },
      // reflexões (nunca são rotação puras de um F)
      { svg: _svgF('translate(60,0) scale(-1,1)', 'opção B'), correta: false },
      { svg: _svgF('rotate(90 30 30) translate(60,0) scale(-1,1)', 'opção C'), correta: false },
      { svg: _svgF('rotate(180 30 30) translate(60,0) scale(-1,1)', 'opção D'), correta: false },
    ],
    dica: 'as espelhadas têm a barra do meio do lado errado',
  },

  // ── Seção 5 — Memória de Trabalho (Gsm) — gerado ────────
  { id: 'M1', dominio: 'memoria', tipo: 'memoria', peso: 1, memoria: { tamanho: 4, modo: 'direto' },  enunciado: 'Memorize os dígitos e digite-os na MESMA ordem.' },
  { id: 'M2', dominio: 'memoria', tipo: 'memoria', peso: 1, memoria: { tamanho: 5, modo: 'direto' },  enunciado: 'Memorize os dígitos e digite-os na MESMA ordem.' },
  { id: 'M3', dominio: 'memoria', tipo: 'memoria', peso: 2, memoria: { tamanho: 6, modo: 'direto' },  enunciado: 'Memorize os dígitos e digite-os na MESMA ordem.' },
  { id: 'M4', dominio: 'memoria', tipo: 'memoria', peso: 2, memoria: { tamanho: 4, modo: 'inverso' }, enunciado: 'Memorize os dígitos e digite-os na ordem INVERSA.' },
  { id: 'M5', dominio: 'memoria', tipo: 'memoria', peso: 3, memoria: { tamanho: 5, modo: 'inverso' }, enunciado: 'Memorize os dígitos e digite-os na ordem INVERSA.' },
  { id: 'M6', dominio: 'memoria', tipo: 'memoria', peso: 3, memoria: { tamanho: 4, modo: 'ordenar' }, enunciado: 'Memorize. Depois digite: primeiro os NÚMEROS em ordem crescente, depois as LETRAS em ordem alfabética (sem espaços).' },

  // ── Seção 6 — Velocidade (Gs) — bloco único 60s ─────────
  { id: 'S1', dominio: 'velocidade', tipo: 'velocidade', velocidade: { duracaoSeg: 60, referencia: 30 }, enunciado: 'Dois textos aparecem. Diga se são IGUAIS ou DIFERENTES o mais rápido que conseguir, por 60 segundos.' },
];
