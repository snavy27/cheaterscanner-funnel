import posthog from 'posthog-js'
import { CONVERT_GOALS, EVENT_TO_CONVERT_GOAL } from '../config/convert'
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

function triggerConvertGoal(goalKey: keyof typeof CONVERT_GOALS, revenue?: number) {
  const goalId = CONVERT_GOALS[goalKey]
  if (!goalId || goalId.startsWith('GOAL_')) return

  window._conv_q = window._conv_q || []
  if (revenue !== undefined) {
    window._conv_q.push(['triggerConversion', goalId, revenue])
  } else {
    window._conv_q.push(['triggerConversion', goalId])
  }
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

  let goalKey = EVENT_TO_CONVERT_GOAL[event]
  if (event === '$pageview' && props?.path === '/subscription') {
    goalKey = 'pageview_subscription'
  }

  if (goalKey) {
    const revenue =
      event === 'purchase_success' ? (props?.revenue as number | undefined) : undefined
    triggerConvertGoal(goalKey, revenue)
    if (event === 'purchase_success' && revenue) {
      triggerConvertGoal('purchase_revenue', revenue)
    }
  }
}
