import { useCallback, useEffect, useState } from 'react'
import Loader from './components/Loader'
import Header from './components/Header'
import Terminal from './components/Terminal'
import SalaEdicion from './components/SalaEdicion'
import BotonAnimaciones from './components/BotonAnimaciones'
import Hero from './scenes/Hero'
import Perfil from './scenes/Perfil'
import Proyectos from './scenes/Proyectos'
import WebsShanty from './scenes/WebsShanty'
import Habilidades from './scenes/Habilidades'
import SobreMi from './scenes/SobreMi'
import Certificados from './scenes/Certificados'
import Contacto from './scenes/Contacto'
import { MODO, ScrollTrigger, startSmoothScroll } from './lib/motion'

export default function App() {
  const [listo, setListo] = useState(false)

  useEffect(() => {
    startSmoothScroll()
  }, [])

  // Modo Gala: cada sección aparece con suavidad la primera vez que entra en pantalla
  useEffect(() => {
    if (MODO !== 'gala' || !('IntersectionObserver' in window)) return
    const secciones = Array.from(document.querySelectorAll<HTMLElement>('main > section')).slice(1)
    secciones.forEach((s) => s.classList.add('gala-espera'))
    const io = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (!e.isIntersecting) return
          e.target.classList.remove('gala-espera')
          io.unobserve(e.target)
        }),
      { rootMargin: '0px 0px -12% 0px' }
    )
    secciones.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  const alTerminar = useCallback(() => {
    setListo(true)
    ScrollTrigger.refresh()
  }, [])

  return (
    <>
      {!listo && <Loader onDone={alTerminar} />}
      <Header />
      <main>
        <Hero listo={listo} />
        <Perfil />
        <Proyectos />
        <WebsShanty />
        <Habilidades />
        <SobreMi />
        <Certificados />
        <Contacto />
      </main>
      <Terminal />
      <BotonAnimaciones />
      <SalaEdicion />
    </>
  )
}
