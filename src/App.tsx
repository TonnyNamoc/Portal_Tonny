import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import ThemeToggle from './components/ThemeToggle'
import Hero from './components/Hero'
import QuoteSection from './components/QuoteSection'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import { DeckContext, SLIDES } from './lib/deck'
import { ThemeContext } from './lib/theme'
import type { Theme } from './lib/theme'
import { useMediaQuery } from './lib/useMediaQuery'
import { useRevealObserver } from './lib/useReveal'

function App() {
  const isDeck = useMediaQuery('(min-width: 1024px)')
  const [index, setIndex] = useState(0)
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) || 'light'
  )
  useRevealObserver(isDeck)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

  const goTo = (id: string) => {
    const i = SLIDES.findIndex((s) => s.id === id)
    if (i >= 0) setIndex(i)
  }

  useEffect(() => {
    if (!isDeck) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, SLIDES.length - 1))
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isDeck])

  const sections = [
    <Hero key="inicio" />,
    <QuoteSection key="perfil" />,
    <About key="sobre-mi" />,
    <Skills key="habilidades" />,
    <Projects key="proyectos" />,
    <Contact key="contacto" />,
  ]

  // The hero (slide 0) always sits on the dark space video
  const whiteDots = index === 0 || theme === 'dark'

  return (
    <ThemeContext.Provider value={{ theme, toggle: toggleTheme }}>
      <DeckContext.Provider value={{ isDeck, activeId: SLIDES[index].id, goTo }}>
        <div className="bg-white dark:bg-[#0a0608]">
          <Navbar />

          {/* Theme toggle, visible on every slide/section */}
          <div className="fixed bottom-8 left-8 z-50">
            <ThemeToggle />
          </div>

          {isDeck ? (
            <div className="h-screen overflow-hidden">
              <div
                className="flex h-full will-change-transform"
                style={{
                  width: `${SLIDES.length * 100}vw`,
                  transform: `translate3d(${-index * 100}vw, 0, 0)`,
                  transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {sections.map((section, i) => (
                  <div
                    key={SLIDES[i].id}
                    className="w-screen h-full shrink-0 overflow-y-auto scrollbar-hide"
                  >
                    <div className="min-h-full flex flex-col justify-center">
                      {section}
                    </div>
                  </div>
                ))}
              </div>

              {/* Slide dots */}
              <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    aria-label={s.label}
                    title={s.label}
                    onClick={() => setIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      whiteDots
                        ? i === index
                          ? 'bg-white scale-125'
                          : 'bg-white/40 hover:bg-white/70'
                        : i === index
                          ? 'bg-neutral-900 scale-125'
                          : 'bg-neutral-900/25 hover:bg-neutral-900/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            sections
          )}
        </div>
      </DeckContext.Provider>
    </ThemeContext.Provider>
  )
}

export default App
