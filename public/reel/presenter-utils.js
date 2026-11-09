export function chunkAnswer(text, maxChars = 150) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  const pages = []; let page = '';
  for (const word of words) {
    if (page && page.length + word.length + 1 > maxChars) { pages.push(page); page = ''; }
    page += (page ? ' ' : '') + word;
  }
  if (page) pages.push(page);
  return pages;
}
function seconds(raw) {
  const parts = raw.replace(',', '.').split(':').map(Number);
  if (parts.some(n => !Number.isFinite(n) || n < 0) || parts.length < 2 || parts.length > 3) return NaN;
  if (parts.at(-1) >= 60 || (parts.length === 3 && parts[1] >= 60)) return NaN;
  return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
}
export function parseCaptions(source) {
  const blocks = String(source).replace(/^\uFEFF/, '').replace(/\r/g, '').split(/\n\s*\n/);
  const cues = [];
  for (const block of blocks) {
    const lines = block.split('\n');
    const index = lines.findIndex(line => line.includes('-->'));
    if (index < 0) continue;
    const match = lines[index].match(/^\s*([\d:.,]+)\s+-->\s+([\d:.,]+)(?:\s.*)?$/);
    if (!match) throw new Error('Invalid caption timing.');
    const start = seconds(match[1]), end = seconds(match[2]);
    const text = lines.slice(index + 1).join(' ').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) throw new Error('Invalid caption timing.');
    if (text) cues.push({ start, end, text });
  }
  if (!cues.length || cues.length > 2000) throw new Error('Choose an SRT or WebVTT file with valid timed captions.');
  return cues.sort((a, b) => a.start - b.start);
}
export function cueAt(cues, time) {
  return cues.find(cue => time >= cue.start && time < cue.end)?.text || '';
}
export function pageAt(pages, time, duration) {
  if (!pages.length) return 0;
  return Math.min(pages.length - 1, Math.max(0, Math.floor(time / Math.max(duration, 1) * pages.length)));
}
