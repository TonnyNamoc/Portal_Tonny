import { useLayoutEffect, useRef } from 'react'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { gsap, MOV } from '../lib/motion'

gsap.registerPlugin(DrawSVGPlugin)

/**
 * Recorridos de la cinta. Escritorio en un lienzo de 1440×900 y móvil en uno de 400×900.
 * Entra por arriba a la derecha, da una vuelta alrededor del texto y sale por abajo a la derecha.
 */
const RECORRIDO = {
  ancho:
    'M1520 90 C1250 30 1000 200 760 170 C520 140 300 60 170 170 C40 280 120 420 330 450 C620 490 880 420 1020 540 C1160 660 1100 830 975 795 C850 760 890 600 1060 590 C1220 580 1290 700 1540 760',
  movil:
    'M440 50 C330 30 300 140 360 220 C420 300 390 420 350 520 C310 620 150 660 160 770 C170 880 330 850 300 770 C270 690 110 760 40 960',
}

/** Zona (en coordenadas del lienzo) donde la cinta pasa POR DELANTE del texto. En el resto va por detrás. */
const DELANTE = {
  ancho: { x: 560, y: 400, w: 360, h: 140 },
  movil: { x: 0, y: 700, w: 400, h: 90 },
}

type Variante = keyof typeof RECORRIDO

function Cinta({ v, capa }: { v: Variante; capa: 'atras' | 'delante' }) {
  const [w, h] = v === 'ancho' ? [1440, 900] : [400, 900]
  const grosor = v === 'ancho' ? 34 : 16
  const z = DELANTE[v]
  const clip = `linea-clip-${v}`
  return (
    <svg
      className={`linea-scroll linea-${v} linea-${capa} pointer-events-none absolute inset-0 h-full w-full`}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {capa === 'delante' && (
        <defs>
          <clipPath id={clip}>
            <rect x={z.x} y={z.y} width={z.w} height={z.h} />
          </clipPath>
        </defs>
      )}
      <g clipPath={capa === 'delante' ? `url(#${clip})` : undefined} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Cuerpo de la cinta */}
        <path className="linea-trazo" d={RECORRIDO[v]} stroke="var(--pacifico)" strokeWidth={grosor} />
        {/* Brillo fino desplazado: le da un poco de volumen, como un tubo */}
        <path
          className="linea-trazo"
          d={RECORRIDO[v]}
          stroke="var(--pacifico-claro)"
          strokeOpacity={0.45}
          strokeWidth={grosor * 0.18}
          transform={`translate(${-grosor * 0.16} ${-grosor * 0.2})`}
        />
      </g>
    </svg>
  )
}

/**
 * Cinta azul que se dibuja con el scroll y luego se borra por la cola mientras la sección se va.
 * Va dentro de una sección con `position: relative`; el contenido de la sección debe ir con z-10
 * para que la capa de atrás quede detrás y la de delante (z-20) por encima.
 */
export default function LineaScroll() {
  const root = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    // La sección que la contiene. Se lee del DOM porque el ref del padre aún no está puesto aquí.
    const seccion = root.current?.parentElement
    if (!seccion) return
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      const animar = (v: Variante) => () => {
        const trazos = gsap.utils.toArray<SVGPathElement>(`.linea-${v} .linea-trazo`)
        gsap.set(trazos, { drawSVG: '0% 0%' })
        gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: seccion,
              start: 'top 70%',
              // Entrada + el tiempo que Perfil queda fijo + la salida
              end: () => `+=${window.innerHeight * 2.6}`,
              scrub: true,
              invalidateOnRefresh: true,
              // Se calcula después de los pines de la página (Hero y Perfil)
              refreshPriority: -1,
            },
          })
          // La cabeza avanza hasta el final
          .to(trazos, { drawSVG: '0% 100%', duration: 0.62, ease: 'power1.inOut' }, 0)
          // La cola la persigue y la cinta sale de la pantalla
          .to(trazos, { drawSVG: '100% 100%', duration: 0.38, ease: 'power1.in' }, 0.62)
      }
      mm.add(MOV('(min-width: 768px)'), animar('ancho'))
      mm.add(MOV('(max-width: 767px)'), animar('movil'))
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="linea-contenedor" aria-hidden="true">
      <div className="absolute inset-0 z-0 hidden md:block">
        <Cinta v="ancho" capa="atras" />
      </div>
      <div className="absolute inset-0 z-20 hidden md:block">
        <Cinta v="ancho" capa="delante" />
      </div>
      <div className="absolute inset-0 z-0 md:hidden">
        <Cinta v="movil" capa="atras" />
      </div>
      <div className="absolute inset-0 z-20 md:hidden">
        <Cinta v="movil" capa="delante" />
      </div>
    </div>
  )
}
