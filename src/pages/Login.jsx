import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://enrckvdqzzgutvlmbyzy.supabase.co',
  'sb_publishable_s8Dd-6WnVN6-Iqm81UvkJg_ixqOmEeb'
)

export default function Login({ onLogin, goRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      onLogin()
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">

        {/* Brand */}
        <div className="auth-brand">
          <div className="logo">🔐</div>
          <h2>Proyecto TICS</h2>
          <p>Accede a tu sistema de seguridad</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="auth-form">

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

          {error && <div className="error">{error}</div>}

          <button className="btn-primary" disabled={loading}>
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>

        </form>

        {/* Footer */}
        <div className="auth-footer">
          <span>¿No tienes cuenta?</span>
          <button className="link-btn" onClick={goRegister}>
            Crear cuenta
          </button>
        </div>

      </div>
    </div>
  )
}