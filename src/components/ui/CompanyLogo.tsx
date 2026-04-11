'use client'

import { useState, useEffect, useRef, memo } from 'react'
import { Company, CATEGORY_COLORS, CATEGORY_SHORT } from '@/types'

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}

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
  const domain = getDomain(company.website)
  const colors = CATEGORY_COLORS[company.category]
  const short  = CATEGORY_SHORT[company.category]

  const localSrc = `/logos/${company.id}.png`

  /* Determine initial attempt based on cache */
  const getInitialAttempt = (): number => {
    if (imgStatusCache.get(localSrc) === 'ok') return 0
    if (imgStatusCache.get(localSrc) === 'err') {
      // Local failed — try favicon if available
      if (domain) {
        const favSrc = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
        if (imgStatusCache.get(favSrc) === 'ok') return 1
        if (imgStatusCache.get(favSrc) === 'err') return 3 // badge
      }
      return domain ? 1 : 3
    }
    return 0
  }

  const [attempt, setAttempt] = useState(getInitialAttempt)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const getSrc = (a: number): string | null => {
    if (a === 0) return localSrc
    if (a === 1 && domain) return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
    return null
  }

  const src = getSrc(attempt)

  const handleLoad = () => {
    if (src) imgStatusCache.set(src, 'ok')
  }

  const handleError = () => {
    if (src) imgStatusCache.set(src, 'err')
    if (!mountedRef.current) return
    // Move to next source
    if (attempt === 0 && domain) {
      setAttempt(1)
    } else {
      setAttempt(3) // badge fallback
    }
  }

  if (!src || attempt >= 3) {
    return (
      <div
        className={`flex flex-shrink-0 items-center justify-center ${rounded} font-black text-white`}
        style={{ width: size, height: size, backgroundColor: colors.pin, fontSize: size * 0.22 }}
      >
        {short}
      </div>
    )
  }

  return (
    <img
      key={`${company.id}-${attempt}`}
      src={src}
      alt={company.name}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      /* Prevent layout shifts */
      className={`flex-shrink-0 ${rounded} object-contain bg-white`}
      style={{ width: size, height: size, padding: Math.max(2, Math.round(size * 0.07)) }}
      onLoad={handleLoad}
      onError={handleError}
    />
  )
})
