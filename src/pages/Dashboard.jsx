import { useMemo, useState } from 'react'
import { useMarketing } from '../context/MarketingContext'
import { MONTHS } from '../data/seed'
import { clp, financeRows, financeSummary, managementForMonth, pct } from '../lib/finance'
import { actionTypeById, fmtDate, lineById, monthOf, planItems, yearOf } from '../lib/utils'
import { Empty, Panel, StatusBadge } from '../components/ui'

function FocusChip({line}){return <span className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm" style={{borderColor:`${line.color}55`}}><span className="h-2.5 w-2.5 rounded-full" style={{backgroundColor:line.color}}/>{line.name}</span>}

const KPI_TONES=[
  ['#EEF2FF','#1B328E'],['#F1ECFF','#7C3AED'],['#EAF8F4','#0F8C6D'],['#FFF4E8','#C96A16'],['#EAF4FF','#2563EB'],['#FCECEF','#C2415B'],
]

export default function Dashboard({setHeader}){
  const {state}=useMarketing()
  const [year,setYear]=useState(2026)
  const [month,setMonth]=useState(10)
  const [quarter,setQuarter]=useState(4)
  const [period,setPeriod]=useState('month')
  setHeader('Dashboard Ejecutivo','Focos, ejecución, gestiones, inversión y Revenue en pesos chilenos para Gerencia.')

  const periodMonths=useMemo(()=>{
    if(period==='year') return MONTHS.map((_,i)=>i+1)
    if(period==='quarter'){const start=(quarter-1)*3+1;return [start,start+1,start+2]}
    return [month]
  },[period,month,quarter])
  const periodLabel=period==='year'?`Año ${year}`:period==='quarter'?`Q${quarter} · ${year}`:`${MONTHS[month-1]} ${year}`
  const periodNoun=period==='month'?'mes':period==='quarter'?'trimestre':'año'

  const items=useMemo(()=>planItems(state).filter(x=>yearOf(x.date)===year&&periodMonths.includes(monthOf(x.date))),[state,year,periodMonths])
  const focusLines=state.config.lines.filter(x=>(x.months?.[String(year)]||[]).map(Number).some(m=>periodMonths.includes(m)))
  const focusMacros=state.config.macroareas.filter(x=>(x.months?.[String(year)]||[]).map(Number).some(m=>periodMonths.includes(m)))
  const keyDates=state.config.keyDates.filter(x=>Number(x.year)===year&&periodMonths.includes(Number(x.month)))
  const milestones=items.filter(x=>['event','webinar','route'].includes(x.type))
  const done=items.filter(x=>['done','closed'].includes(x.status)).length

  const management=periodMonths.flatMap(m=>managementForMonth(state,year,m))
  const managementDone=management.filter(x=>x.done).length
  const managementPct=management.length?Math.round(managementDone/management.length*100):0
  const pendingManagement=management.filter(x=>!x.done)

  const fRows=financeRows(state).filter(x=>yearOf(x.date)===year&&periodMonths.includes(monthOf(x.date)))
  const finance=financeSummary(fRows)
  const best=[...fRows].filter(x=>x.revenue>0).sort((a,b)=>b.revenue-a.revenue).slice(0,5)
  const execution=items.length?Math.round(done/items.length*100):0

  const selectedQuarters=period==='year'?[1,2,3,4]:period==='quarter'?[quarter]:[Math.ceil(month/3)]
  const whTotals=(state.wholesalers||[]).map(w=>{
    const sales=state.wholesalerSales.filter(x=>x.wholesalerId===w.id&&Number(x.year)===year&&selectedQuarters.includes(Number(x.quarter)))
    return {name:w.name,currency:w.currency||'USD',amount:sales.reduce((s,x)=>s+(Number(x.amount)||0),0),count:sales.length}
  }).filter(x=>x.count)

  const subgerenciaStats=['Infra','Soluciones Digitales'].map(name=>{
    const scoped=items.filter(x=>lineById(state,x.line)?.subgerencia===name)
    const completed=scoped.filter(x=>['done','closed'].includes(x.status)).length
    return {name,total:scoped.length,completed,pct:scoped.length?Math.round(completed/scoped.length*100):0}
  })

  const kpis=[
    [`Acciones del ${periodNoun}`,items.length,'Planificadas y ejecutadas'],
    ['Ejecución plan',`${execution}%`,`${done} de ${items.length} acciones`],
    ['Gestiones cumplidas',`${managementPct}%`,`${managementDone} de ${management.length} gestiones`],
    ['Gasto TIBOX',clp(finance.tibox),`Inversión propia del ${periodNoun}`],
    ['Revenue atribuido',clp(finance.revenue),`${finance.deals||0} negocio(s) cerrado(s)`],
    ['ROI sobre TIBOX',pct(finance.roiTibox),'Retorno sobre inversión propia'],
  ]

  return <div className="space-y-6">
    <section className="relative overflow-hidden rounded-[30px] border border-white/80 bg-gradient-to-br from-[#EEF2FF] via-white to-[#F6EEFF] p-6 shadow-[0_18px_50px_rgba(27,50,142,.08)]">
      <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-[#8B5CF6]/14 blur-2xl"/>
      <div className="pointer-events-none absolute right-36 bottom-0 h-32 w-32 rounded-full bg-[#38BDF8]/12 blur-2xl"/>
      <div className="relative flex flex-wrap items-end gap-5">
        <div className="mr-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3 py-1 text-xs font-bold text-[#1B328E] shadow-sm"><span className="h-2 w-2 rounded-full bg-emerald-400"/> Panorama ejecutivo</div>
          <h2 className="mt-4 text-3xl font-black tracking-[-.035em] text-[#111A43]">{periodLabel}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Vista ejecutiva del plan, cumplimiento, inversión, Revenue y principales activaciones de Mercado y Producto.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/80 bg-white/75 p-2 shadow-sm backdrop-blur">
          <div className="inline-flex rounded-xl bg-[#F7F8FC] p-1">{[['month','Mes'],['quarter','Q'],['year','Año']].map(([v,l])=><button key={v} onClick={()=>setPeriod(v)} className={`rounded-lg px-3 py-2 text-sm font-bold transition ${period===v?'bg-[#1B328E] text-white shadow-sm':'text-slate-500 hover:text-[#1B328E]'}`}>{l}</button>)}</div>
          {period==='month'&&<select value={month} onChange={e=>setMonth(+e.target.value)} className="rounded-xl border-0 bg-[#F7F8FC] px-4 py-2 text-sm font-bold text-[#1B328E] outline-none">{MONTHS.map((m,i)=><option key={m} value={i+1}>{m}</option>)}</select>}
          {period==='quarter'&&<select value={quarter} onChange={e=>setQuarter(+e.target.value)} className="rounded-xl border-0 bg-[#F7F8FC] px-4 py-2 text-sm font-bold text-[#1B328E] outline-none">{[1,2,3,4].map(q=><option key={q} value={q}>Q{q}</option>)}</select>}
          <select value={year} onChange={e=>setYear(+e.target.value)} className="rounded-xl border-0 bg-[#F7F8FC] px-4 py-2 text-sm font-bold text-[#1B328E] outline-none">{[2026,2027,2028,2029].map(y=><option key={y}>{y}</option>)}</select>
        </div>
      </div>
    </section>

    <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">{kpis.map(([label,value,helper],i)=>{const [bg,fg]=KPI_TONES[i];return <Panel key={label} className="relative overflow-hidden p-4"><div className="absolute right-3 top-3 h-10 w-10 rounded-2xl opacity-70" style={{background:bg}}/><div className="relative"><div className="inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wide" style={{background:bg,color:fg}}>{label}</div><div className="mt-4 text-2xl font-black tracking-[-.03em] text-[#111A43]">{value}</div><div className="mt-1 text-[11px] leading-4 text-slate-400">{helper}</div></div></Panel>})}</div>

    <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
      <Panel className="overflow-hidden"><div className="mb-5 flex items-start gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF2FF] text-xl text-[#1B328E]">◎</div><div><div className="text-[10px] font-black tracking-[.16em] text-slate-400">FOCOS DEL PERÍODO</div><h2 className="mt-1 text-xl font-black text-[#111A43]">Servicios priorizados en {periodLabel}</h2></div></div><div className="flex flex-wrap gap-2">{focusLines.length?focusLines.map(x=><FocusChip key={x.id} line={x}/>):<span className="text-sm text-slate-500">No hay líneas marcadas para este período.</span>}</div>{focusMacros.length>0&&<div className="mt-5 border-t border-slate-100 pt-4"><div className="mb-2 text-[10px] font-black uppercase tracking-[.14em] text-slate-400">Macroáreas con énfasis</div><div className="flex flex-wrap gap-2">{focusMacros.map(x=><span key={x.id} className="rounded-xl px-3 py-2 text-xs font-bold text-white shadow-sm" style={{backgroundColor:x.color}}>{x.name}</span>)}</div></div>}</Panel>
      <Panel><div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F1ECFF] text-lg text-[#7C3AED]">✦</div><div><div className="text-[10px] font-black tracking-[.16em] text-slate-400">SUBGERENCIAS</div><h2 className="text-lg font-black text-[#111A43]">Distribución del plan</h2></div></div><div className="space-y-3">{subgerenciaStats.map((x,i)=><div key={x.name} className="rounded-2xl border border-[#E8ECF7] p-4" style={{background:i===0?'#F3F6FF':'#F8F4FF'}}><div className="flex items-center justify-between gap-3"><div><div className="text-sm font-black text-[#111A43]">{x.name}</div><div className="mt-1 text-xs text-slate-500">{x.total} acción(es) · {x.completed} ejecutadas</div></div><div className="text-2xl font-black text-[#1B328E]">{x.pct}%</div></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#1B328E]" style={{width:`${x.pct}%`}}/></div></div>)}</div></Panel>
    </div>

    <div className="grid gap-6 xl:grid-cols-[1.35fr_.8fr]">
      <Panel><div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFF4E8] text-lg text-[#C96A16]">✓</div><div><div className="text-[10px] font-black tracking-[.16em] text-slate-400">GESTIONES DEL PERÍODO</div><h2 className="text-lg font-black text-[#111A43]">Pendientes operativos y comerciales</h2></div></div><div className="space-y-2.5">{pendingManagement.slice(0,8).map(x=><div key={`${x.id}-${x.key}`} className={`flex items-center gap-3 rounded-2xl border p-3.5 ${x.overdue?'border-red-200 bg-red-50':'border-[#E8ECF7] bg-[#FBFCFF]'}`}><div className={`flex h-9 w-9 items-center justify-center rounded-xl ${x.overdue?'bg-red-100 text-red-600':'bg-[#EEF2FF] text-[#1B328E]'}`}>{x.overdue?'⚠':'◷'}</div><div className="min-w-0 flex-1"><div className="font-bold text-[#111A43]">{x.title}</div><div className="mt-0.5 text-xs text-slate-500">{fmtDate(x.due)} · {x.owner||'Sin responsable'} · {x.category||'General'}</div></div></div>)}{!pendingManagement.length&&<Empty>Sin gestiones pendientes en el período seleccionado.</Empty>}</div></Panel>
      <Panel><div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F1ECFF] text-lg text-[#7C3AED]">✦</div><div><div className="text-[10px] font-black tracking-[.16em] text-slate-400">FECHAS CLAVE</div><h2 className="text-lg font-black text-[#111A43]">Hitos del período</h2></div></div><div className="space-y-3">{keyDates.length?keyDates.map(x=><div key={x.id} className="rounded-2xl border border-[#ECEFFA] bg-[#FBFCFF] p-3.5"><div className="text-xs font-black text-[#1B328E]">{MONTHS[Number(x.month)-1]} · {x.date}</div><div className="mt-1 text-sm font-semibold leading-5 text-slate-700">{x.text}</div></div>):<div className="text-sm text-slate-500">Sin fechas clave cargadas.</div>}</div></Panel>
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <Panel><div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF8F4] text-lg text-[#0F8C6D]">↗</div><div><div className="text-[10px] font-black tracking-[.16em] text-slate-400">RETORNO DE ACTIVACIONES</div><h2 className="text-lg font-black text-[#111A43]">Mayor Revenue atribuido</h2></div></div><div className="space-y-2.5">{best.map(x=><div key={x.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-2xl border border-[#E8ECF7] bg-[#FBFCFF] p-3.5"><div><div className="font-bold text-[#111A43]">{x.name}</div><div className="text-xs text-slate-500">{x.source} · {x.deals||0} negocio(s)</div></div><div className="text-right"><div className="text-[10px] font-bold uppercase text-slate-400">TIBOX</div><b className="text-sm text-slate-700">{clp(x.tibox)}</b></div><div className="text-right"><div className="text-[10px] font-bold uppercase text-slate-400">Revenue</div><b className="text-sm text-emerald-700">{clp(x.revenue)}</b></div></div>)}{!best.length&&<Empty>Aún no hay Revenue atribuido en este período.</Empty>}</div></Panel>
      <Panel><div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F1ECFF] text-lg text-[#7C3AED]">◈</div><div><div className="text-[10px] font-black tracking-[.16em] text-slate-400">PULSO MAYORISTAS</div><h2 className="text-lg font-black text-[#111A43]">Ventas cargadas del período</h2></div></div>{whTotals.length?<div className="grid gap-3">{whTotals.map((x,i)=><div key={x.name} className="relative overflow-hidden rounded-[22px] border border-[#E8ECF7] p-4" style={{background:i%2?'#F8F4FF':'#F3F6FF'}}><div className="text-sm font-bold text-slate-700">{x.name}</div><div className="mt-2 text-2xl font-black tracking-[-.03em] text-[#111A43]">{x.currency} {x.amount.toLocaleString('es-CL',{maximumFractionDigits:0})}</div><div className="mt-1 text-xs text-slate-500">{x.count} línea(s) trimestral(es) cargadas</div></div>)}</div>:<Empty>Sin ventas de mayoristas cargadas para este período.</Empty>}</Panel>
    </div>

    <Panel><div className="mb-4 flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#EAF4FF] text-lg text-[#2563EB]">◇</div><div><div className="text-[10px] font-black tracking-[.16em] text-slate-400">HITOS Y ACTIVACIONES</div><h2 className="text-lg font-black text-[#111A43]">Eventos, webinars y rutas</h2></div></div>{milestones.length?<div className="grid gap-3 xl:grid-cols-2">{milestones.map(x=>{const type=actionTypeById(state,x.type);return <div key={`${x.type}-${x.id}`} className="flex items-center gap-4 rounded-2xl border border-[#E8ECF7] bg-[#FBFCFF] p-3.5"><div className="flex h-11 w-11 items-center justify-center rounded-2xl text-lg" style={{backgroundColor:`${type.color}20`}}>{type.icon}</div><div className="min-w-0 flex-1"><div className="font-bold text-[#111A43]">{x.name}</div><div className="mt-0.5 text-xs text-slate-500">{fmtDate(x.date)} · {lineById(state,x.line)?.name||'Sin línea'} · {x.service||''}</div></div><StatusBadge item={x}/></div>})}</div>:<Empty>Sin hitos en el período seleccionado.</Empty>}</Panel>
  </div>
}
