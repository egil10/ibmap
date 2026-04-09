'use client'

import { Search, X, MapPin } from 'lucide-react'
import { useState } from 'react'

interface Props {
  search: string
  onSearch: (v: string) => void
  totalCount: number
  filteredCount: number
}

export default function Header({ search, onSearch, totalCount, filteredCount }: Props) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="pointer-events-none absolute top-5 left-0 right-0 z-40 flex items-start justify-between px-4 md:px-6 gap-3">
      {/* Logo / Brand */}
      <div className="pointer-events-auto flex-shrink-0">
        <div className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/85 px-4 py-2.5 shadow-xl backdrop-blur-xl backdrop-saturate-150">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900">
            <MapPin size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-bold leading-none tracking-tight text-slate-900">IBMap</p>
            <p className="text-[10px] font-medium text-slate-400 leading-none mt-0.5">Norway</p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="pointer-events-auto flex-1 max-w-sm">
        <div
          className={`flex items-center gap-2.5 rounded-2xl border bg-white/85 px-3.5 py-2.5 shadow-xl backdrop-blur-xl backdrop-saturate-150 transition-all duration-200 ${
            focused
              ? 'border-slate-300 bg-white/95 shadow-2xl ring-2 ring-slate-200'
              : 'border-white/70'
          }`}
        >
          <Search
            size={15}
            className={`flex-shrink-0 transition-colors ${focused ? 'text-slate-600' : 'text-slate-400'}`}
            strokeWidth={2.5}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search companies, cities…"
            className="flex-1 min-w-0 bg-transparent text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              className="flex-shrink-0 rounded-full p-0.5 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      {/* Stats badge */}
      <div className="pointer-events-auto flex-shrink-0">
        <div className="flex items-center gap-1.5 rounded-2xl border border-white/70 bg-white/85 px-3.5 py-2.5 shadow-xl backdrop-blur-xl backdrop-saturate-150">
          <span className="text-sm font-bold tabular-nums text-slate-900">
            {filteredCount < totalCount ? `${filteredCount}/` : ''}{totalCount}
          </span>
          <span className="text-xs font-medium text-slate-400">firms</span>
        </div>
      </div>
    </div>
  )
}
