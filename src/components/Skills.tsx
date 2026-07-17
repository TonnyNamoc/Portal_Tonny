import { glassHandlers } from '../lib/glass'
import { revealDelay } from '../lib/useReveal'
import { useTheme } from '../lib/theme'

const LEARNING = [
  'ASP.NET',
  'SQL Server',
  'AWS (Amazon Web Services)',
  'Metodologías ágiles (Scrum)',
  'Análisis de procesos BPM',
]

function LearningPills() {
  return (
    <div className="flex flex-wrap gap-2.5">
      {LEARNING.map((item) => (
        <div
          key={item}
          className="flex items-center gap-2 rounded-full border border-neutral-900/10 bg-white/45 py-2 pl-3.5 pr-2 dark:border-white/10 dark:bg-white/[0.04]"
        >
          <span className="text-xs text-neutral-700 dark:text-white/80 sm:text-sm">
            {item}
          </span>
          <span className="rounded-full bg-neutral-900/[0.07] px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-neutral-500 dark:bg-white/10 dark:text-white/50">
            Aprendiendo
          </span>
        </div>
      ))}
    </div>
  )
}

const SKILLS: {
  category: string
  name: string
  level: number
  details: string[]
  logos: string[]
}[] = [
  {
    category: 'Frontend',
    name: 'HTML+CSS',
    level: 5,
    details: ['Maquetación responsiva', 'Interfaces centradas en UX'],
    logos: ['/logos/html.svg', '/logos/css.svg'],
  },
  {
    category: 'Frontend',
    name: 'JS',
    level: 4,
    details: ['Interactividad y DOM', 'Consumo de APIs'],
    logos: ['/logos/javascript.svg'],
  },
  {
    category: 'Backend',
    name: 'Java',
    level: 4,
    details: ['Programación orientada a objetos', 'Apps de escritorio'],
    logos: ['/logos/java.svg'],
  },
  {
    category: 'Backend',
    name: 'Laravel',
    level: 4,
    details: ['Arquitectura MVC', 'E-commerce con Stripe'],
    logos: ['/logos/laravel.svg', '/logos/php.svg'],
  },
  {
    category: 'Base de datos',
    name: 'MySQL',
    level: 4,
    details: ['Modelado de datos', 'CRUD y consultas'],
    logos: ['/logos/mysql.svg'],
  },
  {
    category: 'Herramientas',
    name: 'Git',
    level: 3,
    details: ['Control de versiones', 'Trabajo colaborativo'],
    logos: ['/logos/git.svg'],
  },
]

export default function Skills() {
  const { theme } = useTheme()
  return (
    <section
      id="habilidades"
      className="relative overflow-hidden bg-white px-6 py-24 scroll-mt-20 dark:bg-[#0a0608] md:px-12 lg:py-20"
    >
      {/* Ambient glow behind the cards */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[620px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(closest-side, rgba(32, 101, 142, 0.35) 0%, rgba(11, 39, 64, 0.15) 55%, transparent 100%)'
              : 'radial-gradient(closest-side, rgba(120, 170, 210, 0.28) 0%, rgba(180, 210, 235, 0.12) 55%, transparent 100%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-end gap-5 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="reveal mb-4 text-xs uppercase tracking-[0.3em] text-neutral-400 dark:text-white/50">
              Habilidades técnicas
            </p>
            <h2
              className="reveal font-instrument text-3xl leading-[1.1] tracking-tight text-neutral-900 dark:text-white md:text-5xl lg:text-6xl"
              style={revealDelay(80)}
            >
              Herramientas que domino.
            </h2>
          </div>
          <p
            className="reveal max-w-sm text-sm leading-relaxed text-neutral-500 dark:text-white/50 lg:justify-self-end"
            style={revealDelay(130)}
          >
            Tecnologías con las que construyo interfaces, aplicaciones y
            soluciones de principio a fin.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
          {SKILLS.map(({ category, name, level, details, logos }, i) => (
            <div
              key={name}
              {...glassHandlers}
              className="liquid-glass logo-hover-zone reveal group flex min-h-[172px] flex-col rounded-2xl p-5 transition-transform duration-500 hover:-translate-y-1 lg:p-6"
              style={{
                ...revealDelay(160 + i * 70),
                transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400 dark:text-white/40">
                    {category}
                  </p>
                  <p className="mt-2 font-mono text-2xl font-medium tracking-tight text-neutral-900 dark:text-white md:text-3xl">
                    {name}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2 rounded-xl border border-neutral-900/10 bg-white/40 p-2 dark:border-white/10 dark:bg-white/[0.04]">
                  {logos.map((logo) => (
                    <img
                      key={logo}
                      src={logo}
                      alt=""
                      className="logo-mono h-6 w-6 object-contain"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-auto flex items-end justify-between gap-4 pt-5">
                <ul className="space-y-1">
                  {details.map((d) => (
                    <li
                      key={d}
                      className="flex gap-1.5 text-[11px] leading-relaxed text-neutral-500 dark:text-white/50"
                    >
                      <span className="text-neutral-400 dark:text-white/30">+</span>
                      {d}
                    </li>
                  ))}
                </ul>
                <div
                  className="shrink-0 text-right"
                  aria-label={`Nivel ${level} de 5`}
                >
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400 dark:text-white/35">
                    Nivel
                  </span>
                  <p className="font-mono text-sm text-neutral-700 dark:text-white/70">
                    {level}/5
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          {...glassHandlers}
          className="liquid-glass reveal mt-5 grid gap-5 rounded-2xl p-5 md:grid-cols-[220px_1fr] md:items-center lg:p-6"
          style={revealDelay(620)}
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-neutral-400 dark:text-white/40">
              Próximo nivel
            </p>
            <h3 className="mt-2 font-instrument text-2xl leading-tight text-neutral-900 dark:text-white">
              En aprendizaje activo.
            </h3>
          </div>
          <div className="md:border-l md:border-neutral-900/10 md:pl-6 dark:md:border-white/10">
            <LearningPills />
          </div>
        </div>
      </div>
    </section>
  )
}
