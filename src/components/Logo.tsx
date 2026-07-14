interface LogoProps {
  className?: string
}

export function Logo({ className = 'h-7 w-auto sm:h-8' }: LogoProps) {
  return (
    <img
      src="/cheaterscanner_white.avif"
      alt="Cheater Scanner"
      className={className}
    />
  )
}
