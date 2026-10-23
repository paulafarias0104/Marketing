import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { MarketingProvider } from './context/MarketingContext'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MarketingProvider>
      <App />
    </MarketingProvider>
  </StrictMode>,
)
