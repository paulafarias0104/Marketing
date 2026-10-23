import { useMemo, useState } from 'react'
import { useMarketing } from '../context/MarketingContext'
import { MONTHS } from '../data/seed'
import { managementForMonth } from '../lib/finance'
import { fmtDate, roleCanEdit, uid } from '../lib/utils'
import { Button, FormModal, Panel } from '../components/ui'

export default function Management({setHeader}){
  const {state,mutate}=useMarketing();const canEdit=roleCanEdit(state.role)
  const today=new Date();const [year,setYear]=useState(today.getFullYear());const [month,setMonth]=useState(today.getMonth()+1);const [editor,setEditor]=useState(null)
  setHeader('Gestiones recurrentes','Tareas puntuales, mensuales y anuales para controlar obligaciones operativas y comerciales.')
  const rows=useMemo(()=>managementForMonth(state,year,month),[state,year,month]);const done=rows.filter(x=>x.done).length;const overdue=rows.filter(x=>x.overdue).length;const pct=rows.length?Math.round(done/rows.length*100):0
  const fields=[
    {name:'title',label:'Gestión / tarea',required:true,full:true},
    {name:'frequency',label:'Frecuencia',type:'select',options:[['monthly','Mensual'],['annual','Anual'],['once','Puntual']]},
    {name:'owner',label:'Responsable'},
    {name:'category',label:'Categoría'},
    {name:'day',label:'Día objetivo (1-28)',type:'number',min:1},
    {name:'month',label:'Mes (si es anual)',type:'select',options:MONTHS.map((x,i)=>[i+1,x])},
    {name:'date',label:'Fecha (si es puntual)',type:'date'},
    {name:'active',label:'Estado',type:'select',options:[['true','Activa'],['false','Inactiva']]},
    {name:'notes',label:'Notas / instrucciones',type:'textarea',full:true},
  ]
  const save=raw=>mutate(s=>{const v={...raw,day:+raw.day||1,month:+raw.month||1,active:raw.active!=='false'};if(editor?.id){const x=s.managementTasks.find(t=>t.id===editor.id);Object.assign(x,v)}else s.managementTasks.push({id:uid('mg'),...v,completions:{}})})
  const toggle=row=>mutate(s=>{const x=s.managementTasks.find(t=>t.id===row.id);x.completions=x.completions||{};x.completions[row.key]=!x.completions[row.key]})
  return <div className="space-y-5">
    <div className="flex flex-wrap items-center gap-2"><select value={month} onChange={e=>setMonth(+e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">{MONTHS.map((x,i)=><option key={x} value={i+1}>{x}</option>)}</select><select value={year} onChange={e=>setYear(+e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">{[2026,2027,2028,2029].map(x=><option key={x}>{x}</option>)}</select><span className="flex-1"/>{canEdit&&<Button variant="primary" onClick={()=>setEditor({})}>+ Gestión</Button>}</div>
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{[['Gestiones del mes',rows.length],['Completadas',done],['Vencidas',overdue],['Cumplimiento',`${pct}%`]].map(([l,v])=><Panel key={l}><div className="text-xs font-bold uppercase tracking-wide text-slate-400">{l}</div><div className="mt-2 text-3xl font-black text-[#011C40]">{v}</div></Panel>)}</div>
    <Panel className="p-0"><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Gestión</th><th className="px-4 py-3">Frecuencia</th><th className="px-4 py-3">Responsable</th><th className="px-4 py-3">Fecha objetivo</th><th className="px-4 py-3">Estado</th><th/></tr></thead><tbody className="divide-y divide-slate-100">{rows.map(x=><tr key={`${x.id}-${x.key}`}><td className="px-4 py-3"><div className="font-bold text-[#011C40]">{x.title}</div><div className="text-xs text-slate-500">{x.category||'General'}{x.notes?` · ${x.notes}`:''}</div></td><td className="px-4 py-3">{x.frequency==='monthly'?'Mensual':x.frequency==='annual'?'Anual':'Puntual'}</td><td className="px-4 py-3">{x.owner||'—'}</td><td className="px-4 py-3">{fmtDate(x.due)}</td><td className="px-4 py-3"><button disabled={!canEdit} onClick={()=>toggle(x)} className={`rounded-full border px-3 py-1 text-xs font-bold ${x.done?'border-emerald-200 bg-emerald-50 text-emerald-700':x.overdue?'border-red-200 bg-red-50 text-red-700':'border-slate-200 bg-slate-50 text-slate-700'}`}>{x.done?'✓ Completada':x.overdue?'⚠ Vencida':'◷ Pendiente'}</button></td><td className="px-4 py-3 text-right">{canEdit&&<Button onClick={()=>setEditor(x)}>Editar</Button>}</td></tr>)}{!rows.length&&<tr><td colSpan="6" className="px-4 py-10 text-center text-slate-500">No hay gestiones programadas para este mes.</td></tr>}</tbody></table></div></Panel>
    <FormModal open={!!editor} title={editor?.id?'Editar gestión':'Nueva gestión'} eyebrow="GESTIONES" fields={fields} initial={editor?.id?{...editor,active:String(editor.active!==false)}:{title:'',frequency:'monthly',owner:'Paula',category:'Licencias / Proveedores',day:5,month:1,date:'',active:'true',notes:''}} onClose={()=>setEditor(null)} onSave={save}/>
  </div>
}
