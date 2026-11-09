import { useEffect, useState } from 'react'
import { animacionesForzadas, setAnimaciones, sistemaReduce } from '../lib/motion'

/**
 * Solo aparece si el sistema del visitante pide reducir animaciones: le deja activarlas
 * para ver el portafolio completo (y volver a apagarlas). La elección se recuerda.
 */
export default function BotonAnimaciones() {
  const [visible, setVisible] = useState(false)
  const forzadas = animacionesForzadas()

  useEffect(() => {
    setVisible(sistemaReduce())
  }, [])

  if (!visible) return null
  return (
    <button type="button" className="terminal-btn animaciones-btn" onClick={() => setAnimaciones(!forzadas)}>
      <span aria-hidden="true">{forzadas ? '❚❚' : '▶'}</span>
      {forzadas ? 'Reducir animaciones' : 'Activar animaciones'}
    </button>
  )
}
