const TECH = [
  { logo: '/logos/html.svg', name: 'HTML' },
  { logo: '/logos/css.svg', name: 'CSS' },
  { logo: '/logos/javascript.svg', name: 'JavaScript' },
  { logo: '/logos/java.svg', name: 'Java' },
  { logo: '/logos/laravel.svg', name: 'Laravel' },
  { logo: '/logos/php.svg', name: 'PHP' },
  { logo: '/logos/mysql.svg', name: 'MySQL' },
  { logo: '/logos/git.svg', name: 'Git' },
]

function TechList({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div className="flex items-center gap-12 pr-12 shrink-0" aria-hidden={ariaHidden}>
      {TECH.map(({ logo, name }) => (
        <div key={name} className="logo-hover-zone flex items-center gap-3 whitespace-nowrap">
          <img
            src={logo}
            alt=""
            className="logo-mono w-6 h-6 object-contain"
          />
          <span className="text-white/70 text-sm tracking-wide">{name}</span>
        </div>
      ))}
    </div>
  )
}

export default function TechMarquee() {
  return (
    <div
      className="marquee absolute bottom-0 left-1/2 -translate-x-1/2 w-[560px] max-w-[90vw] z-20 py-6 overflow-hidden"
      style={{
        WebkitMaskImage:
          'linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)',
        maskImage:
          'linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)',
      }}
    >
      <div className="marquee-track flex w-max">
        <TechList />
        <TechList ariaHidden />
      </div>
    </div>
  )
}
