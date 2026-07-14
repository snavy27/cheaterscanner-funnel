# CheaterScanner CRO Test Harness

Mobile-first, pixel-plausible mock of the CheaterScanner conversion funnel that runs 4 CRO
changes as A/B variants through Convert.com. One codebase, variant-driven rendering.

This is a **CRO test harness, not a real product**: no backend, fake async "scanning",
in-memory + localStorage/sessionStorage state.

## Run it

```bash
npm install
npm run dev
```

## The funnel (control flow)

Landing (`/`) → Quiz (age → name → location → pictures) → Email gate → Scanning →
Offer page (`/subscription`) → Checkout modal → Thank-you.

Control mirrors the current live site: email is asked right after the pictures step with
plain copy, offer matches are static, checkout shows the standard wallet stack + card form,
and the header countdown timer stays (their own experiment data favors keeping urgency).

## Variants

| Variant  | Route            | change1 | change3 | change4 | change5 |
| -------- | ---------------- | ------- | ------- | ------- | ------- |
| control  | `?force=control` | ✗       | ✗       | ✗       | ✗       |
| all      | `/` (root)       | ✓       | ✓       | ✓       | ✓       |
| a        | `/a`             | ✗       | ✓       | ✗       | ✓       |
| b        | `/b`             | ✗       | ✗       | ✓       | ✗       |
| c        | `/c`             | ✓       | ✗       | ✗       | ✗       |

change3 + change5 are clubbed into `/a` because they are one offer-page redesign.
The email gate renders the control version in every variant.

- **change1 — scanning before the email ask (on `/c`).** The full scanning animation plays
  after the pictures step, *then* the email gate appears. Value reveal precedes the ask.
- **change3 — tappable matches on the offer page (on `/a`).** Three blurred cards (Tinder /
  Bumble / Hinge). Tapping partially reduces blur and shows a teaser (never a full reveal).
  An always-visible "Unlock full report →" CTA scrolls to the plan selection.
- **change4 — checkout wallet default by OS (on `/b`).** iOS → Apple Pay pre-selected on top,
  Android → Google Pay; one-tap "Pay & access report". Card and other wallets collapse under
  "Other ways to pay". Trust row (256-bit SSL · Stripe secured · Anonymous) and the
  discreet-billing line stay.
- **change5 — evident plan cards (on `/a`).** Plan cards become tappable with an
  unmistakable selected state (strong border/fill + checkmark + "Selected" label, one plan
  at a time). Selecting fires `plan_selected` and updates the plan charged at checkout;
  it does NOT auto-open checkout — the confirm step (CTA tap) is preserved.

### Variant resolution (precedence)

Resolved once on load in `src/variant/resolveVariant.ts`:

1. URL query `?force=control|all|a|b|c` — QA override, always wins
2. `window.__csVariant` — set by Convert.com at runtime
3. Pathname: `/` → all, `/a` → a, `/b` → b, `/c` → c
4. `localStorage['cs_variant']` — keeps refreshes on `/quiz`, `/subscription` etc. stable
5. Default → control

`VariantProvider` exposes `activeVariant` and the derived `changes` object via
`useVariant()`; every screen reads `changes.changeN` to pick control vs. changed rendering.

### Backlog flags (NOT wired into a/b/c)

In `src/variant/flags.ts`:

- `change4b_loadSdksEarly` — mount wallet SDKs on offer-page load instead of checkout open.
- `change4c_softenUrgency` — reduce/remove the countdown. **Risky:** their own
  subscription-cro-test data leans toward *keeping* urgency. Backlog idea only.

## Analytics

`src/lib/track.ts` → `track(event, props)` fires to both PostHog and Convert, always
attaching `cs_variant`, current `step`, and `device`/`os`.

Events: `funnel_step_view` (every screen), `quiz_started`, `quiz_step_completed`,
`add_to_cart` (email submit), `offer_view`, `matches_tile_tapped`, `match_teaser_revealed`,
`unlock_cta_clicked`, `plan_selected`, `checkout_initiated`, `wallet_shown`,
`wallet_selected`, `purchase_success`.

Keys/IDs are placeholders: set the PostHog key in `src/config/posthog.ts` and Convert goal
IDs in `src/config/convert.ts`.

### Metric hierarchy

- **PRIMARY / guardrail = `purchase_success` (and revenue).** Do NOT declare a winner on
  upper-funnel events — their own Experiment #2 showed quiz-start/email-step lifts that did
  not convert to revenue.
- **Secondary** = `add_to_cart`, `checkout_initiated`, plus the interaction events
  (`matches_tile_tapped`, `match_teaser_revealed`, `unlock_cta_clicked`, `plan_selected`,
  `wallet_selected`).

## Convert.com setup

Add real credentials to the snippet in `index.html`
(`https://cdn-4.convertexperiments.com/js/ACCOUNT_ID-PROJECT_ID.js`).

Two workable setups — pick one:

**Option 1 (matches spec): one A/B/n Split-URL test.**
Original (control) vs `/`, `/a`, `/b`, `/c`. Convert redirects visitors to the variation
URL; the app derives the variant from the pathname. Simplest to launch; all arms share one
traffic pool and one report.

**Option 2 (cleaner attribution): separate A/B tests.**
One experience per route — Original vs `/`, Original vs `/a`, etc. Each change bundle gets
its own report and its own significance calculation, at the cost of splitting traffic
across experiments.

In either setup a variation can also run custom JS
`window.__csVariant = 'all' /* or 'a' | 'b' | 'c' | 'control' */` instead of redirecting.
`?force=` always overrides Convert for QA.

Map the Convert goal IDs in `src/config/convert.ts` — at minimum `purchase_success` +
`purchase_revenue` (primary), `add_to_cart` and `checkout_initiated` (secondary).

## QA checklist

- `/`, `/a`, `/b`, `/c`, and `?force=control` each render the correct change bundle.
- `?force=` overrides Convert and pathname; the variant is stable across refresh
  (`localStorage['cs_variant']`).
- Every funnel screen fires `funnel_step_view`; events carry `cs_variant` to both PostHog
  and Convert.
- change4 wallet default flips by OS (test with device emulation).
- Funnel completes to thank-you and fires `purchase_success`.
- `/?restart=1` resets the funnel state.

## File structure

```
src/
  main.tsx, App.tsx            # routes: /, /a, /b, /c, /quiz, /subscription, ...
  variant/                     # VariantProvider, useVariant, resolveVariant, flags
  lib/track.ts, device.ts      # analytics wrapper + OS/device detection
  funnel/Funnel.tsx            # state machine: landing→quiz→scanning→email→offer→checkout→thankyou
  screens/                     # Landing, Quiz, PhotoUpload, Offer, Checkout, ThankYou, ...
  components/                  # LockedMatches, CheckoutModal, EmailAuthModal, CountdownTimer, ...
  config/convert.ts, posthog.ts
index.html                     # Convert snippet + PostHog note
```
