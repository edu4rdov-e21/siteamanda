// Funções auxiliares pequenas usadas no jogo todo.

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function distSq(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}

/** Colisão AABB. Cada caixa tem { x, y, w, h }. */
function aabb(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function overlap(a, b) {
  const dx = Math.min(a.x + a.w - b.x, b.x + b.w - a.x);
  const dy = Math.min(a.y + a.h - b.y, b.y + b.h - a.y);
  return { dx, dy };
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randRange(min, max) {
  return Math.random() * (max - min) + min;
}
