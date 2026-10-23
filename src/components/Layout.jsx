import { useState } from 'react'
import { useMarketing } from '../context/MarketingContext'

const TOP_NAV=[
  ['dashboard','▦','Dashboard'],['plan','◫','Plan de Mercado'],['management','✓','Gestiones'],
]
const COMMUNICATION_CHILDREN=[['comms-rrss','RRSS'],['comms-mailing','Mailing'],['blog','Blog / SEO']]
const MID_NAV=[['ads','◎','Ads']]
const ACTIVATION_CHILDREN=[['events','Eventos'],['webinars','Webinars'],['routes','Rutas']]
const BOTTOM_NAV=[['point','＋','Acciones puntuales'],['coverage','⌖','Cobertura / Visitas']]
const FINANCE_CHILDREN=[['finance-general','General'],['finance-revenue','Revenue atribuido'],['finance-deals','Carga de negocios']]
const END_NAV=[['wholesalers','◈','Mayoristas'],['settings','⚙','Metas & Mantenedores']]
const ALL_IDS=[...TOP_NAV.map(x=>x[0]),...COMMUNICATION_CHILDREN.map(x=>x[0]),...MID_NAV.map(x=>x[0]),...ACTIVATION_CHILDREN.map(x=>x[0]),...BOTTOM_NAV.map(x=>x[0]),'finance',...FINANCE_CHILDREN.map(x=>x[0]),...END_NAV.map(x=>x[0])]

const ROLE_VIEWS={
  paula:ALL_IDS,
  priscila:ALL_IDS,
  gerencia:ALL_IDS.filter(x=>x!=='settings'),
  comercial:['dashboard','plan','management','events','webinars','routes','coverage','finance','finance-general','finance-revenue','finance-deals'],
  visor_eventos:['events'],
}

function NavButton({active,icon,label,onClick}){
  return <button onClick={onClick} className={`group flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${active?'bg-white text-[#1B328E] shadow-[0_8px_24px_rgba(7,18,67,.18)]':'text-white/78 hover:bg-white/10 hover:text-white'}`}>
    <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-base transition ${active?'bg-[#EEF2FF] text-[#1B328E]':'bg-white/8 text-white/85 group-hover:bg-white/12'}`}>{icon}</span>
    <span className="min-w-0 flex-1 truncate">{label}</span>
  </button>
}

function GroupButton({active,open,icon,label,onClick}){
  return <button onClick={onClick} className={`group flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${active?'bg-white text-[#1B328E] shadow-[0_8px_24px_rgba(7,18,67,.18)]':'text-white/78 hover:bg-white/10 hover:text-white'}`}>
    <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-base ${active?'bg-[#EEF2FF] text-[#1B328E]':'bg-white/8 text-white/85'}`}>{icon}</span>
    <span className="min-w-0 flex-1 truncate">{label}</span>
    <span className={`text-base transition-transform duration-200 ${open?'rotate-90':''}`}>›</span>
  </button>
}

function GroupChildren({childrenItems,allowed,view,setView}){
  return <div className="ml-[30px] mt-1.5 space-y-1 border-l border-white/15 pl-3">
    {childrenItems.filter(x=>allowed.has(x[0])).map(([id,label])=><button key={id} onClick={()=>setView(id)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${view===id?'bg-[#DDE5FF] text-[#1B328E] shadow-sm':'text-white/65 hover:bg-white/8 hover:text-white'}`}><span className={`h-1.5 w-1.5 rounded-full ${view===id?'bg-[#1B328E]':'bg-white/35'}`}/>{label}</button>)}
  </div>
}

export default function Layout({view,setView,title,subtitle,children}){
  const {state,setRole}=useMarketing()
  const [communicationsOpen,setCommunicationsOpen]=useState(()=>view==='blog'||view==='comms'||view.startsWith('comms-'))
  const [activationsOpen,setActivationsOpen]=useState(()=>['events','webinars','routes'].includes(view))
  const [financeOpen,setFinanceOpen]=useState(()=>view.startsWith('finance'))
  const allowed=new Set(ROLE_VIEWS[state.role]||[])
  const isCommunications=view==='blog'||view==='comms'||view.startsWith('comms-')
  const isActivations=['events','webinars','routes'].includes(view)
  const isFinance=view==='finance'||view.startsWith('finance-')
  const showCommunications=COMMUNICATION_CHILDREN.some(x=>allowed.has(x[0]))
  const showActivations=ACTIVATION_CHILDREN.some(x=>allowed.has(x[0]))
  const roleChange=e=>{const role=e.target.value;setRole(role);const next=(ROLE_VIEWS[role]||[])[0]||'events';setView(next)}
  const goFinanceChild=id=>{setFinanceOpen(true);setView(id)}
  return <div className="min-h-screen bg-[#F6F7FC] text-slate-800">
    <aside className="fixed inset-y-0 left-0 z-30 flex w-[270px] flex-col overflow-hidden bg-[#1B328E] text-white shadow-[20px_0_60px_rgba(27,50,142,.12)]">
      <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[#8B5CF6]/25 blur-2xl"/>
      <div className="pointer-events-none absolute -right-24 top-48 h-56 w-56 rounded-full bg-[#32C8FF]/12 blur-3xl"/>
      <div className="relative flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-black text-[#1B328E] shadow-lg shadow-blue-950/20">T</div>
        <div><div className="text-lg font-black tracking-[.08em]">TIBOX</div><div className="text-xs font-medium text-white/62">Mercado & Producto</div></div>
      </div>
      <div className="relative px-5 pb-2 pt-5 text-[10px] font-black tracking-[.18em] text-white/45">ESTRATEGIA Y ACTIVACIÓN</div>
      <nav className="relative flex-1 space-y-1 overflow-y-auto px-3 pb-5">
        {TOP_NAV.filter(x=>allowed.has(x[0])).map(([id,icon,label])=><NavButton key={id} active={view===id} icon={icon} label={label} onClick={()=>setView(id)}/>)}

        {showCommunications&&<div className="pt-1">
          <GroupButton active={isCommunications} open={communicationsOpen} icon="✦" label="Comunicaciones" onClick={()=>setCommunicationsOpen(v=>!v)}/>
          {communicationsOpen&&<GroupChildren childrenItems={COMMUNICATION_CHILDREN} allowed={allowed} view={view} setView={setView}/>} 
        </div>}

        {MID_NAV.filter(x=>allowed.has(x[0])).map(([id,icon,label])=><NavButton key={id} active={view===id} icon={icon} label={label} onClick={()=>setView(id)}/>)}

        {showActivations&&<div className="pt-1">
          <GroupButton active={isActivations} open={activationsOpen} icon="◇" label="Activaciones" onClick={()=>setActivationsOpen(v=>!v)}/>
          {activationsOpen&&<GroupChildren childrenItems={ACTIVATION_CHILDREN} allowed={allowed} view={view} setView={setView}/>} 
        </div>}

        {BOTTOM_NAV.filter(x=>allowed.has(x[0])).map(([id,icon,label])=><NavButton key={id} active={view===id} icon={icon} label={label} onClick={()=>setView(id)}/>)}

        {allowed.has('finance')&&<div className="pt-1">
          <GroupButton active={isFinance} open={financeOpen} icon="$" label="Presupuesto / Finanzas" onClick={()=>setFinanceOpen(v=>!v)}/>
          {financeOpen&&<div className="ml-[30px] mt-1.5 space-y-1 border-l border-white/15 pl-3">
            {FINANCE_CHILDREN.filter(x=>allowed.has(x[0])).map(([id,label])=><button key={id} onClick={()=>goFinanceChild(id)} className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${view===id?'bg-[#DDE5FF] text-[#1B328E] shadow-sm':'text-white/65 hover:bg-white/8 hover:text-white'}`}><span className={`h-1.5 w-1.5 rounded-full ${view===id?'bg-[#1B328E]':'bg-white/35'}`}/>{label}</button>)}
          </div>}
        </div>}
        <div className="my-3 border-t border-white/10"/>
        {END_NAV.filter(x=>allowed.has(x[0])).map(([id,icon,label])=><NavButton key={id} active={view===id} icon={icon} label={label} onClick={()=>setView(id)}/>)}
      </nav>
    </aside>
    <div className="ml-[270px] min-h-screen">
      <header className="sticky top-0 z-20 px-7 pt-5">
        <div className="relative overflow-hidden rounded-[26px] border border-white/80 bg-white/88 px-7 py-5 shadow-[0_12px_40px_rgba(26,44,104,.08)] backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-[#DCD8FF]/55 blur-2xl"/>
          <div className="pointer-events-none absolute right-24 top-8 h-20 w-20 rounded-full bg-[#DDF5FF]/70 blur-xl"/>
          <div className="relative flex items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#DDE5FF] bg-[#F3F5FF] px-3 py-1 text-[10px] font-black tracking-[.16em] text-[#1B328E]"><span className="text-[#8B5CF6]">✦</span> MARKETING COMMAND CENTER</div>
              <h1 className="mt-3 text-[28px] font-black tracking-[-.025em] text-[#111A43]">{title}</h1>
              <p className="mt-1 max-w-3xl text-sm text-slate-500">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="rounded-2xl border border-slate-200/80 bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm">Vista
                <select value={state.role} onChange={roleChange} className="ml-2 rounded-xl border-0 bg-[#F7F8FC] px-3 py-2 text-sm font-semibold text-[#1B328E] outline-none">
                  <option value="paula">Paula · Edición</option><option value="priscila">Priscila · Edición</option><option value="gerencia">Gerencia · Consulta</option><option value="comercial">Comercial · Consulta</option><option value="visor_eventos">Visor Eventos · Promotora</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </header>
      <main className="p-7 pt-6">{children}</main>
    </div>
  </div>
}
