import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { normalizeState, seedState } from '../data/seed'

const MarketingContext=createContext(null)
const STORE='tibox_marketing_react_v4'
const LEGACY_STORE='tibox_marketing_v3'

const SUBGERENCIAS_BY_LINE={
  m365:'Infra',cloud:'Infra','infra-ti':'Infra',backup:'Infra',noc:'Infra',firewall:'Infra',soc:'Infra','security-ms':'Infra',mesa:'Infra',
  bi:'Soluciones Digitales',ia:'Soluciones Digitales',automation:'Soluciones Digitales',dev:'Soluciones Digitales',lpdp:'Soluciones Digitales',
}

function enforceSubgerencias(raw){
  const state=raw
  if(state?.config?.lines){
    state.config.lines=state.config.lines.map(line=>({
      ...line,
      subgerencia:SUBGERENCIAS_BY_LINE[line.id]||(['Infra','Soluciones Digitales'].includes(line.subgerencia)?line.subgerencia:'Infra'),
    }))
  }
  return state
}

function loadState(){
  try{
    const current=localStorage.getItem(STORE)
    if(current) return enforceSubgerencias(normalizeState(JSON.parse(current)))
    const legacy=localStorage.getItem(LEGACY_STORE)
    if(legacy) return enforceSubgerencias(normalizeState(JSON.parse(legacy)))
  }catch{}
  return enforceSubgerencias(seedState())
}

export function MarketingProvider({children}){
  const [state,setState]=useState(loadState)
  useEffect(()=>{localStorage.setItem(STORE,JSON.stringify(state))},[state])

  const api=useMemo(()=>({
    state,
    setState,
    mutate(fn){
      setState(prev=>{
        const next=structuredClone(prev)
        fn(next)
        return enforceSubgerencias(next)
      })
    },
    add(collection,item){
      setState(prev=>enforceSubgerencias({...prev,[collection]:[...(prev[collection]||[]),item]}))
    },
    update(collection,id,patch){
      setState(prev=>enforceSubgerencias({...prev,[collection]:(prev[collection]||[]).map(x=>x.id===id?{...x,...patch}:x)}))
    },
    remove(collection,id){
      setState(prev=>enforceSubgerencias({...prev,[collection]:(prev[collection]||[]).filter(x=>x.id!==id)}))
    },
    setRole(role){setState(prev=>({...prev,role}))},
    setPreference(name,value){setState(prev=>({...prev,preferences:{...prev.preferences,[name]:value}}))},
    reset(){setState(enforceSubgerencias(seedState()))},
  }),[state])

  return <MarketingContext.Provider value={api}>{children}</MarketingContext.Provider>
}

export function useMarketing(){
  const ctx=useContext(MarketingContext)
  if(!ctx) throw new Error('useMarketing debe usarse dentro de MarketingProvider')
  return ctx
}
