import { useEffect } from 'react'
import { GenderCard } from '../components/GenderCard'
import { LandingHeader } from '../components/LandingHeader'
import { LandingFooter } from '../components/LandingFooter'
import { track } from '../lib/track'

interface LandingScreenProps {
  onSelect: (gender: string) => void
}

export function LandingScreen({ onSelect }: LandingScreenProps) {
  useEffect(() => {
    track('$pageview', { path: '/' })
  }, [])

  return (
    <>
      <div className="landing-bg flex min-h-dvh flex-col overflow-x-clip">
        <LandingHeader />

      <main className="relative flex w-full flex-1 flex-col items-center pb-8 pt-[144px] md:justify-center md:pt-20">
        <div className="mx-auto flex w-full flex-1 flex-col items-center px-4 sm:max-w-[500px] md:max-w-[600px] md:flex-initial md:gap-[60px] lg:max-w-[800px] xl:max-w-[850px]">
          {/* Hero block — decorations anchor to headline + subheadline only */}
          <div className="relative z-20 flex w-full flex-col items-center sm:w-auto">
            {/* Cloth (black torn decoration) — behind the headline */}
            <div
              className="pointer-events-none absolute z-[-2]"
              style={{ top: '-25px', left: '30px', width: '126.562px', height: '75.578px' }}
            >
              <img
                src="/cloth.webp"
                alt=""
                aria-hidden
                className="h-full w-full object-cover"
              />
            </div>

            {/* Glitter safety pin */}
            <div
              className="pointer-events-none absolute"
              style={{ top: '-30px', right: '45px', width: '84px', height: '84px' }}
            >
              <img src="/pin.svg" alt="" aria-hidden className="h-full w-full object-contain" />
            </div>

            {/* Glitter sparks */}
            <div
              className="pointer-events-none absolute"
              style={{ top: '60px', right: '15px', width: '81px', height: '81px' }}
            >
              <img src="/sparks.svg" alt="" aria-hidden className="h-full w-full object-contain" />
            </div>

            {/* Magnifying glass — desktop */}
            <div
              className="pointer-events-none absolute top-0 z-[5] hidden sm:block"
              style={{ right: '-170px', width: '325.224px', height: '429.055px' }}
            >
              <img
                src="/magnifying_glass.avif"
                alt=""
                aria-hidden
                className="h-full w-full object-cover"
              />
            </div>

            {/* Heart — desktop */}
            <div
              className="pointer-events-none absolute z-[5] hidden sm:block"
              style={{
                left: '-150px',
                bottom: '-60px',
                width: '218.132px',
                height: '218.132px',
                transform: 'rotate(30.597deg)',
              }}
            >
              <img
                src="/heart_with_horns.svg"
                alt=""
                aria-hidden
                className="h-full w-full object-contain"
              />
            </div>

            <h1
              className="relative z-30 mb-4 w-full text-center text-[72px] font-black uppercase leading-[62px] text-white sm:w-[400px]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Find Out If
              <br />
              They&apos;re Cheating
            </h1>

            <p
              className="relative z-30 mt-4 w-[300px] text-center text-sm font-medium leading-6 text-[#FFC5CA]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Instantly scan dating apps to discover if your partner is active on Tinder, Bumble,
              Hinge &amp; more
            </p>
          </div>

          <div className="flex-1 md:hidden" />

          {/* Gender box */}
          <div className="z-30 flex justify-center pb-[64px] md:pb-0">
            <div
              className="flex w-[291px] flex-col gap-[9px] rounded-xl p-[9px]"
              style={{ backgroundColor: '#FF6371' }}
            >
              <p
                className="text-center text-[15px] font-bold leading-[42px] text-white"
                style={{ fontFamily: 'var(--font-condensed)' }}
              >
                What&apos;s their gender?
              </p>
              <div className="flex gap-[6px]">
                <GenderCard label="Female" onClick={() => onSelect('Female')} />
                <GenderCard label="Male" onClick={() => onSelect('Male')} />
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>

      <LandingFooter />
    </>
  )
}
