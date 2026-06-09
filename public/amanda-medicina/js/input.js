// Captura de teclado. Inclui edge-detection pra teclas usadas nos menus
// (Enter, R, M) e buffer de pulo pra sensação de Mario.

const Input = {
  left: false,
  right: false,
  jump: false,
  jumpPressed: false,
  jumpBuffer: 0,
  resetPressed: false,
  startPressed: false,
  mutePressed: false,
  shootPressed: false,
};

const JUMP_BUFFER_FRAMES = 8;

window.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  switch (e.code) {
    case 'ArrowLeft':
    case 'KeyA':
      Input.left = true;
      break;
    case 'ArrowRight':
    case 'KeyD':
      Input.right = true;
      break;
    case 'Space':
    case 'ArrowUp':
    case 'KeyW':
      Input.jump = true;
      Input.jumpPressed = true;
      Input.jumpBuffer = JUMP_BUFFER_FRAMES;
      e.preventDefault();
      break;
    case 'KeyR':
      Input.resetPressed = true;
      break;
    case 'Enter':
    case 'NumpadEnter':
      Input.startPressed = true;
      e.preventDefault();
      break;
    case 'KeyM':
      Input.mutePressed = true;
      break;
    case 'KeyJ':
    case 'KeyX':
      Input.shootPressed = true;
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
    case 'KeyA':
      Input.left = false;
      break;
    case 'ArrowRight':
    case 'KeyD':
      Input.right = false;
      break;
    case 'Space':
    case 'ArrowUp':
    case 'KeyW':
      Input.jump = false;
      break;
  }
});

/** Consome flags de "edge" — chamar uma vez por frame depois de ler. */
function tickInput() {
  Input.jumpPressed = false;
  Input.resetPressed = false;
  Input.startPressed = false;
  Input.mutePressed = false;
  Input.shootPressed = false;
  if (Input.jumpBuffer > 0) Input.jumpBuffer--;
}
