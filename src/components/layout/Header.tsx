'use client'

import { Map, LayoutList, Github, ChevronDown, Check, Navigation } from 'lucide-react'
import { useState, useRef, useEffect, useMemo } from 'react'
import { FilterCategory, FILTER_CATEGORIES, companies } from '@/data/companies'
import { CATEGORY_COLORS, CATEGORY_SHORT, CompanyCategory } from '@/types'
import { AppView } from '@/app/page'

interface City {
  name: string
  country: string
  lat: number
  lng: number
  zoom: number
}

const ALL_CITIES: City[] = [
  { name: 'Oslo',         country: 'Norway',  lat: 59.9139, lng: 10.7522, zoom: 12 },
  { name: 'Bergen',       country: 'Norway',  lat: 60.3913, lng: 5.3221,  zoom: 13 },
  { name: 'Stavanger',    country: 'Norway',  lat: 58.9700, lng: 5.7331,  zoom: 13 },
  { name: 'Trondheim',    country: 'Norway',  lat: 63.4305, lng: 10.3951, zoom: 13 },
  { name: 'Tromsø',       country: 'Norway',  lat: 69.6492, lng: 18.9553, zoom: 13 },
  { name: 'Ålesund',      country: 'Norway',  lat: 62.4722, lng: 6.1495,  zoom: 13 },
  { name: 'Kristiansand', country: 'Norway',  lat: 58.1467, lng: 7.9956,  zoom: 13 },
  { name: 'Sandnes',      country: 'Norway',  lat: 58.8512, lng: 5.7355,  zoom: 13 },
  { name: 'Fornebu',      country: 'Norway',  lat: 59.8958, lng: 10.6212, zoom: 14 },
  { name: 'Lysaker',      country: 'Norway',  lat: 59.9126, lng: 10.6351, zoom: 14 },
  { name: 'Stockholm',    country: 'Sweden',  lat: 59.3293, lng: 18.0686, zoom: 12 },
  { name: 'Gothenburg',   country: 'Sweden',  lat: 57.7089, lng: 11.9746, zoom: 13 },
  { name: 'Copenhagen',   country: 'Denmark', lat: 55.6761, lng: 12.5683, zoom: 12 },
  { name: 'Helsinki',     country: 'Finland', lat: 60.1699, lng: 24.9384, zoom: 12 },
  { name: 'Nordic view',  country: '',        lat: 63.5,   lng: 13.5,   zoom: 4  },
]

const MIN_COMPANIES = 5

interface Props {
  view: AppView
  onViewChange: (v: AppView) => void
  filter: FilterCategory
  onFilterChange: (f: FilterCategory) => void
  onCitySelect: (lat: number, lng: number, zoom: number) => void
  showOffices: boolean
  onToggleOffices: () => void
}

function useDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])
  return { open, setOpen, ref }
}

export default function Header({ view, onViewChange, filter, onFilterChange, onCitySelect, showOffices, onToggleOffices }: Props) {
  const filterDrop = useDropdown()
  const cityDrop = useDropdown()

  const activeColors = filter !== 'ALL' ? CATEGORY_COLORS[filter as CompanyCategory] : null
  const activeLabel = filter === 'ALL' ? 'All' : CATEGORY_SHORT[filter as CompanyCategory]

  const cities = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const c of companies) {
      const key = c.city.toLowerCase()
      counts[key] = (counts[key] ?? 0) + 1
    }
    return ALL_CITIES.filter(city =>
      city.name === 'Nordic view' || (counts[city.name.toLowerCase()] ?? 0) >= MIN_COMPANIES
    )
  }, [])

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl pointer-events-none">
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

          {/* Brand — click to hard reload */}
          <div className="flex items-center shrink-0 pr-3 mr-1 border-r border-slate-100">
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); window.location.href = '/' }}
              className="text-[13px] font-black tracking-[0.13em] text-slate-900 uppercase select-none hover:opacity-70 transition-opacity cursor-pointer"
              style={{ letterSpacing: '0.13em', textDecoration: 'none' }}
            >
              Kapitalkart
            </a>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onViewChange('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
                view === 'map' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
              }`}
            >
              <Map size={13} strokeWidth={2.5} />
              <span className="hidden sm:inline">Map</span>
            </button>
            <button
              onClick={() => onViewChange('companies')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
                view === 'companies' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
              }`}
            >
              <LayoutList size={13} strokeWidth={2.5} />
              <span className="hidden sm:inline">Companies</span>
            </button>
          </div>

          {/* HQ / All offices toggle */}
          <button
            onClick={view === 'map' ? onToggleOffices : undefined}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-[12px] font-semibold transition-all duration-150 border ml-1 ${
              view !== 'map'
                ? 'border-transparent text-slate-300 cursor-default'
                : showOffices
                  ? 'border-slate-300 bg-slate-100 text-slate-800'
                  : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100/70'
            }`}
            title={view !== 'map' ? 'Switch to map view to toggle offices' : showOffices ? 'Showing all offices — click for HQ only' : 'Showing HQ only — click for all offices'}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${view !== 'map' ? 'bg-slate-200' : showOffices ? 'bg-slate-600' : 'bg-slate-300'}`} />
            <span className="hidden sm:inline">{showOffices ? 'All' : 'HQ'}</span>
          </button>

          <div className="flex-1" />

          {/* City jump dropdown */}
          <div className="relative shrink-0" ref={cityDrop.ref}>
            <button
              onClick={() => { cityDrop.setOpen(o => !o); filterDrop.setOpen(false) }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-semibold transition-all duration-150 border ${
                cityDrop.open
                  ? 'border-slate-200 bg-slate-50 text-slate-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
              }`}
            >
              <Navigation size={12} strokeWidth={2.5} className="flex-shrink-0" />
              <span className="hidden sm:inline">Go to</span>
              <ChevronDown size={11} strokeWidth={2.5}
                className={`flex-shrink-0 transition-transform duration-200 ${cityDrop.open ? 'rotate-180' : ''}`} />
            </button>

            {cityDrop.open && (
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50"
                style={{
                  background: 'rgba(255,255,255,0.96)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: '1px solid rgba(0,0,0,0.07)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <div className="p-1.5">
                  {cities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => {
                        onCitySelect(city.lat, city.lng, city.zoom)
                        cityDrop.setOpen(false)
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-100 text-left text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <span className="flex-1">{city.name}</span>
                      {city.country && (
                        <span className="text-[10px] text-slate-400 font-normal">{city.country}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Category filter dropdown */}
          <div className="relative shrink-0" ref={filterDrop.ref}>
            <button
              onClick={() => { filterDrop.setOpen(o => !o); cityDrop.setOpen(false) }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-semibold transition-all duration-150 border ${
                filterDrop.open
                  ? 'border-slate-200 bg-slate-50 text-slate-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
              }`}
            >
              {activeColors ? (
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: activeColors.pin }} />
              ) : null}
              <span>{activeLabel}</span>
              <ChevronDown size={11} strokeWidth={2.5}
                className={`flex-shrink-0 transition-transform duration-200 ${filterDrop.open ? 'rotate-180' : ''}`} />
            </button>

            {filterDrop.open && (
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
                        onClick={() => { onFilterChange(f); filterDrop.setOpen(false) }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-100 text-left ${
                          isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: colors ? colors.pin : '#cbd5e1' }} />
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
            className="flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 transition-colors ml-0.5 shrink-0"
          >
            <Github size={15} strokeWidth={2} />
          </a>
        </div>
      </nav>
    </div>
  )
}
