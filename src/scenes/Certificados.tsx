import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CERTIFICADOS } from '../lib/data'
import { gsap, prefersReducedMotion, ScrollTrigger } from '../lib/motion'

// La rueda repite los certificados para llenar el círculo
const VUELTAS = 3
const RANURAS = CERTIFICADOS.length * VUELTAS
const PASO = 360 / RANURAS
const BASE = -2.5 // grados por segundo cuando gira sola (una tarjeta cada ~12 s)

/**
 * Escena 6 · noche. Los certificados van en una rueda de tarjetas cuyo centro queda debajo
 * de la pantalla. Gira sola, se acelera con el scroll y se puede arrastrar. La marca ▲
 * señala el certificado que está arriba.
 */
export default function Certificados() {
  const root = useRef<HTMLElement>(null)
  const escenario = useRef<HTMLDivElement>(null)
  const rueda = useRef<HTMLDivElement>(null)
  const dial = useRef<HTMLDivElement>(null)
  const [activo, setActivo] = useState(0)
  const totalHoras = CERTIFICADOS.reduce((t, c) => t + c.horas, 0)

  // Estado de la rueda fuera de React para no re-renderizar en cada cuadro
  const giro = useRef({ angulo: 0, vel: BASE, arrastrando: false, movido: 0, visible: false, auto: true })

  // Medidas según el ancho de pantalla
  useLayoutEffect(() => {
    const medir = () => {
      const vw = window.innerWidth
      const R = vw < 640 ? vw * 0.95 : Math.min(vw * 0.5, 720)
      const cw = vw < 640 ? Math.min(R * 0.5, 200) : R * 0.4
      const ch = cw * (612 / 792)
      const alto = R * 0.78 + ch / 2 + 48
      const el = escenario.current!
      el.style.setProperty('--R', `${R}px`)
      el.style.setProperty('--cw', `${cw}px`)
      el.style.setProperty('--ch', `${ch}px`)
      el.style.height = `${alto}px`
      el.style.setProperty('--cy', `${alto + R * 0.22}px`)
    }
    medir()
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [])

  // Animación: gira sola, acelera con el scroll, arrastre con inercia
  useEffect(() => {
    const g = giro.current
    const quieto = prefersReducedMotion()
    if (quieto) g.vel = 0
    g.auto = !quieto

    const aplicar = () => {
      rueda.current!.style.transform = `rotate(${g.angulo}deg)`
      dial.current!.style.transform = `rotate(${-g.angulo * 0.5}deg)`
      const i = (((Math.round(-g.angulo / PASO) % RANURAS) + RANURAS) % RANURAS) % CERTIFICADOS.length
      setActivo((a) => (a === i ? a : i))
    }

    const tick = (_t: number, dt: number) => {
      if (!g.visible || g.arrastrando) return
      const s = Math.min(dt, 50) / 1000
      // la velocidad vuelve poco a poco a la de crucero
      const objetivo = g.auto ? BASE : 0
      g.vel += (objetivo - g.vel) * Math.min(1, s * 2.5)
      g.angulo += g.vel * s
      aplicar()
    }
    gsap.ticker.add(tick)

    const st = ScrollTrigger.create({
      trigger: escenario.current,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (g.visible = self.isActive),
      onUpdate: (self) => {
        if (quieto) return
        g.vel = gsap.utils.clamp(-20, 20, g.vel - self.getVelocity() * 0.004)
      },
    })

    // Arrastre con mouse o dedo
    const el = escenario.current!
    let x0 = 0
    let ultimo = 0
    let tUltimo = 0
    const down = (e: PointerEvent) => {
      g.arrastrando = true
      g.movido = 0
      x0 = ultimo = e.clientX
      tUltimo = performance.now()
    }
    const move = (e: PointerEvent) => {
      if (!g.arrastrando) return
      const dx = e.clientX - ultimo
      const ahora = performance.now()
      const R = parseFloat(el.style.getPropertyValue('--R')) || 600
      const dAng = (dx / R) * (180 / Math.PI)
      g.angulo += dAng
      g.vel = gsap.utils.clamp(-30, 30, (dAng / Math.max(1, ahora - tUltimo)) * 1000)
      g.movido = Math.abs(e.clientX - x0)
      ultimo = e.clientX
      tUltimo = ahora
      aplicar()
    }
    const up = () => {
      g.arrastrando = false
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    aplicar()

    return () => {
      gsap.ticker.remove(tick)
      st.kill()
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [])

  // Entrada del título
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
        gsap.fromTo(rueda.current, { '--abre': 0 }, {
          '--abre': 1,
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: { trigger: escenario.current, start: 'top 80%' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // Botones: avanza o retrocede una tarjeta
  const saltar = (dir: 1 | -1) => {
    const g = giro.current
    const destino = (Math.round(g.angulo / PASO) - dir) * PASO
    g.arrastrando = true
    gsap.to(g, {
      angulo: destino,
      duration: 1.2,
      ease: 'power3.inOut',
      onUpdate: () => {
        rueda.current!.style.transform = `rotate(${g.angulo}deg)`
        dial.current!.style.transform = `rotate(${-g.angulo * 0.5}deg)`
        const i = (((Math.round(-g.angulo / PASO) % RANURAS) + RANURAS) % RANURAS) % CERTIFICADOS.length
        setActivo(i)
      },
      onComplete: () => {
        g.arrastrando = false
        g.vel = 0
      },
    })
  }

  const c = CERTIFICADOS[activo]
  const textoDial = `CERTIFICADOS · ${totalHoras} HORAS · PLATZI · SIGO APRENDIENDO · `

  return (
    <section id="certificados" ref={root} className="mundo-noche relative overflow-hidden pt-28 md:pt-40">
      <div className="mx-auto grid max-w-[1400px] items-end gap-8 gutter lg:grid-cols-[1fr_auto]">
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

      {/* Lista accesible (la rueda es decorativa para lectores de pantalla) */}
      <ul className="sr-only">
        {CERTIFICADOS.map((x) => (
          <li key={x.pdf}>
            <a href={x.pdf} target="_blank" rel="noreferrer">
              {x.titulo}, {x.emisor}, {x.fecha}, {x.horas} horas
            </a>
          </li>
        ))}
      </ul>

      {/* Escenario de la rueda */}
      <div ref={escenario} className="cert-escenario relative mt-10 touch-pan-y select-none overflow-hidden cursor-grab active:cursor-grabbing" aria-hidden="true">
        {/* Rueda: el centro queda debajo del borde inferior */}
        <div className="absolute left-1/2" style={{ top: 'var(--cy)' }}>
          <div ref={rueda} className="cert-rueda absolute left-0 top-0" style={{ ['--abre' as string]: 1 }}>
            {Array.from({ length: RANURAS }, (_, i) => {
              const x = CERTIFICADOS[i % CERTIFICADOS.length]
              return (
                <a
                  key={i}
                  href={x.pdf}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={-1}
                  draggable={false}
                  onClick={(e) => giro.current.movido > 6 && e.preventDefault()}
                  className="cert-carta absolute block overflow-hidden rounded-[12px] bg-white shadow-[0_24px_50px_rgba(0,0,0,0.5)]"
                  style={{
                    width: 'var(--cw)',
                    height: 'var(--ch)',
                    left: 'calc(var(--cw) / -2)',
                    top: 'calc(var(--ch) / -2)',
                    transform: `rotate(calc(${i * PASO}deg * var(--abre))) translateY(calc(var(--R) * -1))`,
                  }}
                >
                  <img src={x.img} alt="" draggable={false} loading="lazy" className="pointer-events-none h-full w-full object-cover" />
                </a>
              )
            })}
          </div>

          {/* Dial con texto circular */}
          <div
            className="absolute rounded-full"
            style={{
              width: 'calc(var(--R) * 1.12)',
              height: 'calc(var(--R) * 1.12)',
              left: 'calc(var(--R) * -0.56)',
              top: 'calc(var(--R) * -0.56)',
              background: 'radial-gradient(circle at 50% 30%, #222a37, var(--noche-2) 60%)',
              boxShadow: 'inset 0 1px 0 rgba(243,238,230,0.08), 0 -20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <div ref={dial} className="absolute inset-0">
              <svg viewBox="0 0 200 200" className="h-full w-full">
                <defs>
                  <path id="cert-circulo" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0" />
                </defs>
                <text className="mono" fill="rgba(140,147,163,0.55)" fontSize="6.2">
                  <textPath href="#cert-circulo" textLength="527" lengthAdjust="spacing">
                    {textoDial.repeat(2)}
                  </textPath>
                </text>
                <circle cx="100" cy="100" r="74" fill="none" stroke="rgba(243,238,230,0.06)" />
              </svg>
            </div>
          </div>
        </div>

        {/* Marca ▲ y datos del certificado de arriba */}
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 grid justify-items-center gap-2 gutter text-center">
          <span className="text-[11px]" style={{ color: 'var(--totora)' }}>
            ▲
          </span>
          <p key={activo} className="cert-titulo display max-w-[24ch] text-[clamp(22px,2.6vw,34px)] leading-none text-cal">
            {c.titulo}
          </p>
          <p className="mono text-[11px] uppercase tracking-[0.14em] text-niebla">
            {c.emisor} · {c.modalidad} · {c.fecha} · {c.horas} h
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="relative z-10 flex items-center justify-center gap-4 gutter max-sm:justify-end pb-24 pt-6 md:pb-32">
        <button type="button" className="btn btn-ghost text-cal max-sm:hidden" onClick={() => saltar(-1)} aria-label="Certificado anterior">
          ←
        </button>
        <a className="btn" href={c.pdf} target="_blank" rel="noreferrer">
          Ver certificado
        </a>
        <button type="button" className="btn btn-ghost text-cal max-sm:hidden" onClick={() => saltar(1)} aria-label="Certificado siguiente">
          →
        </button>
      </div>
    </section>
  )
}
