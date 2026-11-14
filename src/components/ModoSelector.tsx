import { MODO, MODOS, setModo } from '../lib/motion'

/** Cambia el diseño del sitio: mismo contenido, distinta personalidad. */
export default function ModoSelector({ className = '' }: { className?: string }) {
  return (
    <div className={`modo-selector ${className}`} role="group" aria-label="Modo de diseño">
      {MODOS.map((m) => (
        <button key={m.id} type="button" aria-pressed={m.id === MODO} title={m.nota} onClick={() => setModo(m.id)}>
          {m.label}
        </button>
      ))}
    </div>
  )
}
