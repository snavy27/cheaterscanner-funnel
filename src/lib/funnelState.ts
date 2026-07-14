export type UpsellStep =
  | 'upsell_radius'
  | 'upsell_apps'
  | 'upsell_tracker'
  | 'upsell_priority'
  | 'upsell_credits'
  | 'upsell_people'
  | 'upsell_sexoffender'
  | 'upsell_criminal'
  | 'upsell_bundle'

export type FunnelStep =
  | 'landing'
  | 'quiz_gender'
  | 'quiz_name'
  | 'quiz_location'
  | 'quiz_age'
  | 'photo'
  | 'analyzing'
  | 'email'
  | 'offer'
  | 'thank_you'
  | UpsellStep
  | 'queued'
  | 'account'

// Post-payment upsell sequence, mirrors the live cheaterscanner.com flow order.
export const UPSELL_STEPS: UpsellStep[] = [
  'upsell_radius',
  'upsell_apps',
  'upsell_tracker',
  'upsell_priority',
  'upsell_credits',
  'upsell_people',
  'upsell_sexoffender',
  'upsell_criminal',
  'upsell_bundle',
]

export interface FunnelAnswers {
  gender?: string
  name?: string
  location?: string
  age?: string
  email?: string
  photoUploaded?: boolean
  selectedPlanId?: string
  scanResult?: { matches: number; apps: number }
}

const STORAGE_KEY = 'cs_funnel_state'

const ALL_STEPS: FunnelStep[] = [
  'landing',
  'quiz_gender',
  'quiz_age',
  'quiz_name',
  'quiz_location',
  'photo',
  'analyzing',
  'email',
  'offer',
  'thank_you',
  ...UPSELL_STEPS,
  'queued',
  'account',
]

export function loadFunnelState(): { step: FunnelStep; answers: FunnelAnswers } {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const step = ALL_STEPS.includes(parsed.step) ? parsed.step : 'landing'
      return { step, answers: { selectedPlanId: '2', ...parsed.answers } }
    }
  } catch {
    /* ignore */
  }
  return { step: 'landing', answers: { selectedPlanId: '2' } }
}

export function saveFunnelState(step: FunnelStep, answers: FunnelAnswers) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers }))
}

export function clearFunnelState() {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function buildStepOrder(emailBeforeAnalyzing: boolean): FunnelStep[] {
  const preScan: FunnelStep[] = ['landing', 'quiz_gender', 'quiz_age', 'quiz_name', 'quiz_location', 'photo']
  const postScan: FunnelStep[] = ['offer', 'thank_you', ...UPSELL_STEPS, 'queued', 'account']

  if (emailBeforeAnalyzing) {
    return [...preScan, 'email', 'analyzing', ...postScan]
  }
  return [...preScan, 'analyzing', 'email', ...postScan]
}
