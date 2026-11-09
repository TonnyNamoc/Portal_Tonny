import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

type Tok = [string, 'k' | 'p' | 's' | 'n' | 'c' | 'f' | '']

/** Tu "ficha" como código. Cada línea es una lista de tokens [texto, tipo]. */
const LINEAS: Tok[][] = [
  [['// tonny.ts — Trujillo, Perú', 'c']],
  [['const ', 'k'], ['tonny', 'f'], [' = {', 'p']],
  [['  rol', 'p'], [': ', 'p'], ["'Desarrollador de Software'", 's'], [',', 'p']],
  [['  estudia', 'p'], [': ', 'p'], ["'TECSUP'", 's'], [',', 'p']],
  [['  desde', 'p'], [': ', 'p'], ['2023', 'n'], [',', 'p']],
  [['  stack', 'p'], [': [', 'p'], ["'Laravel'", 's'], [', ', 'p'], ["'Java'", 's'], [', ', 'p'], ["'MySQL'", 's'], ['],', 'p']],
  [['  aprendiendo', 'p'], [': [', 'p'], ["'ASP.NET'", 's'], [', ', 'p'], ["'AWS'", 's'], ['],', 'p']],
  [['  disponible', 'p'], [': ', 'p'], ['true', 'n'], [',', 'p']],
  [['}', 'p']],
  [['', '']],
  [['export default ', 'k'], ['tonny', 'f']],
]

const COLOR: Record<Tok[1], string> = {
  k: 'var(--pacifico-claro)',
  p: 'var(--cal)',
  s: 'var(--totora)',
  n: 'var(--peligro)',
  c: 'var(--niebla)',
  f: 'var(--cal)',
  '': 'inherit',
}

/**
 * Ventana de editor dibujada en HTML (sin imagen). Escribe el código carácter a carácter
 * cuando `escribir` pasa a true.
 */
export default function HeroEditor({ escribir }: { escribir: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const chars = el.querySelectorAll<HTMLElement>('.ed-ch')
    if (prefersReducedMotion() || !escribir) {
      gsap.set(chars, { opacity: escribir || prefersReducedMotion() ? 1 : 0 })
      return
    }
    const ctx = gsap.context(() => {
      gsap.set(chars, { opacity: 0 })
      gsap.to(chars, { opacity: 1, duration: 0.01, stagger: 0.018, ease: 'none', delay: 0.4 })
    }, el)
    return () => ctx.revert()
  }, [escribir])

  return (
    <div
      ref={ref}
      className="grid h-full w-full grid-rows-[auto_1fr] overflow-hidden rounded-[10px] text-left"
      style={{ background: 'var(--noche-2)', boxShadow: 'inset 0 0 0 1px rgba(243,238,230,0.08)' }}
      role="img"
      aria-label="Editor de código con la ficha de Tonny: desarrollador de software, estudia en TECSUP desde 2023, stack Laravel, Java y MySQL, disponible."
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <i className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--peligro)' }} />
        <i className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--totora)' }} />
        <i className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--pacifico)' }} />
        <span className="mono ml-3 text-[11px] text-niebla">src/tonny.ts</span>
      </div>
      <pre className="mono overflow-hidden px-4 py-4 text-[clamp(10px,1.35vw,15px)] leading-[1.75]" aria-hidden="true">
        {LINEAS.map((linea, i) => (
          <div key={i} className="flex">
            <span className="w-8 shrink-0 select-none text-right pr-4" style={{ color: 'rgba(140,147,163,0.45)' }}>
              {i + 1}
            </span>
            <span>
              {linea.map(([t, tipo], j) => (
                <span key={j} style={{ color: COLOR[tipo] }}>
                  {t.split('').map((c, k) => (
                    <span key={k} className="ed-ch">
                      {c}
                    </span>
                  ))}
                </span>
              ))}
              {i === LINEAS.length - 1 && <span className="ed-cursor ml-0.5 inline-block w-[0.55em] animate-pulse" style={{ background: 'var(--pacifico)' }}>&nbsp;</span>}
            </span>
          </div>
        ))}
      </pre>
    </div>
  )
}
