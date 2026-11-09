import { useRef } from 'react'
import type { Proyecto } from '../lib/data'
import { gsap } from '../lib/motion'

/** Tarjeta de proyecto. Toda la tarjeta abre el caso; el botón "Ver caso" lo hace accesible con teclado. */
export default function ProyectoCard({ p, n, delay = 0, alAbrir }: { p: Proyecto; n: number; delay?: number; alAbrir: () => void }) {
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
        onClick={alAbrir}
        className="proyecto group grid aspect-[3/4] w-[min(82vw,380px)] cursor-pointer content-between p-6"
      >
        <div className="proyecto-relieve" aria-hidden="true" />
        <div className="relative z-[3] flex items-start justify-between gap-4">
          <span className="proyecto-num display" aria-hidden="true">
            {String(n).padStart(2, '0')}
          </span>
          {p.codigoPrivado && <span className="etiqueta-cinta">Código privado</span>}
        </div>
        <div className="relative z-[3] grid gap-3">
          <span className="eyebrow" style={{ color: 'var(--pacifico-claro)' }}>
            {p.ciclo}
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
          <button
            type="button"
            className="proyecto-ver mt-2"
            onClick={(e) => {
              e.stopPropagation()
              alAbrir()
            }}
            aria-label={`Ver caso: ${p.titulo}`}
          >
            Ver caso <span aria-hidden="true">→</span>
          </button>
        </div>
      </article>
    </div>
  )
}
