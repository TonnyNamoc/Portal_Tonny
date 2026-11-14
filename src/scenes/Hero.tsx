import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion, scrollToId, MOV, QUIETO } from '../lib/motion'

const VIDEO = { mp4: '/video/codigo.mp4', webm: '/video/codigo.webm', poster: '/video/codigo.jpg' }
const FOTO = '/img/tonny.webp'
const MASCARA = '/img/lentes-mascara.png'

// Medidas en píxeles de la foto original (1122 × 1402)
const IMG = { w: 1122, h: 1402 }
// Recorte de la máscara de los lentes dentro de la foto
const LENTES = { x: 372, y: 412, w: 369, h: 131 }
// Lente izquierdo: centro y medio ancho/alto útil (sin las esquinas redondeadas)
const LENTE = { cx: 466, cy: 478, rx: 78, ry: 50 }

/**
 * Escena 1 · noche.
 * Arranca con el video de código a pantalla completa y la firma (nombre y rol) encima. Al hacer scroll la cámara se aleja:
 * el video se encoge hasta quedar dentro de los lentes de la foto y, cuando ya se te ve
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

    // Coloca la máscara de los lentes sobre la foto; m = 0 cubre la pantalla, m = 1 queda en los lentes
    const colocar = () => {
      // Coordenadas relativas a la sección, para que sigan valiendo cuando deja de estar fija
      const r = foto.getBoundingClientRect()
      const base = sec.getBoundingClientRect()
      const k = r.width / IMG.w
      const cx = r.left - base.left + LENTE.cx * k
      const cy = r.top - base.top + LENTE.cy * k
      const vw = window.innerWidth
      const vh = window.innerHeight
      const s0 = Math.max(cx / (LENTE.rx * k), (vw - cx) / (LENTE.rx * k), cy / (LENTE.ry * k), (vh - cy) / (LENTE.ry * k)) * 1.05
      const s = Math.pow(s0, 1 - zoom.m) // zoom en escala logarítmica: se siente parejo
      const w = LENTES.w * k * s
      const h = LENTES.h * k * s
      const x = cx + (LENTES.x - LENTE.cx) * k * s
      const y = cy + (LENTES.y - LENTE.cy) * k * s
      video.style.setProperty('--mw', `${w}px`)
      video.style.setProperty('--mh', `${h}px`)
      video.style.setProperty('--mx', `${x}px`)
      video.style.setProperty('--my', `${y}px`)
    }

    const ctx = gsap.context(() => {
      gsap.set(foto, { xPercent: -50, transformOrigin: `${(LENTE.cx / IMG.w) * 100}% ${(LENTE.cy / IMG.h) * 100}%` })
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
          .fromTo(foto, { scale: 1.9 }, { scale: 1, duration: 0.6, ease: 'power1.inOut' }, 0)
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
        <span className="sr-only">Tonny Namoc, desarrollador web y de software</span>
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
          WebkitMaskImage: `url(${MASCARA})`,
          maskImage: `url(${MASCARA})`,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: 'var(--mw) var(--mh)',
          maskSize: 'var(--mw) var(--mh)',
          WebkitMaskPosition: 'var(--mx) var(--my)',
          maskPosition: 'var(--mx) var(--my)',
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
