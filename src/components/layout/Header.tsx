'use client'

import { Search, X, Map, List } from 'lucide-react'
import { useState } from 'react'
import { FilterCategory, FILTER_CATEGORIES } from '@/data/companies'
import { CATEGORY_COLORS, CATEGORY_SHORT, CompanyCategory } from '@/types'
import { AppView } from '@/app/page'

interface Props {
  view: AppView
  onViewChange: (v: AppView) => void
  search: string
  onSearch: (v: string) => void
  filter: FilterCategory
  onFilterChange: (f: FilterCategory) => void
}

export default function Header({ view, onViewChange, search, onSearch, filter, onFilterChange }: Props) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 pt-4 pb-0 md:px-5">
        {/* Brand */}
        <div className="pointer-events-auto flex-shrink-0">
          <div className="glass flex items-center gap-2.5 rounded-2xl px-3.5 py-2 shadow-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="5" r="2.5" fill="white"/>
                <path d="M6 12 C6 12 2 8 2 5a4 4 0 0 1 8 0c0 3-4 7-4 7z" stroke="white" strokeWidth="1.2" fill="none"/>
              </svg>
            </div>
            <span className="text-[13px] font-bold tracking-tight text-slate-900">IBMap</span>
          </div>
        </div>

        {/* View toggle */}
        <div className="pointer-events-auto flex-shrink-0">
          <div className="glass flex items-center gap-0.5 rounded-2xl p-1 shadow-sm">
            <button
              onClick={() => onViewChange('map')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                view === 'map'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Map size={12} strokeWidth={2.5} />
              Map
            </button>
            <button
              onClick={() => onViewChange('companies')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                view === 'companies'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <List size={12} strokeWidth={2.5} />
              Companies
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="pointer-events-auto flex-1">
          <div className={`glass flex items-center gap-2 rounded-2xl px-3.5 py-2 shadow-sm transition-all duration-200 ${
            focused ? 'ring-2 ring-slate-900/10 shadow-md' : ''
          }`}>
            <Search size={13} className={`flex-shrink-0 transition-colors ${focused ? 'text-slate-600' : 'text-slate-400'}`} strokeWidth={2.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search firms, cities…"
              className="flex-1 min-w-0 bg-transparent text-[13px] font-medium text-slate-700 placeholder-slate-400 focus:outline-none"
            />
            {search && (
              <button onClick={() => onSearch('')} className="flex-shrink-0 rounded-full p-0.5 text-slate-400 hover:text-slate-600">
                <X size={12} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter strip */}
      <div className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto px-4 pt-2 pb-3 md:px-5 thin-scroll">
        {FILTER_CATEGORIES.map((f) => {
          const isActive = f === filter
          const isAll = f === 'ALL'
          const colors = isAll ? null : CATEGORY_COLORS[f as CompanyCategory]

          return (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide transition-all duration-150 focus:outline-none ${
                isActive
                  ? isAll
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-white shadow-sm'
                  : 'glass text-slate-600 hover:text-slate-900 shadow-sm hover:shadow-md'
              }`}
              style={isActive && !isAll && colors ? { backgroundColor: colors.pin } : undefined}
            >
              {!isAll && colors && (
                <span
                  className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.7)' : colors.pin }}
                />
              )}
              {isAll ? 'All' : (CATEGORY_SHORT[f as CompanyCategory] + ' · ' + f)}
            </button>
          )
        })}
      </div>
    </div>
  )
}
