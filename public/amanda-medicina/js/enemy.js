// Lichia — bolinha vermelha espinhosa que patrulha plataformas.
// Quando o player pula em cima, ela some (animação de "squash" + alpha).

class Lichia {
  constructor(x, y, range = 80) {
    this.x = x;
    this.y = y;
    this.w = 28;
    this.h = 28;
    this.vx = 1.2 * (Math.random() < 0.5 ? -1 : 1);
    this.vy = 0;
    this.alive = true;
    this.deathTick = 0;
    this.minX = x - range;
    this.maxX = x + range;
    this.spinTick = 0;
  }

  update(level) {
    if (!this.alive) {
      this.deathTick++;
      return;
    }

    // gravidade
    this.vy += 0.55;
    if (this.vy > 16) this.vy = 16;

    // mover horizontal
    this.x += this.vx;
    if (this.x < this.minX) {
      this.x = this.minX;
      this.vx = Math.abs(this.vx);
    }
    if (this.x + this.w > this.maxX) {
      this.x = this.maxX - this.w;
      this.vx = -Math.abs(this.vx);
    }

    // colisão horizontal com plataformas
    for (const p of level.platforms) {
      if (aabb(this, p)) {
        if (this.vx > 0) {
          this.x = p.x - this.w;
          this.vx = -Math.abs(this.vx);
        } else if (this.vx < 0) {
          this.x = p.x + p.w;
          this.vx = Math.abs(this.vx);
        }
      }
    }

    // colisão vertical
    this.y += this.vy;
    for (const p of level.platforms) {
      if (aabb(this, p)) {
        if (this.vy > 0) {
          this.y = p.y - this.h;
          this.vy = 0;
        } else if (this.vy < 0) {
          this.y = p.y + p.h;
          this.vy = 0;
        }
      }
    }

    // não cai no abismo: inverte direção quando vai sair da plataforma
    let footUnderPlatform = false;
    const probe = { x: this.x + (this.vx > 0 ? this.w + 2 : -2), y: this.y + this.h + 2, w: 2, h: 2 };
    for (const p of level.platforms) {
      if (aabb(probe, p)) {
        footUnderPlatform = true;
        break;
      }
    }
    if (!footUnderPlatform && this.vy === 0) {
      this.vx = -this.vx;
    }

    this.spinTick++;
  }

  /** Marca como morta com animação de fade-out. */
  defeat() {
    this.alive = false;
    this.deathTick = 0;
    if (typeof FX !== 'undefined') {
      FX.stars(this.x + this.w / 2, this.y, '#fde047');
    }
  }

  shouldRemove() {
    return !this.alive && this.deathTick > 30;
  }

  draw(ctx, cameraX) {
    const x = Math.round(this.x - cameraX);
    const y = Math.round(this.y);
    const w = this.w;
    const h = this.h;
    const cx = x + w / 2;
    const cy = y + h / 2;
    const r = w / 2;

    let alpha = 1;
    let squash = 0;
    if (!this.alive) {
      alpha = 1 - this.deathTick / 30;
      squash = this.deathTick;
    }
    ctx.globalAlpha = Math.max(0, alpha);

    // corpo da lichia: bola vermelha com gradiente simulado por círculos sobrepostos
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.arc(cx, cy + squash / 2, r - squash / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(cx - 2, cy + squash / 2 - 2, r - 4 - squash / 4, 0, Math.PI * 2);
    ctx.fill();

    // brilho
    ctx.fillStyle = '#fca5a5';
    ctx.beginPath();
    ctx.arc(cx - 4, cy + squash / 2 - 5, 3, 0, Math.PI * 2);
    ctx.fill();

    // espinhos (8 ao redor)
    if (this.alive) {
      ctx.fillStyle = '#7f1d1d';
      const spikes = 10;
      const baseAngle = (this.spinTick / 30) % (Math.PI * 2);
      for (let i = 0; i < spikes; i++) {
        const ang = baseAngle + (i / spikes) * Math.PI * 2;
        const sx = cx + Math.cos(ang) * (r - 2);
        const sy = cy + Math.sin(ang) * (r - 2);
        const tipX = cx + Math.cos(ang) * (r + 4);
        const tipY = cy + Math.sin(ang) * (r + 4);
        const px = cx + Math.cos(ang + 0.3) * (r - 1);
        const py = cy + Math.sin(ang + 0.3) * (r - 1);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(px, py);
        ctx.closePath();
        ctx.fill();
      }

      // olhinhos pra dar personalidade
      ctx.fillStyle = '#fef2f2';
      ctx.fillRect(cx - 5, cy - 3, 4, 4);
      ctx.fillRect(cx + 1, cy - 3, 4, 4);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx - 4, cy - 2, 2, 2);
      ctx.fillRect(cx + 2, cy - 2, 2, 2);
    }

    ctx.globalAlpha = 1;
  }
}
