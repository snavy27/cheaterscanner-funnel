const headingFont = { fontFamily: 'var(--font-display)' }
const bodyFont = { fontFamily: 'var(--font-body)' }
const footerFont = { fontFamily: 'Arial, Helvetica, sans-serif' }

const companyLinks = [
  { label: 'About Us', href: '/en/about' },
  { label: 'Blog', href: '/en/blog' },
  { label: 'Affiliates', href: 'https://cheaterscanner.tolt.io' },
  { label: 'FAQ', href: '/en/faq' },
  { label: 'Privacy Policy', href: '/en/privacy' },
  { label: 'Terms of Service', href: '/en/terms' },
  { label: 'Refunds & Cancellations', href: '/en/refunds' },
  { label: 'Do Not Sell My Info', href: '/en/do-not-sell' },
]

const useCaseLinks = [
  { label: 'Deep Person Scan', href: '/en/deep-person-scan' },
  { label: 'Bumble Profile Search', href: '/en/bumble-profile-search' },
  { label: 'Tinder Profile Search', href: '/en/tinder-profile-search' },
  { label: 'Hinge Profile Search', href: '/en/hinge-profile-search' },
  { label: 'Reverse Phone Lookup', href: '/en/deep-person-scan?q=reverse-phone-lookup' },
  { label: 'Reverse Email Lookup', href: '/en/deep-person-scan?q=reverse-email-lookup' },
  { label: 'Reverse Name Lookup', href: '/en/deep-person-scan?q=reverse-name-lookup' },
]

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'mx', label: 'Español (MX)' },
]

const footerLink = 'text-gray-400 hover:text-white transition-colors'

export function LandingFooter() {
  return (
    <footer className="bg-black py-12 text-white" style={footerFont}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
          <div className="col-span-1 md:col-span-2">
            <a href="/en">
              <img
                src="/cheaterscanner_white.avif"
                alt="CheaterScanner"
                width={180}
                height={45}
                className="mb-4 h-[45px] w-auto object-contain"
              />
            </a>
            <p className="mb-6 text-sm text-gray-400" style={bodyFont}>
              CheaterScanner uses AI bots to scan dating apps in different locations to discover if
              your partner is actively using any dating apps.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold" style={headingFont}>
              Company
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={footerLink}
                    {...(link.href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold" style={headingFont}>
              Search By Use Case
            </h3>
            <ul className="space-y-2">
              {useCaseLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={footerLink}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-bold" style={headingFont}>
              Connect With Us
            </h3>
            <div className="space-y-2">
              <a href="mailto:support@cheaterscanner.com" className={`${footerLink} block`}>
                support@cheaterscanner.com (Mon-Fri, 9am-5pm EST. We aim to respond within 24
                hours.)
              </a>
              <p className={`${footerLink} block`}>+1 (800) 452-0804</p>
              <div className="mt-2 text-sm text-gray-400">
                <p>Registered Agent Address:</p>
                <p>1111B South Governers Avenue STE 23315</p>
                <p>Dover, Delaware, 19904, USA</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-400">© 2026 CheaterScanner. All rights reserved.</p>
            <div className="relative">
              <select
                defaultValue="en"
                aria-label="Select language"
                className="w-full cursor-pointer appearance-none rounded-lg border border-white/30 bg-white/20 px-3 py-1.5 pr-7 text-xs font-medium text-white transition-all hover:bg-white/30"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-white">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
