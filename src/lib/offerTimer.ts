import { useEffect, useState } from 'react'

const TIMER_KEY = 'cs_offer_timer'
const INITIAL_DURATION = 600

interface OfferTimerState {
  initialDuration: number
  startTimestamp: number | null
  isActive: boolean
}

function readStoredState(): OfferTimerState | null {
  try {
    const raw = localStorage.getItem(TIMER_KEY)
    return raw ? (JSON.parse(raw) as OfferTimerState) : null
  } catch {
    return null
  }
}

function writeStoredState(state: OfferTimerState) {
  localStorage.setItem(TIMER_KEY, JSON.stringify(state))
}

function getRemainingSeconds(state: OfferTimerState): number {
  if (!state.isActive || state.startTimestamp == null) return 0
  const elapsed = Math.floor((Date.now() - state.startTimestamp) / 1000)
  return Math.max(0, state.initialDuration - elapsed)
}

function loadTimerState(): OfferTimerState {
  const stored = readStoredState()
  if (stored) {
    const remaining = getRemainingSeconds(stored)
    if (remaining <= 0) {
      const expired: OfferTimerState = {
        ...stored,
        isActive: false,
      }
      writeStoredState(expired)
      return expired
    }
    return stored
  }

  const started: OfferTimerState = {
    initialDuration: INITIAL_DURATION,
    startTimestamp: Date.now(),
    isActive: true,
  }
  writeStoredState(started)
  return started
}

export function formatOfferTimerDisplay(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function useOfferTimer() {
  const [state, setState] = useState(loadTimerState)
  const [remaining, setRemaining] = useState(() => getRemainingSeconds(state))

  const isActive = state.isActive && remaining > 0

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      const current = readStoredState() ?? state
      const nextRemaining = getRemainingSeconds(current)

      setRemaining(nextRemaining)

      if (nextRemaining <= 0) {
        const expired: OfferTimerState = {
          ...current,
          isActive: false,
        }
        writeStoredState(expired)
        setState(expired)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, state])

  return {
    isActive,
    remaining,
    display: formatOfferTimerDisplay(remaining),
  }
}
