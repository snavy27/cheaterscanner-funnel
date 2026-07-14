import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  initialMinutes?: number
  initialSeconds?: number
  className?: string
  label?: string
}

export function CountdownTimer({
  initialMinutes = 10,
  initialSeconds = 0,
  className = '',
  label,
}: CountdownTimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60 + initialSeconds)

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSeconds((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  return (
    <span className={className}>
      {label && <span>{label} </span>}
      <span className="font-semibold tabular-nums">{display}</span>
    </span>
  )
}
