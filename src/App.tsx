import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Funnel } from './funnel/Funnel'
import { saveFunnelEntry } from './lib/funnelUrls'
import { VariantProvider } from './variant/VariantProvider'

function FunnelRoute() {
  const location = useLocation()

  // Remember which landing route the session entered through so back-navigation
  // from /quiz etc. returns to the same route.
  useEffect(() => {
    saveFunnelEntry(location.pathname)
  }, [location.pathname])

  return <Funnel />
}

export default function App() {
  return (
    <VariantProvider>
      <BrowserRouter>
        <Routes>
          {/* Variant resolution is path-based: / → all, /a → a, /b → b, /c → c.
              ?force=control|all|a|b|c overrides everything (QA). */}
          <Route path="/" element={<FunnelRoute />} />
          <Route path="/a" element={<FunnelRoute />} />
          <Route path="/b" element={<FunnelRoute />} />
          <Route path="/c" element={<FunnelRoute />} />
          <Route path="/quiz" element={<FunnelRoute />} />
          <Route path="/subscription" element={<FunnelRoute />} />
          <Route path="/thank-you" element={<FunnelRoute />} />
          <Route path="/account" element={<FunnelRoute />} />
        </Routes>
      </BrowserRouter>
    </VariantProvider>
  )
}
