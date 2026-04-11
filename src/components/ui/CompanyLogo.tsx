'use client'

import { useState, memo } from 'react'
import { Building2 } from 'lucide-react'
import { Company, CATEGORY_COLORS } from '@/types'

/* ── Global image status cache ──
   Prevents re-mounting logos from hitting the network again.
   Once a URL succeeds or fails it's remembered for the session. */
const imgStatusCache = new Map<string, 'ok' | 'err'>()

interface Props {
  company: Company
  size?: number
  rounded?: string
  wide?: boolean  // kept for API compat, ignored
}

export default memo(function CompanyLogo({ company, size = 40, rounded = 'rounded-2xl' }: Props) {
  const colors = CATEGORY_COLORS[company.category]
  const localSrc = `/logos/${company.id}.png`

  /* Skip straight to fallback if we already know the local logo fails */
  const [failed, setFailed] = useState(() => imgStatusCache.get(localSrc) === 'err')

  const handleLoad = () => {
    imgStatusCache.set(localSrc, 'ok')
  }

  const handleError = () => {
    imgStatusCache.set(localSrc, 'err')
    setFailed(true)
  }

  /* ── SVG icon fallback ── */
  if (failed) {
    const iconSize = Math.max(10, Math.round(size * 0.45))
    return (
      <div
        className={`flex flex-shrink-0 items-center justify-center ${rounded}`}
        style={{
          width: size,
          height: size,
          backgroundColor: colors.bg,
          border: `1px solid ${colors.pin}20`,
        }}
      >
        <Building2
          size={iconSize}
          strokeWidth={1.8}
          style={{ color: colors.pin, opacity: 0.7 }}
        />
      </div>
    )
  }

  return (
    <img
      src={localSrc}
      alt={company.name}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={`flex-shrink-0 ${rounded} object-contain bg-white`}
      style={{ width: size, height: size, padding: Math.max(2, Math.round(size * 0.07)) }}
      onLoad={handleLoad}
      onError={handleError}
    />
  )
})
