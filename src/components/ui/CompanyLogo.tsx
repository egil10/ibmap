'use client'

import { useState } from 'react'
import { Company, CATEGORY_COLORS, CATEGORY_SHORT } from '@/types'

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}

interface Props {
  company: Company
  size?: number
  rounded?: string
  wide?: boolean  // kept for API compat, ignored — wide logos removed
}

export default function CompanyLogo({ company, size = 40, rounded = 'rounded-2xl' }: Props) {
  const [attempt, setAttempt] = useState(0)
  const domain = getDomain(company.website)
  const colors = CATEGORY_COLORS[company.category]
  const short  = CATEGORY_SHORT[company.category]

  const sources = [
    `/logos/${company.id}.png`,
    domain ? `https://logo.clearbit.com/${domain}` : null,
  ]

  const src = sources[attempt] ?? null

  const handleError = () => {
    if (attempt < sources.length - 1) setAttempt(a => a + 1)
    else setAttempt(sources.length)  // triggers badge fallback
  }

  if (!src || attempt >= sources.length) {
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
      key={attempt}
      src={src}
      alt={company.name}
      className={`flex-shrink-0 ${rounded} object-contain bg-white`}
      style={{ width: size, height: size, padding: Math.max(2, Math.round(size * 0.07)) }}
      onError={handleError}
    />
  )
}
