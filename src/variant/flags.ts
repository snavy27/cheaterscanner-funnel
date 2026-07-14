/**
 * Extra / backlog variants — built behind flags, NOT wired into control/all/a/b/c.
 * Flip a flag to true locally (or via a future Convert experience) to preview.
 */
export const BACKLOG_FLAGS = {
  /** Mount/init the wallet SDKs on offer-page load instead of on checkout open. */
  change4b_loadSdksEarly: false,

  /**
   * WARNING: risky backlog idea, not a primary variant. Reduces/removes the
   * countdown urgency. Their own subscription-cro-test data leans toward
   * KEEPING urgency — only test this with a strong hypothesis and a revenue
   * guardrail.
   */
  change4c_softenUrgency: false,
} as const
