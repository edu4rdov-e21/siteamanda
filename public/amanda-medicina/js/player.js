// Amanda — caixa 28x44. Inclui power-ups: café (velocidade), jaleco (escudo
// que absorve 1 hit), diploma temp (pulo duplo).

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 28;
    this.h = 44;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.facing = 1;
    this.lives = 3;
    this.maxLives = 3;
    this.invincibleFrames = 0;
    this.dead = false;
    this.spawnX = x;
    this.spawnY = y;
    this.coyoteFrames = 0;
    this.animTick = 0;
    this.bouncePulse = 0;

    // power-ups
    this.shield = false;
    this.activePower = null; // { type: 'cafe' | 'diploma', timer: frames }
    this.doubleJumpAvailable = false;
    this.canDoubleJump = false;
    this.syringeAmmo = 0;
    this.shootCooldown = 0;
  }

  reset() {
    this.x = this.spawnX;
    this.y = this.spawnY;
    this.vx = 0;
    this.vy = 0;
    this.lives = this.maxLives;
    this.invincibleFrames = 0;
    this.dead = false;
    this.facing = 1;
    this.shield = false;
    this.activePower = null;
    this.doubleJumpAvailable = false;
    this.canDoubleJump = false;
    this.syringeAmmo = 0;
    this.shootCooldown = 0;
  }

  update(level) {
    if (this.dead) return;

    const SPEED_BASE = 4;
    const MOVE_SPEED = this.activePower?.type === 'cafe' ? SPEED_BASE * 1.6 : SPEED_BASE;
    const ACCEL = 0.6;
    const FRICTION = 0.7;
    let targetVx = 0;
    if (Input.left) targetVx -= MOVE_SPEED;
    if (Input.right) targetVx += MOVE_SPEED;

    if (targetVx !== 0) {
      this.vx += Math.sign(targetVx) * ACCEL;
      this.vx = clamp(this.vx, -MOVE_SPEED, MOVE_SPEED);
      this.facing = Math.sign(targetVx);
    } else {
      this.vx *= FRICTION;
      if (Math.abs(this.vx) < 0.1) this.vx = 0;
    }

    const GRAVITY = 0.55;
    const JUMP_VEL = -11;
    const JUMP_CUT = 0.5;

    this.vy += GRAVITY;
    if (this.vy > 16) this.vy = 16;

    const canCoyote = this.coyoteFrames > 0;
    if ((this.onGround || canCoyote) && Input.jumpBuffer > 0) {
      this.vy = JUMP_VEL;
      this.onGround = false;
      this.coyoteFrames = 0;
      Input.jumpBuffer = 0;
      this.canDoubleJump = this.doubleJumpAvailable; // arma o duplo pulo
      Audio.sfx('jump');
    } else if (!this.onGround && this.canDoubleJump && Input.jumpPressed) {
      this.vy = JUMP_VEL * 0.85;
      this.canDoubleJump = false;
      FX.dust(this.x + this.w / 2, this.y + this.h);
      Audio.sfx('jump');
    }
    if (!Input.jump && this.vy < 0) this.vy *= JUMP_CUT;

    this.x += this.vx;
    this._collideAxis(level, 'x');
    this.y += this.vy;
    const wasOnGround = this.onGround;
    this.onGround = false;
    this._collideAxis(level, 'y');

    // efeito ao aterrissar
    if (!wasOnGround && this.onGround && this.bouncePulse === 0) {
      FX.dust(this.x + this.w / 2, this.y + this.h);
    }

    if (wasOnGround && !this.onGround && this.vy >= 0) {
      this.coyoteFrames = 6;
    } else if (this.coyoteFrames > 0) {
      this.coyoteFrames--;
    }

    if (this.invincibleFrames > 0) this.invincibleFrames--;
    if (this.shootCooldown > 0) this.shootCooldown--;
    if (this.activePower) {
      this.activePower.timer--;
      if (this.activePower.timer <= 0) {
        if (this.activePower.type === 'diploma') {
          this.doubleJumpAvailable = false;
        }
        this.activePower = null;
      }
    }

    // queda fatal
    if (this.y > level.height + 200) {
      this.takeHit({ pushX: 0, fatal: true });
    }

    if (this.bouncePulse > 0) this.bouncePulse--;
    this.animTick++;
  }

  _collideAxis(level, axis) {
    for (const p of level.platforms) {
      if (aabb(this, p)) {
        if (axis === 'x') {
          if (this.vx > 0) this.x = p.x - this.w;
          else if (this.vx < 0) this.x = p.x + p.w;
          this.vx = 0;
        } else {
          if (this.vy > 0) {
            this.y = p.y - this.h;
            this.onGround = true;
          } else if (this.vy < 0) {
            this.y = p.y + p.h;
          }
          this.vy = 0;
        }
      }
    }
  }

  takeHit({ pushX = 0, fatal = false } = {}) {
    if (this.invincibleFrames > 0 && !fatal) return;
    // escudo absorve 1 hit
    if (this.shield && !fatal) {
      this.shield = false;
      this.invincibleFrames = 60;
      FX.hitSpark(this.x + this.w / 2, this.y + this.h / 2);
      FX.shake(4, 12);
      Audio.sfx('hit');
      return;
    }
    this.lives -= fatal ? this.lives : 1;
    FX.hitSpark(this.x + this.w / 2, this.y + this.h / 2);
    FX.shake(8, 20);
    Audio.sfx('hit');
    if (this.lives <= 0) {
      this.lives = 0;
      this.dead = true;
      return;
    }
    this.invincibleFrames = 90;
    this.vx = pushX;
    this.vy = -6;
  }

  heal() {
    this.lives = Math.min(this.maxLives, this.lives + 1);
    this.invincibleFrames = 45;
    Audio.sfx('powerup');
  }

  giveCafe() {
    this.activePower = { type: 'cafe', timer: 60 * 10 };
    Audio.sfx('powerup');
  }
  giveShield() {
    this.shield = true;
    Audio.sfx('powerup');
  }
  giveSyringes(n = 2) {
    this.syringeAmmo = Math.min(8, this.syringeAmmo + n);
    Audio.sfx('powerup');
  }
  /** Dispara uma seringa se tiver munição. Retorna o projétil ou null. */
  shoot() {
    if (this.syringeAmmo <= 0 || this.shootCooldown > 0) return null;
    this.syringeAmmo--;
    this.shootCooldown = 12;
    const spawnX = this.facing > 0 ? this.x + this.w : this.x - 22;
    return new Syringe(spawnX, this.y + 22, this.facing);
  }
  giveDiplomaTemp() {
    this.activePower = { type: 'diploma', timer: 60 * 12 };
    this.doubleJumpAvailable = true;
    Audio.sfx('powerup');
  }

  bounceOnEnemy() {
    this.vy = -9;
    this.bouncePulse = 8;
    if (this.doubleJumpAvailable) this.canDoubleJump = true;
  }

  draw(ctx, cameraX) {
    if (this.invincibleFrames > 0 && Math.floor(this.invincibleFrames / 4) % 2 === 0) {
      return;
    }
    const x = Math.round(this.x - cameraX);
    const y = Math.round(this.y);
    const w = this.w;
    const h = this.h;

    // sapato
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 2, y + h - 4, w / 2, 4);
    ctx.fillRect(x + w / 2 + 2, y + h - 4, w / 2 - 2, 4);

    // saia/calça
    ctx.fillStyle = '#fbcfe8';
    ctx.fillRect(x, y + h - 16, w, 12);

    // jaleco branco + indicador de escudo
    ctx.fillStyle = this.shield ? '#dbeafe' : '#ffffff';
    ctx.fillRect(x - 2, y + 14, w + 4, h - 28);
    if (this.shield) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 2, y + 14, w + 4, h - 28);
    }

    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x + w / 2 - 1, y + 16, 2, h - 32);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + w / 2 - 2, y + 22, 2, 2);
    ctx.fillRect(x + w / 2 - 2, y + 30, 2, 2);

    // pescoço
    ctx.fillStyle = '#fde6d3';
    ctx.fillRect(x + 8, y + 10, w - 16, 4);

    // rosto
    ctx.fillStyle = '#fde6d3';
    ctx.fillRect(x + 4, y, w - 8, 14);

    // cabelo
    ctx.fillStyle = '#7c3a17';
    ctx.fillRect(x + 2, y - 4, w - 4, 8);
    ctx.fillRect(x, y + 2, 4, 12);
    ctx.fillRect(x + w - 4, y + 2, 4, 12);
    if (this.facing > 0) {
      ctx.fillRect(x + 4, y + 2, w - 14, 4);
    } else {
      ctx.fillRect(x + 10, y + 2, w - 14, 4);
    }

    // olhos
    ctx.fillStyle = '#1e293b';
    if (this.facing > 0) {
      ctx.fillRect(x + 8, y + 7, 2, 2);
      ctx.fillRect(x + 16, y + 7, 2, 2);
    } else {
      ctx.fillRect(x + 10, y + 7, 2, 2);
      ctx.fillRect(x + 18, y + 7, 2, 2);
    }

    ctx.fillStyle = '#be185d';
    ctx.fillRect(x + 12, y + 11, 4, 1);

    // estetoscópio
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 18, 5, Math.PI, 0);
    ctx.stroke();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + w / 2 + 4, y + 22, 3, 6);

    // aura de café (rastros amarelados)
    if (this.activePower?.type === 'cafe') {
      const t = this.animTick;
      ctx.fillStyle = `rgba(252, 211, 77, ${0.3 + Math.sin(t / 4) * 0.1})`;
      ctx.fillRect(x - this.facing * 6, y + 12, 4, h - 16);
    }
    // aura de diploma (estrelinhas leves)
    if (this.activePower?.type === 'diploma' && this.animTick % 6 === 0) {
      FX.particles.push(
        new Particle({
          x: this.x + this.w / 2 + randRange(-this.w / 2, this.w / 2),
          y: this.y + randRange(0, this.h),
          vx: randRange(-0.5, 0.5),
          vy: -1.5,
          life: 18,
          color: '#facc15',
          size: 2,
          gravity: 0,
          type: 'star',
        }),
      );
    }
  }
}
