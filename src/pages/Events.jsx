import { useState } from 'react'
import { useMarketing } from '../context/MarketingContext'
import EventList from './events/EventList'
import EventDetail from './events/EventDetail'

export default function Events({setHeader}){
  const {state}=useMarketing();const [selected,setSelected]=useState('')
  const liveOnly=state.role==='visor_eventos'
  setHeader(liveOnly?'Eventos · Live':'Eventos',liveOnly?'Recepción y control de llegada de asistentes.':'Planificación, operación, Live, costos y seguimiento post evento.')
  if(selected)return <EventDetail eventId={selected} onBack={()=>setSelected('')} liveOnly={liveOnly}/>
  return <EventList onOpen={setSelected}/>
}
