'use client'

import { X, ExternalLink, MapPin, BarChart3, Users, Building2, Globe } from 'lucide-react'
import { Company, CATEGORY_SHORT } from '@/types'
import CompanyLogo from './CompanyLogo'

interface Props {
  company: Company
  onClose: () => void
}

export default function CompanyCard({ company, onClose }: Props) {
  return (
    <div className="animate-slide-in pointer-events-auto absolute right-4 top-20 bottom-20 w-80 md:right-5 flex flex-col z-40">
      <div
        className="flex h-full flex-col overflow-hidden rounded-3xl"
        style={{
          background: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(32px) saturate(180%)',
          WebkitBackdropFilter: 'blur(32px) saturate(180%)',
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.04)',
        }}
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-5 pt-5 pb-4">
          <CompanyLogo company={company} size={46} rounded="rounded-2xl" wide />

          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              {CATEGORY_SHORT[company.category]} · {company.category}
            </p>
            <h2 className="text-[15px] font-bold text-slate-900 leading-snug tracking-tight">
              {company.name}
            </h2>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
              <MapPin size={9} strokeWidth={2.5} />
              {company.city}, {company.country}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 mt-0.5 rounded-full p-1.5 text-slate-300 hover:bg-slate-100 hover:text-slate-500 transition-colors"
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mx-5 h-px" style={{ background: 'rgba(0,0,0,0.05)' }} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 thin-scroll">
          {company.description && (
            <p className="text-[13px] leading-relaxed text-slate-500">{company.description}</p>
          )}

          {/* Stats */}
          {(company.aum || company.employees) && (
            <div className="flex gap-2">
              {company.aum && (
                <div className="flex-1 rounded-2xl bg-slate-50 border border-slate-100 px-3.5 py-2.5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">AUM / Revenue</p>
                  <p className="text-[12px] font-semibold text-slate-700 flex items-center gap-1">
                    <BarChart3 size={10} className="text-slate-400" strokeWidth={2.5} />
                    {company.aum}
                  </p>
                </div>
              )}
              {company.employees && (
                <div className="flex-1 rounded-2xl bg-slate-50 border border-slate-100 px-3.5 py-2.5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Employees</p>
                  <p className="text-[12px] font-semibold text-slate-700 flex items-center gap-1">
                    <Users size={10} className="text-slate-400" strokeWidth={2.5} />
                    {company.employees}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Additional offices */}
          {company.offices && company.offices.length > 0 && (
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-2">Also in</p>
              <div className="flex flex-wrap gap-1.5">
                {company.offices.map((office, i) => (
                  <span key={i}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-50 border border-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                    <Building2 size={9} className="text-slate-400" strokeWidth={2.5} />
                    {office.city}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="px-5 pb-5 pt-2 flex-shrink-0">
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-[13px] font-semibold bg-slate-900 text-white transition-all duration-150 hover:bg-slate-700 active:scale-[0.98]"
          >
            <Globe size={12} strokeWidth={2.5} />
            Visit Website
            <ExternalLink size={11} strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </div>
  )
}
