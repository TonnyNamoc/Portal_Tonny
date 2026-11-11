import { useLayoutEffect, useRef } from 'react'
import { WEBS } from '../lib/data'
import { gsap, MOV, QUIETO } from '../lib/motion'

/**
 * Escena 4 · noche. Webs de clientes hechas con Shanty Studios.
 * Es el espejo de Proyectos: en escritorio se fija y el carril avanza hacia la derecha
 * (empieza pegado al borde derecho y lo que va entrando viene por la izquierda). En móvil es una columna.
 */
export default function WebsShanty() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add(MOV('(min-width: 1024px)'), () => {
        const t = track.current!
        const distancia = () => t.scrollWidth - window.innerWidth
        gsap
          .timeline({
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
          .to(t, { x: () => distancia() }, 0)
          .fromTo('.webs-titulo', { xPercent: -30 }, { xPercent: 0 }, 0)
          .fromTo('.webs-marca', { left: '100%' }, { left: '0%' }, 0)
      })
      mm.add(QUIETO('(max-width: 1023px)'), () => {
        gsap.utils.toArray<HTMLElement>('.webs-item').forEach((el) =>
          gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } })
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="webs" ref={root} className="mundo-noche relative overflow-hidden lg:h-[100svh]">
      <div
        className="webs-titulo display pointer-events-none absolute right-0 top-[10%] hidden whitespace-nowrap text-[22vw] select-none lg:block"
        aria-hidden="true"
        style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(200,212,90,0.35)' }}
      >
        Shanty Studios · Shanty Studios
      </div>

      <div
        ref={track}
        className="relative z-10 flex flex-col items-center gap-14 gutter py-28 lg:absolute lg:inset-y-0 lg:right-0 lg:w-max lg:flex-row-reverse lg:items-center lg:gap-[8vw] lg:py-0 lg:pl-[12vw] lg:pr-[8vw]"
      >
        <div className="webs-item grid max-w-[400px] gap-5 self-start lg:self-center">
          <span className="eyebrow text-niebla">Escena 04 · Shanty Studios</span>
          <h2 className="display text-[clamp(56px,8vw,124px)] text-cal">
            Webs hechas con <br />
            <span style={{ color: 'var(--totora)' }}>Shanty Studios</span>
          </h2>
          <p className="text-niebla">
            Páginas para marcas reales, hechas junto a Shanty Studios. Están en línea: ábrelas y navégalas.
          </p>
          <span className="mono hidden text-xs uppercase tracking-[0.2em] text-niebla lg:block" aria-hidden="true">
            <span style={{ color: 'var(--totora)' }}>←</span> Sigue bajando
          </span>
        </div>

        {WEBS.map((w, i) => (
          <div key={w.nombre} className={`webs-item ${i % 2 ? 'lg:-translate-y-[7vh]' : 'lg:translate-y-[6vh]'}`}>
            <a href={w.url} target="_blank" rel="noreferrer" className="web-card group grid w-[min(86vw,560px)] gap-4">
              <div className="web-marco">
                <div className="flex items-center gap-1.5 px-3 py-2.5" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-white/25" />
                  <span className="h-2 w-2 rounded-full bg-white/25" />
                  <span className="h-2 w-2 rounded-full bg-white/25" />
                  <span className="mono ml-3 truncate text-[10px] text-white/40">{w.url.replace('https://', '').replace(/\/$/, '')}</span>
                </div>
                <div className="overflow-hidden">
                  <img
                    src={w.img}
                    alt={`Portada de la web de ${w.nombre}`}
                    width={1200}
                    height={750}
                    loading="lazy"
                    className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </div>
              </div>
              <div className="flex items-end justify-between gap-4">
                <div className="grid gap-1">
                  <span className="eyebrow" style={{ color: 'var(--totora)' }}>
                    {String(i + 1).padStart(2, '0')} · {w.rubro}
                  </span>
                  <h3 className="display text-[40px] text-cal">{w.nombre}</h3>
                </div>
                <span className="proyecto-ver shrink-0">
                  Ver web <span aria-hidden="true">↗</span>
                </span>
              </div>
            </a>
          </div>
        ))}

        <div className="webs-item grid max-w-[320px] gap-4">
          <span className="eyebrow text-niebla">¿Tu marca necesita una?</span>
          <p className="display text-[52px] text-cal">Hagamos la siguiente</p>
          <a className="btn justify-self-start" href="#contacto">
            Escríbeme
          </a>
        </div>
      </div>

      {/* Barra de avance: la marca va de derecha a izquierda */}
      <div className="absolute inset-x-0 bottom-8 z-10 hidden gutter lg:block" aria-hidden="true">
        <div className="relative border-t border-white/20">
          <span className="webs-marca absolute -top-[5px] h-[9px] w-[9px] -translate-x-1/2 rounded-full" style={{ background: 'var(--totora)' }} />
        </div>
      </div>
    </section>
  )
}
