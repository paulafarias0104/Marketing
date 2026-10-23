import { monthOf, yearOf } from './utils'

export const PURPOSES=['Captación y cierre','Relacionamiento','Marca / Posicionamiento','Merchandising comercial','Operación']

export const defaultCostItems=(legacy={})=>[
  ['Traslado',legacy.traslado],['Catering',legacy.catering],['Regalos',legacy.regalos],['Lugar / arriendo',legacy.lugar],['Material / diseño',legacy.material],['Otros',legacy.otro],
].filter(([,amount])=>Number(amount)>0).map(([concept,amount],i)=>({id:`legacy-${i}-${Date.now()}`,concept,amount:Number(amount)||0,payer:'tibox',partner:'',notes:''}))

export const costTotal=items=>(items||[]).reduce((sum,x)=>sum+(Number(x.amount)||0),0)
export const tiboxCost=items=>(items||[]).filter(x=>x.payer!=='partner').reduce((sum,x)=>sum+(Number(x.amount)||0),0)
export const partnerCost=items=>(items||[]).filter(x=>x.payer==='partner').reduce((sum,x)=>sum+(Number(x.amount)||0),0)
export const roi=(revenue,cost)=>cost?((Number(revenue||0)-Number(cost||0))/Number(cost))*100:null
export const pct=value=>value===null||Number.isNaN(value)?'—':`${value>=0?'+':''}${value.toFixed(1)}%`

export function financeRows(state){
  const rows=[]
  ;(state.events||[]).forEach(x=>rows.push({id:`event-${x.id}`,sourceId:x.id,source:'Evento',name:x.name,date:x.date,purpose:x.purpose||'Captación y cierre',budget:Number(x.budget)||0,total:costTotal(x.costItems),tibox:tiboxCost(x.costItems),partner:partnerCost(x.costItems),revenue:Number(x.revenue)||0,notes:x.costNotes||''}))
  ;(state.routes||[]).forEach(x=>rows.push({id:`route-${x.id}`,sourceId:x.id,source:'Ruta',name:`Ruta · ${x.company}`,date:x.date,purpose:x.purpose||'Captación y cierre',budget:Number(x.budget)||0,total:costTotal(x.costItems),tibox:tiboxCost(x.costItems),partner:partnerCost(x.costItems),revenue:Number(x.sold)||0,notes:x.costNotes||x.notes||''}))
  ;(state.ads||[]).forEach(x=>rows.push({id:`ads-${x.id}`,sourceId:x.id,source:'Ads',name:x.name,date:x.start,purpose:x.purpose||'Captación y cierre',budget:Number(x.budget)||0,total:Number(x.actual)||0,tibox:Number(x.actual)||0,partner:0,revenue:Number(x.sold)||0,notes:x.notes||''}))
  ;(state.manualExpenses||[]).forEach(x=>rows.push({id:`manual-${x.id}`,sourceId:x.id,source:'Otro gasto',name:x.concept,date:x.date,purpose:x.purpose||'Relacionamiento',budget:Number(x.budget)||0,total:Number(x.amount)||0,tibox:x.payer==='partner'?0:Number(x.amount)||0,partner:x.payer==='partner'?Number(x.amount)||0:0,revenue:Number(x.revenue)||0,notes:x.notes||''}))
  return rows.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))
}

export function rowsForPeriod(rows,year,month=0){return rows.filter(x=>yearOf(x.date)===Number(year)&&(!month||monthOf(x.date)===Number(month)))}

export function financeSummary(rows){
  const budget=rows.reduce((s,x)=>s+x.budget,0),total=rows.reduce((s,x)=>s+x.total,0),tibox=rows.reduce((s,x)=>s+x.tibox,0),partner=rows.reduce((s,x)=>s+x.partner,0),revenue=rows.reduce((s,x)=>s+x.revenue,0)
  return {budget,total,tibox,partner,revenue,roiTotal:roi(revenue,total),roiTibox:roi(revenue,tibox)}
}

export function managementOccurrence(task,year,month){
  const y=Number(year),m=Number(month)
  if(task.active===false)return null
  if(task.frequency==='once'){
    if(yearOf(task.date)!==y||monthOf(task.date)!==m)return null
    return {key:task.date,due:task.date}
  }
  if(task.frequency==='annual'&&Number(task.month)!==m)return null
  const day=Math.max(1,Math.min(28,Number(task.day)||1));const due=`${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`
  return {key:`${y}-${String(m).padStart(2,'0')}`,due}
}

export function managementForMonth(state,year,month){
  return (state.managementTasks||[]).map(task=>{const occurrence=managementOccurrence(task,year,month);if(!occurrence)return null;const done=Boolean(task.completions?.[occurrence.key]);const now=new Date();now.setHours(0,0,0,0);const dueDate=new Date(`${occurrence.due}T00:00:00`);return {...task,...occurrence,done,overdue:!done&&dueDate<now}}).filter(Boolean).sort((a,b)=>String(a.due).localeCompare(String(b.due)))
}

export function variation(current,previous){
  const a=Number(current),b=Number(previous);if(!Number.isFinite(a)||!Number.isFinite(b)||b===0)return null;return ((a-b)/b)*100
}

const saleAmount=(sales,wholesalerId,product,year,quarter)=>sales.filter(x=>x.wholesalerId===wholesalerId&&x.product===product&&Number(x.year)===Number(year)&&Number(x.quarter)===Number(quarter)).reduce((s,x)=>s+(Number(x.amount)||0),0)

export function saleComparisons(sales,row){
  const y=Number(row.year),q=Number(row.quarter),current=Number(row.amount)||0
  let py=y,pq=q-1;if(pq===0){pq=4;py=y-1}const previousQuarter=saleAmount(sales,row.wholesalerId,row.product,py,pq)
  const lastYear=saleAmount(sales,row.wholesalerId,row.product,y-1,q)
  let semester=null
  if(q===2){const currentSemester=saleAmount(sales,row.wholesalerId,row.product,y,1)+saleAmount(sales,row.wholesalerId,row.product,y,2);const previousSemester=saleAmount(sales,row.wholesalerId,row.product,y-1,3)+saleAmount(sales,row.wholesalerId,row.product,y-1,4);semester=previousSemester?variation(currentSemester,previousSemester):null}
  if(q===4){const currentSemester=saleAmount(sales,row.wholesalerId,row.product,y,3)+saleAmount(sales,row.wholesalerId,row.product,y,4);const previousSemester=saleAmount(sales,row.wholesalerId,row.product,y,1)+saleAmount(sales,row.wholesalerId,row.product,y,2);semester=previousSemester?variation(currentSemester,previousSemester):null}
  return {quarter:previousQuarter?variation(current,previousQuarter):null,semester,year:lastYear?variation(current,lastYear):null}
}
