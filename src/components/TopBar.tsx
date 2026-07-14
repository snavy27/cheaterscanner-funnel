import { CountdownTimer } from './CountdownTimer'
import { LucideArrowRight, LucideClock } from './SubscriptionIcons'

interface TopBarProps {
  onGetAccess?: () => void
}

export function TopBar({ onGetAccess }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-2 px-2 sm:px-4 py-2 text-white bg-gradient-to-b from-[#FF6252] via-[#FF5864] to-[#F93A50]">
      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
        <LucideClock className="w-4 h-4 opacity-90" />
        <span className="font-bold font-display">Limited Time Offer:</span>
        <CountdownTimer
          className="ml-1.5 sm:ml-2 bg-white/20 backdrop-blur-sm text-white rounded-lg px-2 py-1 font-mono font-bold border border-white/30 text-sm inline-block"
        />
      </div>
      <button
        type="button"
        onClick={onGetAccess}
        className="shrink-0 rounded-lg bg-white px-2 sm:px-4 py-1.5 text-xs font-bold text-[#F93A50] shadow-md transition hover:bg-white/90 border border-white/50 sm:text-sm font-display flex items-center"
      >
        Get Access Now
        <LucideArrowRight className="w-3.5 h-3.5 ml-1" />
      </button>
    </header>
  )
}
