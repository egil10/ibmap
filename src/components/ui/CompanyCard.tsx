'use client'

import { X, ExternalLink, MapPin, BarChart3, Users, Building2 } from 'lucide-react'
import { Company, CATEGORY_SHORT } from '@/types'
import CompanyLogo from './CompanyLogo'

interface Props {
  company: Company
  onClose: () => void
  darkMode: boolean
}

export default function CompanyCard({ company, onClose, darkMode }: Props) {
  const dm = darkMode
  const hqAddress = company.address ?? `${company.city}, ${company.country}`

  const cardBg   = dm ? 'rgba(0,0,0,0.96)'   : 'rgba(255,255,255,0.94)'
  const cardBdr  = dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const cardShad = dm
    ? '0 20px 60px rgba(0,0,0,0.40), 0 4px 16px rgba(0,0,0,0.20)'
    : '0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)'

  const textPrimary  = dm ? '#f1f5f9' : '#0f172a'
  const textSecond   = dm ? '#94a3b8' : '#64748b'
  const textMuted    = dm ? '#64748b' : '#94a3b8'
  const dividerColor = dm ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'

  const statBg  = dm ? 'rgba(255,255,255,0.05)' : '#f8fafc'
  const statBdr = dm ? 'rgba(255,255,255,0.07)' : '#f1f5f9'

  const closeCls = dm
    ? 'flex-shrink-0 mt-0.5 rounded-full p-1.5 text-slate-600 hover:bg-white/[0.08] hover:text-slate-300 transition-colors'
    : 'flex-shrink-0 mt-0.5 rounded-full p-1.5 text-slate-300 hover:bg-slate-100 hover:text-slate-500 transition-colors'

  const officePillBg  = dm ? 'rgba(255,255,255,0.05)' : '#f8fafc'
  const officePillBdr = dm ? 'rgba(255,255,255,0.07)' : '#f1f5f9'

  const ctaBg   = dm ? 'rgba(255,255,255,0.10)' : '#0f172a'
  const ctaHov  = dm ? 'hover:bg-white/[0.16]'  : 'hover:bg-slate-700'
  const ctaText = '#ffffff'
  const ctaSub  = dm ? '#94a3b8' : '#94a3b8'

  return (
    <div className="animate-slide-up md:animate-slide-in pointer-events-auto absolute inset-x-3 bottom-3 top-auto z-40 flex max-h-[72vh] flex-col md:inset-x-auto md:bottom-20 md:right-5 md:top-20 md:w-80 md:max-h-none">
      <div
        className="flex h-full flex-col overflow-hidden rounded-3xl"
        style={{
          background: cardBg,
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border: `1px solid ${cardBdr}`,
          boxShadow: cardShad,
        }}
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-5 pt-5 pb-4">
          <CompanyLogo company={company} size={46} rounded="rounded-2xl" wide />

          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: textMuted }}>
              {CATEGORY_SHORT[company.category]} · {company.category}
            </p>
            <h2 className="text-[15px] font-bold leading-snug tracking-tight" style={{ color: textPrimary }}>
              {company.name}
            </h2>
            <p className="mt-0.5 flex items-center gap-1 text-[11px]" style={{ color: textMuted }}>
              <MapPin size={9} strokeWidth={2.5} />
              {company.city}, {company.country}
            </p>
          </div>

          <button onClick={onClose} className={closeCls}>
            <X size={13} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mx-5 h-px" style={{ background: dividerColor }} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 thin-scroll">
          {company.description && (
            <p className="text-[13px] leading-relaxed" style={{ color: textSecond }}>{company.description}</p>
          )}

          <div className="rounded-2xl px-3.5 py-3" style={{ background: statBg, border: `1px solid ${statBdr}` }}>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest" style={{ color: textMuted }}>HQ Address</p>
            <p className="flex items-start gap-1.5 text-[12px] font-medium leading-relaxed" style={{ color: textSecond }}>
              <MapPin size={11} strokeWidth={2.5} style={{ color: textMuted, marginTop: 2, flexShrink: 0 }} />
              <span>{hqAddress}</span>
            </p>
          </div>

          {(company.aum || company.employees) && (
            <div className="flex gap-2">
              {company.aum && (
                <div className="flex-1 rounded-2xl px-3.5 py-2.5" style={{ background: statBg, border: `1px solid ${statBdr}` }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: textMuted }}>AUM / Revenue</p>
                  <p className="text-[12px] font-semibold flex items-center gap-1" style={{ color: textSecond }}>
                    <BarChart3 size={10} strokeWidth={2.5} style={{ color: textMuted }} />
                    {company.aum}
                  </p>
                </div>
              )}
              {company.employees && (
                <div className="flex-1 rounded-2xl px-3.5 py-2.5" style={{ background: statBg, border: `1px solid ${statBdr}` }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: textMuted }}>Employees</p>
                  <p className="text-[12px] font-semibold flex items-center gap-1" style={{ color: textSecond }}>
                    <Users size={10} strokeWidth={2.5} style={{ color: textMuted }} />
                    {company.employees}
                  </p>
                </div>
              )}
            </div>
          )}

          {company.offices && company.offices.length > 0 && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: textMuted }}>Also in</p>
              <div className="flex flex-wrap gap-1.5">
                {company.offices.map((office, i) => (
                  <span key={i}
                    className="inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-[11px] font-medium"
                    style={{ background: officePillBg, border: `1px solid ${officePillBdr}`, color: textSecond }}>
                    <Building2 size={9} strokeWidth={2.5} style={{ color: textMuted }} />
                    {office.city}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        {company.website && (
          <div className="px-5 pb-5 pt-2 flex-shrink-0">
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-150 active:scale-[0.98] ${ctaHov}`}
              style={{ background: ctaBg, color: ctaText }}
            >
              <span className="truncate text-[12px] font-normal" style={{ color: ctaSub }}>
                {company.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
              </span>
              <ExternalLink size={12} strokeWidth={2.5} className="flex-shrink-0" />
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
