export type ActiveVariant = 'control' | 'all' | 'a' | 'b' | 'c'

export interface Changes {
  /** change1 — play the full scanning animation BEFORE the email ask (resequence) */
  change1: boolean
  /** change3 — tappable blurred matches on the offer page */
  change3: boolean
  /** change4 — checkout wallet default by OS (Apple Pay on iOS, Google Pay on Android) */
  change4: boolean
  /** change5 — evident plan cards: tap-to-select feedback + sticky CTA bound to the selection */
  change5: boolean
}

/**
 * Variant → enabled changes map.
 * change3 + change5 are clubbed into /a because they are one offer-page redesign.
 */
export const CHANGES_BY_VARIANT: Record<ActiveVariant, Changes> = {
  control: { change1: false, change3: false, change4: false, change5: false },
  all: { change1: true, change3: true, change4: true, change5: true },
  a: { change1: false, change3: true, change4: false, change5: true },
  b: { change1: false, change3: false, change4: true, change5: false },
  c: { change1: true, change3: false, change4: false, change5: false },
}

export const VARIANT_BY_PATH: Record<string, ActiveVariant> = {
  '/': 'all',
  '/a': 'a',
  '/b': 'b',
  '/c': 'c',
}

export const VALID_VARIANTS: readonly ActiveVariant[] = ['control', 'all', 'a', 'b', 'c']

export function isActiveVariant(value: unknown): value is ActiveVariant {
  return typeof value === 'string' && (VALID_VARIANTS as readonly string[]).includes(value)
}
