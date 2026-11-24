import Shop from './Shop'
import Admin from './Admin'

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '')
  if (path === '/adminsmallshop') return <Admin />
  return <Shop />
}