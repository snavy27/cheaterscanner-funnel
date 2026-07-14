import { useEffect, useLayoutEffect, useState } from 'react'
import { CountdownTimer } from './CountdownTimer'
import {
  LucideCircleQuestionMark,
  LucideClock,
  LucideCreditCard,
  LucideLock,
  LucideShieldCheck,
  LucideShoppingBag,
  LucideUser,
} from './SubscriptionIcons'
import { EBOOK_BULLETS } from '../data/subscriptionContent'
import { getPreferredWallet } from '../lib/device'
import {
  formatEuro,
  getDiscount,
  getOrderTotal,
  getPlanById,
  type Plan,
} from '../lib/plans'
import { track } from '../lib/track'
import { preloadWalletSdks } from '../lib/walletSdk'
import { BACKLOG_FLAGS } from '../variant/flags'

type PaymentState = 'idle' | 'processing'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (plan: Plan) => void
  selectedPlanId: string
  email: string
  /** change4 — OS-detected wallet pre-selected on top; card collapsed under "Other ways to pay" */
  walletFirst: boolean
}

const CHECKOUT_ANIMATION_MS = 450

const sairaStyle = { fontFamily: 'var(--font-display)', letterSpacing: 'normal' as const }
const condensedStyle = { fontFamily: 'var(--font-condensed)' }
const bodyStyle = { fontFamily: 'var(--font-body)' }

const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' },
  { code: 'AL', name: 'Albania' },
  { code: 'DZ', name: 'Algeria' },
  { code: 'AS', name: 'American Samoa' },
  { code: 'AD', name: 'Andorra' },
  { code: 'AO', name: 'Angola' },
  { code: 'AI', name: 'Anguilla' },
  { code: 'AQ', name: 'Antarctica' },
  { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' },
  { code: 'AM', name: 'Armenia' },
  { code: 'AW', name: 'Aruba' },
  { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' },
  { code: 'AZ', name: 'Azerbaijan' },
  { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' },
  { code: 'BE', name: 'Belgium' },
  { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BM', name: 'Bermuda' },
  { code: 'BT', name: 'Bhutan' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CA', name: 'Canada' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'KY', name: 'Cayman Islands' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'CL', name: 'Chile' },
  { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Congo (DRC)' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'HR', name: 'Croatia' },
  { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' },
  { code: 'CZ', name: 'Czechia' },
  { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'DM', name: 'Dominica' },
  { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'EG', name: 'Egypt' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'EE', name: 'Estonia' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GE', name: 'Georgia' },
  { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GI', name: 'Gibraltar' },
  { code: 'GR', name: 'Greece' },
  { code: 'GL', name: 'Greenland' },
  { code: 'GD', name: 'Grenada' },
  { code: 'GU', name: 'Guam' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' },
  { code: 'HT', name: 'Haiti' },
  { code: 'HN', name: 'Honduras' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'HU', name: 'Hungary' },
  { code: 'IS', name: 'Iceland' },
  { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IR', name: 'Iran' },
  { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IL', name: 'Israel' },
  { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'JP', name: 'Japan' },
  { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' },
  { code: 'KE', name: 'Kenya' },
  { code: 'KI', name: 'Kiribati' },
  { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' },
  { code: 'LA', name: 'Laos' },
  { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'LI', name: 'Liechtenstein' },
  { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' },
  { code: 'MO', name: 'Macao' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MV', name: 'Maldives' },
  { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' },
  { code: 'MH', name: 'Marshall Islands' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'MX', name: 'Mexico' },
  { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldova' },
  { code: 'MC', name: 'Monaco' },
  { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'MK', name: 'North Macedonia' },
  { code: 'NO', name: 'Norway' },
  { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'PW', name: 'Palau' },
  { code: 'PS', name: 'Palestine' },
  { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' },
  { code: 'PL', name: 'Poland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PR', name: 'Puerto Rico' },
  { code: 'QA', name: 'Qatar' },
  { code: 'RO', name: 'Romania' },
  { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'KN', name: 'Saint Kitts and Nevis' },
  { code: 'LC', name: 'Saint Lucia' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' },
  { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' },
  { code: 'ST', name: 'São Tomé and Príncipe' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' },
  { code: 'RS', name: 'Serbia' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SG', name: 'Singapore' },
  { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'SB', name: 'Solomon Islands' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SR', name: 'Suriname' },
  { code: 'SE', name: 'Sweden' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TJ', name: 'Tajikistan' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' },
  { code: 'TL', name: 'Timor-Leste' },
  { code: 'TG', name: 'Togo' },
  { code: 'TO', name: 'Tonga' },
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' },
  { code: 'TM', name: 'Turkmenistan' },
  { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'US', name: 'United States' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' },
  { code: 'VU', name: 'Vanuatu' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
]

function NestedFieldBox({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`mb-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm checkout-field-box ${className}`}
    >
      {children}
    </div>
  )
}

const fieldInputClass =
  'w-full bg-transparent py-2 text-sm outline-none placeholder:text-gray-400'

const emailInputClass =
  'w-full cursor-not-allowed border-b border-gray-300 bg-gray-50 py-2 text-sm text-gray-500 outline-none placeholder:text-gray-400'

const WALLET_BUTTON_STYLE = { height: '44px', borderRadius: '4px' } as const

const walletButtonBase =
  'flex w-full items-center justify-center text-base transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'

const walletButtonClass = `${walletButtonBase} font-semibold`

const stripeLinkButtonClass = walletButtonBase

function LinkLogo() {
  return (
    <svg className="mx-1 inline-block h-4 w-4 shrink-0" viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="#1A1A1A" />
      <path
        fill="#FFFFFF"
        d="M6.15 4.85a.5.5 0 0 1 .7 0l3.65 3.25a.5.5 0 0 1 0 .7L6.85 11.95a.5.5 0 0 1-.7-.7L9.64 8.5 6.15 5.55a.5.5 0 0 1 0-.7z"
      />
    </svg>
  )
}

function AppleLogo() {
  return (
    <svg className="mr-2 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

function GooglePayMark() {
  return (
    <span className="ml-1.5 inline-flex items-center gap-0.5">
      <svg className="h-5 w-5" viewBox="0 0 18 18" aria-hidden>
        <path
          fill="#4285F4"
          d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        />
        <path
          fill="#34A853"
          d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
        />
        <path
          fill="#FBBC05"
          d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        />
        <path
          fill="#EA4335"
          d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        />
      </svg>
      <span className="text-base font-medium leading-none tracking-tight">Pay</span>
    </span>
  )
}

function ApplePayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${walletButtonClass} bg-black text-white hover:bg-gray-800 focus:ring-black/50`}
      style={WALLET_BUTTON_STYLE}
    >
      <AppleLogo />
      Pay with Apple Pay
    </button>
  )
}

function GooglePayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${walletButtonBase} bg-black font-medium text-white hover:bg-gray-800 focus:ring-black/50`}
      style={WALLET_BUTTON_STYLE}
    >
      Pay with
      <GooglePayMark />
    </button>
  )
}

function PayPalButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${walletButtonClass} bg-[#FFC439] text-black hover:bg-[#f5bb35] focus:ring-yellow-500/50`}
      style={WALLET_BUTTON_STYLE}
    >
      <PaymentLogo type="paypal" />
      <span className="sr-only">Pay with PayPal</span>
    </button>
  )
}

function StripeLinkButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${stripeLinkButtonClass} bg-[#00D66F] text-[#1A1A1A] hover:opacity-90 focus:ring-[#00D66F]/50`}
      style={WALLET_BUTTON_STYLE}
    >
      <span className="font-medium">Pay securely with</span>
      <LinkLogo />
      <span className="font-bold">link</span>
    </button>
  )
}

function PaymentLogo({ type }: { type: 'visa' | 'mc' | 'amex' | 'discover' | 'paypal' }) {
  if (type === 'paypal') {
    return (
      <img
        src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png"
        alt="PayPal"
        className="h-5 w-auto"
      />
    )
  }

  const colors: Record<string, string> = {
    visa: '#1A1F71',
    mc: '#EB001B',
    amex: '#006FCF',
    discover: '#FF6000',
  }

  return (
    <div
      className="flex h-5 w-8 items-center justify-center rounded text-[8px] font-bold text-white"
      style={{ backgroundColor: colors[type] }}
    >
      {type === 'mc' ? 'MC' : type.toUpperCase()}
    </div>
  )
}

type PayMethod = 'google_pay' | 'apple_pay' | 'stripe_link' | 'paypal' | 'card'

const METHOD_LABELS: Record<PayMethod, string> = {
  google_pay: 'Google Pay',
  apple_pay: 'Apple Pay',
  stripe_link: 'Link',
  paypal: 'PayPal',
  card: 'Card',
}

function MethodIcon({ method }: { method: PayMethod }) {
  switch (method) {
    case 'google_pay':
      return (
        <span className="inline-flex items-center rounded-full border border-gray-300 bg-white px-2 py-0.5">
          <GooglePayMark />
        </span>
      )
    case 'apple_pay':
      return (
        <span className="inline-flex items-center text-black">
          <AppleLogo />
          <span className="-ml-1 text-base font-medium leading-none tracking-tight">Pay</span>
        </span>
      )
    case 'stripe_link':
      return (
        <span className="inline-flex items-center">
          <LinkLogo />
          <span className="ml-0.5 text-base font-bold leading-none">link</span>
        </span>
      )
    case 'paypal':
      return <PaymentLogo type="paypal" />
    case 'card':
      return <LucideCreditCard className="h-6 w-6 text-gray-600" />
  }
}

function MethodTile({
  method,
  selected,
  spanFull,
  onSelect,
}: {
  method: PayMethod
  selected: boolean
  spanFull?: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex flex-col items-start gap-1.5 rounded-xl p-3 text-left transition-colors focus:outline-none ${
        spanFull ? 'col-span-2' : ''
      } ${
        selected
          ? 'border-2 border-[#F93A50] bg-[#FFF5F5]'
          : 'border border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <span className="flex h-7 items-center">
        <MethodIcon method={method} />
      </span>
      <span
        className={`text-sm font-medium ${selected ? 'text-black' : 'text-gray-600'}`}
        style={bodyStyle}
      >
        {METHOD_LABELS[method]}
      </span>
    </button>
  )
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 6)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`
}

interface CardFormProps {
  email: string
  cardholder: string
  setCardholder: (v: string) => void
  cardNumber: string
  setCardNumber: (v: string) => void
  cardExpiry: string
  setCardExpiry: (v: string) => void
  cardCvv: string
  setCardCvv: (v: string) => void
  country: string
  setCountry: (v: string) => void
  postalCode: string
  setPostalCode: (v: string) => void
  processing: boolean
  onPay: () => void
  /** Hide the inner pay button when the parent renders its own CTA */
  showPayButton?: boolean
}

function CardForm({
  email,
  cardholder,
  setCardholder,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  country,
  setCountry,
  postalCode,
  setPostalCode,
  processing,
  onPay,
  showPayButton = true,
}: CardFormProps) {
  return (
    <>
      <NestedFieldBox>
        <input
          type="email"
          value={email}
          readOnly
          autoComplete="email"
          placeholder={email ? undefined : 'Email'}
          className={emailInputClass}
        />
      </NestedFieldBox>

      <NestedFieldBox>
        <div className="flex items-center border-b border-gray-300 focus-within:border-[#A61A25]">
          <LucideUser className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Cardholder Name"
            value={cardholder}
            onChange={(e) => setCardholder(e.target.value)}
            autoComplete="cc-name"
            className={`${fieldInputClass} flex-1`}
            required
          />
        </div>

        <div className="mt-3 flex items-center border-b border-gray-300 pb-2 focus-within:border-[#A61A25]">
          <LucideCreditCard className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="text"
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            inputMode="numeric"
            autoComplete="cc-number"
            maxLength={19}
            className={`${fieldInputClass} flex-1`}
          />
        </div>

        <div className="mt-3 flex flex-col gap-2 pb-2 sm:flex-row">
          <div className="min-w-0 flex-1 border-b border-gray-300 pb-2">
            <input
              type="text"
              placeholder="MM / YYYY"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
              inputMode="numeric"
              autoComplete="cc-exp"
              maxLength={7}
              className={fieldInputClass}
            />
          </div>
          <div className="min-w-0 flex-1 border-b border-gray-300 pb-2">
            <input
              type="text"
              placeholder="CVV"
              value={cardCvv}
              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              inputMode="numeric"
              autoComplete="cc-csc"
              maxLength={4}
              className={fieldInputClass}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            autoComplete="country"
            className={`${fieldInputClass} min-w-0 flex-1 border-b border-gray-300 text-gray-900 focus:border-[#A61A25]`}
            required
          >
            <option value="">Select country</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="ZIP / Postal Code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            autoComplete="postal-code"
            className={`${fieldInputClass} min-w-0 flex-1 border-b border-gray-300 focus:border-[#A61A25]`}
            required
          />
        </div>
      </NestedFieldBox>

      {showPayButton && (
        <button
          type="button"
          onClick={onPay}
          disabled={processing}
          className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-3 text-lg font-semibold text-white transition-colors hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processing ? (
            'Processing Payment...'
          ) : (
            <>
              <LucideLock className="mr-2 h-5 w-5" />
              Pay with Card
            </>
          )}
        </button>
      )}
    </>
  )
}

const CHECKOUT_PAYMENT_LOGOS = [
  { src: '/graphics/checkout/mastercard.png', alt: 'mastercard', width: 32, height: 20 },
  { src: '/graphics/checkout/discover.png', alt: 'discover', width: 40, height: 38 },
  { src: '/graphics/checkout/visa.png', alt: 'visa', width: 32, height: 20 },
  { src: '/graphics/checkout/amex.webp', alt: 'americanexpress', width: 32, height: 20 },
  { src: '/graphics/checkout/paypal.webp', alt: 'paypal', width: 32, height: 20 },
] as const

function CheckoutPaymentLogos() {
  return (
    <div className="mt-4 flex items-center justify-center space-x-6">
      {CHECKOUT_PAYMENT_LOGOS.map((logo) => (
        <img
          key={logo.alt}
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          className="block shrink-0"
          style={{ width: logo.width, height: logo.height, objectFit: 'contain' }}
        />
      ))}
    </div>
  )
}

function CheckoutTrustBadges() {
  const badges = [
    {
      title: 'Your info is safe',
      icon: LucideShieldCheck,
      html: 'We never sell or<br />share your personal<br />data.',
    },
    {
      title: 'Secure checkout',
      icon: LucideCreditCard,
      html: 'Encrypted with SSL<br />for protection.',
    },
    {
      title: 'Need help?',
      icon: LucideCircleQuestionMark,
      html: 'Contact us at<br />support@cheaterscanner.com',
    },
  ] as const

  return (
    <>
      <div className="mt-2 px-4 py-6">
        <div className="flex justify-between text-center">
          {badges.map((badge) => (
            <div key={badge.title} className="flex w-1/3 flex-col items-center px-2">
              <div className="mb-2 rounded-lg bg-white p-2">
                <badge.icon className="h-5 w-5 text-black" />
              </div>
              <h3 className="mb-1 text-sm font-semibold" style={sairaStyle}>
                {badge.title}
              </h3>
              <p className="text-xs leading-tight" style={{ ...condensedStyle, fontWeight: 400 }}>
                <span dangerouslySetInnerHTML={{ __html: badge.html }} />
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 mt-8 flex flex-col items-center">
        <div className="relative w-[80%] max-w-[300px]">
          <img
            src="/graphics/offer-page/trust-pilot.svg"
            alt="TrustPilot"
            width={300}
            height={40}
            className="h-auto w-full"
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    </>
  )
}

function CheckoutEbookPromo() {
  return (
    <div className="relative my-12 overflow-visible rounded-xl bg-black p-6 text-left text-white">
      <div className="flex flex-row">
        <div className="absolute right-2 top-0 h-full w-[60%]" style={{ zIndex: 0 }}>
          <div className="relative h-full w-full">
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
        <div className="relative w-1/2" style={{ zIndex: 1 }}>
          <h3 className="mb-4 text-left text-3xl" style={{ ...sairaStyle, fontWeight: 600 }}>
            <span>
              FREE E-BOOK!
              <br />
              INCLUDED
            </span>
          </h3>
          <p className="mb-4 mt-10 text-left text-sm" style={condensedStyle}>
            Learn:
          </p>
          <ul
            className="mb-6 list-disc space-y-0.5 pl-5 text-left text-xs"
            style={{ ...condensedStyle, fontWeight: 400 }}
          >
            {EBOOK_BULLETS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p
            className="text-left text-xs italic"
            style={{
              ...condensedStyle,
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
  )
}

export function CheckoutModal({
  isOpen,
  onClose,
  onSuccess,
  selectedPlanId,
  email,
  walletFirst,
}: CheckoutModalProps) {
  const [paymentState, setPaymentState] = useState<PaymentState>('idle')
  const [cardholder, setCardholder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [country, setCountry] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [mounted, setMounted] = useState(isOpen)
  const [closing, setClosing] = useState(false)

  const preferredWallet = getPreferredWallet()
  const [selectedMethod, setSelectedMethod] = useState<PayMethod>(preferredWallet)

  // Preferred wallet first, then the rest; Card last (spans the full row)
  const methodOrder: PayMethod[] =
    preferredWallet === 'apple_pay'
      ? ['apple_pay', 'google_pay', 'stripe_link', 'paypal', 'card']
      : ['google_pay', 'apple_pay', 'stripe_link', 'paypal', 'card']

  const handleMethodSelect = (method: PayMethod) => {
    setSelectedMethod(method)
    if (method !== 'card') {
      track('wallet_selected', { wallet: method })
    }
  }

  const plan = getPlanById(selectedPlanId)
  const discount = getDiscount(plan)
  const total = getOrderTotal(plan)
  const planLabel = `${plan.name} Plan`

  useLayoutEffect(() => {
    if (isOpen) {
      setClosing(false)
      setMounted(true)
      return
    }

    if (!mounted) return

    setClosing(true)
    const timer = window.setTimeout(() => {
      setMounted(false)
      setClosing(false)
    }, CHECKOUT_ANIMATION_MS)
    return () => clearTimeout(timer)
  }, [isOpen, mounted])

  useEffect(() => {
    if (!mounted) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mounted])

  useEffect(() => {
    if (!isOpen) return
    setSelectedMethod(preferredWallet)
    // Wallet SDKs mount on checkout open (change4b flag moves this to offer-page load)
    preloadWalletSdks()
    if (walletFirst) {
      track('wallet_shown', { wallet: preferredWallet })
    }
  }, [isOpen, walletFirst, preferredWallet])

  if (!mounted) return null

  const handlePay = async (method: string = 'card') => {
    setPaymentState('processing')
    await new Promise((r) => setTimeout(r, 1200))

    track('purchase_success', { planId: plan.id, revenue: total, method })
    onSuccess(plan)
  }

  const handleWalletPay = (wallet: string) => {
    track('wallet_selected', { wallet })
    void handlePay(wallet)
  }

  return (
    <div
      className={`fixed inset-0 z-[200] bg-black/50 will-change-transform ${
        closing ? 'checkout-sheet-out' : 'checkout-sheet-in'
      }`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="absolute bottom-0 left-0 right-0 flex h-screen flex-col rounded-t-3xl bg-white text-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
      >
        <div className="sticky top-0 z-10 bg-white px-4 py-4">
          <div className="mx-auto flex w-full max-w-xl items-center justify-between">
            <div className="flex items-center">
              <LucideShoppingBag className="mr-2 h-5 w-5 text-black" />
              <h2 className="text-2xl font-extrabold" style={{ ...sairaStyle, fontWeight: 800 }}>
                Checkout
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-2xl leading-none text-[#D9D9D9] hover:text-gray-700"
              aria-label="Close checkout"
            >
              ×
            </button>
          </div>
        </div>

        <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="mx-auto w-full max-w-xl px-4 py-6">
            {/* Order summary */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span style={{ ...condensedStyle, fontWeight: 400, color: '#949494' }}>
                  {planLabel}
                </span>
                <span style={{ ...sairaStyle, fontWeight: 700, color: '#949494' }}>
                  {formatEuro(plan.originalPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ ...condensedStyle, fontWeight: 400, color: '#2E7D32' }}>
                  First Time Customer Discount
                </span>
                <span style={{ ...sairaStyle, fontWeight: 700, color: '#2E7D32' }}>
                  -{formatEuro(discount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ ...condensedStyle, fontWeight: 400, color: '#949494' }}>
                  To Catch A Cheater E-book
                </span>
                <span style={{ ...sairaStyle, fontWeight: 700, color: '#949494' }}>
                  {formatEuro(0)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ ...condensedStyle, fontWeight: 400, color: '#949494' }}>
                  Sales Tax
                </span>
                <span style={{ ...sairaStyle, fontWeight: 700, color: '#949494' }}>
                  +{formatEuro(plan.tax)}
                </span>
              </div>
            </div>

            <div className="my-4 border-t border-[#E5E5E5]" />

            <div className="mb-6 flex items-center justify-between">
              <span style={{ ...condensedStyle, fontWeight: 700, color: '#000' }}>
                Your Total
              </span>
              <span style={{ ...sairaStyle, fontWeight: 700, color: '#000' }}>
                {formatEuro(total)}
              </span>
            </div>

            {/* Payment section */}
            <div className="checkout-payment-block mt-12">
              {/* Keep the countdown — their own experiment data favors urgency.
                  change4c_softenUrgency is a risky backlog flag, not a variant. */}
              {!BACKLOG_FLAGS.change4c_softenUrgency && (
                <div className="mb-5 flex w-full items-center justify-between rounded-lg bg-gradient-to-b from-[#FF6252] via-[#FF5864] to-[#F93A50] px-4 py-2.5 text-white">
                  <div className="flex items-center">
                    <LucideClock className="mr-2 h-[18px] w-[18px] text-white opacity-90" />
                    <span className="font-bold" style={sairaStyle}>
                      Offer expires in:
                    </span>
                    <div className="ml-2 rounded-lg border border-white/30 bg-white/20 px-3 py-1 font-mono font-bold backdrop-blur-sm">
                      <CountdownTimer initialMinutes={9} initialSeconds={59} />
                    </div>
                  </div>
                  <span className="text-sm text-white" style={sairaStyle}>
                    Complete order now
                  </span>
                </div>
              )}

              {walletFirst ? (
                /* change4 — payment method tiles in a 2-col grid; OS-preferred wallet
                   pre-selected; Card expands the form inline; one-tap CTA */
                <div className="checkout-payment-section">
                  <div className="checkout-payment-box rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                    <div className="checkout-payment-inner">
                      <div className="grid grid-cols-2 gap-3">
                        {methodOrder.map((method) => (
                          <MethodTile
                            key={method}
                            method={method}
                            selected={selectedMethod === method}
                            spanFull={method === 'card'}
                            onSelect={() => handleMethodSelect(method)}
                          />
                        ))}
                      </div>

                      {selectedMethod === 'card' && (
                        <CardForm
                          email={email}
                          cardholder={cardholder}
                          setCardholder={setCardholder}
                          cardNumber={cardNumber}
                          setCardNumber={setCardNumber}
                          cardExpiry={cardExpiry}
                          setCardExpiry={setCardExpiry}
                          cardCvv={cardCvv}
                          setCardCvv={setCardCvv}
                          country={country}
                          setCountry={setCountry}
                          postalCode={postalCode}
                          setPostalCode={setPostalCode}
                          processing={paymentState === 'processing'}
                          onPay={() => void handlePay('card')}
                          showPayButton={false}
                        />
                      )}

                      {/* Identical styling to the live site's card pay button */}
                      <button
                        type="button"
                        // wallet_selected already fired on tile select; just pay here
                        onClick={() => void handlePay(selectedMethod)}
                        disabled={paymentState === 'processing'}
                        className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-3 text-lg font-semibold text-white transition-colors hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {paymentState === 'processing' ? (
                          'Processing Payment...'
                        ) : (
                          <>
                            <LucideLock className="mr-2 h-5 w-5" />
                            Pay &amp; access report
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <LucideLock className="mr-1 h-3 w-3" />
                    <span>Secured by SSL Encryption</span>
                  </div>
                </div>
              ) : (
                <div className="checkout-payment-section">
                  <div className="checkout-payment-box rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
                    <div className="checkout-payment-inner">
                      <div className="checkout-wallet-stack">
                        <StripeLinkButton onClick={() => handleWalletPay('stripe_link')} />
                        <ApplePayButton onClick={() => handleWalletPay('apple_pay')} />
                        <GooglePayButton onClick={() => handleWalletPay('google_pay')} />
                        <PayPalButton onClick={() => handleWalletPay('paypal')} />
                      </div>

                      <div className="my-1 flex items-center text-gray-500">
                        <div className="grow border-t border-gray-200" />
                        <span className="px-3 text-xs uppercase">or</span>
                        <div className="grow border-t border-gray-200" />
                      </div>

                      <div className="checkout-billing-hint -mb-2 mt-1 text-center">
                        <p
                          className="m-0 text-sm leading-5 text-[#6b7280]"
                          style={bodyStyle}
                        >
                          Enter your billing details below.
                        </p>
                      </div>

                      <CardForm
                        email={email}
                        cardholder={cardholder}
                        setCardholder={setCardholder}
                        cardNumber={cardNumber}
                        setCardNumber={setCardNumber}
                        cardExpiry={cardExpiry}
                        setCardExpiry={setCardExpiry}
                        cardCvv={cardCvv}
                        setCardCvv={setCardCvv}
                        country={country}
                        setCountry={setCountry}
                        postalCode={postalCode}
                        setPostalCode={setPostalCode}
                        processing={paymentState === 'processing'}
                        onPay={() => void handlePay('card')}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <LucideLock className="mr-1 h-3 w-3" />
                    <span>Secured by SSL Encryption</span>
                  </div>
                </div>
              )}

              <p
                className="mt-2 text-center text-xs"
                style={{ ...condensedStyle, fontWeight: 400, color: '#949494' }}
              >
                Charges will appear on your billing statement as Cheaterscanner.com
              </p>
            </div>

            <CheckoutPaymentLogos />

            <br />

            <CheckoutTrustBadges />
            <CheckoutEbookPromo />
          </div>
        </div>
      </div>
    </div>
  )
}
