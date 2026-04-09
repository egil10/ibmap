'use client'

import { X, ExternalLink, MapPin, BarChart3, Users } from 'lucide-react'
import { Company, CATEGORY_COLORS, CATEGORY_SHORT } from '@/types'
import CompanyLogo from './CompanyLogo'

interface Props {
  company: Company
  onClose: () => void
}

export default function CompanyCard({ company, onClose }: Props) {
  const colors = CATEGORY_COLORS[company.category]

  return (
    <div className="animate-slide-in pointer-events-auto absolute right-4 top-32 bottom-24 w-80 md:right-5 md:w-96 flex flex-col z-40">
      <div
        className="flex h-full flex-col overflow-hidden rounded-3xl shadow-2xl"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(36px) saturate(200%)',
          WebkitBackdropFilter: 'blur(36px) saturate(200%)',
          border: '1px solid rgba(255,255,255,0.72)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)',
        }}
      >
        {/* Color accent bar */}
        <div className="h-1 w-full flex-shrink-0 rounded-t-3xl"
          style={{ background: `linear-gradient(90deg, ${colors.pin}, ${colors.pin}55)` }} />

        {/* Header */}
        <div className="flex items-start gap-4 px-5 pt-5 pb-4">
          <CompanyLogo company={company} size={52} rounded="rounded-2xl" />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase border ${colors.bg} ${colors.text} ${colors.border}`}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors.pin }} />
                {CATEGORY_SHORT[company.category]}
              </span>
              {company.isNordic && (
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                  Nordic
                </span>
              )}
            </div>
            <h2 className="text-[15px] font-bold leading-snug text-slate-900 tracking-tight">
              {company.name}
            </h2>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <MapPin size={9} strokeWidth={2.5} />
              {company.city}, {company.country}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus:outline-none"
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

          <div className="space-y-2">
            {company.aum && (
              <StatRow icon={<BarChart3 size={12} />} label="AUM / Revenue" value={company.aum} pin={colors.pin} />
            )}
            {company.employees && (
              <StatRow icon={<Users size={12} />} label="Employees" value={company.employees} pin={colors.pin} />
            )}
            {company.lat != null && (
              <StatRow icon={<MapPin size={12} />} label="Location" value={`${company.city}, ${company.country}`} pin={colors.pin} />
            )}
          </div>

          {/* Category full name */}
          <div className="pt-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-1">Sector</p>
            <p className="text-[13px] font-semibold text-slate-600">{company.category}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="px-5 pb-5 pt-2">
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-sm"
            style={{ backgroundColor: colors.pin, boxShadow: `0 4px 12px ${colors.pin}44` }}
          >
            Visit Website
            <ExternalLink size={12} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </div>
  )
}

function StatRow({ icon, label, value, pin }: { icon: React.ReactNode; label: string; value: string; pin: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50/80 px-3.5 py-2.5">
      <span style={{ color: pin }} className="flex-shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{label}</span>
        <p className="text-[12px] font-semibold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  )
}
