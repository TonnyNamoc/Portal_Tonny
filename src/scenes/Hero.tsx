import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion, scrollToId } from '../lib/motion'

const VIDEO = { mp4: '/video/codigo.mp4', webm: '/video/codigo.webm', poster: '/video/codigo.jpg' }

function Video({ className }: { className?: string }) {
  return (
    <video className={`hero-video ${className ?? ''}`} autoPlay muted loop playsInline preload="auto" poster={VIDEO.poster} aria-hidden="true">
      <source src={VIDEO.webm} type="video/webm" />
      <source src={VIDEO.mp4} type="video/mp4" />
    </video>
  )
}

/** El nombre con la misma caja en ambas capas para que las letras coincidan al píxel. */
function Nombre({ letras = false }: { letras?: boolean }) {
  return (
    <>
      {['Tonny', 'Namoc'].map((palabra, w) => (
        <span key={palabra} className="inline-flex overflow-hidden max-sm:flex max-sm:justify-center">
          {palabra.split('').map((c, i) => (
            <span key={i} className={`${letras ? 'hero-letra' : ''} inline-block`}>
              {c}
            </span>
          ))}
          {w === 0 && <span className="inline-block max-sm:hidden">&nbsp;</span>}
        </span>
      ))}
    </>
  )
}

/**
 * Escena 1 · noche.
 * Un video de código escribiéndose de fondo, desenfocado bajo una capa casi negra, con el
 * nombre encima. Al hacer scroll el fondo se apaga y el video queda dentro de las letras.
 */
export default function Hero({ listo }: { listo: boolean }) {
  const root = useRef<HTMLElement>(null)

  // Mantiene los dos videos sincronizados; con movimiento reducido se quedan en pausa
  useEffect(() => {
    const vids = Array.from(root.current!.querySelectorAll<HTMLVideoElement>('video'))
    if (prefersReducedMotion()) {
      vids.forEach((v) => v.pause())
      return
    }
    const [a, b] = vids
    const sync = () => {
      if (Math.abs(a.currentTime - b.currentTime) > 0.15) b.currentTime = a.currentTime
    }
    a.addEventListener('seeked', sync)
    const id = window.setInterval(sync, 2000)
    return () => {
      a.removeEventListener('seeked', sync)
      window.clearInterval(id)
    }
  }, [])

  // El video entra en las letras al hacer scroll
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: { trigger: root.current, start: 'top top', end: '+=140%', scrub: 0.6, pin: true },
          })
          .to('.scroll-hint-wrap', { opacity: 0, duration: 0.1 }, 0)
          .fromTo('.hero-calado', { opacity: 0 }, { opacity: 1, duration: 0.45 }, 0.05)
          .fromTo('.hero-calado .hero-video', { scale: 1.35 }, { scale: 1, duration: 0.7 }, 0)
          .to('.hero-nombre-solido', { opacity: 0, duration: 0.35 }, 0.1)
          .to('.hero-fondo', { opacity: 0, duration: 0.45 }, 0.15)
          .fromTo('.hero-nombre-caja', { scale: 1.06 }, { scale: 0.94, duration: 1 }, 0)
          .fromTo('.hero-side', { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.3 }, 0.55)
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

  const tipografia = 'display text-center leading-[0.82] text-[clamp(64px,15vw,280px)] max-sm:text-[27vw]'

  return (
    <section id="inicio" ref={root} className="mundo-noche relative h-[100svh] min-h-[560px] overflow-hidden">
      {/* Fondo: video desenfocado bajo una capa casi negra */}
      <div className="hero-fondo absolute inset-0" aria-hidden="true">
        <Video className="scale-110 blur-[6px]" />
        <div className="absolute inset-0" style={{ background: 'rgba(10,13,18,0.8)' }} />
      </div>

      <div className="hero-nombre-caja absolute inset-0">
        {/* Capa calada: el video solo se ve dentro de las letras */}
        <div className="hero-calado absolute inset-0 opacity-0 [isolation:isolate]" aria-hidden="true">
          <Video />
          <div className="absolute inset-0 grid place-items-center gutter bg-black text-white mix-blend-multiply">
            <p className={tipografia}>
              <Nombre />
            </p>
          </div>
          {/* Sube el negro al tono noche y da a las letras una base azul para que se lean */}
          <div className="absolute inset-0 grid place-items-center gutter mix-blend-lighten" style={{ background: 'var(--noche)', color: '#1F3F9A' }}>
            <p className={tipografia}>
              <Nombre />
            </p>
          </div>
        </div>

        {/* Nombre sólido del inicio */}
        <div className="absolute inset-0 grid place-items-center gutter">
          <h1 className={`hero-nombre-solido text-cal ${tipografia}`}>
            <span className="sr-only">Tonny Namoc</span>
            <span aria-hidden="true">
              <Nombre letras />
            </span>
          </h1>
        </div>
      </div>

      {/* Textos satélite */}
      <p className="hero-side eyebrow absolute left-0 top-[96px] max-w-[240px] gutter text-niebla normal-case tracking-[0.06em] leading-relaxed">
        Desarrollador de software en formación en TECSUP, creando experiencias web con calidad y propósito.
      </p>
      <p className="hero-side eyebrow absolute right-0 top-[96px] hidden md:block gutter text-right text-niebla">
        Trujillo, Perú
        <br />
        8.11° S · 79.03° O
      </p>
      <p className="hero-side eyebrow absolute inset-x-0 bottom-[12%] gutter text-center text-niebla">
        Código · Diseño · Trujillo
      </p>

      <button
        className="scroll-hint-wrap absolute bottom-6 right-0 z-30 gutter hidden md:flex items-center gap-2 eyebrow text-niebla bg-transparent border-0 cursor-pointer"
        onClick={() => scrollToId('perfil')}
      >
        Scroll <span className="scroll-hint inline-block">↓</span>
      </button>
    </section>
  )
}
