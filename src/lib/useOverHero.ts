import { useEffect, useState } from 'react'
import { useDeck } from './deck'

/**
 * True while the viewport shows the hero (dark space video): the active deck
 * slide on desktop, or the scroll position on mobile.
 */
export function useOverHero() {
  const { isDeck, activeId } = useDeck()
  const [pastHeroMobile, setPastHeroMobile] = useState(false)

  useEffect(() => {
    if (isDeck) return
    const onScroll = () => {
      const hero = document.getElementById('inicio')
      const limit = hero ? hero.offsetTop + hero.offsetHeight - 80 : 400
      setPastHeroMobile(window.scrollY >= limit)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isDeck])

  return isDeck ? activeId === 'inicio' : !pastHeroMobile
}
