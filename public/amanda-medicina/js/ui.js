// UI: HUD, telas (menu/gameover/vitória), plaquinhas de tutorial e balões.

class TutorialPlaque {
  constructor(x, text) {
    this.x = x;
    this.y = 470 - 40;
    this.w = 40;
    this.h = 40;
    this.text = text;
    this.triggered = false;
    this.shownTime = 0; // frames mostrando
    this.totalShow = 180;
  }
  update(playerX) {
    if (!this.triggered && Math.abs(playerX - this.x) < 110) {
      this.triggered = true;
      this.shownTime = this.totalShow;
    }
    if (this.shownTime > 0) this.shownTime--;
  }
  draw(ctx, cameraX) {
    const x = this.x - cameraX;
    // poste
    ctx.fillStyle = '#7c3a17';
    ctx.fillRect(x + 18, 460 - 40, 4, 40);
    // placa
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(x, 430 - 40, 40, 30);
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, 430 - 40, 40, 30);
    // ponto de exclamação
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x + 18, 396, 4, 14);
    ctx.fillRect(x + 18, 414, 4, 4);

    // balão
    if (this.shownTime > 0) {
      const alpha = clamp(this.shownTime / 60, 0, 1);
      const px = x + 20;
      const py = 390;
      drawSpeechBubble(ctx, this.text, px, py - 50, alpha);
    }
  }
}

function drawSpeechBubble(ctx, text, x, y, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font = 'bold 13px system-ui';
  const padding = 10;
  const lines = wrapText(ctx, text, 200);
  const textW = Math.max(...lines.map((l) => ctx.measureText(l).width));
  const w = textW + padding * 2;
  const h = lines.length * 16 + padding * 2;
  const bx = x - w / 2;
  const by = y - h;

  // sombra
  ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
  roundRect(ctx, bx + 2, by + 3, w, h, 8);
  ctx.fill();
  // balão
  ctx.fillStyle = '#fef3c7';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  roundRect(ctx, bx, by, w, h, 8);
  ctx.fill();
  ctx.stroke();
  // setinha
  ctx.beginPath();
  ctx.moveTo(x - 6, by + h);
  ctx.lineTo(x, by + h + 10);
  ctx.lineTo(x + 6, by + h);
  ctx.closePath();
  ctx.fillStyle = '#fef3c7';
  ctx.fill();
  ctx.stroke();

  // texto
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  lines.forEach((line, i) => ctx.fillText(line, bx + padding, by + padding + i * 16));
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(ctx, text, maxW) {
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    const test = cur ? cur + ' ' + w : w;
    if (ctx.measureText(test).width > maxW) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

class UI {
  drawHUD(ctx, W, player, score, boss) {
    // barra preta
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.fillRect(0, 0, W, 36);

    // corações
    for (let i = 0; i < player.maxLives; i++) {
      drawHeart(ctx, 14 + i * 28, 18, i < player.lives);
    }

    // shield?
    let nameX = 110;
    if (player.shield) {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(nameX, 8, 18, 20);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(nameX + 2, 10, 14, 4);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 10px system-ui';
      ctx.fillText('+1', nameX + 4, 24);
      nameX += 28;
    }

    // nome
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 18px system-ui';
    ctx.textBaseline = 'middle';
    ctx.fillText('Amanda', nameX, 18);

    // contador de seringas
    if (player.syringeAmmo > 0) {
      const sx = nameX + 84;
      // ícone seringa pequeno
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(sx, 14, 14, 5);
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(sx + 2, 15, 10, 3);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(sx + 14, 15, 3, 3);
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 13px system-ui';
      ctx.fillText(`× ${player.syringeAmmo}`, sx + 22, 18);
    }

    // power-up ativo
    if (player.activePower) {
      const px = nameX + 110 + (player.syringeAmmo > 0 ? 60 : 0);
      const remaining = Math.ceil(player.activePower.timer / 60);
      const col =
        player.activePower.type === 'cafe'
          ? '#a16207'
          : player.activePower.type === 'diploma'
            ? '#facc15'
            : '#cbd5e1';
      ctx.fillStyle = col;
      ctx.fillRect(px, 8, 18, 20);
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 13px system-ui';
      ctx.fillText(`${remaining}s`, px + 22, 18);
    }

    // pontos
    ctx.fillStyle = '#fef3c7';
    ctx.font = 'bold 18px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(`Pontos: ${score}`, W - 14, 18);
    ctx.textAlign = 'left';

    // barra de progresso até o diploma
    const progress = clamp(player.x / 4500, 0, 1);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(W - 220, 28, 200, 4);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(W - 220, 28, 200 * progress, 4);

    // barra do boss
    if (boss && boss.active && !boss.dead) {
      const bw = 360;
      const bx = (W - bw) / 2;
      const by = 44;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      ctx.fillRect(bx - 4, by - 4, bw + 8, 22);
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(bx, by, bw, 14);
      const hpPct = boss.hp / boss.maxHp;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(bx, by, bw * hpPct, 14);
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Lichião — Chefe Final', W / 2, by + 32);
      ctx.textAlign = 'left';
    }
  }

  drawMute(ctx, W, muted) {
    ctx.fillStyle = muted ? '#94a3b8' : '#fef3c7';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(muted ? '🔇 M = som' : '🔊 M = mute', W - 14, 50);
    ctx.textAlign = 'left';
  }

  drawMenu(ctx, W, H, t) {
    // fundo escurecido
    ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
    ctx.fillRect(0, 0, W, H);

    // título com pulsação
    const pulse = 1 + Math.sin(t / 25) * 0.04;
    ctx.save();
    ctx.translate(W / 2, H / 2 - 90);
    ctx.scale(pulse, pulse);
    ctx.font = 'bold 52px system-ui';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 6;
    ctx.strokeText('Amanda', 0, 0);
    ctx.fillText('Amanda', 0, 0);
    ctx.font = 'bold 28px system-ui';
    ctx.fillStyle = '#fef3c7';
    ctx.strokeText('Rumo ao Diploma de Medicina', 0, 36);
    ctx.fillText('Rumo ao Diploma de Medicina', 0, 36);
    ctx.restore();

    // sinopse
    ctx.fillStyle = '#f8fafc';
    ctx.font = '17px system-ui';
    ctx.textAlign = 'center';
    const lines = [
      'Amanda está a uma fase de se formar em medicina.',
      'Atravesse a faculdade, derrote o Lichião e pegue o diploma!',
    ];
    lines.forEach((l, i) => ctx.fillText(l, W / 2, H / 2 + 10 + i * 24));

    // botão / dica
    const blink = Math.sin(t / 12) > 0;
    if (blink) {
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 22px system-ui';
      ctx.fillText('Pressione ENTER pra começar', W / 2, H / 2 + 100);
    }
    ctx.textAlign = 'left';
  }

  drawGameOver(ctx, W, H) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 64px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Game Over', W / 2, H / 2 - 30);
    ctx.fillStyle = '#fef3c7';
    ctx.font = '20px system-ui';
    ctx.fillText('Amanda precisa estudar mais...', W / 2, H / 2 + 20);
    ctx.fillText('Pressione R pra tentar de novo', W / 2, H / 2 + 60);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }

  drawVictory(ctx, W, H, grade, score) {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    ctx.fillRect(0, 0, W, H);

    // confete
    ctx.fillStyle = '#facc15';
    for (let i = 0; i < 60; i++) {
      const x = (i * 17 + Math.sin(i) * 30 + (Date.now() / 30) % 40) % W;
      const y = ((i * 23 + Date.now() / 8) % H);
      ctx.fillRect(x, y, 4, 8);
    }

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 48px system-ui';
    ctx.fillText('Amanda se formou!', W / 2, 100);
    ctx.fillStyle = '#fef3c7';
    ctx.font = '18px system-ui';
    ctx.fillText(grade.msg, W / 2, 140);

    // nota gigante
    ctx.font = 'bold 130px system-ui';
    ctx.fillStyle = grade.color;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 8;
    ctx.strokeText(grade.letter, W / 2, H / 2 + 20);
    ctx.fillText(grade.letter, W / 2, H / 2 + 20);

    // detalhes
    ctx.font = '16px system-ui';
    ctx.fillStyle = '#fef3c7';
    const y0 = H / 2 + 110;
    ctx.fillText(
      `Itens coletados: ${grade.itemsPct}%   ·   Tempo: ${grade.timeSeconds}s   ·   Vidas: ${grade.lives}/${grade.maxLives}`,
      W / 2,
      y0,
    );
    ctx.fillText(`Pontos: ${score}`, W / 2, y0 + 24);
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 18px system-ui';
    ctx.fillText('Pressione R pra jogar de novo', W / 2, y0 + 60);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
  }
}

function drawHeart(ctx, cx, cy, filled) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = filled ? '#ef4444' : 'rgba(255,255,255,0.2)';
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.bezierCurveTo(0, -3, -10, -3, -10, 3);
  ctx.bezierCurveTo(-10, 7, 0, 12, 0, 12);
  ctx.bezierCurveTo(0, 12, 10, 7, 10, 3);
  ctx.bezierCurveTo(10, -3, 0, -3, 0, 4);
  ctx.fill();
  ctx.restore();
}

const Ui = new UI();
