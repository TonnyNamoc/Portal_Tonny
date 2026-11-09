import { useEffect, useRef, useState } from 'react'
import { APRENDIENDO, CONTACTO, HABILIDADES, PROYECTOS, SECCIONES } from '../lib/data'
import { gsap, prefersReducedMotion, scrollToId, stopScroll } from '../lib/motion'

type Linea = { texto: string; tipo?: 'cmd' | 'err' | 'ok' | 'dim' }

const BIENVENIDA: Linea[] = [
  { texto: 'tonny@trujillo:~$ portafolio v2 — "Adobe y Código"', tipo: 'ok' },
  { texto: 'Escribe "help" para ver los comandos. Esc para cerrar.', tipo: 'dim' },
]

const AYUDA = `Comandos:
  help           muestra esta ayuda
  sobre          quién soy
  proyectos      lista de proyectos
  stack          tecnologías y nivel
  aprendiendo    lo que estoy estudiando
  contacto       correo y teléfono
  cv             descarga mi CV
  ir <sección>   ${SECCIONES.map((s) => s.id).join(' · ')}
  clear          limpia la pantalla
  exit           cierra la terminal`

function ejecutar(entrada: string, cerrar: () => void): Linea[] | 'clear' {
  const [cmd, ...args] = entrada.trim().toLowerCase().split(/\s+/)
  switch (cmd) {
    case '':
      return []
    case 'help':
    case 'ayuda':
      return [{ texto: AYUDA }]
    case 'sobre':
    case 'whoami':
      return [
        { texto: `${CONTACTO.nombreCompleto}` , tipo: 'ok' },
        { texto: 'Desarrollador de Software en formación en TECSUP (2023 — actualidad).' },
        { texto: 'Orientado al detalle y a construir proyectos de punta a punta.' },
      ]
    case 'proyectos':
    case 'ls':
      return PROYECTOS.map((p) => ({
        texto: `${p.ciclo}  ${p.titulo.padEnd(24)} ${p.stack.join(', ')}${p.noEncontrado ? '   [404]' : ''}`,
        tipo: p.noEncontrado ? 'dim' : undefined,
      }))
    case 'stack':
      return HABILIDADES.map((h) => ({ texto: `${h.nombre.padEnd(12)} ${'■'.repeat(h.nivel)}${'□'.repeat(5 - h.nivel)}  ${h.categoria}` }))
    case 'aprendiendo':
      return [{ texto: APRENDIENDO.join(' · ') }]
    case 'contacto':
      return [
        { texto: `correo    ${CONTACTO.correo}` },
        { texto: `teléfono  ${CONTACTO.telefono}` },
        { texto: `ciudad    ${CONTACTO.ciudad}` },
      ]
    case 'cv': {
      const a = document.createElement('a')
      a.href = CONTACTO.cv
      a.download = ''
      a.click()
      return [{ texto: 'Descargando CV-Tonny-Namoc.docx…', tipo: 'ok' }]
    }
    case 'ir':
    case 'cd': {
      const destino = SECCIONES.find((s) => s.id === args[0] || s.label.toLowerCase() === args.join(' '))
      if (!destino) return [{ texto: `Sección no encontrada. Prueba: ${SECCIONES.map((s) => s.id).join(', ')}`, tipo: 'err' }]
      cerrar()
      setTimeout(() => scrollToId(destino.id), 300)
      return [{ texto: `→ ${destino.label}`, tipo: 'ok' }]
    }
    case 'clear':
    case 'cls':
      return 'clear'
    case 'exit':
    case 'salir':
      cerrar()
      return []
    case 'sudo':
      return [{ texto: 'Permiso denegado. Pero puedes contratarme: escribe "contacto".', tipo: 'err' }]
    default:
      return [{ texto: `"${cmd}": comando no encontrado (404). Escribe "help".`, tipo: 'err' }]
  }
}

/** Terminal secreta: se abre con ~ (o º en teclado español) o con el botón de la esquina. */
export default function Terminal() {
  const [open, setOpen] = useState(false)
  const [lineas, setLineas] = useState<Linea[]>(BIENVENIDA)
  const [valor, setValor] = useState('')
  const historial = useRef<string[]>([])
  const posHist = useRef(-1)
  const panel = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const salida = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      const escribiendo = t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'
      const esTecla = e.key === '~' || e.key === '`' || e.key === 'º' || e.code === 'Backquote'
      if (esTecla && !escribiendo) {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    stopScroll(open)
    if (open) {
      input.current?.focus()
      if (panel.current && !prefersReducedMotion())
        gsap.fromTo(panel.current, { y: 40, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' })
    }
  }, [open])

  useEffect(() => {
    salida.current?.scrollTo({ top: salida.current.scrollHeight })
  }, [lineas])

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    const texto = valor
    setValor('')
    if (texto.trim()) historial.current.unshift(texto)
    posHist.current = -1
    const r = ejecutar(texto, () => setOpen(false))
    if (r === 'clear') setLineas([])
    else setLineas((l) => [...l, { texto: `$ ${texto}`, tipo: 'cmd' }, ...r])
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      const h = historial.current
      posHist.current = Math.max(-1, Math.min(h.length - 1, posHist.current + (e.key === 'ArrowUp' ? 1 : -1)))
      setValor(posHist.current >= 0 ? h[posHist.current] : '')
    }
  }

  return (
    <>
      <button className="terminal-btn" data-magnet onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="terminal">
        <span>{'>_'}</span> Terminal <kbd>~</kbd>
      </button>

      {open && (
        <div ref={panel} id="terminal" className="terminal" role="dialog" aria-label="Terminal" data-lenis-prevent>
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <i className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--peligro)' }} />
            <i className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--totora)' }} />
            <i className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--pacifico)' }} />
            <span className="ml-3 text-[11px] text-niebla">tonny@trujillo: ~</span>
            <button className="ml-auto border-0 bg-transparent text-niebla hover:text-cal" onClick={() => setOpen(false)} aria-label="Cerrar terminal">
              esc
            </button>
          </div>
          <div ref={salida} className="terminal-salida" aria-live="polite">
            {lineas.map((l, i) => (
              <div key={i} className={l.tipo}>
                {l.texto}
              </div>
            ))}
          </div>
          <form onSubmit={enviar}>
            <span style={{ color: 'var(--totora)' }}>$</span>
            <label htmlFor="terminal-input" className="sr-only">
              Comando
            </label>
            <input
              id="terminal-input"
              ref={input}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              spellCheck={false}
              placeholder="help"
            />
          </form>
        </div>
      )}
    </>
  )
}
