// Definição do nível inteiro: 3 zonas + arena do chefe + cerimônia.
// Inclui plataformas, lichias, itens, plaquinhas tutoriais, Eduardo (2 vezes)
// e o Lichião antes do diploma.

class Level {
  constructor() {
    this.width = 5000;
    this.height = 540;
    this.platforms = [];
    this.lichias = [];
    this.yogos = [];
    this.cafes = [];
    this.livros = []; // genéricos
    this.estetos = [];
    this.diploma = null;
    this.plaques = [];
    this.eduardos = [];
    this.boss = null;
    this.build();
  }

  build() {
    // ── ZONA 1: BIBLIOTECA (0–1300) ─────────────────────
    this._ground(0, 700);
    this._ground(820, 480);
    this._block(360, 380, 100, 16);
    this._block(540, 300, 100, 16);
    this._block(900, 360, 80, 16);
    this._block(1100, 280, 80, 16);

    this.lichias.push(new Lichia(300, 440, 80));
    this.lichias.push(new Lichia(900, 440, 100));
    this.lichias.push(new Lichia(560, 270, 60));

    // plaquinhas tutoriais
    this.plaques.push(new TutorialPlaque(140, '← → ou A/D pra andar'));
    this.plaques.push(new TutorialPlaque(240, 'ESPAÇO / W / ↑ pra pular (segura pra pular mais alto)'));
    this.plaques.push(new TutorialPlaque(420, 'Pula em cima das lichias pra derrotar elas'));
    this.plaques.push(new TutorialPlaque(640, 'Pega o Iogurte Yogoberry pra curar 1 vida'));

    // coletáveis biblioteca: livros
    this._coinRow(400, 350, 4, 30);
    this._coinRow(950, 330, 3, 30);
    this.yogos.push(new Yogoberry(560, 270));
    this.livros.push(new Livro(1140, 250));

    // primeiro Eduardo — encontro inicial
    this.eduardos.push(
      new Eduardo(1180, 426, [
        'Eai Amanda! Falta pouco pra formatura. Cuidado com as lichias!',
      ]),
    );

    // ── ZONA 2: LABORATÓRIO (1300–2700) ─────────────────
    this._ground(1380, 360);
    this._ground(1820, 520);
    this._block(1480, 380, 80, 16);
    this._block(1620, 290, 80, 16);
    this._block(1940, 360, 100, 16);
    this._block(2100, 270, 100, 16);
    this._block(2280, 200, 80, 16);

    this.lichias.push(new Lichia(1480, 440, 80));
    this.lichias.push(new Lichia(1900, 440, 120));
    this.lichias.push(new Lichia(1640, 260, 60));

    // estetoscópios (coletáveis temáticos do lab)
    this.estetos.push(new Estetoscopio(1500, 350));
    this.estetos.push(new Estetoscopio(1940, 330));
    this.estetos.push(new Estetoscopio(2280, 170));
    // café pra ganhar velocidade
    this.cafes.push(new Cafe(2100, 240));
    // yogos
    this.yogos.push(new Yogoberry(2120, 240));

    this.plaques.push(new TutorialPlaque(1900, 'Café = mais velocidade por 10s'));

    // segundo Eduardo — entrega de escudo
    this.eduardos.push(
      new Eduardo(
        2380,
        426,
        [
          'O Lichião tá te esperando lá na frente. Toma esse jaleco reforçado, vai precisar!',
        ],
        { givesShield: true },
      ),
    );

    // ── ZONA 3: HOSPITAL (2700–4100) ────────────────────
    this._ground(2440, 380);
    this._ground(2900, 700);
    this._block(2560, 360, 80, 16);
    this._block(2720, 270, 80, 16);
    this._block(3050, 350, 100, 16);
    this._block(3250, 250, 100, 16);
    this._block(3480, 180, 100, 16);

    this.lichias.push(new Lichia(2500, 440, 80));
    this.lichias.push(new Lichia(3000, 440, 100));
    this.lichias.push(new Lichia(3300, 440, 120));
    this.lichias.push(new Lichia(3060, 320, 60));

    this.estetos.push(new Estetoscopio(2580, 320));
    this.estetos.push(new Estetoscopio(3500, 150));
    this.yogos.push(new Yogoberry(2740, 240));
    this.yogos.push(new Yogoberry(3500, 150));
    this.cafes.push(new Cafe(3270, 220));
    this.livros.push(new Livro(3270, 220));

    // diploma temp (pulo duplo) numa plataforma elevada
    // (representado como yogo dourado — reaproveitamos a classe Yogoberry?
    // não, criamos uma fake especial via livro pra simplicidade — pulamos por ora)

    // ── ARENA DO CHEFE (4100–4400) ──────────────────────
    this._ground(3700, 700);
    // paredes da arena, removidas quando o chefe morrer
    this.platforms.push({ x: 3680, y: 200, w: 20, h: 270, bossWall: true });
    this.platforms.push({ x: 4380, y: 200, w: 20, h: 270, bossWall: true });
    this.boss = new Boss(4100, 380, 3700, 4400);

    // ── ZONA 4: FORMATURA (4400+) ───────────────────────
    this._ground(4400, 600);
    this.diploma = new Diploma(4760, 410);
    this.diploma.hidden = true; // só aparece após o Lichião morrer

    // bandeirolas no chão de formatura (decoração não-jogavel? só visual,
    // descartado por simplicidade)
  }

  _ground(x, w) {
    this.platforms.push({ x, y: 470, w, h: 70 });
  }
  _block(x, y, w, h) {
    this.platforms.push({ x, y, w, h });
  }
  _coinRow(x, y, count, gap) {
    for (let i = 0; i < count; i++) {
      this.livros.push(new Livro(x + i * gap, y));
    }
  }

  totalCollectibles() {
    return (
      this.yogos.length +
      this.cafes.length +
      this.livros.length +
      this.estetos.length
    );
  }
}
