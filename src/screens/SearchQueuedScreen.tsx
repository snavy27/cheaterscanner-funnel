interface SearchQueuedScreenProps {
  onContinue: () => void
}

export function SearchQueuedScreen({ onContinue }: SearchQueuedScreenProps) {
  return (
    <div className="pt-4">
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2FB344]/15 text-3xl">
            ✓
          </div>
        </div>
        <h2 className="font-display mb-2 text-center text-2xl font-bold text-[#1A1A1A]">
          Your Search Has Been Queued!
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500">
          Your payment has been successfully processed and we&apos;ve queued your search.
        </p>

        <h3 className="mb-3 text-sm font-bold text-[#1A1A1A]">Here&apos;s What Happens Next</h3>

        <div className="mb-4 rounded-xl bg-gray-50 p-4">
          <div className="mb-1 font-semibold text-[#1A1A1A]">🤖 AI Search in Progress</div>
          <p className="mb-2 text-xs text-gray-500">Our AI worker is being assigned to your case and will:</p>
          <ul className="space-y-1 text-xs text-gray-600">
            <li>• Change its location to match your search area</li>
            <li>• Adjust age and gender settings as needed</li>
            <li>• Conduct a thorough search using your criteria</li>
          </ul>
        </div>

        <div className="mb-6 rounded-xl bg-gray-50 p-4">
          <div className="mb-1 font-semibold text-[#1A1A1A]">⏱️ Please Be Patient</div>
          <p className="text-xs text-gray-500">
            It can take a few moments for our AI worker to be assigned and for the search to
            complete. This thorough process ensures we provide you with accurate, comprehensive
            results.
          </p>
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-full bg-[#EC3A49] py-3.5 font-bold text-white"
        >
          Continue to Cheater Scanner
        </button>
        <p className="mt-3 text-center text-xs text-gray-400">
          Your search is now active. Click continue to monitor the progress.
        </p>
      </div>
    </div>
  )
}
