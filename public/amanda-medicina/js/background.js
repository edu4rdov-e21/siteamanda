// Paralaxe com 3 camadas + transição de cenário (biblioteca → laboratório
// → hospital → cerimônia). Tudo desenhado via Canvas.

const ZONES = [
  // start, end, sky topo, sky base, accent (silhuetas), nome
  { start: 0, end: 1300, top: '#7dd3fc', bot: '#fef3c7', accent: '#7c3a17', name: 'Biblioteca' },
  { start: 1300, end: 2700, top: '#a7f3d0', bot: '#bae6fd', accent: '#0d9488', name: 'Laboratório' },
  { start: 2700, end: 4100, top: '#bfdbfe', bot: '#fef3c7', accent: '#0369a1', name: 'Hospital' },
  { start: 4100, end: 6000, top: '#fbcfe8', bot: '#fef3c7', accent: '#9d174d', name: 'Formatura' },
];

function getZone(x) {
  for (const z of ZONES) if (x < z.end) return z;
  return ZONES[ZONES.length - 1];
}

function lerpColor(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const r = Math.round(lerp(a.r, b.r, t));
  const g = Math.round(lerp(a.g, b.g, t));
  const bl = Math.round(lerp(a.b, b.b, t));
  return `rgb(${r}, ${g}, ${bl})`;
}
function hexToRgb(hex) {
  const m = hex.replace('#', '');
  return {
    r: parseInt(m.slice(0, 2), 16),
    g: parseInt(m.slice(2, 4), 16),
    b: parseInt(m.slice(4, 6), 16),
  };
}

class Background {
  constructor() {
    // nuvens para a camada distante
    this.clouds = [];
    for (let i = 0; i < 24; i++) {
      this.clouds.push({
        x: i * 280 + randRange(-60, 60),
        y: randRange(40, 160),
        s: randRange(0.7, 1.4),
      });
    }
  }

  draw(ctx, cameraX, W, H) {
    // ── tons do céu interpolados entre zonas ────────────
    const zoneA = getZone(cameraX);
    const nextStart = zoneA.end;
    let tTrans = 0;
    let zoneB = zoneA;
    if (cameraX > nextStart - 300 && zoneA !== ZONES[ZONES.length - 1]) {
      zoneB = getZone(zoneA.end + 1);
      tTrans = clamp((cameraX - (nextStart - 300)) / 300, 0, 1);
    }
    const topColor = tTrans > 0 ? lerpColor(zoneA.top, zoneB.top, tTrans) : zoneA.top;
    const botColor = tTrans > 0 ? lerpColor(zoneA.bot, zoneB.bot, tTrans) : zoneA.bot;

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, topColor);
    grad.addColorStop(1, botColor);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // ── sol (camada distante, paralaxe lento) ───────────
    const sunX = 100 - cameraX * 0.05;
    const sunY = 80;
    ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 36, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 52, 0, Math.PI * 2);
    ctx.fill();

    // ── nuvens (camada distante) ────────────────────────
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (const c of this.clouds) {
      const cx = c.x - cameraX * 0.25;
      const wrapped = ((cx % 6720) + 6720) % 6720; // wrap
      drawCloud(ctx, wrapped - 200, c.y, c.s);
    }

    // ── silhuetas médias: prédios da zona atual ─────────
    const accent = zoneA.accent;
    const accentB = zoneB.accent;
    ctx.fillStyle = tTrans > 0 ? lerpColor(accent, accentB, tTrans) : accent;
    const buildingsCamX = cameraX * 0.55;
    drawSilhuetas(ctx, cameraX, buildingsCamX, H, zoneA, zoneB, tTrans);

    // ── grama próxima (camada acima do chão) ────────────
    const grassCamX = cameraX * 0.95;
    ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
    for (let i = 0; i < 50; i++) {
      const x = i * 90 - (grassCamX % 90);
      ctx.fillRect(x, H - 80, 4, 24);
      ctx.fillRect(x + 16, H - 90, 4, 28);
    }

    // ── plaquinha do nome da zona (canto) ───────────────
    ctx.fillStyle = 'rgba(15, 23, 42, 0.55)';
    ctx.fillRect(W - 150, H - 28, 140, 22);
    ctx.fillStyle = '#fef3c7';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(zoneA.name, W - 16, H - 13);
    ctx.textAlign = 'left';
  }
}

function drawCloud(ctx, x, y, s) {
  ctx.beginPath();
  ctx.arc(x, y, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 18 * s, y + 4, 22 * s, 0, Math.PI * 2);
  ctx.arc(x + 38 * s, y, 16 * s, 0, Math.PI * 2);
  ctx.arc(x + 18 * s, y - 8 * s, 16 * s, 0, Math.PI * 2);
  ctx.fill();
}

/** Silhuetas de prédios variando por zona. */
function drawSilhuetas(ctx, worldCamX, paraCamX, H, zoneA, zoneB, tTrans) {
  // padrão depende da zona
  const drawZone = (zone, alpha) => {
    if (alpha <= 0) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = zone.accent;
    const baseY = H - 130;
    if (zone.name === 'Biblioteca') {
      // estantes/colunas
      for (let i = 0; i < 60; i++) {
        const x = i * 120 - (paraCamX % 120);
        ctx.fillRect(x, baseY - 60, 80, 60);
        ctx.fillRect(x - 8, baseY - 70, 96, 10);
        // janelinhas
        ctx.fillStyle = 'rgba(254, 243, 199, 0.4)';
        ctx.fillRect(x + 12, baseY - 50, 16, 16);
        ctx.fillRect(x + 52, baseY - 50, 16, 16);
        ctx.fillStyle = zone.accent;
      }
    } else if (zone.name === 'Laboratório') {
      // prédios baixos com chaminés/tubos
      for (let i = 0; i < 60; i++) {
        const x = i * 140 - (paraCamX % 140);
        ctx.fillRect(x, baseY - 80, 110, 80);
        ctx.fillRect(x + 14, baseY - 110, 14, 30);
        ctx.fillRect(x + 80, baseY - 100, 10, 20);
        // janelas
        ctx.fillStyle = 'rgba(187, 247, 208, 0.5)';
        for (let r = 0; r < 2; r++) {
          for (let c = 0; c < 3; c++) {
            ctx.fillRect(x + 16 + c * 30, baseY - 60 + r * 25, 16, 14);
          }
        }
        ctx.fillStyle = zone.accent;
      }
    } else if (zone.name === 'Hospital') {
      // hospital alto com cruz
      for (let i = 0; i < 60; i++) {
        const x = i * 160 - (paraCamX % 160);
        ctx.fillRect(x, baseY - 120, 130, 120);
        // cruz no topo
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(x + 58, baseY - 138, 14, 22);
        ctx.fillRect(x + 50, baseY - 130, 30, 8);
        // janelas em grid
        ctx.fillStyle = 'rgba(191, 219, 254, 0.5)';
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            ctx.fillRect(x + 14 + c * 28, baseY - 110 + r * 24, 18, 16);
          }
        }
        ctx.fillStyle = zone.accent;
      }
    } else {
      // Formatura: arquibancada/teatro
      for (let i = 0; i < 60; i++) {
        const x = i * 200 - (paraCamX % 200);
        ctx.fillRect(x, baseY - 50, 180, 50);
        ctx.fillRect(x + 10, baseY - 70, 160, 20);
        // bandeirolas
        ctx.fillStyle = '#facc15';
        for (let k = 0; k < 5; k++) ctx.fillRect(x + 20 + k * 30, baseY - 90, 14, 14);
        ctx.fillStyle = zone.accent;
      }
    }
    ctx.restore();
  };

  drawZone(zoneA, 1 - tTrans);
  if (tTrans > 0 && zoneA !== zoneB) drawZone(zoneB, tTrans);
}
