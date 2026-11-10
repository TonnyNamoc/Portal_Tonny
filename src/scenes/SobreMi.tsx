import { useLayoutEffect, useRef } from 'react'
import { CIFRAS, SOBRE_MI } from '../lib/data'
import { gsap, MOV } from '../lib/motion'
import LogoRevelar from '../components/LogoRevelar'

const ROTACION = [-4, 3, -2]

/** Escena 5 · adobe. Cifras que corren y fichas que caen rotadas como polaroids. */
export default function SobreMi() {
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add(MOV(), () => {
        gsap.utils.toArray<HTMLElement>('.cifra').forEach((el) => {
          const fin = Number(el.dataset.valor)
          const desde = fin > 1000 ? fin - 40 : 0
          const o = { v: desde }
          gsap.to(o, {
            v: fin,
            duration: 1.6,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
            onUpdate: () => {
              el.textContent = String(Math.round(o.v))
            },
          })
        })
        gsap.from('.ficha', {
          y: -160,
          rotate: (i) => ROTACION[i] * 4,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.15,
          scrollTrigger: { trigger: '.fichas', start: 'top 75%' },
        })
        gsap.from('.sm-linea', {
          yPercent: 100,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 60%' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="sobre-mi" ref={root} className="mundo-adobe relative overflow-hidden gutter py-28 md:py-40">
      <div className="mx-auto grid max-w-[1200px] gap-16">
        <div className="grid gap-6">
          <span className="eyebrow" style={{ color: 'var(--adobe-tinta)' }}>
            Escena 05 · Sobre mí
          </span>
          <h2 className="display text-[clamp(52px,9vw,132px)]">
            <span className="block overflow-hidden">
              <span className="sm-linea block">Construyo</span>
            </span>
            <span className="block overflow-hidden">
              <span className="sm-linea block">de punta</span>
            </span>
            <span className="block overflow-hidden">
              <span className="sm-linea block" style={{ color: 'var(--pacifico)' }}>
                a punta
              </span>
            </span>
          </h2>
          <p className="max-w-[56ch] text-lg" style={{ color: 'var(--adobe-tinta)' }}>
            Orientado al detalle, comprometido con la calidad y con capacidad para adaptarme a distintos entornos de trabajo.
            Egresé de TECSUP y construyo proyectos web, de datos y en la nube. Mi trabajo en producción, reparto y atención al cliente me enseñó a entender procesos reales de negocio.
          </p>
        </div>

        <dl className="grid grid-cols-3 gap-6 border-t border-noche/20 pt-6" style={{ borderColor: 'rgba(14,18,24,0.2)' }}>
          {CIFRAS.map((c) => (
            <div key={c.etiqueta} className="grid gap-1">
              <dd className="cifra display text-[clamp(48px,8vw,110px)] tabular-nums" data-valor={c.valor}>
                {c.valor}
              </dd>
              <dt className="eyebrow order-first" style={{ color: 'var(--adobe-tinta)' }}>
                {c.etiqueta}
              </dt>
            </div>
          ))}
        </dl>

        <div className="fichas grid gap-8 md:grid-cols-3">
          {SOBRE_MI.map((s, i) => (
            <article
              key={s.categoria}
              className="ficha grid gap-4 rounded-[4px] bg-[#F3EEE6] p-6 pb-10 shadow-[0_24px_50px_rgba(14,18,24,0.18)]"
              style={{ transform: `rotate(${ROTACION[i]}deg)` }}
            >
              <span className="eyebrow" style={{ color: 'var(--adobe-tinta)' }}>
                {s.categoria}
              </span>
              {s.logo && (
                // Como la foto de una polaroid: el logo empieza borroso y se limpia con el cursor
                <div className="rounded-[2px] bg-white/60 px-5 pb-7 pt-4">
                  <LogoRevelar src={s.logo} alt={`Logo de ${s.valor}`} className="h-24" />
                </div>
              )}
              <p className="display text-[44px]">{s.valor}</p>
              <ul className="grid gap-1 text-sm" style={{ color: 'var(--adobe-tinta)' }}>
                {s.detalles.map((d) => (
                  <li key={d}>+ {d}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
