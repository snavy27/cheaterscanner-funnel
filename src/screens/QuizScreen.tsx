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
  lockNextButton = false,
}: QuizScreenProps) {
  const [value, setValue] = useState(defaultValue)
  const isInput = !options
  const nextDisabled = lockNextButton && canProceed ? !canProceed(value) : false

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
