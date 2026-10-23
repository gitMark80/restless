// Checks every Scripture citation in content/topics.js against the public-domain
// Douay-Rheims text: the reference must exist, and any phrase in "double
// quotes" in the same sentence must appear in one of that sentence's cited
// passages (Douay-Rheims wording; allowing ±2 verses for numbering differences).
//
// Usage:
//   git clone --depth 1 https://github.com/xxruyle/Bible-DouayRheims /tmp/dr
//   node scripts/check-scripture.mjs /tmp/dr/EntireBible-DR.json
//
// Catechism citations are checked by `npm test` against
// test/fixtures/citations-checked.json.

import fs from "node:fs";
import { TOPICS } from "../content/topics.js";
import { topicText } from "./site-pages.mjs";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/check-scripture.mjs <path to EntireBible-DR.json>");
  process.exit(2);
}
const dr = JSON.parse(fs.readFileSync(file, "utf8"));
const NAME = { Psalm: "Psalms", Isaiah: "Isaias", Malachi: "Malachias", Revelation: "Apocalypse" };
const psalmToDr = (n) => (n >= 11 && n <= 146 ? n - 1 : n); // Hebrew → Vulgate numbering (close enough for the psalms cited)

function passage(ref) {
  const m = /^((?:\d )?[A-Z][a-z]+) (\d+)(?::(\d+)(?:-(\d+))?)?$/.exec(ref);
  if (!m) return { error: "bad format" };
  const [, book, chRaw, v1Raw, v2Raw] = m;
  const bookData = dr[NAME[book] || book];
  if (!bookData) return { error: `unknown book ${book}` };
  const ch = book === "Psalm" ? psalmToDr(Number(chRaw)) : Number(chRaw);
  const chapter = bookData[String(ch)];
  if (!chapter) return { error: `no chapter ${ch}` };
  if (!v1Raw) return { text: Object.values(chapter).join(" ") };
  const v1 = Number(v1Raw);
  const v2 = v2Raw ? Number(v2Raw) : v1;
  if (!chapter[String(v2)] && !chapter[String(v2 - 1)]) return { error: `verse ${v2} not found` };
  const verses = [];
  for (let i = Math.max(1, v1 - 2); i <= v2 + 2; i += 1) if (chapter[String(i)]) verses.push(chapter[String(i)]);
  return { text: verses.join(" ") };
}

const norm = (s) => s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z' ]/g, "").replace(/\s+/g, " ");
let problems = 0;
let checked = 0;
for (const topic of TOPICS) {
  for (const text of topicText(topic)) {
    for (const sentence of text.split(/(?<=[.!?])\s+/)) {
      const refs = [...sentence.matchAll(/\[\[([^\]]+)\]\]/g)].map((m) => m[1]).filter((r) => !r.startsWith("CCC"));
      for (const ref of refs) {
        const { error } = passage(ref);
        checked += 1;
        if (error) {
          problems += 1;
          console.log(`✗ ${topic.short}: ${ref} — ${error}`);
        }
      }
      for (const [, quote] of sentence.matchAll(/"([^"]{6,})"/g)) {
        if (!refs.length) continue;
        const found = refs.some((ref) => norm(passage(ref).text || "").includes(norm(quote)));
        if (!found) {
          problems += 1;
          console.log(`? ${topic.short}: "${quote}" not found in ${refs.join(", ")}`);
        }
      }
    }
  }
}
console.log(`${checked} Scripture citations checked, ${problems} problem(s).`);
process.exit(problems ? 1 : 0);
