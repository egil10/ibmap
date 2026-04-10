'use client'

import { X, ExternalLink, MapPin, BarChart3, Users, Building2, ChevronLeft, ChevronRight, Shuffle, Tags } from 'lucide-react'
import { FilterCategory } from '@/data/companies'
import type { ActiveFilters } from '@/app/page'
import { Company, CATEGORY_SHORT } from '@/types'
import CompanyLogo from './CompanyLogo'

interface Props {
  company: Company
  onClose: () => void
  darkMode: boolean
  onPrevious?: () => void
  onNext?: () => void
  onRandom?: () => void
  navigationLabel?: string
  filters: ActiveFilters
  onApplyCategoryFilter: (category: FilterCategory) => void
  onApplyCountryFilter: (country: string) => void
  onApplyCityFilter: (city: string, country: string) => void
  onClearFilters: () => void
}

export default function CompanyCard({
  company,
  onClose,
  darkMode,
  onPrevious,
  onNext,
  onRandom,
  navigationLabel,
  filters,
  onApplyCategoryFilter,
  onApplyCountryFilter,
  onApplyCityFilter,
  onClearFilters,
}: Props) {
  const dm = darkMode
  const hqAddress = company.address ?? `${company.city}, ${company.country}`
  const hasActiveFilters = filters.category !== 'ALL' || Boolean(filters.country) || Boolean(filters.city)

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
  const navBtn = dm
    ? 'flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-white/[0.08] hover:text-slate-100'
    : 'flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900'
  const navPillBg = dm ? 'rgba(255,255,255,0.05)' : '#f8fafc'
  const navPillBdr = dm ? 'rgba(255,255,255,0.07)' : '#e2e8f0'
  const filterPill = (active: boolean) => active
    ? dm
      ? 'border-emerald-400/40 bg-emerald-400/15 text-emerald-200'
      : 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : dm
      ? 'border-white/[0.08] bg-white/[0.04] text-slate-300 hover:border-white/[0.14] hover:bg-white/[0.08]'
      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'

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

          <div className="min-w-0 flex-1 min-h-[3.9rem] pt-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: textMuted }}>
              {CATEGORY_SHORT[company.category]} · {company.category}
            </p>
            <h2 className="min-h-[2.5rem] line-clamp-2 text-[15px] font-bold leading-snug tracking-tight" style={{ color: textPrimary }} title={company.name}>
              {company.name}
            </h2>
            <p className="mt-0.5 flex items-center gap-1 text-[11px]" style={{ color: textMuted }} title={`${company.city}, ${company.country}`}>
              <MapPin size={9} strokeWidth={2.5} />
              <span className="truncate">{company.city}, {company.country}</span>
            </p>
          </div>

          <button onClick={onClose} className={closeCls}>
            <X size={13} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mx-5 h-px" style={{ background: dividerColor }} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 thin-scroll">
          {(onPrevious || onNext || onRandom) && (
            <div className="flex items-center justify-between rounded-2xl px-3 py-2" style={{ background: navPillBg, border: `1px solid ${navPillBdr}` }}>
              <div className="flex items-center gap-1">
                {onPrevious && (
                  <button onClick={onPrevious} className={navBtn} aria-label="Previous company">
                    <ChevronLeft size={14} strokeWidth={2.5} />
                  </button>
                )}
                {onNext && (
                  <button onClick={onNext} className={navBtn} aria-label="Next company">
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </button>
                )}
              </div>
              {navigationLabel && (
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: textMuted }}>
                  {navigationLabel}
                </span>
              )}
              {onRandom ? (
                <button onClick={onRandom} className={navBtn} aria-label="Random company">
                  <Shuffle size={13} strokeWidth={2.5} />
                </button>
              ) : (
                <div className="h-8 w-8" />
              )}
            </div>
          )}

          <div className="rounded-2xl px-3.5 py-3" style={{ background: navPillBg, border: `1px solid ${navPillBdr}` }}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest" style={{ color: textMuted }}>
                <Tags size={10} strokeWidth={2.5} />
                Filter This View
              </p>
              {hasActiveFilters && (
                <button
                  onClick={onClearFilters}
                  className="text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors"
                  style={{ color: textMuted }}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onApplyCategoryFilter(company.category)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all duration-150 ${filterPill(filters.category === company.category)}`}
              >
                {company.category}
              </button>
              <button
                onClick={() => onApplyCountryFilter(company.country)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all duration-150 ${filterPill(filters.country === company.country)}`}
              >
                {company.country}
              </button>
              <button
                onClick={() => onApplyCityFilter(company.city, company.country)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all duration-150 ${filterPill(filters.city === company.city)}`}
              >
                {company.city}
              </button>
            </div>
          </div>

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
