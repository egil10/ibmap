'use client'

import { X, ExternalLink, MapPin, Building2, BarChart3, Users, Globe } from 'lucide-react'
import { Company, CATEGORY_LABELS, CATEGORY_COLORS } from '@/types'

interface Props {
  company: Company
  onClose: () => void
}

export default function CompanyCard({ company, onClose }: Props) {
  const colors = CATEGORY_COLORS[company.category]

  return (
    <div className="animate-slide-in pointer-events-auto absolute right-4 top-20 bottom-20 w-80 md:right-6 md:w-96 flex flex-col z-40">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-2xl backdrop-blur-xl backdrop-saturate-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-5 pb-4">
          <div className="min-w-0 flex-1">
            {/* Category badge */}
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide mb-2 border ${colors.bg} ${colors.text} ${colors.border}`}
            >
              {company.category}
            </span>
            <h2 className="text-lg font-bold leading-tight text-slate-900 tracking-tight">
              {company.name}
            </h2>
            <p className="mt-0.5 text-sm font-medium text-slate-400">
              {CATEGORY_LABELS[company.category]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
            aria-label="Close"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Divider */}
        <div className="mx-5 border-t border-slate-100" />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Description */}
          {company.description && (
            <p className="text-sm leading-relaxed text-slate-600">{company.description}</p>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-1 gap-2.5">
            <DetailRow
              icon={<MapPin size={14} />}
              label="Location"
              value={`${company.city}, ${company.country}`}
            />
            {company.aum && (
              <DetailRow
                icon={<BarChart3 size={14} />}
                label="AUM"
                value={company.aum}
              />
            )}
            {company.employees && (
              <DetailRow
                icon={<Users size={14} />}
                label="Employees"
                value={company.employees}
              />
            )}
            {company.isNordic && (
              <DetailRow
                icon={<Globe size={14} />}
                label="Scope"
                value="Nordic / International"
              />
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="border-t border-slate-100 p-4">
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 focus:outline-none"
          >
            Visit Website
            <ExternalLink size={13} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </div>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3.5 py-2.5">
      <span className="text-slate-400 flex-shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</span>
        <p className="text-sm font-medium text-slate-700 truncate">{value}</p>
      </div>
    </div>
  )
}
