import type { Plan } from '../lib/plans'
import { formatEuro } from '../lib/plans'
import { LucideBan, LucideDollarSign } from './SubscriptionIcons'

interface PlanCardsProps {
  plans: Plan[]
  selectedPlanId: string
  selectable: boolean
  /** change5 — evident selected state: strong highlight + checkmark */
  evident?: boolean
  onSelect?: (planId: string) => void
}

const sairaStyle = { fontFamily: 'var(--font-display)', letterSpacing: 'normal' as const }

const popularBadgeStyle = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  transform: 'translateX(-50%)',
  boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px',
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function PlanCards({ plans, selectedPlanId, selectable, evident = false, onSelect }: PlanCardsProps) {
  return (
    <>
      <div className="space-y-4 px-3 sm:px-4">
      {plans.map((plan) => {
        const isSelected = selectedPlanId === plan.id
        const evidentSelected = evident && isSelected
        // Evident cards keep a constant 2px border so selecting never shifts layout.
        const borderClass = evident
          ? evidentSelected
            ? 'border-2 border-[#EC3A49] bg-[#FFF5F5] shadow-md'
            : 'border-2 border-transparent'
          : isSelected
            ? 'border border-[#FF7B78] shadow-md'
            : 'border border-transparent'
        return (
          <div
            key={plan.id}
            role={selectable ? 'button' : undefined}
            tabIndex={selectable ? 0 : undefined}
            aria-pressed={selectable ? isSelected : undefined}
            onClick={selectable ? () => onSelect?.(plan.id) : undefined}
            onKeyDown={
              selectable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') onSelect?.(plan.id)
                  }
                : undefined
            }
            className={`rounded-xl p-3 sm:p-4 relative bg-white ${borderClass} ${
              selectable ? 'cursor-pointer' : ''
            }`}
          >
            {evidentSelected && (
              <span
                className="absolute -top-3 right-3 inline-flex items-center gap-1 rounded-full bg-[#EC3A49] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                style={{ ...sairaStyle, boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px' }}
              >
                <CheckIcon className="w-2.5 h-2.5" />
                Selected
              </span>
            )}
            {plan.popular && (
              <div
                className="absolute -top-3 left-1/2 bg-[#EC3A49] text-white text-xs px-3 py-0.5 rounded-full font-bold uppercase"
                style={popularBadgeStyle}
              >
                Most Popular
              </div>
            )}
            <div className="flex items-center">
              <div className="flex items-center flex-1">
                {evident ? (
                  <div
                    className={`w-10 h-10 rounded-full mr-3 shrink-0 flex items-center justify-center transition-colors ${
                      evidentSelected
                        ? 'bg-[#EC3A49] text-white'
                        : 'bg-white border-2 border-[#FFBDBD]'
                    }`}
                  >
                    {evidentSelected && <CheckIcon className="w-5 h-5" />}
                  </div>
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full mr-3 shrink-0 ${
                      isSelected
                        ? 'bg-[#FF8986] border-4 border-white'
                        : 'bg-[#FFBDBD]'
                    }`}
                  />
                )}
                <h3
                  className="text-lg sm:text-xl font-bold text-gray-900 flex-1"
                  style={sairaStyle}
                >
                  {plan.name}
                </h3>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center mb-1">
                  <span
                    className="text-xs sm:text-sm text-gray-500 line-through mr-1.5"
                    style={{ fontFamily: 'var(--font-body)' }}
                  >
                    {formatEuro(plan.originalPrice)}
                  </span>
                  <span
                    className="text-xs px-2 py-1 bg-[#FF8986] text-white rounded-md"
                    style={sairaStyle}
                  >
                    SAVE {plan.savePercent}%
                  </span>
                </div>
                <div
                  className="text-xl sm:text-2xl font-bold text-gray-900"
                  style={sairaStyle}
                >
                  {formatEuro(plan.salePrice)}{' '}
                  <span className="text-sm text-gray-500">+ tax</span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
      </div>
      <div className="text-center mt-2 pr-5 flex items-center justify-end text-sm text-white">
        <span className="inline-flex items-center mr-2">
          <LucideBan className="mr-0 w-3 h-3" />
        </span>
        <span style={sairaStyle}>Cancel Anytime</span>
        <span className="mx-2">|</span>
        <span className="inline-flex items-center">
          <LucideDollarSign className="mr-2 w-3 h-3" />
          <span style={sairaStyle}>30 day money-back guarantee</span>
        </span>
      </div>
    </>
  )
}
