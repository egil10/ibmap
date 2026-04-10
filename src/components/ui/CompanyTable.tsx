'use client'

import { useState, useMemo } from 'react'
import { ExternalLink, ChevronUp, ChevronDown, MapPin, Building2 } from 'lucide-react'
import { companies } from '@/data/companies'
import type { ActiveFilters } from '@/app/page'
import { Company, CompanyOffice, CATEGORY_COLORS, CATEGORY_SHORT } from '@/types'
import CompanyLogo from './CompanyLogo'

type SortKey = 'name' | 'category' | 'city' | 'aum'
type SortDir = 'asc' | 'desc'

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  const cls = `transition-colors ${active ? 'text-slate-700' : 'text-slate-300'}`
  return dir === 'desc' && active
    ? <ChevronDown size={12} className={cls} />
    : <ChevronUp size={12} className={cls} />
}

function formatOffice(office: CompanyOffice) {
  return office.label ?? `${office.city}, ${office.country}`
}

interface Props {
  filters: ActiveFilters
  onViewOnMap?: (company: Company) => void
}

export default function CompanyTable({ filters, onViewOnMap }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = useMemo(() => companies.filter(company =>
    (filters.category === 'ALL' || company.category === filters.category) &&
    (!filters.country || company.country === filters.country) &&
    (!filters.city || company.city === filters.city)
  ), [filters])

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    const vals: Record<SortKey, [string, string]> = {
      name: [a.name, b.name],
      category: [a.category, b.category],
      city: [a.city + a.country, b.city + b.country],
      aum: [a.aum ?? '', b.aum ?? ''],
    }
    const [av, bv] = vals[sortKey]
    const cmp = av.localeCompare(bv, undefined, { sensitivity: 'base' })
    return sortDir === 'asc' ? cmp : -cmp
  }), [filtered, sortKey, sortDir])

  const COLS: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Company' },
    { key: 'category', label: 'Category' },
    { key: 'city', label: 'HQ / Offices' },
    { key: 'aum', label: 'AUM / Revenue' },
  ]

  return (
    <div className="absolute inset-0 top-0 flex animate-fade-in flex-col pt-28 md:pt-20" style={{ background: '#f0f4f8' }}>
      <div className="flex items-center justify-between px-5 py-2.5">
        <p className="text-[13px] font-semibold text-slate-500">
          <span className="font-bold text-slate-900">{sorted.length}</span> companies
          {filters.category !== 'ALL' && <span className="text-slate-400"> · {filters.category}</span>}
          {filters.country && <span className="text-slate-400"> · {filters.country}</span>}
          {filters.city && <span className="text-slate-400"> · {filters.city}</span>}
        </p>
        <p className="text-[11px] font-medium text-slate-400">
          {sorted.filter(company => company.lat != null).length} with map pin
        </p>
      </div>

      <div
        className="mx-4 mb-4 flex-1 overflow-hidden rounded-2xl"
        style={{ border: '1px solid rgba(255,255,255,0.65)', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}
      >
        <div
          className="h-full overflow-auto thin-scroll"
          style={{
            background: 'rgba(255,255,255,0.84)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          }}
        >
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead className="sticky top-0 z-10">
              <tr style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                {COLS.map(({ key, label }) => (
                  <th key={key} className="cursor-pointer select-none px-4 py-3" onClick={() => handleSort(key)}>
                    <span className="flex items-center gap-1 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-700">
                      {label} <SortIcon active={sortKey === key} dir={sortDir} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Website
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-sm font-semibold text-slate-400">No companies found</p>
                    <p className="mt-1 text-xs text-slate-300">Try clearing the filters from the map card</p>
                  </td>
                </tr>
              ) : sorted.map((company) => (
                <Row key={company.id} company={company} onViewOnMap={onViewOnMap} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Row({ company, onViewOnMap }: { company: Company; onViewOnMap?: (c: Company) => void }) {
  const [hovered, setHovered] = useState(false)
  const colors = CATEGORY_COLORS[company.category]
  const domain = getDomain(company.website)
  const hasPin = company.lat != null
  const hqAddress = company.address ?? `${company.city}, ${company.country}`

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        background: hovered ? 'rgba(0,0,0,0.016)' : 'transparent',
        transition: 'background 0.12s',
      }}
    >
      <td className="px-4 py-3 align-top">
        <div
          className={`flex items-start gap-3 ${hasPin && onViewOnMap ? 'group/name cursor-pointer' : ''}`}
          onClick={() => hasPin && onViewOnMap?.(company)}
          title={hasPin ? 'View on map' : undefined}
        >
          <CompanyLogo company={company} size={34} rounded="rounded-xl" wide />
          <div className="min-w-0">
            <p className={`text-[13px] font-semibold leading-tight transition-colors ${hasPin && onViewOnMap ? 'text-slate-900 group-hover/name:text-blue-600' : 'text-slate-900'}`}>
              {company.name}
              {hasPin && onViewOnMap && (
                <span className="ml-1.5 text-[10px] font-medium text-blue-500 opacity-0 transition-opacity group-hover/name:opacity-100">
                  ↗ map
                </span>
              )}
            </p>
            {company.description && (
              <p className="mt-0.5 max-w-[300px] truncate text-[11px] text-slate-400">{company.description}</p>
            )}
          </div>
        </div>
      </td>

      <td className="px-4 py-3 align-top">
        <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide ${colors.bg} ${colors.text} ${colors.border}`}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors.pin }} />
          {CATEGORY_SHORT[company.category]}
        </span>
      </td>

      <td className="px-4 py-3 align-top">
        <div className="space-y-2">
          <div className="flex items-start gap-1.5">
            {hasPin && <MapPin size={11} className="mt-0.5 flex-shrink-0 text-slate-300" strokeWidth={2} />}
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-slate-700">
                {company.city}<span className="text-slate-400">, {company.country}</span>
              </p>
              <p className="mt-0.5 max-w-[290px] text-[11px] leading-relaxed text-slate-500">{hqAddress}</p>
            </div>
          </div>

          {company.offices && company.offices.length > 0 && (
            <div className="flex items-start gap-1.5">
              <Building2 size={11} className="mt-0.5 flex-shrink-0 text-slate-300" strokeWidth={2} />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Other offices</p>
                <p className="mt-0.5 max-w-[290px] text-[11px] leading-relaxed text-slate-500">
                  {company.offices.map(formatOffice).join(' · ')}
                </p>
              </div>
            </div>
          )}
        </div>
      </td>

      <td className="px-4 py-3 align-top">
        <span className="whitespace-nowrap text-[12px] font-medium text-slate-600">
          {company.aum ?? <span className="text-slate-300">—</span>}
        </span>
        {company.employees && (
          <p className="mt-1 text-[10px] text-slate-400">{company.employees} employees</p>
        )}
      </td>

      <td className="px-4 py-3 align-top">
        {company.website ? (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] font-medium text-slate-500 transition-colors hover:text-slate-900"
            onClick={e => e.stopPropagation()}
          >
            <span className="max-w-[140px] truncate">{domain}</span>
            <ExternalLink size={10} strokeWidth={2} className="flex-shrink-0" />
          </a>
        ) : (
          <span className="text-[11px] text-slate-300">—</span>
        )}
      </td>
    </tr>
  )
}
