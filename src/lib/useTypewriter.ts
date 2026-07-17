import { useEffect, useState } from 'react'

/** Builds `text` character by character after `startDelay`, at `speed` ms per char. */
export function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let interval: number | undefined
    const timeout = window.setTimeout(() => {
      let i = 0
      interval = window.setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          window.clearInterval(interval)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      window.clearTimeout(timeout)
      if (interval) window.clearInterval(interval)
    }
  }, [text, speed, startDelay])

  return { displayed, done }
}
