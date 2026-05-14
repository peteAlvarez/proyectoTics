import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://enrckvdqzzgutvlmbyzy.supabase.co',
  'sb_publishable_s8Dd-6WnVN6-Iqm81UvkJg_ixqOmEeb'
)

export default function Config() {
  const [user, setUser] = useState(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [contacto, setContacto] = useState('')

  useEffect(() => {
    obtenerUsuario()
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
    setNombre(data?.nombre || '')
    setTelefono(data?.telefono || '')
    setContacto(data?.contacto_emergencia || '')
  }

  const guardarCambios = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser()

      await supabase
        .from('usuarios')
        .update({
          nombre,
          telefono,
          contacto_emergencia: contacto
        })
        .eq('id', userData.user.id)

      alert('Datos actualizados ✅')
    } catch (err) {
      console.log(err)
      alert('Error ❌')
    }
  }

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    location.reload() // vuelve al login
  }

  return (
    <div className="config-container">

      <div className="config-header">
        <h1>⚙️ Configuración</h1>
        <p>Administra tu cuenta y seguridad</p>
      </div>

      <div className="config-grid">

        {/* PERFIL */}
        <div className="config-card">
          <h3>👤 Perfil</h3>

          <label>Nombre</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} />

          <label>Teléfono</label>
          <input value={telefono} onChange={e => setTelefono(e.target.value)} />

          <label>Contacto emergencia</label>
          <input value={contacto} onChange={e => setContacto(e.target.value)} />

          <button className="btn-save" onClick={guardarCambios}>
            Guardar cambios
          </button>
        </div>

        {/* SEGURIDAD */}
        <div className="config-card">
          <h3>🔒 Seguridad</h3>
          <p>Estado: <span className="ok">Protegido</span></p>
          <p>Dispositivo activo: ✔</p>
        </div>

        {/* SESIÓN */}
        <div className="config-card">
          <h3>Sesión</h3>

          <button className="btn-logout" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>

      </div>
    </div>
  )
}