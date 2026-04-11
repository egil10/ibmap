'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { ExternalLink, ChevronUp, ChevronDown, MapPin, Building2, Search, X, Filter, RotateCcw } from 'lucide-react'
import { companies, FILTER_CATEGORIES } from '@/data/companies'
import type { ActiveFilters } from '@/app/page'
import { Company, CompanyOffice, CATEGORY_COLORS, CATEGORY_SHORT } from '@/types'
import CompanyLogo from './CompanyLogo'

type SortKey = 'name' | 'category' | 'city' | 'aum'
type SortDir = 'asc' | 'desc'

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}

function CustomCombo({ value, onChange, options, placeholder, disabled, widthCls = "w-32" }: {
  value: string;
  onChange: (val: string) => void;
  options: {value: string; label: string}[];
  placeholder: string;
  disabled?: boolean;
  widthCls?: string;
}) {
  const [open, setOpen] = useState(false)
  const clickRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (clickRef.current && !clickRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectedOption = options.find(o => o.value === value)

  return (
    <div className="relative flex items-center" ref={clickRef}>
      <button 
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`flex ${widthCls} items-center justify-between bg-transparent py-2.5 pl-4 pr-3 text-[13px] font-semibold transition-colors focus:outline-none ${
          disabled ? 'opacity-40 cursor-not-allowed' : 'hover:text-slate-900 cursor-pointer text-slate-600'
        }`}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={12} className={`flex-shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} strokeWidth={3} />
      </button>

      {open && !disabled && (
         <div className="absolute top-[calc(100%+8px)] left-0 z-50 w-48 overflow-hidden rounded-2xl bg-white/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] ring-1 ring-slate-900/5 animate-fade-in py-1">
           <div className="max-h-64 overflow-y-auto thin-scroll">
              <button
                 className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors ${
                   value === 'ALL' 
                     ? 'bg-slate-50 text-slate-900 font-bold'
                     : 'text-slate-600 hover:bg-slate-50/80 hover:text-slate-900 font-medium'
                 }`}
                 onClick={() => { onChange('ALL'); setOpen(false); }}
              >
                 {placeholder}
              </button>
              {options.map(opt => (
                 <button
                   key={opt.value}
                   className={`w-full text-left px-4 py-2 text-[13px] transition-colors ${
                     opt.value === value 
                       ? 'bg-slate-50 text-slate-900 font-bold'
                       : 'text-slate-600 hover:bg-slate-50/80 hover:text-slate-900 font-medium'
                   }`}
                   onClick={() => { onChange(opt.value); setOpen(false); }}
                 >
                   <span className="block truncate">{opt.label}</span>
                 </button>
              ))}
           </div>
         </div>
      )}
    </div>
  )
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
  const [searchQuery, setSearchQuery] = useState('')
  
  // Local Table Filters
  const [localCategory, setLocalCategory] = useState<string>('ALL')
  const [localCountry, setLocalCountry] = useState<string>('ALL')
  const [localCity, setLocalCity] = useState<string>('ALL')

  const availableCountries = useMemo(() => Array.from(new Set(companies.map(c => c.country))).sort(), [])
  const availableCities = useMemo(() => {
    let comps = companies
    if (localCountry !== 'ALL') comps = comps.filter(c => c.country === localCountry)
    return Array.from(new Set(comps.map(c => c.city))).sort()
  }, [localCountry])

  // Reset city if it's not in the newly selected country
  useEffect(() => {
    if (localCountry !== 'ALL' && localCity !== 'ALL') {
      const cityExists = companies.some(c => c.country === localCountry && c.city === localCity)
      if (!cityExists) setLocalCity('ALL')
    }
  }, [localCountry, localCity])

  const hasActiveFilters = localCategory !== 'ALL' || localCountry !== 'ALL' || localCity !== 'ALL' || searchQuery.trim() !== ''

  const handleResetFilters = () => {
    setLocalCategory('ALL')
    setLocalCountry('ALL')
    setLocalCity('ALL')
    setSearchQuery('')
  }

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    return companies.filter(company => {
      // 1. Global Active Filters (from Map view props)
      if (filters.category !== 'ALL' && company.category !== filters.category) return false
      if (filters.country && company.country !== filters.country) return false
      if (filters.city && company.city !== filters.city) return false

      // 2. Local Table Filters (dropdowns)
      if (localCategory !== 'ALL' && company.category !== localCategory) return false
      if (localCountry !== 'ALL' && company.country !== localCountry) return false
      if (localCity !== 'ALL' && company.city !== localCity) return false

      // 3. Search Query
      if (query) {
        return company.name.toLowerCase().includes(query) ||
               company.description?.toLowerCase().includes(query) ||
               company.city.toLowerCase().includes(query) ||
               company.country.toLowerCase().includes(query) ||
               company.category.toLowerCase().includes(query)
      }
      return true
    })
  }, [filters, searchQuery, localCategory, localCountry, localCity])

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

  const COLS: { key: SortKey; label: string; width: string }[] = [
    { key: 'name', label: 'Company', width: 'w-[32%]' },
    { key: 'category', label: 'Category', width: 'w-[18%]' },
    { key: 'city', label: 'HQ / Offices', width: 'w-[28%]' },
    { key: 'aum', label: 'AUM / Revenue', width: 'w-[14%]' },
  ]

  const dropdownClass = "appearance-none bg-transparent cursor-pointer py-2.5 pl-4 pr-8 text-[13px] font-semibold text-slate-600 transition-colors hover:text-slate-900 focus:outline-none"

  return (
    <div className="absolute inset-0 top-0 flex animate-fade-in flex-col pt-28 md:pt-20" style={{ background: '#f0f4f8' }}>
      <div className="relative z-20 flex flex-col gap-4 px-5 py-3 xl:flex-row xl:items-center xl:justify-between md:pt-4">
        <div>
          <p className="text-[14px] font-semibold text-slate-700">
            <span className="font-bold text-slate-900">{sorted.length}</span> companies
            {filters.category !== 'ALL' && <span className="text-slate-500"> · {filters.category}</span>}
          </p>
          <p className="mt-0.5 text-[12px] font-medium text-slate-400">
            {sorted.filter(company => company.lat != null).length} with map pins available
          </p>
        </div>

        {/* Consolidated Filter Pill */}
        <div className="flex items-center rounded-full bg-white/70 shadow-[0_2px_16px_rgba(0,0,0,0.04)] ring-1 ring-slate-900/5 backdrop-blur-xl transition-all hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:bg-white/90">
          
          {/* Search */}
          <div className="relative flex items-center bg-transparent">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-56 bg-transparent py-2.5 pl-10 pr-9 text-[13px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                title="Clear search"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>

          <div className="h-5 w-px bg-slate-200/80" />

          {/* Reserved Reset Button Slot (Prevents UI shifting) */}
          <div className="flex w-12 items-center justify-center">
            <button
              onClick={handleResetFilters}
              className={`flex h-full w-full items-center justify-center bg-transparent text-slate-400 hover:text-red-500 transition-all duration-300 focus:outline-none ${hasActiveFilters ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-90'}`}
              title="Reset all filters"
            >
              <RotateCcw size={14} strokeWidth={2.5} />
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200/80" />

          {/* Category Filter */}
          <CustomCombo
            value={localCategory}
            onChange={setLocalCategory}
            options={FILTER_CATEGORIES.filter(c => c !== 'ALL').map(c => ({ value: c, label: c }))}
            placeholder="All Sectors"
            widthCls="w-36"
          />

          <div className="h-5 w-px bg-slate-200/80" />

          {/* Country Filter */}
          <CustomCombo
            value={localCountry}
            onChange={setLocalCountry}
            options={availableCountries.map(c => ({ value: c, label: c }))}
            placeholder="All Countries"
            widthCls="w-[124px]"
          />

          <div className="h-5 w-px bg-slate-200/80" />

          {/* City Filter */}
          <CustomCombo
            value={localCity}
            onChange={setLocalCity}
            options={availableCities.map(c => ({ value: c, label: c }))}
            placeholder="All Cities"
            disabled={availableCities.length === 0}
            widthCls="w-28"
          />

        </div>
      </div>

      <div
        className="mx-4 mb-4 flex-1 overflow-hidden rounded-[1.25rem]"
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
          <table className="w-full min-w-[980px] table-fixed border-collapse text-left">
            <thead className="sticky top-0 z-10">
              <tr style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                {COLS.map(({ key, label, width }) => (
                  <th key={key} className={`cursor-pointer select-none px-5 py-3 ${width}`} onClick={() => handleSort(key)}>
                    <span className="flex items-center gap-1.5 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400 transition-colors hover:text-slate-700">
                      {label} <SortIcon active={sortKey === key} dir={sortDir} />
                    </span>
                  </th>
                ))}
                <th className="w-[8%] px-5 py-3 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
                  Website
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <p className="text-[14px] font-semibold text-slate-500">No companies found</p>
                    <p className="mt-1 text-[12px] text-slate-400">Adjust your search or clear filters to see more results</p>
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
        background: hovered ? 'rgba(255,255,255,0.4)' : 'transparent',
        transition: 'all 0.15s ease',
      }}
    >
      <td className="px-5 py-4 align-top">
        <div
          className={`flex items-start gap-3.5 ${hasPin && onViewOnMap ? 'group/name cursor-pointer' : ''}`}
          onClick={() => hasPin && onViewOnMap?.(company)}
          title={hasPin ? 'View on map' : undefined}
        >
          <CompanyLogo company={company} size={36} rounded="rounded-[0.8rem]" wide />
          <div className="min-w-0 pt-0.5">
            <p className={`text-[14px] font-semibold leading-tight transition-colors ${hasPin && onViewOnMap ? 'text-slate-800 group-hover/name:text-blue-600' : 'text-slate-800'}`}>
              {company.name}
              {hasPin && onViewOnMap && (
                <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-blue-500 opacity-0 transition-all group-hover/name:opacity-100">
                  Map ↗
                </span>
              )}
            </p>
            {company.description && (
              <p className="mt-1 max-w-[320px] truncate text-[12px] text-slate-500 font-medium">
                {company.description}
              </p>
            )}
          </div>
        </div>
      </td>

      <td className="px-5 py-4 align-top">
        <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1.5 text-[11px] font-bold tracking-wide ${colors.bg} ${colors.text} ${colors.border}`}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors.pin }} />
          {CATEGORY_SHORT[company.category]}
        </span>
      </td>

      <td className="px-5 py-4 align-top">
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            {hasPin && <MapPin size={13} className="mt-0.5 flex-shrink-0 text-slate-400" strokeWidth={2.2} />}
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-700">
                {company.city}<span className="font-medium text-slate-400">, {company.country}</span>
              </p>
              <p className="mt-0.5 max-w-[290px] text-[12px] font-medium leading-relaxed text-slate-500">{hqAddress}</p>
            </div>
          </div>

          {company.offices && company.offices.length > 0 && (
            <div className="flex items-start gap-2">
              <Building2 size={13} className="mt-0.5 flex-shrink-0 text-slate-400" strokeWidth={2.2} />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">Other offices</p>
                <p className="mt-0.5 max-w-[290px] text-[12px] font-medium leading-relaxed text-slate-500">
                  {company.offices.map(formatOffice).join(' · ')}
                </p>
              </div>
            </div>
          )}
        </div>
      </td>

      <td className="px-5 py-4 align-top">
        <span className="whitespace-nowrap text-[13px] font-semibold text-slate-600">
          {company.aum ?? <span className="text-slate-300">—</span>}
        </span>
        {company.employees && (
          <p className="mt-1 text-[11px] font-medium text-slate-400">{company.employees} employees</p>
        )}
      </td>

      <td className="px-5 py-4 align-top">
        {company.website ? (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 w-max rounded-md px-2 py-1 -ml-2 text-[12px] font-semibold text-slate-500 transition-all hover:bg-slate-100/50 hover:text-slate-800"
            onClick={e => e.stopPropagation()}
          >
            <span className="max-w-[140px] truncate">{domain}</span>
            <ExternalLink size={12} strokeWidth={2.5} className="flex-shrink-0 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </a>
        ) : (
          <span className="text-[12px] text-slate-300 font-medium">—</span>
        )}
      </td>
    </tr>
  )
}
