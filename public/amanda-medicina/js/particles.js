// Sistema de partículas + screen shake. Tudo via Canvas.
// FX usados: poeira ao pousar, estrelinhas ao matar lichia, popup "+N" ao
// coletar, faísca quando toma dano. Screen shake é um deslocamento aleatório
// do contexto antes do render.

class Particle {
  constructor({ x, y, vx, vy, life, color, size = 3, gravity = 0.2, type = 'dot' }) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.life = life;
    this.maxLife = life;
    this.color = color;
    this.size = size;
    this.gravity = gravity;
    this.type = type;
    this.rot = Math.random() * Math.PI * 2;
    this.spin = randRange(-0.2, 0.2);
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.vx *= 0.98;
    this.life--;
    this.rot += this.spin;
  }
  draw(ctx, cameraX) {
    const x = this.x - cameraX;
    const a = this.life / this.maxLife;
    ctx.globalAlpha = Math.max(0, a);
    ctx.fillStyle = this.color;
    if (this.type === 'star') {
      ctx.save();
      ctx.translate(x, this.y);
      ctx.rotate(this.rot);
      const s = this.size;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.lineTo(Math.cos(ang) * s, Math.sin(ang) * s);
        const ang2 = ((i + 0.5) / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.lineTo(Math.cos(ang2) * s * 0.5, Math.sin(ang2) * s * 0.5);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (this.type === 'square') {
      ctx.fillRect(x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else {
      ctx.beginPath();
      ctx.arc(x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  alive() {
    return this.life > 0;
  }
}

class TextPopup {
  constructor(x, y, text, color = '#fef3c7') {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.life = 40;
    this.maxLife = 40;
  }
  update() {
    this.y -= 1.2;
    this.life--;
  }
  draw(ctx, cameraX) {
    const x = this.x - cameraX;
    const a = this.life / this.maxLife;
    ctx.globalAlpha = Math.max(0, a);
    ctx.font = 'bold 16px system-ui';
    ctx.textAlign = 'center';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0f172a';
    ctx.strokeText(this.text, x, this.y);
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, x, this.y);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }
  alive() {
    return this.life > 0;
  }
}

class FxManager {
  constructor() {
    this.particles = [];
    this.popups = [];
    this.shakeTime = 0;
    this.shakeMag = 0;
  }

  update() {
    for (const p of this.particles) p.update();
    this.particles = this.particles.filter((p) => p.alive());
    for (const p of this.popups) p.update();
    this.popups = this.popups.filter((p) => p.alive());
    if (this.shakeTime > 0) this.shakeTime--;
  }

  draw(ctx, cameraX) {
    for (const p of this.particles) p.draw(ctx, cameraX);
    for (const p of this.popups) p.draw(ctx, cameraX);
  }

  // ── Efeitos prontos ─────────────────────────────────────
  dust(x, y) {
    for (let i = 0; i < 6; i++) {
      this.particles.push(
        new Particle({
          x: x + randRange(-6, 6),
          y,
          vx: randRange(-1.5, 1.5),
          vy: randRange(-2, -0.5),
          life: 24,
          color: '#fef3c7',
          size: randRange(2, 4),
          gravity: 0.15,
        }),
      );
    }
  }
  stars(x, y, color = '#fde047') {
    for (let i = 0; i < 10; i++) {
      const ang = randRange(0, Math.PI * 2);
      const sp = randRange(2, 5);
      this.particles.push(
        new Particle({
          x,
          y,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp - 2,
          life: 30,
          color,
          size: randRange(3, 6),
          gravity: 0.18,
          type: 'star',
        }),
      );
    }
  }
  hitSpark(x, y) {
    for (let i = 0; i < 8; i++) {
      const ang = randRange(-Math.PI, 0);
      const sp = randRange(3, 6);
      this.particles.push(
        new Particle({
          x,
          y,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          life: 20,
          color: '#fca5a5',
          size: randRange(2, 4),
          gravity: 0.25,
          type: 'square',
        }),
      );
    }
  }
  collect(x, y, points, color = '#fef3c7') {
    for (let i = 0; i < 6; i++) {
      this.particles.push(
        new Particle({
          x,
          y,
          vx: randRange(-2, 2),
          vy: randRange(-3, -1),
          life: 22,
          color,
          size: 2.5,
          gravity: 0.12,
        }),
      );
    }
    this.popups.push(new TextPopup(x, y - 6, `+${points}`, color));
  }
  shake(magnitude, frames) {
    this.shakeMag = Math.max(this.shakeMag, magnitude);
    this.shakeTime = Math.max(this.shakeTime, frames);
  }
  getShakeOffset() {
    if (this.shakeTime <= 0) return { x: 0, y: 0 };
    const m = this.shakeMag * (this.shakeTime / 12);
    return { x: randRange(-m, m), y: randRange(-m, m) };
  }
}

const FX = new FxManager();
