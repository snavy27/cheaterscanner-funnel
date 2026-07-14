import { useState, type ReactNode } from 'react'
import { useOfferTimer } from '../lib/offerTimer'
import type { UpsellFaq } from '../data/upsellContent'

interface UpsellModalProps {
  children: ReactNode
  faqs: UpsellFaq[]
  onBack?: () => void
  onClose?: () => void
}

export function UpsellModal({ children, faqs, onBack, onClose }: UpsellModalProps) {
  const { display } = useOfferTimer()
  const [openFaq, setOpenFaq] = useState<number>(-1)

  return (
    // Same structure/classes as the live modal overlay
    <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#A61A25] pt-[env(safe-area-inset-top)] sm:items-center sm:justify-center sm:bg-white sm:pt-4">
      <div className="flex h-full w-full flex-col overflow-y-auto bg-white sm:max-h-[90vh] sm:max-w-md sm:rounded-xl sm:shadow-2xl">
        {/* Red header bar */}
        <div className="relative flex shrink-0 items-center justify-center bg-[#A61A25] px-4 py-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="absolute left-4 text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <img
            src="/upsells/cheaterscanner-white.png"
            alt="Cheater Scanner"
            className="h-3.5 w-auto"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Offer countdown bar */}
        <div className="flex shrink-0 items-center justify-center gap-2 border-b border-gray-200 bg-[#F3F4F6] py-2.5 text-sm text-gray-700">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>Personalized offer expires in</span>
          <span className="font-bold text-[#EC3A49]">{display} mins</span>
        </div>

        {/* Scrollable body — live: div.flex-1.overflow-y-auto > div.px-4.pb-6 > div.py-4 */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pb-6">
            <div className="py-4">{children}</div>

            {/* FAQ accordion */}
            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-display mb-1 text-lg font-bold text-[#1A1A1A]">
                Have a Question?
              </h3>
              <p className="mb-4 text-xs text-gray-500">
                We&apos;ve answered the most common questions to help you feel confident and
                secure.
              </p>
              <div className="divide-y divide-gray-100">
                {faqs.map((faq, i) => {
                  const isOpen = openFaq === i
                  return (
                    <div key={faq.q}>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? -1 : i)}
                        className="flex w-full items-center justify-between py-3 text-left"
                      >
                        <span className="text-sm font-semibold text-[#1A1A1A]">{faq.q}</span>
                        <span className={`text-xl ${isOpen ? 'text-[#EC3A49]' : 'text-gray-400'}`}>
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? 'max-h-60 pb-3 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <p className="text-xs leading-relaxed text-gray-500">{faq.a}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
