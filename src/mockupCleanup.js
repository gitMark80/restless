const CLEANUP_CSS = `
/* Keep the approved mockup language consistent throughout the app. */
:root { --rf-blue: #2087e8; --rf-blue-soft: #eaf4ff; --rf-navy: #0f2a44; --rf-paper: #ffffff; --rf-line: #dbe6ef; }

/* Remove the redundant three-card strip added beneath the hero. */
.restless-mockup-strip { display: none !important; }

/* Remove the old Studying Theology promo and the extra conversion promo it generated,
   while leaving the Try a question choices available. */
main section.rounded-3xl > div:last-child > .flex.items-start.gap-3 { display: none !important; }
main section.rounded-3xl > div:last-child > p.mt-4 { margin-top: 0 !important; }
[data-restless-conversion-path] { display: none !important; }

/* Blue replaces the legacy gold/yellow accent throughout answer/source/next-step UI. */
main svg,
main a,
main button,
[data-restless-next-step] > p:first-child,
[data-restless-next-step] a,
[data-restless-next-step] button { color: var(--rf-blue) !important; }

/* Source cards: restore the light-blue book/chevron treatment. */
main .space-y-2 button svg { color: var(--rf-blue) !important; }
main .space-y-2 button svg:first-child { color: #55aaf2 !important; }

/* About, Contact, Support and text-size sheets should use the same white/navy/blue system. */
div.fixed.inset-0 > div {
  background: var(--rf-paper) !important;
  border-color: var(--rf-line) !important;
  box-shadow: 0 22px 60px rgba(15,42,68,.18) !important;
}
div.fixed.inset-0 > div h2 { color: var(--rf-navy) !important; font-family: Georgia, 'Times New Roman', serif !important; }
div.fixed.inset-0 > div p { color: #60758a !important; }
div.fixed.inset-0 > div a {
  background: var(--rf-blue) !important;
  color: #fff !important;
  border: 0 !important;
  box-shadow: 0 8px 20px rgba(32,135,232,.22) !important;
}
div.fixed.inset-0 > div button svg { color: var(--rf-navy) !important; }
body[data-restless-theme="dark"] div.fixed.inset-0 > div { background:#0f2941 !important; border-color:rgba(255,255,255,.10)!important; }
body[data-restless-theme="dark"] div.fixed.inset-0 > div h2 { color:#fff!important; }
body[data-restless-theme="dark"] div.fixed.inset-0 > div p { color:#b8c8d7!important; }

/* Replace the orbiting loader with a simple three-dot thinking wave. */
@keyframes restless-thinking-wave {
  0%, 60%, 100% { transform: translateY(0); opacity: .42; }
  30% { transform: translateY(-5px); opacity: 1; }
}
.restless-orbit-spinner {
  width: auto !important;
  height: 14px !important;
  display: flex !important;
  align-items: center !important;
  gap: 5px !important;
  animation: none !important;
}
.restless-orbit-spinner > span {
  position: static !important;
  width: 7px !important;
  height: 7px !important;
  background: var(--rf-blue) !important;
  opacity: .42;
  transform: none !important;
  animation: restless-thinking-wave 1.05s ease-in-out infinite !important;
}
.restless-orbit-spinner > span:nth-child(2) { animation-delay: .14s !important; }
.restless-orbit-spinner > span:nth-child(3) { animation-delay: .28s !important; }
.restless-orbit-spinner > span:nth-child(n+4) { display: none !important; }

/* Make the original React three-dot loader blue too, before the polish observer touches it. */
span.animate-bounce { background-color: var(--rf-blue) !important; }

/* Prevent legacy accent colors from leaking into footer actions and selected controls. */
footer button[style*="font-weight: 700"],
footer button[style*="font-weight: 600"] { color: #60758a !important; }
footer .w-12.h-12:not(:disabled) { background: var(--rf-blue) !important; color:#fff!important; }

@media (max-width: 640px) {
  main section.rounded-3xl > div:last-child { padding-top: 18px !important; }
}
`;

const cleanupStyle = document.createElement('style');
cleanupStyle.id = 'restless-mockup-cleanup';
cleanupStyle.textContent = CLEANUP_CSS;
document.head.appendChild(cleanupStyle);

function cleanLegacyExtras() {
  document.querySelectorAll('.restless-mockup-strip, [data-restless-conversion-path]').forEach((node) => node.remove());
}

let cleanupScheduled = false;
const cleanupObserver = new MutationObserver(() => {
  if (cleanupScheduled) return;
  cleanupScheduled = true;
  requestAnimationFrame(() => {
    cleanupScheduled = false;
    cleanLegacyExtras();
  });
});
cleanupObserver.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('load', cleanLegacyExtras);
cleanLegacyExtras();
