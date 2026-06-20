/* ============================================================
   Teste de QI — motor (fluxo, timers, correção, resultado)
   Vanilla JS. Sem dependências. Roda em file:// ou servido.
   ============================================================ */

(function () {
  'use strict';

  const CFG = window.QI_CONFIG;
  const ITENS = window.ITENS;
  const DOMINIOS = CFG.dominios;

  const $tela = document.getElementById('tela');
  const $topRight = document.getElementById('topRight');
  const $barraWrap = document.getElementById('barraWrap');
  const $barra = document.getElementById('barra');

  // itens por domínio, na ordem dos domínios
  const SECOES = DOMINIOS.map((d) => ({
    ...d,
    itens: ITENS.filter((it) => it.dominio === d.id),
  }));

  // ── estado ──────────────────────────────────────────────
  // Timer e listener da velocidade ficam em escopo de MÓDULO (não em st),
  // pra que pararTimer() consiga limpá-los mesmo após novoEstado() trocar st
  // (senão o setInterval/listener antigo vazaria ao apertar Refazer).
  let timerId = null;
  let velAbort = null;

  let st;
  function novoEstado() {
    pararTimer(); // mata qualquer timer/listener do run anterior antes de trocar st
    st = {
      fase: 'intro',
      secaoIdx: 0,
      itemIdx: 0,
      respostas: {}, // { id: { correto:bool, dado:any } }
      memData: {}, // { id: { mostrar, esperado } }
      velData: null, // { acertos, total, restante }
      inicioTotal: 0,
      temposSecao: {}, // { dominioId: segundos }
      _secaoInicio: 0,
    };
  }

  // ── utilidades ──────────────────────────────────────────
  function render(html) {
    $tela.innerHTML = html;
  }
  function norm(s) {
    return String(s).toLowerCase().replace(/r\$/g, '').replace(/\s+/g, '').replace(',', '.').trim();
  }
  function fmtTempo(seg) {
    const m = Math.floor(seg / 60);
    const s = Math.max(0, Math.floor(seg % 60));
    return `${m}:${String(s).padStart(2, '0')}`;
  }
  function randInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function pararTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    if (velAbort) {
      velAbort.abort(); // remove o listener de teclado da velocidade
      velAbort = null;
    }
  }
  function totalSteps() {
    return SECOES.reduce((s, sec) => s + sec.itens.length, 0);
  }
  function stepAtual() {
    let n = 0;
    for (let i = 0; i < st.secaoIdx; i++) n += SECOES[i].itens.length;
    return n + st.itemIdx;
  }
  function atualizaBarra(visivel) {
    $barraWrap.style.display = visivel ? 'block' : 'none';
    if (visivel) $barra.style.width = `${(stepAtual() / totalSteps()) * 100}%`;
  }

  // ── correção de um item ─────────────────────────────────
  function corrige(it, dado) {
    if (dado == null || dado === '') return false;
    if (it.tipo === 'numerica') {
      const u = norm(dado);
      const direto = it.aceitas.some((a) => norm(a) === u);
      if (direto) return true;
      // comparação numérica SÓ quando a entrada é puramente numérica
      // (evita falso-positivo tipo "3 horas" → parseFloat=3 em N7)
      const ehNumeroPuro = /^-?\d+(\.\d+)?$/.test(u);
      if (ehNumeroPuro) {
        const nu = parseFloat(u);
        return it.aceitas.some((a) => {
          const an = norm(a);
          if (!/^-?\d+(\.\d+)?$/.test(an)) return false;
          return Math.abs(parseFloat(an) - nu) < 1e-9;
        });
      }
      return false;
    }
    if (it.tipo === 'multipla') {
      const visuais = it.alternativas.length && typeof it.alternativas[0] === 'object';
      if (visuais) {
        // dado = índice escolhido
        return !!(it.alternativas[dado] && it.alternativas[dado].correta);
      }
      return dado === it.gabarito;
    }
    return false;
  }

  function registra(it, dado) {
    st.respostas[it.id] = { correto: corrige(it, dado), dado };
  }

  // ════════════════════════════════════════════════════════
  // TELAS
  // ════════════════════════════════════════════════════════

  function telaIntro() {
    st.fase = 'intro';
    pararTimer();
    atualizaBarra(false);
    $topRight.innerHTML = '';
    const linhas = SECOES.map(
      (s, i) => `
      <div class="secao-row">
        <div class="secao-num">${i + 1}</div>
        <div class="secao-info"><b>${s.nome}</b><span>${s.chc} · ${s.desc}</span></div>
      </div>`,
    ).join('');

    render(`
      <div class="card">
        <h1>Perfil Cognitivo</h1>
        <p class="sub">Uma autoavaliação em 6 domínios de inteligência (estilo CHC / Wechsler / Raven). ~30 minutos, ~40 itens.</p>

        <div class="aviso">
          <strong>Antes de começar:</strong> este teste é para <strong>autoavaliação e treino</strong>, não é clínico nem diagnóstico. A pontuação na escala de QI é uma <strong>estimativa aproximada</strong> (âncora), não um valor medido. O dado mais confiável é o seu <strong>perfil entre os domínios</strong> — não o número absoluto. Sono, cansaço e ansiedade afetam o resultado.
        </div>

        <h3>As 6 seções</h3>
        <div class="secoes-lista">${linhas}</div>

        <button class="btn full" id="btnComecar">Começar</button>
      </div>
    `);
    document.getElementById('btnComecar').onclick = () => {
      st.inicioTotal = Date.now();
      telaSecaoIntro();
    };
  }

  function telaSecaoIntro() {
    st.fase = 'secaoIntro';
    pararTimer();
    atualizaBarra(false);
    $topRight.innerHTML = `<span class="progresso">Seção ${st.secaoIdx + 1} de 6</span>`;
    const sec = SECOES[st.secaoIdx];
    const temReg = ['abstrato', 'verbal', 'numerico', 'espacial'].includes(sec.id);
    const tempoTxt = sec.id === 'velocidade'
      ? '60 segundos, cronômetro encerra sozinho'
      : sec.id === 'memoria'
        ? 'sem limite por item (a sequência some sozinha)'
        : `${Math.round(CFG.tempos[sec.id] / 60)} min sugeridos (não bloqueia)`;

    let comoFunciona = '';
    if (sec.id === 'memoria') {
      comoFunciona = 'A sequência aparece por alguns segundos, some, e você digita de memória.';
    } else if (sec.id === 'velocidade') {
      comoFunciona = 'Dois textos aparecem; diga se são iguais ou diferentes o mais rápido possível, por 60 s.';
    } else if (sec.id === 'numerico') {
      comoFunciona = 'Resposta digitada (sem alternativas). Aperte Enter para avançar.';
    } else {
      comoFunciona = 'Escolha a alternativa correta. Você pode avançar mesmo sem responder.';
    }

    render(`
      <div class="card">
        <h2>${st.secaoIdx + 1}. ${sec.nome}</h2>
        <p class="sub"><b>${sec.chc}</b> — ${sec.desc}.</p>
        <p class="sub">${comoFunciona}</p>
        <div class="meta-linha">
          <span>📋 ${sec.itens.length === 1 ? '1 bloco' : sec.itens.length + ' itens'}</span>
          <span>⏱️ ${tempoTxt}</span>
        </div>
        <button class="btn full" id="btnIniciarSecao" style="margin-top:18px">Iniciar seção</button>
      </div>
    `);
    document.getElementById('btnIniciarSecao').onclick = () => {
      st.itemIdx = 0;
      st._secaoInicio = Date.now();
      if (temReg) iniciaCronoSoft();
      entraItem();
    };
  }

  // cronômetro soft (conta regressivo, não bloqueia)
  function iniciaCronoSoft() {
    pararTimer();
    const sec = SECOES[st.secaoIdx];
    const limite = CFG.tempos[sec.id];
    const tick = () => {
      const passado = (Date.now() - st._secaoInicio) / 1000;
      const restante = limite - passado;
      if (restante > 0) {
        const alerta = restante < 30 ? ' alerta' : '';
        $topRight.innerHTML = `<span class="cronometro${alerta}">⏱ ${fmtTempo(restante)}</span>`;
      } else {
        $topRight.innerHTML = `<span class="cronometro alerta">tempo sugerido esgotado</span>`;
      }
    };
    tick();
    timerId = setInterval(tick, 1000);
  }

  // entra no item atual da seção atual (roteia por tipo)
  function entraItem() {
    const sec = SECOES[st.secaoIdx];
    if (st.itemIdx >= sec.itens.length) return fimSecao();
    const it = sec.itens[st.itemIdx];
    atualizaBarra(true);
    if (it.tipo === 'memoria') return telaMemoriaShow(it);
    if (it.tipo === 'velocidade') return telaVelocidade(it);
    return telaItemRegular(it);
  }

  function progressoSecaoStr() {
    const sec = SECOES[st.secaoIdx];
    if (sec.itens.length <= 1) return `Seção ${st.secaoIdx + 1} de 6`;
    return `Seção ${st.secaoIdx + 1} de 6 · questão ${st.itemIdx + 1} de ${sec.itens.length}`;
  }

  // ── item regular (múltipla de texto, visual, ou numérico) ──
  // O cronômetro soft já é iniciado UMA vez em telaSecaoIntro; aqui só
  // re-renderizamos o item (o $topRight segue atualizado pelo interval).
  function telaItemRegular(it) {
    st.fase = 'item';

    const figura = it.svg ? `<div class="fig${it.id === 'E6' ? ' modelo' : ''}">${it.svg}</div>` : '';

    let corpo = '';
    if (it.tipo === 'numerica') {
      // value setado via JS após o render (evita quebrar o atributo com aspas)
      corpo = `<input class="campo" id="campoNum" inputmode="text" autocomplete="off" placeholder="sua resposta" />`;
    } else {
      const visuais = typeof it.alternativas[0] === 'object';
      const escolha = st.respostas[it.id] ? st.respostas[it.id].dado : null;
      if (visuais) {
        // embaralha mantendo flag correta; persiste índice escolhido na ordem ORIGINAL
        corpo = '<div class="alts-grid">' + it.alternativas.map((a, i) =>
          `<button class="alt-svg${escolha === i ? ' sel' : ''}" data-idx="${i}" aria-label="opção ${i + 1}">${a.svg}</button>`,
        ).join('') + '</div>';
      } else {
        corpo = '<div class="alts">' + it.alternativas.map((a) =>
          `<button class="alt${escolha === a ? ' sel' : ''}" data-val="${encodeURIComponent(a)}">
             <span class="marca"></span><span>${a}</span>
           </button>`,
        ).join('') + '</div>';
      }
    }

    render(`
      <div class="card">
        <p class="sub" style="margin-bottom:6px">${progressoSecaoStr()}</p>
        <p class="enunciado">${it.enunciado}</p>
        ${figura}
        ${corpo}
        <div class="row-btns">
          <button class="btn full" id="btnProx">${ultimoGlobal() ? 'Ver resultado' : 'Próxima'}</button>
        </div>
      </div>
    `);

    // wire
    if (it.tipo === 'numerica') {
      const campo = document.getElementById('campoNum');
      campo.value = st.respostas[it.id] ? st.respostas[it.id].dado : '';
      campo.focus();
      campo.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { registra(it, campo.value); avanca(); }
      });
      document.getElementById('btnProx').onclick = () => { registra(it, campo.value); avanca(); };
    } else {
      const visuais = typeof it.alternativas[0] === 'object';
      $tela.querySelectorAll(visuais ? '.alt-svg' : '.alt').forEach((el) => {
        el.onclick = () => {
          if (visuais) {
            const idx = Number(el.getAttribute('data-idx'));
            registra(it, idx);
            $tela.querySelectorAll('.alt-svg').forEach((x) => x.classList.remove('sel'));
          } else {
            const val = decodeURIComponent(el.getAttribute('data-val'));
            registra(it, val);
            $tela.querySelectorAll('.alt').forEach((x) => x.classList.remove('sel'));
          }
          el.classList.add('sel');
        };
      });
      document.getElementById('btnProx').onclick = () => {
        if (!st.respostas[it.id]) registra(it, null); // avançar sem responder = erro
        avanca();
      };
    }
  }

  function ultimoGlobal() {
    return st.secaoIdx === SECOES.length - 1 &&
      st.itemIdx >= SECOES[st.secaoIdx].itens.length - 1;
  }

  function avanca() {
    st.itemIdx++;
    const sec = SECOES[st.secaoIdx];
    if (st.itemIdx >= sec.itens.length) fimSecao();
    else entraItem();
  }

  function fimSecao() {
    pararTimer();
    st.temposSecao[SECOES[st.secaoIdx].id] = (Date.now() - st._secaoInicio) / 1000;
    if (st.secaoIdx >= SECOES.length - 1) return telaResultado();
    st.secaoIdx++;
    telaSecaoIntro();
  }

  // ── Memória de Trabalho ─────────────────────────────────
  function geraMemoria(it) {
    const { tamanho, modo } = it.memoria;
    if (modo === 'ordenar') {
      // metade números, metade letras
      const nNums = Math.floor(tamanho / 2);
      const nLetras = tamanho - nNums;
      const nums = [];
      while (nums.length < nNums) {
        const d = String(randInt(1, 9));
        if (!nums.includes(d)) nums.push(d);
      }
      const letras = [];
      const alfabeto = 'BCDFGHJKLMNPRSTVXZ'.split('');
      while (letras.length < nLetras) {
        const L = alfabeto[randInt(0, alfabeto.length - 1)];
        if (!letras.includes(L)) letras.push(L);
      }
      const mostrar = shuffle(nums.concat(letras));
      // ordenação numérica explícita (robusta se o tamanho mudar no futuro)
      const esperado = nums.slice().sort((a, b) => a - b).join('') + letras.slice().sort().join('');
      return { mostrar, esperado };
    }
    // dígitos diretos/inversos
    const digs = [];
    while (digs.length < tamanho) digs.push(String(randInt(0, 9)));
    const esperado = (modo === 'inverso' ? digs.slice().reverse() : digs).join('');
    return { mostrar: digs, esperado };
  }

  function telaMemoriaShow(it) {
    st.fase = 'memoria';
    $topRight.innerHTML = `<span class="progresso">${progressoSecaoStr()}</span>`;
    const data = geraMemoria(it);
    st.memData[it.id] = data;

    const segs = Math.max(2, Math.round(data.mostrar.length * 0.9));
    render(`
      <div class="card">
        <p class="sub" style="margin-bottom:6px">${progressoSecaoStr()}</p>
        <p class="enunciado">${it.enunciado}</p>
        <div class="seq-display" id="seq">
          ${data.mostrar.map((c) => `<div class="seq-cell">${c}</div>`).join('')}
        </div>
        <p class="sub" style="text-align:center">Memorize… some em <b id="cont">${segs}</b>s</p>
      </div>
    `);
    let restante = segs;
    pararTimer();
    timerId = setInterval(() => {
      restante--;
      const c = document.getElementById('cont');
      if (c) c.textContent = String(restante);
      if (restante <= 0) {
        pararTimer();
        telaMemoriaInput(it);
      }
    }, 1000);
  }

  function telaMemoriaInput(it) {
    pararTimer();
    const modo = it.memoria.modo;
    const dica = modo === 'inverso' ? '(ordem invertida)' : modo === 'ordenar' ? '(números crescentes, depois letras A→Z)' : '(mesma ordem)';
    render(`
      <div class="card">
        <p class="sub" style="margin-bottom:6px">${progressoSecaoStr()}</p>
        <p class="enunciado">Digite a sequência ${dica}</p>
        <input class="campo" id="campoMem" autocomplete="off" placeholder="digite aqui" />
        <div class="row-btns">
          <button class="btn full" id="btnMem">${ultimoGlobal() ? 'Ver resultado' : 'Confirmar'}</button>
        </div>
      </div>
    `);
    const campo = document.getElementById('campoMem');
    campo.focus();
    const confirma = () => {
      const dado = campo.value.replace(/\s+/g, '').toUpperCase();
      const esperado = st.memData[it.id].esperado.toUpperCase();
      st.respostas[it.id] = { correto: dado === esperado, dado };
      avanca();
    };
    campo.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirma(); });
    document.getElementById('btnMem').onclick = confirma;
  }

  // ── Velocidade (bloco 60s) ──────────────────────────────
  function geraParVel() {
    const tamanho = randInt(4, 7);
    const usaDigitos = Math.random() < 0.6;
    const pool = usaDigitos ? '0123456789' : 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    let base = '';
    for (let i = 0; i < tamanho; i++) base += pool[randInt(0, pool.length - 1)];
    const iguais = Math.random() < 0.5;
    let outro = base;
    if (!iguais) {
      const pos = randInt(0, tamanho - 1);
      let novo;
      do { novo = pool[randInt(0, pool.length - 1)]; } while (novo === base[pos]);
      outro = base.slice(0, pos) + novo + base.slice(pos + 1);
    }
    return { a: base, b: outro, iguais };
  }

  function telaVelocidade(it) {
    st.fase = 'velocidade';
    const dur = it.velocidade.duracaoSeg;
    st.velData = { acertos: 0, total: 0, restante: dur, referencia: it.velocidade.referencia };
    let par = geraParVel();

    const pintar = () => {
      $topRight.innerHTML = `<span class="cronometro${st.velData.restante <= 10 ? ' alerta' : ''}">⏱ ${st.velData.restante}s</span>`;
      render(`
        <div class="card">
          <p class="sub" style="margin-bottom:6px; text-align:center">Iguais ou diferentes? (rápido!)</p>
          <div class="vel-pair" id="velPair">
            <div class="vel-token">${par.a}</div>
            <div class="vel-token">${par.b}</div>
          </div>
          <div class="vel-btns">
            <button class="vel-btn dif" id="velDif">Diferentes <small>(F)</small></button>
            <button class="vel-btn ig" id="velIg">Iguais <small>(J)</small></button>
          </div>
          <p class="vel-stats">Acertos: <b>${st.velData.acertos}</b> · Respondidas: ${st.velData.total}</p>
        </div>
      `);
      const responder = (respIguais) => {
        st.velData.total++;
        if (respIguais === par.iguais) st.velData.acertos++;
        const pairEl = document.getElementById('velPair');
        pairEl.classList.add(respIguais === par.iguais ? 'flash-ok' : 'flash-err');
        par = geraParVel();
        // re-render rápido (mantém timer rodando)
        pintarLeve();
      };
      document.getElementById('velDif').onclick = () => responder(false);
      document.getElementById('velIg').onclick = () => responder(true);
    };

    // re-render leve só dos tokens/stats (evita recriar tudo a cada clique)
    const pintarLeve = () => {
      const pairEl = document.getElementById('velPair');
      if (pairEl) pairEl.innerHTML = `<div class="vel-token">${par.a}</div><div class="vel-token">${par.b}</div>`;
      const statsEl = $tela.querySelector('.vel-stats');
      if (statsEl) statsEl.innerHTML = `Acertos: <b>${st.velData.acertos}</b> · Respondidas: ${st.velData.total}`;
    };

    pintar();

    // limpa qualquer timer/listener anterior antes de armar este bloco
    pararTimer();

    // teclado F/J — AbortController garante remoção em QUALQUER saída
    // (fim dos 60s, Refazer, troca de tela) via pararTimer(), que faz velAbort.abort()
    const ac = new AbortController();
    velAbort = ac;
    window.addEventListener('keydown', (e) => {
      if (e.key === 'f' || e.key === 'F') { document.getElementById('velDif')?.click(); }
      if (e.key === 'j' || e.key === 'J') { document.getElementById('velIg')?.click(); }
    }, { signal: ac.signal });

    timerId = setInterval(() => {
      st.velData.restante--;
      const cron = $topRight.querySelector('.cronometro');
      if (cron) {
        cron.textContent = `⏱ ${st.velData.restante}s`;
        if (st.velData.restante <= 10) cron.classList.add('alerta');
      }
      if (st.velData.restante <= 0) {
        pararTimer(); // para o timer e aborta o listener de teclado
        // grava resultado da velocidade
        st.respostas['S1'] = { correto: null, dado: st.velData.acertos, total: st.velData.total };
        fimSecao();
      }
    }, 1000);
  }

  // ════════════════════════════════════════════════════════
  // CORREÇÃO + RESULTADO
  // ════════════════════════════════════════════════════════

  function pontuaDominio(dom) {
    if (dom.id === 'velocidade') {
      const r = st.respostas['S1'] || { dado: 0 };
      const ref = (SECOES.find((s) => s.id === 'velocidade').itens[0].velocidade.referencia) || 30;
      const pct = Math.min(100, (r.dado / ref) * 100);
      return { pct, bruto: r.dado, max: ref };
    }
    const itens = SECOES.find((s) => s.id === dom.id).itens;
    let bruto = 0, max = 0;
    for (const it of itens) {
      max += it.peso;
      const r = st.respostas[it.id];
      if (r && r.correto) bruto += it.peso;
    }
    return { pct: max ? (bruto / max) * 100 : 0, bruto, max };
  }

  function composto(pcts) {
    const pesos = DOMINIOS.map((d) => d.peso);
    let soma = 0, somaP = 0;
    pcts.forEach((p, i) => { soma += p * pesos[i]; somaP += pesos[i]; });
    return soma / somaP;
  }

  function qiEstimado(comp) {
    return Math.max(55, Math.min(145, Math.round(70 + 0.6 * comp)));
  }

  // Faixa derivada do PRÓPRIO número de QI (cortes clássicos de Wechsler),
  // pra que o número exibido sempre caia dentro do intervalo da etiqueta.
  function faixa(qi) {
    if (qi >= 130) return { txt: 'Muito superior', pct: '~98º' };
    if (qi >= 120) return { txt: 'Superior', pct: '~91º' };
    if (qi >= 110) return { txt: 'Média alta', pct: '~75º' };
    if (qi >= 90) return { txt: 'Média', pct: '~50º' };
    if (qi >= 80) return { txt: 'Média baixa', pct: '~16º' };
    if (qi >= 70) return { txt: 'Limítrofe', pct: '~5º' };
    return { txt: 'Abaixo da média', pct: '~2º' };
  }

  function corPct(p) {
    if (p >= 70) return '#10b981';
    if (p >= 50) return '#f59e0b';
    return '#ef4444';
  }

  function fraseDominio(dom, p) {
    const nivel = p >= 80 ? 'ponto forte' : p >= 60 ? 'bom desempenho' : p >= 40 ? 'na média' : 'a desenvolver';
    return `${dom.desc} — ${nivel}.`;
  }

  // radar SVG (6 eixos)
  function radarSVG(valores, nomes) {
    const cx = 160, cy = 150, R = 110;
    const n = valores.length;
    const ponto = (v, i) => {
      const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
      const r = (v / 100) * R;
      return [cx + r * Math.cos(ang), cy + r * Math.sin(ang)];
    };
    const pontoEixo = (frac, i) => {
      const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
      return [cx + frac * R * Math.cos(ang), cy + frac * R * Math.sin(ang)];
    };
    // viewBox alargado nas laterais pra caber os rótulos sem cortar
    let s = '<svg viewBox="-55 0 430 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gráfico radar do perfil">';
    // anéis
    [0.25, 0.5, 0.75, 1].forEach((f) => {
      const pts = [];
      for (let i = 0; i < n; i++) pts.push(pontoEixo(f, i).join(','));
      s += `<polygon points="${pts.join(' ')}" fill="none" stroke="#cbd5e1" stroke-width="1"/>`;
    });
    // eixos
    for (let i = 0; i < n; i++) {
      const [x, y] = pontoEixo(1, i);
      s += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#cbd5e1" stroke-width="1"/>`;
    }
    // polígono de valores
    const vpts = valores.map((v, i) => ponto(v, i).join(',')).join(' ');
    s += `<polygon points="${vpts}" fill="rgba(13,148,136,0.28)" stroke="#0d9488" stroke-width="2.5"/>`;
    valores.forEach((v, i) => {
      const [x, y] = ponto(v, i);
      s += `<circle cx="${x}" cy="${y}" r="3.5" fill="#0d9488"/>`;
    });
    // rótulos
    nomes.forEach((nm, i) => {
      const [x, y] = pontoEixo(1.18, i);
      const anchor = Math.abs(x - cx) < 6 ? 'middle' : x > cx ? 'start' : 'end';
      const curto = nm.split(' ')[0].replace('Lógico-Abstrato', 'Lógico');
      s += `<text x="${x}" y="${y + 4}" font-size="11" font-weight="600" fill="#64748b" text-anchor="${anchor}">${curto}</text>`;
    });
    return s + '</svg>';
  }

  function telaResultado() {
    st.fase = 'resultado';
    pararTimer();
    atualizaBarra(false);
    $topRight.innerHTML = '';

    const doms = DOMINIOS.map((d) => ({ d, ...pontuaDominio(d) }));
    const pcts = doms.map((x) => x.pct);
    const comp = composto(pcts);
    const qi = qiEstimado(comp);
    const fx = faixa(qi);

    const ordenadoForte = doms.slice().sort((a, b) => b.pct - a.pct);
    const forte = ordenadoForte[0];
    const fraco = ordenadoForte[ordenadoForte.length - 1];

    const tempoTotal = (Date.now() - st.inicioTotal) / 1000;

    const radar = radarSVG(pcts, DOMINIOS.map((d) => d.nome));

    const listaDoms = doms.map((x) => `
      <div class="dom-item">
        <div class="dom-head"><b>${x.d.nome}</b><span class="pct">${Math.round(x.pct)}%</span></div>
        <div class="dom-bar"><i style="width:${Math.round(x.pct)}%;background:${corPct(x.pct)}"></i></div>
        <div class="dom-frase">${fraseDominio(x.d, x.pct)}</div>
      </div>
    `).join('');

    render(`
      <div class="card">
        <h2 style="text-align:center">Seu perfil cognitivo</h2>
        <div class="score-big">
          <div class="num">~${qi}</div>
          <div class="faixa">faixa <b>${fx.txt}</b> · percentil aprox. <b>${fx.pct}</b></div>
        </div>
        <div class="radar-wrap">${radar}</div>
        <p class="sub" style="text-align:center; margin-top:-4px">
          Ponto mais forte: <b>${forte.d.nome} (${Math.round(forte.pct)}%)</b> ·
          A desenvolver: <b>${fraco.d.nome} (${Math.round(fraco.pct)}%)</b>
        </p>
      </div>

      <div class="card">
        <h3>Por domínio</h3>
        <div class="dom-list">${listaDoms}</div>
        <div class="meta-linha">
          <span>⏱️ Tempo total: ${fmtTempo(tempoTotal)}</span>
          <span>📊 Composto: ${Math.round(comp)}%</span>
        </div>
      </div>

      <div class="card">
        <div class="aviso" style="margin:0">
          Este teste é uma ferramenta de <strong>autoavaliação e treino</strong>, para uso pessoal. Não é clínico, não dá diagnóstico, e a pontuação não equivale a um QI medido profissionalmente. Leia o número como estimativa aproximada e dê mais atenção ao seu <strong>perfil entre os domínios</strong> do que ao valor absoluto.
        </div>
        <div class="row-btns">
          <button class="btn" id="btnRefazer">↻ Refazer</button>
          <button class="btn ghost" id="btnSalvar">💾 Salvar</button>
          <button class="btn ghost" id="btnExportar">⬇️ Exportar JSON</button>
        </div>
        <p class="muted-foot" id="salvoMsg"></p>
      </div>
    `);

    const resultadoObj = {
      data: new Date().toISOString(),
      qiEstimado: qi,
      faixa: fx.txt,
      percentil: fx.pct,
      composto: Math.round(comp * 10) / 10,
      dominios: doms.map((x) => ({ id: x.d.id, nome: x.d.nome, pct: Math.round(x.pct * 10) / 10 })),
      tempoTotalSeg: Math.round(tempoTotal),
      temposSecao: st.temposSecao,
    };

    document.getElementById('btnRefazer').onclick = () => { novoEstado(); telaIntro(); };
    document.getElementById('btnSalvar').onclick = () => {
      try {
        const hist = JSON.parse(localStorage.getItem('historico_qi') || '[]');
        hist.push(resultadoObj);
        localStorage.setItem('historico_qi', JSON.stringify(hist));
        document.getElementById('salvoMsg').textContent = `Salvo! Você já tem ${hist.length} resultado(s) no histórico deste navegador.`;
      } catch (e) {
        document.getElementById('salvoMsg').textContent = 'Não foi possível salvar (armazenamento bloqueado).';
      }
    };
    document.getElementById('btnExportar').onclick = () => {
      try {
        const blob = new Blob([JSON.stringify(resultadoObj, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `perfil-cognitivo-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        document.getElementById('salvoMsg').textContent = 'Não foi possível exportar neste navegador.';
      }
    };
  }

  // ── start ───────────────────────────────────────────────
  novoEstado();
  telaIntro();
})();
