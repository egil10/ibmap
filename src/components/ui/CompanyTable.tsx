'use client'

import { useState, useMemo } from 'react'
import { ExternalLink, ChevronUp, ChevronDown, MapPin } from 'lucide-react'
import { companies } from '@/data/companies'
import { FilterCategory } from '@/data/companies'
import { Company, CATEGORY_COLORS, CATEGORY_SHORT } from '@/types'

type SortKey = 'name' | 'category' | 'city' | 'aum'
type SortDir = 'asc' | 'desc'

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}

function CompanyLogo({ company }: { company: Company }) {
  const [err, setErr] = useState(false)
  const domain = getDomain(company.website)
  const colors = CATEGORY_COLORS[company.category]
  const short = CATEGORY_SHORT[company.category]

  if (!domain || err) {
    return (
      <div
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white text-[9px] font-black"
        style={{ backgroundColor: colors.pin }}
      >
        {short}
      </div>
    )
  }

  return (
    <img
      src={`https://logo.clearbit.com/${domain}`}
      alt={company.name}
      className="h-8 w-8 flex-shrink-0 rounded-lg object-contain bg-white border border-slate-100"
      onError={() => setErr(true)}
    />
  )
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronUp size={12} className="text-slate-300" />
  return dir === 'asc' ? (
    <ChevronUp size={12} className="text-slate-700" />
  ) : (
    <ChevronDown size={12} className="text-slate-700" />
  )
}

interface Props {
  search: string
  filter: FilterCategory
}

export default function CompanyTable({ search, filter }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchesFilter = filter === 'ALL' || c.category === filter
      const q = search.toLowerCase()
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.description?.toLowerCase().includes(q))
      return matchesFilter && matchesSearch
    })
  }, [search, filter])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av = '', bv = ''
      if (sortKey === 'name') { av = a.name; bv = b.name }
      else if (sortKey === 'category') { av = a.category; bv = b.category }
      else if (sortKey === 'city') { av = a.city + a.country; bv = b.city + b.country }
      else if (sortKey === 'aum') { av = a.aum ?? ''; bv = b.aum ?? '' }
      const cmp = av.localeCompare(bv, undefined, { sensitivity: 'base' })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  return (
    <div
      className="absolute inset-0 top-0 flex flex-col pt-28 animate-fade-in"
      style={{ background: '#f0f4f8' }}
    >
      {/* Stats bar */}
      <div className="flex items-center justify-between px-5 py-3">
        <p className="text-[13px] font-semibold text-slate-500">
          <span className="text-slate-900">{sorted.length}</span> companies
          {filter !== 'ALL' && <span className="text-slate-400"> · {filter}</span>}
          {search && <span className="text-slate-400"> · matching "{search}"</span>}
        </p>
        <p className="text-[11px] text-slate-400 font-medium">
          {sorted.filter(c => c.lat != null).length} with map pin
        </p>
      </div>

      {/* Table container */}
      <div className="mx-4 mb-4 flex-1 overflow-hidden rounded-2xl shadow-sm" style={{ border: '1px solid rgba(255,255,255,0.7)' }}>
        <div
          className="h-full overflow-auto thin-scroll"
          style={{
            background: 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          }}
        >
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10">
              <tr style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                {([
                  ['name', 'Company'],
                  ['category', 'Category'],
                  ['city', 'Location'],
                  ['aum', 'AUM'],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 cursor-pointer select-none hover:text-slate-700 transition-colors whitespace-nowrap"
                    onClick={() => handleSort(key)}
                  >
                    <span className="flex items-center gap-1">
                      {label}
                      <SortIcon active={sortKey === key} dir={sortDir} />
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
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <p className="text-sm font-medium text-slate-400">No companies found</p>
                    <p className="text-xs text-slate-300 mt-1">Try a different search or filter</p>
                  </td>
                </tr>
              ) : sorted.map((company, i) => (
                <TableRow key={company.id} company={company} index={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function TableRow({ company, index }: { company: Company; index: number }) {
  const [hovered, setHovered] = useState(false)
  const colors = CATEGORY_COLORS[company.category]
  const domain = getDomain(company.website)

  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        background: hovered ? 'rgba(0,0,0,0.015)' : 'transparent',
        transition: 'background 0.1s',
      }}
    >
      {/* Company */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <CompanyLogo company={company} />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-slate-900 truncate">{company.name}</p>
            {company.description && (
              <p className="text-[11px] text-slate-400 truncate max-w-xs">{company.description}</p>
            )}
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide border ${colors.bg} ${colors.text} ${colors.border}`}
        >
          <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: colors.pin }} />
          {CATEGORY_SHORT[company.category]}
        </span>
      </td>

      {/* Location */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          {company.lat != null && (
            <MapPin size={11} className="text-slate-300 flex-shrink-0" strokeWidth={2} />
          )}
          <span className="text-[12px] font-medium text-slate-600 whitespace-nowrap">
            {company.city}
            <span className="text-slate-400">, {company.country}</span>
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
          onClick={(e) => e.stopPropagation()}
        >
          <span className="truncate max-w-[120px]">{domain}</span>
          <ExternalLink size={10} strokeWidth={2} className="flex-shrink-0" />
        </a>
      </td>
    </tr>
  )
}
