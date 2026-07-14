import { useState } from 'react'
import { FunnelBackButton } from '../components/FunnelBackButton'
import { track } from '../lib/track'

interface EmailGateScreenProps {
  defaultEmail?: string
  scanResult?: { matches: number; apps: number }
  onSubmit: (email: string) => void
  onBack?: () => void
}

export function EmailGateScreen({ defaultEmail = '', scanResult, onSubmit, onBack }: EmailGateScreenProps) {
  const [email, setEmail] = useState(defaultEmail || 'demo@example.com')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    track('add_to_cart', { email })
    onSubmit(email)
  }

  return (
    <div className="pt-4">
      {onBack && <FunnelBackButton onClick={onBack} />}
      {scanResult && (
        <div className="mb-4 rounded-2xl bg-white/15 p-4 text-center text-white backdrop-blur-sm">
          <p className="text-sm opacity-90">Scan complete</p>
          <p className="font-display text-2xl font-bold uppercase">
            {scanResult.matches} Matches Found
          </p>
          <p className="text-sm opacity-80">Across {scanResult.apps} dating apps</p>
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="font-display mb-2 text-center text-2xl font-bold uppercase tracking-wide text-[#1A1A1A]">
          Get Your Cheating Report
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500">
          Enter your email to unlock the full report with profile details, activity timelines, and
          match locations.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-xl border border-gray-200 px-4 py-3.5 text-[#1A1A1A] focus:border-[#F0454A] focus:outline-none focus:ring-1 focus:ring-[#F0454A]"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-[#F0454A] py-4 font-bold text-white transition hover:bg-[#d93d42]"
          >
            Reveal My Report →
          </button>
        </form>

        <p className="mt-4 text-center text-[10px] text-gray-400">
          🔒 Your email is safe. We never sell or share your personal data.
        </p>
      </div>
    </div>
  )
}
