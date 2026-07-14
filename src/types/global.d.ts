declare global {
  interface Window {
    /** Set by Convert.com per variation: 'control' | 'all' | 'a' | 'b' | 'c' */
    __csVariant?: string
    _conv_q?: Array<unknown[]>
  }
}

export {}
