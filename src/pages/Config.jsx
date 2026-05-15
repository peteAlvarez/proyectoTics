import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://enrckvdqzzgutvlmbyzy.supabase.co',
  'sb_publishable_s8Dd-6WnVN6-Iqm81UvkJg_ixqOmEeb'
)

export default function Config() {

  const [user, setUser] = useState(null)

  useEffect(() => {
    obtenerUsuario()
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

  // CERRAR SESION
  const cerrarSesion = async () => {

    await supabase.auth.signOut()

    location.reload()
  }

  return (

    <div className="config-container">

      {/* HEADER */}
      <div className="config-header">

        <div>
          <h1>⚙️ Configuración</h1>

          <p>
            Centro de administración y monitoreo del sistema
          </p>
        </div>

        <div className="status-badge">
          🟢 Sistema activo
        </div>

      </div>

      {/* PERFIL DESTACADO */}
      <div className="profile-banner">

        <div className="profile-avatar">
          {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
        </div>

        <div className="profile-info">

          <h2>
            {user?.nombre || 'Usuario'}
          </h2>

          <p>
            {user?.correo || 'correo@ejemplo.com'}
          </p>

        </div>

      </div>

      {/* GRID */}
      <div className="config-grid">

        {/* PERFIL */}
        <div className="config-card">

          <div className="card-top">
            <h3>👤 Información personal</h3>
          </div>

          <div className="config-info">
            <span>Nombre usuario</span>
            <p>{user?.nombre || 'No disponible'}</p>
          </div>

          <div className="config-info">
            <span>Correo principal</span>

            <p className="email">
              {user?.correo || 'No disponible'}
            </p>
          </div>

          <div className="config-info">
            <span>Correo emergencia</span>

            <p className="email">
              {user?.correo_emergencia || 'No disponible'}
            </p>
          </div>

        </div>

        {/* SEGURIDAD */}
        <div className="config-card">

          <div className="card-top">
            <h3>🛡 Seguridad</h3>
          </div>

          <div className="security-item">
            <div>
              <strong>Protección activa</strong>
              <p>Sistema monitoreando eventos</p>
            </div>

            <span className="green-dot"></span>
          </div>

          <div className="security-item">
            <div>
              <strong>Alertas automáticas</strong>
              <p>Notificaciones habilitadas</p>
            </div>

            <span className="green-dot"></span>
          </div>

          <div className="security-item">
            <div>
              <strong>Base de datos</strong>
              <p>Conectada correctamente</p>
            </div>

            <span className="green-dot"></span>
          </div>

        </div>

        {/* SISTEMA */}
        <div className="config-card">

          <div className="card-top">
            <h3>📊 Estado sistema</h3>
          </div>

          <div className="system-stats">

            <div className="mini-stat">
              <h4>ONLINE</h4>
              <p>Servidor</p>
            </div>

            <div className="mini-stat">
              <h4>24/7</h4>
              <p>Monitoreo</p>
            </div>

            <div className="mini-stat">
              <h4>v1.0</h4>
              <p>Versión</p>
            </div>

          </div>

        </div>

        {/* SESION */}
        <div className="config-card logout-card">

          <div className="card-top">
            <h3>🚪 Sesión</h3>
          </div>

          <p className="logout-text">
            Cierra tu sesión actual de forma segura.
          </p>

          <button
            className="btn-logout"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>

        </div>

      </div>

    </div>
  )
}