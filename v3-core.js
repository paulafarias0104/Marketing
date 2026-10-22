(()=>{
'use strict';
const M=window.MKT={};
M.STORE='tibox_marketing_v3';
M.MONTHS=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
M.ROLE_VIEWS={
 paula:['dashboard','plan','comms','blog','ads','events','webinars','routes','point','coverage','results','settings'],
 priscila:['dashboard','plan','comms','blog','ads','events','webinars','routes','point','coverage','results','settings'],
 gerencia:['dashboard','plan','comms','blog','ads','events','webinars','routes','point','coverage','results'],
 comercial:['dashboard','plan','events','webinars','routes','coverage','results'],
 visor_eventos:['events']
};
M.NAV=[
 ['dashboard','▦','Dashboard'],['plan','◫','Plan de Mercado'],['comms','✦','RRSS & Mailing'],['blog','▤','Blog / SEO'],['ads','◎','Ads'],['events','◇','Eventos'],['webinars','◉','Webinars'],['routes','↗','Rutas'],['point','＋','Acciones puntuales'],['coverage','⌖','Cobertura / Visitas'],['results','$','Resultados'],['settings','⚙','Metas & Mantenedores']
];
M.esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
M.uid=(p='id')=>p+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
M.iso=(y,m,d)=>`${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
M.parseDate=s=>{const m=String(s||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?{y:+m[1],m:+m[2],d:+m[3]}:null};
M.fmtDate=s=>{const p=M.parseDate(s);return p?`${String(p.d).padStart(2,'0')}-${String(p.m).padStart(2,'0')}-${p.y}`:'—'};
M.q=s=>{const p=M.parseDate(s);return p?'Q'+(Math.floor((p.m-1)/3)+1):''};
M.money=n=>`${Number(n||0).toLocaleString('es-CL',{maximumFractionDigits:1})} UF`;
M.canEdit=()=>['paula','priscila'].includes(M.state.role);
M.canLiveEdit=()=>M.canEdit()||M.state.role==='visor_eventos';
M.actionTypes=()=>M.state.config.actionTypes;
M.typeById=id=>M.actionTypes().find(x=>x.id===id)||{id,label:id,icon:'•',color:'#60748d'};
M.macroById=id=>M.state.config.macroareas.find(x=>x.id===id)||null;
M.lineById=id=>M.state.config.lines.find(x=>x.id===id)||null;
M.statusLabel=s=>({idea:'Idea',planned:'Planificado',running:'En ejecución',paused:'En pausa',done:'Ejecutado',closed:'Cerrado'}[s]||s||'Planificado');
M.statusIcon=s=>['done','closed'].includes(s)?'✓':s==='paused'?'⏸':'◷';
M.isPastPending=x=>{if(['done','closed','paused'].includes(x.status))return false;const p=M.parseDate(x.date);if(!p)return false;const d=new Date(p.y,p.m-1,p.d),t=new Date();t.setHours(0,0,0,0);return d<t};
M.visualStatus=x=>['done','closed'].includes(x.status)?{icon:'✓',label:'Ejecutado',cls:'done'}:x.status==='paused'?{icon:'⏸',label:'En pausa',cls:'paused'}:M.isPastPending(x)?{icon:'⚠',label:'Vencido',cls:'overdue'}:{icon:'◷',label:'Pendiente',cls:'pending'};
function seedConfig(){return{
 actionTypes:[
  {id:'rrss',label:'RRSS',icon:'📱',color:'#12B1FD'},{id:'mailing',label:'Mailing',icon:'✉',color:'#011C40'},{id:'blog',label:'Blog / SEO',icon:'📝',color:'#05C7F2'},{id:'ads',label:'Ads',icon:'🎯',color:'#F24C3D'},{id:'event',label:'Evento',icon:'📅',color:'#FCC703'},{id:'webinar',label:'Webinar',icon:'💻',color:'#12B1FD'},{id:'route',label:'Ruta',icon:'🧭',color:'#05C7F2'},{id:'point',label:'Acción puntual',icon:'⚡',color:'#60748d'}
 ],
 macroareas:[
  {id:'productividad',name:'Productividad & Cloud',color:'#12B1FD',months:{}},
  {id:'infra',name:'Infraestructura & Continuidad',color:'#5B718A',months:{'2026':[11,12]}},
  {id:'cyber',name:'Ciberseguridad',color:'#011C40',months:{'2026':[10,11]}},
  {id:'servicios',name:'Servicios TI',color:'#6C8099',months:{}},
  {id:'datos',name:'Datos & Transformación Digital',color:'#05C7F2',months:{'2026':[10,11,12]}},
  {id:'consultoria',name:'Consultoría',color:'#F24C3D',months:{}}
 ],
 lines:[
  {id:'m365',name:'Microsoft 365',macro:'productividad',color:'#12B1FD',months:{'2026':[10]}},
  {id:'cloud',name:'Cloud',macro:'productividad',color:'#05C7F2',months:{}},
  {id:'infra-ti',name:'Infraestructura TI',macro:'infra',color:'#5B718A',months:{'2026':[11]}},
  {id:'backup',name:'Backup & Continuidad',macro:'infra',color:'#6C8099',months:{}},
  {id:'noc',name:'NOC',macro:'infra',color:'#003B8F',months:{'2026':[10,12]}},
  {id:'firewall',name:'Firewall',macro:'cyber',color:'#F24C3D',months:{'2026':[11]}},
  {id:'soc',name:'SOC',macro:'cyber',color:'#011C40',months:{'2026':[11,12]}},
  {id:'security-ms',name:'Seguridad Microsoft',macro:'cyber',color:'#0066FF',months:{'2026':[10]}},
  {id:'mesa',name:'Mesa de Ayuda & Soporte TI',macro:'servicios',color:'#6C8099',months:{}},
  {id:'bi',name:'Analítica & BI',macro:'datos',color:'#FCC703',months:{'2026':[10,12]}},
  {id:'ia',name:'Inteligencia Artificial',macro:'datos',color:'#05C7F2',months:{'2026':[12]}},
  {id:'automation',name:'Automatización / Power Platform',macro:'datos',color:'#12B1FD',months:{'2026':[11,12]}},
  {id:'dev',name:'Desarrollo',macro:'datos',color:'#0B4F9C',months:{}},
  {id:'lpdp',name:'LPDP & DPO',macro:'consultoria',color:'#F24C3D',months:{}}
 ],
 keyDates:[
  {id:'kd1',year:2026,month:10,date:'Todo octubre',text:'Mes de la Ciberseguridad'},
  {id:'kd2',year:2026,month:11,date:'12/11',text:'World Usability Day · oportunidad para IA responsable'},
  {id:'kd3',year:2026,month:12,date:'Diciembre',text:'Navidad y fin de año · saludo corporativo'}
 ]
}}
function seed(){const c=seedConfig();return{
 version:3,role:'paula',config:c,
 social:[
  {id:'s1',date:'2026-10-08',title:'Fotos Evento HPE Talca',network:'LinkedIn',postType:'Fotos evento',line:'infra-ti',service:'HPE / Aruba',status:'done',owner:'Priscila',campaign:'Evento HPE Talca',notes:''},
  {id:'s2',date:'2026-10-10',title:'Reel Evento HPE Talca',network:'LinkedIn + Instagram',postType:'Reel del evento',line:'infra-ti',service:'HPE / Aruba',status:'done',owner:'Priscila',campaign:'Evento HPE Talca',notes:''},
  {id:'s3',date:'2026-10-19',title:'Invitación Webinar Ciberseguridad',network:'LinkedIn',postType:'Imagen fija',line:'security-ms',service:'Ciberseguridad usuarios',status:'done',owner:'Priscila',campaign:'Webinar Ciberseguridad',notes:''},
  {id:'s4',date:'2026-10-22',title:'Post Webinar Ciberseguridad',network:'LinkedIn + Instagram',postType:'Carrusel',line:'security-ms',service:'Ciberseguridad usuarios',status:'planned',owner:'Priscila',campaign:'Webinar Ciberseguridad',notes:''}
 ],
 mailings:[{id:'m1',date:'2026-10-18',title:'Invitación Webinar Ciberseguridad',subject:'Webinar Ciberseguridad usuarios',audience:'Clientes y prospectos',segment:'Base TI',line:'security-ms',service:'Seguridad Microsoft',status:'done',owner:'Priscila',sent:0,opens:0,clicks:0,leads:0}],
 blogs:[{id:'b1',date:'2026-11-12',title:'IA responsable y experiencia de usuario',keyword:'IA responsable',line:'ia',service:'IA empresarial',status:'planned',owner:'Priscila',url:'',visits:0,leads:0}],
 ads:[{id:'a1',name:'Google Ads SOC 24x7',platform:'Google Ads',start:'2026-11-01',end:'2026-11-30',line:'soc',service:'SOC 24x7',budget:20,actual:0,impressions:0,clicks:0,leads:0,opps:0,sales:0,sold:0,status:'planned'}],
 events:[
  {id:'e1',name:'HPE & Aruba Talca',format:'Presencial',date:'2026-10-08',city:'Talca',place:'',line:'infra-ti',service:'HPE / Aruba',sponsor:'HPE',status:'done',budget:0,supplier:0,costs:{traslado:0,catering:0,regalos:0,lugar:0,material:0,otro:0},tasks:[],agenda:[],gifts:[]},
  {id:'e2',name:'Evento Fortinet San Fernando',format:'Presencial',date:'2026-11-04',city:'San Fernando',place:'',line:'firewall',service:'Firewall',sponsor:'Fortinet',status:'planned',budget:0,supplier:0,costs:{traslado:0,catering:0,regalos:0,lugar:0,material:0,otro:0},tasks:[],agenda:[],gifts:[]},
  {id:'e3',name:'Sustentabilidad Viña San Rafael',format:'Presencial',date:'2026-11-18',city:'',place:'Viña San Rafael',line:'infra-ti',service:'Infraestructura / Sustentabilidad',sponsor:'',status:'planned',budget:0,supplier:0,costs:{traslado:0,catering:0,regalos:0,lugar:0,material:0,otro:0},tasks:[],agenda:[],gifts:[]},
  {id:'e4',name:'ETM Day Santiago',format:'Feria',date:'2026-11-19',endDate:'2026-11-21',city:'Santiago',place:'',line:'ia',service:'Tecnología / Innovación',sponsor:'',status:'planned',budget:0,supplier:0,costs:{traslado:0,catering:0,regalos:0,lugar:0,material:0,otro:0},tasks:[],agenda:[],gifts:[]}
 ],
 attendees:[
  {id:'at1',eventId:'e1',name:'Invitado Demo 1',company:'Empresa Demo',role:'',email:'',client:true,status:'arrived',thanks:true,salesCall:true,meeting:false,opportunity:false,closed:false,credential:'',interest:'HPE / Virtualización',giftIds:[]},
  {id:'at2',eventId:'e1',name:'Invitado Demo 2',company:'Empresa Demo',role:'Gerente TI',email:'',client:false,status:'absent',thanks:false,salesCall:false,meeting:false,opportunity:false,closed:false,credential:'',interest:'',giftIds:[]}
 ],
 webinars:[{id:'w1',date:'2026-10-21',name:'Webinar Ciberseguridad usuarios',line:'security-ms',service:'Ciberseguridad usuarios',speaker:'',registered:0,attended:0,status:'planned',opps:0,sales:0,sold:0}],
 routes:[
  {id:'r1',date:'2026-10-19',company:'Agrichile',city:'Camarico',topic:'IA',line:'ia',attendees:12,status:'done',costs:{traslado:0,regalos:0,otro:0},opps:0,sales:0,sold:0,notes:''}
 ],
 pointActions:[
  {id:'p1',date:'2026-12-18',title:'Saludo corporativo Navidad y fin de año',kind:'Video corporativo',line:'ia',service:'Corporativo',status:'planned',owner:'Priscila',notes:''}
 ],
 coverage:[],results:[],eventView:'grid',eventTab:'summary'
}}
function migrate(base){try{const old=JSON.parse(localStorage.getItem('tibox_marketing_v1')||'null');if(!old)return base;if(Array.isArray(old.events)&&old.events.length) base.events=old.events.map(e=>({...e,line:base.config.lines.some(l=>l.id===e.line)?e.line:(base.config.lines.find(l=>l.name===e.line)?.id||'infra-ti'),costs:e.costs||{traslado:0,catering:0,regalos:0,lugar:0,material:0,otro:0}}));if(Array.isArray(old.attendees))base.attendees=old.attendees;if(Array.isArray(old.routes)&&old.routes.length)base.routes=old.routes.map(r=>({...r,line:base.config.lines.find(l=>l.name===r.line)?.id||r.line||'ia',costs:r.costs||{traslado:0,regalos:0,otro:0}}));if(Array.isArray(old.webinars)&&old.webinars.length)base.webinars=old.webinars.map(w=>({...w,line:base.config.lines.find(l=>l.name===w.line)?.id||w.line||'ia'}));if(Array.isArray(old.results))base.results=old.results;return base}catch{return base}}
M.load=()=>{try{const x=JSON.parse(localStorage.getItem(M.STORE)||'null');if(x&&x.version===3)return x}catch{}const x=migrate(seed());localStorage.setItem(M.STORE,JSON.stringify(x));return x};
M.save=()=>localStorage.setItem(M.STORE,JSON.stringify(M.state));
M.state=M.load();M.view='dashboard';M.selectedEvent='';M.eventListMode=M.state.eventView||'grid';M.selectedMonth=10;M.selectedYear=2026;
M.toast=t=>{const e=document.getElementById('toast');if(!e)return;e.textContent=t;e.style.display='block';setTimeout(()=>e.style.display='none',1800)};
M.downloadCSV=(name,rows)=>{if(!rows?.length){M.toast('No hay datos para exportar');return}const keys=Object.keys(rows[0]);const cell=v=>'"'+String(v??'').replaceAll('"','""')+'"';const csv='\ufeff'+[keys.map(cell).join(';'),...rows.map(r=>keys.map(k=>cell(r[k])).join(';'))].join('\n');const a=document.createElement('a'),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)};
M.setTitle=(t,s)=>{document.getElementById('pageTitle').textContent=t;document.getElementById('pageSubtitle').textContent=s||''};
M.lineOptions=(value='')=>M.state.config.lines.map(l=>`<option value="${M.esc(l.id)}" ${l.id===value?'selected':''}>${M.esc(l.name)}</option>`).join('');
M.openModal=(title,html,onSave,eyebrow='REGISTRO')=>{if(!M.canEdit())return;const d=document.getElementById('modal'),f=document.getElementById('modalForm');document.getElementById('modalTitle').textContent=title;document.getElementById('modalEyebrow').textContent=eyebrow;document.getElementById('modalFields').innerHTML=html;f.onsubmit=e=>{e.preventDefault();onSave(Object.fromEntries(new FormData(f)));M.save();d.close();M.render();M.toast('Guardado')};d.showModal()};
M.field=(n,l,v='',type='text',full=false)=>`<label class="field ${full?'full':''}"><span>${l}</span><input name="${n}" type="${type}" value="${M.esc(v)}"></label>`;
M.select=(n,l,opts,v='',full=false)=>`<label class="field ${full?'full':''}"><span>${l}</span><select name="${n}">${opts.map(x=>{const val=Array.isArray(x)?x[0]:x,lab=Array.isArray(x)?x[1]:x;return `<option value="${M.esc(val)}" ${String(val)===String(v)?'selected':''}>${M.esc(lab)}</option>`}).join('')}</select></label>`;
M.textarea=(n,l,v='',full=true)=>`<label class="field ${full?'full':''}"><span>${l}</span><textarea name="${n}">${M.esc(v)}</textarea></label>`;
M.renderNav=()=>{const allowed=new Set(M.ROLE_VIEWS[M.state.role]||[]);document.getElementById('nav').innerHTML=M.NAV.filter(x=>allowed.has(x[0])).map(([id,icon,label])=>`<button class="nav-btn ${M.view===id?'active':''}" data-view="${id}"><span class="nav-icon">${icon}</span>${label}</button>`).join('');document.querySelectorAll('.nav-btn').forEach(b=>b.onclick=()=>{M.view=b.dataset.view;M.selectedEvent='';M.render()})};
M.render=()=>{const allowed=new Set(M.ROLE_VIEWS[M.state.role]||[]);if(!allowed.has(M.view))M.view=[...allowed][0]||'events';M.renderNav();document.getElementById('roleSelect').value=M.state.role;const fn=M.modules[M.view];if(fn)fn();};
M.modules={};
document.getElementById('closeModal').onclick=()=>document.getElementById('modal').close();document.getElementById('cancelModal').onclick=()=>document.getElementById('modal').close();document.getElementById('roleSelect').innerHTML='<option value="paula">Paula · Edición</option><option value="priscila">Priscila · Edición</option><option value="gerencia">Gerencia · Consulta</option><option value="comercial">Comercial · Consulta</option><option value="visor_eventos">Visor Eventos · Promotora</option>';document.getElementById('roleSelect').onchange=e=>{M.state.role=e.target.value;M.save();M.view=M.ROLE_VIEWS[M.state.role][0];M.render()};
})();