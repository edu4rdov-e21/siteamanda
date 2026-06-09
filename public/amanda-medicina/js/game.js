// Estado global do jogo. Máquina de estados (menu, jogando, gameover, vitória)
// + contadores (pontos, itens, tempo) e cálculo da nota final.

const GameState = {
  MENU: 'menu',
  PLAYING: 'playing',
  GAMEOVER: 'gameover',
  VICTORY: 'victory',
};

class Game {
  constructor() {
    this.state = GameState.MENU;
    this.stateTimer = 0;
    this.score = 0;
    this.itemsCollected = 0;
    this.itemsTotal = 0; // setado pelo level
    this.timeFrames = 0; // frames totais jogando
    this.cameraX = 0;
    this.cameraTargetX = 0;
    this.grade = null; // calculada ao vencer
  }

  reset() {
    this.state = GameState.PLAYING;
    this.stateTimer = 0;
    this.score = 0;
    this.itemsCollected = 0;
    this.timeFrames = 0;
    this.cameraX = 0;
    this.cameraTargetX = 0;
    this.grade = null;
  }

  go(state) {
    this.state = state;
    this.stateTimer = 0;
  }

  tick() {
    this.stateTimer++;
    if (this.state === GameState.PLAYING) this.timeFrames++;
  }

  /** Calcula nota A+/A/B/C com base em desempenho. */
  calcGrade(player) {
    const itemsPct = this.itemsTotal > 0 ? this.itemsCollected / this.itemsTotal : 0;
    const livesBonus = player.lives / player.maxLives; // 0–1
    const timeSeconds = this.timeFrames / 60;
    // referência: 2 minutos é "rápido"; 5 minutos é "devagar"
    const timeBonus = clamp(1 - (timeSeconds - 90) / 240, 0, 1);

    const score = itemsPct * 0.45 + livesBonus * 0.35 + timeBonus * 0.2;

    let letter, color, msg;
    if (score >= 0.9) {
      letter = 'A+';
      color = '#facc15';
      msg = 'Nota máxima! Amanda já pode dar plantão.';
    } else if (score >= 0.75) {
      letter = 'A';
      color = '#22c55e';
      msg = 'Excelente! Pronta pra residência.';
    } else if (score >= 0.55) {
      letter = 'B';
      color = '#38bdf8';
      msg = 'Bom desempenho. Mas dá pra mais.';
    } else {
      letter = 'C';
      color = '#f87171';
      msg = 'Passou raspando. Rejoga pra A+!';
    }

    this.grade = {
      letter,
      color,
      msg,
      itemsPct: Math.round(itemsPct * 100),
      timeSeconds: Math.round(timeSeconds),
      lives: player.lives,
      maxLives: player.maxLives,
      raw: Math.round(score * 100),
    };
  }
}

const G = new Game();
