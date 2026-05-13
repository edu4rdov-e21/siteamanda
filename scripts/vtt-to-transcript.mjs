// Converte VTT de auto-caption do YouTube em transcript no formato
// [MM:SS] usado pelo matcher.
//
// Estratégia: pra cada cue "karaokê" (que tem <c> tags), a última
// linha contém o conteúdo NOVO daquela cue (as linhas anteriores são
// repetição do que já foi dito). A gente extrai essa linha, strip de
// tags, e usa o tempo de início da cue.
//
// Uso: node scripts/vtt-to-transcript.mjs input.vtt > output.txt

import fs from 'node:fs';

const input = process.argv[2];
if (!input) {
  console.error('Uso: node scripts/vtt-to-transcript.mjs input.vtt');
  process.exit(1);
}

const raw = fs.readFileSync(input, 'utf8');

// Parse cada cue. Formato:
// HH:MM:SS.mmm --> HH:MM:SS.mmm <attrs>
// linha1
// linha2
// ...
const cueRe =
  /(\d{2}):(\d{2}):(\d{2})\.\d+\s*-->\s*\d{2}:\d{2}:\d{2}\.\d+[^\n]*\n([\s\S]*?)(?=\n\n|\n\d{2}:|\Z)/g;

const segments = []; // { sec, text }
let m;
while ((m = cueRe.exec(raw))) {
  const [, hh, mm, ss, content] = m;
  if (!content.includes('<c>')) continue; // pula cues "plain" (repetição)

  // Encontra a linha que contém <c> — é onde tá o conteúdo novo
  const lines = content.split('\n').map((l) => l.trimEnd());
  const lineWithTag = lines.find((l) => l.includes('<c>'));
  if (!lineWithTag) continue;

  // Strip tags: <00:00:00.599> e <c>...</c>
  const stripped = lineWithTag.replace(/<[^>]+>/g, '').trim();
  if (!stripped) continue;

  const sec = +hh * 3600 + +mm * 60 + +ss;
  segments.push({ sec, text: stripped });
}

// Agrupa em blocos de ~15s
const BLOCK_GAP = 15;
const blocks = [];
let cur = null;
for (const seg of segments) {
  if (!cur || seg.sec - cur.start >= BLOCK_GAP) {
    if (cur) blocks.push(cur);
    cur = { start: seg.sec, parts: [] };
  }
  cur.parts.push(seg.text);
}
if (cur) blocks.push(cur);

// Output
const out = blocks
  .map((b) => {
    const min = Math.floor(b.start / 60);
    const s = b.start % 60;
    const tag = `[${String(min).padStart(2, '0')}:${String(s).padStart(2, '0')}]`;
    const text = b.parts
      .join(' ')
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,;:!?])/g, '$1')
      .trim();
    return `${tag} ${text}`;
  })
  .join('\n\n');

console.log(out);
