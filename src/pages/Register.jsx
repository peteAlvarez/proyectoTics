import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://enrckvdqzzgutvlmbyzy.supabase.co',
  'sb_publishable_s8Dd-6WnVN6-Iqm81UvkJg_ixqOmEeb'
)

export default function Register({ onRegister }) {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // crear usuario en auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      if (error) throw error

      // guardar datos en tabla usuarios
      await supabase.from('usuarios').insert([
        {
          id: data.user.id,
          nombre,
          email,
          telefono
        }
      ])

      alert('Cuenta creada correctamente ✅')
      onRegister()

    } catch (err) {
      setError(err.message || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">

        {/* HEADER */}
        <div className="auth-brand">
          <div className="logo">🚀</div>
          <h2>Crear cuenta</h2>
          <p>Regístrate en Proyecto TICS</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleRegister} className="auth-form">

          <div className="field">
            <label>Nombre</label>
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Correo</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Teléfono</label>
            <input
              type="text"
              placeholder="+56 9 1234 5678"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button className="btn-primary" disabled={loading}>
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>

        </form>

        {/* FOOTER */}
        <div className="auth-footer">
          <span>¿Ya tienes cuenta?</span>
          <button className="link-btn" onClick={onRegister}>
            Iniciar sesión
          </button>
        </div>

      </div>
    </div>
  )
}