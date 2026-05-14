import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// conexión Supabase
const supabase = createClient(
  'https://enrckvdqzzgutvlmbyzy.supabase.co',
  'sb_publishable_s8Dd-6WnVN6-Iqm81UvkJg_ixqOmEeb'
)

export default function Alertas() {
  const [eventos, setEventos] = useState([])
  const [pagina, setPagina] = useState(1)

  const eventosPorPagina = 3

  const obtenerEventos = async () => {
    const { data } = await supabase
      .from('eventos')
      .select('*')
      .order('id', { ascending: false })

    setEventos(data || [])
  }

  useEffect(() => {
    obtenerEventos()
  }, [])

  const crearEvento = async () => {
    try {
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

      const nuevoEvento = {
        id: Date.now(),
        tipo: 'robo',
        fecha: fechaChile
      }

      setEventos(prev => [nuevoEvento, ...prev])

      await supabase.from('eventos').insert([
        {
          tipo: 'robo',
          fecha: fechaChile
        }
      ])

      const { data: userData } = await supabase.auth.getUser()

      const { data } = await supabase
        .from('usuarios')
        .select('nombre')
        .eq('id', userData.user.id)
        .single()

      await fetch('https://backend-proyectotics.onrender.com/enviar-correo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data?.nombre || 'Usuario'
        })
      })

    } catch (err) {
      console.log(err)
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
        <p>Registro de eventos de seguridad</p>
      </div>

      {/* BOTÓN */}
      <button className="btn-alerta" onClick={crearEvento}>
        Simular robo
      </button>

      {/* LISTA */}
      <div className="lista">
        <h2>Eventos recientes</h2>

        {eventos.length === 0 && (
          <p className="empty">No hay eventos aún</p>
        )}

        {eventosActuales.map((e) => (
          <div className="card" key={e.id}>
            <div>
              <p className="tipo">🚨 {e.tipo.toUpperCase()}</p>
              <p className="fecha">{e.fecha}</p>
            </div>

            <span className="badge">ACTIVO</span>
          </div>
        ))}

        {/* 🔥 PAGINACIÓN BONITA */}
        {totalPaginas > 1 && (
          <div className="paginacion">
            {Array.from({ length: totalPaginas }, (_, i) => (
              <button
                key={i}
                className={pagina === i + 1 ? 'pagina-btn active' : 'pagina-btn'}
                onClick={() => setPagina(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}