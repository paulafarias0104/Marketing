import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Plan from './pages/Plan'
import Management from './pages/Management'
import Communications from './pages/Communications'
import Blog from './pages/Blog'
import Ads from './pages/Ads'
import Events from './pages/Events'
import Webinars from './pages/Webinars'
import Routes from './pages/Routes'
import PointActions from './pages/PointActions'
import Coverage from './pages/Coverage'
import Finance from './pages/Finance'
import Wholesalers from './pages/Wholesalers'
import Settings from './pages/Settings'

const PAGES={dashboard:Dashboard,plan:Plan,management:Management,comms:Communications,blog:Blog,ads:Ads,events:Events,webinars:Webinars,routes:Routes,point:PointActions,coverage:Coverage,wholesalers:Wholesalers,settings:Settings}
const financeTab=view=>view==='finance-revenue'?'revenue':view==='finance-deals'?'deals':'general'

export default function App(){
  const [view,setView]=useState('dashboard')
  const [header,setHeaderState]=useState({title:'Dashboard Ejecutivo',subtitle:'Visión consolidada del plan de mercado y sus resultados.'})
  const isFinance=view==='finance'||view.startsWith('finance-')
  const Page=isFinance?Finance:(PAGES[view]||Dashboard)
  const setHeader=(title,subtitle)=>{if(header.title!==title||header.subtitle!==subtitle)queueMicrotask(()=>setHeaderState({title,subtitle}))}
  const onFinanceTabChange=tab=>setView(tab==='revenue'?'finance-revenue':tab==='deals'?'finance-deals':'finance-general')
  return <Layout view={view} setView={setView} title={header.title} subtitle={header.subtitle}><Page key={view} setHeader={setHeader} {...(isFinance?{initialTab:financeTab(view),onTabChange:onFinanceTabChange}:{})}/></Layout>
}
