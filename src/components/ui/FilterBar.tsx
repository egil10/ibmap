'use client'

import { CATEGORY_LABELS, CATEGORY_COLORS, CompanyCategory } from '@/types'
import { FilterCategory } from '@/data/companies'

const FILTERS: FilterCategory[] = ['ALL', 'AM', 'PE', 'VC', 'IB', 'TR', 'MC', 'HL', 'SH']

interface Props {
  activeFilter: FilterCategory
  onFilterChange: (filter: FilterCategory) => void
}

export default function FilterBar({ activeFilter, onFilterChange }: Props) {
  return (
    <div className="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-1.5 rounded-2xl border border-white/70 bg-white/85 px-3 py-2.5 shadow-2xl backdrop-blur-xl backdrop-saturate-150">
        {FILTERS.map((f) => {
          const isActive = f === activeFilter
          const isAll = f === 'ALL'
          const colors = isAll ? null : CATEGORY_COLORS[f as CompanyCategory]

          return (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-150 focus:outline-none ${
                isActive
                  ? isAll
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'shadow-sm text-white'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
              }`}
              style={
                isActive && !isAll && colors
                  ? { backgroundColor: colors.pin }
                  : undefined
              }
              title={isAll ? 'All companies' : CATEGORY_LABELS[f as CompanyCategory]}
            >
              {!isAll && colors && (
                <span
                  className={`h-2 w-2 rounded-full flex-shrink-0 ${isActive ? 'bg-white/70' : ''}`}
                  style={!isActive ? { backgroundColor: colors.pin } : undefined}
                />
              )}
              {f}
            </button>
          )
        })}
      </div>
    </div>
  )
}
