import { monthOf, yearOf } from './utils'

export const PURPOSES=['Captación y cierre','Relacionamiento','Marca / Posicionamiento','Merchandising comercial','Operación']
export const CURRENCIES=['CLP','USD','UF']

export const clp=value=>`$${Math.round(Number(value||0)).toLocaleString('es-CL')}`
export const foreignMoney=(value,currency='CLP')=>currency==='CLP'?clp(value):`${currency} ${Number(value||0).toLocaleString('es-CL',{maximumFractionDigits:2})}`

export function rateFor(currency,settings={},explicit){
  if(currency==='CLP') return 1
  const own=Number(explicit)
  if(own>0)return own
  return currency==='USD'?Number(settings.usdClp)||0:currency==='UF'?Number(settings.ufClp)||0:1
}

export function toCLP(amount,currency='CLP',rate,settings={}){
  return (Number(amount)||0)*rateFor(currency,settings,rate)
}

export const defaultCostItems=(legacy={},settings={})=>[
  ['Traslado',legacy.traslado],['Catering',legacy.catering],['Regalos',legacy.regalos],['Lugar / arriendo',legacy.lugar],['Material / diseño',legacy.material],['Otros',legacy.otro],
].filter(([,amount])=>Number(amount)>0).map(([concept,amount],i)=>({id:`legacy-${i}-${Date.now()}`,concept,amount:Number(amount)||0,currency:'UF',exchangeRate:Number(settings.ufClp)||0,payer:'tibox',partner:'',notes:''}))

export const costTotal=(items,settings={})=>(items||[]).reduce((sum,x)=>sum+toCLP(x.amount,x.currency||'UF',x.exchangeRate,settings),0)
export const tiboxCost=(items,settings={})=>(items||[]).filter(x=>x.payer!=='partner').reduce((sum,x)=>sum+toCLP(x.amount,x.currency||'UF',x.exchangeRate,settings),0)
export const partnerCost=(items,settings={})=>(items||[]).filter(x=>x.payer==='partner').reduce((sum,x)=>sum+toCLP(x.amount,x.currency||'UF',x.exchangeRate,settings),0)
export const roi=(revenue,cost)=>cost?((Number(revenue||0)-Number(cost||0))/Number(cost))*100:null
export const pct=value=>value===null||Number.isNaN(value)?'—':`${value>=0?'+':''}${value.toFixed(1)}%`

export function dealCLP(deal,state){return toCLP(deal.amount,deal.currency||'UF',deal.exchangeRate,state.financeSettings)}
export function attributedRevenue(state,sourceType,sourceId){return (state.businessDeals||[]).filter(x=>x.sourceType===sourceType&&x.sourceId===sourceId).reduce((s,x)=>s+dealCLP(x,state),0)}
export function attributedDealCount(state,sourceType,sourceId){return (state.businessDeals||[]).filter(x=>x.sourceType===sourceType&&x.sourceId===sourceId).length}

export function sourceOptions(state,type,onlyCompleted=true){
  const done=x=>!onlyCompleted||['done','closed'].includes(x.status)
  if(type==='event')return (state.events||[]).filter(done).map(x=>({id:x.id,name:x.name,date:x.date}))
  if(type==='route')return (state.routes||[]).filter(done).map(x=>({id:x.id,name:`Ruta · ${x.company}`,date:x.date}))
  if(type==='webinar')return (state.webinars||[]).filter(done).map(x=>({id:x.id,name:x.name,date:x.date}))
  if(type==='ads')return (state.ads||[]).filter(done).map(x=>({id:x.id,name:x.name,date:x.start}))
  return []
}

export function sourceName(state,type,id){
  return sourceOptions(state,type,false).find(x=>x.id===id)?.name||'—'
}

export function financeRows(state){
  const rows=[],settings=state.financeSettings||{}
  ;(state.events||[]).forEach(x=>rows.push({id:`event-${x.id}`,sourceId:x.id,sourceType:'event',source:'Evento',name:x.name,date:x.date,purpose:x.purpose||'Captación y cierre',budget:toCLP(x.budget,x.budgetCurrency||'UF',x.budgetRate,settings),total:costTotal(x.costItems,settings),tibox:tiboxCost(x.costItems,settings),partner:partnerCost(x.costItems,settings),revenue:attributedRevenue(state,'event',x.id),deals:attributedDealCount(state,'event',x.id),notes:x.costNotes||''}))
  ;(state.routes||[]).forEach(x=>rows.push({id:`route-${x.id}`,sourceId:x.id,sourceType:'route',source:'Ruta',name:`Ruta · ${x.company}`,date:x.date,purpose:x.purpose||'Captación y cierre',budget:toCLP(x.budget,x.budgetCurrency||'UF',x.budgetRate,settings),total:costTotal(x.costItems,settings),tibox:tiboxCost(x.costItems,settings),partner:partnerCost(x.costItems,settings),revenue:attributedRevenue(state,'route',x.id),deals:attributedDealCount(state,'route',x.id),notes:x.costNotes||x.notes||''}))
  ;(state.webinars||[]).forEach(x=>rows.push({id:`webinar-${x.id}`,sourceId:x.id,sourceType:'webinar',source:'Webinar',name:x.name,date:x.date,purpose:'Captación y cierre',budget:0,total:0,tibox:0,partner:0,revenue:attributedRevenue(state,'webinar',x.id),deals:attributedDealCount(state,'webinar',x.id),notes:''}))
  ;(state.ads||[]).forEach(x=>rows.push({id:`ads-${x.id}`,sourceId:x.id,sourceType:'ads',source:'Ads',name:x.name,date:x.start,purpose:x.purpose||'Captación y cierre',budget:toCLP(x.budget,x.currency||'CLP',x.exchangeRate,settings),total:toCLP(x.actual,x.currency||'CLP',x.exchangeRate,settings),tibox:toCLP(x.actual,x.currency||'CLP',x.exchangeRate,settings),partner:0,revenue:attributedRevenue(state,'ads',x.id),deals:attributedDealCount(state,'ads',x.id),notes:x.notes||''}))
  ;(state.manualExpenses||[]).forEach(x=>{const amount=toCLP(x.amount,x.currency||'CLP',x.exchangeRate,settings),budget=toCLP(x.budget,x.budgetCurrency||x.currency||'CLP',x.budgetRate||x.exchangeRate,settings);rows.push({id:`manual-${x.id}`,sourceId:x.id,sourceType:'manual',source:'Otro gasto',name:x.concept,date:x.date,purpose:x.purpose||'Relacionamiento',budget,total:amount,tibox:x.payer==='partner'?0:amount,partner:x.payer==='partner'?amount:0,revenue:0,deals:0,notes:x.notes||''})})
  return rows.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')))
}

export function rowsForPeriod(rows,year,month=0){return rows.filter(x=>yearOf(x.date)===Number(year)&&(!month||monthOf(x.date)===Number(month)))}
export function financeSummary(rows){const budget=rows.reduce((s,x)=>s+x.budget,0),total=rows.reduce((s,x)=>s+x.total,0),tibox=rows.reduce((s,x)=>s+x.tibox,0),partner=rows.reduce((s,x)=>s+x.partner,0),revenue=rows.reduce((s,x)=>s+x.revenue,0);return {budget,total,tibox,partner,revenue,deals:rows.reduce((s,x)=>s+(x.deals||0),0),roiTotal:roi(revenue,total),roiTibox:roi(revenue,tibox)}}

export function managementOccurrence(task,year,month){const y=Number(year),m=Number(month);if(task.active===false)return null;if(task.frequency==='once'){if(yearOf(task.date)!==y||monthOf(task.date)!==m)return null;return {key:task.date,due:task.date}}if(task.frequency==='annual'&&Number(task.month)!==m)return null;const day=Math.max(1,Math.min(28,Number(task.day)||1)),due=`${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`;return {key:`${y}-${String(m).padStart(2,'0')}`,due}}
export function managementForMonth(state,year,month){return (state.managementTasks||[]).map(task=>{const occurrence=managementOccurrence(task,year,month);if(!occurrence)return null;const done=Boolean(task.completions?.[occurrence.key]);const now=new Date();now.setHours(0,0,0,0);const dueDate=new Date(`${occurrence.due}T00:00:00`);return {...task,...occurrence,done,overdue:!done&&dueDate<now}}).filter(Boolean).sort((a,b)=>String(a.due).localeCompare(String(b.due)))}
export function variation(current,previous){const a=Number(current),b=Number(previous);if(!Number.isFinite(a)||!Number.isFinite(b)||b===0)return null;return ((a-b)/b)*100}
const saleAmount=(sales,wholesalerId,product,year,quarter)=>sales.filter(x=>x.wholesalerId===wholesalerId&&x.product===product&&Number(x.year)===Number(year)&&Number(x.quarter)===Number(quarter)).reduce((s,x)=>s+(Number(x.amount)||0),0)
export function saleComparisons(sales,row){const y=Number(row.year),q=Number(row.quarter),current=Number(row.amount)||0;let py=y,pq=q-1;if(pq===0){pq=4;py=y-1}const previousQuarter=saleAmount(sales,row.wholesalerId,row.product,py,pq),lastYear=saleAmount(sales,row.wholesalerId,row.product,y-1,q);let semester=null;if(q===2){const currentSemester=saleAmount(sales,row.wholesalerId,row.product,y,1)+saleAmount(sales,row.wholesalerId,row.product,y,2),previousSemester=saleAmount(sales,row.wholesalerId,row.product,y-1,3)+saleAmount(sales,row.wholesalerId,row.product,y-1,4);semester=previousSemester?variation(currentSemester,previousSemester):null}if(q===4){const currentSemester=saleAmount(sales,row.wholesalerId,row.product,y,3)+saleAmount(sales,row.wholesalerId,row.product,y,4),previousSemester=saleAmount(sales,row.wholesalerId,row.product,y,1)+saleAmount(sales,row.wholesalerId,row.product,y,2);semester=previousSemester?variation(currentSemester,previousSemester):null}return {quarter:previousQuarter?variation(current,previousQuarter):null,semester,year:lastYear?variation(current,lastYear):null}}
