import { LOGOS_MARQUEE } from '../lib/data'

/**
 * Cinta infinita de logos. Cada mitad repite la lista varias veces para medir más que
 * cualquier pantalla (hasta ~3000 px), así al desplazarse -50% nunca queda un hueco vacío.
 */
export default function LogoMarquee({
  className = '',
  imgClassName = '',
  reverse = false,
}: {
  className?: string
  imgClassName?: string
  reverse?: boolean
}) {
  const mitad = [...LOGOS_MARQUEE, ...LOGOS_MARQUEE, ...LOGOS_MARQUEE]
  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div className="marquee-track" style={reverse ? { animationDirection: 'reverse' } : undefined}>
        {[0, 1].map((m) => (
          <div key={m} className="flex shrink-0 items-center gap-16 pr-16">
            {mitad.map((l, i) => (
              <img
                key={i}
                src={`/logos/${l}.svg`}
                alt=""
                width={32}
                height={32}
                loading="eager"
                decoding="sync"
                className={`h-8 w-auto shrink-0 ${imgClassName}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
