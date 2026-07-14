import type { ReactNode } from 'react'
import { TopBar } from './TopBar'

interface FunnelLayoutProps {
  children: ReactNode
  onGetAccess?: () => void
  showTopBar?: boolean
}

export function FunnelLayout({ children, onGetAccess, showTopBar = true }: FunnelLayoutProps) {
  return (
    <div className="bg-funnel min-h-dvh">
      {showTopBar && <TopBar onGetAccess={onGetAccess} />}
      <main className="mx-auto max-w-lg px-4 pb-8">{children}</main>
    </div>
  )
}
