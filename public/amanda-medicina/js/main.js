// Loop principal — orquestra os módulos. Máquina de estados, câmera com
// shake, render em ordem (BG → entidades → FX → HUD → overlays).

(function () {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  const W = canvas.width;
  const H = canvas.height;

  let level;
  let player;
  let background;

  let syringes = []; // projéteis ativos

  function newRun() {
    level = new Level();
    player = new Player(80, 380);
    background = new Background();
    syringes = [];
    G.reset();
    G.itemsTotal = level.totalCollectibles();
  }

  function start() {
    newRun();
    G.go(GameState.PLAYING);
    Audio.startMusic();
  }

  // primeira inicialização — vai pro menu
  newRun();
  G.go(GameState.MENU);

  function update() {
    G.tick();

    if (Input.mutePressed) Audio.toggleMute();

    if (G.state === GameState.MENU) {
      if (Input.startPressed) {
        start();
      }
      tickInput();
      return;
    }

    if (G.state === GameState.GAMEOVER || G.state === GameState.VICTORY) {
      if (Input.resetPressed) {
        newRun();
        G.go(GameState.PLAYING);
      }
      // FX continuam pra dar vida
      FX.update();
      tickInput();
      return;
    }

    // ── PLAYING ─────────────────────────────────────
    player.update(level);

    // tiro de seringa
    if (Input.shootPressed) {
      const proj = player.shoot();
      if (proj) {
        syringes.push(proj);
        Audio.sfx('coin'); // som curto pro tiro
      }
    }

    // ativa o chefe quando o player entra na arena
    if (level.boss && player.x > 3850) level.boss.activate();
    if (level.boss) {
      level.boss.update(level, player);
      if (level.boss.shouldShowDiploma()) {
        if (level.diploma.hidden) {
          level.diploma.hidden = false;
          // libera o caminho derrubando as paredes da arena
          level.platforms = level.platforms.filter((p) => !p.bossWall);
          FX.stars(4280, 380, '#facc15');
        }
      }
    }

    // câmera
    const targetCamX = player.x - W / 2 + player.w / 2;
    G.cameraX += (targetCamX - G.cameraX) * 0.12;
    G.cameraX = clamp(G.cameraX, 0, Math.max(0, level.width - W));

    // inimigos comuns
    for (const lichia of level.lichias) {
      lichia.update(level);
      if (!lichia.alive) continue;
      if (aabb(player, lichia)) {
        const fromAbove = player.vy > 0 && player.y + player.h - lichia.y < 18;
        if (fromAbove) {
          lichia.defeat();
          player.bounceOnEnemy();
          G.score += 50;
          FX.collect(lichia.x + lichia.w / 2, lichia.y, 50, '#fbbf24');
          Audio.sfx('stomp');
        } else if (player.invincibleFrames === 0) {
          const pushDir = player.x < lichia.x ? -1 : 1;
          player.takeHit({ pushX: 4 * pushDir });
        }
      }
    }
    level.lichias = level.lichias.filter((l) => !l.shouldRemove());

    // ── seringas: voar + colidir com lichias / boss / boss spawns ──
    for (const s of syringes) {
      s.update(level);
      if (s.dead) continue;
      for (const lichia of level.lichias) {
        if (lichia.alive && aabb(s, lichia)) {
          lichia.defeat();
          s.dead = true;
          G.score += 50;
          FX.collect(lichia.x + lichia.w / 2, lichia.y, 50, '#bae6fd');
          Audio.sfx('stomp');
          break;
        }
      }
      // boss + mini-lichias
      if (!s.dead && level.boss && level.boss.active && !level.boss.dead) {
        // mini-lichias do boss
        for (const mini of level.boss.spawns) {
          if (mini.alive && aabb(s, mini)) {
            mini.defeat();
            s.dead = true;
            G.score += 30;
            Audio.sfx('stomp');
            break;
          }
        }
        // boss propriamente: seringa causa 1 de dano se não invulnerável
        if (!s.dead && aabb(s, level.boss) && level.boss.invuln === 0) {
          level.boss.hp--;
          level.boss.invuln = 60;
          level.boss.flash = 30;
          s.dead = true;
          FX.stars(level.boss.x + level.boss.w / 2, level.boss.y, '#fde047');
          FX.shake(4, 10);
          Audio.sfx('stomp');
          if (level.boss.hp <= 0) {
            level.boss.dead = true;
            level.boss.deathTick = 0;
            FX.shake(10, 30);
            Audio.sfx('win');
          }
        }
      }
    }
    syringes = syringes.filter((s) => !s.dead);

    // coletáveis
    const collectStuff = (arr, points, color, onTake = null) => {
      for (const y of arr) {
        y.update();
        if (!y.taken && aabb(player, y)) {
          y.taken = true;
          G.score += points;
          G.itemsCollected++;
          FX.collect(y.x + y.w / 2, y.y, points, color);
          Audio.sfx('coin');
          if (onTake) onTake(y);
        }
      }
    };

    collectStuff(level.yogos, 100, '#f472b6', () => player.heal());
    collectStuff(level.cafes, 75, '#a16207', () => player.giveCafe());
    collectStuff(level.estetos, 60, '#cbd5e1', () => player.giveSyringes(2));
    collectStuff(level.livros, 25, '#5eead4');

    // diploma
    level.diploma.update();
    if (!level.diploma.hidden && !level.diploma.taken && aabb(player, level.diploma)) {
      level.diploma.taken = true;
      G.score += 500;
      G.calcGrade(player);
      G.go(GameState.VICTORY);
      Audio.sfx('win');
      FX.stars(level.diploma.x + 20, level.diploma.y + 20, '#facc15');
      FX.stars(level.diploma.x + 20, level.diploma.y + 20, '#fde047');
    }

    // NPCs
    for (const e of level.eduardos) e.update(player);

    // plaquinhas
    for (const p of level.plaques) p.update(player.x);

    // game over
    if (player.dead) {
      G.go(GameState.GAMEOVER);
    }

    FX.update();
    tickInput();
  }

  function render() {
    // shake offset
    const shake = FX.getShakeOffset();
    ctx.save();
    ctx.translate(shake.x, shake.y);

    background.draw(ctx, G.cameraX, W, H);

    // chão
    for (const p of level.platforms) {
      const px = p.x - G.cameraX;
      if (px + p.w < 0 || px > W) continue;
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(px, p.y, p.w, 6);
      ctx.fillStyle = '#854d0e';
      ctx.fillRect(px, p.y + 6, p.w, p.h - 6);
      ctx.fillStyle = '#713f12';
      for (let i = 4; i < p.w; i += 24) {
        ctx.fillRect(px + i, p.y + 14, 4, 4);
        ctx.fillRect(px + i + 8, p.y + 28, 3, 3);
      }
    }

    // plaquinhas
    for (const p of level.plaques) p.draw(ctx, G.cameraX);

    // itens
    for (const b of level.livros) b.draw(ctx, G.cameraX);
    for (const e of level.estetos) e.draw(ctx, G.cameraX);
    for (const c of level.cafes) c.draw(ctx, G.cameraX);
    for (const y of level.yogos) y.draw(ctx, G.cameraX);
    level.diploma.draw(ctx, G.cameraX);

    // inimigos
    for (const l of level.lichias) l.draw(ctx, G.cameraX);
    if (level.boss) level.boss.draw(ctx, G.cameraX);

    // NPCs
    for (const e of level.eduardos) e.draw(ctx, G.cameraX);

    // player
    player.draw(ctx, G.cameraX);

    // seringas em voo
    for (const s of syringes) s.draw(ctx, G.cameraX);

    // FX em cima
    FX.draw(ctx, G.cameraX);

    ctx.restore();

    // HUD
    Ui.drawHUD(ctx, W, player, G.score, level.boss);
    Ui.drawMute(ctx, W, Audio.muted);

    // overlays
    if (G.state === GameState.MENU) Ui.drawMenu(ctx, W, H, G.stateTimer);
    if (G.state === GameState.GAMEOVER) Ui.drawGameOver(ctx, W, H);
    if (G.state === GameState.VICTORY) Ui.drawVictory(ctx, W, H, G.grade, G.score);
  }

  function loop() {
    update();
    render();
    requestAnimationFrame(loop);
  }
  loop();
})();
