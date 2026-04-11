'use client'

import { useState, memo, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { Company, CATEGORY_COLORS } from '@/types'

/* ── Global image status cache ──
   Prevents re-mounting logos from hitting the network again.
   Once a URL succeeds or fails it's remembered for the session. */
const imgStatusCache = new Map<string, 'ok' | 'err'>()

interface Props {
  company: Company
  size?: number
  rounded?: string
  wide?: boolean
}

export default memo(function CompanyLogo({ company, size = 40, rounded = 'rounded-2xl', wide }: Props) {
  const colors = CATEGORY_COLORS[company.category]
  
  const wideSrc = `/logos/${company.id}-wide.png`
  const squareSrc = `/logos/${company.id}.png`
  
  // Try wide src first if requested, otherwise start with square
  const initialSrc = wide ? wideSrc : squareSrc
  
  const [currentSrc, setCurrentSrc] = useState<string>(
    () => imgStatusCache.get(initialSrc) === 'err' && wide ? squareSrc : initialSrc
  )
  const [failed, setFailed] = useState(() => imgStatusCache.get(squareSrc) === 'err')

  // Effect to handle prop changes (e.g. reused component for different company)
  useEffect(() => {
    const src = wide ? wideSrc : squareSrc
    if (imgStatusCache.get(src) === 'err') {
      if (wide && imgStatusCache.get(squareSrc) !== 'err') {
        setCurrentSrc(squareSrc)
        setFailed(false)
      } else {
        setFailed(true)
      }
    } else {
      setCurrentSrc(src)
      setFailed(false)
    }
  }, [company.id, wide, wideSrc, squareSrc])

  const handleLoad = () => {
    imgStatusCache.set(currentSrc, 'ok')
  }

  const handleError = () => {
    imgStatusCache.set(currentSrc, 'err')
    if (wide && currentSrc === wideSrc) {
      // If the wide image failed, fallback to the square one
      if (imgStatusCache.get(squareSrc) === 'err') {
        setFailed(true)
      } else {
        setCurrentSrc(squareSrc)
      }
    } else {
      // If square failed (or we weren't wide to begin with), show icon
      setFailed(true)
    }
  }

  /* ── SVG icon fallback ── */
  if (failed) {
    const iconSize = Math.max(10, Math.round(size * 0.45))
    return (
      <div
        className={`flex flex-shrink-0 items-center justify-center ${rounded}`}
        style={{
          width: wide ? size * 1.5 : size,
          height: size,
          backgroundColor: colors.bg,
          border: `1px solid ${colors.pin}20`,
        }}
      >
        <Globe
          size={iconSize}
          strokeWidth={1.8}
          style={{ color: colors.pin, opacity: 0.7 }}
        />
      </div>
    )
  }

  return (
    <img
      src={currentSrc}
      alt={company.name}
      width={wide && currentSrc === wideSrc ? size * 1.5 : size}
      height={size}
      loading="lazy"
      decoding="async"
      className={`flex-shrink-0 ${rounded} object-contain bg-white`}
      style={{ 
        width: wide && currentSrc === wideSrc ? size * 1.5 : size, 
        height: size, 
        padding: Math.max(2, Math.round(size * 0.07)) 
      }}
      onLoad={handleLoad}
      onError={handleError}
    />
  )
})
