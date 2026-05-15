import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import emailjs from '@emailjs/browser'

// 🔥 SUPABASE
const supabase = createClient(
  'https://enrckvdqzzgutvlmbyzy.supabase.co',
  'sb_publishable_s8Dd-6WnVN6-Iqm81UvkJg_ixqOmEeb'
)

export default function Alertas() {

  const [eventos, setEventos] = useState([])
  const [pagina, setPagina] = useState(1)

  const eventosPorPagina = 3

  // 🔥 OBTENER EVENTOS
  const obtenerEventos = async () => {

    const { data, error } = await supabase
      .from('eventos')
      .select('*')
      .order('id', { ascending: false })

    if (error) {

      console.log('ERROR OBTENER EVENTOS:', error)

      return
    }

    console.log('EVENTOS:', data)

    setEventos(data || [])
  }

  // 🔥 CARGAR EVENTOS
  useEffect(() => {
    obtenerEventos()
  }, [])

  // 🔥 CREAR EVENTO
  const crearEvento = async () => {

    try {

      // 🔥 FECHA CHILE
      const fechaChile = new Date().toLocaleString('es-CL', {
        timeZone: 'America/Santiago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })

      // 🔥 EVENTO LOCAL
      const nuevoEvento = {
        id: Date.now(),
        tipo: 'robo',
        fecha: fechaChile
      }

      // 🔥 MOSTRAR INMEDIATAMENTE
      setEventos(prev => [nuevoEvento, ...prev])

      // 🔥 GUARDAR EVENTO EN BD
      const { error: errorEvento } = await supabase
        .from('eventos')
        .insert([
          {
            tipo: 'robo',
            fecha: fechaChile
          }
        ])

      if (errorEvento) {

        console.log('ERROR EVENTO:', errorEvento)

      } else {

        console.log('EVENTO GUARDADO ✅')
      }

      // 🔥 OBTENER USUARIO
      const { data: userData } = await supabase.auth.getUser()

      if (!userData?.user) {

        alert('Usuario no autenticado ❌')

        return
      }

      // 🔥 BUSCAR DATOS USUARIO
      const { data: user, error: errorUser } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userData.user.id)
        .single()

      if (errorUser || !user) {

        console.log('ERROR USER:', errorUser)

        alert('Error obteniendo usuario ❌')

        return
      }

      console.log('USUARIO:', user)

      // 🔥 ENVIAR EMAIL
      await emailjs.send(

        'service_dwleyos',

        'template_j3vw0xt',

        {
          to_email: user.correo,
          to_emergency: user.correo_emergencia,
          nombre: user.nombre,
          fecha: fechaChile
        },

        'WQySMmYUTSj7CaCJW'
      )

      console.log('CORREO ENVIADO ✅')

      alert('🚨 Alerta enviada correctamente')

      // 🔥 RECARGAR EVENTOS
      obtenerEventos()

    } catch (err) {

      console.log('ERROR GENERAL:', err)

      alert('Error ❌')
    }
  }

  // 🔥 PAGINACIÓN
  const totalPaginas = Math.ceil(eventos.length / eventosPorPagina)

  const inicio = (pagina - 1) * eventosPorPagina
  const fin = inicio + eventosPorPagina

  const eventosActuales = eventos.slice(inicio, fin)

  return (

    <div className="container">

      {/* HEADER */}
      <div className="header">

        <h1>🚨 Alertas</h1>

        <p>
          Registro de eventos de seguridad
        </p>

      </div>

      {/* BOTÓN */}
      <button
        className="btn-alerta"
        onClick={crearEvento}
      >
        Simular robo
      </button>

      {/* LISTA */}
      <div className="lista">

        <h2>Eventos recientes</h2>

        {eventos.length === 0 && (

          <p className="empty">
            No hay eventos aún
          </p>
        )}

        {eventosActuales.map((e) => (

          <div className="card" key={e.id}>

            <div>

              <p className="tipo">
                🚨 {e.tipo?.toUpperCase()}
              </p>

              <p className="fecha">
                {e.fecha}
              </p>

            </div>

            <span className="badge">
              ACTIVO
            </span>

          </div>
        ))}

        {/* 🔥 PAGINACIÓN */}
        {totalPaginas > 1 && (

          <div className="paginacion">

            {Array.from(
              { length: totalPaginas },
              (_, i) => (

                <button
                  key={i}
                  className={
                    pagina === i + 1
                      ? 'pagina-btn active'
                      : 'pagina-btn'
                  }
                  onClick={() => setPagina(i + 1)}
                >
                  {i + 1}
                </button>
              )
            )}

          </div>
        )}

      </div>

    </div>
  )
}