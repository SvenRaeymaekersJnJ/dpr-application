import { useState } from 'react'
import Login from './screens/Login'
import PlannerView from './screens/PlannerView'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return loggedIn
    ? <PlannerView onLogout={() => setLoggedIn(false)} />
    : <Login onLogin={() => setLoggedIn(true)} />
}