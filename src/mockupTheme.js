const MOCKUP_CSS = `
:root {
  --rf-navy: #0f2a44;
  --rf-navy-2: #153b5f;
  --rf-blue: #2087e8;
  --rf-blue-soft: #eaf4ff;
  --rf-cream: #fbf7ee;
  --rf-paper: #ffffff;
  --rf-ink: #10263d;
  --rf-muted: #60758a;
  --rf-line: #dbe6ef;
  --rf-shadow: 0 18px 46px rgba(15,42,68,.10);
}

body {
  background: var(--rf-cream) !important;
}

body[data-restless-theme="light"] > #root > div,
body[data-restless-theme="light"] main,
body[data-restless-theme="light"] footer,
body[data-restless-theme="light"] header {
  background-color: var(--rf-cream) !important;
}

body[data-restless-theme="dark"] {
  --rf-cream: #08192a;
  --rf-paper: #0f2941;
  --rf-ink: #f5f8fb;
  --rf-muted: #b8c8d7;
  --rf-line: rgba(255,255,255,.10);
  --rf-blue-soft: #102f4d;
  --rf-shadow: 0 18px 46px rgba(0,0,0,.24);
  background: #08192a !important;
}

header {
  border-bottom: 0 !important;
  padding-top: 14px !important;
  padding-bottom: 12px !important;
  position: relative;
  z-index: 15;
}

header > div {
  max-width: 920px !important;
  background: var(--rf-paper) !important;
  border: 1px solid var(--rf-line) !important;
  border-radius: 24px !important;
  padding: 12px 14px !important;
  box-shadow: var(--rf-shadow) !important;
}

header h1 {
  color: var(--rf-navy) !important;
  font-family: Georgia, 'Times New Roman', serif !important;
  font-size: 24px !important;
  font-weight: 700 !important;
  letter-spacing: -.02em !important;
}
body[data-restless-theme="dark"] header h1 { color: #fff !important; }
header h1 span { color: var(--rf-blue) !important; font-weight: 700 !important; }
header h1 + p { display: none !important; }
header .w-9.h-9.rounded-xl {
  background: linear-gradient(145deg,#164b78,#0b2238) !important;
  border-radius: 12px !important;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.08) !important;
}
header .w-9.h-9.rounded-xl svg { display:none !important; }
header .w-9.h-9.rounded-xl::after {
  content: 'R.';
  color: #fff;
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -1px;
}
header button {
  border: 1px solid var(--rf-line) !important;
  background: var(--rf-paper) !important;
  color: var(--rf-navy) !important;
}
body[data-restless-theme="dark"] header button { color:#fff !important; }

header [role="group"] {
  margin-top: 10px !important;
  gap: 7px !important;
}
header [role="group"] button {
  padding: 6px 11px !important;
  border-radius: 999px !important;
  font-weight: 700 !important;
}
header [role="group"] button[aria-pressed="true"] {
  background: var(--rf-blue) !important;
  color: #fff !important;
  border-color: var(--rf-blue) !important;
}

main {
  padding-top: 8px !important;
  padding-bottom: 20px !important;
}
main > div {
  max-width: 920px !important;
}

main section.rounded-3xl {
  background: var(--rf-paper) !important;
  border: 1px solid var(--rf-line) !important;
  border-radius: 30px !important;
  box-shadow: var(--rf-shadow) !important;
  overflow: hidden !important;
  position: relative !important;
}
main section.rounded-3xl::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 260px;
  background:
    radial-gradient(circle at 82% 24%, rgba(255,218,167,.72), transparent 27%),
    linear-gradient(135deg, rgba(238,247,255,.95), rgba(255,246,231,.9));
  pointer-events: none;
}
body[data-restless-theme="dark"] main section.rounded-3xl::before {
  background: radial-gradient(circle at 82% 24%, rgba(32,135,232,.24), transparent 27%), linear-gradient(135deg,#102b45,#0e2236);
}
main section.rounded-3xl > div:first-child {
  position: relative;
  padding: 34px 30px 24px !important;
  min-height: 280px;
}
main section.rounded-3xl > div:first-child > div:first-child {
  background: rgba(255,255,255,.82) !important;
  color: var(--rf-navy) !important;
  border: 1px solid rgba(15,42,68,.08) !important;
  backdrop-filter: blur(8px);
}
body[data-restless-theme="dark"] main section.rounded-3xl > div:first-child > div:first-child { background:rgba(10,30,48,.72)!important; color:#d9ecff!important; }
main section.rounded-3xl h2 {
  max-width: 590px !important;
  color: var(--rf-navy) !important;
  font-family: Georgia, 'Times New Roman', serif !important;
  font-weight: 700 !important;
  letter-spacing: -.035em !important;
  font-size: clamp(38px,7vw,62px) !important;
  line-height: 1.00 !important;
  margin-top: 18px !important;
}
body[data-restless-theme="dark"] main section.rounded-3xl h2 { color:#fff!important; }
main section.rounded-3xl h2 + p {
  color: var(--rf-muted) !important;
  font-size: 18px !important;
  line-height: 1.55 !important;
  max-width: 610px !important;
}
main section.rounded-3xl .grid.grid-cols-3 {
  margin-top: 20px !important;
  gap: 10px !important;
}
main section.rounded-3xl .grid.grid-cols-3 > div {
  background: rgba(255,255,255,.88) !important;
  border: 1px solid var(--rf-line) !important;
  min-height: 52px !important;
  border-radius: 14px !important;
  padding: 10px 12px !important;
}
body[data-restless-theme="dark"] main section.rounded-3xl .grid.grid-cols-3 > div { background:rgba(15,41,65,.88)!important; }
main section.rounded-3xl .grid.grid-cols-3 svg { color: var(--rf-blue) !important; }
main section.rounded-3xl .grid.grid-cols-3 span { color: var(--rf-ink) !important; }

main section.rounded-3xl > div:last-child {
  position: relative;
  background: linear-gradient(180deg, rgba(234,244,255,.72), rgba(255,255,255,.96)) !important;
  border-top: 1px solid var(--rf-line) !important;
  padding: 22px 26px 26px !important;
}
body[data-restless-theme="dark"] main section.rounded-3xl > div:last-child { background:#0e263d!important; }
main section.rounded-3xl > div:last-child h3 { color: var(--rf-ink) !important; font-family:Georgia,'Times New Roman',serif!important; }
main section.rounded-3xl > div:last-child p { color: var(--rf-muted) !important; }
main section.rounded-3xl > div:last-child svg { color: var(--rf-blue) !important; }
main section.rounded-3xl > div:last-child .flex.gap-2.overflow-x-auto {
  display: grid !important;
  grid-template-columns: repeat(2,minmax(0,1fr)) !important;
  overflow: visible !important;
  gap: 10px !important;
}
main section.rounded-3xl > div:last-child .flex.gap-2.overflow-x-auto button {
  white-space: normal !important;
  border-radius: 14px !important;
  min-height: 54px !important;
  background: var(--rf-paper) !important;
  border: 1px solid var(--rf-line) !important;
  color: var(--rf-ink) !important;
  box-shadow: 0 8px 20px rgba(15,42,68,.05) !important;
  font-weight: 700 !important;
}

main .rounded-2xl {
  border-radius: 18px !important;
}
main .space-y-4 > .flex.justify-start > div > .rounded-2xl {
  background: var(--rf-paper) !important;
  border: 1px solid var(--rf-line) !important;
  box-shadow: var(--rf-shadow) !important;
  padding: 22px !important;
}
main .space-y-4 > .flex.justify-end .rounded-2xl {
  background: var(--rf-blue) !important;
  color: #fff !important;
}
main .space-y-4 > .flex.justify-end .rounded-2xl p { color:#fff!important; }
main p, main li { color: var(--rf-ink) !important; }
main a, main button { transition: transform .15s ease, box-shadow .15s ease, background-color .15s ease; }
main button:active { transform: scale(.985); }

footer {
  border-top: 0 !important;
  padding-top: 8px !important;
  padding-bottom: 14px !important;
}
footer > div {
  max-width: 920px !important;
  background: var(--rf-paper) !important;
  border: 1px solid var(--rf-line) !important;
  border-radius: 24px !important;
  padding: 12px !important;
  box-shadow: 0 14px 34px rgba(15,42,68,.10) !important;
}
footer textarea {
  background: #f8fbfe !important;
  color: var(--rf-ink) !important;
  border: 1px solid var(--rf-line) !important;
  border-radius: 16px !important;
}
body[data-restless-theme="dark"] footer textarea { background:#0b2135!important; }
footer textarea::placeholder { color:#8294a5!important; }
footer .w-12.h-12 {
  background: var(--rf-blue) !important;
  color: #fff !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 18px rgba(32,135,232,.25) !important;
}
footer button, footer a { color: var(--rf-muted) !important; }

.restless-mockup-strip {
  display:grid;
  grid-template-columns: repeat(3,minmax(0,1fr));
  gap:10px;
  margin-top:16px;
}
.restless-mockup-strip > div {
  border:1px solid var(--rf-line);
  border-radius:16px;
  padding:14px;
  background:var(--rf-paper);
  text-align:center;
}
.restless-mockup-strip strong { display:block; color:var(--rf-ink); font-size:14px; }
.restless-mockup-strip span { display:block; color:var(--rf-muted); font-size:12px; margin-top:3px; line-height:1.35; }
.restless-mockup-strip .rf-dot { width:28px;height:28px;border-radius:50%;background:var(--rf-blue-soft);display:grid;place-items:center;margin:0 auto 8px;color:var(--rf-blue);font-weight:900; }

@media (max-width:640px) {
  header { padding-left:10px!important; padding-right:10px!important; }
  header > div, footer > div { border-radius:20px!important; }
  main { padding-left:10px!important; padding-right:10px!important; }
  main section.rounded-3xl > div:first-child { padding:28px 20px 22px!important; }
  main section.rounded-3xl h2 { font-size:40px!important; }
  main section.rounded-3xl .grid.grid-cols-3 { grid-template-columns:1fr!important; }
  main section.rounded-3xl > div:last-child .flex.gap-2.overflow-x-auto { grid-template-columns:1fr!important; }
  .restless-mockup-strip { grid-template-columns:1fr!important; }
  footer { padding-left:10px!important; padding-right:10px!important; }
}
`;

function setThemeFlag() {
  const lightModeButton = Array.from(document.querySelectorAll('button')).find((b) => b.getAttribute('aria-label') === 'Use light mode' || b.getAttribute('aria-label') === 'Usar modo claro');
  document.body.dataset.restlessTheme = lightModeButton ? 'dark' : 'light';
}

function polishCopyAndExtras() {
  setThemeFlag();
  const section = document.querySelector('main section.rounded-3xl');
  if (!section) return;
  const h2 = section.querySelector('h2');
  const p = h2?.nextElementSibling;
  const isSpanish = Array.from(document.querySelectorAll('button')).some((b) => b.textContent?.trim() === 'EN');
  if (h2) h2.textContent = isSpanish ? 'Para las preguntas que no te dejan en paz.' : 'For the questions that won’t leave you alone.';
  if (p) p.textContent = isSpanish
    ? 'Explora a Dios, el cristianismo y la fe católica con honestidad, evidencia y próximos pasos reales.'
    : 'Explore God, Christianity, and the Catholic faith with honesty, evidence, and real next steps.';

  const badge = section.querySelector(':scope > div:first-child > div:first-child');
  if (badge) {
    badge.textContent = isSpanish ? 'Preguntas • Evidencia • Próximos pasos' : 'Questions • Evidence • Next steps';
  }

  const principleLabels = isSpanish
    ? ['Respuestas claras','Consulta las fuentes','Da el siguiente paso']
    : ['Clear Answers','See the Sources','Take the Next Step'];
  section.querySelectorAll('.grid.grid-cols-3 span').forEach((el, i) => {
    if (principleLabels[i]) el.textContent = principleLabels[i];
  });

  if (!section.querySelector('.restless-mockup-strip')) {
    const strip = document.createElement('div');
    strip.className = 'restless-mockup-strip';
    const cards = isSpanish
      ? [['?','Haz la pregunta difícil','Sin suavizar la objeción.'],['↗','Comprueba las fuentes','Mira de dónde viene la respuesta.'],['→','Llévalo a la vida real','Oración, Escritura y personas reales.']]
      : [['?','Ask the hard question','Without softening the objection.'],['↗','Check the sources','See where the answer comes from.'],['→','Take it into real life','Prayer, Scripture, and real people.']];
    strip.innerHTML = cards.map(([icon,title,body]) => `<div><div class="rf-dot">${icon}</div><strong>${title}</strong><span>${body}</span></div>`).join('');
    section.parentElement?.insertBefore(strip, section.nextSibling);
  }
}

const style = document.createElement('style');
style.id = 'restless-approved-mockup-theme';
style.textContent = MOCKUP_CSS;
document.head.appendChild(style);

let scheduled = false;
const schedulePolish = () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    polishCopyAndExtras();
  });
};

new MutationObserver(schedulePolish).observe(document.documentElement, { subtree:true, childList:true, attributes:true, characterData:true });
window.addEventListener('DOMContentLoaded', schedulePolish);
setTimeout(schedulePolish, 0);
