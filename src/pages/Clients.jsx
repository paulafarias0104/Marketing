import { useMemo, useState } from 'react'
import { useMarketing } from '../context/MarketingContext'
import { downloadSheet } from '../lib/excel'
import { Button, Panel } from '../components/ui'

const statusLabel=value=>({pending:'Pendiente',confirmed:'Confirmado',coming:'Viene llegando',arrived:'Llegó',absent:'No vendrá'}[value]||value||'Pendiente')
const norm=value=>String(value||'').trim().toLowerCase()
const phoneKey=value=>String(value||'').replace(/\D/g,'')
const contactKey=x=>norm(x.email)?`email:${norm(x.email)}`:phoneKey(x.phone)?`phone:${phoneKey(x.phone)}`:`name:${norm(x.name)}|${norm(x.company)}`

export default function Clients({setHeader}){
  const {state}=useMarketing();const [query,setQuery]=useState('');const [type,setType]=useState('all')
  setHeader('Clientes','Base de contactos alimentada automáticamente desde los asistentes de eventos.')

  const contacts=useMemo(()=>{
    const eventDate=new Map((state.events||[]).map(x=>[x.id,x.date||'']))
    const grouped=new Map()
    ;(state.attendees||[]).forEach(attendee=>{
      const key=contactKey(attendee);const current=grouped.get(key);const date=eventDate.get(attendee.eventId)||''
      if(!current){grouped.set(key,{...attendee,_date:date,_events:1});return}
      const interests=[current.interest,attendee.interest].filter(Boolean).join(' · ').split(' · ').filter((v,i,a)=>a.indexOf(v)===i).join(' · ')
      const latest=date>=current._date?attendee:current
      grouped.set(key,{...current,...latest,email:latest.email||current.email,phone:latest.phone||current.phone,role:latest.role||current.role,company:latest.company||current.company,interest:interests,_date:date>=current._date?date:current._date,_events:(current._events||1)+1})
    })
    return [...grouped.values()].sort((a,b)=>String(a.company||'').localeCompare(String(b.company||''),'es'))
  },[state.attendees,state.events])

  const filtered=contacts.filter(x=>{
    if(type==='client'&&!x.client)return false
    if(type==='prospect'&&x.client)return false
    const q=norm(query);if(!q)return true
    return [x.name,x.company,x.email,x.phone,x.role,x.interest].some(v=>norm(v).includes(q))
  })

  const download=()=>downloadSheet('Clientes_TIBOX.xlsx','Clientes',filtered.map(x=>({Persona:x.name,Empresa:x.company,Correo:x.email||'',Telefono:x.phone||'',Cargo:x.role||'',Tipo:x.client?'Cliente':'Prospecto',Estado:statusLabel(x.status),Interes:x.interest||''})))

  return <div className="space-y-5">
    <Panel className="p-4"><div className="flex flex-wrap items-center gap-3"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar persona, empresa, correo, teléfono o interés..." className="min-w-[320px] flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#1B328E]"/><select value={type} onChange={e=>setType(e.target.value)} className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"><option value="all">Todos</option><option value="client">Clientes</option><option value="prospect">Prospectos</option></select><Button onClick={download}>Descargar Excel</Button></div><div className="mt-3 text-xs text-slate-500">{filtered.length} contacto(s) únicos · alimentado desde asistentes de eventos</div></Panel>
    <Panel className="p-0"><div className="overflow-x-auto"><table className="w-full min-w-[1280px] text-sm"><thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Persona</th><th className="px-4 py-3">Empresa</th><th className="px-4 py-3">Correo</th><th className="px-4 py-3">Teléfono</th><th className="px-4 py-3">Cargo</th><th className="px-4 py-3">Tipo</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Interés</th></tr></thead><tbody className="divide-y divide-slate-100">{filtered.map(x=><tr key={contactKey(x)} className="hover:bg-slate-50/70"><td className="px-4 py-3 font-bold text-[#1B328E]">{x.name}</td><td className="px-4 py-3">{x.company||'—'}</td><td className="px-4 py-3">{x.email||'—'}</td><td className="px-4 py-3 whitespace-nowrap">{x.phone||'—'}</td><td className="px-4 py-3">{x.role||'—'}</td><td className="px-4 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${x.client?'bg-blue-50 text-[#1B328E]':'bg-violet-50 text-violet-700'}`}>{x.client?'Cliente':'Prospecto'}</span></td><td className="px-4 py-3 whitespace-nowrap">{statusLabel(x.status)}</td><td className="px-4 py-3 min-w-[220px]">{x.interest||'—'}</td></tr>)}{!filtered.length&&<tr><td colSpan="8" className="px-4 py-10 text-center text-slate-500">No hay contactos para los filtros seleccionados.</td></tr>}</tbody></table></div></Panel>
  </div>
}
