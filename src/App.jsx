import './App.css'   // 🔥 ESTA LÍNEA ES LA CLAVE

import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  const [screen, setScreen] = useState('login')

  return (
    <>
      {screen === 'login' && (
        <Login
          onLogin={() => setScreen('dashboard')}
          goRegister={() => setScreen('register')}
        />
      )}

      {screen === 'register' && (
        <Register onRegister={() => setScreen('login')} />
      )}

      {screen === 'dashboard' && <Dashboard />}
    </>
  )
}

export default App
