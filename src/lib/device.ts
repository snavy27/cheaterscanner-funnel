export type OS = 'ios' | 'android' | 'macos' | 'windows' | 'other'
export type Device = 'mobile' | 'tablet' | 'desktop'

export function getOS(): OS {
  const ua = navigator.userAgent
  // iPadOS 13+ reports as Mac; distinguish via touch support
  if (/iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) {
    return 'ios'
  }
  if (/Android/.test(ua)) return 'android'
  if (/Macintosh|Mac OS X/.test(ua)) return 'macos'
  if (/Windows/.test(ua)) return 'windows'
  return 'other'
}

export function getDevice(): Device {
  const ua = navigator.userAgent
  if (/iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'tablet'
  if (/Android/.test(ua) && !/Mobile/.test(ua)) return 'tablet'
  if (/iPhone|iPod|Android|Mobile/.test(ua)) return 'mobile'
  return 'desktop'
}

/** Preferred one-tap wallet for the current OS (change4). */
export function getPreferredWallet(): 'apple_pay' | 'google_pay' {
  const os = getOS()
  return os === 'ios' || os === 'macos' ? 'apple_pay' : 'google_pay'
}
