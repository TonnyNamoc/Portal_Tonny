interface ButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  href?: string
  download?: boolean
  /** 'light' = white pill (over dark backgrounds), 'dark' = near-black pill (over light backgrounds). */
  variant?: 'light' | 'dark'
}

const VARIANT_CLASSES = {
  light:
    'bg-white text-black hover:bg-white/90 button-glow',
  dark: 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-lg shadow-neutral-900/15',
}

export default function Button({
  children,
  className = '',
  onClick,
  href,
  download,
  variant = 'light',
}: ButtonProps) {
  const classes = `inline-block text-center px-8 py-3.5 rounded-full font-medium text-sm tracking-wide transition-all duration-300 ${VARIANT_CLASSES[variant]} ${className}`

  if (href) {
    return (
      <a href={href} download={download} onClick={onClick} className={classes}>
        {children}
      </a>
    )
  }
  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
