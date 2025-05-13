import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter as Router} from 'react-router-dom'
import { Provider } from 'react-redux'
// @ts-ignore
import store from './redux/store.js'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <Router>
      <App />
    </Router>
    </Provider>
  </StrictMode>,
)
