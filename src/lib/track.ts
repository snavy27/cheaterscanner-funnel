import posthog from 'posthog-js'
import { CONVERT_GOALS } from '../config/convert'
import { POSTHOG_API_KEY, POSTHOG_HOST } from '../config/posthog'
import { getActiveVariant } from '../variant/resolveVariant'
import { getDevice, getOS } from './device'

let posthogInitialized = false

export function initPostHog() {
  if (posthogInitialized || !POSTHOG_API_KEY || POSTHOG_API_KEY.includes('TODO')) return
  posthog.init(POSTHOG_API_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
  })
  posthogInitialized = true
}

// The funnel state machine reports the current step here so every event
// carries it, no matter which component fires the event.
let currentStep = 'landing'

export function setCurrentStep(step: string) {
  currentStep = step
}


/** Fires to both PostHog and Convert, always attaching cs_variant, step and device/os. */
export function track(event: string, props: Record<string, unknown> = {}) {
  const base = {
    cs_variant: getActiveVariant(),
    step: currentStep,
    device: getDevice(),
    os: getOS(),
  }
  const payload = { ...base, ...props }

  if (posthogInitialized) {
    posthog.capture(event, payload)
  } else {
    console.debug('[track]', event, payload)
  }

  const goalId = CONVERT_GOALS[event]
  if (goalId) {
    window._conv_q = window._conv_q || []
    window._conv_q.push(['triggerConversion', goalId])
    if (event === 'purchase_success') {
      // Convert's documented revenue signature: ["pushRevenue", revenue, products_cnt, goal_id]
      const revenue = Number(props.revenue ?? props.$value ?? props.amount ?? 0)
      window._conv_q.push(['pushRevenue', revenue, 1, goalId])
    }
  }
}
