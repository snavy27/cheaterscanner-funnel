import { useState } from 'react'
import { track } from '../lib/track'
import { useVariant } from '../variant/useVariant'

interface LockedMatchesProps {
  interactive: boolean
  onUnlock: () => void
}

const MATCHES = [
  { id: 1, app: 'Tinder', lastActive: '4 days ago' },
  { id: 2, app: 'Bumble', lastActive: '2 weeks ago' },
  { id: 3, app: 'Hinge', lastActive: 'yesterday' },
]

const AVATARS: Record<number, string> = {
  1: '/images/profile_picture_2.jpeg',
  2: '/images/profile_picture_3.jpeg',
  3: '/images/profile_picture_4.jpeg',
}

const displayStyle = { fontFamily: 'var(--font-display)', letterSpacing: 'normal' as const }

export default function LockedMatches({ interactive, onUnlock }: LockedMatchesProps) {
  const [revealedIds, setRevealedIds] = useState<number[]>([])

  const { activeVariant } = useVariant()
  const rootCopy = activeVariant === 'all' || activeVariant === 'a'
  const heading = rootCopy
    ? 'We found 3 likely potential matches already'
    : 'We found 3 potential matches'
  const subheading = rootCopy
    ? 'And our AI is scanning 12+ more likely matches'
    : 'tap a match to preview'

  const handleTileTap = (match: (typeof MATCHES)[number]) => {
    if (!interactive) return
    track('matches_tile_tapped', { app: match.app })
    if (!revealedIds.includes(match.id)) {
      setRevealedIds((prev) => [...prev, match.id])
      track('match_teaser_revealed', { app: match.app })
    }
  }

  const handleUnlock = () => {
    track('unlock_cta_clicked')
    onUnlock()
  }

  return (
    <section className="w-full text-left">
      <h3 className="text-lg text-white font-bold" style={displayStyle}>
        {heading}
      </h3>
      {interactive && (
        <p className="text-xs text-white/70 mt-0.5 mb-3">{subheading}</p>
      )}
      {!interactive && <div className="mb-3" />}

      <div className="grid grid-cols-3 gap-2 items-start">
        {MATCHES.map((match) => {
          const revealed = interactive && revealedIds.includes(match.id)

          const tileContent = (
            <>
              <div className="relative aspect-3/4 rounded-xl overflow-hidden bg-gray-200">
                <img
                  src={AVATARS[match.id]}
                  alt="Obscured match profile"
                  draggable={false}
                  /* scale keeps blurred edges from showing the container background */
                  className={`absolute inset-0 w-full h-full object-cover scale-110 transition-all duration-500 ease-out ${
                    revealed ? 'blur-sm' : 'blur-md'
                  }`}
                />
                <div className="absolute top-1.5 left-1.5 bg-white/90 text-gray-800 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                  {match.app}
                </div>
                {interactive && !revealed && (
                  <div className="absolute inset-0 flex items-end justify-center pb-2">
                    <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap">
                      🔒 Tap to unlock
                    </span>
                  </div>
                )}
              </div>
              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  revealed ? 'max-h-16 opacity-100 mt-1.5' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-[10px] leading-snug text-white/90 text-center">
                  Match found on <span className="font-semibold text-white">{match.app}</span>{' '}
                  · active {match.lastActive}
                </p>
              </div>
            </>
          )

          if (!interactive) {
            return <div key={match.id}>{tileContent}</div>
          }

          return (
            <button
              key={match.id}
              type="button"
              onClick={() => handleTileTap(match)}
              className="block w-full text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0454A] rounded-xl"
              aria-label={`Preview match found on ${match.app}`}
            >
              {tileContent}
            </button>
          )
        })}
      </div>

      {interactive && (
        <div className="sticky bottom-3 z-10 mt-3">
          <button
            type="button"
            onClick={handleUnlock}
            className="w-full bg-[#EC3A49] border border-white/40 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center"
            style={displayStyle}
          >
            <span className="text-base">Unlock full report</span>
            <span className="ml-2" aria-hidden>
              →
            </span>
          </button>
        </div>
      )}
    </section>
  )
}
