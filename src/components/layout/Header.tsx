'use client'

import { Search, X, Map, LayoutList, Github } from 'lucide-react'
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
    <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none flex flex-col items-center gap-2 pt-4 px-4">

      {/* ── Main floating bar ── */}
      <div className="pointer-events-auto w-full max-w-2xl">
        <div
          className="flex items-center gap-1 rounded-2xl px-2 py-1.5 shadow-lg"
          style={{
            background: 'rgba(255,255,255,0.78)',
            backdropFilter: 'blur(32px) saturate(200%)',
            WebkitBackdropFilter: 'blur(32px) saturate(200%)',
            border: '1px solid rgba(255,255,255,0.65)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          {/* Brand */}
          <div className="flex items-center gap-2 pl-1.5 pr-3 flex-shrink-0 border-r border-slate-100 mr-1">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 flex-shrink-0">
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="5" r="2.3" fill="white"/>
                <path d="M6 11.5 C6 11.5 2 7.8 2 5a4 4 0 0 1 8 0c0 2.8-4 6.5-4 6.5z" stroke="white" strokeWidth="1.1" fill="none"/>
              </svg>
            </div>
            <span
              className="text-[13px] font-black tracking-[0.1em] text-slate-900 uppercase"
              style={{ fontFamily: 'var(--font-inter), -apple-system, sans-serif', letterSpacing: '0.12em' }}
            >
              Kapitalkart
            </span>
          </div>

          {/* Search */}
          <div className={`flex flex-1 items-center gap-2 rounded-xl px-3 py-1.5 transition-all duration-200 ${focused ? 'bg-white/80 ring-1 ring-slate-200' : ''}`}>
            <Search size={13} className={`flex-shrink-0 transition-colors ${focused ? 'text-slate-600' : 'text-slate-400'}`} strokeWidth={2.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search firms, cities, categories…"
              className="flex-1 min-w-0 bg-transparent text-[13px] font-medium text-slate-700 placeholder-slate-400 focus:outline-none"
            />
            {search && (
              <button onClick={() => onSearch('')} className="flex-shrink-0 rounded-full p-0.5 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={12} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-0.5 ml-1 flex-shrink-0">
            <button
              onClick={() => onViewChange('map')}
              title="Map view"
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                view === 'map' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              <Map size={12} strokeWidth={2.5} />
              <span className="hidden sm:inline">Map</span>
            </button>
            <button
              onClick={() => onViewChange('companies')}
              title="Companies list"
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                view === 'companies' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              <LayoutList size={12} strokeWidth={2.5} />
              <span className="hidden sm:inline">Companies</span>
            </button>
          </div>

          {/* GitHub */}
          <a
            href="https://github.com/egil10/ibmap"
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub"
            className="ml-1 flex-shrink-0 rounded-xl p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100/60 transition-all duration-150"
          >
            <Github size={14} strokeWidth={2} />
          </a>
        </div>
      </div>

      {/* ── Category filter strip ── */}
      <div className="pointer-events-auto w-full max-w-2xl overflow-x-auto thin-scroll pb-1">
        <div className="flex items-center gap-1.5 w-max mx-auto px-1">
          {FILTER_CATEGORIES.map((f) => {
            const isActive = f === filter
            const isAll = f === 'ALL'
            const colors = isAll ? null : CATEGORY_COLORS[f as CompanyCategory]

            return (
              <button
                key={f}
                onClick={() => onFilterChange(f)}
                className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide transition-all duration-150 focus:outline-none shadow-sm ${
                  isActive
                    ? isAll ? 'bg-slate-900 text-white' : 'text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                style={{
                  ...(isActive && !isAll && colors ? { backgroundColor: colors.pin } : {}),
                  ...(!isActive ? {
                    background: 'rgba(255,255,255,0.72)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8)',
                  } : {}),
                }}
              >
                {!isAll && colors && (
                  <span
                    className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.7)' : colors.pin }}
                  />
                )}
                {isAll ? 'All' : `${CATEGORY_SHORT[f as CompanyCategory]} · ${f}`}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
