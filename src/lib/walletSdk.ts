// Fake wallet SDK init — this is a CRO mock, there is no real payment backend.
// change4b_loadSdksEarly calls this on offer-page load instead of checkout open.

let initialized = false

export function preloadWalletSdks() {
  if (initialized) return
  initialized = true
  console.debug('[walletSdk] wallet SDKs mounted (mock)')
}

export function areWalletSdksReady(): boolean {
  return initialized
}
