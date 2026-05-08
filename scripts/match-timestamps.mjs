// One-off script that fills `videoAulaId` and `videoStartSec` in every
// question JSON, by matching `referenciaAula` against the timestamped
// transcripts in /Users/eduardo/Desktop/developer/transcricoes-faculdade/.
//
// Run with: node scripts/match-timestamps.mjs

import fs from 'node:fs';
import path from 'node:path';

const TRANSCRIPT_DIR = '/Users/eduardo/Desktop/developer/transcricoes-faculdade';
const PROJECT = '/Users/eduardo/Desktop/quiz-cirurgia';
const AULAS_DIR = path.join(PROJECT, 'src/data/aulas');
const EIXOS_DIR = path.join(PROJECT, 'src/data/transversais');

// Mapping aulaId → transcript filename (with timestamps).
// Names must match what's in transcricoes-faculdade/ (with " [timestamps].txt" suffix).
const TRANSCRIPT_FILES = {
  1: '01 - Abdome Agudo Obstrução Intestinal [timestamps].txt',
  2: '02 - Alarme Cirúrgico no Recém-Nascido [timestamps].txt',
  3: '03 - Antibioticoterapia e Infecção em Cirurgia [timestamps].txt',
  4: '04 - Avaliação Pós-Operatória [timestamps].txt',
  5: '05 - Avaliação Pré-Operatória [timestamps].txt',
  6: '06 - Diagnóstico e Investigação de Nódulos Pulmonares [timestamps].txt',
  7: '07 - Dor Abdominal Aguda na Infância [timestamps].txt',
  8: '08 - Hemorragia Digestiva Alta [timestamps].txt',
  9: '09 - Hemorragia Digestiva Baixa [timestamps].txt',
  10: '10 - Neoplasia de Pele [timestamps].txt',
  11: '11 - Oclusão Arterial Aguda [timestamps].txt',
  12: '12 - Traqueostomia [timestamps].txt',
  13: '13 - Abdome Agudo Inflamatório [timestamps].txt',
  14: '14 - Abdome Agudo Perfurativo [timestamps].txt',
  15: '15 - Câncer Colorretal [timestamps].txt',
  16: '16 - Cicatrização de Feridas [timestamps].txt',
  17: '17 - Nutrição em Cirurgia [timestamps].txt',
  18: '18 - Fisiologia da Ereção e Disfunção Erétil [timestamps].txt',
  19: '19 - Hipogonadismo [timestamps].txt',
  20: '20 - Urooncologia [timestamps].txt',
  21: '21 - Urologia Pediátrica [timestamps].txt',
  22: '22 - Sintomas do Trato Urinário Inferior e Doenças de Próstata [timestamps].txt',
  23: '23 - Cuidados com a Ferida Cirúrgica [timestamps].txt',
  24: '24 - Derrames pleurais e drenagem de tórax [timestamps].txt',
  25: '25 - Insuficiência Arterial Crônica [timestamps].txt',
  26: '26 - Cálculo Renal [timestamps].txt',
};

// Aulas that each eixo cruza (mirror of EIXOS in src/data/meta/eixos.ts).
const EIXO_AULAS = {
  T1: [1, 11, 13, 14, 7],
  T2: [8, 9],
  T3: [3, 4, 5, 16, 17, 23],
  T4: [11, 18, 25],
  T5: [8, 11, 14, 4],
  T6: [6, 10, 15, 20],
  T7: [6, 12, 24],
  T8: [18, 19, 22, 26, 25],
};

// ── normalization ──────────────────────────────────────────────────────
const FILLER = /\b(né|eh|tá|hum|ah|um|uh)\b/gi;
const PUNCT = /[.,;:!?"'""''–—()[\]…]/g;

// also strip diacritics so "é" matches "e" robustly
function stripDiacritics(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function normalize(s) {
  return stripDiacritics(s.toLowerCase())
    .replace(FILLER, ' ')
    .replace(PUNCT, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── transcript parser ─────────────────────────────────────────────────
function parseTranscript(text) {
  const re = /\[(\d+):(\d+)(?::(\d+))?\]([\s\S]*?)(?=\[\d+:\d+(?::\d+)?\]|$)/g;
  const blocks = [];
  let m;
  while ((m = re.exec(text))) {
    const startSec = m[3]
      ? +m[1] * 3600 + +m[2] * 60 + +m[3]
      : +m[1] * 60 + +m[2];
    const blockText = m[4].trim().replace(/\s+/g, ' ');
    blocks.push({ startSec, text: blockText, norm: normalize(blockText) });
  }
  return blocks;
}

// ── matching ──────────────────────────────────────────────────────────
function findInBlocks(target, blocks) {
  if (target.length < 8) return null;
  // 1. full normalized substring
  for (const b of blocks) if (b.norm.includes(target)) return b.startSec;
  // 2. middle 60% (chops off ends that may have been edited)
  if (target.length >= 30) {
    const start = Math.floor(target.length * 0.2);
    const end = Math.floor(target.length * 0.8);
    const middle = target.slice(start, end).trim();
    if (middle.length >= 15) {
      for (const b of blocks) if (b.norm.includes(middle)) return b.startSec;
    }
  }
  // 3. longest sliding word window ≥ 5 words
  const words = target.split(' ');
  for (let len = Math.min(words.length, 12); len >= 5; len--) {
    for (let i = 0; i + len <= words.length; i++) {
      const win = words.slice(i, i + len).join(' ');
      if (win.length < 20) continue; // skip very generic windows
      for (const b of blocks) if (b.norm.includes(win)) return b.startSec;
    }
  }
  return null;
}

// Search across multiple transcripts. Returns { aulaId, startSec } or null.
function matchAcross(target, aulaIds, transcripts) {
  for (const aulaId of aulaIds) {
    const sec = findInBlocks(target, transcripts[aulaId]);
    if (sec !== null) return { aulaId, startSec: sec };
  }
  return null;
}

// ── load all transcripts ──────────────────────────────────────────────
const transcripts = {};
for (let i = 1; i <= 26; i++) {
  const fp = path.join(TRANSCRIPT_DIR, TRANSCRIPT_FILES[i]);
  const raw = fs.readFileSync(fp, 'utf8');
  transcripts[i] = parseTranscript(raw);
}

// ── process ─────────────────────────────────────────────────────────────
const stats = { matched: 0, unmatched: 0, fallback: 0, unmatchedList: [] };
const ALL_AULAS = Array.from({ length: 26 }, (_, i) => i + 1);

function processQuestionsFile(filePath, scope) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  for (const q of data.questoes) {
    const ref = q.referenciaAula;
    if (!ref) continue;
    const target = normalize(ref);

    let result = null;
    if (q.aulaOrigem !== null && q.aulaOrigem !== undefined) {
      // primary: match in own aula
      const sec = findInBlocks(target, transcripts[q.aulaOrigem]);
      if (sec !== null) result = { aulaId: q.aulaOrigem, startSec: sec };
    } else if (scope === 'eixo') {
      // primary: match within the eixo's aulas
      const eixoIds = q.eixos && q.eixos[0];
      const eixoAulas = (q.eixos || []).flatMap((e) => EIXO_AULAS[e] || []);
      const uniqEixoAulas = [...new Set(eixoAulas)];
      result = matchAcross(target, uniqEixoAulas, transcripts);
    }

    // fallback: search ALL aulas (only if primary failed)
    if (!result) {
      const wide = matchAcross(target, ALL_AULAS, transcripts);
      if (wide) {
        result = wide;
        stats.fallback++;
      }
    }

    if (result) {
      q.videoAulaId = result.aulaId;
      q.videoStartSec = result.startSec;
      stats.matched++;
    } else {
      stats.unmatched++;
      stats.unmatchedList.push({
        id: q.id,
        ref: ref.slice(0, 120),
      });
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

// aulas
for (const f of fs.readdirSync(AULAS_DIR).sort()) {
  if (f.endsWith('.json')) processQuestionsFile(path.join(AULAS_DIR, f), 'aula');
}
// eixos
for (const f of fs.readdirSync(EIXOS_DIR).sort()) {
  if (f.endsWith('.json')) processQuestionsFile(path.join(EIXOS_DIR, f), 'eixo');
}

// ── report ────────────────────────────────────────────────────────────
const total = stats.matched + stats.unmatched;
console.log(`\n========================================`);
console.log(`Total questões processadas:  ${total}`);
console.log(`Casadas:                      ${stats.matched}  (${Math.round((stats.matched / total) * 100)}%)`);
console.log(`  └─ via fallback global:     ${stats.fallback}`);
console.log(`Não casadas:                  ${stats.unmatched}`);
console.log(`========================================\n`);

if (stats.unmatched > 0) {
  console.log(`Quotes sem match (precisam revisão manual):\n`);
  for (const u of stats.unmatchedList) {
    console.log(`  [${u.id}]  "${u.ref}${u.ref.length === 120 ? '…' : ''}"`);
  }
}
