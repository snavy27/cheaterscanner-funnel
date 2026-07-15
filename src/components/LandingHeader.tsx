import { useNavigate } from 'react-router-dom'
import { Logo } from './Logo'

const navFont = { fontFamily: 'var(--font-display)' }
const dropdownFont = { fontFamily: 'Arial, Helvetica, sans-serif', fontWeight: 500 }

const frostedDropdown =
  'flex cursor-pointer items-center gap-2 rounded-[5px] border border-white/30 bg-white/20 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white transition-all hover:bg-white/30'

const textNavBtn =
  'cursor-pointer px-4 font-medium text-white transition-colors duration-200 hover:text-gray-200'

export function LandingHeader() {
  const navigate = useNavigate()

  const startScan = () => {
    navigate('/quiz?qs=gender')
  }

  return (
    <div className="absolute left-0 right-0 top-0 z-50">
      <div className="mx-auto w-full px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative h-10 w-10 md:hidden">
              <img
                src="/cheaterscanner_favicon.png"
                alt="CheaterScanner"
                className="h-full w-full object-contain brightness-0 invert"
              />
            </div>
            <div className="hidden md:block">
              <a href="/?restart=1">
                <Logo className="h-10 w-auto object-contain" />
              </a>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden items-center gap-2 md:flex">
            <button type="button" className={`${frostedDropdown} relative min-w-[115px] shrink-0`} style={dropdownFont}>
              English
              <svg className="absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <button
              type="button"
              className={`${frostedDropdown} ml-1 mr-1 shrink-0 lg:ml-2 lg:mr-2`}
              style={dropdownFont}
            >
              Search By Use Case
              <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <button
              type="button"
              className={`${textNavBtn} shrink-0 py-2 hover:bg-white/10`}
              style={navFont}
            >
              Login
            </button>

            <button
              type="button"
              className={`${textNavBtn} shrink-0 py-3 hover:bg-white/10 lg:px-6`}
              style={navFont}
            >
              Blog
            </button>

            <button
              type="button"
              onClick={startScan}
              className="shrink-0 cursor-pointer rounded-[5px] bg-white px-5 py-3 font-bold text-[#FF6252] shadow-md transition-colors duration-200 hover:bg-gray-50 lg:px-8"
              style={navFont}
            >
              Scan Now
            </button>
          </div>

          {/* Mobile nav */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/10 hover:text-gray-200"
              style={navFont}
            >
              Login
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-lg p-2 text-white transition-colors duration-200 hover:bg-white/10"
              aria-label="Toggle menu"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
