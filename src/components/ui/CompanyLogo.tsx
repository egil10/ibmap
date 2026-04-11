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
  
  const [failed, setFailed] = useState<boolean>(false)
  const [currentSrc, setCurrentSrc] = useState<string>('')

  // The engine background-evaluates every link completely outside the DOM.
  // It only commits a URL to the DOM state natively if it flawlessly loaded beforehand.
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

    let isSubscribed = true

    const attemptLoad = (idx: number) => {
      if (!isSubscribed) return
      if (idx >= sources.length) {
        bestSourceCache.set(cacheKey, null)
        setFailed(true)
        return
      }

      const url = sources[idx]
      if (urlCache.get(url) === 'err') {
        attemptLoad(idx + 1)
        return
      }
      if (urlCache.get(url) === 'ok') {
        bestSourceCache.set(cacheKey, url)
        setCurrentSrc(url)
        setFailed(false)
        return
      }

      // Invisible DOM-less native image verification
      const img = new Image()
      img.onload = () => {
        if (!isSubscribed) return
        urlCache.set(url, 'ok')
        bestSourceCache.set(cacheKey, url)
        setCurrentSrc(url)
        setFailed(false)
      }
      img.onerror = () => {
        if (!isSubscribed) return
        urlCache.set(url, 'err')
        attemptLoad(idx + 1)
      }
      img.src = url
    }

    attemptLoad(0)

    return () => { isSubscribed = false }
  }, [cacheKey, sources])

  const iconSize = Math.max(10, Math.round(size * 0.45))

  // Render the strict clean fallback directly while background pre-fetching is occurring 
  // or if all sequential sources cascaded natively into errors.
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

  const isWideImage = wide && currentSrc.includes('-wide')
  const actualWidth = isWideImage ? Math.round(size * 1.5) : size

  // Natively render the verified image exclusively since it's structurally guaranteed 
  // to avoid sending broken HTTP URLs that flash as ugly DOM square failures.
  return (
    <div
      className={`relative flex flex-shrink-0 items-center justify-center bg-white ${rounded} overflow-hidden`}
      style={{
        width: actualWidth,
        height: size,
        borderRadius: rounded.includes('full') ? '50%' : undefined,
      }}
    >
      <img
        key={currentSrc}
        src={currentSrc}
        alt={company.name}
        loading="lazy"
        decoding="async"
        className={`w-full h-full object-contain`}
      />
    </div>
  )
})
