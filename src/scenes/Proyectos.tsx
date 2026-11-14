import { useLayoutEffect, useRef, useState } from 'react'
import Panel from '../components/Panel'
import ProyectoCard from '../components/ProyectoCard'
import { CICLOS, CONTACTO, PROYECTOS } from '../lib/data'
import { gsap, MOV, QUIETO } from '../lib/motion'

/**
 * Escena 3 · noche. En escritorio se fija y el scroll vertical mueve el carril en horizontal,
 * sobre el eje de ciclos (como las yardas de un campo). En móvil es una columna.
 */
export default function Proyectos() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  // Índice del caso abierto, o null
  const [caso, setCaso] = useState<number | null>(null)
  const p = caso === null ? null : PROYECTOS[caso]

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add(MOV('(min-width: 1024px)'), () => {
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
      mm.add(QUIETO('(max-width: 1023px)'), () => {
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
        className="proy-carril relative z-10 flex flex-col items-center gap-14 gutter py-28 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-[10vw] lg:py-0 lg:pl-[8vw] lg:pr-[12vw]"
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
            Proyectos académicos de TECSUP y una startup. Abre cada uno para ver qué es y qué hice. El código es privado
            por ahora; si quieres verlo, te lo muestro.
          </p>
        </div>

        {PROYECTOS.map((p, i) => (
          <div key={p.titulo} className={`proy-item ${i % 2 ? 'lg:translate-y-[8vh]' : 'lg:-translate-y-[6vh]'}`}>
            <ProyectoCard p={p} n={i + 1} delay={-i * 2.3} alAbrir={() => setCaso(i)} />
          </div>
        ))}

        <div className="proy-item grid max-w-[340px] gap-4">
          <span className="eyebrow text-niebla">Próximamente</span>
          <p className="display text-[56px] text-cal">Más proyectos en camino</p>
        </div>
      </div>

      {/* Eje de ciclos */}
      <div className="eje absolute inset-x-0 bottom-8 z-10 hidden gutter lg:block" aria-hidden="true">
        <div className="relative grid grid-cols-4 border-t border-white/20 pt-3">
          {CICLOS.map((c) => (
            <span key={c} className="display text-[48px] text-white/15 [&:not(:first-child)]:border-l [&:not(:first-child)]:border-white/10 [&:not(:first-child)]:pl-3">
              {c}
            </span>
          ))}
          <span className="eje-marca absolute -top-[5px] h-[9px] w-[9px] -translate-x-1/2 rounded-full" style={{ background: 'var(--pacifico)' }} />
        </div>
      </div>

      <Panel abierto={p !== null} alCerrar={() => setCaso(null)} etiqueta={p ? `Caso: ${p.titulo}` : 'Caso'}>
        {p && caso !== null && (
          <div key={caso} className="caso grid gap-8">
            <header className="grid gap-4">
              <span className="eyebrow" style={{ color: 'var(--pacifico-claro)' }}>
                Caso {String(caso + 1).padStart(2, '0')} de {String(PROYECTOS.length).padStart(2, '0')} · {p.ciclo}
              </span>
              <h3 className="display text-[clamp(44px,6vw,72px)] text-cal">{p.titulo}</h3>
              <p className="text-lg leading-relaxed text-cal/90">{p.queEs}</p>
            </header>

            <section className="grid gap-3">
              <h4 className="eyebrow text-niebla">{p.participacion ? 'En qué participé' : 'Lo que hice'}</h4>
              <ol className="grid">
                {p.hice.map((h, i) => (
                  <li key={h} className="grid grid-cols-[2.5rem_1fr] items-baseline border-t border-white/10 py-3.5 last:border-b">
                    <span className="mono text-xs" style={{ color: 'var(--totora)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="grid gap-3">
              <h4 className="eyebrow text-niebla">Hecho con</h4>
              <ul className="flex flex-wrap gap-2">
                {p.stack.map((s) => (
                  <li key={s} className="mono rounded-full bg-white/10 px-3 py-1.5 text-xs text-cal">
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            <section className="caso-nota grid gap-4">
              {p.codigoPrivado ? (
                <>
                  <p className="text-sm leading-relaxed text-niebla">
                    <span className="etiqueta-cinta mr-2 align-middle">Código privado</span>
                    El repositorio todavía no es público. Si quieres verlo o que te lo explique en una llamada, escríbeme.
                  </p>
                  <a className="btn justify-self-start" href={`mailto:${CONTACTO.correo}?subject=${encodeURIComponent(`Quiero ver el proyecto ${p.titulo}`)}`}>
                    Pedir una demo
                  </a>
                </>
              ) : (
                p.enlace && (
                  <a className="btn justify-self-start" href={p.enlace} target="_blank" rel="noreferrer">
                    Ver proyecto
                  </a>
                )
              )}
            </section>

            <nav className="flex items-center justify-between gap-4 border-t border-white/10 pt-5" aria-label="Otros casos">
              <button type="button" className="caso-nav" onClick={() => setCaso((caso - 1 + PROYECTOS.length) % PROYECTOS.length)}>
                <span aria-hidden="true">←</span> Anterior
              </button>
              <button type="button" className="caso-nav text-right" onClick={() => setCaso((caso + 1) % PROYECTOS.length)}>
                {PROYECTOS[(caso + 1) % PROYECTOS.length].titulo} <span aria-hidden="true">→</span>
              </button>
            </nav>
          </div>
        )}
      </Panel>
    </section>
  )
}
