import { glassHandlers } from '../lib/glass'
import { revealDelay } from '../lib/useReveal'

const TECH_LOGOS: Record<string, string> = {
  HTML: '/logos/html.svg',
  CSS: '/logos/css.svg',
  JavaScript: '/logos/javascript.svg',
  Java: '/logos/java.svg',
  MySQL: '/logos/mysql.svg',
  Laravel: '/logos/laravel.svg',
  Stripe: '/logos/stripe.svg',
}

const PROJECTS = [
  {
    title: 'Tienda de Ropa Online',
    course: 'Diseño de Interfaces de Programación · TECSUP',
    year: '2023-2',
    stack: ['HTML', 'CSS', 'JavaScript'],
    bullets: [
      'Página web responsiva desarrollada desde cero',
      'Interfaces centradas en la experiencia de usuario',
    ],
  },
  {
    title: 'Sistema de Almacén',
    course: 'Programación Orientada a Objetos y Base de Datos · TECSUP',
    year: '2024-1',
    stack: ['Java', 'MySQL'],
    bullets: [
      'Aplicación Java conectada a MySQL con CRUD completo',
      'Gestión de inventario con filtros por producto, precio e ID',
    ],
  },
  {
    title: 'Le Peruparfum — Tienda Virtual',
    course: 'Desarrollo de Aplicaciones en Internet · TECSUP',
    year: '2024-2',
    stack: ['Laravel', 'MySQL', 'Stripe'],
    bullets: [
      'E-commerce con pasarela de pagos Stripe',
      'Arquitectura MVC y panel administrativo de productos',
    ],
  },
]

export default function Projects() {
  return (
    <section id="proyectos" className="relative bg-white dark:bg-[#0a0608] py-24 md:py-36 px-6 md:px-12 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <p className="reveal text-neutral-400 dark:text-white/50 text-xs tracking-[0.3em] uppercase mb-4">Proyectos</p>
        <h2
          className="reveal font-instrument text-neutral-900 dark:text-white text-3xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight"
          style={revealDelay(80)}
        >
          Lo que he construido.
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-14 md:mt-20">
          {PROJECTS.map(({ title, course, year, stack, bullets }, i) => (
            <div key={title} className="reveal" style={revealDelay(160 + i * 110)}>
            <article
              {...glassHandlers}
              className="liquid-glass rounded-2xl p-7 flex flex-col h-full hover:-translate-y-1 transition-transform duration-500"
              style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
            >
              <p className="text-neutral-400 dark:text-white/40 text-xs tracking-wide">{year}</p>
              <h3 className="text-neutral-900 dark:text-white text-xl font-medium mt-2">{title}</h3>
              <p className="text-neutral-500 dark:text-white/50 text-xs mt-1 leading-relaxed">{course}</p>

              <ul className="mt-5 space-y-2 flex-1">
                {bullets.map((b) => (
                  <li key={b} className="text-neutral-600 dark:text-white/75 text-sm leading-relaxed flex gap-2">
                    <span className="block w-1 h-1 rounded-full bg-neutral-400 dark:bg-white/50 mt-2 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 mt-6">
                {stack.map((tech) => (
                  <span
                    key={tech}
                    className="logo-hover-zone flex items-center gap-1.5 text-neutral-600 dark:text-white/70 text-xs pl-2 pr-3 py-1 rounded-full border border-neutral-900/15 dark:border-white/15"
                  >
                    {TECH_LOGOS[tech] && (
                      <img
                        src={TECH_LOGOS[tech]}
                        alt=""
                        className="logo-mono w-3.5 h-3.5 object-contain"
                      />
                    )}
                    {tech}
                  </span>
                ))}
              </div>
            </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
