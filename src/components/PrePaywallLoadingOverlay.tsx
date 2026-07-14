import { useEffect, useRef, useState } from 'react'
import { ScanningReviewsSection } from './ScanningReviewsSection'
import {
  LucideCheck,
  LucideLoaderCircle,
  LucideShield,
  LucideTriangleAlert,
} from './ScanningIcons'

const CHECK_ITEMS = [
  { id: 1, label: 'Dating Profile Verification' },
  { id: 2, label: 'Tinder Profile Scan' },
  { id: 3, label: 'Bumble Activity Check' },
  { id: 4, label: 'Hinge Account Lookup' },
  { id: 5, label: 'Social Media Cross-Check' },
  { id: 6, label: 'Relationship History' },
  { id: 7, label: 'Hidden Accounts Search' },
  { id: 8, label: 'Location Cross-Reference' },
] as const

type AlertLevel = 'red' | 'yellow' | 'green'
type ItemStatus = 'pending' | 'scanning' | 'complete'

const ALERT_STYLES = {
  red: {
    dot: 'bg-red-500',
    ring: 'bg-red-100',
    text: 'text-red-700',
    iconColor: 'text-red-500',
    showIcon: true,
  },
  yellow: {
    dot: 'bg-yellow-500',
    ring: 'bg-yellow-100',
    text: 'text-yellow-700',
    iconColor: 'text-yellow-500',
    showIcon: true,
  },
  green: {
    dot: 'bg-green-600',
    ring: 'bg-green-100',
    text: 'text-green-700',
    iconColor: '',
    showIcon: false,
  },
} as const

function randomAlertConfig(): Record<number, AlertLevel> {
  const ids = CHECK_ITEMS.map((item) => item.id)
  const redCandidates = [2, 3, 4] as const
  const guaranteedRed = redCandidates[Math.floor(Math.random() * redCandidates.length)]
  const extraRedCount = 1 + Math.floor(Math.random() * 2)
  const extraReds = new Set(
    ids
      .filter((id) => id !== guaranteedRed)
      .sort(() => Math.random() - 0.5)
      .slice(0, extraRedCount),
  )

  const config: Record<number, AlertLevel> = {}
  for (const id of ids) {
    if (id === guaranteedRed) {
      config[id] = 'red'
    } else if (extraReds.has(id)) {
      config[id] = Math.random() > 0.5 ? 'red' : 'yellow'
    } else {
      config[id] = 'green'
    }
  }
  return config
}

function ProfileAvatar({ isScanning }: { isScanning: boolean }) {
  return (
    <div className="relative shrink-0">
      <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-gray-200 to-gray-300 ring-2 ring-[#FA4154] ring-offset-2 sm:h-20 sm:w-20">
        <svg viewBox="0 0 80 80" className="h-full w-full opacity-40" fill="none" aria-hidden>
          <circle cx="40" cy="30" r="16" fill="#6B7280" />
          <ellipse cx="40" cy="70" rx="24" ry="18" fill="#6B7280" />
        </svg>
        {isScanning && <div className="deep-scan-shimmer absolute inset-0 rounded-full" />}
      </div>
      <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-yellow-400 shadow-md sm:h-7 sm:w-7">
        <LucideShield className="h-3.5 w-3.5 text-yellow-900 sm:h-4 sm:w-4" />
      </div>
    </div>
  )
}

function PublicScoreRing({ score }: { score: number }) {
  const dash = (score / 10) * 175.93
  return (
    <div className="flex shrink-0 flex-col items-center">
      <div className="mb-1 flex items-center gap-1 text-xs text-gray-500">
        <LucideShield className="h-3 w-3" />
        Public Score
      </div>
      <div className="relative h-14 w-14 sm:h-16 sm:w-16">
        <svg
          className="h-14 w-14 -rotate-90 transform sm:h-16 sm:w-16"
          viewBox="0 0 64 64"
          aria-hidden
        >
          <circle cx="32" cy="32" r="28" stroke="#E5E7EB" strokeWidth="6" fill="none" />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="#FA4154"
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${dash} 175.93`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold text-black sm:text-lg">{score}</span>
        </div>
      </div>
    </div>
  )
}

function ScanningHeader({
  name,
  progress,
  isDone,
}: {
  name: string
  progress: number
  isDone: boolean
}) {
  const displayProgress = isDone ? 100 : Math.min(Math.round(progress), 99)

  return (
    <div className="mb-8 w-full">
      <h1 className="text-[28px] font-bold leading-tight text-white md:text-[40px]">
        {isDone ? 'Report Ready' : 'Scanning Dating Apps'}
      </h1>
      <p className="mt-2 mb-6 text-[14px] text-white md:text-[16px]">
        {isDone
          ? `Full background report compiled for ${name}`
          : `Compiling full background report for ${name}`}
      </p>
      <div className="flex w-full items-center gap-3">
        <div className="relative h-3 flex-1 overflow-hidden">
          <div className="absolute inset-0 flex items-center">
            <div className="h-3 w-full rounded-full bg-white/20" />
            <div
              className={`absolute top-1/2 left-0 h-3 -translate-y-1/2 rounded-full transition-all duration-300 ease-linear ${
                isDone ? 'bg-green-500' : 'bg-white'
              }`}
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>
        <div className="flex w-[120px] shrink-0 items-center justify-start">
          <span className="text-[14px] font-bold text-white sm:text-base">{displayProgress}%</span>
          <span className="ml-1 text-[14px] font-bold text-white sm:text-base">Complete</span>
        </div>
      </div>
    </div>
  )
}

function ChecklistItem({
  label,
  status,
  alertLevel,
}: {
  label: string
  status: ItemStatus
  alertLevel: AlertLevel
}) {
  const style = ALERT_STYLES[alertLevel]
  const isComplete = status === 'complete'
  const isScanning = status === 'scanning'

  const textClass = isComplete ? style.text : isScanning ? 'text-[#FA4154]' : 'text-gray-400'

  return (
    <div className={`flex items-center gap-3 text-sm transition-all duration-500 ${textClass}`}>
      <div className="relative shrink-0">
        {isComplete ? (
          <div className={`flex h-5 w-5 items-center justify-center rounded-full ${style.ring}`}>
            <div className={`h-2 w-2 rounded-full ${style.dot}`} />
          </div>
        ) : isScanning ? (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#FA4154]" />
          </div>
        ) : (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
            <div className="h-2 w-2 rounded-full bg-gray-400" />
          </div>
        )}
      </div>
      <span className={`flex items-center gap-1 font-medium ${isComplete ? 'font-semibold' : ''}`}>
        {label}
        {isComplete && style.showIcon && (
          <LucideTriangleAlert className={`h-3.5 w-3.5 shrink-0 ${style.iconColor}`} />
        )}
      </span>
    </div>
  )
}

interface PrePaywallLoadingOverlayProps {
  name: string
  durationMs?: number
  /** Blurs the scan screen while a modal (e.g. the email gate) sits on top of it */
  blurred?: boolean
  onComplete: () => void
}

export function PrePaywallLoadingOverlay({
  name,
  durationMs = 15000,
  blurred = false,
  onComplete,
}: PrePaywallLoadingOverlayProps) {
  const [progress, setProgress] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [alertConfig] = useState(randomAlertConfig)
  const [publicScore] = useState(() => +(Math.random() * 2 + 2.8).toFixed(1))
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const displayScore = +((progress / 100) * publicScore).toFixed(1)
  const itemStep = 100 / CHECK_ITEMS.length

  useEffect(() => {
    const increment = 100 / Math.max(durationMs / 350, 1)
    let current = 0
    const interval = setInterval(() => {
      current = Math.min(current + increment, 100)
      setProgress(Math.round(current))
      if (current >= 100) {
        clearInterval(interval)
        setTimeout(() => setIsDone(true), 50)
      }
    }, 350)
    return () => clearInterval(interval)
  }, [durationMs])

  const getItemStatus = (id: number, index: number): ItemStatus => {
    const isComplete = progress >= (index + 1) * itemStep
    if (isComplete) return 'complete'
    if (progress > (id - 1) * itemStep) return 'scanning'
    return 'pending'
  }

  const handleCtaClick = () => {
    if (!isDone || isLoading) return
    setIsLoading(true)
    onCompleteRef.current()
  }

  // Re-arm the CTA when the modal on top closes, so the user can reopen it
  useEffect(() => {
    if (!blurred) setIsLoading(false)
  }, [blurred])

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#FF6252] via-[#FF5864] to-[#F93A50] transition-[filter] duration-300 ${
        blurred ? 'blur-sm' : ''
      }`}
    >
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <ScanningHeader name={name} progress={progress} isDone={isDone} />

        <div
          className="mb-8 rounded-2xl p-6 shadow-sm md:p-8"
          style={{ backgroundColor: '#FFBBBA' }}
        >
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <ProfileAvatar isScanning={!isDone} />
              <PublicScoreRing score={displayScore} />
            </div>
            <h2 className="mb-0.5 text-base font-bold text-gray-900 sm:text-lg md:text-xl">
              Retrieving Owner Information for
            </h2>
            <p className="text-sm font-semibold text-gray-800 sm:text-base md:text-lg">{name}</p>
            <p className="mt-1 text-xs text-gray-500">
              Please be patient while we search billions of records. Your search history is secure
              and private.
            </p>
          </div>

          <div className="mb-4 rounded-xl p-4" style={{ backgroundColor: '#FBEAEB' }}>
            <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900 transition-all duration-300">
              {isDone ? (
                <LucideCheck className="h-5 w-5 shrink-0 text-gray-900" />
              ) : (
                <LucideLoaderCircle className="h-5 w-5 shrink-0 animate-spin text-gray-900" />
              )}
              {isDone ? 'Background Check Complete' : 'Background Check in Progress'}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {CHECK_ITEMS.map((item, index) => (
                <ChecklistItem
                  key={item.id}
                  label={item.label}
                  status={getItemStatus(item.id, index)}
                  alertLevel={alertConfig[item.id] ?? 'green'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ScanningReviewsSection />

      <div className="h-32" aria-hidden />

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#F93A50] via-[#F93A50]/90 to-transparent px-4 pt-8 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={handleCtaClick}
          disabled={!isDone || isLoading}
          className={`pointer-events-auto relative mx-auto block h-[60px] w-full max-w-sm overflow-hidden rounded-full transition-all duration-300 ${
            isDone ? 'cursor-pointer opacity-100 shadow-2xl' : 'cursor-not-allowed opacity-60'
          } ${isLoading ? 'cursor-wait' : ''}`}
          style={{
            backgroundColor: '#A61A25',
            animation: isDone && !isLoading ? 'cta-pulse 1.6s ease-in-out infinite' : undefined,
          }}
        >
          <div
            className="absolute inset-0 bg-white transition-opacity duration-300"
            style={{ opacity: isDone ? 1 : 0.69 }}
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2">
            {(isLoading || !isDone) && (
              <span
                className="h-5 w-5 animate-spin rounded-full border-2 border-[#FA4154] border-t-transparent"
                aria-hidden
              />
            )}
            <span
              className="text-[20px] font-bold"
              style={{ fontFamily: 'var(--font-display)', color: '#FA4154' }}
            >
              {isLoading ? 'LOADING…' : isDone ? 'SEE FULL REPORT →' : 'SCANNING…'}
            </span>
          </div>
        </button>
      </div>
    </div>
  )
}
