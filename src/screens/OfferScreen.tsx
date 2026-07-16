import { useEffect, useState } from 'react'
import LockedMatches from '../components/LockedMatches'
import { PlanCards } from '../components/PlanCards'
import { SubscriptionCta } from '../components/SubscriptionCta'
import {
  LucideArrowRight,
  LucideBan,
  LucideCircleAlert,
  LucideCircleQuestionMark,
  LucideClock,
  LucideCreditCard,
  LucideDollarSign,
  LucideCheck,
  LucideMapPin,
  LucidePackage,
  LucideSearch,
  LucideStar,
} from '../components/SubscriptionIcons'
import { LucideShield } from '../components/ScanningIcons'
import {
  EBOOK_BULLETS,
  PRESS_LOGOS,
  SUBSCRIPTION_FAQS,
  SUBSCRIPTION_TESTIMONIALS,
  TRUST_BADGES,
  WHY_YOU_NEED,
} from '../data/subscriptionContent'
import { useOfferTimer } from '../lib/offerTimer'
import { PLANS, formatEuro, getOrderTotal, getPlanById } from '../lib/plans'
import { track } from '../lib/track'
import { useVariant } from '../variant/useVariant'

interface OfferScreenProps {
  selectedPlanId: string
  partnerName?: string
  partnerAge?: string
  partnerLocation?: string
  onPlanSelect?: (planId: string) => void
  onCheckout: (source: string) => void
}

const GALLERY_IMAGES = [
  '/images/profile_picture_1.jpeg',
  '/images/profile_picture_2.jpeg',
  '/images/profile_picture_3.jpeg',
  '/images/profile_picture_4.jpeg',
  '/images/profile_picture_5.jpg',
]

function WhyIcon({ type }: { type: (typeof WHY_YOU_NEED)[number]['icon'] }) {
  const cls = 'w-5 h-5 text-[#FF635F]'
  switch (type) {
    case 'ban':
      return <LucideBan className={cls} />
    case 'alert':
      return <LucideCircleAlert className={cls} />
    case 'dollar':
      return <LucideDollarSign className={cls} />
    case 'clock':
      return <LucideClock className={cls} />
  }
}

function StickyHeader({ onGetAccess }: { onGetAccess: () => void }) {
  const { isActive, display } = useOfferTimer()

  if (!isActive) return null

  return (
    <div className="sticky top-0 z-50 w-full bg-gradient-to-b from-[#FF6252] via-[#FF5864] to-[#F93A50] text-white py-2 px-2 sm:px-4 flex items-center justify-between">
      <div className="flex items-center">
        <LucideClock className="w-4 h-4 mr-1.5 text-white opacity-90" />
        <span className="font-bold text-sm sm:text-base font-display">Limited Time Offer:</span>
        <div className="ml-1.5 sm:ml-2 bg-white/20 backdrop-blur-sm text-white rounded-lg px-2 py-1 font-mono font-bold border border-white/30 text-sm">
          {display}
        </div>
      </div>
      <button
        type="button"
        onClick={onGetAccess}
        className="bg-white hover:bg-white/90 text-[#F93A50] font-bold px-2 sm:px-4 py-1.5 rounded-lg transition-colors shadow-md flex items-center border border-white/50 text-xs sm:text-sm font-display"
      >
        Get Access Now
        <LucideArrowRight className="w-3.5 h-3.5 ml-1" />
      </button>
    </div>
  )
}

function TrustBadgeIcon({ type }: { type: (typeof TRUST_BADGES)[number]['icon'] }) {
  const size = 'w-4 h-4 sm:w-5 sm:h-5 text-[#FF635F]'
  switch (type) {
    case 'shield':
      return <LucideShield className={`lucide lucide-shield ${size}`} />
    case 'credit-card':
      return <LucideCreditCard className={`lucide lucide-credit-card ${size}`} />
    case 'circle-question':
      return <LucideCircleQuestionMark className={`lucide lucide-circle-question-mark ${size}`} />
  }
}

export function OfferScreen({
  selectedPlanId,
  partnerName,
  partnerAge,
  partnerLocation,
  onPlanSelect,
  onCheckout,
}: OfferScreenProps) {
  const [tracked, setTracked] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const plan = getPlanById(selectedPlanId)
  const chargeTotal = formatEuro(getOrderTotal(plan))
  const renewalTotal = formatEuro(plan.originalPrice + plan.tax * 2)

  const { activeVariant, changes } = useVariant()
  const matchesInteractive = changes.change3
  const plansEvident = changes.change5
  const showDateRows = activeVariant !== 'all' && activeVariant !== 'a'

  const displayName = partnerName?.trim() || 'Unknown'
  const displayAge = partnerAge?.trim() || '25'
  const displayLocation = partnerLocation?.trim() || 'Unknown location'

  useEffect(() => {
    if (!tracked) {
      track('$pageview', { path: '/subscription' })
      track('offer_view')
      setTracked(true)
    }
  }, [tracked])

  const scrollToPlans = () => {
    document.getElementById('subscription-plans')?.scrollIntoView({ behavior: 'smooth' })
  }

  // change5: selecting a plan only selects it — proceeding to checkout
  // still requires tapping a CTA.
  const handlePlanSelect = (planId: string) => {
    const selected = getPlanById(planId)
    track('plan_selected', { plan_name: selected.name, plan_price: selected.salePrice })
    onPlanSelect?.(planId)
  }

  return (
    <div className="min-h-screen bg-white">
      <main>
        <div className="bg-white relative">
          <StickyHeader onGetAccess={scrollToPlans} />

          <div className="flex flex-col bg-white text-white">
            {/* Search results hero */}
            <div className="w-full bg-[#FF635F]">
              <div className="max-w-lg mx-auto w-full">
                <div className="p-3 sm:p-4 pt-4 sm:pt-5 pb-2">
                  <div className="text-xs sm:text-sm opacity-80 mb-1 flex items-center">
                    <LucideSearch className="w-3.5 h-3.5 mr-1.5" />
                    We searched for:
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2">
                    <div className="relative w-12 sm:w-14 h-12 sm:h-14 rounded-md overflow-hidden flex-shrink-0 bg-gray-300">
                      <img
                        src="/images/profile_picture_1.jpeg"
                        alt="Profile"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-base">
                        {displayName}, {displayAge} yr old
                      </div>
                      <div className="flex items-center text-xs">
                        <LucideMapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{displayLocation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient section */}
            <div className="w-full bg-gradient-to-b from-[#FF6252] via-[#FF5864] to-[#F93A50]">
              <div className="max-w-lg mx-auto w-full p-3 sm:p-4">
                {/* Profile gallery */}
                <div className="px-3 sm:px-4 mb-6 sm:mb-8 mt-1">
                  <div className="rounded-lg">
                    {!matchesInteractive && (
                      <div className="font-bold text-center p-1 mb-3 border rounded-[10px] text-white border-[rgba(255,255,255,0.4)]">
                        <span className="text-xs sm:text-sm font-normal">Potential matches: </span>
                        <span className="text-xs sm:text-sm font-display">15+ Profiles</span>
                      </div>
                    )}
                    {/* change3 swaps the static gallery for interactive LockedMatches */}
                    {!matchesInteractive && (
                      <div className="flex gap-1.5 sm:gap-2">
                        <div className="relative w-[45%] aspect-[5/6] rounded-lg overflow-hidden">
                          <img
                            src={GALLERY_IMAGES[0]}
                            alt="Profile"
                            className="absolute inset-0 w-full h-full object-cover blur-md"
                            draggable={false}
                          />
                        </div>
                        <div className="w-[55%] grid grid-cols-2 gap-1.5 sm:gap-2">
                          {GALLERY_IMAGES.slice(1).map((src) => (
                            <div key={src} className="relative aspect-square rounded-lg overflow-hidden">
                              <img
                                src={src}
                                alt="Profile"
                                className="absolute inset-0 w-full h-full object-cover blur-md"
                                draggable={false}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {matchesInteractive && (
                      <LockedMatches interactive onUnlock={scrollToPlans} />
                    )}
                    {/* Date rows removed on root and /a */}
                    {showDateRows && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-center bg-white/90 rounded-full px-3 py-2">
                        <LucideClock className="w-[18px] h-[18px] mr-2 shrink-0 text-[#FF8986]" />
                        <span
                          className="text-xs sm:text-sm text-gray-700"
                          style={{ fontFamily: 'var(--font-display)', letterSpacing: 'normal' }}
                        >
                          <span className="font-bold">Oldest profile creation date:</span>{' '}
                          <span className="font-bold text-[#FF8986]">02-12-2026</span>
                        </span>
                      </div>
                      <div className="flex items-center justify-center bg-white/90 rounded-full px-3 py-2">
                        <svg
                          className="w-[18px] h-[18px] mr-2 shrink-0"
                          viewBox="0 0 18 18"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M10.125 6H9V9.75L12.21 11.655L12.75 10.7475L10.125 9.1875V6ZM9.75 2.25C7.95979 2.25 6.2429 2.96116 4.97703 4.22703C3.71116 5.4929 3 7.20979 3 9H0.75L3.72 12.0225L6.75 9H4.5C4.5 7.60761 5.05312 6.27226 6.03769 5.28769C7.02226 4.30312 8.35761 3.75 9.75 3.75C11.1424 3.75 12.4777 4.30312 13.4623 5.28769C14.4469 6.27226 15 7.60761 15 9C15 10.3924 14.4469 11.7277 13.4623 12.7123C12.4777 13.6969 11.1424 14.25 9.75 14.25C8.3025 14.25 6.99 13.6575 6.045 12.705L4.98 13.77C5.60371 14.4003 6.34675 14.9001 7.16575 15.24C7.98474 15.58 8.86326 15.7533 9.75 15.75C11.5402 15.75 13.2571 15.0388 14.523 13.773C15.7888 12.5071 16.5 10.7902 16.5 9C16.5 7.20979 15.7888 5.4929 14.523 4.22703C13.2571 2.96116 11.5402 2.25 9.75 2.25Z"
                            fill="#FF8986"
                          />
                        </svg>
                        <span
                          className="text-xs sm:text-sm text-gray-700"
                          style={{ fontFamily: 'var(--font-display)', letterSpacing: 'normal' }}
                        >
                          <span className="font-bold">Latest profile creation date:</span>{' '}
                          <span className="font-bold text-[#FF8986]">4 days ago</span>
                        </span>
                      </div>
                    </div>
                    )}
                  </div>
                </div>

                {/* Headline */}
                <div className="px-3 sm:px-4 py-1.5 sm:py-2 flex justify-between items-end">
                  <h2
                    className="text-2xl sm:text-3xl leading-[1.2]"
                    style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: 'normal' }}
                  >
                    Upgrade to Uncover the Truth
                    <br />
                    Loyalty or Lies?
                  </h2>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={scrollToPlans}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') scrollToPlans()
                    }}
                    className="flex items-center cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm mr-1">
                      Get the <span className="font-bold">full</span> report
                    </span>
                    <img
                      src="/icons/down_arrow_white.svg"
                      alt="Down arrow"
                      className="ml-1"
                      width={14}
                      height={14}
                    />
                  </div>
                </div>

                {/* Press logos */}
                <div className="py-3 px-4">
                  <p className="text-center text-[10px] tracking-[0.25em] uppercase font-semibold mb-2.5 text-white/70">
                    AS SEEN IN
                  </p>
                  <div className="grid grid-cols-5 gap-2 w-full items-center">
                    {PRESS_LOGOS.map((logo) => (
                      <div key={logo.alt} className="relative h-9 w-full">
                        <img
                          src={logo.src}
                          alt={logo.alt}
                          className="absolute inset-0 w-full h-full object-contain brightness-0 invert"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pink pricing card */}
                <div id="subscription-plans" className="px-3 sm:px-4 mt-2 sm:mt-3 scroll-mt-4">
                  <div className="flex-1 h-full bg-[#FF7B7880] text-black rounded-3xl">
                    <div className="relative pb-4 pt-8 pl-4 sm:pl-5 rounded-3xl overflow-hidden">
                      <div className="absolute top-[-10px] right-[-5px]">
                        <img
                          src="/icons/gem.svg"
                          alt="Premium"
                          className="w-[100px] h-[100px] sm:w-[120px] sm:h-[120px]"
                        />
                      </div>
                      <h3
                        className="text-white mb-2 sm:mb-3 mt-4 sm:mt-5 text-base sm:text-lg flex items-center font-semibold"
                        style={{ fontFamily: 'var(--font-display)', letterSpacing: 'normal' }}
                      >
                        <LucidePackage className="w-3 h-3 mr-1.5 sm:mr-2 shrink-0" />
                        What&apos;s included:
                      </h3>
                      <ul className="space-y-0.5 sm:space-y-1 text-white">
                        <li className="flex items-start">
                          <LucideCheck className="w-3 h-3 mr-1.5 sm:mr-2 mt-0.5 shrink-0" />
                          <span
                            className="text-xs sm:text-sm"
                            style={{ fontFamily: 'var(--font-display)', letterSpacing: 'normal' }}
                          >
                            Detailed <span className="font-semibold">activity timelines</span>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <LucideCheck className="w-3 h-3 mr-1.5 sm:mr-2 mt-0.5 shrink-0" />
                          <span
                            className="text-xs sm:text-sm"
                            style={{ fontFamily: 'var(--font-display)', letterSpacing: 'normal' }}
                          >
                            Scan Tinder, Bumble and Hinge with{' '}
                            <span className="font-semibold">99.6% accuracy.</span>
                            <small className="block mt-1 text-[0.7rem] leading-tight opacity-80">
                              {' '}
                              We are not affiliated with Tinder, Bumble, or Hinge. All trademarks are
                              property of their respective owners. We only use publicly available
                              information and never use unauthorized scraping or automated access.
                            </small>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <LucideCheck className="w-3 h-3 mr-1.5 sm:mr-2 mt-0.5 shrink-0" />
                          <span
                            className="text-xs sm:text-sm"
                            style={{ fontFamily: 'var(--font-display)', letterSpacing: 'normal' }}
                          >
                            Includes a free e-book:{' '}
                            <span className="font-semibold">&quot;To Catch a Cheater&quot;.</span>
                          </span>
                        </li>
                        <li className="flex items-start">
                          <LucideCheck className="w-3 h-3 mr-1.5 sm:mr-2 mt-0.5 shrink-0" />
                          <span
                            className="text-xs sm:text-sm"
                            style={{ fontFamily: 'var(--font-display)', letterSpacing: 'normal' }}
                          >
                            <span className="font-semibold">30-day</span> money-back guarantee.
                          </span>
                        </li>
                      </ul>
                    </div>

                    <PlanCards
                      plans={PLANS}
                      selectedPlanId={selectedPlanId}
                      selectable={plansEvident}
                      evident={plansEvident}
                      onSelect={handlePlanSelect}
                    />

                    <div className="mt-6 pb-4 px-4">
                      <div className="flex flex-col items-center">
                        <SubscriptionCta onClick={() => onCheckout('see_full_report')} variant="dark" />
                        <div className="text-center px-2 sm:px-4 mt-4 sm:mt-6">
                          <p
                            className="text-[10px] sm:text-[12px] mb-2 leading-tight text-white/90"
                            style={{ fontFamily: 'var(--font-body)' }}
                          >
                            By clicking &quot;SEE FULL REPORT&quot; you agree to our{' '}
                            <a href="/en/terms" className="text-white hover:text-white/80 underline">
                              Terms &amp; Conditions
                            </a>{' '}
                            and{' '}
                            <a href="/en/privacy" className="text-white hover:text-white/80 underline">
                              Privacy Policy
                            </a>
                            . You will be automatically charged {chargeTotal} after the payment
                            confirmation. The subscription will then be auto-renewed monthly at the full
                            price of {renewalTotal}. You can cancel at any time through the Billing page
                            in your account on cheaterscanner.com or by contacting support@cheaterscanner.com
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why you need this */}
                <div className="px-4 mt-4 mb-6">
                  <h3
                    className="text-xl sm:text-2xl font-bold mb-4 text-white"
                    style={{ fontFamily: 'var(--font-display)', letterSpacing: 'normal' }}
                  >
                    Why you need this:
                  </h3>
                  <div className="space-y-3">
                    {WHY_YOU_NEED.map((item) => (
                      <div key={item.text} className="bg-white rounded-xl p-4 flex items-center">
                        <div className="mr-4 bg-[#FFEAEA] p-2.5 rounded-xl">
                          <WhyIcon type={item.icon} />
                        </div>
                        <p
                          className="text-gray-700 text-base"
                          style={{ fontFamily: 'var(--font-body)' }}
                        >
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trust badges */}
                <div className="px-3 sm:px-4 py-5 sm:py-6 mt-2">
                  <div className="flex justify-between text-center">
                    {TRUST_BADGES.map((badge) => (
                      <div key={badge.title} className="flex flex-col items-center w-1/3 px-1 sm:px-2">
                        <div className="inline-flex items-center justify-center shrink-0 bg-white p-1.5 sm:p-2 rounded-lg mb-1.5 sm:mb-2">
                          <TrustBadgeIcon type={badge.icon} />
                        </div>
                        <h3
                          className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1"
                          style={{ fontFamily: 'var(--font-display)', letterSpacing: 'normal' }}
                        >
                          {badge.title}
                        </h3>
                        <p
                          className="text-[10px] sm:text-xs leading-tight"
                          style={{ fontFamily: 'var(--font-condensed)', fontWeight: 400, lineHeight: '16px' }}
                        >
                          <span>
                            {badge.lines.map((line, i) => (
                              <span key={line}>
                                {line}
                                {i < badge.lines.length - 1 && <br />}
                              </span>
                            ))}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* White social proof section */}
            <div className="max-w-lg mx-auto w-full text-black">
              <div className="bg-white py-8 px-5 text-center">
                <h2
                  className="text-3xl text-black mb-10"
                  style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}
                >
                  Thousands Have Uncovered the Truth.{' '}
                  <span className="text-[#FF8986]">You Can Too</span>.
                </h2>

                <div className="bg-black text-white rounded-xl p-6 mb-12 relative text-left overflow-visible">
                  <div className="flex flex-row">
                    <div
                      className="absolute right-2 top-0 h-full w-[60%]"
                      style={{ zIndex: 0 }}
                    >
                      <div className="relative w-full h-full">
                        <img
                          src="/graphics/offer-page/hard-cover.svg"
                          alt="To Catch a Cheater book cover"
                          style={{
                            position: 'absolute',
                            height: '100%',
                            width: '100%',
                            inset: 0,
                            objectFit: 'contain',
                            objectPosition: 'right center',
                            filter:
                              'drop-shadow(rgba(0, 0, 0, 0.03) 0px 20px 13px) drop-shadow(rgba(0, 0, 0, 0.08) 0px 8px 5px)',
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-1/2 relative" style={{ zIndex: 1 }}>
                      <h3
                        className="text-3xl mb-4 text-left"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
                      >
                        <span>
                          FREE E-BOOK!
                          <br />
                          INCLUDED
                        </span>
                      </h3>
                      <p
                        className="mb-4 mt-10 text-sm text-left"
                        style={{ fontFamily: 'var(--font-condensed)' }}
                      >
                        Learn:
                      </p>
                      <ul
                        className="list-disc pl-5 mb-6 space-y-0.5 text-left text-xs"
                        style={{ fontFamily: 'var(--font-condensed)', fontWeight: 400 }}
                      >
                        {EBOOK_BULLETS.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <p
                        className="text-xs italic text-left"
                        style={{
                          fontFamily: 'var(--font-condensed)',
                          fontSize: '0.65rem',
                          lineHeight: 1,
                          fontWeight: 300,
                        }}
                      >
                        Upon initiating your scan the e-book will be sent to your email instantly.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 mb-12">
                  <SubscriptionCta onClick={() => onCheckout('see_full_report')} />
                </div>
              </div>

              <div className="bg-transparent py-6 sm:py-8 px-3 sm:px-5">
                {SUBSCRIPTION_TESTIMONIALS.map((t, index) => (
                  <div
                    key={t.name}
                    className={
                      index === SUBSCRIPTION_TESTIMONIALS.length - 1
                        ? 'mb-6 sm:mb-8'
                        : 'mb-3 sm:mb-4'
                    }
                  >
                    <div className="flex">
                      <div className="bg-[#F5F1EE] rounded-xl p-3 sm:p-4 w-full shadow-sm">
                        <div className="flex justify-between items-center">
                          <h4
                            className="font-bold text-sm sm:text-base"
                            style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'rgb(0, 0, 0)' }}
                          >
                            {t.name}
                          </h4>
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <LucideStar key={i} className="text-yellow-400 w-3 h-3" />
                            ))}
                          </div>
                        </div>
                        <p
                          className="text-xs sm:text-sm mt-1.5 sm:mt-2"
                          style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'rgb(115, 115, 115)' }}
                        >
                          &quot;{t.quote}&quot;
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-3 sm:px-5 mt-6 sm:mt-8 mb-8 sm:mb-12">
                <SubscriptionCta onClick={() => onCheckout('see_full_report')} />
              </div>

              {/* FAQ */}
              <div className="py-6 sm:py-8 px-3 sm:px-5">
                <h2
                  className="text-2xl sm:text-3xl mb-2"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    letterSpacing: 'normal',
                    color: 'rgb(0, 0, 0)',
                  }}
                >
                  Got a question?
                </h2>
                <p
                  className="mb-6 sm:mb-8 text-xs sm:text-sm"
                  style={{ fontFamily: 'var(--font-condensed)', fontWeight: 400 }}
                >
                  Find quick answers to common questions about our dating profile scanner service.
                </p>
                <div className="space-y-3 sm:space-y-4">
                  {SUBSCRIPTION_FAQS.map((faq, index) => {
                    const isOpen = openFaq === index
                    return (
                      <div key={faq.question}>
                        <div
                          className="p-4 flex justify-between items-center cursor-pointer"
                          role="button"
                          tabIndex={0}
                          onClick={() => setOpenFaq(isOpen ? -1 : index)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setOpenFaq(isOpen ? -1 : index)
                            }
                          }}
                        >
                          <h4
                            style={{
                              fontFamily: 'var(--font-condensed)',
                              fontWeight: 700,
                              color: 'rgb(0, 0, 0)',
                            }}
                          >
                            {faq.question}
                          </h4>
                          <div
                            className="transition-transform duration-300"
                            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          >
                            <span
                              className={`text-2xl transition-all ${isOpen ? 'text-[#EC3A49]' : 'text-black'}`}
                            >
                              {isOpen ? '−' : '+'}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div
                            className="px-4 pb-4 transform transition-transform duration-300 text-sm"
                            style={{ transform: isOpen ? 'translateY(0px)' : 'translateY(-10px)' }}
                          >
                            <div
                              style={{
                                fontFamily: 'var(--font-condensed)',
                                fontWeight: 400,
                                color: 'rgb(143, 143, 143)',
                              }}
                            >
                              <p className="text-xs sm:text-sm" style={{ fontFamily: 'var(--font-body)' }}>
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="px-3 sm:px-5 pb-6 sm:pb-8">
                <SubscriptionCta onClick={() => onCheckout('see_full_report')} />
              </div>

              {/* Footer disclaimer */}
              <div className="bg-white rounded-t-3xl relative overflow-hidden">
                <div className="px-3 sm:px-4 pb-6 sm:pb-8">
                  <div className="text-center px-2 sm:px-4 mt-4 sm:mt-6">
                    <p className="text-[10px] sm:text-[12px] leading-tight text-gray-500">
                      By clicking &quot;SEE FULL REPORT&quot; you agree to our{' '}
                      <a href="/en/terms" className="text-[#EC3A49] underline">
                        Terms &amp; Conditions
                      </a>{' '}
                      and{' '}
                      <a href="/en/privacy" className="text-[#EC3A49] underline">
                        Privacy Policy
                      </a>
                      . You will be automatically charged {chargeTotal} after the payment
                      confirmation. The subscription will then be auto-renewed monthly at the full price
                      of {renewalTotal}. You can cancel at any time through the Billing page in your
                      account on cheaterscanner.com or by contacting support@cheaterscanner.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
