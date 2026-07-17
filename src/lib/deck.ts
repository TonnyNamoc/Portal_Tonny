import { createContext, useContext } from 'react'

/** Slide order for the horizontal deck (desktop). Ids double as anchor ids on mobile. */
export const SLIDES = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'perfil', label: 'Perfil' },
  { id: 'sobre-mi', label: 'Sobre mí' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'contacto', label: 'Contacto' },
]

interface DeckState {
  /** True when the horizontal slide deck is active (>=1024px). */
  isDeck: boolean
  activeId: string
  goTo: (id: string) => void
}

export const DeckContext = createContext<DeckState>({
  isDeck: false,
  activeId: 'inicio',
  goTo: () => {},
})

export const useDeck = () => useContext(DeckContext)
