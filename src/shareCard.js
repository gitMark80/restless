// Renders the 1080×1350 (4:5) share card for a Q&A pair onto a canvas.
// Pure drawing code; App.jsx wraps it in a Blob for navigator.share / download.

export const SHARE_CARD_TEXT = {
  en: {
    question: "QUESTION",
    answer: "ANSWER",
    verify: "Verify it. Think about it. Talk about it.",
    grounded: "Grounded in Scripture, the Catechism, and the teaching of the Church.",
    cta: "Ask your own question",
  },
  es: {
    question: "PREGUNTA",
    answer: "RESPUESTA",
    verify: "Verifícalo. Reflexiónalo. Conversa sobre ello.",
    grounded: "Fundamentado en la Escritura, el Catecismo y la enseñanza de la Iglesia.",
    cta: "Haz tu propia pregunta",
  },
};

const W = 1080;
const H = 1350;
const M = 84; // outer margin
const INNER = W - M * 2;

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

const COLOR = {
  cream: "#F6F0E5",
  body: "rgba(246,240,229,0.90)",
  muted: "#A9B6C4",
  gold: "#E0B96A",
  goldSoft: "rgba(224,185,106,0.28)",
  goldFaint: "rgba(224,185,106,0.10)",
};

// Split markdown-lite into paragraphs and list items, stripping **bold**.
function parseAnswer(text) {
  const blocks = [];
  for (const raw of (text || "").split("\n")) {
    const line = raw.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\s+/g, " ").trim();
    if (!line) continue;
    const item = /^(?:[-•]|\d+[.)])\s+(.*)$/.exec(line);
    blocks.push(item ? { type: "li", text: item[1] } : { type: "p", text: line });
  }
  return blocks;
}

// Lay out all blocks at one size inside a pixel height budget. Returns drawable
// lines ({ text, indent, bullet }), with null entries for paragraph gaps.
function layoutAnswer(ctx, blocks, maxWidth, lineH, maxHeight) {
  const out = [];
  let height = 0;
  let truncated = false;
  const indent = Math.round(ctx.measureText("•  ").width);
  for (let b = 0; b < blocks.length; b++) {
    const block = blocks[b];
    const prev = blocks[b - 1];
    const gap = b > 0 && !(block.type === "li" && prev?.type === "li") ? lineH / 2 : 0;
    const room = Math.floor((maxHeight - height - gap) / lineH);
    if (room <= 0) {
      truncated = true;
      break;
    }
    const isLi = block.type === "li";
    const w = wrap(ctx, block.text, isLi ? maxWidth - indent : maxWidth, room);
    if (gap) {
      out.push(null);
      height += gap;
    }
    w.lines.forEach((text, i) => out.push({ text, indent: isLi ? indent : 0, bullet: isLi && i === 0 }));
    height += w.lines.length * lineH;
    if (w.truncated) {
      truncated = true;
      break;
    }
  }
  if (truncated && out.length) {
    const last = out[out.length - 1];
    if (!last.text.endsWith("…")) last.text = `${last.text.replace(/[.,;:!?]?$/, "")}…`;
  }
  return { lines: out, truncated, height };
}

function wrap(ctx, text, maxWidth, maxLines) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  let truncated = false;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      line = next;
    } else {
      if (line) lines.push(line);
      line = word;
      if (lines.length === maxLines) {
        truncated = true;
        break;
      }
    }
  }
  if (!truncated && line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    truncated = true;
  }
  if (truncated && lines.length) {
    let last = lines[lines.length - 1].replace(/[.,;:!?]?$/, "");
    while (ctx.measureText(`${last}…`).width > maxWidth && last.includes(" ")) {
      last = last.slice(0, last.lastIndexOf(" "));
    }
    lines[lines.length - 1] = `${last}…`;
  }
  return { lines, truncated };
}

function label(ctx, text, x, y) {
  ctx.save();
  ctx.fillStyle = COLOR.gold;
  ctx.font = `700 22px ${SANS}`;
  if ("letterSpacing" in ctx) ctx.letterSpacing = "4px";
  ctx.fillText(text, x, y);
  const width = ctx.measureText(text).width;
  ctx.restore();
  return width;
}

export function drawShareCard(canvas, { question, answer, tagline, language = "en" }) {
  const t = SHARE_CARD_TEXT[language] || SHARE_CARD_TEXT.en;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.textBaseline = "alphabetic";

  // ---- Background: deep navy with a quiet gold glow and a hairline frame ----
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0C1F36");
  bg.addColorStop(0.55, "#0F2A44");
  bg.addColorStop(1, "#091628");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const glow = ctx.createRadialGradient(W - 120, -40, 20, W - 120, -40, 720);
  glow.addColorStop(0, "rgba(224,185,106,0.16)");
  glow.addColorStop(1, "rgba(224,185,106,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = COLOR.goldSoft;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(40, 40, W - 80, H - 80);

  // ---- Header: wordmark + tagline ----
  const headerBaseline = 148;
  ctx.fillStyle = COLOR.cream;
  ctx.font = `700 58px ${SERIF}`;
  ctx.fillText("Restless", M, headerBaseline);
  const wordWidth = ctx.measureText("Restless").width;
  ctx.fillStyle = COLOR.gold;
  ctx.font = `italic 400 34px ${SERIF}`;
  ctx.fillText(".faith", M + wordWidth + 2, headerBaseline);

  ctx.fillStyle = COLOR.muted;
  ctx.font = `400 24px ${SANS}`;
  ctx.fillText(tagline || "", M, headerBaseline + 42);

  // small gold cross, right-aligned with the wordmark
  const cx = W - M - 18;
  const cy = headerBaseline - 26;
  ctx.fillStyle = COLOR.gold;
  ctx.fillRect(cx - 3, cy - 22, 6, 44);
  ctx.fillRect(cx - 15, cy - 10, 30, 6);

  // ---- Footer (drawn first so the body knows where to stop) ----
  const footerLine = H - 196;
  ctx.strokeStyle = COLOR.goldSoft;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(M, footerLine);
  ctx.lineTo(W - M, footerLine);
  ctx.stroke();

  ctx.fillStyle = COLOR.gold;
  ctx.font = `700 28px ${SERIF}`;
  ctx.fillText(t.verify, M, footerLine + 56);

  ctx.fillStyle = COLOR.muted;
  ctx.font = `400 22px ${SANS}`;
  ctx.fillText(t.grounded, M, footerLine + 96);

  // URL pill, right-aligned
  ctx.font = `700 26px ${SANS}`;
  const urlText = "restless.faith";
  const urlW = ctx.measureText(urlText).width;
  const pillH = 52;
  const pillW = urlW + 48;
  const pillX = W - M - pillW;
  const pillY = footerLine + 38 - pillH / 2 + 6;
  ctx.fillStyle = COLOR.goldFaint;
  ctx.strokeStyle = COLOR.goldSoft;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = COLOR.cream;
  ctx.fillText(urlText, pillX + 24, pillY + pillH / 2 + 9);

  // ---- Measure the Q&A block first so it can sit centred in the free space ----
  const contentTop = 268;
  const contentBottom = footerLine - 40;
  ctx.font = `700 52px ${SERIF}`;
  const qLineH = 64;
  const q = wrap(ctx, (question || "").replace(/\s+/g, " ").trim(), INNER - 28, 4);
  const questionBlockH = 58 + q.lines.length * qLineH + 28 + 50; // label + lines + gap + answer label

  const blocks = parseAnswer(answer);
  const available = contentBottom - contentTop - questionBlockH;
  const sizes = [40, 38, 36, 34, 32, 30];
  let chosen = null;
  for (const size of sizes) {
    const lineH = Math.round(size * 1.45);
    ctx.font = `400 ${size}px ${SANS}`;
    const l = layoutAnswer(ctx, blocks, INNER, lineH, available);
    chosen = { size, lineH, lines: l.lines, height: l.height, truncated: l.truncated };
    if (!l.truncated) break;
  }

  const totalH = questionBlockH + chosen.height;
  const slack = contentBottom - contentTop - totalH;
  let y = contentTop + Math.min(Math.max(slack * 0.38, 0), 170);

  // ---- Question ----
  label(ctx, t.question, M, y);
  y += 58;
  ctx.fillStyle = COLOR.gold;
  ctx.fillRect(M, y - 44, 6, q.lines.length * qLineH - 12);
  ctx.fillStyle = COLOR.cream;
  ctx.font = `700 52px ${SERIF}`;
  q.lines.forEach((line, i) => ctx.fillText(line, M + 28, y + i * qLineH));
  y += q.lines.length * qLineH + 28;

  // ---- Answer ----
  label(ctx, t.answer, M, y);
  y += 50;
  ctx.font = `400 ${chosen.size}px ${SANS}`;
  let cursor = y + chosen.size * 0.85;
  for (const line of chosen.lines) {
    if (line === null) {
      cursor += chosen.lineH / 2;
      continue;
    }
    if (line.bullet) {
      ctx.fillStyle = COLOR.gold;
      ctx.fillText("•", M, cursor);
    }
    ctx.fillStyle = COLOR.body;
    ctx.fillText(line.text, M + line.indent, cursor);
    cursor += chosen.lineH;
  }

  return canvas;
}
