import { useLayoutEffect, useRef, useState } from 'react'
import Monograma from '../components/Monograma'
import RollLink from '../components/RollLink'
import { CONTACTO, SECCIONES } from '../lib/data'
import LogoMarquee from '../components/LogoMarquee'
import { gsap, scrollToId } from '../lib/motion'

function Copiable({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  const [ok, setOk] = useState(false)
  return (
    <button
      type="button"
      className="group grid justify-items-start gap-1 border-0 bg-transparent text-left cursor-pointer text-cal"
      onClick={() => {
        navigator.clipboard?.writeText(valor).then(() => {
          setOk(true)
          setTimeout(() => setOk(false), 1600)
        })
      }}
    >
      <span className="eyebrow text-niebla">{ok ? 'Copiado' : etiqueta}</span>
      <span className="text-lg md:text-xl underline decoration-white/20 underline-offset-4 group-hover:decoration-[var(--pacifico)]">
        {valor}
      </span>
    </button>
  )
}

/** Escena 6 · noche. Cierre a pantalla completa con panel lateral flotante. */
export default function Contacto() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          root.current,
          { '--p': 0 },
          { '--p': 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'top 20%', scrub: true } }
        )
        gsap.from('.ct-letra', {
          yPercent: 110,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.04,
          scrollTrigger: { trigger: root.current, start: 'top 45%' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const palabra = 'Hablemos'

  return (
    <section id="contacto" ref={root} className="mundo-noche wipe-in relative min-h-[100svh] overflow-hidden">
      <div className="grid min-h-[100svh] gap-8 gutter py-10 lg:grid-cols-[260px_1fr]">
        {/* Panel lateral flotante */}
        <aside className="panel-flota hidden lg:grid content-between rounded-[10px] bg-[var(--noche-2)] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.4)]" style={{ background: 'var(--noche-2)' }}>
          <div className="grid gap-8">
            <Monograma size={40} />
            <nav className="grid gap-2 text-[30px]" aria-label="Pie de página">
              {SECCIONES.map((s) => (
                <RollLink
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId(s.id)
                  }}
                >
                  {s.label}
                </RollLink>
              ))}
            </nav>
          </div>
          <p className="mono text-[11px] leading-relaxed text-niebla">
            © {new Date().getFullYear()} {CONTACTO.nombreCompleto}
            <br />
            Hecho en Trujillo
          </p>
        </aside>

        <div className="grid content-center gap-10 lg:pl-10">
          <span className="eyebrow text-niebla">Escena 06 · Contacto</span>
          <h2 className="display text-[clamp(72px,17vw,260px)] text-cal">
            <span className="sr-only">{palabra}</span>
            <span aria-hidden="true" className="inline-flex overflow-hidden">
              {palabra.split('').map((c, i) => (
                <span key={i} className="ct-letra inline-block">
                  {c}
                </span>
              ))}
            </span>
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <Copiable valor={CONTACTO.correo} etiqueta="Correo · clic para copiar" />
            <Copiable valor={CONTACTO.telefono} etiqueta="Teléfono · clic para copiar" />
            <div className="grid gap-1">
              <span className="eyebrow text-niebla">Ciudad</span>
              <span className="text-lg md:text-xl">{CONTACTO.ciudad}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a className="btn" href={`mailto:${CONTACTO.correo}`}>
              Escríbeme
            </a>
            <a className="btn btn-ghost text-cal" href={CONTACTO.cv} download>
              Descargar CV
            </a>
          </div>
        </div>
      </div>

      <LogoMarquee reverse className="border-t border-white/10 py-5" imgClassName="h-7 opacity-40 grayscale" />
    </section>
  )
}
