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

export const prefersReducedMotion = () => sistemaReduce() && !animacionesForzadas()

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
if (typeof document !== 'undefined' && sistemaReduce() && !reducir) document.documentElement.classList.add('animar-forzado')

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
