import { StrictMode, } from 'react'
import { createRoot } from 'react-dom/client'
import "./examples/index.css"
import App from './examples/App'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)

