import { useLayoutEffect, useRef } from 'react'
import { CERTIFICADOS } from '../lib/data'
import { gsap } from '../lib/motion'

const GIRO = [-5, 3, -2, 4]

/**
 * Escena 6 · noche. Los certificados caen como hojas sobre la mesa y se acomodan con el scroll.
 * Cada uno abre su PDF original.
 */
export default function Certificados() {
  const root = useRef<HTMLElement>(null)
  const totalHoras = CERTIFICADOS.reduce((t, c) => t + c.horas, 0)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.cert-linea', {
          yPercent: 110,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        })
        gsap.fromTo(
          '.cert',
          { y: 180, opacity: 0, rotate: (i: number) => GIRO[i] * 4 },
          {
            y: 0,
            opacity: 1,
            rotate: (i: number) => GIRO[i],
            ease: 'none',
            stagger: 0.12,
            scrollTrigger: { trigger: '.cert-mesa', start: 'top 95%', end: 'top 35%', scrub: 0.8 },
          }
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="certificados" ref={root} className="mundo-noche relative overflow-hidden gutter py-28 md:py-40">
      <div className="mx-auto grid max-w-[1400px] gap-16">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="grid gap-6">
            <span className="eyebrow text-niebla">Escena 06 · Certificados</span>
            <h2 className="display text-[clamp(64px,10vw,160px)] leading-[0.85] text-cal">
              <span className="block overflow-hidden">
                <span className="cert-linea block">Sigo</span>
              </span>
              <span className="block overflow-hidden">
                <span className="cert-linea block" style={{ color: 'var(--pacifico)' }}>
                  aprendiendo
                </span>
              </span>
            </h2>
          </div>
          <dl className="grid grid-cols-2 gap-8 lg:text-right">
            <div className="grid gap-1">
              <dt className="eyebrow text-niebla">Cursos</dt>
              <dd className="display text-[64px] text-cal tabular-nums">{String(CERTIFICADOS.length).padStart(2, '0')}</dd>
            </div>
            <div className="grid gap-1">
              <dt className="eyebrow text-niebla">Horas</dt>
              <dd className="display text-[64px] text-cal tabular-nums">{totalHoras}</dd>
            </div>
          </dl>
        </div>

        <ul className="cert-mesa grid gap-10 sm:grid-cols-2 xl:grid-cols-4">
          {CERTIFICADOS.map((c, i) => (
            <li key={c.pdf} className="cert" style={{ transform: `rotate(${GIRO[i]}deg)` }}>
              <a
                href={c.pdf}
                target="_blank"
                rel="noreferrer"
                className="group grid gap-4 rounded-[6px] bg-[var(--noche-2)] p-3 pb-5 text-cal no-underline shadow-[0_30px_60px_rgba(0,0,0,0.45)] transition-transform duration-500 [transition-timing-function:var(--ease-revelar)] hover:-translate-y-2 hover:rotate-0"
              >
                <div className="overflow-hidden rounded-[3px] bg-white">
                  <img
                    src={c.img}
                    alt={`Certificado ${c.emisor}: ${c.titulo}`}
                    loading="lazy"
                    className="aspect-[792/612] w-full object-cover transition-transform duration-700 [transition-timing-function:var(--ease-revelar)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="grid gap-2 px-1">
                  <span className="eyebrow" style={{ color: 'var(--totora)' }}>
                    {c.emisor} · {c.modalidad}
                  </span>
                  <h3 className="text-base font-medium leading-snug">{c.titulo}</h3>
                  <div className="mono flex items-center justify-between text-[11px] text-niebla">
                    <span>
                      {c.fecha} · {c.horas} h
                    </span>
                    <span className="transition-colors group-hover:text-cal">Ver PDF ↗</span>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
