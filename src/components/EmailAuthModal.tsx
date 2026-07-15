import { useState } from 'react'
import { track } from '../lib/track'

const headerFont = { fontFamily: 'var(--font-display)' }

interface EmailAuthModalProps {
  isOpen: boolean
  defaultEmail?: string
  onSubmit: (email: string) => void
  onClose: () => void
}

export function EmailAuthModal({
  isOpen,
  defaultEmail,
  onSubmit,
  onClose,
}: EmailAuthModalProps) {
  const [email, setEmail] = useState(defaultEmail ?? '')
  const [marketingOptIn, setMarketingOptIn] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    track('add_to_cart', { email })
    onSubmit(email.trim())
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:p-0">
        <button
          type="button"
          className="fixed inset-0 bg-gray-900/75 transition-opacity"
          aria-label="Close email form"
          onClick={onClose}
        />

        {/* Arial matches live's site-default font; headline and CTA override with Saira Condensed */}
        <div
          className="relative my-8 inline-block w-full max-w-md transform overflow-hidden rounded-[5px] bg-white p-6 text-left shadow-xl"
          style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
        >
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3
              className="mb-4 text-center text-2xl font-bold text-gray-900"
              style={headerFont}
            >
              Enter your email
              <br />
              to get the report
            </h3>

            <div className="mb-4 rounded-[5px] bg-blue-50 p-3">
              <div className="mb-1 flex items-center justify-center">
                <svg
                  className="mr-1 h-7 w-7 shrink-0 text-blue-700"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 2.002a3.875 3.875 0 0 0-3.875 3.875c0 2.92 1.207 6.552 1.813 8.199a2.19 2.19 0 0 0 2.064 1.423c.904 0 1.739-.542 2.063-1.418c.606-1.64 1.81-5.254 1.81-8.204A3.875 3.875 0 0 0 12 2.002M12.001 17a2.501 2.501 0 1 0 0 5.002a2.501 2.501 0 0 0 0-5.002" />
                </svg>
                <p className="text-center font-medium text-blue-700" style={{ fontSize: '15px' }}>
                  <span className="font-bold">Important!</span> Enter a real email
                  <br />
                  address to receive the report
                </p>
              </div>
              <div
                className="mt-2 rounded bg-white p-2 text-center"
                style={{ fontSize: '10px', color: 'rgb(77, 77, 77)' }}
              >
                Your data is 100% private. We never share or sell data.
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4 w-full">
                <label className="mb-2 block text-sm font-medium text-white">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="block w-full rounded-[5px] border border-gray-200 bg-white px-4 py-3 text-black transition-colors focus:outline-none"
                />
              </div>

              <div className="mt-4 flex items-center">
                <div className="flex h-5 items-center">
                  <input
                    id="marketingOptIn"
                    type="checkbox"
                    checked={marketingOptIn}
                    onChange={(e) => setMarketingOptIn(e.target.checked)}
                    className="h-4 w-4 rounded border border-gray-300 bg-gray-50 accent-[#A61A25] focus:ring-3 focus:ring-[#A61A25]/25"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="marketingOptIn" className="font-medium text-gray-700">
                    Receive emails
                  </label>
                  <p className="text-xs text-gray-500">
                    Get relationship tips, search advice, and updates about new features
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-col">
                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-[5px] bg-[#A61A25] px-6 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-[#8B1722] focus:outline-none"
                  style={headerFont}
                >
                  Get Cheating Report
                </button>
                <div className="mt-3 text-center text-sm">
                  <button
                    type="button"
                    className="cursor-pointer font-medium text-[#A61A25] focus:outline-none"
                  >
                    Already have an account? Log In
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
