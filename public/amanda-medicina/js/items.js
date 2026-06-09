// Itens coletáveis. Tematizados como objetos da vida de medicina.

class Yogoberry {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 22;
    this.h = 24;
    this.taken = false;
    this.bobTick = Math.random() * Math.PI * 2;
  }
  update() {
    this.bobTick += 0.08;
  }
  draw(ctx, cameraX) {
    if (this.taken) return;
    const x = Math.round(this.x - cameraX);
    const y = Math.round(this.y + Math.sin(this.bobTick) * 2);

    ctx.fillStyle = '#f472b6';
    ctx.fillRect(x + 1, y + 6, this.w - 2, this.h - 8);
    ctx.fillStyle = '#db2777';
    ctx.fillRect(x + 1, y + this.h - 4, this.w - 2, 2);
    ctx.fillStyle = '#fdf2f8';
    ctx.fillRect(x, y + 2, this.w, 6);
    ctx.fillStyle = '#fbcfe8';
    ctx.fillRect(x, y + 2, this.w, 2);
    ctx.fillStyle = '#9d174d';
    ctx.fillRect(x + 7, y + 12, 2, 2);
    ctx.fillRect(x + 11, y + 12, 2, 2);
    ctx.fillRect(x + 9, y + 16, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 3, y + 4, 2, 2);
  }
}

class Cafe {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 22;
    this.h = 24;
    this.taken = false;
    this.bobTick = Math.random() * Math.PI * 2;
  }
  update() {
    this.bobTick += 0.09;
  }
  draw(ctx, cameraX) {
    if (this.taken) return;
    const x = Math.round(this.x - cameraX);
    const y = Math.round(this.y + Math.sin(this.bobTick) * 2);

    // copo
    ctx.fillStyle = '#a16207';
    ctx.fillRect(x + 2, y + 6, this.w - 4, this.h - 8);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(x, y + 4, this.w, 4);
    // tampinha vermelha
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x + 4, y, this.w - 8, 4);
    // alça
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + this.w + 1, y + 14, 4, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    // vapor
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 1.5;
    const t = this.bobTick;
    ctx.beginPath();
    ctx.moveTo(x + 8, y - 2);
    ctx.bezierCurveTo(x + 6 + Math.sin(t) * 2, y - 6, x + 10, y - 8, x + 8, y - 12);
    ctx.moveTo(x + 14, y - 2);
    ctx.bezierCurveTo(x + 16 + Math.sin(t + 1) * 2, y - 6, x + 12, y - 8, x + 14, y - 12);
    ctx.stroke();
  }
}

class Estetoscopio {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 18;
    this.taken = false;
    this.bobTick = Math.random() * Math.PI * 2;
  }
  update() {
    this.bobTick += 0.1;
  }
  draw(ctx, cameraX) {
    if (this.taken) return;
    const x = Math.round(this.x - cameraX);
    const y = Math.round(this.y + Math.sin(this.bobTick) * 2);
    // tubo (arco)
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x + this.w / 2, y + 4, 8, Math.PI, 0);
    ctx.stroke();
    // diafragma
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(x + this.w / 2, y + this.h - 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(x + this.w / 2, y + this.h - 2, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Seringa atirada pela Amanda. Viaja horizontal, mata lichia ao tocar,
 * some ao bater em plataforma ou após atingir distância máxima.
 */
class Syringe {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.w = 22;
    this.h = 8;
    this.vx = 10 * dir;
    this.dir = dir;
    this.life = 60; // frames antes de sumir
    this.dead = false;
    this.spawnX = x;
    this.maxRange = 380;
  }
  update(level) {
    this.x += this.vx;
    this.life--;
    if (this.life <= 0 || Math.abs(this.x - this.spawnX) > this.maxRange) {
      this.dead = true;
      return;
    }
    // colisão com plataformas
    for (const p of level.platforms) {
      if (aabb(this, p)) {
        this.dead = true;
        if (typeof FX !== 'undefined') FX.hitSpark(this.x + this.w / 2, this.y);
        return;
      }
    }
  }
  draw(ctx, cameraX) {
    if (this.dead) return;
    const x = Math.round(this.x - cameraX);
    const y = Math.round(this.y);
    // corpo (cilindro transparente com líquido azul)
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(x + 4, y + 1, 14, 6);
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(x + 6, y + 2, 10, 4);
    // êmbolo
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + (this.dir > 0 ? 0 : 18), y, 4, 8);
    // agulha
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + (this.dir > 0 ? 18 : 0), y + 3, 4, 2);
    // brilho
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(x + 7, y + 2, 6, 1);
  }
}

class Livro {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 18;
    this.h = 14;
    this.taken = false;
    this.bobTick = Math.random() * Math.PI * 2;
  }
  update() {
    this.bobTick += 0.1;
  }
  draw(ctx, cameraX) {
    if (this.taken) return;
    const x = Math.round(this.x - cameraX);
    const y = Math.round(this.y + Math.sin(this.bobTick) * 2);
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(x, y, this.w, this.h);
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(x + 2, y + 2, this.w - 4, this.h - 4);
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(x + this.w / 2 - 1, y + 1, 2, this.h - 2);
    ctx.fillStyle = '#5eead4';
    ctx.fillRect(x + 1, y + 1, 2, 1);
  }
}

class Diploma {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 40;
    this.h = 50;
    this.taken = false;
    this.glowTick = 0;
    this.hidden = false; // diploma só aparece após chefe morrer
  }
  update() {
    this.glowTick += 0.06;
  }
  draw(ctx, cameraX) {
    if (this.taken || this.hidden) return;
    const x = Math.round(this.x - cameraX);
    const y = Math.round(this.y);
    const glow = 8 + Math.sin(this.glowTick) * 4;

    ctx.fillStyle = 'rgba(250, 204, 21, 0.25)';
    ctx.beginPath();
    ctx.arc(x + this.w / 2, y + this.h / 2, this.w / 2 + glow, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(x + 4, y + 8, this.w - 8, this.h - 16);
    ctx.strokeStyle = '#a16207';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + 4, y + 8, this.w - 8, this.h - 16);
    ctx.fillStyle = '#a16207';
    for (let i = 0; i < 4; i++) {
      ctx.fillRect(x + 8, y + 14 + i * 6, this.w - 16, 1);
    }
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(x + 2, y + 4, this.w - 4, 6);
    ctx.fillRect(x + 2, y + this.h - 10, this.w - 4, 6);
    ctx.strokeRect(x + 2, y + 4, this.w - 4, 6);
    ctx.strokeRect(x + 2, y + this.h - 10, this.w - 4, 6);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(x + this.w / 2 - 3, y, 6, this.h);
    ctx.fillRect(x + this.w / 2 - 6, y - 2, 12, 6);
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(x + this.w / 2 - 2, y + 4, 2, this.h - 8);
  }
}
