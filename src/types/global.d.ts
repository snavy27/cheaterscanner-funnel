interface ConvertExperienceData {
  variation?: { id?: string | number; name?: string }
  variation_name?: string
}

declare global {
  interface Window {
    /** Set by Convert.com per variation: 'control' | 'all' | 'a' | 'b' | 'c' */
    __csVariant?: string
    _conv_q?: Array<unknown[]>
    /** Populated by the Convert.com tracking snippet once it has run. */
    convert?: {
      currentData?: {
        experiments?: Record<string, ConvertExperienceData>
        experiences?: Record<string, ConvertExperienceData>
      }
    }
  }
}

export {}
