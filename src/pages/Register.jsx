import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://enrckvdqzzgutvlmbyzy.supabase.co',
  'sb_publishable_s8Dd-6WnVN6-Iqm81UvkJg_ixqOmEeb'
)

export default function Register({ onRegister }) {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [correoEmergencia, setCorreoEmergencia] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()

    setLoading(true)
    setError('')

    try {

      // CREAR USUARIO AUTH
      const { data, error } = await supabase.auth.signUp({
        email: correo,
        password
      })

      if (error) throw error

      // GUARDAR EN TABLA USUARIOS
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert([
          {
            id: data.user.id,
            nombre,
            correo,
            correo_emergencia: correoEmergencia
          }
        ])

      if (insertError) throw insertError

      alert('Cuenta creada correctamente ✅')

      onRegister()

    } catch (err) {
      console.log(err)
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

          <p>
            Regístrate en Proyecto TICS
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleRegister}
          className="auth-form"
        >

          {/* NOMBRE */}
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

          {/* CORREO */}
          <div className="field">
            <label>Correo personal</label>

            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          {/* CORREO EMERGENCIA */}
          <div className="field">
            <label>Correo de emergencia</label>

            <input
              type="email"
              placeholder="emergencia@correo.com"
              value={correoEmergencia}
              onChange={(e) =>
                setCorreoEmergencia(e.target.value)
              }
              required
            />
          </div>

          {/* PASSWORD */}
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

          {/* ERROR */}
          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {/* BOTON */}
          <button
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? 'Creando...'
              : 'Crear cuenta'}
          </button>

        </form>

        {/* FOOTER */}
        <div className="auth-footer">

          <span>
            ¿Ya tienes cuenta?
          </span>

          <button
            className="link-btn"
            onClick={onRegister}
          >
            Iniciar sesión
          </button>

        </div>

      </div>

    </div>
  )
}