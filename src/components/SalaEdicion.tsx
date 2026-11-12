import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { VIDEOS } from '../lib/data'
import CarruselVideos from './CarruselVideos'
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
  const [carga, setCarga] = useState(0)
  const root = useRef<HTMLDivElement>(null)
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

  if (!fase) return null

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

      {fase === 'sala' && <CarruselVideos alCerrar={cerrar} />}
    </div>
  )
}
