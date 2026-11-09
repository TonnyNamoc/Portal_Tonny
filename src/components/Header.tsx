import { useEffect, useState } from 'react'
import Monograma from './Monograma'
import RollLink from './RollLink'
import { SECCIONES, CONTACTO } from '../lib/data'
import { ScrollTrigger, scrollToId, stopScroll } from '../lib/motion'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [activa, setActiva] = useState('inicio')

  // Sección activa según el scroll
  useEffect(() => {
    const triggers = SECCIONES.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => self.isActive && setActiva(id),
      })
    )
    return () => triggers.forEach((t) => t.kill())
  }, [])

  useEffect(() => {
    stopScroll(open)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const ir = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    // espera a que el menú empiece a cerrarse
    setTimeout(() => scrollToId(id), 250)
  }

  return (
    <>
      <header className="header gutter">
        <a href="#inicio" onClick={ir('inicio')} aria-label="Ir al inicio" className="justify-self-start">
          <Monograma size={38} />
        </a>
        <span className="eyebrow hidden sm:block">Tonny Namoc</span>
        <button
          className="burger"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          <i />
          <i />
        </button>
      </header>

      <div id="menu" className={`menu gutter ${open ? 'open' : ''}`} aria-hidden={!open} inert={!open}>
        <div className="flex items-center justify-between pt-[22px]">
          <Monograma size={38} />
          <button className="burger text-cal" aria-label="Cerrar menú" onClick={() => setOpen(false)}>
            <span className="display text-3xl">×</span>
          </button>
        </div>
        <nav className="menu-links" aria-label="Principal">
          {SECCIONES.map(({ id, label }) => (
            <RollLink key={id} href={`#${id}`} onClick={ir(id)} className={activa === id ? 'is-active' : ''}>
              {label}
            </RollLink>
          ))}
        </nav>
        <div className="flex flex-wrap justify-between gap-3 pb-6 text-niebla eyebrow">
          <span>{CONTACTO.correo}</span>
          <span>{CONTACTO.ciudad}</span>
        </div>
      </div>
    </>
  )
}
