import { useEffect, useState } from 'react'
import { QuizLayout } from '../components/QuizLayout'

const DEFAULT_LOCATION = 'Paris, Île-de-France, 75000, France'

export { DEFAULT_LOCATION }

const inputClass =
  'block w-full rounded-[5px] border border-gray-200 border-[#A61A25] bg-white px-4 py-3 text-base text-black ring-1 ring-[#A61A25] transition-colors focus:border-[#A61A25] focus:outline-none focus:ring-1 focus:ring-[#A61A25]'

interface LocationScreenProps {
  step?: number
  progressTotal?: number
  defaultValue?: string
  onBack?: () => void
  onSubmit: (location: string) => void
}

export function LocationScreen({
  step = 4,
  progressTotal = 5,
  defaultValue = DEFAULT_LOCATION,
  onBack,
  onSubmit,
}: LocationScreenProps) {
  const [location, setLocation] = useState(defaultValue)

  useEffect(() => {
    setLocation(defaultValue)
  }, [defaultValue])

  return (
    <QuizLayout step={step} total={progressTotal} onBack={onBack} onNext={() => onSubmit(location)}>
      <div className="mx-auto w-full max-w-md">
        <h2
          className="mb-6 text-2xl text-white"
          style={{ fontFamily: 'var(--font-quiz)', fontWeight: 400 }}
        >
          Add a location where they might be active
        </h2>

        <div className="w-full space-y-4 overflow-hidden">
          <div className="relative w-full">
            <div className="mb-4 w-full">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter address, city, or landmark"
                aria-label="Location"
                className={inputClass}
                onKeyDown={(e) => e.key === 'Enter' && onSubmit(location)}
              />
            </div>
          </div>

          <div className="w-full overflow-hidden rounded-lg">
            <div
              className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-300 bg-gray-100"
              aria-label="Map of selected location"
            >
              <LocationMap />
            </div>
          </div>

          <p className="mt-1 text-sm text-white/80">
            Enter the person&apos;s last known location
          </p>
        </div>
      </div>
    </QuizLayout>
  )
}

function LocationMap() {
  return (
    <svg
      viewBox="0 0 600 300"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <rect width="600" height="300" fill="#f3f4f6" />

      {/* Parks */}
      <rect x="30" y="40" width="110" height="80" fill="#c8e6c9" rx="2" />
      <rect x="420" y="180" width="90" height="70" fill="#c8e6c9" rx="2" />
      <rect x="180" y="220" width="70" height="50" fill="#c8e6c9" rx="2" />

      {/* Seine river */}
      <path
        d="M-20 200 C 100 170, 180 220, 280 150 S 420 110, 620 140"
        fill="none"
        stroke="#90caf9"
        strokeWidth="22"
        opacity="0.9"
      />
      <path
        d="M-20 215 C 100 185, 180 235, 280 165 S 420 125, 620 155"
        fill="none"
        stroke="#64b5f6"
        strokeWidth="8"
        opacity="0.5"
      />

      {/* City blocks */}
      <rect x="160" y="50" width="60" height="45" fill="#e5e7eb" />
      <rect x="240" y="70" width="80" height="55" fill="#e5e7eb" />
      <rect x="340" y="40" width="55" height="70" fill="#e5e7eb" />
      <rect x="300" y="170" width="90" height="40" fill="#e5e7eb" />
      <rect x="80" y="150" width="70" height="50" fill="#e5e7eb" />
      <rect x="450" y="60" width="65" height="45" fill="#e5e7eb" />

      {/* Major roads */}
      <rect x="0" y="130" width="600" height="8" fill="#ffffff" opacity="0.9" />
      <rect x="200" y="0" width="6" height="300" fill="#ffffff" opacity="0.85" />
      <rect x="380" y="0" width="5" height="300" fill="#ffffff" opacity="0.8" />
      <line x1="50" y1="0" x2="250" y2="300" stroke="#ffffff" strokeWidth="4" opacity="0.7" />
      <line x1="350" y1="0" x2="550" y2="300" stroke="#ffffff" strokeWidth="3" opacity="0.6" />

      {/* Secondary roads */}
      <line x1="0" y1="80" x2="600" y2="80" stroke="#ffffff" strokeWidth="3" opacity="0.5" />
      <line x1="0" y1="240" x2="600" y2="240" stroke="#ffffff" strokeWidth="3" opacity="0.5" />
      <line x1="120" y1="0" x2="120" y2="300" stroke="#ffffff" strokeWidth="2" opacity="0.45" />
      <line x1="480" y1="0" x2="480" y2="300" stroke="#ffffff" strokeWidth="2" opacity="0.45" />

      {/* Map pin */}
      <g transform="translate(300 118)">
        <circle cx="0" cy="0" r="14" fill="#e53935" stroke="#fff" strokeWidth="2" />
        <circle cx="0" cy="0" r="5" fill="#fff" />
        <path d="M 0 14 L -8 32 L 8 32 Z" fill="#e53935" />
      </g>
    </svg>
  )
}
