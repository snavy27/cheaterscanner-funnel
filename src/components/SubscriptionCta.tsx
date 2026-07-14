import { LucideArrowRight } from './SubscriptionIcons'

interface SubscriptionCtaProps {
  onClick: () => void
  variant?: 'dark' | 'red'
}

const sairaStyle = { fontFamily: 'var(--font-display)', letterSpacing: 'normal' as const }

export function SubscriptionCta({ onClick, variant = 'red' }: SubscriptionCtaProps) {
  const bg = variant === 'dark' ? '#1e1e1e' : '#EC3A49'

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-white font-bold py-2.5 rounded-lg flex-col items-center justify-center shadow-lg"
      style={{ ...sairaStyle, backgroundColor: bg }}
    >
      <div className="flex items-center justify-center">
        <span className="text-xl tracking-wide">SEE FULL REPORT</span>
        <LucideArrowRight className="ml-2 w-4 h-4" />
      </div>
      <div className="text-center text-white text-xs font-normal" style={sairaStyle}>
        30 day money-back guarantee
      </div>
    </button>
  )
}
