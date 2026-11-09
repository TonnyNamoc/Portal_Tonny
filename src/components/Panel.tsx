import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { stopScroll } from '../lib/motion'

interface Props {
  abierto: boolean
  alCerrar: () => void
  /** Nombre del diálogo para lectores de pantalla */
  etiqueta: string
  /** lateral: cajón a la derecha (hoja inferior en móvil). centro: ventana centrada. */
  variante?: 'lateral' | 'centro'
  children: React.ReactNode
}

/**
 * Ventana sobre la página: cierra con Esc, con la X o tocando fuera,
 * frena el scroll de fondo y devuelve el foco a donde estaba.
 */
export default function Panel({ abierto, alCerrar, etiqueta, variante = 'lateral', children }: Props) {
  const caja = useRef<HTMLDivElement>(null)
  const cerrar = useRef(alCerrar)
  cerrar.current = alCerrar

  useEffect(() => {
    if (!abierto) return
    const antes = document.activeElement as HTMLElement | null
    stopScroll(true)
    caja.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        cerrar.current()
      } else if (e.key === 'Tab') {
        // El foco no sale de la ventana
        const f = caja.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        if (!f || !f.length) return
        const primero = f[0]
        const ultimo = f[f.length - 1]
        if (e.shiftKey && (document.activeElement === primero || document.activeElement === caja.current)) {
          e.preventDefault()
          ultimo.focus()
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault()
          primero.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      stopScroll(false)
      antes?.focus?.({ preventScroll: true })
    }
  }, [abierto])

  if (!abierto) return null

  return createPortal(
    <div className={`panel panel-${variante}`} data-lenis-prevent>
      <div className="panel-fondo" onClick={alCerrar} />
      <div ref={caja} className="panel-caja" role="dialog" aria-modal="true" aria-label={etiqueta} tabIndex={-1}>
        <button type="button" className="panel-cerrar" onClick={alCerrar} aria-label="Cerrar">
          <span aria-hidden="true">✕</span>
        </button>
        {children}
      </div>
    </div>,
    document.body
  )
}
