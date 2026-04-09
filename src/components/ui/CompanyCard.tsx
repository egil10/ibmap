'use client'

import { useState } from 'react'
import { X, ExternalLink, MapPin, BarChart3, Users, Globe } from 'lucide-react'
import { Company, CATEGORY_COLORS, CATEGORY_SHORT } from '@/types'

interface Props {
  company: Company
  onClose: () => void
}

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}

function CompanyLogo({ company }: { company: Company }) {
  const [err, setErr] = useState(false)
  const domain = getDomain(company.website)
  const colors = CATEGORY_COLORS[company.category]
  const initial = CATEGORY_SHORT[company.category]

  if (!domain || err) {
    return (
      <div
        className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl text-white text-xs font-black shadow-sm"
        style={{ backgroundColor: colors.pin }}
      >
        {initial}
      </div>
    )
  }

  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={company.name}
      className="h-14 w-14 flex-shrink-0 rounded-2xl object-contain bg-white border border-slate-100/80 shadow-sm"
      onError={() => setErr(true)}
    />
  )
}

export default function CompanyCard({ company, onClose }: Props) {
  const colors = CATEGORY_COLORS[company.category]

  return (
    <div className="animate-slide-in pointer-events-auto absolute right-4 top-28 bottom-6 w-80 md:right-5 md:w-96 flex flex-col z-40">
      <div
        className="flex h-full flex-col overflow-hidden rounded-3xl shadow-2xl"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(32px) saturate(200%)',
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          border: '1px solid rgba(255,255,255,0.7)',
        }}
      >
        {/* Color top accent */}
        <div className="h-1 w-full flex-shrink-0 rounded-t-3xl" style={{ background: `linear-gradient(90deg, ${colors.pin}, ${colors.pin}66)` }} />

        {/* Header */}
        <div className="flex items-start gap-4 px-5 pt-5 pb-4">
          <CompanyLogo company={company} />

          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase border ${colors.bg} ${colors.text} ${colors.border}`}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors.pin }} />
                {CATEGORY_SHORT[company.category]} · {company.category}
              </span>
              {company.isNordic && (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-500 uppercase tracking-widest">
                  Nordic
                </span>
              )}
            </div>
            <h2 className="text-[15px] font-bold leading-tight text-slate-900 tracking-tight">
              {company.name}
            </h2>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <MapPin size={10} strokeWidth={2.5} />
              {company.city}, {company.country}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 -mt-0.5 -mr-1 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mx-5 h-px bg-slate-100" />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 thin-scroll">
          {company.description && (
            <p className="text-[13px] leading-relaxed text-slate-600">{company.description}</p>
          )}

          <div className="grid grid-cols-1 gap-2">
            {company.aum && (
              <DetailRow icon={<BarChart3 size={13} />} label="AUM" value={company.aum} color={colors.pin} />
            )}
            {company.employees && (
              <DetailRow icon={<Users size={13} />} label="Employees" value={company.employees} color={colors.pin} />
            )}
            {company.lat != null && (
              <DetailRow icon={<MapPin size={13} />} label="Office" value={`${company.city}, ${company.country}`} color={colors.pin} />
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="px-5 pb-5 pt-3">
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] focus:outline-none shadow-sm"
            style={{ backgroundColor: colors.pin }}
          >
            Visit Website
            <ExternalLink size={12} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50/80 px-3.5 py-2.5">
      <span style={{ color }} className="flex-shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
        <p className="text-[12px] font-semibold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  )
}
