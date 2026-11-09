import { useLayoutEffect, useRef } from 'react'
import { FRASE } from '../lib/data'
import { gsap, ScrollTrigger } from '../lib/motion'

const GLIFOS = '{}[]()<>/=;:$#&*+_01λ'

function escapar(c: string) {
  return c.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Pinta la frase con `fijos` caracteres resueltos y el resto como código aleatorio. */
function pintar(el: HTMLElement, fijos: number) {
  let html = ''
  for (let i = 0; i < FRASE.length; i++) {
    const c = FRASE[i]
    if (i < fijos || c === ' ' || c === '.') html += escapar(c)
    else html += `<span class="compilando">${escapar(GLIFOS[(Math.random() * GLIFOS.length) | 0])}</span>`
  }
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
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        pintar(el, 0)
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: '+=110%',
          pin: true,
          scrub: true,
          onUpdate: (self) => pintar(el, Math.floor(Math.min(1, self.progress * 1.25) * FRASE.length)),
          onLeave: () => {
            el.textContent = FRASE
          },
        })
        gsap.fromTo(
          '.perfil-meta',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, scrollTrigger: { trigger: root.current, start: 'top 60%', end: 'top top', scrub: true } }
        )
        return () => {
          st.kill()
          el.textContent = FRASE
        }
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="perfil" ref={root} className="mundo-noche relative grid min-h-[100svh] place-items-center overflow-hidden gutter py-24">
      <div className="grid w-full max-w-[1200px] gap-8">
        <span className="perfil-meta eyebrow text-niebla">// Perfil</span>
        <p
          ref={frase}
          className="display text-cal text-[clamp(52px,10vw,150px)] min-h-[2.6em]"
          aria-label={FRASE}
        >
          {FRASE}
        </p>
        <p className="perfil-meta max-w-[52ch] text-niebla text-lg">
          Estudiante de Diseño y Desarrollo de Software con experiencia práctica en entornos reales. Orientado al detalle,
          comprometido con la calidad y construyendo proyectos web y de escritorio de punta a punta.
        </p>
      </div>
    </section>
  )
}
