interface ThankYouScreenProps {
  planName: string
  onContinue: () => void
}

export function ThankYouScreen({ planName, onContinue }: ThankYouScreenProps) {
  return (
    <div className="flex min-h-[60dvh] flex-col items-center justify-center pt-8 text-center text-white">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-4xl">
        ✓
      </div>
      <h1 className="font-display mb-2 text-3xl font-bold uppercase tracking-wide">
        You&apos;re In!
      </h1>
      <p className="mb-2 text-white/90">
        Your <strong>{planName}</strong> scan is now active.
      </p>
      <p className="mb-8 max-w-sm text-sm text-white/70">
        We&apos;re scanning dating apps right now. Your full report will arrive in your inbox within
        minutes.
      </p>
      <button
        type="button"
        onClick={onContinue}
        className="rounded-2xl bg-white px-8 py-3 font-bold text-[#F0454A]"
      >
        Continue →
      </button>
    </div>
  )
}
