'use client'

import { Map, LayoutList, Github } from 'lucide-react'
import { FilterCategory, FILTER_CATEGORIES } from '@/data/companies'
import { CATEGORY_COLORS, CATEGORY_SHORT, CompanyCategory } from '@/types'
import { AppView } from '@/app/page'

interface Props {
  view: AppView
  onViewChange: (v: AppView) => void
  filter: FilterCategory
  onFilterChange: (f: FilterCategory) => void
}

export default function Header({ view, onViewChange, filter, onFilterChange }: Props) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl pointer-events-none flex flex-col items-center gap-2">

      {/* ── Main nav ── */}
      <nav
        className="pointer-events-auto w-full rounded-2xl shadow-lg shadow-black/20"
        style={{
          background: 'rgba(10,12,18,0.82)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.09)',
        }}
      >
        <div className="flex items-center justify-between h-12 px-4 gap-2">

          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="5" r="2.3" fill="white"/>
                <path d="M6 11.5 C6 11.5 2 7.8 2 5a4 4 0 0 1 8 0c0 2.8-4 6.5-4 6.5z" stroke="white" strokeWidth="1.1" fill="none"/>
              </svg>
            </div>
            <span
              className="text-[13px] font-black tracking-[0.12em] text-white uppercase hidden sm:inline"
              style={{ letterSpacing: '0.12em' }}
            >
              Kapitalkart
            </span>
          </div>

          {/* Center nav links */}
          <div className="flex items-center gap-0.5 flex-1 justify-center">
            <button
              onClick={() => onViewChange('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                view === 'map'
                  ? 'text-white bg-white/12'
                  : 'text-white/50 hover:text-white hover:bg-white/7'
              }`}
            >
              <Map size={13} strokeWidth={2.5} />
              Map
            </button>
            <button
              onClick={() => onViewChange('companies')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                view === 'companies'
                  ? 'text-white bg-white/12'
                  : 'text-white/50 hover:text-white hover:bg-white/7'
              }`}
            >
              <LayoutList size={13} strokeWidth={2.5} />
              Companies
            </button>
          </div>

          {/* Right: GitHub */}
          <div className="flex items-center gap-1 shrink-0">
            <a
              href="https://github.com/egil10/ibmap"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-colors"
            >
              <Github size={15} strokeWidth={2} />
            </a>
          </div>
        </div>
      </nav>

      {/* ── Category filter strip ── */}
      <div className="pointer-events-auto w-full overflow-x-auto thin-scroll pb-1">
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
