import type { FunnelStep } from './funnelState'
import { UPSELL_STEPS } from './funnelState'

// Steps that all live under the /thank-you path, distinguished by history state.
const THANK_YOU_SUBSTEPS = new Set<FunnelStep>([...UPSELL_STEPS, 'queued'])

export const QS_PARAM = 'qs'

const QS_TO_STEP: Record<string, FunnelStep> = {
  gender: 'quiz_gender',
  age: 'quiz_age',
  name: 'quiz_name',
  location: 'quiz_location',
  pictures: 'photo',
  analyzing: 'analyzing',
  email: 'email',
}

const STEP_TO_QS: Partial<Record<FunnelStep, string>> = {
  quiz_gender: 'gender',
  quiz_age: 'age',
  quiz_name: 'name',
  quiz_location: 'location',
  photo: 'pictures',
  analyzing: 'analyzing',
  email: 'email',
}

const LANDING_PATHS = new Set(['/', '/a', '/b', '/c'])

const ENTRY_KEY = 'cs_funnel_entry'

export function saveFunnelEntry(pathname: string) {
  if (LANDING_PATHS.has(pathname)) {
    sessionStorage.setItem(ENTRY_KEY, pathname)
  }
}

export function getFunnelEntry(): string {
  return sessionStorage.getItem(ENTRY_KEY) || '/'
}

export function isLandingPath(pathname: string): boolean {
  return LANDING_PATHS.has(pathname)
}

export function urlToStep(
  pathname: string,
  search: string,
  historyState?: unknown,
): FunnelStep | null {
  if (isLandingPath(pathname)) return 'landing'

  const params = new URLSearchParams(search)

  if (pathname === '/quiz') {
    const qs = params.get(QS_PARAM)
    if (qs && QS_TO_STEP[qs]) return QS_TO_STEP[qs]
    return 'quiz_gender'
  }

  if (pathname === '/subscription') return 'offer'

  if (pathname === '/thank-you') {
    const subStep = (historyState as { subStep?: FunnelStep } | null)?.subStep
    if (subStep && THANK_YOU_SUBSTEPS.has(subStep)) return subStep
    return 'thank_you'
  }

  if (pathname === '/account') return 'account'

  return null
}

export function stepToUrl(step: FunnelStep, search = ''): string {
  const params = new URLSearchParams(search)
  params.delete('restart')

  if (step === 'landing') {
    params.delete(QS_PARAM)
    const entry = getFunnelEntry()
    const qs = params.toString()
    return qs ? `${entry}?${qs}` : entry
  }

  const qsValue = STEP_TO_QS[step]
  if (qsValue) {
    params.set(QS_PARAM, qsValue)
    const qs = params.toString()
    return `/quiz?${qs}`
  }

  params.delete(QS_PARAM)

  const pathByStep: Partial<Record<FunnelStep, string>> = {
    offer: '/subscription',
    thank_you: '/thank-you',
    account: '/account',
  }

  const path = pathByStep[step] ?? (THANK_YOU_SUBSTEPS.has(step) ? '/thank-you' : undefined)
  if (!path) return getFunnelEntry()

  const qs = params.toString()
  return qs ? `${path}?${qs}` : path
}

export function stepToHistoryState(step: FunnelStep): { subStep?: FunnelStep } | undefined {
  if (THANK_YOU_SUBSTEPS.has(step)) {
    return { subStep: step }
  }
  return undefined
}
