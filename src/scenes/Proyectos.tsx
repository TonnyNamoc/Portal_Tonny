import { useLayoutEffect, useRef } from 'react'
import ProyectoCard from '../components/ProyectoCard'
import { CICLOS, PROYECTOS } from '../lib/data'
import { gsap } from '../lib/motion'

/**
 * Escena 3 · noche. En escritorio se fija y el scroll vertical mueve el carril en horizontal,
 * sobre el eje de ciclos (como las yardas de un campo). En móvil es una columna.
 */
export default function Proyectos() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const t = track.current!
        const distancia = () => t.scrollWidth - window.innerWidth
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distancia()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        tl.to(t, { x: () => -distancia() }, 0)
          .fromTo('.proy-titulo', { xPercent: 0 }, { xPercent: -30 }, 0)
          .fromTo('.eje-marca', { left: '0%' }, { left: '100%' }, 0)
      })
      mm.add('(max-width: 1023px), (prefers-reduced-motion: reduce)', () => {
        gsap.utils.toArray<HTMLElement>('.proy-item').forEach((el) =>
          gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="proyectos" ref={root} className="mundo-noche relative overflow-hidden lg:h-[100svh]">
      <div
        className="proy-titulo display pointer-events-none absolute left-0 top-[10%] whitespace-nowrap text-[22vw] select-none hidden lg:block"
        aria-hidden="true"
        style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(46,107,255,0.45)' }}
      >
        Proyectos · Proyectos
      </div>

      <div
        ref={track}
        className="relative z-10 flex flex-col items-center gap-14 gutter py-28 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-[10vw] lg:py-0 lg:pl-[8vw] lg:pr-[12vw]"
      >
        <div className="proy-item grid max-w-[380px] gap-5 self-start lg:self-center">
          <span className="eyebrow text-niebla">Escena 03 · Proyectos</span>
          <h2 className="display text-[clamp(64px,9vw,140px)] text-cal">
            Lo que <br />
            <span className="text-pacifico" style={{ color: 'var(--pacifico)' }}>
              construí
            </span>
          </h2>
          <p className="text-niebla">
            Proyectos académicos de TECSUP y una startup. Su código no está publicado por ahora, así que van con cinta de
            peligro hasta que los suba.
          </p>
        </div>

        {PROYECTOS.map((p, i) => (
          <div key={p.titulo} className={`proy-item ${i % 2 ? 'lg:translate-y-[8vh]' : 'lg:-translate-y-[6vh]'}`}>
            <ProyectoCard p={p} delay={-i * 2.3} />
          </div>
        ))}

        <div className="proy-item grid max-w-[340px] gap-4">
          <span className="eyebrow text-niebla">Próximamente</span>
          <p className="display text-[56px] text-cal">Más proyectos en camino</p>
        </div>
      </div>

      {/* Eje de ciclos */}
      <div className="absolute inset-x-0 bottom-8 z-10 hidden gutter lg:block" aria-hidden="true">
        <div className="relative grid grid-cols-4 border-t border-white/20 pt-3">
          {CICLOS.map((c) => (
            <span key={c} className="display text-[48px] text-white/15 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-white/10 [&:not(:first-child)]:pl-3">
              {c}
            </span>
          ))}
          <span className="eje-marca absolute -top-[5px] h-[9px] w-[9px] -translate-x-1/2 rounded-full" style={{ background: 'var(--pacifico)' }} />
        </div>
      </div>
    </section>
  )
}
