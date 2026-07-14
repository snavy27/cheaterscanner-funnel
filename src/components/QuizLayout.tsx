import type { ReactNode } from 'react'
import { QuizLogo } from './QuizLogo'
import { QuizProgressDots } from './QuizProgressDots'

interface QuizLayoutProps {
  step: number
  total?: number
  children: ReactNode
  factoid?: { title: string; body: string; desktopLines?: string[] }
  onBack?: () => void
  onNext?: () => void
  nextDisabled?: boolean
}

export function QuizLayout({
  step,
  total = 5,
  children,
  factoid,
  onBack,
  onNext,
  nextDisabled = false,
}: QuizLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-b from-[#FF6252] via-[#FF5864] to-[#F93A50]">
      <header className="flex items-center justify-center p-2">
        <QuizLogo />
      </header>

      <main className="flex-1">
        <div className="flex flex-col items-center">
          <div className="w-full px-4 pt-2">
            <div className="my-4 flex h-8 items-center justify-center">
              <QuizProgressDots current={step} total={total} />
            </div>

            <div className="relative mt-4 w-full overflow-x-hidden">{children}</div>

            {onBack && (
            <div className="fixed bottom-4 left-4">
              <button
                type="button"
                onClick={onBack}
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-md border border-white bg-transparent font-medium text-white transition-colors hover:bg-white/10 focus:outline-none"
                aria-label="Back"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            )}

            <div className="fixed bottom-4 right-4">
              <button
                type="button"
                onClick={onNext}
                disabled={nextDisabled || !onNext}
                className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-md bg-white text-base font-medium text-[#A61A25] shadow-md transition-colors hover:bg-gray-100 focus:outline-none disabled:opacity-100 ${
                  !onNext ? 'invisible' : ''
                }`}
                aria-label="Next"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {factoid && (
              <div className="fixed bottom-20 left-4 md:left-1/2 md:-translate-x-1/2 md:transform">
                <div className="text-white md:text-center">
                  <div
                    className="mb-3 text-xl font-black"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {factoid.title}
                  </div>
                  <div
                    className="text-base leading-relaxed opacity-90"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {factoid.desktopLines ? (
                      <>
                        <div className="md:hidden">{factoid.body}</div>
                        <div className="hidden md:block">
                          {factoid.desktopLines.map((line) => (
                            <div key={line}>{line}</div>
                          ))}
                        </div>
                      </>
                    ) : (
                      factoid.body
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
