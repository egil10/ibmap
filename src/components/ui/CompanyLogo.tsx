'use client'

import { useState, memo, useEffect, useMemo } from 'react'
import { Globe } from 'lucide-react'
import { Company, CATEGORY_COLORS } from '@/types'

/* ── Global image status cache ──
   Prevents re-mounting logos from hitting the network again.
   Once a URL succeeds or fails it's remembered for the session. */
const urlCache = new Map<string, 'ok' | 'err'>()
const bestSourceCache = new Map<string, string | null>()

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}

interface Props {
  company: Company
  size?: number
  rounded?: string
  wide?: boolean
}

export default memo(function CompanyLogo({ company, size = 40, rounded = 'rounded-2xl', wide }: Props) {
  const colors = CATEGORY_COLORS[company.category]
  const domain = getDomain(company.website)
  
  const sources = useMemo(() => {
    const list: string[] = []
    if (wide) list.push(`/logos/${company.id}-wide.png`)
    list.push(`/logos/${company.id}.png`)
    if (domain) {
      list.push(`https://logo.clearbit.com/${domain}?size=128`)
      list.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`)
    }
    return list
  }, [company.id, wide, domain])

  const cacheKey = `${company.id}-${wide ? 'wide' : 'square'}`
  
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [failed, setFailed] = useState<boolean>(false)
  const [currentSrc, setCurrentSrc] = useState<string>('')

  useEffect(() => {
    const cachedBest = bestSourceCache.get(cacheKey)
    if (cachedBest !== undefined) {
      if (cachedBest === null) {
        setFailed(true)
      } else {
        setCurrentSrc(cachedBest)
        setFailed(false)
      }
      return
    }

    // Fast-forward through known bad URLs
    let startIdx = 0
    while (startIdx < sources.length && urlCache.get(sources[startIdx]) === 'err') {
      startIdx++
    }

    if (startIdx >= sources.length) {
      bestSourceCache.set(cacheKey, null)
      setFailed(true)
    } else {
      setCurrentIndex(startIdx)
      setCurrentSrc(sources[startIdx])
      setFailed(false)
    }
  }, [cacheKey, sources])

  const handleLoad = () => {
    urlCache.set(currentSrc, 'ok')
    bestSourceCache.set(cacheKey, currentSrc)
  }

  const handleError = () => {
    urlCache.set(currentSrc, 'err')
    
    let nextIdx = currentIndex + 1
    while (nextIdx < sources.length && urlCache.get(sources[nextIdx]) === 'err') {
      nextIdx++
    }

    if (nextIdx < sources.length) {
      setCurrentIndex(nextIdx)
      setCurrentSrc(sources[nextIdx])
    } else {
      bestSourceCache.set(cacheKey, null)
      setFailed(true)
    }
  }

  if (failed || !currentSrc) {
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
        <Globe size={iconSize} strokeWidth={1.8} style={{ color: colors.pin, opacity: 0.7 }} />
      </div>
    )
  }

  const isWideImage = wide && currentSrc.includes('-wide')
  const actualWidth = isWideImage ? Math.round(size * 1.5) : size

  return (
    <img
      key={currentSrc}
      src={currentSrc}
      alt={company.name}
      width={actualWidth}
      height={size}
      loading="lazy"
      decoding="async"
      className={`flex-shrink-0 ${rounded} object-contain bg-white`}
      style={{ width: actualWidth, height: size, padding: Math.max(2, Math.round(size * 0.07)) }}
      onLoad={handleLoad}
      onError={handleError}
    />
  )
})
