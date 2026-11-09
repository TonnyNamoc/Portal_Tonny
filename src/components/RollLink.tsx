import type { AnchorHTMLAttributes } from 'react'

/** Enlace cuyo texto rueda hacia arriba y entra su copia en azul. */
export default function RollLink({
  children,
  className = '',
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { children: string }) {
  return (
    <a className={`roll ${className}`} {...rest}>
      <span aria-hidden="true">
        <em>{children}</em>
        <em>{children}</em>
      </span>
      <span className="sr-only">{children}</span>
    </a>
  )
}
