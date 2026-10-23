(()=>{
'use strict';
const M=window.MKT;if(!M)return;
const TEMPLATE=[
 ['Pre','Definir objetivo, tema y audiencia','Paula'],
 ['Pre','Confirmar lugar, fecha y formato','Paula'],
 ['Pre','Confirmar speaker / expositor','Paula'],
 ['Pre','Gestionar aporte o financiamiento de proveedor','Paula'],
 ['Pre','Preparar material y requerimientos de diseño','Priscila'],
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
 ['Post','Enviar correo de agradecimiento','Priscila'],
 ['Post','Compartir material o presentación','Priscila'],
 ['Post','Solicitar contacto comercial de asistentes','Priscila'],
 ['Post','Solicitar actualización de reuniones y oportunidades','Paula'],
 ['Post','Registrar oportunidades, cierres y venta atribuida','Paula'],
 ['Post','Cerrar resultados y aprendizajes del evento','Paula']
];
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
function ensureTasks(e){
 e.tasks=e.tasks||[];
 const existing=new Set(e.tasks.map(t=>norm(t.name)));
 let changed=false;
 TEMPLATE.forEach(([phase,name,owner])=>{if(!existing.has(norm(name))){e.tasks.push({id:M.uid('task'),phase,name,owner,due:'',comment:'',done:false});changed=true}});
 if(changed)M.save();
}
function taskForm(e,item=null,phase='Pre'){
 const html=M.select('phase','Etapa',[['Pre','Antes del evento'],['Post','Post evento']],item?.phase||phase,true)+M.field('name','Actividad',item?.name||'','text',true)+M.field('owner','Responsable',item?.owner||'Priscila')+M.field('due','Fecha objetivo',item?.due||'','date')+M.textarea('comment','Comentario / detalle',item?.comment||'')+M.select('done','Estado',[['false','Pendiente'],['true','Completada']],String(item?.done??false));
 M.openModal(item?'Editar actividad':'Nueva actividad',html,raw=>{const x=item||{id:M.uid('task')};Object.assign(x,raw,{done:raw.done==='true'});if(!item)e.tasks.push(x)},'CHECKLIST');
}
function taskCard(t,e){
 const meta=[t.owner||'',t.due?`Fecha ${M.fmtDate(t.due)}`:'',t.comment||''].filter(Boolean).join(' · ');
 return `<div class="event-task-row ${t.done?'done':''}">
   <input type="checkbox" data-check-task="${t.id}" ${t.done?'checked':''} ${M.canEdit()?'':'disabled'}>
   <div class="event-task-main"><strong>${M.esc(t.name)}</strong><small>${M.esc(meta||'Sin detalle adicional')}</small></div>
   <div class="event-task-actions">${M.canEdit()?`<button class="button small" data-edit-check="${t.id}">Editar</button>`:''}</div>
 </div>`;
}
function block(e,phase,title,icon){const rows=(e.tasks||[]).filter(t=>t.phase===phase),done=rows.filter(t=>t.done).length;return `<section class="event-checklist-block">
 <div class="panel-head"><div><div class="event-checklist-title"><span>${icon}</span><h2>${title}</h2><span class="event-checklist-badge">${done}/${rows.length}</span></div><p>${phase==='Pre'?'Preparación previa y validaciones necesarias antes del evento.':'Seguimiento, cierre comercial y medición posterior al evento.'}</p></div>${M.canEdit()?`<button class="button" data-add-check="${phase}">+ Actividad</button>`:''}</div>
 <div class="event-checklist-list">${rows.length?rows.map(t=>taskCard(t,e)).join(''):'<div class="event-checklist-empty">Sin actividades.</div>'}</div>
 </section>`}
function enhance(){
 const title=[...document.querySelectorAll('#main h2')].find(h=>/checklist pre y post/i.test(h.textContent||''));
 if(!title||document.querySelector('.event-checklist-wrap'))return;
 const e=M.state.events.find(x=>x.id===M.selectedEvent);if(!e)return;
 ensureTasks(e);
 const section=title.closest('section');if(!section)return;
 section.outerHTML=`<div class="event-checklist-wrap">${block(e,'Pre','Antes del evento','◷')}${block(e,'Post','Post evento','✓')}</div>`;
 bind(e);
}
function bind(e){
 document.querySelectorAll('[data-check-task]').forEach(c=>c.onchange=()=>{if(!M.canEdit())return;const t=e.tasks.find(x=>x.id===c.dataset.checkTask);if(!t)return;t.done=c.checked;M.save();rerender()});
 document.querySelectorAll('[data-edit-check]').forEach(b=>b.onclick=()=>{const t=e.tasks.find(x=>x.id===b.dataset.editCheck);if(t)taskForm(e,t,t.phase)});
 document.querySelectorAll('[data-add-check]').forEach(b=>b.onclick=()=>taskForm(e,null,b.dataset.addCheck));
}
function rerender(){const wrap=document.querySelector('.event-checklist-wrap');if(!wrap)return;const e=M.state.events.find(x=>x.id===M.selectedEvent);wrap.outerHTML=`<div class="event-checklist-wrap">${block(e,'Pre','Antes del evento','◷')}${block(e,'Post','Post evento','✓')}</div>`;bind(e)}
const obs=new MutationObserver(()=>enhance());obs.observe(document.getElementById('main'),{childList:true,subtree:true});enhance();
})();