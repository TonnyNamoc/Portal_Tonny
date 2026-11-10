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
    'M1520 210 C1250 165 1000 270 760 245 C520 220 310 175 190 265 C60 360 120 440 330 460 C620 490 880 430 1000 500 C1120 570 1090 700 960 680 C830 660 870 530 1050 530 C1220 530 1290 620 1540 650',
  movil:
    'M440 50 C330 30 300 140 360 220 C420 300 390 420 350 520 C310 620 150 660 160 770 C170 880 330 850 300 770 C270 690 110 760 40 960',
}

type Variante = keyof typeof RECORRIDO

function Cinta({ v }: { v: Variante }) {
  const [w, h] = v === 'ancho' ? [1440, 900] : [400, 900]
  const grosor = v === 'ancho' ? 34 : 16
  return (
    <svg
      className={`linea-scroll linea-${v} pointer-events-none absolute inset-0 h-full w-full`}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
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
 * Va dentro de una sección con `position: relative`, en z-20. Lo que deba quedar por encima de la
 * cinta lleva z-30 y lo que deba quedar por debajo, z-10 (en Perfil, palabra por palabra).
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
    <div ref={root} className="linea-contenedor pointer-events-none absolute inset-0 z-20" aria-hidden="true">
      <div className="absolute inset-0 hidden md:block">
        <Cinta v="ancho" />
      </div>
      <div className="absolute inset-0 md:hidden">
        <Cinta v="movil" />
      </div>
    </div>
  )
}
