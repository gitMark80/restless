const CLEANUP_CSS = `
:root {
  --rf-blue: #2087e8;
  --rf-blue-soft: #eaf4ff;
  --rf-navy: #0f2a44;
  --rf-paper: #ffffff;
  --rf-line: #dbe6ef;
  --rf-light-bg: #f7fafc;
}

.restless-mockup-strip { display: none !important; }
main section.rounded-3xl > div:last-child > .flex.items-start.gap-3 { display: none !important; }
main section.rounded-3xl > div:last-child > p.mt-4 { margin-top: 0 !important; }
[data-restless-conversion-path] { display: none !important; }

body[data-restless-theme="light"] {
  --rf-cream: var(--rf-light-bg) !important;
  --rf-paper: #ffffff !important;
  --rf-ink: #10263d !important;
  --rf-muted: #60758a !important;
  --rf-line: #dbe6ef !important;
  background: var(--rf-light-bg) !important;
}
body[data-restless-theme="light"] > #root > div,
body[data-restless-theme="light"] header,
body[data-restless-theme="light"] main,
body[data-restless-theme="light"] footer { background: var(--rf-light-bg) !important; }
body[data-restless-theme="light"] header > div,
body[data-restless-theme="light"] footer > div,
body[data-restless-theme="light"] main section.rounded-3xl { background-color: #ffffff !important; }
body[data-restless-theme="light"] main section.rounded-3xl::before {
  background: radial-gradient(circle at 82% 22%, rgba(255,226,185,.28), transparent 27%), linear-gradient(135deg, rgba(240,248,255,.98), rgba(255,255,255,.98)) !important;
}

/* All formerly cream/yellow content cards in light mode become soft Restless blue. */
body[data-restless-theme="light"] main .rounded-2xl,
body[data-restless-theme="light"] main .rounded-xl,
body[data-restless-theme="light"] main .space-y-2 > button,
body[data-restless-theme="light"] [data-restless-next-step] {
  background-color: #eaf4ff !important;
  border-color: #b9daf7 !important;
}
body[data-restless-theme="light"] [data-restless-next-step] {
  box-shadow: inset 4px 0 0 #55aaf2 !important;
}

/* Question field is blue in both themes, never gold. */
footer textarea { border-color: rgba(85,170,242,.48) !important; }
body[data-restless-theme="light"] footer textarea {
  background: #eaf4ff !important;
  border: 1.5px solid #9ccdf8 !important;
  color: var(--rf-navy) !important;
}
body[data-restless-theme="dark"] footer textarea {
  background: #173b5b !important;
  border: 1.5px solid #397fb8 !important;
  color: #fff !important;
}
body[data-restless-theme="light"] footer textarea:focus,
body[data-restless-theme="dark"] footer textarea:focus {
  border-color: var(--rf-blue) !important;
  box-shadow: 0 0 0 3px rgba(32,135,232,.12) !important;
}
body[data-restless-theme="light"] footer textarea::placeholder { color:#6f8da9 !important; }
body[data-restless-theme="dark"] footer textarea::placeholder { color:#9ab4ca !important; }
footer .w-12.h-12:not(:disabled) { background: var(--rf-blue) !important; color:#fff!important; }

main section.rounded-3xl .grid.grid-cols-3 { display:grid!important; grid-template-columns:repeat(3,minmax(0,1fr))!important; gap:8px!important; }
main section.rounded-3xl .grid.grid-cols-3 > div { min-width:0!important; padding:10px 7px!important; justify-content:center!important; text-align:center!important; flex-direction:column!important; gap:5px!important; }
main section.rounded-3xl .grid.grid-cols-3 svg { color:var(--rf-blue)!important; width:18px!important; height:18px!important; }
main section.rounded-3xl .grid.grid-cols-3 span { color:var(--rf-navy)!important; font-size:11px!important; line-height:1.1!important; white-space:normal!important; overflow:visible!important; text-overflow:clip!important; }

main svg, main a, main button, [data-restless-next-step] > p:first-child, [data-restless-next-step] a, [data-restless-next-step] button { color:var(--rf-blue)!important; }
main .space-y-2 button svg { color:var(--rf-blue)!important; }
main .space-y-2 button svg:first-child { color:#55aaf2!important; }

div.fixed.inset-0 > div { background:var(--rf-paper)!important; border-color:var(--rf-line)!important; box-shadow:0 22px 60px rgba(15,42,68,.18)!important; }
div.fixed.inset-0 > div h2 { color:var(--rf-navy)!important; font-family:Georgia,'Times New Roman',serif!important; }
div.fixed.inset-0 > div p { color:#60758a!important; }
div.fixed.inset-0 > div a { background:var(--rf-blue)!important; color:#fff!important; border:0!important; box-shadow:0 8px 20px rgba(32,135,232,.22)!important; }
div.fixed.inset-0 > div button svg { color:var(--rf-navy)!important; }
body[data-restless-theme="dark"] div.fixed.inset-0 > div { background:#0f2941!important; border-color:rgba(255,255,255,.10)!important; }
body[data-restless-theme="dark"] div.fixed.inset-0 > div h2 { color:#fff!important; }
body[data-restless-theme="dark"] div.fixed.inset-0 > div p { color:#b8c8d7!important; }

@keyframes restless-thinking-wave { 0%,60%,100%{transform:translateY(0);opacity:.42} 30%{transform:translateY(-5px);opacity:1} }
.restless-orbit-spinner { width:auto!important; height:14px!important; display:flex!important; align-items:center!important; gap:5px!important; animation:none!important; }
.restless-orbit-spinner > span { position:static!important; width:7px!important; height:7px!important; background:var(--rf-blue)!important; opacity:.42; transform:none!important; animation:restless-thinking-wave 1.05s ease-in-out infinite!important; }
.restless-orbit-spinner > span:nth-child(2){animation-delay:.14s!important}.restless-orbit-spinner > span:nth-child(3){animation-delay:.28s!important}.restless-orbit-spinner > span:nth-child(n+4){display:none!important}
span.animate-bounce { background-color:var(--rf-blue)!important; }
footer button[style*="font-weight: 700"], footer button[style*="font-weight: 600"] { color:#60758a!important; }

@media(max-width:640px){main section.rounded-3xl > div:last-child{padding-top:18px!important}main section.rounded-3xl .grid.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))!important}main section.rounded-3xl .grid.grid-cols-3 > div{min-height:64px!important}}
`;

const cleanupStyle=document.createElement('style');
cleanupStyle.id='restless-mockup-cleanup';
cleanupStyle.textContent=CLEANUP_CSS;
document.head.appendChild(cleanupStyle);

function cleanLegacyExtras(){
 document.querySelectorAll('.restless-mockup-strip,[data-restless-conversion-path]').forEach(node=>node.remove());
 const section=document.querySelector('main section.rounded-3xl');
 if(section){const labels=section.querySelectorAll('.grid.grid-cols-3 span');const spanish=Array.from(document.querySelectorAll('button')).some(button=>button.textContent?.trim()==='EN');const copy=spanish?['Respuestas','Fuentes','Próximos pasos']:['Answers','Sources','Next steps'];labels.forEach((label,index)=>{if(copy[index]&&label.textContent!==copy[index])label.textContent=copy[index]})}
}
let cleanupScheduled=false;
const cleanupObserver=new MutationObserver(()=>{if(cleanupScheduled)return;cleanupScheduled=true;requestAnimationFrame(()=>{cleanupScheduled=false;cleanLegacyExtras()})});
cleanupObserver.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
window.addEventListener('load',cleanLegacyExtras);cleanLegacyExtras();
