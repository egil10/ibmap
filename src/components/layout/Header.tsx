'use client'

import { Map, LayoutList, Github, ChevronDown, Check, Navigation, Sun, Moon, ScanLine, AlignJustify, Sparkles } from 'lucide-react'
import { useState, useRef, useEffect, useMemo } from 'react'
import { FilterCategory, FILTER_CATEGORIES, companies } from '@/data/companies'
import { CATEGORY_COLORS, CATEGORY_SHORT, CompanyCategory, MapStyleKey, MAP_STYLES } from '@/types'
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
  { name: 'Nordic view',  country: '',        lat: 63.5,    lng: 13.5,    zoom: 4  },
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
  mapStyleKey: MapStyleKey
  onMapStyleChange: (k: MapStyleKey) => void
  darkMode: boolean
  onToggleDark: () => void
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

// Map style icons
const MAP_STYLE_ICONS: Record<MapStyleKey, React.ReactNode> = {
  minimal:  <ScanLine      size={15} strokeWidth={2} />,
  detailed: <AlignJustify  size={15} strokeWidth={2} />,
  vivid:    <Sparkles      size={15} strokeWidth={2} />,
}

export default function Header({ view, onViewChange, filter, onFilterChange, onCitySelect, showOffices, onToggleOffices, mapStyleKey, onMapStyleChange, darkMode, onToggleDark }: Props) {
  const filterDrop = useDropdown()
  const cityDrop   = useDropdown()

  const activeColors = filter !== 'ALL' ? CATEGORY_COLORS[filter as CompanyCategory] : null
  const activeLabel  = filter === 'ALL' ? 'All' : CATEGORY_SHORT[filter as CompanyCategory]

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

  // Theme helpers — keep all classes literal so Tailwind v4 scanner picks them up
  const dm = darkMode

  const navBg     = dm ? 'rgba(0,0,0,0.92)'  : 'rgba(255,255,255,0.88)'
  const navBorder = dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const navShadow = dm
    ? '0 4px 24px rgba(0,0,0,0.28), 0 1px 4px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)'
    : '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)'
  const dropBg  = dm ? 'rgba(0,0,0,0.97)'   : 'rgba(255,255,255,0.96)'
  const dropBdr = dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const dropShadow = dm
    ? '0 8px 32px rgba(0,0,0,0.40), 0 2px 8px rgba(0,0,0,0.20)'
    : '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)'

  const brandText  = dm ? 'text-slate-100' : 'text-slate-900'
  const brandBdr   = dm ? 'border-white/[0.08]' : 'border-slate-100'

  const btnActive   = dm ? 'text-slate-100 bg-white/[0.09]' : 'text-slate-800 bg-slate-100/80'
  const btnInactive = dm ? 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.07]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'

  const hqActive   = dm ? 'border-white/[0.25] bg-white/[0.10] text-slate-200' : 'border-slate-300 bg-slate-100 text-slate-800'
  const hqInactive = dm ? 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/[0.07]' : 'border-transparent text-slate-400 hover:text-slate-700 hover:bg-slate-100/70'
  const hqDisabled = dm ? 'border-transparent text-white/[0.15] cursor-default' : 'border-transparent text-slate-300 cursor-default'
  const hqDot = (active: boolean, disabled: boolean) =>
    disabled ? (dm ? 'bg-white/[0.15]' : 'bg-slate-200')
    : active  ? (dm ? 'bg-slate-300' : 'bg-slate-600')
    : (dm ? 'bg-slate-600' : 'bg-slate-300')

  const dropBtn = (open: boolean) => dm
    ? `flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-semibold transition-all duration-150 border ${open ? 'border-white/[0.14] bg-white/[0.09] text-slate-100' : 'border-transparent text-slate-400 hover:text-slate-100 hover:bg-white/[0.07]'}`
    : `flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-semibold transition-all duration-150 border ${open ? 'border-slate-200 bg-slate-50 text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'}`

  const itemClass = (active: boolean) => dm
    ? `w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-100 text-left ${active ? 'bg-white/[0.12] text-slate-100' : 'text-slate-400 hover:bg-white/[0.07] hover:text-slate-100'}`
    : `w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-100 text-left ${active ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`

  const iconBtn = dm
    ? 'flex items-center justify-center w-8 h-8 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.07] transition-colors shrink-0'
    : 'flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 transition-colors shrink-0'

  const subText = dm ? 'text-slate-600' : 'text-slate-400'

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl pointer-events-none">
      <nav
        className="pointer-events-auto w-full rounded-2xl shadow-md"
        style={{
          background: navBg,
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          border: `1px solid ${navBorder}`,
          boxShadow: navShadow,
        }}
      >
        <div className="flex items-center h-12 px-3 gap-1">

          {/* Brand */}
          <div className={`flex items-center shrink-0 pr-3 mr-1 border-r ${brandBdr}`}>
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); window.location.href = '/' }}
              className={`text-[13px] font-black tracking-[0.13em] uppercase select-none hover:opacity-70 transition-opacity cursor-pointer ${brandText}`}
              style={{ letterSpacing: '0.13em', textDecoration: 'none' }}
            >
              Kapitalkart
            </a>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onViewChange('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${view === 'map' ? btnActive : btnInactive}`}
            >
              <Map size={13} strokeWidth={2.5} />
              <span className="hidden sm:inline">Map</span>
            </button>
            <button
              onClick={() => onViewChange('companies')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${view === 'companies' ? btnActive : btnInactive}`}
            >
              <LayoutList size={13} strokeWidth={2.5} />
              <span className="hidden sm:inline">Companies</span>
            </button>
          </div>

          {/* HQ / All offices toggle */}
          <button
            onClick={view === 'map' ? onToggleOffices : undefined}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-[12px] font-semibold transition-all duration-150 border ml-1 ${
              view !== 'map' ? hqDisabled : showOffices ? hqActive : hqInactive
            }`}
            title={view !== 'map' ? 'Switch to map view to toggle offices' : showOffices ? 'Showing all offices — click for HQ only' : 'Showing HQ only — click for all offices'}
          >
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${hqDot(showOffices, view !== 'map')}`} />
            <span className="hidden sm:inline">{showOffices ? 'All' : 'HQ'}</span>
          </button>

          <div className="flex-1" />

          {/* City jump dropdown */}
          <div className="relative shrink-0" ref={cityDrop.ref}>
            <button
              onClick={() => { cityDrop.setOpen(o => !o); filterDrop.setOpen(false) }}
              className={dropBtn(cityDrop.open)}
            >
              <Navigation size={12} strokeWidth={2.5} className="flex-shrink-0" />
              <span className="hidden sm:inline">Go to</span>
              <ChevronDown size={11} strokeWidth={2.5}
                className={`flex-shrink-0 transition-transform duration-200 ${cityDrop.open ? 'rotate-180' : ''}`} />
            </button>

            {cityDrop.open && (
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50"
                style={{ background: dropBg, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: `1px solid ${dropBdr}`, boxShadow: dropShadow }}
              >
                <div className="p-1.5">
                  {cities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => { onCitySelect(city.lat, city.lng, city.zoom); cityDrop.setOpen(false) }}
                      className={itemClass(false)}
                    >
                      <span className="flex-1">{city.name}</span>
                      {city.country && <span className={`text-[10px] font-normal ${subText}`}>{city.country}</span>}
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
              className={dropBtn(filterDrop.open)}
            >
              {activeColors && <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: activeColors.pin }} />}
              <span>{activeLabel}</span>
              <ChevronDown size={11} strokeWidth={2.5}
                className={`flex-shrink-0 transition-transform duration-200 ${filterDrop.open ? 'rotate-180' : ''}`} />
            </button>

            {filterDrop.open && (
              <div
                className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-50"
                style={{ background: dropBg, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: `1px solid ${dropBdr}`, boxShadow: dropShadow }}
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
                        className={itemClass(isActive)}
                      >
                        <span className="h-2 w-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: colors ? colors.pin : '#cbd5e1' }} />
                        <span className="flex-1">{isAll ? 'All categories' : f}</span>
                        {isActive && <Check size={12} strokeWidth={2.5} className={dm ? 'text-slate-400 flex-shrink-0' : 'text-slate-500 flex-shrink-0'} />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Map style cycle toggle — hidden in dark mode (single dark tile) */}
          {!darkMode && (
            <button
              onClick={() => {
                const keys: MapStyleKey[] = ['minimal', 'detailed', 'vivid']
                const idx = keys.indexOf(mapStyleKey)
                onMapStyleChange(keys[(idx + 1) % keys.length])
              }}
              className={iconBtn}
              title={`Map: ${MAP_STYLES[mapStyleKey].label} — click to cycle`}
            >
              {MAP_STYLE_ICONS[mapStyleKey]}
            </button>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDark}
            className={iconBtn}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
          </button>

          {/* GitHub */}
          <a
            href="https://github.com/egil10/ibmap"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={iconBtn}
          >
            <Github size={15} strokeWidth={2} />
          </a>
        </div>
      </nav>
    </div>
  )
}
