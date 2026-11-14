import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

/** Las cuatro curvas del sistema, en formato GSAP (CustomEase no hace falta). */
export const EASE = {
  revelar: 'expo.out', // ≈ cubic-bezier(.16,1,.3,1)
  escena: 'power3.inOut', // ≈ cubic-bezier(.65,.05,.36,1)
  ui: 'power2.out',
  scrub: 'none',
} as const

const CLAVE = 'tn-animaciones'
const CLAVE_MODO = 'tn-modo'

/** Modos de diseño: mismo contenido, distinta personalidad. */
export const MODOS = [
  { id: 'cine', label: 'Cine', nota: 'Con todo el movimiento' },
  { id: 'gala', label: 'Gala', nota: 'Elegante y en calma' },
] as const
export type Modo = (typeof MODOS)[number]['id']

const leerModo = (): Modo => {
  try {
    return localStorage.getItem(CLAVE_MODO) === 'gala' ? 'gala' : 'cine'
  } catch {
    return 'cine'
  }
}

/** Modo con el que cargó la página. Cambiarlo recarga, igual que el botón de animaciones. */
export const MODO: Modo = typeof window === 'undefined' ? 'cine' : leerModo()

/** Guarda el modo, cubre la pantalla con un telón y recarga para vestir todas las escenas. */
export function setModo(modo: Modo) {
  if (modo === MODO) return
  try {
    localStorage.setItem(CLAVE_MODO, modo)
  } catch {
    return // sin almacenamiento no se puede recordar el modo
  }
  const telon = document.createElement('div')
  telon.className = `telon-modo telon-${modo}`
  document.body.appendChild(telon)
  window.setTimeout(() => {
    window.scrollTo(0, 0)
    window.location.reload()
  }, 520)
}

/** true si el sistema del visitante pide reducir animaciones. */
export const sistemaReduce = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** true si el visitante activó las animaciones a mano con el botón. */
export const animacionesForzadas = () => {
  try {
    return localStorage.getItem(CLAVE) === 'on'
  } catch {
    return false
  }
}

/** true cuando no debe haber movimiento: lo pide el sistema o el modo Gala, que es en calma. */
export const prefersReducedMotion = () => MODO === 'gala' || (sistemaReduce() && !animacionesForzadas())

/** Activa o vuelve a apagar las animaciones y recarga para aplicarlo en todas las escenas. */
export function setAnimaciones(on: boolean) {
  try {
    if (on) localStorage.setItem(CLAVE, 'on')
    else localStorage.removeItem(CLAVE)
  } catch {
    /* sin almacenamiento: no se puede recordar */
  }
  window.scrollTo(0, 0)
  window.location.reload()
}

const reducir = prefersReducedMotion()
// 'quieto' avisa al CSS de que no hay escenas fijas ni carriles: todo va en flujo normal
if (typeof document !== 'undefined' && reducir) document.documentElement.classList.add('quieto')
if (typeof document !== 'undefined' && MODO === 'cine' && sistemaReduce() && !reducir) document.documentElement.classList.add('animar-forzado')

/**
 * Consultas para gsap.matchMedia que respetan el botón de animaciones.
 * MOV(q) vale cuando hay movimiento (y se cumple q); QUIETO(q) cuando no hay movimiento (o se cumple q).
 */
export const MOV = (q = 'all') => (reducir ? 'not all' : q)
export const QUIETO = (q = 'not all') => (reducir ? 'all' : q)

let lenis: Lenis | null = null

/** Arranca Lenis una sola vez y lo conecta con ScrollTrigger. */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function stopScroll(stop: boolean) {
  if (!lenis) {
    document.documentElement.style.overflow = stop ? 'hidden' : ''
    return
  }
  if (stop) lenis.stop()
  else lenis.start()
}

/** Desplaza a una sección por id, con o sin Lenis. */
export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { duration: 1.6 })
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

export { gsap, ScrollTrigger }
