import { useMemo, useState } from 'react'
import { UpsellModal } from '../components/UpsellModal'
import type { UpsellConfig } from '../data/upsellContent'
import { track } from '../lib/track'

interface UpsellScreenProps {
  config: UpsellConfig
  onAccept: () => void
  onDecline: () => void
}

function eurNumber(price: string): number {
  return parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.')) || 0
}
function formatEur(n: number): string {
  return n.toFixed(2).replace('.', ',') + '\u00a0€'
}

/** radius circle diameter (px) per selected tier: 5 km / 30 km / 160 km */
const RADIUS_TIER_SIZE = [56, 130, 230]

function Hero({ config, tier = 0 }: { config: UpsellConfig; tier?: number }) {
  const hero = config.hero

  if (hero.variant === 'map') {
    const size = RADIUS_TIER_SIZE[Math.min(tier, RADIUS_TIER_SIZE.length - 1)]
    return (
      <div className="relative mb-5 h-56 overflow-hidden rounded-xl">
        <img
          src="/upsells/radius-map.png"
          alt="Search area map"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#EC3A49] bg-[#EC3A49]/15 transition-all duration-300"
          style={{ width: size, height: size }}
        />
        <div className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#EC3A49] shadow" />
        <div className="absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-md bg-[#2f80ed] px-3 py-1.5 text-xs font-medium text-white shadow">
          <img src="/upsells/plane.png" alt="" className="h-3 w-3" />
          {hero.caption}
        </div>
      </div>
    )
  }

  // Real hero asset from the live site, same markup as production:
  // div.relative.mb-4 > img.mx-auto.rounded-2xl.shadow-lg (300x400)
  return (
    <div className="relative mb-4">
      <img
        src={hero.src}
        alt={hero.alt}
        width={300}
        height={400}
        loading="lazy"
        className="mx-auto rounded-2xl shadow-lg"
      />
    </div>
  )
}

export function UpsellScreen({ config, onAccept, onDecline }: UpsellScreenProps) {
  const [tier, setTier] = useState(config.defaultTier ?? 0)
  const [apps, setApps] = useState<Record<string, boolean>>(() =>
    Object.fromEntries((config.apps ?? []).map((a) => [a.name, !!a.defaultOn || !!a.free])),
  )

  const total = useMemo(() => {
    if (config.kind === 'apps' && config.apps) {
      const sum = config.apps
        .filter((a) => apps[a.name] && !a.free)
        .reduce((acc, a) => acc + eurNumber(a.price), 0)
      return formatEur(sum)
    }
    if (config.tiers) return config.tiers[tier]?.price ?? config.tiers[0].price
    return config.price ?? ''
  }, [config, tier, apps])

  const accept = () => {
    track('upsell', { upsell_type: config.id, action: 'accept' })
    onAccept()
  }
  const decline = () => {
    track('upsell', { upsell_type: config.id, action: 'decline' })
    onDecline()
  }

  return (
    <UpsellModal faqs={config.faqs} onBack={decline} onClose={decline}>
      {config.eyebrow && (
        <div className="mx-auto mb-3 w-fit rounded-full bg-[#FFE9EA] px-3 py-1 text-center text-xs font-semibold text-[#EC3A49]">
          {config.eyebrow}
        </div>
      )}
      <h2 className="font-display mb-2 text-center text-2xl font-bold leading-tight text-[#1A1A1A]">
        <span className="mr-1">{config.emoji}</span>
        {config.title}
      </h2>
      {config.subtitle && (
        <p className="mb-5 text-center text-sm text-gray-500">{config.subtitle}</p>
      )}

      <Hero config={config} tier={tier} />

      {/* Radius / credits: pill tier selector */}
      {(config.kind === 'radius' || config.kind === 'credits') && config.tiers && (
        <div className="mb-4">
          {config.tierHeading && (
            <h3 className="font-display mb-2 mt-1 text-center text-lg font-bold text-[#1A1A1A]">
              {config.tierHeading}
            </h3>
          )}
          {config.tierNote && (
            <p className="mb-4 text-center text-xs text-gray-500">{config.tierNote}</p>
          )}
          <div className="grid grid-cols-3 gap-2">
            {config.tiers.map((t, i) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setTier(i)}
                className={`rounded-full py-3 text-sm font-semibold transition-colors ${
                  tier === i
                    ? 'bg-[#FF6252] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tracker: stacked plan cards with strikethrough */}
      {config.kind === 'plans' && config.tiers && (
        <div className="mb-4 space-y-2">
          {config.tiers.map((t, i) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setTier(i)}
              className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-colors ${
                tier === i ? 'border-[#FF6252] bg-[#FFF3F2]' : 'border-gray-200 bg-white'
              }`}
            >
              <span className="text-sm font-semibold text-[#1A1A1A]">{t.label}</span>
              <span className="flex items-center gap-2">
                {t.wasPrice && (
                  <span className="text-xs text-gray-400 line-through">{t.wasPrice}</span>
                )}
                <span className="text-sm font-bold text-[#EC3A49]">{t.price}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Apps: multi-select chips */}
      {config.kind === 'apps' && config.apps && (
        <div className="mb-4 space-y-2">
          {config.apps.map((a) => {
            const on = apps[a.name]
            return (
              <button
                key={a.name}
                type="button"
                disabled={a.free}
                onClick={() => setApps((s) => ({ ...s, [a.name]: !s[a.name] }))}
                className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 transition-colors ${
                  on ? 'border-[#FF6252] bg-[#FFF3F2]' : 'border-gray-200 bg-white'
                } ${a.free ? 'opacity-90' : ''}`}
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-[#1A1A1A]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-xs">
                    {a.icon}
                  </span>
                  {a.name}
                </span>
                <span className={`text-sm font-bold ${a.free ? 'text-[#2FB344]' : 'text-[#EC3A49]'}`}>
                  {a.price}
                </span>
              </button>
            )
          })}
          <p className="pt-1 text-center text-xs text-gray-500">
            💡 Add Bumble too for just <strong>3,40 €</strong> more!
          </p>
        </div>
      )}

      {/* Priority queue card */}
      {config.kind === 'priority' && (
        <div className="mb-4 rounded-xl border border-gray-200 p-4">
          <div className="mb-1 text-xs font-bold tracking-wide text-[#EC3A49]">QUEUE POSITION</div>
          <div className="mb-3 text-xs text-gray-500">Scans processed first-in, first-out</div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-[#EC3A49]">#1,954</div>
              <div className="text-xs text-gray-500">You&apos;re here</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400 line-through">24 hrs</div>
              <div className="text-sm font-bold text-[#2FB344]">~60 mins with priority</div>
            </div>
          </div>
        </div>
      )}

      {/* Safety single-price card */}
      {config.kind === 'safety' && (
        <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
          <div className="text-2xl font-black text-[#1A1A1A]">{config.price}</div>
          {config.usdHint && <div className="text-xs text-gray-500">{config.usdHint}</div>}
          {config.bonusBadge && (
            <div className="mx-auto mt-2 w-fit rounded-full bg-[#2FB344]/15 px-3 py-1 text-xs font-semibold text-[#2FB344]">
              {config.bonusBadge}
            </div>
          )}
        </div>
      )}

      {/* Total row (radius / apps / credits) */}
      {(config.kind === 'radius' || config.kind === 'apps' || config.kind === 'credits') && (
        <div className="mb-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-sm font-semibold text-gray-600">Total:</span>
          <span className="text-lg font-black text-[#1A1A1A]">{total}</span>
        </div>
      )}

      {/* Accept */}
      <button
        type="button"
        onClick={accept}
        className="mb-2 w-full rounded-full bg-linear-to-b from-[#FF7061] to-[#EE4B44] py-3.5 text-base font-bold text-white shadow-sm transition-opacity hover:opacity-90"
      >
        {config.acceptLabel}
      </button>
      <p className="mb-4 text-center text-[11px] leading-snug text-gray-400">{config.footnote}</p>

      {/* Discover bullets */}
      <div className="mb-4 border-t border-gray-100 pt-4">
        <h3 className="mb-3 text-sm font-bold text-[#1A1A1A]">
          Here&apos;s what you&apos;ll discover inside:
        </h3>
        <ul className="space-y-2">
          {config.bullets.map((b) => (
            <li key={b} className="flex gap-2 text-xs text-gray-600">
              <span className="text-[#2FB344]">✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Decline */}
      <button
        type="button"
        onClick={decline}
        className="w-full py-2 text-sm text-gray-400 underline"
      >
        {config.declineLabel}
      </button>
    </UpsellModal>
  )
}
