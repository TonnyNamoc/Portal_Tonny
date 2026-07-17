import { Mail, Phone, MapPin } from 'lucide-react'
import { revealDelay } from '../lib/useReveal'

const TECH = [
  { logo: '/logos/html.svg', name: 'HTML' },
  { logo: '/logos/css.svg', name: 'CSS' },
  { logo: '/logos/javascript.svg', name: 'JavaScript' },
  { logo: '/logos/react.svg', name: 'React' },
  { logo: '/logos/nodejs.svg', name: 'Node.js' },
  { logo: '/logos/laravel.svg', name: 'Laravel' },
  { logo: '/logos/php.svg', name: 'PHP' },
  { logo: '/logos/mysql.svg', name: 'MySQL' },
  { logo: '/logos/git.svg', name: 'Git' },
]

const CONTACT_ROWS = [
  {
    icon: Mail,
    label: 'tonny.namoc@tecsup.edu.pe',
    href: 'mailto:tonny.namoc@tecsup.edu.pe',
  },
  { icon: Phone, label: '983 415 509', href: 'tel:+51983415509' },
  { icon: MapPin, label: 'Trujillo, Perú' },
]

export default function Contact() {
  return (
    <section
      id="contacto"
      className="relative bg-white dark:bg-[#0a0608] py-20 md:py-24 px-6 md:px-12 scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: content */}
        <div>
          <p className="reveal text-neutral-400 dark:text-white/50 text-xs tracking-[0.3em] uppercase mb-4">
            Contacto
          </p>
          <h2
            className="reveal font-instrument text-neutral-900 dark:text-white text-3xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight"
            style={revealDelay(80)}
          >
            Trabajemos juntos.
          </h2>
          <p
            className="reveal text-neutral-600 dark:text-white/60 text-sm md:text-base mt-5 max-w-md leading-relaxed"
            style={revealDelay(160)}
          >
            ¿Tienes un proyecto en mente o una oportunidad? Escríbeme y
            conversemos.
          </p>

          {/* Tech logos: gray by default, colored on hover */}
          <div
            className="reveal grid grid-cols-4 sm:grid-cols-5 gap-x-4 gap-y-6 mt-10 max-w-md"
            style={revealDelay(240)}
          >
            {TECH.map(({ logo, name }) => (
              <div
                key={name}
                className="logo-hover-zone flex flex-col items-center gap-2 cursor-default"
              >
                <img src={logo} alt="" className="logo-mono w-9 h-9 object-contain" />
                <span className="text-neutral-500 dark:text-white/60 text-[11px] tracking-wide">
                  {name}
                </span>
              </div>
            ))}
          </div>

          {/* Contact rows */}
          <div
            className="reveal mt-10 max-w-md divide-y divide-neutral-900/10 dark:divide-white/10 border-y border-neutral-900/10 dark:border-white/10"
            style={revealDelay(320)}
          >
            {CONTACT_ROWS.map(({ icon: Icon, label, href }) => {
              const content = (
                <>
                  <span className="flex items-center justify-center w-11 h-11 rounded-xl border border-neutral-900/15 dark:border-white/15 text-neutral-700 dark:text-white/80 shrink-0">
                    <Icon size={17} />
                  </span>
                  <span className="text-neutral-700 dark:text-white/80 text-sm tracking-wide">
                    {label}
                  </span>
                </>
              )
              return href ? (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-4 py-4 hover:opacity-70 transition-opacity duration-300"
                >
                  {content}
                </a>
              ) : (
                <div key={label} className="flex items-center gap-4 py-4">
                  {content}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: image */}
        <div className="reveal" style={revealDelay(200)}>
          <div className="rounded-3xl overflow-hidden ring-1 ring-neutral-900/10 dark:ring-white/10 shadow-2xl shadow-neutral-900/15 dark:shadow-black/50">
            <img
              src="/logos/desarrollador.png"
              alt="Desarrollador programando entre logos de tecnologías web"
              className="w-full h-full object-cover aspect-[4/3] lg:aspect-auto lg:max-h-[560px]"
            />
          </div>
        </div>
      </div>

      <footer className="max-w-6xl mx-auto mt-16 pt-8 border-t border-neutral-900/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-neutral-400 dark:text-white/40 text-xs tracking-wide">
          © 2026 Tonny Alexander Namoc Julca
        </p>
        <a
          href="/CV-Tonny-Namoc.docx"
          download
          className="text-neutral-500 hover:text-neutral-900 dark:text-white/60 dark:hover:text-white text-xs tracking-wide transition-colors duration-300"
        >
          Descargar CV ↓
        </a>
      </footer>
    </section>
  )
}
