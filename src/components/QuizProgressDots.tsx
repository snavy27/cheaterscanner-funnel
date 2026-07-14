interface QuizProgressDotsProps {
  current: number
  total?: number
}

export function QuizProgressDots({ current, total = 5 }: QuizProgressDotsProps) {
  return (
    <div className="flex gap-x-1">
      {Array.from({ length: total }).map((_, i) => {
        const step = i + 1
        const isActive = step === current
        return (
          <div key={step} className="relative flex h-5 w-5 items-center justify-center">
            <div
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-all duration-300 ${
                isActive ? 'h-3 w-3 opacity-100' : 'h-1.5 w-1.5 opacity-20'
              }`}
            />
          </div>
        )
      })}
    </div>
  )
}
