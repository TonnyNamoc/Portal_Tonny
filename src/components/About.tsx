import { glassTiltHandlers } from '../lib/glass'
import { revealDelay } from '../lib/useReveal'

const CARDS = [
  {
    category: 'Educación',
    value: 'TECSUP',
    details: ['Diseño y Desarrollo de Software', '2023 — Actualidad'],
  },
  {
    category: 'Idiomas',
    value: 'ES / EN',
    details: ['Español — Nativo', 'Inglés — Intermedio 2 (en curso)'],
  },
  {
    category: 'Competencias',
    value: '05',
    details: [
      'Pensamiento analítico',
      'Resolución de problemas',
      'Comunicación efectiva',
      'Trabajo en equipo',
      'Iniciativa e innovación',
    ],
  },
]

export default function About() {
  return (
    <section id="sobre-mi" className="relative bg-white dark:bg-[#0a0608] py-24 md:py-36 px-6 md:px-12 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <p className="reveal text-neutral-400 dark:text-white/50 text-xs tracking-[0.3em] uppercase mb-4">Sobre mí</p>
        <h2
          className="reveal font-instrument text-neutral-900 dark:text-white text-3xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight max-w-3xl"
          style={revealDelay(80)}
        >
          Estudiante de Diseño y Desarrollo de Software con experiencia práctica en entornos reales.
        </h2>
        <p
          className="reveal text-neutral-600 dark:text-white/60 text-sm md:text-base mt-6 max-w-2xl leading-relaxed"
          style={revealDelay(160)}
        >
          Orientado al detalle, comprometido con la calidad y con capacidad
          para adaptarme a distintos entornos de trabajo. Actualmente me formo
          en TECSUP mientras construyo proyectos web y de escritorio de punta a punta.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-14 md:mt-20">
          {CARDS.map(({ category, value, details }, i) => (
            <div
              key={category}
              {...glassTiltHandlers}
              className="liquid-glass logo-hover-zone reveal tilt-card rounded-2xl p-6 flex flex-col h-full lg:min-h-[230px]"
              style={revealDelay(200 + i * 90)}
            >
              <p className="font-mono text-neutral-400 dark:text-white/40 text-[10px] tracking-[0.2em] uppercase">
                {category}
              </p>

              <p className="font-mono text-neutral-900 dark:text-white text-3xl xl:text-4xl font-medium mt-4 break-words">
                {value}
              </p>

              <ul className="mt-auto pt-6 space-y-1.5">
                {details.map((d) => (
                  <li
                    key={d}
                    className="text-neutral-500 dark:text-white/50 text-[11px] leading-relaxed flex gap-1.5"
                  >
                    <span className="text-neutral-400 dark:text-white/30">+</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
