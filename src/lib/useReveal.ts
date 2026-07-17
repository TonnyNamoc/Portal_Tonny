import { useEffect } from 'react'
import type { CSSProperties } from 'react'

/** Inline style helper: stagger a .reveal element by `ms` milliseconds. */
export const revealDelay = (ms: number): CSSProperties =>
  ({ '--reveal-delay': `${ms}ms` } as CSSProperties)

/**
 * Observes every `.reveal` element and adds `.is-visible` the first time it
 * enters the viewport, triggering the CSS entrance transition. Each element
 * animates once; stagger siblings with `--reveal-delay`.
 */
export function useRevealObserver(rescanKey?: unknown) {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('.reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [rescanKey])
}
