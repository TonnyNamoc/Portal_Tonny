import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { VIDEOS } from '../lib/data'
import { gsap, prefersReducedMotion } from '../lib/motion'

/**
 * Sala secreta, versión carrusel: cada video en su tarjeta, en un carrusel 3D rojo (tipo coverflow).
 * Se cambia con las flechas, la rueda, el teclado (← →), deslizando en el celular o tocando una tarjeta de al lado.
 * Solo la tarjeta del centro se reproduce.
 */
export default function CarruselVideos({ alCerrar }: { alCerrar: () => void }) {
  const [i, setI] = useState(0)
  const [sonido, setSonido] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const tarjetas = useRef<(HTMLDivElement | null)[]>([])
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const n = VIDEOS.length
  const quieto = prefersReducedMotion()

  const ir = useCallback((d: number) => setI((x) => (x + d + n) % n), [n])

  // Coloca cada tarjeta según su distancia a la del centro
  const colocar = useCallback(
    (activa: number, dur: number) => {
      const ancho = window.innerWidth < 768 ? window.innerWidth * 0.52 : Math.min(360, window.innerWidth * 0.22)
      tarjetas.current.forEach((el, k) => {
        if (!el) return
        // Distancia más corta en un carrusel circular
        let d = k - activa
        if (d > n / 2) d -= n
        if (d < -n / 2) d += n
        const a = Math.abs(d)
        gsap.to(el, {
          x: d * ancho * 0.82,
          z: -a * 260,
          rotateY: -d * 42,
          scale: a === 0 ? 1 : 0.86,
          opacity: a > 1.5 ? 0 : a === 0 ? 1 : 0.55,
          filter: a === 0 ? 'brightness(1)' : 'brightness(0.55) saturate(0.7)',
          zIndex: 10 - a,
          duration: quieto ? 0 : dur,
          ease: 'expo.out',
        })
      })
      gsap.to('.carr-fondo-texto', { xPercent: -8 * activa, duration: quieto ? 0 : 1.4, ease: 'expo.out' })
    },
    [n, quieto]
  )

  // Entrada: las tarjetas llegan girando desde la derecha
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!quieto) {
        gsap.fromTo('.carr-cortina', { scaleX: 1 }, { scaleX: 0, transformOrigin: 'right center', duration: 0.9, ease: 'expo.inOut' })
        gsap.from('.carr-info > *', { y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: 'expo.out', delay: 0.4 })
        tarjetas.current.forEach((el) =>
          el && gsap.set(el, { x: window.innerWidth * 0.8, rotateY: -70, z: -400, opacity: 0 })
        )
      }
    }, root)
    const t = window.setTimeout(() => colocar(0, 1.6), quieto ? 0 : 450)
    return () => {
      ctx.revert()
      window.clearTimeout(t)
    }
  }, [colocar, quieto])

  useEffect(() => {
    colocar(i, 1.1)
    // Solo suena y se mueve la del centro
    videos.current.forEach((v, k) => {
      if (!v) return
      if (k === i) {
        v.muted = !sonido
        v.play().catch(() => {
          v.muted = true
          setSonido(false)
          v.play().catch(() => {})
        })
      } else {
        v.pause()
      }
    })
  }, [i, sonido, colocar])

  // Teclado, rueda y gesto de deslizar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') ir(1)
      if (e.key === 'ArrowLeft') ir(-1)
    }
    let bloqueo = 0
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(delta) < 12 || Date.now() < bloqueo) return
      bloqueo = Date.now() + 650
      ir(delta > 0 ? 1 : -1)
    }
    let x0: number | null = null
    const onDown = (e: PointerEvent) => (x0 = e.clientX)
    const onUp = (e: PointerEvent) => {
      if (x0 === null) return
      const dx = e.clientX - x0
      x0 = null
      if (Math.abs(dx) > 45) ir(dx < 0 ? 1 : -1)
    }
    const el = root.current!
    window.addEventListener('keydown', onKey)
    el.addEventListener('wheel', onWheel, { passive: true })
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointerup', onUp)
    const onResize = () => colocar(i, 0)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointerup', onUp)
      window.removeEventListener('resize', onResize)
    }
  }, [ir, colocar, i])

  // Inclinación suave de la tarjeta del centro con el cursor
  const inclinar = (e: React.PointerEvent<HTMLDivElement>, k: number) => {
    if (k !== i || e.pointerType !== 'mouse' || quieto) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    gsap.to(e.currentTarget.firstElementChild, { rotateY: x * 14, rotateX: -y * 14, duration: 0.4, ease: 'power2.out' })
  }
  const soltar = (e: React.PointerEvent<HTMLDivElement>) =>
    gsap.to(e.currentTarget.firstElementChild, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'expo.out' })

  const v = VIDEOS[i]

  return (
    <div ref={root} className="carr relative h-full select-none overflow-hidden">
      {/* Palabra gigante de fondo que se desplaza al cambiar de video */}
      <div className="carr-fondo-texto display pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-[30vw] leading-none" aria-hidden="true">
        Edición · Edición · Edición
      </div>

      <header className="relative z-20 flex items-center justify-between gap-4 p-4 md:p-6">
        <span className="mono flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/80">
          <span className="carr-rec h-2.5 w-2.5 rounded-full bg-white" aria-hidden="true" /> Rec · nueva skill en desarrollo
        </span>
        <button type="button" className="sala-cerrar mono text-xs uppercase tracking-[0.2em]" onClick={alCerrar} aria-label="Cerrar y volver a la web">
          Salir ✕
        </button>
      </header>

      <div className="absolute inset-0 grid grid-rows-[1fr_auto] pt-16 md:grid-cols-[minmax(260px,0.8fr)_1.6fr] md:grid-rows-1 md:pt-0">
        {/* Texto del video del centro */}
        <div className="carr-info relative z-20 order-2 grid content-end gap-3 p-5 pb-8 md:order-1 md:content-center md:p-12" aria-live="polite">
          <span className="eyebrow text-white/70">Edición de video · {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          <h2 className="display text-[clamp(44px,6vw,92px)] leading-[0.9]">{v.titulo}</h2>
          <p className="mono text-xs uppercase tracking-[0.2em] text-white/70">{v.tipo}</p>
          <ul className="flex flex-wrap gap-2">
            {v.tags.map((t) => (
              <li key={t} className="mono rounded-full bg-black/25 px-3 py-1.5 text-[11px]">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button type="button" className="carr-flecha" onClick={() => ir(-1)} aria-label="Video anterior">
              ←
            </button>
            <button type="button" className="carr-flecha" onClick={() => ir(1)} aria-label="Video siguiente">
              →
            </button>
            <button type="button" className="carr-sonido mono text-[11px] uppercase tracking-[0.2em]" onClick={() => setSonido((s) => !s)} aria-pressed={sonido}>
              {sonido ? 'Sonido: sí' : 'Activar sonido'}
            </button>
          </div>
        </div>

        {/* Escenario 3D */}
        <div className="carr-escena relative order-1 md:order-2" style={{ perspective: '1400px' }}>
          <div className="absolute left-1/2 top-1/2" style={{ transformStyle: 'preserve-3d' }}>
            {VIDEOS.map((c, k) => (
              <div
                key={c.src}
                ref={(el) => { tarjetas.current[k] = el }}
                className="carr-tarjeta absolute"
                style={{ transformStyle: 'preserve-3d' }}
                onPointerMove={(e) => inclinar(e, k)}
                onPointerLeave={soltar}
                onClick={() => k !== i && setI(k)}
                role={k === i ? undefined : 'button'}
                aria-label={k === i ? undefined : `Ver ${c.titulo}`}
              >
                <div className="carr-cara">
                  <video
                    ref={(el) => { videos.current[k] = el }}
                    src={c.src}
                    poster={c.poster}
                    muted
                    loop
                    playsInline
                    preload={k === 0 ? 'auto' : 'metadata'}
                    className="h-full w-full object-cover"
                    aria-label={c.titulo}
                  />
                  <span className="carr-brillo" aria-hidden="true" />
                  <span className="display carr-num" aria-hidden="true">
                    {String(k + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Puntos */}
      <div className="absolute bottom-4 right-5 z-20 flex gap-2 md:bottom-8 md:right-8">
        {VIDEOS.map((c, k) => (
          <button
            key={c.src}
            type="button"
            onClick={() => setI(k)}
            aria-label={`Ir a ${c.titulo}`}
            aria-current={k === i}
            className={`h-1.5 rounded-full bg-white transition-all duration-500 ${k === i ? 'w-8' : 'w-1.5 opacity-50'}`}
          />
        ))}
      </div>

      {!quieto && <div className="carr-cortina pointer-events-none absolute inset-0 z-30 bg-black" aria-hidden="true" />}
    </div>
  )
}
