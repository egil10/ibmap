'use client'

import { useState, useMemo } from 'react'
import { ExternalLink, ChevronUp, ChevronDown, MapPin } from 'lucide-react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { companies } from '@/data/companies'
import { FilterCategory } from '@/data/companies'
import { Company, CATEGORY_COLORS, CATEGORY_SHORT } from '@/types'
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

interface Props {
  filter: FilterCategory
}

export default function CompanyTable({ filter }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = useMemo(() => companies.filter((c) => {
    return filter === 'ALL' || c.category === filter
  }), [filter])

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    const vals: Record<SortKey, [string, string]> = {
      name:     [a.name, b.name],
      category: [a.category, b.category],
      city:     [a.city + a.country, b.city + b.country],
      aum:      [a.aum ?? '', b.aum ?? ''],
    }
    const [av, bv] = vals[sortKey]
    const cmp = av.localeCompare(bv, undefined, { sensitivity: 'base' })
    return sortDir === 'asc' ? cmp : -cmp
  }), [filtered, sortKey, sortDir])

  const COLS: { key: SortKey; label: string }[] = [
    { key: 'name',     label: 'Company' },
    { key: 'category', label: 'Category' },
    { key: 'city',     label: 'Location' },
    { key: 'aum',      label: 'AUM / Revenue' },
  ]

  return (
    <div className="absolute inset-0 top-0 flex flex-col pt-28 animate-fade-in" style={{ background: '#f0f4f8' }}>
      {/* Stats */}
      <div className="flex items-center justify-between px-5 py-2.5">
        <p className="text-[13px] font-semibold text-slate-500">
          <span className="text-slate-900 font-bold">{sorted.length}</span> companies
          {filter !== 'ALL' && <span className="text-slate-400"> · {filter}</span>}
        </p>
        <p className="text-[11px] text-slate-400 font-medium">
          {sorted.filter(c => c.lat != null).length} with map pin
        </p>
      </div>

      {/* Table */}
      <div className="mx-4 mb-4 flex-1 overflow-hidden rounded-2xl"
        style={{ border: '1px solid rgba(255,255,255,0.65)', boxShadow: '0 4px 24px rgba(0,0,0,0.05)' }}>
        <div className="h-full overflow-auto thin-scroll"
          style={{
            background: 'rgba(255,255,255,0.84)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          }}>
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10">
              <tr style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                {COLS.map(({ key, label }) => (
                  <th key={key} className="px-4 py-3 cursor-pointer select-none" onClick={() => handleSort(key)}>
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors whitespace-nowrap">
                      {label} <SortIcon active={sortKey === key} dir={sortDir} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">
                  Website
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <p className="text-sm font-semibold text-slate-400">No companies found</p>
                    <p className="text-xs text-slate-300 mt-1">Try clearing the search or filter</p>
                  </td>
                </tr>
              ) : sorted.map((company) => (
                <Row key={company.id} company={company} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Row({ company }: { company: Company }) {
  const [hovered, setHovered] = useState(false)
  const colors = CATEGORY_COLORS[company.category]
  const domain = getDomain(company.website)

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
      {/* Company */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <CompanyLogo company={company} size={34} rounded="rounded-xl" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-slate-900 leading-tight truncate max-w-[200px]">{company.name}</p>
            {company.description && (
              <p className="text-[11px] text-slate-400 truncate max-w-[240px] mt-0.5">{company.description}</p>
            )}
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide border whitespace-nowrap ${colors.bg} ${colors.text} ${colors.border}`}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors.pin }} />
          {CATEGORY_SHORT[company.category]}
        </span>
      </td>

      {/* Location */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {company.lat != null && <MapPin size={10} className="text-slate-300 flex-shrink-0" strokeWidth={2} />}
          <span className="text-[12px] font-medium text-slate-600 whitespace-nowrap">
            {company.city}<span className="text-slate-400">, {company.country}</span>
          </span>
        </div>
      </td>

      {/* AUM */}
      <td className="px-4 py-3">
        <span className="text-[12px] font-medium text-slate-600 whitespace-nowrap">
          {company.aum ?? <span className="text-slate-300">—</span>}
        </span>
      </td>

      {/* Website */}
      <td className="px-4 py-3">
        <a
          href={company.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
          onClick={e => e.stopPropagation()}
        >
          <span className="truncate max-w-[120px]">{domain}</span>
          <ExternalLink size={10} strokeWidth={2} className="flex-shrink-0" />
        </a>
      </td>
    </tr>
  )
}
