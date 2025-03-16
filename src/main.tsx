import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Todos from './Todos.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Todos/>
  </StrictMode>,
)
