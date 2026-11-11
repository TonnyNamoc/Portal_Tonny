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
import { ScrollTrigger, startSmoothScroll } from './lib/motion'

export default function App() {
  const [listo, setListo] = useState(false)

  useEffect(() => {
    startSmoothScroll()
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
