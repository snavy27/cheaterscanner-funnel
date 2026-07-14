import { useContext } from 'react'
import { VariantContext, type VariantContextValue } from './VariantProvider'

export function useVariant(): VariantContextValue {
  const ctx = useContext(VariantContext)
  if (!ctx) {
    throw new Error('useVariant must be used within a <VariantProvider>')
  }
  return ctx
}
