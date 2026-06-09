// Eduardo — NPC parceiro. Visualmente diferente da Amanda (cabelo escuro,
// camisa azul, óculos). Mostra balão de fala quando a Amanda chega perto.
// Pode entregar um power-up (jaleco/shield) na primeira vez que aciona.

class Eduardo {
  constructor(x, y, lines, { givesShield = false } = {}) {
    this.x = x;
    this.y = y;
    this.w = 30;
    this.h = 46;
    this.lines = lines;
    this.lineIdx = 0;
    this.activeBubble = 0; // frames restantes mostrando
    this.greeted = false;
    this.givesShield = givesShield;
    this.gaveShield = false;
    this.bobTick = Math.random() * Math.PI * 2;
  }

  update(player) {
    this.bobTick += 0.06;
    const dx = player.x + player.w / 2 - (this.x + this.w / 2);
    const dist = Math.abs(dx);
    if (dist < 70 && !this.greeted) {
      this.greeted = true;
      this.activeBubble = 220;
      Audio.sfx('dialog');
      if (this.givesShield && !this.gaveShield) {
        this.gaveShield = true;
        player.giveShield();
        Audio.sfx('powerup');
      }
    }
    if (this.activeBubble > 0) this.activeBubble--;
  }

  draw(ctx, cameraX) {
    const bobY = Math.sin(this.bobTick) * 1.5;
    const x = Math.round(this.x - cameraX);
    const y = Math.round(this.y + bobY);
    const w = this.w;
    const h = this.h;

    // sapato
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y + h - 4, w / 2 - 1, 4);
    ctx.fillRect(x + w / 2 + 1, y + h - 4, w / 2 - 1, 4);

    // calça
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(x + 2, y + h - 18, w - 4, 14);

    // camisa azul
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(x, y + 14, w, h - 32);
    // botões
    ctx.fillStyle = '#bfdbfe';
    ctx.fillRect(x + w / 2 - 1, y + 18, 2, 2);
    ctx.fillRect(x + w / 2 - 1, y + 26, 2, 2);
    ctx.fillRect(x + w / 2 - 1, y + 34, 2, 2);

    // pescoço
    ctx.fillStyle = '#fde6d3';
    ctx.fillRect(x + 8, y + 10, w - 16, 4);

    // rosto
    ctx.fillStyle = '#fde6d3';
    ctx.fillRect(x + 4, y - 2, w - 8, 16);

    // cabelo escuro
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 2, y - 6, w - 4, 8);
    ctx.fillRect(x, y, 4, 8);
    ctx.fillRect(x + w - 4, y, 4, 8);
    // franja lateral
    ctx.fillRect(x + 4, y, 6, 4);

    // olhos (sem óculos)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 9, y + 7, 2, 2);
    ctx.fillRect(x + 19, y + 7, 2, 2);

    // sobrancelhinhas
    ctx.fillRect(x + 8, y + 5, 4, 1);
    ctx.fillRect(x + 18, y + 5, 4, 1);

    // boquinha sorridente
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x + 11, y + 11);
    ctx.quadraticCurveTo(x + 15, y + 13, x + 19, y + 11);
    ctx.stroke();

    // plaquinha de nome flutuando acima da cabeça
    const labelY = y - 14;
    ctx.font = 'bold 11px system-ui';
    const labelW = ctx.measureText('Eduardo').width + 12;
    const labelX = x + w / 2 - labelW / 2;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(labelX, labelY - 8, labelW, 14);
    ctx.fillStyle = '#fde68a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Eduardo', x + w / 2, labelY - 1);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // estrela acima quando greeted=false (indicador "fale comigo")
    if (!this.greeted) {
      const bob = Math.sin(this.bobTick * 2) * 3;
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 18px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('!', x + w / 2, y - 32 + bob);
      ctx.textAlign = 'left';
    }

    // balão (acima do label)
    if (this.activeBubble > 0) {
      const alpha = clamp(this.activeBubble / 60, 0, 1);
      const line = this.lines[Math.min(this.lineIdx, this.lines.length - 1)];
      drawSpeechBubble(ctx, line, x + w / 2, y - 28, alpha);
    }
  }
}
