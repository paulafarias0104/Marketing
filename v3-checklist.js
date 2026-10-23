(()=>{
'use strict';
const M=window.MKT;if(!M)return;

const TEMPLATE=[
 ['Pre','Definir objetivo, tema y audiencia','Paula'],
 ['Pre','Confirmar fecha, lugar y formato','Paula'],
 ['Pre','Confirmar speaker / expositor','Paula'],
 ['Pre','Gestionar aporte o financiamiento de proveedor','Paula'],
 ['Pre','Definir material gráfico y requerimientos de diseño','Priscila'],
 ['Pre','Preparar lista de invitados','Priscila'],
 ['Pre','Enviar invitación','Priscila'],
 ['Pre','Enviar recordatorio 1','Priscila'],
 ['Pre','Enviar recordatorio 2','Priscila'],
 ['Pre','Revisar confirmaciones de asistentes','Priscila'],
 ['Pre','Preparar credenciales / registro','Priscila'],
 ['Pre','Preparar regalos / merchandising','Priscila'],
 ['Pre','Confirmar catering / coffee','Priscila'],
 ['Pre','Revisar presentación y material final','Paula'],
 ['Pre','Realizar checklist final del evento','Paula'],
 ['Post','Publicar fotos / contenido post evento','Priscila'],
 ['Post','Enviar correo de agradecimiento','Priscila'],
 ['Post','Compartir presentación o material','Priscila'],
 ['Post','Solicitar contacto comercial de asistentes','Priscila'],
 ['Post','Revisar pendientes de llamados y reuniones','Paula'],
 ['Post','Solicitar actualización de oportunidades','Paula'],
 ['Post','Registrar oportunidades, cierres y venta atribuida','Paula'],
 ['Post','Cerrar resultados y aprendizajes del evento','Paula']
];

const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();

function ensureTasks(e){
 e.tasks=Array.isArray(e.tasks)?e.tasks:[];
 const existing=new Set(e.tasks.map(t=>norm(t.name)));
 let changed=false;
 TEMPLATE.forEach(([phase,name,owner])=>{
   if(!existing.has(norm(name))){
     e.tasks.push({id:M.uid('task'),phase,name,owner,due:'',comment:'',done:false});
     changed=true;
   }
 });
 if(changed)M.save();
}

function taskForm(e,item=null,phase='Pre'){
 const html=
   M.select('phase','Etapa',[['Pre','Antes del evento'],['Post','Post evento']],item?.phase||phase,true)+
   M.field('name','Actividad',item?.name||'','text',true)+
   M.field('owner','Responsable',item?.owner||'Priscila')+
   M.field('due','Fecha objetivo',item?.due||'','date')+
   M.textarea('comment','Comentario / detalle',item?.comment||'')+
   M.select('done','Estado',[['false','Pendiente'],['true','Completada']],String(item?.done??false));
 M.openModal(item?'Editar actividad':'Nueva actividad',html,raw=>{
   const x=item||{id:M.uid('task')};
   Object.assign(x,raw,{done:raw.done==='true'});
   if(!item)e.tasks.push(x);
 },'CHECKLIST EVENTO');
}

function taskRow(t){
 const meta=[];
 if(t.owner)meta.push(t.owner);
 if(t.due)meta.push(`Fecha ${M.fmtDate(t.due)}`);
 if(t.comment)meta.push(t.comment);
 return `<div class="event-task-row ${t.done?'done':''}">
   <input type="checkbox" data-check-task="${t.id}" ${t.done?'checked':''} ${M.canEdit()?'':'disabled'}>
   <div class="event-task-main">
     <strong>${M.esc(t.name)}</strong>
     <small>${M.esc(meta.join(' · ')||'Sin detalle adicional')}</small>
   </div>
   <div class="event-task-actions">
     ${M.canEdit()?`<button class="button small" data-edit-check="${t.id}">Editar</button><button class="button small danger" data-delete-check="${t.id}">Eliminar</button>`:''}
   </div>
 </div>`;
}

function block(e,phase,title,icon,subtitle){
 const rows=(e.tasks||[]).filter(t=>(t.phase||'Pre')===phase);
 const done=rows.filter(t=>t.done).length;
 const pct=rows.length?Math.round(done/rows.length*100):0;
 return `<section class="event-checklist-block">
   <div class="panel-head">
     <div>
       <div class="event-checklist-title"><span>${icon}</span><h2>${title}</h2><span class="event-checklist-badge">${done}/${rows.length}</span></div>
       <p>${subtitle}</p>
       <div class="event-checklist-progress"><div class="bar" style="min-width:150px"><span style="width:${pct}%"></span></div><strong>${pct}%</strong></div>
     </div>
     ${M.canEdit()?`<button class="button" data-add-check="${phase}">+ Actividad</button>`:''}
   </div>
   <div class="event-checklist-list">${rows.length?rows.map(taskRow).join(''):'<div class="event-checklist-empty">Sin actividades.</div>'}</div>
 </section>`;
}

function renderChecklist(){
 const tabs=document.querySelector('#main .v3-event-tabs');
 const active=document.querySelector('#main [data-etab="checklist"].active');
 if(!tabs||!active||!M.selectedEvent)return;
 if(document.querySelector('#main .event-checklist-v2'))return;
 const e=M.state.events.find(x=>x.id===M.selectedEvent);if(!e)return;
 ensureTasks(e);
 [...tabs.parentElement.children].forEach(el=>{if(el!==tabs)el.remove()});
 const wrap=document.createElement('div');
 wrap.className='event-checklist-wrap event-checklist-v2';
 wrap.innerHTML=
   block(e,'Pre','Antes del evento','◷','Preparación, coordinación y validaciones necesarias antes del evento.')+
   block(e,'Post','Post evento','✓','Seguimiento, contenido, gestión comercial y medición posterior al evento.');
 tabs.insertAdjacentElement('afterend',wrap);
 bind(e);
}

function bind(e){
 document.querySelectorAll('[data-check-task]').forEach(c=>c.onchange=()=>{
   if(!M.canEdit())return;
   const t=e.tasks.find(x=>x.id===c.dataset.checkTask);if(!t)return;
   t.done=c.checked;M.save();rerender();
 });
 document.querySelectorAll('[data-edit-check]').forEach(b=>b.onclick=()=>{
   const t=e.tasks.find(x=>x.id===b.dataset.editCheck);if(t)taskForm(e,t,t.phase||'Pre');
 });
 document.querySelectorAll('[data-add-check]').forEach(b=>b.onclick=()=>taskForm(e,null,b.dataset.addCheck));
 document.querySelectorAll('[data-delete-check]').forEach(b=>b.onclick=()=>{
   if(!M.canEdit())return;
   const t=e.tasks.find(x=>x.id===b.dataset.deleteCheck);if(!t)return;
   if(confirm(`¿Eliminar la actividad “${t.name}”?`)){
     e.tasks=e.tasks.filter(x=>x.id!==t.id);M.save();rerender();
   }
 });
}

function rerender(){
 const old=document.querySelector('#main .event-checklist-v2');if(old)old.remove();
 renderChecklist();
}

document.addEventListener('click',e=>{
 if(e.target.closest?.('[data-etab="checklist"]')) setTimeout(renderChecklist,0);
});

const observer=new MutationObserver(()=>renderChecklist());
observer.observe(document.getElementById('main'),{childList:true,subtree:true});
renderChecklist();
})();