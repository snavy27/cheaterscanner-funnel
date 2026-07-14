import { useEffect, useState } from 'react'

const STEPS = [
  {
    header: 'Identify Your Partner',
    title: 'We Learn About Your Partner',
    body: "Our AI securely stores your partner's photo, name, and location to create a detailed profile for scanning.",
    image: '/onboarding-1.png',
    icon: 'user' as const,
  },
  {
    header: 'Scan the Dating Apps',
    title: 'We Scan the Dating Apps',
    body: "CheaterScanner swipes through Tinder, Bumble, and Hinge profiles in your partner's area, just like a real user would—only faster and smarter. We are not affiliated with Tinder, Bumble, or Hinge. All trademarks are property of their respective owners. We only use publicly available information and never use unauthorized scraping or automated access.",
    image: '/onboarding-2.png',
    icon: 'check' as const,
  },
  {
    header: 'Get Alerted Instantly',
    title: 'You Get Instant Alerts',
    body: "If a profile matching your partner is found, you'll receive an immediate notification, complete with screenshots and details.",
    image: '/onboarding-3.png',
    icon: 'info' as const,
  },
] as const

const headerFont = { fontFamily: 'var(--font-display)' }

function StepIcon({ type }: { type: 'user' | 'check' | 'info' }) {
  if (type === 'user') {
    return (
      <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      </svg>
    )
  }
  if (type === 'check') {
    return (
      <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
  return (
    <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  )
}

interface PhotoOnboardingModalProps {
  isOpen: boolean
  onComplete: () => void
  onClose: () => void
}

export function PhotoOnboardingModal({ isOpen, onComplete, onClose }: PhotoOnboardingModalProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const step = STEPS[stepIndex]
  const isLast = stepIndex === STEPS.length - 1

  useEffect(() => {
    if (isOpen) setStepIndex(0)
  }, [isOpen])

  if (!isOpen) return null

  const handleNext = () => {
    if (isLast) {
      onComplete()
      return
    }
    setStepIndex((i) => i + 1)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:p-0">
        <button
          type="button"
          className="fixed inset-0 bg-gray-900/75 transition-opacity"
          aria-label="Skip onboarding"
          onClick={onClose}
        />

        <div className="relative my-8 inline-block w-full max-w-md overflow-hidden rounded-lg bg-white text-left shadow-xl">
          <div className="bg-[#A61A25] px-6 py-4">
            <div className="flex items-center justify-start">
              <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-white">
                <StepIcon type={step.icon} />
              </div>
              <h3 className="text-lg font-bold text-white" style={headerFont}>
                {step.header}
              </h3>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="mb-4">
              <div className="flex items-center justify-center">
                <img
                  src={step.image}
                  alt={step.header}
                  width={200}
                  height={120}
                  className="h-[148px] w-[256px] max-w-full object-contain"
                />
              </div>
            </div>

            <div className="mb-6">
              <h4 className="mb-3 text-xl font-bold text-gray-900" style={headerFont}>
                {step.title}
              </h4>
              <p className="text-sm leading-relaxed text-gray-600">{step.body}</p>
            </div>

            <div className="mb-6 flex justify-center space-x-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full ${i === stepIndex ? 'bg-red-500' : 'bg-gray-300'}`}
                />
              ))}
            </div>

            {stepIndex === 0 ? (
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onComplete}
                  className="flex-1 cursor-pointer rounded-lg bg-white px-6 py-3 text-base font-medium text-[#A61A25] shadow-md transition-colors hover:bg-gray-100 focus:outline-none"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 cursor-pointer rounded-lg bg-[#A61A25] px-6 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-[#8B1722] focus:outline-none"
                  style={headerFont}
                >
                  Next &gt;
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full cursor-pointer rounded-lg bg-[#A61A25] px-6 py-3 text-base font-medium text-white shadow-md transition-colors hover:bg-[#8B1722] focus:outline-none"
                  style={headerFont}
                >
                  {isLast ? 'Got it!' : 'Next >'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
