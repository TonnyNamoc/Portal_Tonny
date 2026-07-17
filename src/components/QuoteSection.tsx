import { useEffect, useRef } from 'react'
import { useTheme } from '../lib/theme'

const CHARS = '01{}[]<>/=;+*#$&λ():._'
const FONT_SIZE = 16
const TRAIL = 12

export default function QuoteSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId = 0
    let lastFrame = 0
    let drops: number[] = []
    let speeds: number[] = []

    const resize = () => {
      canvas.width = section.clientWidth
      canvas.height = section.clientHeight
      const columns = Math.ceil(canvas.width / FONT_SIZE)
      drops = Array.from(
        { length: columns },
        () => Math.random() * -(canvas.height / FONT_SIZE)
      )
      speeds = Array.from({ length: columns }, () => 0.35 + Math.random() * 0.65)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (t: number) => {
      rafId = requestAnimationFrame(draw)
      if (t - lastFrame < 33) return
      lastFrame = t

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${FONT_SIZE}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const x = i * FONT_SIZE
        const headRow = Math.floor(drops[i])

        for (let j = 0; j < TRAIL; j++) {
          const row = headRow - j
          const y = row * FONT_SIZE
          if (y < -FONT_SIZE || y > canvas.height + FONT_SIZE) continue

          const alpha = j === 0 ? 0.5 : (1 - j / TRAIL) * 0.26
          ctx.fillStyle =
            theme === 'dark'
              ? j === 0
                ? `rgba(165, 220, 255, ${alpha})`
                : `rgba(85, 150, 200, ${alpha})`
              : j === 0
                ? `rgba(15, 75, 125, ${alpha})`
                : `rgba(55, 115, 165, ${alpha})`
          const char = CHARS[Math.abs(i * 7 + row * 13) % CHARS.length]
          ctx.fillText(char, x, y)
        }

        drops[i] += speeds[i]
        if ((headRow - TRAIL) * FONT_SIZE > canvas.height) {
          drops[i] = Math.random() * -30
          speeds[i] = 0.35 + Math.random() * 0.65
        }
      }
    }
    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [theme])

  return (
    <section
      id="perfil"
      ref={sectionRef}
      className="relative h-screen overflow-hidden flex items-center justify-center"
      style={{
        background:
          theme === 'dark'
            ? 'linear-gradient(180deg, #0a0608 0%, #06121F 22%, #0B2740 50%, #06121F 78%, #0a0608 100%)'
            : 'linear-gradient(180deg, #ffffff 0%, #f0f6fb 22%, #ddecf7 50%, #f0f6fb 78%, #ffffff 100%)',
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 z-10 pointer-events-none"
      />

      {/* Soft vignette behind the quote for readability over the code rain */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(6,14,24,0.8) 0%, rgba(6,14,24,0) 70%)'
              : 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 70%)',
        }}
      />

      <div className="relative z-20 max-w-4xl px-6 text-center">
        <blockquote className="reveal font-instrument text-neutral-900 dark:text-white text-xl sm:text-2xl md:text-4xl lg:text-[42px] leading-[1.45] md:leading-[1.5]">
          &ldquo;Combino conocimientos técnicos en desarrollo web y bases de
          datos con una atención genuina al detalle. Me tomo el tiempo de
          entender cada problema antes de resolverlo. Sin apuros, sin excesos
          &mdash; solo software hecho con calidad y compromiso.&rdquo;
        </blockquote>
        <p
          className="reveal mt-6 md:mt-8 text-neutral-600 dark:text-white/80 text-sm md:text-base tracking-wide"
          style={{ '--reveal-delay': '180ms' } as React.CSSProperties}
        >
          Tonny Alexander Namoc Julca &mdash; Desarrollador de Software
        </p>
      </div>
    </section>
  )
}
