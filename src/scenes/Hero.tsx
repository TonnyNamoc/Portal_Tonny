import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion, scrollToId, MOV, QUIETO } from '../lib/motion'

const VIDEO = { mp4: '/video/codigo.mp4', webm: '/video/codigo.webm', poster: '/video/codigo.jpg' }
const FOTO = '/img/tonny.webp'
const MASCARA = '/img/lentes-mascara.png'

// Medidas en píxeles de la foto original (1122 × 1402)
const IMG = { w: 1122, h: 1402 }
// Recorte de la máscara de los lentes dentro de la foto
const LENTES = { x: 372, y: 412, w: 369, h: 131 }
// Puente entre los dos lentes: el punto hacia donde se cierra el efecto, para que quede simétrico
// Tramo del alejamiento (0 a 1) en el que se cierra el iris
const IRIS = { desde: 0.08, hasta: 0.62 }
const PUENTE = { x: LENTES.x + LENTES.w / 2, y: LENTES.y + LENTES.h / 2 }

/**
 * Escena 1 · noche.
 * Arranca con el video de código a pantalla completa y la firma (nombre y rol) encima. Al hacer scroll la cámara se aleja
 * desde el centro de los lentes: el video se cierra de forma simétrica hasta quedar dentro de los dos lentes y, cuando ya se te ve
 * entero, TONNY NAMOC aparece detrás.
 */
export default function Hero({ listo }: { listo: boolean }) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) root.current?.querySelector('video')?.pause()
  }, [])

  useLayoutEffect(() => {
    const sec = root.current!
    const foto = sec.querySelector<HTMLElement>('.hero-foto')!
    const video = sec.querySelector<HTMLElement>('.hero-lente')!
    const zoom = { m: 1 }

    // Aleja la cámara desde el puente de los lentes. m = 0: muy cerca, el video llena la pantalla;
    // m = 1: la foto entera con el video dentro de los lentes. La foto y la máscara usan la misma
    // escala, así el video nunca se despega de los lentes.
    const colocar = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const k0 = foto.offsetWidth / IMG.w
      // Al empezar, el par de lentes mide 1.5 veces el ancho de la pantalla
      const s0 = Math.max(1, (1.5 * vw) / (LENTES.w * k0))
      const s = Math.pow(s0, 1 - zoom.m) // zoom en escala logarítmica: se siente parejo
      gsap.set(foto, { scale: s })

      // Coordenadas relativas a la sección, para que sigan valiendo cuando deja de estar fija
      const r = foto.getBoundingClientRect()
      const base = sec.getBoundingClientRect()
      const k = r.width / IMG.w
      const bx = r.left - base.left + PUENTE.x * k
      const by = r.top - base.top + PUENTE.y * k
      video.style.setProperty('--mw', `${LENTES.w * k}px`)
      video.style.setProperty('--mh', `${LENTES.h * k}px`)
      video.style.setProperty('--mx', `${r.left - base.left + LENTES.x * k}px`)
      video.style.setProperty('--my', `${r.top - base.top + LENTES.y * k}px`)

      // Iris: un círculo de video centrado en el puente que cubre la pantalla al inicio
      // y se cierra hasta dejar solo los dos lentes
      const lejos = Math.hypot(Math.max(bx, vw - bx), Math.max(by, vh - by))
      const t = Math.min(1, Math.max(0, (zoom.m - IRIS.desde) / (IRIS.hasta - IRIS.desde)))
      const radio = lejos * 1.05 * Math.pow(1 - t, 1.6)
      video.style.setProperty('--bx', `${bx}px`)
      video.style.setProperty('--by', `${by}px`)
      video.style.setProperty('--ir', t >= 1 ? '-40px' : `${radio}px`)
    }

    const ctx = gsap.context(() => {
      gsap.set(foto, { xPercent: -50, transformOrigin: `${(PUENTE.x / IMG.w) * 100}% ${(PUENTE.y / IMG.h) * 100}%` })
      const mm = gsap.matchMedia()
      mm.add(MOV(), () => {
        zoom.m = 0
        gsap
          .timeline({
            defaults: { ease: 'none' },
            onUpdate: colocar,
            scrollTrigger: {
              trigger: sec,
              start: 'top top',
              end: () => (window.innerWidth < 640 ? '+=130%' : '+=160%'),
              invalidateOnRefresh: true,
              scrub: 0.6,
              pin: true,
              onRefresh: colocar,
            },
          })
          .to('.scroll-hint-wrap', { opacity: 0, duration: 0.05 }, 0)
          .to('.hero-firma', { opacity: 0, y: -20, duration: 0.14, ease: 'power1.in' }, 0.04)
          .fromTo(zoom, { m: 0 }, { m: 1, duration: 0.6, ease: 'power1.inOut' }, 0)
          .fromTo('.hero-letra', { yPercent: 110 }, { yPercent: 0, duration: 0.25, stagger: 0.015, ease: 'power3.out' }, 0.55)
          .fromTo('.hero-side', { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.15 }, 0.8)
          .to({}, { duration: 0.1 })
      })
      mm.add(QUIETO(), () => {
        zoom.m = 1
        // Sin animación el nombre grande ya está a la vista
        gsap.set('.hero-firma', { display: 'none' })
      })
    }, sec)

    colocar()
    window.addEventListener('resize', colocar)
    return () => {
      window.removeEventListener('resize', colocar)
      ctx.revert()
    }
  }, [])

  // Pista de scroll cuando termina la carga
  useLayoutEffect(() => {
    if (!listo) return
    const ctx = gsap.context(() => {
      gsap.from('.scroll-hint-wrap', { opacity: 0, y: 16, duration: 0.8, delay: 0.3, ease: 'expo.out' })
      gsap.from('.hero-firma > *', { opacity: 0, y: 24, duration: 0.9, delay: 0.15, stagger: 0.08, ease: 'expo.out' })
    }, root)
    return () => ctx.revert()
  }, [listo])

  return (
    <section id="inicio" ref={root} className="mundo-noche relative h-[100svh] min-h-[560px] overflow-hidden">
      {/* Nombre detrás de la foto */}
      <h1 className="display absolute inset-x-0 top-[30%] text-center leading-[0.8] text-cal text-[19vw] max-sm:top-[24%] max-sm:text-[33vw]">
        <span className="sr-only">Tonny Namoc</span>
        <span aria-hidden="true" className="flex justify-center gap-[0.12em] max-sm:flex-col max-sm:gap-0">
          {['Tonny', 'Namoc'].map((p) => (
            <span key={p} className="inline-flex justify-center overflow-hidden">
              {p.split('').map((c, i) => (
                <span key={i} className="hero-letra inline-block">
                  {c}
                </span>
              ))}
            </span>
          ))}
        </span>
      </h1>

      {/* Foto recortada, anclada abajo */}
      <img
        src={FOTO}
        alt="Silueta de Tonny Namoc con lentes oscuros"
        className="hero-foto pointer-events-none absolute bottom-0 left-1/2 h-[88svh] w-auto max-w-none select-none max-sm:h-[72svh]"
        style={{ aspectRatio: `${IMG.w} / ${IMG.h}` }}
        fetchPriority="high"
        draggable={false}
      />

      {/* Video de código, recortado con la forma de los lentes */}
      <div
        className="hero-lente pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          WebkitMaskImage: `url(${MASCARA}), radial-gradient(circle at var(--bx) var(--by), #000 var(--ir), transparent calc(var(--ir) + 24px))`,
          maskImage: `url(${MASCARA}), radial-gradient(circle at var(--bx) var(--by), #000 var(--ir), transparent calc(var(--ir) + 24px))`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: 'var(--mw) var(--mh), 100% 100%',
          maskSize: 'var(--mw) var(--mh), 100% 100%',
          WebkitMaskPosition: 'var(--mx) var(--my), 0 0',
          maskPosition: 'var(--mx) var(--my), 0 0',
        }}
      >
        <video className="hero-video" autoPlay muted loop playsInline preload="auto" poster={VIDEO.poster}>
          <source src={VIDEO.webm} type="video/webm" />
          <source src={VIDEO.mp4} type="video/mp4" />
        </video>
        {/* Tinte de cristal oscuro */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.08), rgba(14,18,24,0.25) 45%)' }} />
      </div>

      {/* Firma: quién soy desde el primer segundo, antes de que la cámara se aleje */}
      <div className="hero-firma pointer-events-none absolute inset-x-0 bottom-0 z-20 grid gap-2 gutter pb-24 pt-40" aria-hidden="true">
        <span className="eyebrow" style={{ color: 'var(--totora)' }}>
          Portafolio · Trujillo, Perú
        </span>
        <p className="display text-[clamp(56px,9vw,132px)] leading-[0.85] text-cal">Tonny Namoc</p>
        <p className="max-w-[30ch] text-lg text-cal md:text-xl">Desarrollador de software. Soluciones web y de datos.</p>
      </div>

      {/* Textos satélite */}
      <p className="hero-side eyebrow absolute left-0 top-[96px] max-w-[360px] gutter text-niebla normal-case tracking-[0.06em] leading-relaxed">
        Desarrollador de software egresado de TECSUP. Convierto procesos reales de negocio en soluciones web y de datos.
      </p>
      <p className="hero-side eyebrow absolute right-0 top-[96px] hidden md:block gutter text-right text-niebla">
        Trujillo, Perú
        <br />
        8.11° S · 79.03° O
      </p>

      <button
        className="scroll-hint-wrap absolute bottom-6 right-0 z-30 gutter flex items-center gap-2 eyebrow text-cal bg-transparent border-0 cursor-pointer"
        onClick={() => scrollToId('perfil')}
      >
        Scroll <span className="scroll-hint inline-block">↓</span>
      </button>
    </section>
  )
}
