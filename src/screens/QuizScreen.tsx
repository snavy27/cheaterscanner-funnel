import { useEffect, useState } from 'react'
import { QuizLayout } from '../components/QuizLayout'

interface QuizScreenProps {
  question: string
  step: number
  progressTotal?: number
  inputPlaceholder?: string
  defaultValue?: string
  options?: { label: string; value: string; icon?: string }[]
  factoid?: { title: string; body: string; desktopLines?: string[] }
  onBack?: () => void
  onSubmit: (value: string) => void
  canProceed?: (value: string) => boolean
  errorForValue?: (value: string) => string | null
  lockNextButton?: boolean
}

const inputClass =
  'block w-full rounded-[5px] border border-gray-200 border-[#A61A25] bg-white px-4 py-3 text-base text-black ring-1 ring-[#A61A25] transition-colors focus:border-[#A61A25] focus:outline-none focus:ring-1 focus:ring-[#A61A25]'

export function QuizScreen({
  question,
  step,
  progressTotal = 5,
  inputPlaceholder,
  defaultValue = '',
  options,
  factoid,
  onBack,
  onSubmit,
  canProceed,
  errorForValue,
  lockNextButton = false,
}: QuizScreenProps) {
  const [value, setValue] = useState(defaultValue)
  const isInput = !options
  const nextDisabled = lockNextButton && canProceed ? !canProceed(value) : false
  const errorMessage = errorForValue ? errorForValue(value) : null

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  const handleNext = () => {
    if (canProceed && !canProceed(value)) return

    const trimmed = value.trim()
    if (!trimmed) return

    onSubmit(trimmed)
  }

  const handleOptionSelect = (optValue: string) => {
    setValue(optValue)
    onSubmit(optValue)
  }

  return (
    <QuizLayout
      step={step}
      total={progressTotal}
      factoid={factoid}
      onBack={onBack}
      onNext={isInput ? handleNext : undefined}
      nextDisabled={isInput ? nextDisabled : false}
    >
      <div className="mx-auto w-full max-w-md">
        <h2
          className="mb-6 text-2xl text-white"
          style={{ fontFamily: 'var(--font-quiz)', fontWeight: 400 }}
        >
          {question}
        </h2>

        {isInput ? (
          <>
            <div className="mb-4 w-full">
              <input
                type={inputPlaceholder?.toLowerCase().includes('age') ? 'number' : 'text'}
                inputMode={inputPlaceholder?.toLowerCase().includes('age') ? 'numeric' : 'text'}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={inputPlaceholder}
                className={inputClass}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
              />
            </div>
            {errorMessage && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] p-3">
                <div className="shrink-0">
                  <svg className="h-5 w-5 text-[#EF4444]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div
                  className="text-sm font-medium text-[#B91C1C]"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  {errorMessage}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3">
            {options!.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleOptionSelect(opt.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-left text-base font-medium text-black transition-colors hover:bg-gray-50"
              >
                <span className="flex items-center gap-3">
                  {opt.icon && <span className="text-xl">{opt.icon}</span>}
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </QuizLayout>
  )
}
