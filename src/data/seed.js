export const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

export const CHECKLIST_TEMPLATE = [
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
  ['Post','Publicar fotos / contenido post evento','Priscila'],
  ['Post','Enviar correo de agradecimiento','Priscila'],
  ['Post','Compartir material o presentación','Priscila'],
  ['Post','Solicitar contacto comercial de asistentes','Priscila'],
  ['Post','Solicitar actualización de reuniones y oportunidades','Paula'],
  ['Post','Registrar oportunidades, cierres y venta atribuida','Paula'],
  ['Post','Cerrar resultados y aprendizajes del evento','Paula'],
]

export const emptyCosts = () => ({ traslado:0, catering:0, regalos:0, lugar:0, material:0, otro:0 })

export const createChecklist = () => CHECKLIST_TEMPLATE.map(([phase,name,owner],i) => ({
  id:`task-${Date.now()}-${i}`,
  phase,
  name,
  owner,
  due:'',
  comment:'',
  done:false,
}))

export const seedConfig = () => ({
  actionTypes:[
    {id:'rrss',label:'RRSS',icon:'📱',color:'#12B1FD'},
    {id:'mailing',label:'Mailing',icon:'✉',color:'#011C40'},
    {id:'blog',label:'Blog / SEO',icon:'📝',color:'#05C7F2'},
    {id:'ads',label:'Ads',icon:'🎯',color:'#F24C3D'},
    {id:'event',label:'Evento',icon:'📅',color:'#FCC703'},
    {id:'webinar',label:'Webinar',icon:'💻',color:'#12B1FD'},
    {id:'route',label:'Ruta',icon:'🧭',color:'#05C7F2'},
    {id:'point',label:'Acción puntual',icon:'⚡',color:'#60748d'},
  ],
  macroareas:[
    {id:'productividad',name:'Productividad & Cloud',color:'#12B1FD',months:{}},
    {id:'infra',name:'Infraestructura & Continuidad',color:'#5B718A',months:{'2026':[11,12]}},
    {id:'cyber',name:'Ciberseguridad',color:'#011C40',months:{'2026':[10,11]}},
    {id:'servicios',name:'Servicios TI',color:'#6C8099',months:{}},
    {id:'datos',name:'Datos & Transformación Digital',color:'#05C7F2',months:{'2026':[10,11,12]}},
    {id:'consultoria',name:'Consultoría',color:'#F24C3D',months:{}},
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
    {id:'lpdp',name:'LPDP & DPO',macro:'consultoria',color:'#F24C3D',months:{}},
  ],
  keyDates:[
    {id:'kd1',year:2026,month:10,date:'Todo octubre',text:'Mes de la Ciberseguridad'},
    {id:'kd2',year:2026,month:11,date:'12/11',text:'World Usability Day · oportunidad para IA responsable'},
    {id:'kd3',year:2026,month:12,date:'Diciembre',text:'Navidad y fin de año · saludo corporativo'},
  ],
})

export function seedState(){
  return {
    version:4,
    role:'paula',
    config:seedConfig(),
    social:[
      {id:'s1',date:'2026-10-08',title:'Fotos Evento HPE Talca',network:'LinkedIn',postType:'Fotos evento',line:'infra-ti',service:'HPE / Aruba',status:'done',owner:'Priscila',campaign:'Evento HPE Talca',url:'',notes:''},
      {id:'s2',date:'2026-10-10',title:'Reel Evento HPE Talca',network:'LinkedIn + Instagram',postType:'Reel del evento',line:'infra-ti',service:'HPE / Aruba',status:'done',owner:'Priscila',campaign:'Evento HPE Talca',url:'',notes:''},
      {id:'s3',date:'2026-10-19',title:'Invitación Webinar Ciberseguridad',network:'LinkedIn',postType:'Imagen fija',line:'security-ms',service:'Ciberseguridad usuarios',status:'done',owner:'Priscila',campaign:'Webinar Ciberseguridad',url:'',notes:''},
      {id:'s4',date:'2026-10-22',title:'Post Webinar Ciberseguridad',network:'LinkedIn + Instagram',postType:'Carrusel',line:'security-ms',service:'Ciberseguridad usuarios',status:'planned',owner:'Priscila',campaign:'Webinar Ciberseguridad',url:'',notes:''},
    ],
    mailings:[
      {id:'m1',date:'2026-10-18',title:'Invitación Webinar Ciberseguridad',subject:'Webinar Ciberseguridad usuarios',audience:'Clientes y prospectos',segment:'Base TI',line:'security-ms',service:'Seguridad Microsoft',status:'done',owner:'Priscila',sent:0,opens:0,clicks:0,leads:0},
    ],
    blogs:[
      {id:'b1',date:'2026-11-12',title:'IA responsable y experiencia de usuario',keyword:'IA responsable',line:'ia',service:'IA empresarial',status:'planned',owner:'Priscila',url:'',visits:0,leads:0},
    ],
    ads:[
      {id:'a1',name:'Google Ads SOC 24x7',platform:'Google Ads',start:'2026-11-01',end:'2026-11-30',line:'soc',service:'SOC 24x7',budget:20,actual:0,impressions:0,clicks:0,leads:0,opps:0,sales:0,sold:0,status:'planned'},
    ],
    events:[
      {id:'e1',name:'HPE & Aruba Talca',format:'Presencial',date:'2026-10-08',endDate:'',city:'Talca',place:'',line:'infra-ti',service:'HPE / Aruba',sponsor:'HPE',status:'done',budget:0,supplier:0,costs:emptyCosts(),tasks:createChecklist(),agenda:[],gifts:[]},
      {id:'e2',name:'Evento Fortinet San Fernando',format:'Presencial',date:'2026-11-04',endDate:'',city:'San Fernando',place:'',line:'firewall',service:'Firewall',sponsor:'Fortinet',status:'planned',budget:0,supplier:0,costs:emptyCosts(),tasks:createChecklist(),agenda:[],gifts:[]},
      {id:'e3',name:'Sustentabilidad Viña San Rafael',format:'Presencial',date:'2026-11-18',endDate:'',city:'',place:'Viña San Rafael',line:'infra-ti',service:'Infraestructura / Sustentabilidad',sponsor:'',status:'planned',budget:0,supplier:0,costs:emptyCosts(),tasks:createChecklist(),agenda:[],gifts:[]},
      {id:'e4',name:'ETM Day Santiago',format:'Feria',date:'2026-11-19',endDate:'2026-11-21',city:'Santiago',place:'',line:'ia',service:'Tecnología / Innovación',sponsor:'',status:'planned',budget:0,supplier:0,costs:emptyCosts(),tasks:createChecklist(),agenda:[],gifts:[]},
    ],
    attendees:[
      {id:'at1',eventId:'e1',name:'Invitado Demo 1',company:'Empresa Demo',role:'',email:'',client:true,status:'arrived',thanks:true,salesCall:true,meeting:false,opportunity:false,closed:false,credential:'',interest:'HPE / Virtualización',giftIds:[]},
      {id:'at2',eventId:'e1',name:'Invitado Demo 2',company:'Empresa Demo',role:'Gerente TI',email:'',client:false,status:'absent',thanks:false,salesCall:false,meeting:false,opportunity:false,closed:false,credential:'',interest:'',giftIds:[]},
    ],
    webinars:[
      {id:'w1',date:'2026-10-21',name:'Webinar Ciberseguridad usuarios',line:'security-ms',service:'Ciberseguridad usuarios',speaker:'',registered:0,attended:0,status:'planned',opps:0,sales:0,sold:0},
    ],
    routes:[
      {id:'r1',date:'2026-10-19',company:'Agrichile',city:'Camarico',topic:'IA',line:'ia',attendees:12,status:'done',costs:{traslado:0,regalos:0,otro:0},opps:0,sales:0,sold:0,notes:''},
    ],
    pointActions:[
      {id:'p1',date:'2026-12-18',title:'Saludo corporativo Navidad y fin de año',kind:'Video corporativo',line:'ia',service:'Corporativo',status:'planned',owner:'Priscila',notes:''},
    ],
    coverage:[],
    results:[],
    preferences:{eventView:'grid',blogView:'grid',webinarView:'grid',pointView:'grid'},
  }
}

export function normalizeState(raw){
  const base=seedState()
  if(!raw || typeof raw !== 'object') return base
  const merged={...base,...raw,version:4,preferences:{...base.preferences,...(raw.preferences||{}),eventView:raw.eventView||raw.preferences?.eventView||base.preferences.eventView}}
  merged.config={...base.config,...(raw.config||{}),actionTypes:raw.config?.actionTypes||base.config.actionTypes,macroareas:raw.config?.macroareas||base.config.macroareas,lines:raw.config?.lines||base.config.lines,keyDates:raw.config?.keyDates||base.config.keyDates}
  merged.events=(raw.events||base.events).map(e=>({...e,costs:{...emptyCosts(),...(e.costs||{})},tasks:Array.isArray(e.tasks)&&e.tasks.length?e.tasks:createChecklist(),agenda:e.agenda||[],gifts:e.gifts||[]}))
  for(const key of ['social','mailings','blogs','ads','attendees','webinars','routes','pointActions','coverage','results']) if(!Array.isArray(merged[key])) merged[key]=base[key]
  return merged
}
