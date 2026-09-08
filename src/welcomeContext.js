const CONTEXT_CSS = `
/* Keep a compact welcome/context panel in the chat view without restoring the old full-page landing screen. */
main > div > section.rounded-3xl {
  display: block !important;
  border-radius: 24px !important;
  overflow: hidden !important;
}

/* Remove the old AI badge and theology promo; keep the explanatory copy, feature row, and starter questions. */
main > div > section.rounded-3xl > div:first-child > div.inline-flex.items-center {
  display: none !important;
}
main section.rounded-3xl > div:last-child > .flex.items-start.gap-3 {
  display: none !important;
}

main > div > section.rounded-3xl > div:first-child {
  padding: 20px 20px 14px !important;
}
main > div > section.rounded-3xl h2 {
  margin-top: 0 !important;
  font-family: Georgia, 'Times New Roman', serif !important;
  font-size: clamp(26px, 7vw, 34px) !important;
  line-height: 1.08 !important;
  letter-spacing: -0.025em !important;
  color: #10263d !important;
}
main > div > section.rounded-3xl > div:first-child > p {
  margin-top: 10px !important;
  max-width: 40rem !important;
  font-size: 15px !important;
  line-height: 1.55 !important;
}

main section.rounded-3xl .grid.grid-cols-3 {
  margin-top: 16px !important;
  display: grid !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  gap: 8px !important;
}
main section.rounded-3xl .grid.grid-cols-3 > div {
  min-width: 0 !important;
  min-height: 64px !important;
  padding: 9px 6px !important;
  justify-content: center !important;
  text-align: center !important;
  flex-direction: column !important;
  gap: 5px !important;
}
main section.rounded-3xl .grid.grid-cols-3 svg {
  width: 19px !important;
  height: 19px !important;
  color: #2087e8 !important;
}
main section.rounded-3xl .grid.grid-cols-3 span {
  font-size: 11px !important;
  line-height: 1.15 !important;
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: clip !important;
}

main > div > section.rounded-3xl > div:last-child {
  padding: 12px 20px 18px !important;
  border-top: 0 !important;
  background: transparent !important;
}
main > div > section.rounded-3xl > div:last-child > p {
  margin-top: 0 !important;
}

body[data-restless-theme="light"] main > div > section.rounded-3xl {
  background: #ffffff !important;
  border: 1px solid #dbe6ef !important;
  box-shadow: 0 12px 34px rgba(15,42,68,.07) !important;
}
body[data-restless-theme="dark"] main > div > section.rounded-3xl {
  background: #102b45 !important;
  border: 1px solid rgba(112,174,226,.22) !important;
  box-shadow: none !important;
}
body[data-restless-theme="dark"] main > div > section.rounded-3xl h2 {
  color: #ffffff !important;
}
body[data-restless-theme="dark"] main > div > section.rounded-3xl > div:first-child > p {
  color: #b8c8d7 !important;
}

@media (max-width: 640px) {
  main > div > section.rounded-3xl > div:first-child { padding: 18px 18px 12px !important; }
  main > div > section.rounded-3xl > div:last-child { padding: 10px 18px 16px !important; }
}
`;

const style = document.createElement('style');
style.id = 'restless-welcome-context';
style.textContent = CONTEXT_CSS;
document.head.appendChild(style);

function isSpanish() {
  return Array.from(document.querySelectorAll('button')).some((button) => button.textContent?.trim() === 'EN');
}

function updateWelcomeContext() {
  const section = document.querySelector('main > div > section.rounded-3xl');
  if (!section) return;

  const spanish = isSpanish();
  const title = section.querySelector('h2');
  const body = section.querySelector('div:first-child > p');
  if (title) {
    title.textContent = spanish
      ? 'Haz las preguntas que de verdad tienes.'
      : 'Ask the questions you’re really asking.';
  }
  if (body) {
    body.textContent = spanish
      ? 'Haz preguntas difíciles sobre Dios, el cristianismo y la fe católica. Restless ofrece respuestas claras, muestra las fuentes y propone próximos pasos prácticos.'
      : 'Ask difficult questions about God, Christianity, and the Catholic faith. Restless gives clear answers, shows the sources, and suggests practical next steps.';
  }
}

let queued = false;
const observer = new MutationObserver(() => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    updateWelcomeContext();
  });
});
observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
window.addEventListener('load', updateWelcomeContext);
updateWelcomeContext();
