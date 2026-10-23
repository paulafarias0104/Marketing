(()=>{
'use strict';
const M=window.MKT;if(!M)return;
let filter='all',search='';
const statusLabel=s=>s==='coming'?'Viene llegando':s==='arrived'?'Llegó':s==='absent'?'No vendrá':s==='confirmed'?'Confirmado':'Pendiente';
const statusOrder=s=>({coming:0,pending:1,confirmed:2,arrived:3,absent:4}[s]??5);
function renderLiveList(){
 const grid=document.querySelector('.v3-live-grid');
 if(!grid||document.querySelector('.live-list-shell'))return;
 const e=M.state.events.find(x=>x.id===M.selectedEvent);if(!e)return;
 const section=grid.closest('section')||grid.parentElement;
 const all=M.state.attendees.filter(x=>x.eventId===e.id);
 const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const rows=[...all].filter(x=>(filter==='all'||x.status===filter)&&(!search||norm([x.name,x.company,x.role,x.email].join(' ')).includes(norm(search)))).sort((a,b)=>statusOrder(a.status)-statusOrder(b.status)||String(a.name).localeCompare(String(b.name),'es'));
 const counts={pending:all.filter(x=>['pending','confirmed'].includes(x.status)).length,coming:all.filter(x=>x.status==='coming').length,arrived:all.filter(x=>x.status==='arrived').length,absent:all.filter(x=>x.status==='absent').length};
 section.innerHTML=`<div class="live-list-shell">
   <div class="panel-head"><div><div class="live-mode-title"><h2 style="margin:0">Live · Recepción</h2><span class="badge blue">${M.esc(e.name)}</span></div><p>Busca al asistente y actualiza su estado desde una sola lista.</p></div></div>
   <div class="live-summary">
    <div class="live-summary-card"><span>Pendientes</span><strong>${counts.pending}</strong></div>
    <div class="live-summary-card"><span>Viene llegando</span><strong>${counts.coming}</strong></div>
    <div class="live-summary-card"><span>Llegaron</span><strong>${counts.arrived}</strong></div>
    <div class="live-summary-card"><span>No vendrán</span><strong>${counts.absent}</strong></div>
   </div>
   <div class="live-tools">
    <label class="live-search"><input id="liveSearch" value="${M.esc(search)}" placeholder="Buscar por nombre, empresa, cargo o correo"></label>
    <div class="live-filter">
      <button class="button ${filter==='all'?'active':''}" data-live-filter="all">Todos</button>
      <button class="button ${filter==='coming'?'active':''}" data-live-filter="coming">Viene llegando</button>
      <button class="button ${filter==='arrived'?'active':''}" data-live-filter="arrived">Llegaron</button>
      <button class="button ${filter==='absent'?'active':''}" data-live-filter="absent">No vendrán</button>
    </div>
   </div>
   <div class="live-list">
    <div class="live-list-head"><div>Asistente</div><div>Empresa</div><div>Estado</div><div style="text-align:right">Marcar</div></div>
    ${rows.length?rows.map(x=>`<div class="live-row">
      <div class="live-person"><strong>${M.esc(x.name)}</strong><span>${M.esc(x.role||'Sin cargo')}${x.email?' · '+M.esc(x.email):''}</span></div>
      <div class="live-company"><strong>${M.esc(x.company||'—')}</strong><span>${x.client?'Cliente':'Prospecto'}</span></div>
      <div><span class="live-status ${M.esc(x.status)}">${statusLabel(x.status)}</span></div>
      <div class="live-actions">
       <button class="button ${x.status==='coming'?'is-active':''}" data-live-list-status="coming" data-id="${x.id}">◷ Viene llegando</button>
       <button class="button primary ${x.status==='arrived'?'is-active':''}" data-live-list-status="arrived" data-id="${x.id}">✓ Llegó</button>
       <button class="button ${x.status==='absent'?'is-active':''}" data-live-list-status="absent" data-id="${x.id}">No vendrá</button>
      </div>
    </div>`).join(''):'<div class="live-empty">No hay asistentes para este filtro.</div>'}
   </div>
   <div class="live-note">Los cambios quedan guardados inmediatamente en el evento.</div>
  </div>`;
 document.getElementById('liveSearch').oninput=ev=>{search=ev.target.value;rerender(section)};
 section.querySelectorAll('[data-live-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.liveFilter;rerender(section)});
 section.querySelectorAll('[data-live-list-status]').forEach(b=>b.onclick=()=>{if(!M.canLiveEdit())return;const p=M.state.attendees.find(x=>x.id===b.dataset.id);if(!p)return;p.status=b.dataset.liveListStatus;M.save();rerender(section)});
 }
 function rerender(section){section.innerHTML='<div class="v3-live-grid"></div>';renderLiveList()}
 const observer=new MutationObserver(()=>renderLiveList());
 observer.observe(document.getElementById('main'),{childList:true,subtree:true});
 renderLiveList();
})();