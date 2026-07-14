// Convert.com configuration — replace all TODO placeholders with real IDs from Convert dashboard

export const CONVERT_ACCOUNT_ID = 'ACCOUNT_ID' // TODO
export const CONVERT_PROJECT_ID = 'PROJECT_ID' // TODO

// Option 1 (matches spec): one A/B/n Split-URL test — Original vs /, /a, /b, /c.
// Option 2 (cleaner attribution): separate A/B tests, one per route. See README.
export const CONVERT_EXPERIENCES = {
  split_url_abn: 'EXP_SPLIT_URL_ID', // TODO — Original (control) vs /, /a, /b, /c
} as const

export const CONVERT_GOALS = {
  pageview_subscription: 'GOAL_PAGEVIEW_SUBSCRIPTION', // TODO
  offer_view: 'GOAL_OFFER_VIEW', // TODO
  add_to_cart: 'GOAL_ADD_TO_CART', // TODO — secondary
  checkout_initiated: 'GOAL_CHECKOUT_INITIATED', // TODO — secondary
  purchase_success: 'GOAL_PURCHASE_SUCCESS', // TODO — PRIMARY / guardrail
  purchase_revenue: 'GOAL_PURCHASE_REVENUE', // TODO — revenue goal (guardrail)
  signup_completed: 'GOAL_SIGNUP_COMPLETED', // TODO
  matches_tile_tapped: 'GOAL_MATCHES_TILE_TAPPED', // TODO — interaction (change3)
  match_teaser_revealed: 'GOAL_MATCH_TEASER_REVEALED', // TODO — interaction (change3)
  unlock_cta_clicked: 'GOAL_UNLOCK_CTA_CLICKED', // TODO — interaction (change3)
  wallet_selected: 'GOAL_WALLET_SELECTED', // TODO — interaction (change4)
  plan_selected: 'GOAL_PLAN_SELECTED', // TODO — interaction (change5)
} as const

export type ConvertGoalKey = keyof typeof CONVERT_GOALS

export const EVENT_TO_CONVERT_GOAL: Partial<Record<string, ConvertGoalKey>> = {
  offer_view: 'offer_view',
  add_to_cart: 'add_to_cart',
  checkout_initiated: 'checkout_initiated',
  purchase_success: 'purchase_success',
  signup_completed: 'signup_completed',
  matches_tile_tapped: 'matches_tile_tapped',
  match_teaser_revealed: 'match_teaser_revealed',
  unlock_cta_clicked: 'unlock_cta_clicked',
  wallet_selected: 'wallet_selected',
  plan_selected: 'plan_selected',
}
