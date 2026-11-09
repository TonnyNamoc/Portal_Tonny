import { useLayoutEffect, useRef, useState } from 'react'
import { APRENDIENDO, HABILIDADES } from '../lib/data'
import LogoMarquee from '../components/LogoMarquee'
import { gsap, MOV } from '../lib/motion'

function UsadoEn({ en }: { en: string[] }) {
  if (!en.length) return null
  return (
    <p className="mono text-xs leading-relaxed lg:text-sm" style={{ color: 'var(--adobe-tinta)' }}>
      <span className="opacity-70">Usado en </span>
      {en.join(' · ')}
    </p>
  )
}

/**
 * Escena 4 · adobe. Entra con wipe diagonal y se fija: una tecnología a la vez en grande,
 * ficha a la izquierda y stepper vertical. En móvil, lista simple.
 */
export default function Habilidades() {
  const root = useRef<HTMLElement>(null)
  const [activa, setActiva] = useState(0)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add(MOV(), () => {
        gsap.fromTo(
          root.current,
          { '--p': 0 },
          { '--p': 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top top', scrub: true } }
        )
      })
      mm.add(MOV('(min-width: 1024px)'), () => {
        const items = gsap.utils.toArray<HTMLElement>('.hab-item')
        gsap.set(items.slice(1), { opacity: 0, scale: 0.85, filter: 'blur(14px)' })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.hab-stage',
            start: 'top top',
            end: `+=${(items.length - 1) * 70}%`,
            pin: true,
            scrub: 0.5,
            onUpdate: (self) => setActiva(Math.round(self.progress * (items.length - 1))),
          },
        })
        items.forEach((el, i) => {
          if (i === 0) return
          tl.to(items[i - 1], { opacity: 0, scale: 1.1, filter: 'blur(14px)', duration: 0.5, ease: 'power2.in' }, i - 1 + 0.25)
          tl.to(el, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'expo.out' }, i - 1 + 0.5)
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const h = HABILIDADES[activa]

  return (
    <section id="habilidades" ref={root} className="mundo-adobe wipe-in relative">
      <div className="hab-stage relative overflow-hidden lg:h-[100svh]">
        {/* Escritorio: escenario con una habilidad a la vez */}
        <div className="relative hidden h-full lg:grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_auto] items-center gap-10 gutter lg:px-[6vw]">
          <div className="grid gap-5 self-center pb-16">
            <span className="eyebrow text-adobe-tinta" style={{ color: 'var(--adobe-tinta)' }}>
              {h.categoria}
            </span>
            <h2 className="sr-only">Habilidades</h2>
            <p className="display text-[clamp(72px,9.5vw,168px)] leading-[0.86]">{h.nombre}</p>
            <ul className="grid gap-1.5 text-[clamp(17px,1.5vw,22px)]" style={{ color: 'var(--adobe-tinta)' }}>
              {h.detalles.map((d) => (
                <li key={d}>+ {d}</li>
              ))}
            </ul>
            <UsadoEn en={h.usadoEn} />
          </div>

          <div className="relative grid h-[40vh] place-items-center">
            {HABILIDADES.map((x) => (
              <div key={x.nombre} className="hab-item absolute inset-0 grid place-items-center">
                <div className="flex items-center gap-8">
                  {x.logos.map((l) => (
                    <img key={l} src={l} alt="" className="h-[19vh] max-h-[190px] w-auto drop-shadow-[0_22px_30px_rgba(14,18,24,0.3)]" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <ol className="grid gap-3 self-center" aria-label="Habilidades">
            {HABILIDADES.map((x, i) => (
              <li key={x.nombre} className="flex items-center justify-end gap-3">
                <span className={`eyebrow transition-opacity duration-300 ${i === activa ? 'opacity-100' : 'opacity-0'}`}>{x.nombre}</span>
                <i
                  className="block w-[3px] rounded-full transition-all duration-300"
                  style={{ height: i === activa ? 28 : 10, background: i === activa ? 'var(--noche)' : 'rgba(14,18,24,0.3)' }}
                />
              </li>
            ))}
          </ol>
        </div>

        {/* Móvil: lista */}
        <div className="grid gap-10 gutter pb-10 pt-28 lg:hidden">
          <h2 className="display text-[64px]">Habilidades</h2>
          {HABILIDADES.map((x) => (
            <div key={x.nombre} className="grid grid-cols-[72px_1fr] items-center gap-5">
              <img src={x.logos[0]} alt="" className="h-16 w-auto" />
              <div className="grid gap-1">
                <span className="eyebrow" style={{ color: 'var(--adobe-tinta)' }}>
                  {x.categoria}
                </span>
                <p className="display text-[32px]">{x.nombre}</p>
                <UsadoEn en={x.usadoEn} />
              </div>
            </div>
          ))}
        </div>

        {/* Aprendiendo + marquee de logos */}
        <div className="grid gap-4 pb-8 lg:absolute lg:inset-x-0 lg:bottom-0 lg:pb-6">
          <div className="flex flex-wrap items-center gap-2 gutter">
            <span className="eyebrow mr-2" style={{ color: 'var(--adobe-tinta)' }}>
              Aprendiendo
            </span>
            {APRENDIENDO.map((a) => (
              <span key={a} className="mono rounded-full bg-noche/10 px-3 py-1 text-xs" style={{ background: 'rgba(14,18,24,0.08)' }}>
                {a}
              </span>
            ))}
          </div>
          <LogoMarquee imgClassName="logo-mono" />
        </div>
      </div>
    </section>
  )
}
