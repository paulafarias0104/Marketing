import { useMemo, useState } from 'react'
import { useMarketing } from '../context/MarketingContext'
import { MONTHS } from '../data/seed'
import { actionTypeById, fmtDate, lineById, monthOf, planItems, yearOf } from '../lib/utils'
import { Empty, Panel, StatusBadge } from '../components/ui'

function FocusChip({line}){
  return <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm" style={{borderColor:`${line.color}55`}}><span className="h-2.5 w-2.5 rounded-full" style={{backgroundColor:line.color}}/>{line.name}</span>
}

export default function Dashboard({setHeader}){
  const {state}=useMarketing()
  const [year,setYear]=useState(2026)
  const [month,setMonth]=useState(10)
  setHeader('Dashboard Ejecutivo','Focos mensuales, presión de marketing, hitos y actividad consolidada.')
  const items=useMemo(()=>planItems(state).filter(x=>yearOf(x.date)===year&&monthOf(x.date)===month),[state,year,month])
  const focusLines=state.config.lines.filter(x=>(x.months?.[String(year)]||[]).map(Number).includes(month))
  const focusMacros=state.config.macroareas.filter(x=>(x.months?.[String(year)]||[]).map(Number).includes(month))
  const keyDates=state.config.keyDates.filter(x=>Number(x.year)===year&&Number(x.month)===month)
  const milestones=items.filter(x=>['event','webinar','route'].includes(x.type))
  const done=items.filter(x=>['done','closed'].includes(x.status)).length
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center gap-3">
      <select value={month} onChange={e=>setMonth(+e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">{MONTHS.map((m,i)=><option key={m} value={i+1}>{m}</option>)}</select>
      <select value={year} onChange={e=>setYear(+e.target.value)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700">{[2026,2027,2028].map(y=><option key={y}>{y}</option>)}</select>
    </div>
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{[['Acciones del mes',items.length],['Ejecutadas',done],['Pendientes',items.length-done],['Líneas potenciadas',focusLines.length]].map(([label,value])=><Panel key={label}><div className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-2 text-3xl font-black text-[#011C40]">{value}</div></Panel>)}</div>
    <div className="grid gap-6 xl:grid-cols-[1.4fr_.9fr]">
      <Panel><div className="mb-4"><div className="text-xs font-black tracking-[.15em] text-slate-400">FOCOS DEL MES</div><h2 className="mt-1 text-xl font-black text-[#011C40]">Servicios que se están potenciando en {MONTHS[month-1]}</h2></div><div className="flex flex-wrap gap-2">{focusLines.length?focusLines.map(x=><FocusChip key={x.id} line={x}/>):<span className="text-sm text-slate-500">No hay líneas marcadas para este mes.</span>}</div>{focusMacros.length>0&&<div className="mt-5 border-t border-slate-100 pt-4"><div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Macroáreas con énfasis</div><div className="flex flex-wrap gap-2">{focusMacros.map(x=><span key={x.id} className="rounded-lg px-3 py-2 text-xs font-bold text-white" style={{backgroundColor:x.color}}>{x.name}</span>)}</div></div>}</Panel>
      <Panel><div className="text-xs font-black tracking-[.15em] text-slate-400">FECHAS CLAVE</div><div className="mt-3 space-y-3">{keyDates.length?keyDates.map(x=><div key={x.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3"><div className="text-xs font-bold text-[#12B1FD]">{x.date}</div><div className="mt-1 text-sm font-semibold text-slate-700">{x.text}</div></div>):<div className="text-sm text-slate-500">Sin fechas clave cargadas.</div>}</div></Panel>
    </div>
    <Panel><div className="mb-4"><div className="text-xs font-black tracking-[.15em] text-slate-400">HITOS Y ACTIVACIONES</div><h2 className="mt-1 text-xl font-black text-[#011C40]">Eventos, webinars y rutas</h2></div>{milestones.length?<div className="space-y-2">{milestones.map(x=>{const type=actionTypeById(state,x.type);return <div key={`${x.type}-${x.id}`} className="flex items-center gap-4 rounded-xl border border-slate-100 p-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl text-lg" style={{backgroundColor:`${type.color}20`}}>{type.icon}</div><div className="min-w-0 flex-1"><div className="font-bold text-slate-800">{x.name}</div><div className="text-xs text-slate-500">{fmtDate(x.date)} · {lineById(state,x.line)?.name||'Sin línea'} · {x.service||''}</div></div><StatusBadge item={x}/></div>})}</div>:<Empty>Sin hitos en el mes seleccionado.</Empty>}</Panel>
  </div>
}
