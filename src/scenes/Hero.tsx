import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/motion'
import { scrollToId } from '../lib/motion'
import HeroEditor from '../components/HeroEditor'

/**
 * Escena 1 · adobe.
 * Arranca con un primer plano extremo de la pantalla con código y, al hacer scroll,
 * la cámara se aleja hasta el encuadre completo mientras entran nombre y textos.
 */
export default function Hero({ listo }: { listo: boolean }) {
  const root = useRef<HTMLElement>(null)

  // Zoom out ligado al scroll
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root.current, start: 'top top', end: '+=130%', scrub: 0.6, pin: true },
        })
        tl.fromTo('.hero-frame', { scale: 3.2 }, { scale: 1 }, 0)
          .fromTo('.hero-img', { scale: 1.25 }, { scale: 1 }, 0)
          .fromTo('.hero-ghost', { yPercent: 18, opacity: 0.25 }, { yPercent: 0, opacity: 1 }, 0)
          .fromTo('.hero-side', { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.08 }, 0.45)
          .to('.scroll-hint-wrap', { opacity: 0, duration: 0.15 }, 0)
          // Wipe diagonal: la noche entra cortando el adobe (esquinas a 1.2x y 1.8x)
          .fromTo('.hero-wipe', { '--p': 0 }, { '--p': 1, duration: 0.45 }, 0.85)
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // Entrada del nombre cuando termina la carga
  useLayoutEffect(() => {
    if (!listo) return
    const ctx = gsap.context(() => {
      gsap.from('.hero-letra', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.035 })
    }, root)
    return () => ctx.revert()
  }, [listo])

  const nombre = 'Tonny Namoc'

  return (
    <section id="inicio" ref={root} className="mundo-adobe relative h-[100svh] min-h-[620px] overflow-hidden">
      {/* Nombre calado de fondo */}
      <div
        className="hero-ghost display outline-text absolute inset-x-0 top-[9%] text-center text-adobe-sombra select-none pointer-events-none whitespace-nowrap text-[26vw] leading-[0.8]"
        aria-hidden="true"
      >
        Trujillo
      </div>

      <div className="relative z-10 grid h-full place-items-center gutter">
        <div className="hero-frame relative aspect-[4/3] w-[min(78vw,640px)] overflow-hidden rounded-[10px] shadow-[0_40px_80px_rgba(14,18,24,0.45)] origin-[30%_38%]">
          <div className="hero-img h-full w-full">
            <HeroEditor escribir={listo} />
          </div>
        </div>
      </div>

      {/* Textos satélite */}
      <p className="hero-side eyebrow absolute left-0 top-[96px] max-w-[240px] gutter text-adobe-tinta normal-case tracking-[0.06em] leading-relaxed">
        Desarrollador de software en formación en TECSUP, creando experiencias web con calidad y propósito.
      </p>
      <p className="hero-side eyebrow absolute right-0 top-[96px] hidden md:block gutter text-right text-adobe-tinta">
        Trujillo, Perú
        <br />
        8.11° S · 79.03° O
      </p>

      <h1 className="display absolute inset-x-0 bottom-[4%] z-20 gutter text-center text-cal mix-blend-difference text-[clamp(56px,13vw,210px)]">
        <span className="sr-only">{nombre}</span>
        <span aria-hidden="true" className="inline-flex overflow-hidden">
          {nombre.split('').map((c, i) => (
            <span key={i} className="hero-letra inline-block whitespace-pre">
              {c}
            </span>
          ))}
        </span>
      </h1>

      <button
        className="scroll-hint-wrap absolute bottom-6 right-0 z-30 gutter hidden md:flex items-center gap-2 eyebrow text-adobe-tinta bg-transparent border-0 cursor-pointer"
        onClick={() => scrollToId('perfil')}
      >
        Scroll <span className="scroll-hint inline-block">↓</span>
      </button>

      <div className="hero-wipe mundo-noche absolute inset-0 z-40 pointer-events-none" aria-hidden="true" />
    </section>
  )
}
