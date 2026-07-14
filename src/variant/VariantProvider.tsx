import { createContext, useMemo, type ReactNode } from 'react'
import { resolveVariant } from './resolveVariant'
import { CHANGES_BY_VARIANT, type ActiveVariant, type Changes } from './types'

export interface VariantContextValue {
  activeVariant: ActiveVariant
  changes: Changes
}

export const VariantContext = createContext<VariantContextValue | null>(null)

export function VariantProvider({ children }: { children: ReactNode }) {
  // Resolved once on load; stable for the whole session (persisted to localStorage).
  const value = useMemo<VariantContextValue>(() => {
    const activeVariant = resolveVariant()
    return { activeVariant, changes: CHANGES_BY_VARIANT[activeVariant] }
  }, [])

  return <VariantContext.Provider value={value}>{children}</VariantContext.Provider>
}
