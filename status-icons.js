(()=>{
'use strict';
function mark(){
  document.querySelectorAll('.mp-list-item').forEach(el=>{
    el.classList.remove('mp-executed','mp-future','mp-paused');
    const t=(el.textContent||'').toLowerCase();
    if(t.includes('ejecutado')) el.classList.add('mp-executed');
    else if(t.includes('en pausa')||t.includes('pendiente vencido')||t.includes('vencido')) el.classList.add('mp-paused');
    else if(t.includes('planificado')||t.includes('pendiente')) el.classList.add('mp-future');
  });
  document.querySelectorAll('.mp-item').forEach(el=>{
    const strong=el.querySelector('strong');
    if(strong) strong.classList.add('mp-status-title');
  });
  document.querySelectorAll('.badge').forEach(el=>{
    const t=(el.textContent||'').trim().toLowerCase();
    el.classList.remove('mp-status-icon','executed','future','paused');
    if(t==='ejecutado'||t==='cerrada'||t==='cerrado') el.classList.add('mp-status-icon','executed');
    else if(t==='planificado'||t==='pendiente') el.classList.add('mp-status-icon','future');
    else if(t.includes('pausa')||t.includes('vencido')) el.classList.add('mp-status-icon','paused');
  });
}
let scheduled=false;
const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;mark()})};
new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,characterData:true});
document.addEventListener('change',schedule,true);
document.addEventListener('click',schedule,true);
mark();
})();