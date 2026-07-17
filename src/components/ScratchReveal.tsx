import { useEffect, useRef, useState } from 'react'

interface ScratchRevealProps {
  children: React.ReactNode
  className?: string
  /** Fraction of the cover that must be scratched before it clears (0-1). */
  threshold?: number
}

const BRUSH_RADIUS = 14

/**
 * Lottery-style scratch card: a metallic foil covers the children and blocks
 * interaction until the visitor scratches enough of it away with the pointer.
 */
export default function ScratchReveal({
  children,
  className = '',
  threshold = 0.5,
}: ScratchRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scratching = useRef(false)
  const strokes = useRef(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const rect = wrap.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.max(1, Math.round(rect.width * dpr))
    canvas.height = Math.max(1, Math.round(rect.height * dpr))
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    ctx.scale(dpr, dpr)

    // Metallic foil with light speckles, like a real lottery ticket
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height)
    gradient.addColorStop(0, '#878c95')
    gradient.addColorStop(0.45, '#cdd2da')
    gradient.addColorStop(0.55, '#b9bec7')
    gradient.addColorStop(1, '#7a8089')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, rect.width, rect.height)

    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)'
    for (let i = 0; i < rect.width / 3; i++) {
      ctx.fillRect(Math.random() * rect.width, Math.random() * rect.height, 1.2, 1.2)
    }

    ctx.fillStyle = 'rgba(35, 39, 46, 0.9)'
    ctx.font = "600 11px Inter, sans-serif"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('✦ Raspa aquí ✦', rect.width / 2, rect.height / 2)
  }, [])

  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas || revealed) return
    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(clientX - rect.left, clientY - rect.top, BRUSH_RADIUS, 0, Math.PI * 2)
    ctx.fill()

    // Check cleared area every few strokes to keep it cheap
    strokes.current++
    if (strokes.current % 6 !== 0) return
    const { width, height } = canvas
    const data = ctx.getImageData(0, 0, width, height).data
    let clear = 0
    let total = 0
    for (let i = 3; i < data.length; i += 4 * 8) {
      total++
      if (data[i] === 0) clear++
    }
    if (clear / total >= threshold) setRevealed(true)
  }

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        onPointerDown={(e) => {
          scratching.current = true
          try {
            e.currentTarget.setPointerCapture(e.pointerId)
          } catch {
            // synthetic or already-released pointers can't be captured — scratching still works
          }
          scratchAt(e.clientX, e.clientY)
        }}
        onPointerMove={(e) => {
          if (scratching.current) scratchAt(e.clientX, e.clientY)
        }}
        onPointerUp={() => {
          scratching.current = false
        }}
        className={`absolute inset-0 w-full h-full rounded-full transition-opacity duration-700 ${
          revealed ? 'opacity-0 pointer-events-none' : 'cursor-crosshair'
        }`}
        style={{ touchAction: 'none' }}
      />
    </div>
  )
}
