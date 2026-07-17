import type { PointerEvent } from 'react'

/**
 * Spread onto any element with the `liquid-glass` class so its specular
 * highlight tracks the pointer position (see .liquid-glass::after).
 */
export const glassHandlers = {
  onPointerMove: (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    el.style.setProperty('--my', `${e.clientY - rect.top}px`)
  },
}

/**
 * Same specular tracking as `glassHandlers`, plus a 3D perspective tilt that
 * follows the pointer. Pair with the `tilt-card` class for smooth easing.
 */
export const glassTiltHandlers = {
  onPointerMove: (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)

    const px = x / rect.width - 0.5
    const py = y / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(px * 12).toFixed(2)}deg) translateZ(10px)`
  },
  onPointerLeave: (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.transform = ''
  },
}
