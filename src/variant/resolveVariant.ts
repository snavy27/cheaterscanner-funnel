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

/**
 * Resolves the active variant once per page load. Precedence:
 *   1. URL query ?force=control|all|a|b|c  (QA override — always wins)
 *   2. window.__csVariant                  (set by Convert.com at runtime)
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
