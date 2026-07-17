import Button from './Button'
import TechMarquee from './TechMarquee'
import { revealDelay } from '../lib/useReveal'
import { useDeck } from '../lib/deck'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4'

export default function Hero() {
  const { isDeck, goTo } = useDeck()

  return (
    <section id="inicio" className="relative h-screen overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="absolute inset-0 bg-black/20" />

      <div className="absolute inset-0 flex flex-col items-center justify-center -mt-[120px] px-6">
        <h1 className="reveal font-instrument text-white text-[36px] md:text-7xl lg:text-[110px] leading-[0.9] tracking-tight text-center text-glow">
          Código con intención. Diseño con detalle.
        </h1>
        <p
          className="reveal text-white/70 text-sm md:text-base text-center mt-5 md:mt-7 max-w-xl"
          style={revealDelay(150)}
        >
          Tonny Namoc — Desarrollador de Software en formación en TECSUP,
          creando experiencias web con calidad y propósito.
        </p>
        <div className="reveal mt-6 md:mt-9" style={revealDelay(300)}>
          <Button
            href={isDeck ? undefined : '#proyectos'}
            onClick={isDeck ? () => goTo('proyectos') : undefined}
          >
            Ver mis proyectos
          </Button>
        </div>
      </div>

      <TechMarquee />
    </section>
  )
}
