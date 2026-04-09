'use client'

import { useState } from 'react'
import { Company, CATEGORY_COLORS, CATEGORY_SHORT } from '@/types'

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}

interface Props {
  company: Company
  size?: number   // px
  rounded?: string
}

/**
 * Tries /logos/{id}.png → clearbit → category badge fallback.
 */
export default function CompanyLogo({ company, size = 40, rounded = 'rounded-2xl' }: Props) {
  const [attempt, setAttempt] = useState(0)   // 0=local, 1=clearbit, 2=failed
  const domain = getDomain(company.website)
  const colors = CATEGORY_COLORS[company.category]
  const short  = CATEGORY_SHORT[company.category]

  const src =
    attempt === 0 ? `/logos/${company.id}.png` :
    attempt === 1 ? (domain ? `https://logo.clearbit.com/${domain}` : '') :
    null

  const handleError = () => {
    if (attempt === 0 && domain) setAttempt(1)
    else setAttempt(2)
  }

  if (attempt === 2 || !src) {
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
