/** Monograma TN construido con el escalón de Chan Chan. `encendidos` ilumina escalones (loader). */
const ESCALONES = [
  { x: 0, y: 40, w: 56, h: 8 },
  { x: 8, y: 30, w: 40, h: 8 },
  { x: 16, y: 20, w: 24, h: 8 },
]

export default function Monograma({ size = 40, encendidos }: { size?: number; encendidos?: number }) {
  const conLoader = encendidos !== undefined
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
      {ESCALONES.map((e, i) => (
        <rect
          key={i}
          className={conLoader ? `escalon ${i < (encendidos ?? 0) ? 'on' : ''}` : undefined}
          x={e.x}
          y={e.y}
          width={e.w}
          height={e.h}
          fill="currentColor"
        />
      ))}
      <text
        className={conLoader ? `escalon ${(encendidos ?? 0) >= 4 ? 'on' : ''}` : undefined}
        x="28"
        y="15"
        textAnchor="middle"
        fontFamily="'Big Shoulders Display', 'Arial Narrow', sans-serif"
        fontWeight="900"
        fontSize="17"
        fill="currentColor"
      >
        TN
      </text>
    </svg>
  )
}
