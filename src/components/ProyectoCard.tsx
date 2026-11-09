import { useRef } from 'react'
import type { Proyecto } from '../lib/data'
import { gsap } from '../lib/motion'

const CINTA_A = '404 ▲ No encontrado ▲ 404 ▲ No encontrado ▲ '
const CINTA_B = 'Peligro ▲ 404 ▲ Peligro ▲ 404 ▲ '

/** Tarjeta de proyecto. Si el código no está disponible, va cruzada por la cinta de peligro en X. */
export default function ProyectoCard({ p, delay = 0 }: { p: Proyecto; delay?: number }) {
  const ref = useRef<HTMLElement>(null)

  // Inclinación 3D que sigue al puntero
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(el, { rotateY: x * 10, rotateX: -y * 10, duration: 0.4, ease: 'power2.out', transformPerspective: 900 })
  }
  const onLeave = () => ref.current && gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'expo.out' })

  return (
    <div className="flotar" style={{ animationDelay: `${delay}s` }}>
      <article
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        data-cursor={p.noEncontrado ? "404" : "Ver"}
        className="proyecto grid aspect-[3/4] w-[min(82vw,380px)] content-end gap-3 p-6"
      >
        {p.noEncontrado && (
          <>
            <div className="cinta" aria-hidden="true">
              <div className="cinta-track">
                <span>{CINTA_A.repeat(2)}</span>
                <span>{CINTA_A.repeat(2)}</span>
              </div>
            </div>
            <div className="cinta b" aria-hidden="true">
              <div className="cinta-track">
                <span>{CINTA_B.repeat(2)}</span>
                <span>{CINTA_B.repeat(2)}</span>
              </div>
            </div>
          </>
        )}
        <div className="relative z-[3] grid gap-3 [text-shadow:0_2px_12px_rgba(0,0,0,0.85)]">
          <span className="eyebrow text-pacifico-claro" style={{ color: 'var(--pacifico-claro)' }}>
            Ciclo {p.ciclo}
          </span>
          <h3 className="display text-[34px] text-cal">{p.titulo}</h3>
          <p className="text-sm text-niebla">{p.curso}</p>
          <ul className="flex flex-wrap gap-2">
            {p.stack.map((s) => (
              <li key={s} className="mono rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-cal">
                {s}
              </li>
            ))}
          </ul>
          {p.noEncontrado ? (
            <p className="mono text-[11px] text-niebla">Proyecto no encontrado. Pronto vuelve.</p>
          ) : (
            p.enlace && (
              <a className="btn btn-ghost justify-self-start text-cal" href={p.enlace} target="_blank" rel="noreferrer">
                Ver proyecto
              </a>
            )
          )}
        </div>
      </article>
    </div>
  )
}
