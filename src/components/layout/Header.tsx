'use client'

import { Map, LayoutList, Github, ChevronDown, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
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
  const [filterOpen, setFilterOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFilterOpen(false)
      }
    }
    if (filterOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [filterOpen])

  const activeColors = filter !== 'ALL' ? CATEGORY_COLORS[filter as CompanyCategory] : null
  const activeLabel = filter === 'ALL' ? 'All categories' : `${CATEGORY_SHORT[filter as CompanyCategory]} · ${filter}`

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl pointer-events-none">

      {/* ── Main nav ── */}
      <nav
        className="pointer-events-auto w-full rounded-2xl shadow-md"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          border: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
      >
        <div className="flex items-center h-12 px-3 gap-1">

          {/* Brand — text only */}
          <div className="flex items-center shrink-0 pr-3 mr-1 border-r border-slate-100">
            <span
              className="text-[13px] font-black tracking-[0.13em] text-slate-900 uppercase select-none"
              style={{ letterSpacing: '0.13em' }}
            >
              Kapitalkart
            </span>
          </div>

          {/* Center nav links */}
          <div className="flex items-center gap-0.5 flex-1 justify-center">
            <button
              onClick={() => onViewChange('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
                view === 'map'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
              }`}
            >
              <Map size={13} strokeWidth={2.5} />
              Map
            </button>
            <button
              onClick={() => onViewChange('companies')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
                view === 'companies'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
              }`}
            >
              <LayoutList size={13} strokeWidth={2.5} />
              Companies
            </button>
          </div>

          {/* Filter dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setFilterOpen(o => !o)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-semibold transition-all duration-150 border ${
                filterOpen
                  ? 'border-slate-200 bg-slate-50 text-slate-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
              }`}
            >
              {activeColors && (
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: activeColors.pin }} />
              )}
              <span className="hidden sm:inline max-w-[140px] truncate">{activeLabel}</span>
              <ChevronDown
                size={12}
                strokeWidth={2.5}
                className={`flex-shrink-0 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown panel */}
            {filterOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50"
                style={{
                  background: 'rgba(255,255,255,0.96)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(0,0,0,0.07)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <div className="p-1.5">
                  {FILTER_CATEGORIES.map((f) => {
                    const isActive = f === filter
                    const isAll = f === 'ALL'
                    const colors = isAll ? null : CATEGORY_COLORS[f as CompanyCategory]
                    return (
                      <button
                        key={f}
                        onClick={() => { onFilterChange(f); setFilterOpen(false) }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-100 text-left ${
                          isActive
                            ? 'bg-slate-100 text-slate-900'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        {colors ? (
                          <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors.pin }} />
                        ) : (
                          <span className="h-2 w-2 rounded-full flex-shrink-0 bg-slate-300" />
                        )}
                        <span className="flex-1">{isAll ? 'All categories' : f}</span>
                        {isActive && <Check size={12} strokeWidth={2.5} className="text-slate-500 flex-shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* GitHub */}
          <a
            href="https://github.com/egil10/ibmap"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 transition-colors ml-1 shrink-0"
          >
            <Github size={15} strokeWidth={2} />
          </a>
        </div>
      </nav>
    </div>
  )
}
