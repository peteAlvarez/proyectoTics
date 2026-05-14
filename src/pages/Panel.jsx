import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://enrckvdqzzgutvlmbyzy.supabase.co',
  'sb_publishable_s8Dd-6WnVN6-Iqm81UvkJg_ixqOmEeb'
)

export default function Panel() {
  const [user, setUser] = useState(null)
  const [eventos, setEventos] = useState([])

  useEffect(() => {
    obtenerUsuario()
    obtenerEventos()
  }, [])

  const obtenerUsuario = async () => {
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) return

    const { data } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userData.user.id)
      .single()

    setUser(data)
  }

  const obtenerEventos = async () => {
    const { data } = await supabase
      .from('eventos')
      .select('*')
      .order('id', { ascending: false })

    setEventos(data || [])
  }

  const ultimoEvento = eventos[0]

  return (
    <div className="panel-container">

      {/* HEADER */}
      <div className="panel-header">
        <h1>👋 Hola, {user?.nombre || 'Usuario'}</h1>
        <p>Bienvenido a tu panel de control</p>
      </div>

      {/* CARDS PRINCIPALES */}
      <div className="panel-cards">

        <div className="panel-card">
          <h3>📧 Correo</h3>
          <p className="email">
            {user?.email || 'No disponible'}
          </p>
        </div>

        <div className="panel-card">
          <h3>📱 Teléfono</h3>
          <p>
            {user?.telefono || 'No registrado'}
          </p>
        </div>

        <div className="panel-card">
          <h3>🚨 Eventos registrados</h3>
          <p>{eventos.length}</p>
        </div>

        <div className="panel-card">
          <h3>🔒 Estado del sistema</h3>
          <p style={{ color: '#22c55e' }}>Protegido</p>
        </div>

      </div>

      {/* MINI METRICAS */}
      <div className="panel-mini">
        <div>
          <p style={{ color: '#94a3b8' }}>Última alerta</p>
          <p>{ultimoEvento?.tipo || 'Sin eventos'}</p>
        </div>

        <div>
          <p style={{ color: '#94a3b8' }}>Fecha</p>
          <p>{ultimoEvento?.fecha || '--'}</p>
        </div>

        <div>
          <p style={{ color: '#94a3b8' }}>Estado</p>
          <p style={{ color: '#ef4444' }}>
            {ultimoEvento ? 'Alerta detectada' : 'Normal'}
          </p>
        </div>
      </div>

      {/* INFO EXTRA */}
      <div className="panel-extra">
        <h2>Resumen del sistema</h2>
        <p>
          Este sistema permite detectar pérdidas o robos mediante dispositivos conectados 
          (ESP32), generando alertas en tiempo real y notificaciones automáticas al usuario.
        </p>
      </div>

    </div>
  )
}