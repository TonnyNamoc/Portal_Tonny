import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

/**
 * Cursor propio: un punto que sigue al mouse con inercia y se convierte en una píldora con
 * texto sobre elementos con `data-cursor="Texto"`. Los elementos con `data-magnet` se
 * desplazan un poco hacia el cursor. Solo en dispositivos con mouse.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const [activo, setActivo] = useState(false)

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!finePointer || prefersReducedMotion()) return
    setActivo(true)
    document.documentElement.classList.add('cursor-propio')

    const el = dot.current!
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' })
    let iman: HTMLElement | null = null

    const soltarIman = () => {
      if (iman) gsap.to(iman, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      iman = null
    }

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      const t = e.target as HTMLElement | null

      const conTexto = t?.closest<HTMLElement>('[data-cursor]')
      setLabel(conTexto?.dataset.cursor ?? '')
      el.classList.toggle('sobre-enlace', !conTexto && !!t?.closest('a, button'))

      const m = t?.closest<HTMLElement>('[data-magnet]') ?? null
      if (m !== iman) soltarIman()
      if (m) {
        iman = m
        const r = m.getBoundingClientRect()
        const dx = e.clientX - (r.left + r.width / 2)
        const dy = e.clientY - (r.top + r.height / 2)
        gsap.to(m, { x: dx * 0.3, y: dy * 0.35, duration: 0.4, ease: 'power3.out' })
      }
    }
    const onLeaveWindow = () => el.classList.add('oculto')
    const onEnterWindow = () => el.classList.remove('oculto')
    const onDown = () => el.classList.add('presionado')
    const onUp = () => el.classList.remove('presionado')

    window.addEventListener('pointermove', onMove)
    document.addEventListener('pointerleave', onLeaveWindow)
    document.addEventListener('pointerenter', onEnterWindow)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      document.documentElement.classList.remove('cursor-propio')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeaveWindow)
      document.removeEventListener('pointerenter', onEnterWindow)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  if (!activo) return <div ref={dot} hidden />
  return (
    <div ref={dot} className={`cursor ${label ? 'con-texto' : ''}`} aria-hidden="true">
      <span>{label}</span>
    </div>
  )
}
