import { useCallback, useEffect, useState } from 'react'
import Loader from './components/Loader'
import Header from './components/Header'
import Hero from './scenes/Hero'
import Perfil from './scenes/Perfil'
import Proyectos from './scenes/Proyectos'
import Habilidades from './scenes/Habilidades'
import SobreMi from './scenes/SobreMi'
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
        <Habilidades />
        <SobreMi />
        <Contacto />
      </main>
    </>
  )
}
