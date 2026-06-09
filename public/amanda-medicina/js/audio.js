// Áudio 100% gerado por código via Web Audio API.
// Nada de arquivos: SFX como osciladores curtos, música em loop com
// notas escalonadas. AudioContext é criado preguiçosamente na primeira
// interação do usuário (regra dos browsers modernos).

class AudioManager {
  constructor() {
    this.muted = false;
    this.ctx = null;
    this.musicTimer = null;
    this.musicGain = null;
    this.melodyIndex = 0;
    this.startedMusic = false;
  }

  _ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return true;
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.musicGain) {
      this.musicGain.gain.value = 0;
    } else if (this.musicGain) {
      this.musicGain.gain.value = 0.06;
    }
  }

  /** Toca um SFX. type: 'jump' | 'hit' | 'coin' | 'stomp' | 'powerup' | 'boss' | 'win'. */
  sfx(type) {
    if (this.muted) return;
    if (!this._ensure()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const tone = (freqFrom, freqTo, dur, gainPeak, wave = 'square') => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freqFrom, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqTo), now + dur);
      g.gain.setValueAtTime(gainPeak, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.02);
    };

    const noise = (dur, gainPeak) => {
      const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
      const src = ctx.createBufferSource();
      const g = ctx.createGain();
      src.buffer = buf;
      g.gain.setValueAtTime(gainPeak, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      src.connect(g);
      g.connect(ctx.destination);
      src.start(now);
      src.stop(now + dur + 0.02);
    };

    switch (type) {
      case 'jump':
        tone(420, 820, 0.12, 0.14, 'square');
        break;
      case 'stomp':
        tone(220, 80, 0.18, 0.2, 'sawtooth');
        noise(0.08, 0.08);
        break;
      case 'hit':
        tone(180, 60, 0.25, 0.22, 'square');
        noise(0.1, 0.1);
        break;
      case 'coin':
        tone(880, 1320, 0.08, 0.1, 'square');
        setTimeout(() => tone(1320, 1760, 0.08, 0.1, 'square'), 60);
        break;
      case 'powerup':
        tone(440, 660, 0.08, 0.15, 'square');
        setTimeout(() => tone(660, 990, 0.1, 0.15, 'square'), 70);
        setTimeout(() => tone(990, 1320, 0.12, 0.18, 'square'), 150);
        break;
      case 'boss':
        tone(120, 70, 0.5, 0.18, 'sawtooth');
        noise(0.3, 0.08);
        break;
      case 'win':
        tone(523, 523, 0.12, 0.18, 'triangle');
        setTimeout(() => tone(659, 659, 0.12, 0.18, 'triangle'), 130);
        setTimeout(() => tone(784, 784, 0.12, 0.18, 'triangle'), 260);
        setTimeout(() => tone(1046, 1046, 0.3, 0.22, 'triangle'), 390);
        break;
      case 'dialog':
        tone(660, 760, 0.04, 0.06, 'square');
        break;
    }
  }

  /** Música em loop: melodia simples baseada em escala maior. */
  startMusic() {
    if (this.startedMusic) return;
    if (!this._ensure()) return;
    this.startedMusic = true;

    const ctx = this.ctx;
    this.musicGain = ctx.createGain();
    this.musicGain.gain.value = this.muted ? 0 : 0.06;
    this.musicGain.connect(ctx.destination);

    // notas (Hz) — uma melodia alegre em Dó maior + baixo
    const melody = [
      523, 659, 784, 659, 523, 659, 784, 1046,
      784, 659, 523, 587, 659, 587, 523, 0,
      587, 698, 880, 698, 587, 698, 880, 1174,
      880, 698, 587, 659, 698, 659, 587, 0,
    ];
    const bass = [
      131, 0, 196, 0, 131, 0, 196, 0,
      131, 0, 196, 0, 131, 0, 196, 0,
      147, 0, 220, 0, 147, 0, 220, 0,
      147, 0, 220, 0, 147, 0, 220, 0,
    ];
    const NOTE_MS = 180;
    this.melodyIndex = 0;

    const tick = () => {
      if (!this.musicGain) return;
      const i = this.melodyIndex % melody.length;
      const now = ctx.currentTime;
      const playOne = (freq, wave, peak, dur) => {
        if (!freq) return;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = wave;
        osc.frequency.setValueAtTime(freq, now);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(peak, now + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(g);
        g.connect(this.musicGain);
        osc.start(now);
        osc.stop(now + dur + 0.05);
      };
      playOne(melody[i], 'triangle', 0.5, 0.16);
      playOne(bass[i], 'sawtooth', 0.35, 0.16);
      this.melodyIndex++;
    };
    this.musicTimer = setInterval(tick, NOTE_MS);
  }

  stopMusic() {
    if (this.musicTimer) clearInterval(this.musicTimer);
    this.musicTimer = null;
    if (this.musicGain) this.musicGain.disconnect();
    this.musicGain = null;
    this.startedMusic = false;
  }
}

const Audio = new AudioManager();
