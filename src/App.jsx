import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Plan from './pages/Plan'
import Communications from './pages/Communications'
import Blog from './pages/Blog'
import Ads from './pages/Ads'
import Events from './pages/Events'
import Webinars from './pages/Webinars'
import Routes from './pages/Routes'
import PointActions from './pages/PointActions'
import Coverage from './pages/Coverage'
import Results from './pages/Results'
import Settings from './pages/Settings'

const PAGES={dashboard:Dashboard,plan:Plan,comms:Communications,blog:Blog,ads:Ads,events:Events,webinars:Webinars,routes:Routes,point:PointActions,coverage:Coverage,results:Results,settings:Settings}

export default function App(){
  const [view,setView]=useState('dashboard')
  const [header,setHeaderState]=useState({title:'Dashboard Ejecutivo',subtitle:'Visión consolidada del plan de mercado y sus resultados.'})
  const Page=PAGES[view]||Dashboard
  const setHeader=(title,subtitle)=>{if(header.title!==title||header.subtitle!==subtitle)queueMicrotask(()=>setHeaderState({title,subtitle}))}
  return <Layout view={view} setView={setView} title={header.title} subtitle={header.subtitle}><Page setHeader={setHeader}/></Layout>
}
