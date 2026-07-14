import {
  CHANGES_BY_VARIANT,
  VARIANT_BY_PATH,
  isActiveVariant,
  type ActiveVariant,
  type Changes,
} from './types'

export const VARIANT_STORAGE_KEY = 'cs_variant'

let resolved: ActiveVariant | null = null

function persist(variant: ActiveVariant) {
  try {
    localStorage.setItem(VARIANT_STORAGE_KEY, variant)
  } catch {
    /* storage unavailable (private mode) — session still works in-memory */
  }
}

/** Maps a Convert variation name to our variant key, e.g. "Variation A" → 'a'. */
function variationNameToVariant(name: string): ActiveVariant | null {
  const n = name.toLowerCase().trim()
  if (isActiveVariant(n)) return n
  if (n.includes('original') || n.includes('control')) return 'control'
  if (n.includes('all')) return 'all'
  const tail = n.match(/(?:^|[\s\-_(])([abc])\)?$/)
  return tail && isActiveVariant(tail[1]) ? tail[1] : null
}

/**
 * Bridges Convert.com's variation assignment into window.__csVariant.
 * The snippet in index.html loads synchronously before the app bundle, so by the
 * time this runs Convert has already bucketed the visitor and exposed the
 * assignment on window.convert.currentData. A variation's custom JS may also set
 * window.__csVariant directly — that always wins over this mapping.
 */
function applyConvertAssignment() {
  if (isActiveVariant(window.__csVariant)) return

  const data = window.convert?.currentData
  const experiences = { ...data?.experiments, ...data?.experiences }
  for (const exp of Object.values(experiences)) {
    const name = exp?.variation?.name ?? exp?.variation_name
    const variant = name ? variationNameToVariant(name) : null
    if (variant) {
      window.__csVariant = variant
      return
    }
  }
}

/**
 * Resolves the active variant once per page load. Precedence:
 *   1. URL query ?force=control|all|a|b|c  (QA override — always wins)
 *   2. window.__csVariant                  (variation assigned by Convert.com —
 *      set by variation JS or bridged from window.convert.currentData)
 *   3. Pathname: / → all, /a → a, /b → b, /c → c
 *   4. localStorage['cs_variant']          (keeps refreshes on /quiz etc. stable)
 *   5. Default → control
 */
export function resolveVariant(): ActiveVariant {
  if (resolved) return resolved

  const force = new URLSearchParams(window.location.search).get('force')
  if (isActiveVariant(force)) {
    resolved = force
    persist(force)
    return resolved
  }

  applyConvertAssignment()

  if (isActiveVariant(window.__csVariant)) {
    resolved = window.__csVariant
    persist(resolved)
    return resolved
  }

  const fromPath = VARIANT_BY_PATH[window.location.pathname]
  if (fromPath) {
    resolved = fromPath
    persist(fromPath)
    return resolved
  }

  let stored: string | null = null
  try {
    stored = localStorage.getItem(VARIANT_STORAGE_KEY)
  } catch {
    /* ignore */
  }
  if (isActiveVariant(stored)) {
    resolved = stored
    return resolved
  }

  resolved = 'control'
  persist(resolved)
  return resolved
}

export function getActiveVariant(): ActiveVariant {
  return resolved ?? resolveVariant()
}

export function getChanges(): Changes {
  return CHANGES_BY_VARIANT[getActiveVariant()]
}
