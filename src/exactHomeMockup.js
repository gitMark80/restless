const HERO_IMAGE = 'https://images.unsplash.com/photo-1785195000037-097967227062?auto=format&fit=crop&fm=jpg&q=82&w=1600';

const CSS = `
body.rf-exact-home { background:#f7f9fb !important; }
body.rf-exact-home #root > div > header,
body.rf-exact-home #root > div > main,
body.rf-exact-home #root > div > footer { visibility:hidden !important; pointer-events:none !important; }
#rf-exact-home { position:fixed; inset:0; z-index:100; overflow:auto; background:#f7f9fb; color:#10263d; font-family:Arial,Helvetica,sans-serif; }
#rf-exact-home * { box-sizing:border-box; }
.rf-shell { width:min(100%,706px); margin:0 auto; background:#fff; min-height:100%; }
.rf-top { height:96px; display:flex; align-items:center; justify-content:space-between; padding:0 38px; background:#fff; border-bottom:1px solid #e9eef3; position:sticky; top:0; z-index:4; }
.rf-brand { font:700 32px Georgia,'Times New Roman',serif; letter-spacing:-1.2px; color:#10263d; white-space:nowrap; }
.rf-brand .faith { color:#2087e8; }
.rf-controls { display:flex; gap:18px; align-items:center; font-size:18px; font-weight:700; }
.rf-lang,.rf-theme { border:0; background:transparent; color:#10263d; font:inherit; cursor:pointer; }
.rf-theme { width:34px;height:34px;border-radius:50%;font-size:22px; }
.rf-hero { position:relative; min-height:610px; overflow:hidden; background:linear-gradient(90deg,rgba(251,247,238,.96) 0%,rgba(251,247,238,.88) 42%,rgba(251,247,238,.12) 66%), url('${HERO_IMAGE}') center right/cover no-repeat; }
.rf-hero-copy { position:relative; z-index:2; padding:64px 54px 130px; max-width:500px; }
.rf-hero h1 { margin:0; font:700 54px/1.02 Georgia,'Times New Roman',serif; letter-spacing:-2px; color:#10263d; }
.rf-hero p { margin:28px 0 0; max-width:360px; font-size:25px; line-height:1.35; color:#10263d; }
.rf-askbar { position:absolute; left:34px; right:34px; bottom:-38px; height:82px; background:white; border:1px solid #d7e0e8; border-radius:42px; box-shadow:0 10px 26px rgba(15,42,68,.18); display:flex; align-items:center; gap:14px; padding:0 16px 0 25px; z-index:3; }
.rf-search { font-size:34px; line-height:1; color:#10263d; transform:rotate(-15deg); }
.rf-askbar input { flex:1; border:0; outline:0; font-size:22px; color:#10263d; background:transparent; min-width:0; }
.rf-askbar input::placeholder { color:#536a80; }
.rf-send { width:58px;height:58px;border:0;border-radius:50%;background:#1683dc;color:#fff;font-size:32px;cursor:pointer; box-shadow:0 5px 12px rgba(32,135,232,.25); }
.rf-below { padding:74px 32px 0; background:linear-gradient(#f7f9fb,#fff 24%); }
.rf-label { margin:0 0 16px 6px; font-size:14px; font-weight:900; letter-spacing:2.5px; color:#10263d; }
.rf-qgrid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.rf-q { min-height:98px; border:0; border-radius:16px; background:#eaf4ff; padding:18px 42px 18px 20px; text-align:left; position:relative; font-size:19px; line-height:1.25; color:#10263d; cursor:pointer; }
.rf-q::after { content:'›'; position:absolute; right:19px; top:50%; transform:translateY(-50%); font-size:34px; color:#10263d; }
.rf-promises { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; padding:62px 8px 46px; text-align:center; }
.rf-promise .ico { width:48px;height:48px;margin:0 auto 10px; display:grid;place-items:center; font-size:42px; line-height:1; color:#10263d; }
.rf-promise strong { display:block; font-size:18px; color:#10263d; }
.rf-promise span { display:block; font-size:14px; line-height:1.35; color:#334a61; margin-top:8px; }
.rf-quote { background:#0f3558; color:white; text-align:center; padding:36px 18px 40px; }
.rf-quote em { display:block; font:italic 30px Georgia,'Times New Roman',serif; }
.rf-quote div { margin-top:12px; font-size:18px; }
@media(max-width:560px){
 .rf-top{height:76px;padding:0 20px}.rf-brand{font-size:24px}.rf-controls{font-size:15px;gap:12px}
 .rf-hero{min-height:520px;background-position:58% center}.rf-hero-copy{padding:48px 34px 120px;max-width:390px}.rf-hero h1{font-size:42px}.rf-hero p{font-size:20px;max-width:280px}
 .rf-askbar{left:22px;right:22px;height:70px;bottom:-34px}.rf-askbar input{font-size:18px}.rf-send{width:52px;height:52px}.rf-below{padding:66px 20px 0}
 .rf-q{min-height:92px;font-size:16px;padding-left:16px}.rf-promises{padding-top:48px;gap:8px}.rf-promise strong{font-size:14px}.rf-promise span{font-size:11px}.rf-promise .ico{font-size:34px;height:40px}
}
`;

const style=document.createElement('style');style.id='rf-exact-home-style';style.textContent=CSS;document.head.appendChild(style);

function clickButtonByText(text){ const b=[...document.querySelectorAll('#root button')].find(x=>x.textContent?.trim()===text); b?.click(); }
function originalInput(){ return document.querySelector('#root textarea[data-question-input]'); }
function setOriginalQuestion(v){ const t=originalInput(); if(!t)return; const d=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value'); d?.set?.call(t,v); t.dispatchEvent(new Event('input',{bubbles:true})); }
function sendQuestion(v){ if(!v.trim())return; setOriginalQuestion(v); requestAnimationFrame(()=>{ const t=originalInput(); const btn=t?.parentElement?.querySelector('button'); btn?.click(); }); }
function isSpanish(){ return [...document.querySelectorAll('#root button')].some(b=>b.textContent?.trim()==='EN'); }
function isLight(){ return document.body.dataset.restlessTheme==='light'; }

function copyFor(lang){
 if(lang==='es') return {title:'Para las preguntas que no te dejan en paz.',body:'Explora a Dios. El cristianismo. La fe católica. Con honestidad, evidencia y próximos pasos reales.',try:'PRUEBA UNA PREGUNTA',placeholder:'Haz tu pregunta...',qs:['¿Por qué permite Dios el sufrimiento?','¿Por qué las mujeres no pueden ser sacerdotes?','¿Sigue siendo confiable la Iglesia Católica?','¿Qué evidencia existe de la Resurrección?','¿Es la Eucaristía realmente Jesús?','¿Cómo sé si el catolicismo es verdadero?'],labels:['Respuestas','Fuentes','Próximos pasos'],descs:['Claras, bien investigadas y fáciles de entender.','Mira de dónde vienen las respuestas.','Orientación para llevarlo a la vida real.'],quote:'«Busca y encontrarás.»'};
 return {title:'For the questions that won’t leave you alone.',body:'Explore God. Christianity. The Catholic faith. With honesty, evidence, and real next steps.',try:'TRY A QUESTION',placeholder:'Ask your question...',qs:['Why does God allow suffering?','Why can’t women be priests?','Is the Catholic Church still trustworthy?','What evidence is there for the Resurrection?','Is the Eucharist really Jesus?','How do I know if Catholicism is true?'],labels:['Answers','Sources','Next steps'],descs:['Honest, well-researched and easy to understand.','Know where the answers come from.','Real-world guidance for your journey.'],quote:'“Seek and you will find.”'};
}

function render(){
 const welcome=document.querySelector('#root main section.rounded-3xl');
 const old=document.getElementById('rf-exact-home');
 if(!welcome){ old?.remove(); document.body.classList.remove('rf-exact-home'); return; }
 if(old) return;
 document.body.classList.add('rf-exact-home');
 const lang=isSpanish()?'es':'en', c=copyFor(lang);
 const el=document.createElement('div');el.id='rf-exact-home';
 el.innerHTML=`<div class="rf-shell"><div class="rf-top"><div class="rf-brand">Restless<span class="faith">.faith</span></div><div class="rf-controls"><button class="rf-lang">${lang==='es'?'Español':'English'}⌄</button><button class="rf-theme">${isLight()?'◐':'☾'}</button></div></div><section class="rf-hero"><div class="rf-hero-copy"><h1>${c.title}</h1><p>${c.body.replaceAll('. ','.<br>')}</p></div><div class="rf-askbar"><span class="rf-search">⌕</span><input placeholder="${c.placeholder}"/><button class="rf-send">→</button></div></section><div class="rf-below"><div class="rf-label">${c.try}</div><div class="rf-qgrid">${c.qs.map(q=>`<button class="rf-q">${q}</button>`).join('')}</div><div class="rf-promises"><div class="rf-promise"><div class="ico">▱</div><strong>${c.labels[0]}</strong><span>${c.descs[0]}</span></div><div class="rf-promise"><div class="ico">♢</div><strong>${c.labels[1]}</strong><span>${c.descs[1]}</span></div><div class="rf-promise"><div class="ico">⌁</div><strong>${c.labels[2]}</strong><span>${c.descs[2]}</span></div></div></div><div class="rf-quote"><em>${c.quote}</em><div>— Matthew 7:7</div></div></div>`;
 document.body.appendChild(el);
 const input=el.querySelector('.rf-askbar input'); el.querySelector('.rf-send').onclick=()=>sendQuestion(input.value); input.onkeydown=e=>{if(e.key==='Enter')sendQuestion(input.value)};
 el.querySelectorAll('.rf-q').forEach((b,i)=>b.onclick=()=>{input.value=c.qs[i];input.focus();input.scrollIntoView({behavior:'smooth',block:'center'})});
 el.querySelector('.rf-lang').onclick=()=>{ clickButtonByText(lang==='es'?'EN':'ES'); el.remove(); document.body.classList.remove('rf-exact-home'); setTimeout(render,40); };
 el.querySelector('.rf-theme').onclick=()=>{ const btn=[...document.querySelectorAll('#root button')].find(b=>/mode|modo/i.test(b.getAttribute('aria-label')||'')); btn?.click(); el.remove(); document.body.classList.remove('rf-exact-home'); setTimeout(render,40); };
}
let queued=false;const obs=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})});obs.observe(document.documentElement,{childList:true,subtree:true,characterData:true});window.addEventListener('load',render);render();
