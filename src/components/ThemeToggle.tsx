import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../lib/theme'
import { useOverHero } from '../lib/useOverHero'

/** Sun/moon pill that switches the site between light and dark theme. */
export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const overHero = useOverHero()
  // White styling over the hero video or anywhere in dark mode
  const whiteUI = overHero || theme === 'dark'

  return (
    <div
      className={`flex items-center gap-1 rounded-full border backdrop-blur-md p-1 transition-colors duration-500 ${
        whiteUI ? 'border-white/25 bg-white/10' : 'border-black/15 bg-black/5'
      }`}
    >
      <button
        aria-label="Modo claro"
        title="Modo claro"
        onClick={theme === 'dark' ? toggle : undefined}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
          theme === 'light'
            ? whiteUI
              ? 'bg-white text-neutral-900 shadow'
              : 'bg-neutral-900 text-white shadow'
            : 'text-white/60 hover:text-white'
        }`}
      >
        <Sun size={15} />
      </button>
      <button
        aria-label="Modo oscuro"
        title="Modo oscuro"
        onClick={theme === 'light' ? toggle : undefined}
        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-white/20 text-white shadow'
            : whiteUI
              ? 'text-white/60 hover:text-white'
              : 'text-neutral-500 hover:text-neutral-900'
        }`}
      >
        <Moon size={15} />
      </button>
    </div>
  )
}
