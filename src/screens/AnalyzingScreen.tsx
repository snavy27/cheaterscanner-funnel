import { useEffect, useState } from 'react'

interface AnalyzingScreenProps {
  onComplete: (result: { matches: number; apps: number }) => void
}

const STEPS = [
  { label: 'Scanning dating apps…', duration: 1200 },
  { label: 'Checking Tinder, Bumble, Hinge…', duration: 1500 },
  { label: 'Cross-referencing profiles…', duration: 1000 },
  { label: 'Found 3 matches on 2 apps', duration: 800 },
]

export function AnalyzingScreen({ onComplete }: AnalyzingScreenProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let elapsed = 0
    const totalDuration = STEPS.reduce((s, st) => s + st.duration, 0)

    const interval = setInterval(() => {
      elapsed += 50
      setProgress(Math.min(100, (elapsed / totalDuration) * 100))
    }, 50)

    let currentStep = 0
    const runStep = () => {
      if (currentStep >= STEPS.length) {
        clearInterval(interval)
        setTimeout(() => onComplete({ matches: 3, apps: 2 }), 400)
        return
      }
      setStepIndex(currentStep)
      setTimeout(() => {
        currentStep++
        runStep()
      }, STEPS[currentStep].duration)
    }
    runStep()

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center pt-8">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 animate-pulse-ring">
        <span className="text-4xl">🔍</span>
      </div>
      <h2 className="font-display mb-2 text-center text-2xl font-bold uppercase tracking-wide text-white">
        Analyzing
      </h2>
      <p className="mb-8 text-center text-white/90 transition-all duration-300">
        {STEPS[stepIndex]?.label}
      </p>
      <div className="w-full max-w-xs">
        <div className="h-3 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-center text-sm text-white/70">{Math.round(progress)}%</p>
      </div>
    </div>
  )
}
