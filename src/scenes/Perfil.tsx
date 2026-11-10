import { useLayoutEffect, useRef } from 'react'
import { FRASE } from '../lib/data'
import { gsap, ScrollTrigger, MOV } from '../lib/motion'
import LineaScroll from '../components/LineaScroll'

const GLIFOS = '{}[]()<>/=;:$#&*+_01λ'

function escapar(c: string) {
  return c.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Palabra de la frase que queda por DEBAJO de la cinta azul (las demás van por encima). */
const PALABRA_BAJO = 2

const PALABRAS = FRASE.split(' ')

/** Pinta la frase con `fijos` caracteres resueltos y el resto como código aleatorio, palabra por palabra. */
function pintar(el: HTMLElement, fijos: number) {
  let html = ''
  let i = 0
  PALABRAS.forEach((palabra, n) => {
    if (n > 0) {
      html += ' '
      i++
    }
    html += `<span class="frase-palabra${n === PALABRA_BAJO ? ' frase-bajo' : ''}">`
    for (const c of palabra) {
      if (i < fijos || c === '.') html += escapar(c)
      else html += `<span class="compilando">${escapar(GLIFOS[(Math.random() * GLIFOS.length) | 0])}</span>`
      i++
    }
    html += '</span>'
  })
  el.innerHTML = html
}

/** Escena 2 · noche. La frase "compila" desde caracteres de código, ligada al scroll. */
export default function Perfil() {
  const root = useRef<HTMLElement>(null)
  const frase = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const el = frase.current
    if (!el) return
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add(MOV(), () => {
        pintar(el, 0)
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: '+=110%',
          pin: true,
          scrub: true,
          onUpdate: (self) => pintar(el, Math.floor(Math.min(1, self.progress * 1.25) * FRASE.length)),
          onLeave: () => pintar(el, FRASE.length),
        })
        gsap.fromTo(
          '.perfil-meta',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'top top', scrub: true } }
        )
        return () => {
          st.kill()
          pintar(el, FRASE.length)
        }
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="perfil" ref={root} className="mundo-noche relative grid min-h-[100svh] place-items-center overflow-hidden gutter py-24">
      <LineaScroll />
      {/* Sin z-index aquí: así cada palabra de la frase puede ir por encima o por debajo de la cinta */}
      <div className="relative grid w-full max-w-[1200px] gap-8">
        <span className="perfil-meta eyebrow relative z-30 text-niebla">// Perfil</span>
        <p
          ref={frase}
          className="display text-cal text-[clamp(52px,10vw,150px)] min-h-[2.6em]"
          aria-label={FRASE}
        >
          {PALABRAS.map((palabra, n) => (
            <span key={n}>
              {n > 0 && ' '}
              <span className={`frase-palabra${n === PALABRA_BAJO ? ' frase-bajo' : ''}`}>{palabra}</span>
            </span>
          ))}
        </p>
        <p className="perfil-meta relative z-30 max-w-[52ch] text-niebla text-lg">
          Estudiante de Diseño y Desarrollo de Software con experiencia práctica en entornos reales. Orientado al detalle,
          comprometido con la calidad y construyendo proyectos web y de escritorio de punta a punta.
        </p>
      </div>
    </section>
  )
}
