interface GenderCardProps {
  label: 'Female' | 'Male'
  onClick: () => void
}

export function GenderCard({ label, onClick }: GenderCardProps) {
  const isFemale = label === 'Female'

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-[133px] w-[133px] cursor-pointer overflow-hidden rounded-[10px] border border-white transition-transform duration-200 hover:scale-[1.02]"
      style={{ backgroundColor: isFemale ? '#F6E3FF' : '#E6F7FF' }}
    >
      <div
        className={`absolute flex items-center ${isFemale ? 'left-[10px] top-[12px] gap-[3px]' : 'left-[11px] top-[13px] gap-[5px]'}`}
      >
        <div className="h-[10px] w-[10px] rounded-full border-[0.8px] border-[#A61A25]" />
        <span
          className="text-[11px] font-bold leading-[14px] text-[#A61A25]"
          style={{ fontFamily: 'var(--font-condensed)', letterSpacing: '-0.1px' }}
        >
          {label}
        </span>
      </div>

      {isFemale ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden
          width="105"
          height="105"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-[42px] top-[52px]"
          style={{ color: '#CE63FF' }}
        >
          <g fill="none">
            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
            <path
              fill="currentColor"
              d="M7 9.5a7.5 7.5 0 1 1 2.942 5.957l-1.788 1.787L9.58 18.67a1 1 0 1 1-1.414 1.414L6.74 18.659l-2.12 2.12a1 1 0 0 1-1.414-1.415l2.12-2.12l-1.403-1.403a1 1 0 1 1 1.414-1.414L6.74 15.83l1.79-1.79A7.47 7.47 0 0 1 7 9.5"
            />
          </g>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-hidden
          width="117"
          height="117"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute left-[41px] top-[43px]"
          style={{ color: '#36C3FF' }}
        >
          <path
            fill="currentColor"
            d="M16 3.25a.75.75 0 0 0 0 1.5h2.185l-3.982 3.968a6.75 6.75 0 1 0 1.063 1.059l3.984-3.97V8a.75.75 0 0 0 1.5 0V4a.75.75 0 0 0-.75-.75z"
          />
        </svg>
      )}
    </button>
  )
}
