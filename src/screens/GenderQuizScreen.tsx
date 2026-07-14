import { useEffect, useState } from 'react'
import { QuizLayout } from '../components/QuizLayout'

interface GenderQuizScreenProps {
  defaultValue?: string
  onSubmit: (gender: string) => void
}

const OPTIONS = ['Male', 'Female'] as const

const labelBaseClass =
  'flex cursor-pointer items-center rounded-lg border border-white p-4 transition-all duration-300'

export function GenderQuizScreen({ defaultValue = '', onSubmit }: GenderQuizScreenProps) {
  const [selected, setSelected] = useState(defaultValue)

  useEffect(() => {
    setSelected(defaultValue)
  }, [defaultValue])

  const handleNext = () => {
    if (!selected) return
    onSubmit(selected)
  }

  return (
    <QuizLayout step={1} onNext={handleNext} nextDisabled={!selected}>
      <div className="mx-auto w-full max-w-md">
        <h2
          className="mb-6 text-2xl text-white"
          style={{ fontFamily: 'var(--font-quiz)', fontWeight: 400 }}
        >
          What&apos;s their gender?
        </h2>

        <div className="space-y-4">
          {OPTIONS.map((option) => {
            const isSelected = selected === option
            return (
              <label
                key={option}
                className={`${labelBaseClass} ${
                  isSelected
                    ? 'translate-y-[-2px] transform shadow-md'
                    : 'hover:bg-opacity-30'
                }`}
                style={{
                  backgroundColor: isSelected ? 'white' : 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <div className="relative mr-4 flex h-5 w-5 items-center justify-center">
                  <div
                    className={`h-5 w-5 rounded-full border-2 ${
                      isSelected ? 'border-[#A61A25]' : 'border-white'
                    }`}
                  />
                  {isSelected && (
                    <div className="absolute h-2.5 w-2.5 rounded-full bg-[#A61A25]" />
                  )}
                  <input
                    type="radio"
                    name="gender"
                    value={option}
                    checked={isSelected}
                    onChange={() => setSelected(option)}
                    className="sr-only"
                  />
                </div>
                <span
                  className="font-bold"
                  style={{ color: isSelected ? '#A61A25' : 'white' }}
                >
                  {option}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </QuizLayout>
  )
}
