import { useState } from 'react'
import { track } from '../lib/track'

interface AccountScreenProps {
  email: string
  onComplete: () => void
}

export function AccountScreen({ email, onComplete }: AccountScreenProps) {
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    track('signup_completed', { email })
    onComplete()
  }

  return (
    <div className="pt-4">
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="font-display mb-2 text-center text-2xl font-bold uppercase text-[#1A1A1A]">
          Create Your Account
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500">
          Set a password to access your scan results anytime from your dashboard.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            readOnly
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-[#F0454A] py-4 font-bold text-white"
          >
            Create Account →
          </button>
        </form>
        <button
          type="button"
          onClick={onComplete}
          className="mt-3 w-full text-sm text-gray-400 underline"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
