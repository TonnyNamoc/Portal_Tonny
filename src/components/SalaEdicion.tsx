import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { VIDEOS } from '../lib/data'
import { gsap, prefersReducedMotion, stopScroll } from '../lib/motion'

/**
 * Easter egg: la sala secreta de edición de video.
 * Se abre con el candado del pie de página, con "skill" en la terminal o tecleando T-O-N-N-Y.
 * Fases: pregunta → carga (línea de tiempo) → sala con los videos.
 */

const EVENTO = 'sala:abrir'
const CLAVE = 'tonny'
const PREGUNTA = '¿ESTÁS LISTO PARA ENTRAR AQUÍ?'

export const abrirSala = () => window.dispatchEvent(new Event(EVENTO))

/** Candado casi invisible del pie de página que abre la sala */
export function Candado() {
  return (
    <button type="button" className="candado" onClick={abrirSala} aria-label="¿Una puerta secreta?" title="¿Qué habrá aquí?">
      <svg width="11" height="12" viewBox="0 0 11 12" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
        <rect x="1" y="5.2" width="9" height="6" rx="1" />
        <path d="M3 5.2V3.6a2.5 2.5 0 0 1 5 0v1.6" />
      </svg>
    </button>
  )
}

type Fase = 'pregunta' | 'carga' | 'sala' | null

const tc = (seg: number) => {
  const s = Math.max(0, seg)
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  const f = Math.floor((s % 1) * 24)
  return `00:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}:${String(f).padStart(2, '0')}`
}

const TOTAL = VIDEOS.reduce((a, v) => a + v.dur, 0)

export default function SalaEdicion() {
  const [fase, setFase] = useState<Fase>(null)
  const [texto, setTexto] = useState('')
  const [actual, setActual] = useState(0)
  const [tiempo, setTiempo] = useState(0)
  const [carga, setCarga] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const volverA = useRef<HTMLElement | null>(null)

  const cerrar = useCallback(() => {
    setFase(null)
    volverA.current?.focus?.()
  }, [])

  // Abrir: evento global + clave T-O-N-N-Y
  useEffect(() => {
    let buffer = ''
    const abrir = () => {
      volverA.current = document.activeElement as HTMLElement
      setFase((f) => f ?? 'pregunta')
    }
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || e.key.length !== 1) return
      buffer = (buffer + e.key.toLowerCase()).slice(-CLAVE.length)
      if (buffer === CLAVE) {
        buffer = ''
        abrir()
      }
    }
    window.addEventListener(EVENTO, abrir)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener(EVENTO, abrir)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  // Bloquea el scroll de la página mientras está abierta; Esc cierra
  useEffect(() => {
    if (!fase) return
    stopScroll(true)
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cerrar()
    window.addEventListener('keydown', onKey)
    return () => {
      stopScroll(false)
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [fase === null, cerrar]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fase 1: tele que se enciende + texto letra por letra
  useLayoutEffect(() => {
    if (fase !== 'pregunta') return
    const quieto = prefersReducedMotion()
    if (quieto) {
      setTexto(PREGUNTA)
      return
    }
    setTexto('')
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo('.sala-tele', { scaleY: 0.004, scaleX: 0.6, filter: 'brightness(4)' }, { scaleY: 0.004, scaleX: 1, duration: 0.18, ease: 'power2.out' })
        .to('.sala-tele', { scaleY: 1, duration: 0.32, ease: 'expo.out' })
        .to('.sala-tele', { filter: 'brightness(1)', duration: 0.4 }, '<')
        .from('.sala-botones > *', { y: 16, opacity: 0, stagger: 0.08, duration: 0.5, ease: 'expo.out' }, PREGUNTA.length * 0.045 + 0.5)
    }, root)
    let i = 0
    const id = window.setInterval(() => {
      i++
      setTexto(PREGUNTA.slice(0, i))
      if (i >= PREGUNTA.length) window.clearInterval(id)
    }, 45)
    const t = window.setTimeout(() => root.current?.querySelector<HTMLButtonElement>('.sala-entrar')?.focus(), 400)
    return () => {
      ctx.revert()
      window.clearInterval(id)
      window.clearTimeout(t)
    }
  }, [fase])

  // Fase 2: "desarrollando nueva skill" con el cabezal recorriendo la línea de tiempo
  useLayoutEffect(() => {
    if (fase !== 'carga') return
    const dur = prefersReducedMotion() ? 0.8 : 3.2
    const estado = { p: 0 }
    const ctx = gsap.context(() => {
      gsap.from('.carga-clip', { scaleX: 0, transformOrigin: 'left center', stagger: 0.06, duration: 0.5, ease: 'expo.out' })
      gsap.to(estado, {
        p: 1,
        duration: dur,
        ease: 'power1.inOut',
        onUpdate: () => setCarga(estado.p),
        onComplete: () => setFase('sala'),
      })
    }, root)
    return () => ctx.revert()
  }, [fase])

  // Fase 3: entra la sala con un corte seco
  useLayoutEffect(() => {
    if (fase !== 'sala' || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .from('.sala-panel', { opacity: 0, y: 20, stagger: 0.08, duration: 0.6, ease: 'expo.out' })
        .from('.sala-clip', { scaleX: 0, transformOrigin: 'left center', stagger: 0.07, duration: 0.5, ease: 'expo.out' }, 0.15)
    }, root)
    return () => ctx.revert()
  }, [fase])

  // Reproduce el clip elegido (con sonido si el navegador deja; si no, silenciado)
  useEffect(() => {
    const v = video.current
    if (fase !== 'sala' || !v) return
    v.muted = false
    v.play().catch(() => {
      v.muted = true
      v.play().catch(() => {})
    })
  }, [fase, actual])

  if (!fase) return null

  const inicioClip = VIDEOS.slice(0, actual).reduce((a, v) => a + v.dur, 0)
  const v = VIDEOS[actual]

  return (
    <div
      ref={root}
      className="sala fixed inset-0 z-[200] overflow-hidden bg-black text-cal"
      role="dialog"
      aria-modal="true"
      aria-label="Sala secreta de edición de video"
    >
      <div className="sala-ruido pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="sala-lineas pointer-events-none absolute inset-0" aria-hidden="true" />

      {fase === 'pregunta' && (
        <div className="sala-tele relative grid h-full place-items-center px-6">
          <div className="grid max-w-[900px] gap-10 text-center">
            <span className="mono text-[11px] uppercase tracking-[0.3em] text-white/50">Canal 404 · Acceso restringido</span>
            <h2 className="sala-pregunta display text-[clamp(44px,8vw,112px)] leading-[0.9]" aria-label={PREGUNTA}>
              <span aria-hidden="true">{texto}</span>
              <span className="sala-cursor" aria-hidden="true" />
            </h2>
            <div className="sala-botones flex flex-wrap justify-center gap-4">
              <button type="button" className="sala-entrar btn" onClick={() => setFase('carga')}>
                Entrar
              </button>
              <button type="button" className="btn btn-ghost" onClick={cerrar}>
                Mejor no
              </button>
            </div>
          </div>
        </div>
      )}

      {fase === 'carga' && (
        <div className="relative grid h-full place-items-center px-6" aria-live="polite">
          <div className="grid w-full max-w-[960px] gap-8">
            <div className="grid gap-2">
              <span className="mono text-xs uppercase tracking-[0.3em]" style={{ color: 'var(--peligro)' }}>
                Desarrollando nueva skill
              </span>
              <p className="display text-[clamp(48px,9vw,128px)] leading-[0.85]">Edición de video</p>
            </div>
            <div className="carga-linea relative grid gap-1.5 rounded-md border border-white/15 bg-white/[0.04] p-3">
              <div className="mono mb-1 flex justify-between text-[11px] text-white/60">
                <span>tonny_skill.prproj</span>
                <span className="tabular-nums" style={{ color: 'var(--peligro)' }}>
                  {tc(carga * TOTAL)}
                </span>
              </div>
              {[
                ['V2', [[0, 22, '#c8d45a'], [30, 18, '#c8d45a'], [62, 26, '#c8d45a']]],
                ['V1', [[0, 34, '#2e6bff'], [36, 28, '#e5484d'], [66, 34, '#2e6bff']]],
                ['A1', [[0, 64, '#3d4a63'], [66, 34, '#3d4a63']]],
              ].map(([pista, clips]) => (
                <div key={pista as string} className="flex items-center gap-2">
                  <span className="mono w-6 text-[10px] text-white/40">{pista as string}</span>
                  <div className="relative h-7 flex-1">
                    {(clips as [number, number, string][]).map(([x, w, c]) => (
                      <span key={x} className="carga-clip absolute inset-y-0 rounded-[3px]" style={{ left: `${x}%`, width: `${w}%`, background: c, opacity: 0.85 }} />
                    ))}
                  </div>
                </div>
              ))}
              <span className="carga-cabezal pointer-events-none absolute bottom-2 top-8" style={{ left: `calc(2.75rem + (100% - 3.5rem) * ${carga})` }} aria-hidden="true" />
            </div>
            <div className="mono flex justify-between text-xs text-white/60">
              <span>Renderizando…</span>
              <span className="tabular-nums">{Math.round(carga * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      {fase === 'sala' && (
        <div className="relative grid h-full grid-rows-[auto_1fr_auto] gap-4 p-4 md:p-6">
          <header className="sala-panel flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#e5484d' }} aria-hidden="true" />
              <h2 className="mono text-xs uppercase tracking-[0.2em] text-white/70">Sala de edición · nueva skill en desarrollo</h2>
            </div>
            <button type="button" className="sala-cerrar mono text-xs uppercase tracking-[0.2em]" onClick={cerrar} aria-label="Cerrar la sala y volver a la web">
              Salir ✕
            </button>
          </header>

          <div className="grid min-h-0 gap-6 md:grid-cols-[1fr_minmax(240px,320px)]">
            <div className="sala-panel relative min-h-[50vh] overflow-hidden rounded-lg bg-white/[0.03] md:min-h-0">
              <video
                key={v.src}
                ref={video}
                src={v.src}
                poster={v.poster}
                controls
                playsInline
                preload="metadata"
                className="absolute inset-2 h-[calc(100%-1rem)] w-[calc(100%-1rem)] object-contain"
                onTimeUpdate={(e) => setTiempo(e.currentTarget.currentTime)}
                onEnded={() => setActual((a) => (a + 1) % VIDEOS.length)}
              />
            </div>
            <aside className="sala-panel hidden content-start gap-4 md:grid">
              <span className="eyebrow" style={{ color: v.color }}>
                Clip {String(actual + 1).padStart(2, '0')} · {v.tipo}
              </span>
              <p className="display text-[44px] leading-none">{v.titulo}</p>
              <ul className="flex flex-wrap gap-2">
                {v.tags.map((t) => (
                  <li key={t} className="mono rounded-full bg-white/10 px-3 py-1.5 text-[11px]">
                    {t}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-white/60">Estoy aprendiendo edición de video. Estos son mis primeros trabajos; elige un clip abajo.</p>
            </aside>
          </div>

          {/* Línea de tiempo: cada clip es un video */}
          <div className="sala-panel grid gap-2 rounded-md border border-white/15 bg-white/[0.04] p-3">
            <div className="mono flex justify-between text-[11px] text-white/60">
              <span className="truncate">{v.titulo}</span>
              <span className="tabular-nums" style={{ color: 'var(--peligro)' }}>
                {tc(inicioClip + tiempo)}
              </span>
            </div>
            <div className="relative flex h-14 gap-1">
              {VIDEOS.map((c, i) => (
                <button
                  key={c.src}
                  type="button"
                  onClick={() => {
                    setTiempo(0)
                    setActual(i)
                  }}
                  aria-label={`Ver ${c.titulo}`}
                  aria-current={i === actual}
                  className={`sala-clip relative overflow-hidden rounded-[4px] text-left ${i === actual ? 'is-activo' : ''}`}
                  style={{ flexGrow: c.dur, flexBasis: 0, background: c.color }}
                >
                  <span
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity"
                    style={{ backgroundImage: `url(${c.poster})`, backgroundSize: 'auto 100%', backgroundRepeat: 'repeat-x' }}
                    aria-hidden="true"
                  />
                  <span className="mono relative z-[1] block truncate px-2 pt-1.5 text-[10px] font-bold uppercase text-black/80">{c.titulo}</span>
                </button>
              ))}
              <span
                className="carga-cabezal pointer-events-none absolute -bottom-1 -top-1"
                style={{ left: `${((inicioClip + tiempo) / TOTAL) * 100}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
