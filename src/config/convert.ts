// Convert.com configuration — project 100110152 (snippet in index.html).
//
// Only these three goals are code-fired via _conv_q. offer_view (100156909) is
// URL-triggered by Convert on /subscription and must NOT be code-fired here —
// that would double-count it.
export const CONVERT_PROJECT_ID = '100110152'

export const CONVERT_GOALS: Record<string, string> = {
  purchase_success: '100156908', // PRIMARY — fired at pay-confirm; also carries revenue
  checkout_initiated: '100156910', // secondary
  add_to_cart: '100156911', // secondary (email submit)
}
