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

## Analytics

`src/lib/track.ts` → `track(event, props)` fires to both PostHog and Convert, always
attaching `cs_variant`, current `step`, and `device`/`os`.

Events: `funnel_step_view` (every screen), `quiz_started`, `quiz_step_completed`,
`add_to_cart` (email submit), `offer_view`, `matches_tile_tapped`, `match_teaser_revealed`,
`unlock_cta_clicked`, `plan_selected`, `checkout_initiated`, `wallet_shown`,
`wallet_selected`, `purchase_success`.

The PostHog key is still a placeholder (`src/config/posthog.ts`); the Convert goal ids are
live (`src/config/convert.ts`).

### Metric hierarchy

- **PRIMARY / guardrail = `purchase_success` (and revenue).** Do NOT declare a winner on
  upper-funnel events — their own Experiment #2 showed quiz-start/email-step lifts that did
  not convert to revenue.
- **Secondary** = `add_to_cart`, `checkout_initiated`, plus the interaction events
  (`matches_tile_tapped`, `match_teaser_revealed`, `unlock_cta_clicked`, `plan_selected`,
  `wallet_selected`).

## Convert.com setup

The snippet in `index.html` is live for account **10019794**, project **100110152**
(`//cdn-4.convertexperiments.com/v1/js/10019794-100110152.js`), loaded synchronously before
the app bundle so the assignment exists by the time the variant resolver runs.

**How assignment flows:** the resolver (`src/variant/resolveVariant.ts`) reads the assigned
variation from `window.convert.currentData` and maps the variation *name* to our variant
key — name the variations in the dashboard `control`, `a`, `b`, `c`, `all` (or anything
ending in the letter, e.g. "Variation A"). A variation's custom JS can also set
`window.__csVariant = 'a'` directly, which takes priority over the name mapping. If Convert
hasn't assigned anything, the pathname (`/` → all, `/a`/`/b`/`/c`) still works.
`?force=control|all|a|b|c` is the QA override and always wins.

**Live in the dashboard:** Split-URL experience (Original = `?force=control`, variations
`/a` `/b` `/c` at 25% each, All Visitors, Production) and four goals:

| goal | id | trigger |
| --- | --- | --- |
| `purchase_success` (PRIMARY) | 100156908 | code-fired at pay-confirm, + revenue |
| `offer_view` | 100156909 | **URL-based** (`/subscription`) — NOT code-fired, to avoid double-counting |
| `checkout_initiated` | 100156910 | code-fired |
| `add_to_cart` | 100156911 | code-fired (email submit) |

`track()` pushes `['triggerConversion', goalId]` to `window._conv_q` for the three
code-fired goals (on top of the console debug output), and for `purchase_success`
additionally `["pushRevenue", revenue, 1, goalId]`. Verifiable in Convert's
live-log/debugger, or in the browser console via `window._conv_q`.

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
