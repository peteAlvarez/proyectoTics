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

  // OBTENER USUARIO
  const obtenerUsuario = async () => {

    const { data: userData } =
      await supabase.auth.getUser()

    if (!userData?.user) return

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', userData.user.id)
      .single()

    if (error) {
      console.log(error)
      return
    }

    setUser(data)
  }

  // OBTENER EVENTOS
  const obtenerEventos = async () => {

    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('id', { ascending: false })

    if (error) {
      console.log(error)
      return
    }

    setEventos(data || [])
  }

  const ultimoEvento = eventos[0]

  return (

    <div className="panel-container">

      {/* HEADER */}
      <div className="panel-header">

        <h1>
          👋 Hola, {user?.nombre || 'Usuario'}
        </h1>

        <p>
          Bienvenido a tu panel de control
        </p>

      </div>

      {/* CARDS */}
      <div className="panel-cards">

        {/* CORREO */}
        <div className="panel-card">

          <h3>📧 Correo personal</h3>

          <p className="email">
            {user?.correo || 'No registrado'}
          </p>

        </div>

        {/* CORREO EMERGENCIA */}
        <div className="panel-card">

          <h3>🚨 Correo emergencia</h3>

          <p className="email">
            {user?.correo_emergencia || 'No registrado'}
          </p>

        </div>

        {/* EVENTOS */}
        <div className="panel-card">

          <h3>📊 Eventos registrados</h3>

          <p>
            {eventos.length}
          </p>

        </div>

        {/* ESTADO */}
        <div className="panel-card">

          <h3>🛡 Estado del sistema</h3>

          <p style={{ color: '#22c55e' }}>
            Protegido
          </p>

        </div>

      </div>

      {/* MINI METRICAS */}
      <div className="panel-mini">

        <div>
          <p style={{ color: '#94a3b8' }}>
            Última alerta
          </p>

          <p>
            {ultimoEvento?.tipo || 'Sin eventos'}
          </p>
        </div>

        <div>
          <p style={{ color: '#94a3b8' }}>
            Fecha
          </p>

          <p>
            {ultimoEvento?.fecha || '--'}
          </p>
        </div>

        <div>
          <p style={{ color: '#94a3b8' }}>
            Estado
          </p>

          <p style={{
            color: ultimoEvento
              ? '#ef4444'
              : '#22c55e'
          }}>
            {ultimoEvento
              ? 'Alerta detectada'
              : 'Normal'}
          </p>
        </div>

      </div>

      {/* RESUMEN */}
      <div className="panel-extra">

        <h2>
          Resumen del sistema
        </h2>

        <p>
          Este sistema inteligente permite detectar pérdidas o robos mediante dispositivos conectados y monitoreo en tiempo real, enviando alertas automáticas tanto al usuario como al contacto de emergencia registrado.
        </p>

      </div>

    </div>
  )
}