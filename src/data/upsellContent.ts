// Post-payment upsell sequence, mirrored from the live cheaterscanner.com flow
// (captured 2026-07). Prices are the live EUR amounts (USD list price shown where
// the live screen shows a "≈ $x USD" hint). This is a CRO mock — no real charges.

export type UpsellId =
  | 'radius'
  | 'apps'
  | 'tracker'
  | 'priority'
  | 'credits'
  | 'people'
  | 'sexoffender'
  | 'criminal'
  | 'bundle'

export type UpsellKind =
  | 'radius'
  | 'apps'
  | 'plans'
  | 'priority'
  | 'credits'
  | 'safety'

export interface UpsellFaq {
  q: string
  a: string
}

export interface Tier {
  label: string
  /** live price in EUR, formatted like "17,01 €" */
  price: string
  /** optional struck-through "regular" price */
  wasPrice?: string
}

export interface UpsellConfig {
  id: UpsellId
  kind: UpsellKind
  /** small pink pill above the title (safety screens) */
  eyebrow?: string
  emoji: string
  title: string
  subtitle: string
  /** the hero block: live map composition (radius) or a real image asset from the live site */
  hero:
    | { variant: 'map'; caption: string }
    | { variant: 'image'; src: string; alt: string }
  /** selectable tiers (radius / plans / credits) */
  tiers?: Tier[]
  defaultTier?: number
  /** heading + note shown above the tier selector (radius screen) */
  tierHeading?: string
  tierNote?: string
  /** apps screen selectable apps */
  apps?: { name: string; icon: string; price: string; free?: boolean; defaultOn?: boolean }[]
  /** single fixed price (priority / safety) */
  price?: string
  usdHint?: string
  bonusBadge?: string
  /** "Here's what you'll discover inside:" bullets */
  bullets: string[]
  acceptLabel: string
  declineLabel: string
  footnote: string
  faqs: UpsellFaq[]
}

const COMMON_FAQS: UpsellFaq[] = [
  {
    q: 'Is it legal to use CheaterScanner?',
    a: 'Yes, CheaterScanner is legal to use. We only search for publicly available information on dating platforms that anyone could find manually.',
  },
  {
    q: 'How accurate are the results?',
    a: 'Our results are accurate, powered by advanced matching algorithms and real-time scanning across dating platforms.',
  },
  {
    q: 'Is it Legit?',
    a: "Absolutely. We're a legitimate service used by thousands of people to verify their relationships and gain peace of mind.",
  },
]

// Active sequence, including the safety checks (sexoffender / criminal / bundle).
export const UPSELL_SEQUENCE: UpsellId[] = [
  'radius',
  'apps',
  'tracker',
  'priority',
  'credits',
  'people',
  'sexoffender',
  'criminal',
  'bundle',
]

export const UPSELLS: Record<UpsellId, UpsellConfig> = {
  radius: {
    id: 'radius',
    kind: 'radius',
    emoji: '🔍',
    title: 'Expand your search and increase accuracy',
    subtitle: '',
    hero: { variant: 'map', caption: 'Your current search radius is 2.5 km' },
    tiers: [
      { label: '5 km', price: '17,01 €' },
      { label: '30 km', price: '42,54 €' },
      { label: '160 km', price: '85,09 €' },
    ],
    defaultTier: 0,
    tierHeading: '📍 How far do you want to search?',
    tierNote:
      '🧠 Upgraded users often report finding more matches—sometimes even faster—by expanding their radius just a few kilometers.',
    bullets: [
      'Cast a wider net and discover profiles you might have missed',
      'Users who expand their search radius often discover significantly more results',
      'Comprehensive coverage of your extended area',
    ],
    acceptLabel: 'Yes! Expand My Search Radius',
    declineLabel: "No Thanks, I don't want to expand my radius",
    footnote:
      'This is a unique add-on. No recurring charges. Your upgrade activates instantly after purchase. For more information, check our Terms of Service and Privacy Policy, or contact support.',
    faqs: COMMON_FAQS,
  },

  apps: {
    id: 'apps',
    kind: 'apps',
    emoji: '📱',
    title: 'Upgrade to Scan more Dating Apps',
    subtitle:
      'Your initial scan includes one dating app for free. Want broader coverage? Upgrade now to scan multiple apps at once for even stronger results.',
    hero: { variant: 'image', src: '/upsells/apps-hero.jpg', alt: 'Dating apps scan preview' },
    apps: [
      { name: 'Hinge', icon: 'H', price: 'FREE', free: true },
      { name: 'Tinder', icon: '🔥', price: '4,25 €', defaultOn: true },
      { name: 'Bumble', icon: '🐝', price: '3,40 €' },
    ],
    bullets: [
      'Scan across multiple dating platforms simultaneously',
      'Find matches you might have missed on different apps',
      'Comprehensive coverage of popular dating platforms',
    ],
    acceptLabel: 'Yes! Add Tinder To My Scan',
    declineLabel: "No Thanks, I'll Stick with One App",
    footnote:
      'This is a unique add-on. No recurring charges. Your upgrade activates instantly after purchase. For more information, check our Terms of Service and Privacy Policy, or contact support.',
    faqs: COMMON_FAQS,
  },

  tracker: {
    id: 'tracker',
    kind: 'plans',
    emoji: '📸',
    title: 'Track Their Social Activity in Real Time',
    subtitle:
      'Get alerts when they follow someone new, remove a friend, or interact with flirty accounts.',
    hero: { variant: 'image', src: '/upsells/ig-tracker-hero.jpg', alt: 'Instagram Tracker preview' },
    tiers: [
      { label: '1 Tracked Account', price: '8,50 €', wasPrice: '15,31 €' },
      { label: '3 Tracked Accounts', price: '12,76 €', wasPrice: '25,52 €' },
      { label: '5 Tracked Accounts', price: '17,01 €', wasPrice: '29,78 €' },
    ],
    defaultTier: 1,
    bullets: [
      "Dive deep into social media profiles to uncover who they're following, who follows them, and who's recently entered or exited their social circle.",
      'Categorize friends and followers into segments like "Girls They Follow" or "Suspicious Profiles" based on engagement patterns.',
      'See a timeline of their social activity: new friendships, removed connections, even profile picture or bio changes.',
    ],
    acceptLabel: 'Yes! Upgrade to Unlock Tracker',
    declineLabel: "No thanks, I'll skip this for now",
    footnote:
      'This is a unique add-on. No recurring charges. Your upgrade activates instantly after purchase.',
    faqs: COMMON_FAQS,
  },

  priority: {
    id: 'priority',
    kind: 'priority',
    emoji: '⚡',
    title: 'Your Results Could Take A While.',
    subtitle:
      'There are 1,953 scans ahead of yours right now. Skip ahead with priority access and find the truth sooner.',
    hero: { variant: 'image', src: '/upsells/priority-hero.webp', alt: 'Priority scan preview' },
    price: '12,76 €',
    bullets: [
      'Jump the Queue Instantly — your scan moves to the front of the line the moment you upgrade.',
      'Results in Minutes, Not Days — priority scans are processed before every regular scan in the system.',
      'Same Deep Scan, Faster — priority only changes your position, never the quality or thoroughness.',
      'All Platforms Bumped — Tinder, Hinge, and Bumble all moved to the priority queue simultaneously.',
    ],
    acceptLabel: 'Yes, Get Priority Access',
    declineLabel: "No thanks, I'll wait in line",
    footnote:
      'This is a unique add-on. No recurring charges. Your upgrade activates instantly after purchase.',
    faqs: [
      {
        q: 'How much faster will I get my results?',
        a: 'Most priority scans complete within minutes. Regular scans are processed in the order they arrive, depending on how many are ahead of you in the queue.',
      },
      {
        q: 'Does priority change the quality of results?',
        a: 'Not at all. You get the exact same deep scan across all platforms — priority only moves you to the front of the line.',
      },
      {
        q: 'Is this a recurring charge?',
        a: 'No. This is a one-time upgrade for your current scan. You will never be charged again for this.',
      },
    ],
  },

  credits: {
    id: 'credits',
    kind: 'credits',
    emoji: '🔥',
    title: 'Get Additional Searches at Our Lowest Prices Ever!',
    subtitle:
      "Right now, you can secure extra search credits at a fraction of the regular price. So you'll always have the power to search again — for peace of mind, for closure, or simply to keep your options open.",
    hero: { variant: 'image', src: '/upsells/credits-hero.jpg', alt: 'Extra search credits preview' },
    tiers: [
      { label: '1 Credit', price: '8,51 €' },
      { label: '2 Credits', price: '13,61 €' },
      { label: '3 Credits', price: '17,01 €' },
    ],
    defaultTier: 0,
    bullets: [
      'Run additional scans on different platforms or locations',
      'Each credit = one complete search across all dating apps',
      'Never miss a potential match with unlimited scanning power',
    ],
    acceptLabel: 'Yes! Add 1 Credit To My Account',
    declineLabel: "No Thanks, I don't need extra credits",
    footnote:
      'Credits never expire and can be used anytime. Each credit allows one complete scan across all platforms.',
    faqs: COMMON_FAQS,
  },

  people: {
    id: 'people',
    kind: 'credits',
    emoji: '🔍',
    title: 'Add People Scanner Credits At Our Lowest Prices!',
    subtitle:
      'Right now, you can add more People Scanner credits at a fraction of the regular price. Search anyone, anytime — whether you need peace of mind, closure, or want to investigate someone new.',
    hero: { variant: 'image', src: '/upsells/people-credits-hero.jpg', alt: 'People Scanner credits preview' },
    tiers: [
      { label: '1 Credit', price: '5,10 €' },
      { label: '2 Credits', price: '8,50 €' },
      { label: '3 Credits', price: '11,05 €' },
    ],
    defaultTier: 0,
    bullets: [
      'Run additional deep searches on anyone you want to investigate',
      'Each credit = one complete People Scanner search by email, phone, or handle',
      'Get comprehensive results including social profiles, contact info, and online activity',
    ],
    acceptLabel: 'Yes! Add 1 People Scan Credit',
    declineLabel: "No Thanks, I don't need People Scanner credits",
    footnote:
      'Credits never expire and can be used anytime. Each credit allows one complete People Scanner search.',
    faqs: COMMON_FAQS,
  },

  sexoffender: {
    id: 'sexoffender',
    kind: 'safety',
    eyebrow: 'Sex Offender Check + 2 Person Scan Credits',
    emoji: '⚠️',
    title: 'Get Sex Offender Registry Check + 2 Free Person Scans',
    subtitle:
      'Screen across all 50 state registries and federal databases PLUS 2 bonus Person Scanner credits.',
    hero: { variant: 'image', src: '/upsells/sexoffender-hero.jpg', alt: 'Sex offender registry check preview' },
    price: '17,01 €',
    usdHint: '≈ $19.99 USD',
    bonusBadge: 'Bonus Included',
    bullets: [
      'Searches all 50 state registries plus federal databases in seconds',
      'Instant warnings when a match is found in an official registry',
      'One-time payment permanently unlocks the check for your account',
      'Totally private. Nobody is notified that you ran the search.',
    ],
    acceptLabel: 'Yes! Unlock Registry Check + 2 Person Scans',
    declineLabel: "No thanks, I'll skip the registry check",
    footnote: 'One-time $19.99 upgrade. Applies to every future scan. Confidential & discreet.',
    faqs: [
      {
        q: 'What exactly does this include?',
        a: "We search every US state registry plus national databases. If a name appears anywhere, you'll see the details inside your report.",
      },
      {
        q: 'Do I have to trigger it every time?',
        a: 'No. Once unlocked, the check runs automatically in every CheaterScanner report.',
      },
      {
        q: 'How accurate is the info?',
        a: 'Data comes directly from official government registries and is updated constantly for accuracy.',
      },
    ],
  },

  criminal: {
    id: 'criminal',
    kind: 'safety',
    eyebrow: 'Criminal Check + 2 Person Scan Credits',
    emoji: '🚨',
    title: 'Get Criminal Background Check + 2 Free Person Scans',
    subtitle:
      'Deep criminal search across nationwide databases PLUS 2 bonus Person Scanner credits included.',
    hero: { variant: 'image', src: '/upsells/criminal-hero.png', alt: 'Criminal background check preview' },
    price: '17,01 €',
    usdHint: '≈ $19.99 USD',
    bonusBadge: 'Bonus Included',
    bullets: [
      'Nationwide federal, state, and county court coverage',
      'One-time payment permanently unlocks the check for every scan',
      'Instant flags inside future reports when a record is found',
      '100% confidential. Nobody knows you ran the search.',
    ],
    acceptLabel: 'Yes! Unlock Criminal Check + 2 Person Scans',
    declineLabel: "No thanks, I'll skip criminal records",
    footnote: 'One-time $19.99 upgrade. Applies to every future scan. No recurring charges.',
    faqs: [
      {
        q: 'What records will I see?',
        a: "You'll see arrests, warrants, convictions, sentencing details, and open cases sourced from official court databases.",
      },
      {
        q: 'Does this apply to future scans?',
        a: 'Yes. Once unlocked, every CheaterScanner report automatically includes criminal record screening.',
      },
      {
        q: 'How far back does it go?',
        a: 'We search decades of history wherever data is available, so older cases still appear.',
      },
    ],
  },

  bundle: {
    id: 'bundle',
    kind: 'safety',
    eyebrow: 'Complete Safety Bundle + 2 Person Scan Credits',
    emoji: '🛡️',
    title: 'Get Both Safety Checks + 2 Free Person Scans',
    subtitle:
      'Criminal records + sex offender alerts PLUS 2 bonus Person Scanner credits. Ultimate protection bundle!',
    hero: { variant: 'image', src: '/upsells/bundle-hero.png', alt: 'Complete safety bundle preview' },
    price: '25,52 €',
    usdHint: '≈ $29.99 USD',
    bonusBadge: 'Best Value + Bonus',
    bullets: [
      'Includes criminal records AND sex offender registry checks forever',
      'Permanently added to your account. Every scan runs both checks automatically.',
      'Save $10 versus buying each upgrade separately',
      'Bundle pricing is only offered right now during checkout.',
    ],
    acceptLabel: 'Yes! Unlock Complete Bundle + 2 Person Scans',
    declineLabel: "No thanks, I'll add them separately later",
    footnote: 'One-time $29.99 charge. Both checks run on every future CheaterScanner report.',
    faqs: [
      {
        q: "What's inside the bundle?",
        a: 'You get lifetime access to both checks. Every scan will include criminal records plus sex offender registry results.',
      },
      {
        q: 'How much am I saving?',
        a: 'Each upgrade is $19.99 alone. The bundle is $29.99, so you save $10 immediately.',
      },
      {
        q: 'Is this really forever?',
        a: "Yes. It's a one-time upgrade that stays tied to your account, even for scans you run months from now.",
      },
    ],
  },
}
