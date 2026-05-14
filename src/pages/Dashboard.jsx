import { useState } from 'react'
import Panel from './Panel'
import Alertas from './Alertas'
import Config from './Config'

export default function Dashboard() {
  const [tab, setTab] = useState('panel')

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>🚀 Proyecto TICS</h2>

        <button
          className={tab === 'panel' ? 'active' : ''}
          onClick={() => setTab('panel')}
        >
          📊 Panel
        </button>

        <button
          className={tab === 'alertas' ? 'active' : ''}
          onClick={() => setTab('alertas')}
        >
          🚨 Alertas
        </button>

        <button
          className={tab === 'config' ? 'active' : ''}
          onClick={() => setTab('config')}
        >
          ⚙️ Configuración
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="main-content">
        {tab === 'panel' && <Panel />}
        {tab === 'alertas' && <Alertas />}
        {tab === 'config' && <Config />}
      </div>

    </div>
  )
}