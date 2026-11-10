import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

/** Parte del área (0–1) que hay que limpiar para que el resto se aclare solo. */
const UMBRAL = 0.55
/** Radio del "trapo" respecto al ancho del logo. */
const RADIO = 0.16
/** Resolución de la máscara (más baja = bordes más suaves y cálculo más barato). */
const MASCARA = 0.25

/**
 * Logo que empieza difuminado y se va limpiando por donde pasa el cursor, como una raspadita.
 * Cuando ya se limpió más de la mitad, el resto se aclara solo. En pantallas táctiles basta con
 * tocarlo o deslizar el dedo, y con "reducir movimiento" se muestra nítido desde el inicio.
 */
export default function LogoRevelar({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const caja = useRef<HTMLDivElement>(null)
  const lienzo = useRef<HTMLCanvasElement>(null)
  const [limpio, setLimpio] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (limpio) return
    const box = caja.current
    const canvas = lienzo.current
    if (!box || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.src = src
    const mascara = document.createElement('canvas')
    const mctx = mascara.getContext('2d', { willReadFrequently: true })!
    let ancho = 0
    let alto = 0
    let pendiente = false
    let trazos = 0
    let ultimo: { x: number; y: number } | null = null

    // Medidas del lienzo y de la máscara según el tamaño real de la caja
    const medir = () => {
      // offsetWidth/Height y no getBoundingClientRect: las fichas van rotadas y la caja girada mide de más
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      ancho = box.offsetWidth
      alto = box.offsetHeight
      canvas.width = Math.round(ancho * dpr)
      canvas.height = Math.round(alto * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const viejo = mascara.width ? mctx.getImageData(0, 0, mascara.width, mascara.height) : null
      const mw = Math.max(1, Math.round(ancho * MASCARA))
      const mh = Math.max(1, Math.round(alto * MASCARA))
      if (viejo && (mw !== mascara.width || mh !== mascara.height)) {
        const tmp = document.createElement('canvas')
        tmp.width = viejo.width
        tmp.height = viejo.height
        tmp.getContext('2d')!.putImageData(viejo, 0, 0)
        mascara.width = mw
        mascara.height = mh
        mctx.drawImage(tmp, 0, 0, mw, mh)
      } else if (!viejo) {
        mascara.width = mw
        mascara.height = mh
      }
      pintar()
    }

    // Dibuja el logo nítido solo donde la máscara ya está limpia
    const pintar = () => {
      pendiente = false
      if (!img.complete || !img.naturalWidth) return
      const escala = Math.min(ancho / img.naturalWidth, alto / img.naturalHeight)
      const w = img.naturalWidth * escala
      const h = img.naturalHeight * escala
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, ancho, alto)
      ctx.drawImage(img, (ancho - w) / 2, (alto - h) / 2, w, h)
      ctx.globalCompositeOperation = 'destination-in'
      ctx.drawImage(mascara, 0, 0, ancho, alto)
    }
    const pedir = () => {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(pintar)
    }

    // Cuánto se ha limpiado (se revisa cada pocos trazos)
    const cobertura = () => {
      const d = mctx.getImageData(0, 0, mascara.width, mascara.height).data
      let suma = 0
      for (let i = 3; i < d.length; i += 4) suma += d[i]
      return suma / ((d.length / 4) * 255)
    }

    const limpiar = (x: number, y: number) => {
      const r = Math.max(ancho, alto) * RADIO * MASCARA
      const mx = x * MASCARA
      const my = y * MASCARA
      const g = mctx.createRadialGradient(mx, my, 0, mx, my, r)
      g.addColorStop(0, 'rgba(0,0,0,1)')
      g.addColorStop(0.55, 'rgba(0,0,0,0.85)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      mctx.fillStyle = g
      mctx.beginPath()
      mctx.arc(mx, my, r, 0, Math.PI * 2)
      mctx.fill()
      pedir()
      if (++trazos % 8 === 0 && cobertura() > UMBRAL) setLimpio(true)
    }

    const mover = (e: PointerEvent) => {
      // offsetX/Y ya vienen en coordenadas de la caja, aunque la ficha esté rotada
      const x = e.offsetX
      const y = e.offsetY
      // Rellena los huecos entre dos posiciones si el cursor va rápido
      if (ultimo) {
        const dx = x - ultimo.x
        const dy = y - ultimo.y
        const paso = Math.max(ancho, alto) * RADIO * 0.4
        const n = Math.min(12, Math.floor(Math.hypot(dx, dy) / paso))
        for (let i = 1; i <= n; i++) limpiar(ultimo.x + (dx * i) / (n + 1), ultimo.y + (dy * i) / (n + 1))
      }
      limpiar(x, y)
      ultimo = { x, y }
    }
    const salir = () => {
      ultimo = null
    }
    // En pantallas táctiles, un toque limpia todo
    const tocar = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') setLimpio(true)
    }

    img.onload = medir
    const ro = new ResizeObserver(medir)
    ro.observe(box)
    box.addEventListener('pointermove', mover)
    box.addEventListener('pointerleave', salir)
    box.addEventListener('pointerdown', tocar)
    return () => {
      ro.disconnect()
      box.removeEventListener('pointermove', mover)
      box.removeEventListener('pointerleave', salir)
      box.removeEventListener('pointerdown', tocar)
    }
  }, [src, limpio])

  return (
    <div ref={caja} className={`logo-revelar relative ${limpio ? 'is-limpio' : ''} ${className}`}>
      {/* Versión difuminada: es la que leen los lectores de pantalla */}
      <img src={src} alt={alt} className="logo-revelar-base absolute inset-0 h-full w-full object-contain" draggable={false} />
      {/* Versión nítida, solo donde ya se limpió. Se queda puesta mientras la base se aclara */}
      <canvas ref={lienzo} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />
      <span className="logo-revelar-pista mono pointer-events-none absolute inset-x-0 -bottom-5 text-center text-[10px] uppercase tracking-[0.2em]" aria-hidden="true">
        <span className="hidden [@media(hover:hover)]:inline">Pasa el cursor</span>
        <span className="[@media(hover:hover)]:hidden">Toca para ver</span>
      </span>
    </div>
  )
}
