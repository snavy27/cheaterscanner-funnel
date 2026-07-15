import { useEffect, useRef } from 'react'
import { SCANNING_REVIEWS, type ScanningReview } from '../data/scanningReviews'

function VerifiedIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="shrink-0" aria-hidden>
      <circle cx="5.5" cy="5.5" r="5" fill="#16A34A" />
      <path
        d="M3 5.5l1.8 1.8 3.2-3.2"
        stroke="#fff"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ReviewCard({ review }: { review: ScanningReview }) {
  return (
    <div
      className="w-[260px] shrink-0 rounded-[14px] p-4"
      style={{
        backgroundColor: '#FF7474',
        border: '0.57px solid rgba(255, 255, 255, 0.1)',
        boxShadow:
          '0px 1px 2px -1px rgba(0,0,0,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1)',
      }}
    >
      <div className="mb-0.5 flex items-center gap-2 text-sm font-bold text-white">
        {review.name}
        <span className="text-xs">⭐⭐⭐⭐⭐</span>
      </div>
      <div
        className="mb-2.5 flex items-center gap-1 text-[11px] font-semibold"
        style={{ color: '#91FFA7' }}
      >
        <VerifiedIcon />
        Verified Customer
      </div>
      <p className="mb-2.5 text-[13px] leading-relaxed text-white">{review.text}</p>
      <p className="text-right text-[11px] text-white">
        {review.location} · {review.time}
      </p>
    </div>
  )
}

export function ScanningReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    let frame = 0
    const tick = () => {
      const el = scrollRef.current
      if (!pausedRef.current && el) {
        el.scrollLeft += 0.5
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0
        }
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const duplicated = [...SCANNING_REVIEWS, ...SCANNING_REVIEWS]

  return (
    <section className="pt-7 pb-10">
      <div className="px-5">
        {/* Live renders these in Arial (site default), not Saira Condensed */}
        <h2 className="mb-2 text-[22px] leading-tight font-extrabold tracking-tight text-white">
          Thousands Have Already
          <br />
          Found The Truth
        </h2>
        <p className="mb-5 text-[13px] font-semibold text-white">
          Excellent ⭐⭐⭐⭐⭐ 4.75 based on 816 reviews
        </p>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={() => {
          pausedRef.current = true
        }}
        onMouseLeave={() => {
          pausedRef.current = false
        }}
        onTouchStart={() => {
          pausedRef.current = true
        }}
        onTouchEnd={() => {
          setTimeout(() => {
            pausedRef.current = false
          }, 3000)
        }}
        className="overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex w-max gap-3">
          {duplicated.map((review, i) => (
            <ReviewCard key={`${review.name}-${i}`} review={review} />
          ))}
        </div>
      </div>
    </section>
  )
}
