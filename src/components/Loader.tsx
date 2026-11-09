import { useEffect, useRef, useState } from 'react'
import Monograma from './Monograma'
import { gsap, prefersReducedMotion, stopScroll } from '../lib/motion'

const IMAGENES = ['/logos/desarrollador.png']

/** Carga real: fuentes + imágenes clave. El contador sube con lo que de verdad llega. */
export default function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    stopScroll(true)
    const tareas: Promise<unknown>[] = [
      document.fonts?.ready ?? Promise.resolve(),
      ...IMAGENES.map(
        (src) =>
          new Promise((res) => {
            const img = new Image()
            img.onload = img.onerror = res
            img.src = src
          })
      ),
    ]
    let hechas = 0
    const objetivo = { v: 0 }
    const avanzar = () => {
      hechas++
      gsap.to(objetivo, {
        v: (hechas / tareas.length) * 100,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => setPct(Math.round(objetivo.v)),
      })
    }
    tareas.forEach((t) => t.then(avanzar))

    // Mínimo 1,2 s para que el monograma se lea; máximo 6 s por si algo no responde.
    const minimo = new Promise((r) => setTimeout(r, prefersReducedMotion() ? 0 : 1200))
    const maximo = new Promise((r) => setTimeout(r, 6000))
    let cancelado = false
    Promise.race([Promise.all([Promise.all(tareas), minimo]), maximo]).then(() => {
      if (cancelado) return
      gsap.to(objetivo, {
        v: 100,
        duration: 0.4,
        onUpdate: () => setPct(Math.round(objetivo.v)),
        onComplete: () => {
          const el = ref.current
          if (!el || prefersReducedMotion()) {
            stopScroll(false)
            onDone()
            return
          }
          gsap
            .timeline({
              onComplete: () => {
                stopScroll(false)
                onDone()
              },
            })
            .to(el.querySelector('.loader-inner'), { y: -40, opacity: 0, duration: 0.5, ease: 'power2.in' })
            .to(el, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power3.inOut' }, '-=0.1')
        },
      })
    })
    return () => {
      cancelado = true
    }
  }, [onDone])

  const encendidos = Math.min(4, Math.floor(pct / 25) + (pct >= 100 ? 1 : 0))

  return (
    <div ref={ref} className="loader" style={{ clipPath: 'inset(0 0 0% 0)' }} aria-hidden="true">
      <div className="loader-inner grid justify-items-center gap-5 text-cal">
        <Monograma size={84} encendidos={encendidos} />
        <span className="mono text-xs tracking-[0.2em] text-niebla tabular-nums">{pct}%</span>
      </div>
    </div>
  )
}
