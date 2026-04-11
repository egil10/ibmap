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
  const colors = CATEGORY_COLORS[company.category] || { bg: '#f1f5f9', pin: '#64748b' }
  const domain = getDomain(company.website)
  
  const sources = useMemo(() => {
    const list: string[] = []
    if (wide) list.push(`/logos/${company.id}-wide.png`)
    list.push(`/logos/${company.id}.png`)
    if (domain) list.push(`https://logo.clearbit.com/${domain}?size=128`)
    return list
  }, [company.id, wide, domain])

  const cacheKey = `${company.id}-${wide ? 'wide' : 'square'}`
  
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [failed, setFailed] = useState<boolean>(false)
  const [currentSrc, setCurrentSrc] = useState<string>('')
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false)

  // Reset loading state safely anytime the URL source cascades
  useEffect(() => {
    setIsImageLoaded(false)
  }, [currentSrc])

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
    setIsImageLoaded(true)
  }

  const handleError = () => {
    urlCache.set(currentSrc, 'err')
    setIsImageLoaded(false)
    
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

  const iconSize = Math.max(10, Math.round(size * 0.45))
  const isWideImage = wide && currentSrc.includes('-wide')
  const actualWidth = isWideImage ? Math.round(size * 1.5) : size

  // If utterly failed (all local + remote sources 404'd), display ONLY the clean fallback UI.
  if (failed || !currentSrc) {
    return (
      <div
        className={`flex flex-shrink-0 items-center justify-center ${rounded}`}
        style={{
          width: wide ? size * 1.5 : size,
          height: size,
          backgroundColor: colors.bg,
          border: `1px solid ${colors.pin}20`,
          borderRadius: rounded.includes('full') ? '50%' : undefined,
        }}
      >
        <Globe size={iconSize} strokeWidth={1.8} style={{ color: colors.pin, opacity: 0.7 }} />
      </div>
    )
  }

  // Active Loading State / Render sequence: 
  // Displays the exact same fallback Globe initially, but hides it natively instantly 
  // upon the hidden img successfully triggering onLoad. Blocks 404 outlines organically.
  return (
    <div
      className={`relative flex flex-shrink-0 items-center justify-center ${rounded} overflow-hidden`}
      style={{
        width: actualWidth,
        height: size,
        backgroundColor: colors.bg,
        border: `1px solid ${colors.pin}20`,
        borderRadius: rounded.includes('full') ? '50%' : undefined,
      }}
    >
      {/* Permanent visual proxy underlying the loading image */}
      <Globe 
        className="absolute"
        size={iconSize} 
        strokeWidth={1.8} 
        style={{ color: colors.pin, opacity: isImageLoaded ? 0 : 0.7, transition: 'opacity 0.2s ease-out' }} 
      />
      <img
        key={currentSrc}
        src={currentSrc}
        alt={company.name}
        loading="lazy"
        decoding="async"
        className={`relative z-10 w-full h-full object-contain ${!isWideImage ? 'p-[15%]' : ''}`}
        style={{
          backgroundColor: '#ffffff',
          opacity: isImageLoaded ? 1 : 0,
          transition: 'opacity 0.2s ease-out',
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
})
