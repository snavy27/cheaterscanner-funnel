import { useRef, useState } from 'react'
import { EmailAuthModal } from '../components/EmailAuthModal'
import { PhotoOnboardingModal } from '../components/PhotoOnboardingModal'
import { PrePaywallLoadingOverlay } from '../components/PrePaywallLoadingOverlay'
import { QuizLayout } from '../components/QuizLayout'

interface PhotoUploadScreenProps {
  step: number
  progressTotal?: number
  partnerName?: string
  defaultEmail?: string
  /** change1: true → full scanning animation before the email modal; false → email first (live order) */
  loadingBeforeEmail: boolean
  onBack?: () => void
  onContinue: (uploaded: boolean) => void
  onEmailSubmit: (email: string) => void
}

const CELL_COUNT = 6

const cellClass =
  'relative flex aspect-square cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-white/40 backdrop-blur-sm transition-all duration-300 hover:border-[#FF8986] hover:bg-white/5 hover:shadow-lg'

const iconCircleClass =
  'flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20'

function UploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden
    >
      <path d="M12 3v12" />
      <path d="m17 8-5-5-5 5" />
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    </svg>
  )
}

export function PhotoUploadScreen({
  step,
  progressTotal = 5,
  partnerName = 'Unknown',
  defaultEmail,
  loadingBeforeEmail,
  onBack,
  onContinue,
  onEmailSubmit,
}: PhotoUploadScreenProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showScanning, setShowScanning] = useState(false)
  const submittedEmailRef = useRef('')

  const handleFile = () => {
    onContinue(true)
  }

  const handleNext = () => {
    setShowOnboarding(true)
  }

  const handleOnboardingDone = () => {
    setShowOnboarding(false)
    if (loadingBeforeEmail) {
      setShowScanning(true)
    } else {
      setShowEmailModal(true)
    }
  }

  const handleLoadingComplete = () => {
    if (loadingBeforeEmail) {
      // change1: keep the scan screen mounted (blurred) behind the email modal
      setShowEmailModal(true)
    } else {
      setShowScanning(false)
      onEmailSubmit(submittedEmailRef.current)
    }
  }

  const handleEmailSubmit = (email: string) => {
    setShowEmailModal(false)
    if (loadingBeforeEmail) {
      onEmailSubmit(email)
    } else {
      submittedEmailRef.current = email
      setShowScanning(true)
    }
  }

  const openFilePicker = () => {
    fileRef.current?.click()
  }

  return (
    <QuizLayout step={step} total={progressTotal} onBack={onBack} onNext={handleNext}>
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <h2
            className="mb-2 text-sm text-white"
            style={{ fontFamily: 'var(--font-quiz)', fontWeight: 400 }}
          >
            [ Optional ]
          </h2>
          <h3
            className="text-2xl font-bold text-white"
            style={{ fontFamily: 'var(--font-quiz)', fontWeight: 400 }}
          >
            Facial Recognition to Search
          </h3>
        </div>

        <div className="w-full">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/heic"
            multiple
            className="hidden"
            onChange={handleFile}
          />

          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: CELL_COUNT }).map((_, i) => (
              <div
                key={i}
                role="button"
                tabIndex={0}
                onClick={openFilePicker}
                onKeyDown={(e) => e.key === 'Enter' && openFilePicker()}
                className={cellClass}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className={iconCircleClass}>
                    <UploadIcon />
                  </div>
                  {i === 0 && (
                    <span
                      className="text-center text-xs font-medium tracking-wide text-white/80"
                      style={{ fontFamily: 'var(--font-body)' }}
                    >
                      Add photos
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PhotoOnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingDone}
        onClose={handleOnboardingDone}
      />
      {showScanning && (
        <PrePaywallLoadingOverlay
          name={partnerName}
          blurred={showEmailModal}
          onComplete={handleLoadingComplete}
        />
      )}
      {/* Rendered after the overlay so the modal stacks on top of the blurred scan screen */}
      <EmailAuthModal
        isOpen={showEmailModal}
        defaultEmail={defaultEmail}
        onSubmit={handleEmailSubmit}
        onClose={() => setShowEmailModal(false)}
      />
    </QuizLayout>
  )
}
