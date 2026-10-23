export const uid=(prefix='id')=>`${prefix}-${globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`}`

export const fmtDate=value=>{
  if(!value) return '—'
  const [y,m,d]=String(value).split('-')
  return y&&m&&d?`${d}-${m}-${y}`:String(value)
}

export const money=value=>`${Number(value||0).toLocaleString('es-CL',{maximumFractionDigits:1})} UF`

export const monthOf=date=>Number(String(date||'').slice(5,7))||0
export const yearOf=date=>Number(String(date||'').slice(0,4))||0
export const quarterOf=date=>monthOf(date)?Math.ceil(monthOf(date)/3):0

export const statusMeta=(item,today=new Date())=>{
  if(['done','closed'].includes(item?.status)) return {icon:'✓',label:'Ejecutado',className:'bg-emerald-50 text-emerald-700 border-emerald-200'}
  if(item?.status==='paused') return {icon:'⏸',label:'En pausa',className:'bg-amber-50 text-amber-700 border-amber-200'}
  if(item?.date){
    const d=new Date(`${item.date}T00:00:00`)
    const t=new Date(today);t.setHours(0,0,0,0)
    if(d<t) return {icon:'⚠',label:'Vencido',className:'bg-red-50 text-red-700 border-red-200'}
  }
  return {icon:'◷',label:'Pendiente',className:'bg-slate-50 text-slate-700 border-slate-200'}
}

export const statusLabel=status=>({idea:'Idea',planned:'Planificado',running:'En ejecución',paused:'En pausa',done:'Ejecutado',closed:'Cerrado'}[status]||status||'Planificado')

export const lineById=(state,id)=>state.config.lines.find(x=>x.id===id)
export const macroById=(state,id)=>state.config.macroareas.find(x=>x.id===id)
export const actionTypeById=(state,id)=>state.config.actionTypes.find(x=>x.id===id)||{id,label:id,icon:'•',color:'#64748b'}

export function planItems(state){
  const items=[]
  state.social.forEach(x=>items.push({...x,type:'rrss',name:x.title,date:x.date}))
  state.mailings.forEach(x=>items.push({...x,type:'mailing',name:x.title,date:x.date}))
  state.blogs.forEach(x=>items.push({...x,type:'blog',name:x.title,date:x.date}))
  state.ads.forEach(x=>items.push({...x,type:'ads',name:x.name,date:x.start}))
  state.events.forEach(x=>items.push({...x,type:'event',name:x.name,date:x.date}))
  state.webinars.forEach(x=>items.push({...x,type:'webinar',name:x.name,date:x.date}))
  state.routes.forEach(x=>items.push({...x,type:'route',name:`Ruta · ${x.company}`,date:x.date,service:x.topic}))
  state.pointActions.forEach(x=>items.push({...x,type:'point',name:x.title,date:x.date}))
  return items.sort((a,b)=>String(a.date).localeCompare(String(b.date)))
}

export const roleCanEdit=role=>['paula','priscila'].includes(role)
export const roleCanLive=role=>roleCanEdit(role)||role==='visor_eventos'

export const csvDownload=(filename,rows)=>{
  if(!rows?.length) return false
  const keys=Object.keys(rows[0]);const q=v=>`"${String(v??'').replaceAll('"','""')}"`
  const csv='\ufeff'+[keys.map(q).join(';'),...rows.map(r=>keys.map(k=>q(r[k])).join(';'))].join('\n')
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}))
  const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)
  return true
}
