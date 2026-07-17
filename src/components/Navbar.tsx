import { useState } from 'react'
import Button from './Button'
import ScratchReveal from './ScratchReveal'
import { glassHandlers } from '../lib/glass'
import { useDeck } from '../lib/deck'
import { useTheme } from '../lib/theme'
import { useOverHero } from '../lib/useOverHero'

const NAV_LINKS = [
  { label: 'Sobre mí', id: 'sobre-mi' },
  { label: 'Habilidades', id: 'habilidades' },
  { label: 'Proyectos', id: 'proyectos' },
  { label: 'Contacto', id: 'contacto' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isDeck, activeId, goTo } = useDeck()
  const { theme } = useTheme()
  const overHero = useOverHero()
  // White UI over the hero video or anywhere in dark mode
  const whiteUI = overHero || theme === 'dark'

  const handleNav = (id: string) => (e: React.MouseEvent) => {
    if (isDeck) {
      e.preventDefault()
      goTo(id)
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5">
        <a
          href="#inicio"
          onClick={handleNav('inicio')}
          className={`text-2xl md:text-3xl transition-colors duration-500 ${
            whiteUI ? 'text-white' : 'text-neutral-900'
          }`}
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Tonny
        </a>

        <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
          <div
            {...glassHandlers}
            className="liquid-glass flex items-center gap-1 rounded-full px-2 py-1.5"
          >
            {NAV_LINKS.map(({ label, id }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={handleNav(id)}
                className={`relative z-10 text-sm tracking-wide px-4 py-2 rounded-full transition-all duration-300 ${
                  isDeck && activeId === id
                    ? whiteUI
                      ? 'text-white bg-white/15'
                      : 'text-black bg-black/10'
                    : whiteUI
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-neutral-700 hover:text-black hover:bg-black/5'
                }`}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden md:block">
          <ScratchReveal>
            <Button
              href="/CV-Tonny-Namoc.docx"
              download
              variant={whiteUI ? 'light' : 'dark'}
            >
              Descargar CV
            </Button>
          </ScratchReveal>
        </div>

        <button
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden relative z-50 flex flex-col justify-center items-center w-10 h-10 gap-[7px]"
        >
          <span
            className={`block w-6 h-[2px] transition-all duration-500 ${
              (menuOpen ? theme === 'dark' : whiteUI) ? 'bg-white' : 'bg-neutral-900'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
              transform: menuOpen ? 'rotate(45deg) translateY(9px)' : 'none',
              transformOrigin: 'center',
            }}
          />
          <span
            className={`block w-6 h-[2px] transition-all duration-500 ${
              (menuOpen ? theme === 'dark' : whiteUI) ? 'bg-white' : 'bg-neutral-900'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
              opacity: menuOpen ? 0 : 1,
              transform: menuOpen ? 'scaleX(0)' : 'none',
            }}
          />
          <span
            className={`block w-6 h-[2px] transition-all duration-500 ${
              (menuOpen ? theme === 'dark' : whiteUI) ? 'bg-white' : 'bg-neutral-900'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
              transform: menuOpen ? 'rotate(-45deg) translateY(-9px)' : 'none',
              transformOrigin: 'center',
            }}
          />
        </button>
      </nav>

      {/* Mobile slide-in menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/20 transition-opacity duration-500 ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMenuOpen(false)}
      />
      <aside
        className={`md:hidden fixed top-0 right-0 bottom-0 z-40 w-[85%] max-w-[340px] bg-white/95 dark:bg-[#0a0608]/95 backdrop-blur-xl border-l border-black/10 dark:border-white/10 flex flex-col justify-between px-8 pt-28 pb-10 transition-transform duration-500 ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
      >
        <div className="flex flex-col gap-7">
          {NAV_LINKS.map(({ label, id }, i) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className="text-neutral-800 hover:text-black dark:text-white/90 dark:hover:text-white text-lg tracking-wide transition-all duration-500"
              style={{
                transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                transitionDelay: menuOpen ? `${150 + i * 75}ms` : '0ms',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateX(0)' : 'translateX(24px)',
              }}
            >
              {label}
            </a>
          ))}
        </div>
        <div
          className="transition-all duration-500"
          style={{
            transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
            transitionDelay: menuOpen ? '450ms' : '0ms',
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateX(0)' : 'translateX(24px)',
          }}
        >
          <ScratchReveal>
            <Button
              href="/CV-Tonny-Namoc.docx"
              download
              variant={theme === 'dark' ? 'light' : 'dark'}
              className="w-full"
            >
              Descargar CV
            </Button>
          </ScratchReveal>
        </div>
      </aside>
    </>
  )
}
