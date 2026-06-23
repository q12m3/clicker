import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initTelegram } from './lib/telegram'
import './index.css'
import App from './App.tsx'

initTelegram()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
