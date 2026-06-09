// Lichião — chefe final. Lichia GIGANTE com 3 HP. Pula periodicamente,
// solta lichias pequenas durante o pulo, fica vermelho/pisca quando atingido.
// Derrotado pulando 3 vezes na cabeça (com invencibilidade entre golpes).

class Boss {
  constructor(x, y, arenaMinX, arenaMaxX) {
    this.x = x;
    this.y = y;
    this.w = 80;
    this.h = 80;
    this.vx = -2;
    this.vy = 0;
    this.hp = 3;
    this.maxHp = 3;
    this.invuln = 0;
    this.flash = 0;
    this.active = false; // ativado quando o player entra na arena
    this.dead = false;
    this.deathTick = 0;
    this.minX = arenaMinX;
    this.maxX = arenaMaxX;
    this.spinTick = 0;
    this.jumpCooldown = 90;
    this.spawnedThisJump = false;
    this.spawns = []; // mini-lichias
  }

  activate() {
    if (!this.active) {
      this.active = true;
      Audio.sfx('boss');
    }
  }

  update(level, player) {
    if (this.dead) {
      this.deathTick++;
      this.y += 2;
      for (const s of this.spawns) s.update(level);
      return;
    }
    if (!this.active) return;

    this.spinTick++;
    if (this.invuln > 0) this.invuln--;
    if (this.flash > 0) this.flash--;

    // anda
    this.vy += 0.55;
    this.x += this.vx;
    this.y += this.vy;

    // bordas da arena
    if (this.x < this.minX) {
      this.x = this.minX;
      this.vx = Math.abs(this.vx);
    }
    if (this.x + this.w > this.maxX) {
      this.x = this.maxX - this.w;
      this.vx = -Math.abs(this.vx);
    }

    // colisão com plataformas
    let onGround = false;
    for (const p of level.platforms) {
      if (aabb(this, p)) {
        if (this.vy > 0) {
          this.y = p.y - this.h;
          this.vy = 0;
          onGround = true;
        } else if (this.vy < 0) {
          this.y = p.y + p.h;
          this.vy = 0;
        }
      }
    }

    // pula periodicamente
    if (onGround) {
      this.jumpCooldown--;
      this.spawnedThisJump = false;
      if (this.jumpCooldown <= 0) {
        this.vy = -10;
        this.jumpCooldown = 100 + randInt(0, 60);
        Audio.sfx('jump');
      }
    } else if (!this.spawnedThisJump && this.vy > 0) {
      // no auge do pulo, solta um filhote
      this.spawnedThisJump = true;
      this.spawns.push(new Lichia(this.x + this.w / 2 - 14, this.y + this.h, 60));
    }

    // colisão com player
    if (aabb(player, this) && this.invuln === 0) {
      const fromAbove = player.vy > 0 && player.y + player.h - this.y < 24;
      if (fromAbove) {
        this.hp--;
        this.invuln = 60;
        this.flash = 30;
        player.bounceOnEnemy();
        FX.stars(this.x + this.w / 2, this.y, '#fde047');
        FX.shake(6, 12);
        Audio.sfx('stomp');
        this.vx = this.vx * 1.05;
        if (this.hp <= 0) {
          this.dead = true;
          this.deathTick = 0;
          FX.stars(this.x + this.w / 2, this.y + this.h / 2, '#facc15');
          FX.shake(10, 30);
          Audio.sfx('win');
        }
      } else if (player.invincibleFrames === 0) {
        const pushDir = player.x < this.x ? -1 : 1;
        player.takeHit({ pushX: 4 * pushDir });
        FX.shake(6, 16);
      }
    }

    // mini-lichias atualizam e colidem com o player
    for (const s of this.spawns) {
      if (s.alive) s.update(level);
      if (s.alive && aabb(player, s)) {
        const fromAbove = player.vy > 0 && player.y + player.h - s.y < 18;
        if (fromAbove) {
          s.defeat();
          player.bounceOnEnemy();
          FX.stars(s.x + s.w / 2, s.y, '#fbbf24');
          Audio.sfx('stomp');
        } else if (player.invincibleFrames === 0) {
          const pushDir = player.x < s.x ? -1 : 1;
          player.takeHit({ pushX: 3 * pushDir });
        }
      }
    }
    this.spawns = this.spawns.filter((s) => !s.shouldRemove());
  }

  shouldShowDiploma() {
    return this.dead && this.deathTick > 40;
  }

  draw(ctx, cameraX) {
    if (!this.active && this.x - cameraX > 960) return;
    const x = Math.round(this.x - cameraX);
    const y = Math.round(this.y);
    const cx = x + this.w / 2;
    const cy = y + this.h / 2;
    const r = this.w / 2;

    let alpha = 1;
    if (this.dead) alpha = clamp(1 - this.deathTick / 60, 0, 1);
    ctx.globalAlpha = alpha;

    // base sombra
    ctx.fillStyle = this.flash > 0 && Math.floor(this.flash / 4) % 2 === 0 ? '#fef3c7' : '#7f1d1d';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = this.flash > 0 && Math.floor(this.flash / 4) % 2 === 0 ? '#fde047' : '#b91c1c';
    ctx.beginPath();
    ctx.arc(cx - 4, cy - 4, r - 6, 0, Math.PI * 2);
    ctx.fill();

    // brilho
    ctx.fillStyle = '#fca5a5';
    ctx.beginPath();
    ctx.arc(cx - 10, cy - 14, 8, 0, Math.PI * 2);
    ctx.fill();

    // muitos espinhos rodando
    ctx.fillStyle = '#5a0f0f';
    const spikes = 18;
    const baseAng = (this.spinTick / 25) % (Math.PI * 2);
    for (let i = 0; i < spikes; i++) {
      const ang = baseAng + (i / spikes) * Math.PI * 2;
      const sx = cx + Math.cos(ang) * (r - 2);
      const sy = cy + Math.sin(ang) * (r - 2);
      const tipX = cx + Math.cos(ang) * (r + 12);
      const tipY = cy + Math.sin(ang) * (r + 12);
      const px = cx + Math.cos(ang + 0.18) * (r - 1);
      const py = cy + Math.sin(ang + 0.18) * (r - 1);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(tipX, tipY);
      ctx.lineTo(px, py);
      ctx.closePath();
      ctx.fill();
    }

    if (!this.dead) {
      // olhos zangados
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(cx - 18, cy - 10, 12, 12);
      ctx.fillRect(cx + 6, cy - 10, 12, 12);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx - 14, cy - 4, 6, 6);
      ctx.fillRect(cx + 10, cy - 4, 6, 6);
      // sobrancelha
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy - 14);
      ctx.lineTo(cx - 6, cy - 8);
      ctx.moveTo(cx + 20, cy - 14);
      ctx.lineTo(cx + 6, cy - 8);
      ctx.stroke();
      // boca brava
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy + 12);
      ctx.quadraticCurveTo(cx, cy + 6, cx + 10, cy + 12);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    // filhotes
    for (const s of this.spawns) s.draw(ctx, cameraX);
  }
}
