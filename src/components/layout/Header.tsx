'use client'

import { Map, LayoutList, Github, ChevronDown, Check, Navigation, Sun, Moon, ScanLine, AlignJustify, Sparkles, Shuffle } from 'lucide-react'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { companies, FilterCategory, FILTER_CATEGORIES } from '@/data/companies'
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
  { name: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522, zoom: 12 },
  { name: 'Bergen', country: 'Norway', lat: 60.3913, lng: 5.3221, zoom: 13 },
  { name: 'Stavanger', country: 'Norway', lat: 58.97, lng: 5.7331, zoom: 13 },
  { name: 'Trondheim', country: 'Norway', lat: 63.4305, lng: 10.3951, zoom: 13 },
  { name: 'Tromsø', country: 'Norway', lat: 69.6492, lng: 18.9553, zoom: 13 },
  { name: 'Ålesund', country: 'Norway', lat: 62.4722, lng: 6.1495, zoom: 13 },
  { name: 'Kristiansand', country: 'Norway', lat: 58.1467, lng: 7.9956, zoom: 13 },
  { name: 'Sandnes', country: 'Norway', lat: 58.8512, lng: 5.7355, zoom: 13 },
  { name: 'Fornebu', country: 'Norway', lat: 59.8958, lng: 10.6212, zoom: 14 },
  { name: 'Lysaker', country: 'Norway', lat: 59.9126, lng: 10.6351, zoom: 14 },
  { name: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, zoom: 12 },
  { name: 'Gothenburg', country: 'Sweden', lat: 57.7089, lng: 11.9746, zoom: 13 },
  { name: 'Copenhagen', country: 'Denmark', lat: 55.6761, lng: 12.5683, zoom: 12 },
  { name: 'Helsinki', country: 'Finland', lat: 60.1699, lng: 24.9384, zoom: 12 },
  { name: 'Reykjavik', country: 'Iceland', lat: 64.1466, lng: -21.9426, zoom: 12 },
  { name: 'Nordic view', country: '', lat: 64.2, lng: 8.5, zoom: 3.45 },
]

const MIN_COMPANIES = 5
const ALWAYS_VISIBLE_CITIES = new Set(['Nordic view', 'Helsinki', 'Reykjavik'])

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
  onRandomCompany: () => void
}

function useDropdown() {
  const [open, setOpen] = useState(false)
  const containers = useRef<HTMLDivElement[]>([])

  const ref = useCallback((el: HTMLDivElement | null) => {
    if (el && !containers.current.includes(el)) containers.current.push(el)
  }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as Node
      if (containers.current.every(c => !c.contains(target))) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return { open, setOpen, ref }
}

const MAP_STYLE_ICONS: Record<MapStyleKey, React.ReactNode> = {
  minimal: <ScanLine size={15} strokeWidth={2} />,
  detailed: <AlignJustify size={15} strokeWidth={2} />,
  vivid: <Sparkles size={15} strokeWidth={2} />,
}

function DropdownPanel({
  children,
  dropBg,
  dropBdr,
  dropShadow,
  className = '',
}: {
  children: React.ReactNode
  dropBg: string
  dropBdr: string
  dropShadow: string
  className?: string
}) {
  return (
    <div
      className={`absolute top-full mt-2 overflow-hidden rounded-2xl z-50 ${className}`}
      style={{
        background: dropBg,
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: `1px solid ${dropBdr}`,
        boxShadow: dropShadow,
      }}
    >
      {children}
    </div>
  )
}

export default function Header({
  view,
  onViewChange,
  filter,
  onFilterChange,
  onCitySelect,
  showOffices,
  onToggleOffices,
  mapStyleKey,
  onMapStyleChange,
  darkMode,
  onToggleDark,
  onRandomCompany,
}: Props) {
  const filterDrop = useDropdown()
  const cityDrop = useDropdown()
  const activeColors = filter !== 'ALL' ? CATEGORY_COLORS[filter as CompanyCategory] : null
  const activeLabel = filter === 'ALL' ? 'All' : CATEGORY_SHORT[filter as CompanyCategory]

  const cities = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const company of companies) {
      const key = company.city.toLowerCase()
      counts[key] = (counts[key] ?? 0) + 1
    }
    return ALL_CITIES.filter(city =>
      ALWAYS_VISIBLE_CITIES.has(city.name) || (counts[city.name.toLowerCase()] ?? 0) >= MIN_COMPANIES
    )
  }, [])

  const dm = darkMode
  const navBg = dm ? 'rgba(0,0,0,0.92)' : 'rgba(255,255,255,0.88)'
  const navBorder = dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const navShadow = dm
    ? '0 4px 24px rgba(0,0,0,0.28), 0 1px 4px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)'
    : '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)'
  const dropBg = dm ? 'rgba(0,0,0,0.97)' : 'rgba(255,255,255,0.96)'
  const dropBdr = dm ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'
  const dropShadow = dm
    ? '0 8px 32px rgba(0,0,0,0.40), 0 2px 8px rgba(0,0,0,0.20)'
    : '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05)'

  const brandText = dm ? 'text-slate-100' : 'text-slate-900'
  const brandBdr = dm ? 'border-white/[0.08]' : 'border-slate-100'
  const btnActive = dm ? 'text-slate-100 bg-white/[0.09]' : 'text-slate-800 bg-slate-100/80'
  const btnInactive = dm ? 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.07]' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'
  const officeToggleShell = dm
    ? 'relative flex h-9 items-center rounded-full border border-white/[0.08] bg-white/[0.04] p-1'
    : 'relative flex h-9 items-center rounded-full border border-slate-200 bg-slate-100/80 p-1'
  const officeToggleThumb = dm
    ? 'absolute top-1 bottom-1 w-[calc(50%-0.125rem)] rounded-full bg-white/[0.12] transition-transform duration-200 ease-out'
    : 'absolute top-1 bottom-1 w-[calc(50%-0.125rem)] rounded-full bg-white transition-transform duration-200 ease-out shadow-[0_1px_3px_rgba(15,23,42,0.10)]'
  const officeLabelActive = dm ? 'text-slate-100' : 'text-slate-900'
  const officeLabelInactive = dm ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
  const officeLabelDisabled = dm ? 'text-white/[0.18]' : 'text-slate-300'

  const desktopDropBtn = (open: boolean) => dm
    ? `flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-semibold transition-all duration-150 border ${open ? 'border-white/[0.14] bg-white/[0.09] text-slate-100' : 'border-transparent text-slate-400 hover:text-slate-100 hover:bg-white/[0.07]'}`
    : `flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-semibold transition-all duration-150 border ${open ? 'border-slate-200 bg-slate-50 text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/70'}`

  const itemClass = (active: boolean) => dm
    ? `w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-100 text-left ${active ? 'bg-white/[0.12] text-slate-100' : 'text-slate-400 hover:bg-white/[0.07] hover:text-slate-100'}`
    : `w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-100 text-left ${active ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`

  const iconBtn = dm
    ? 'flex items-center justify-center w-8 h-8 rounded-xl text-slate-500 hover:text-slate-200 hover:bg-white/[0.07] transition-colors shrink-0'
    : 'flex items-center justify-center w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 transition-colors shrink-0'

  const mobileActionBtn = dm
    ? 'flex w-full min-w-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold text-slate-300 transition-all duration-150 hover:bg-white/[0.07] hover:text-slate-100'
    : 'flex w-full min-w-0 items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[12px] font-semibold text-slate-600 transition-all duration-150 hover:bg-slate-100/70 hover:text-slate-900'

  const subText = dm ? 'text-slate-600' : 'text-slate-400'

  return (
    <div className="pointer-events-none fixed left-1/2 top-3 z-50 w-[calc(100%-1rem)] max-w-3xl -translate-x-1/2 md:top-4 md:w-[calc(100%-2rem)]">
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
        <div className="px-2 py-2 md:flex md:h-12 md:items-center md:gap-1 md:px-3 md:py-0">
          <div className="flex items-center gap-1 md:contents">
            <div className={`flex min-w-0 flex-1 items-center md:mr-1 md:flex-none md:shrink-0 md:border-r md:pr-3 ${brandBdr}`}>
              <a
                href="/"
                onClick={(e) => { e.preventDefault(); window.location.href = '/' }}
                className={`truncate text-[12px] font-black uppercase tracking-[0.13em] transition-opacity hover:opacity-70 md:text-[13px] ${brandText}`}
                style={{ textDecoration: 'none' }}
              >
                Kapitalkart
              </a>
            </div>

            <div className="hidden items-center gap-0.5 md:flex">
              <button
                onClick={() => onViewChange('map')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-semibold transition-all duration-150 ${view === 'map' ? btnActive : btnInactive}`}
              >
                <Map size={13} strokeWidth={2.5} />
                <span className="hidden sm:inline">Map</span>
              </button>
              <button
                onClick={() => onViewChange('companies')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[13px] font-semibold transition-all duration-150 ${view === 'companies' ? btnActive : btnInactive}`}
              >
                <LayoutList size={13} strokeWidth={2.5} />
                <span className="hidden sm:inline">Companies</span>
              </button>
            </div>

            <div
              className={`ml-1 hidden md:flex ${officeToggleShell} ${view !== 'map' ? 'opacity-60' : ''}`}
              title={view !== 'map' ? 'Switch to map view to toggle offices' : showOffices ? 'Showing all offices' : 'Showing HQ only'}
            >
              <span
                className={officeToggleThumb}
                style={{ transform: `translateX(${showOffices ? '100%' : '0%'})` }}
              />
              <button
                onClick={view === 'map' && showOffices ? onToggleOffices : undefined}
                className={`relative z-10 flex min-w-[3.25rem] items-center justify-center rounded-full px-3 text-[12px] font-semibold transition-colors duration-150 ${view !== 'map' ? officeLabelDisabled : !showOffices ? officeLabelActive : officeLabelInactive}`}
              >
                HQ
              </button>
              <button
                onClick={view === 'map' && !showOffices ? onToggleOffices : undefined}
                className={`relative z-10 flex min-w-[3.25rem] items-center justify-center rounded-full px-3 text-[12px] font-semibold transition-colors duration-150 ${view !== 'map' ? officeLabelDisabled : showOffices ? officeLabelActive : officeLabelInactive}`}
              >
                All
              </button>
            </div>

            <div className="hidden flex-1 md:block" />

            <div className="relative hidden shrink-0 md:block" ref={cityDrop.ref}>
              <button
                onClick={() => { cityDrop.setOpen(o => !o); filterDrop.setOpen(false) }}
                className={desktopDropBtn(cityDrop.open)}
              >
                <Navigation size={12} strokeWidth={2.5} className="flex-shrink-0" />
                <span className="hidden sm:inline">Go to</span>
                <ChevronDown size={11} strokeWidth={2.5} className={`flex-shrink-0 transition-transform duration-200 ${cityDrop.open ? 'rotate-180' : ''}`} />
              </button>

              {cityDrop.open && (
                <DropdownPanel dropBg={dropBg} dropBdr={dropBdr} dropShadow={dropShadow} className="right-0 w-52">
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
                </DropdownPanel>
              )}
            </div>

            <div className="relative hidden shrink-0 md:block" ref={filterDrop.ref}>
              <button
                onClick={() => { filterDrop.setOpen(o => !o); cityDrop.setOpen(false) }}
                className={desktopDropBtn(filterDrop.open)}
              >
                {activeColors && <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: activeColors.pin }} />}
                <span>{activeLabel}</span>
                <ChevronDown size={11} strokeWidth={2.5} className={`flex-shrink-0 transition-transform duration-200 ${filterDrop.open ? 'rotate-180' : ''}`} />
              </button>

              {filterDrop.open && (
                <DropdownPanel dropBg={dropBg} dropBdr={dropBdr} dropShadow={dropShadow} className="right-0 w-56">
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
                          <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors ? colors.pin : '#cbd5e1' }} />
                          <span className="flex-1">{isAll ? 'All categories' : f}</span>
                          {isActive && <Check size={12} strokeWidth={2.5} className={dm ? 'text-slate-400 flex-shrink-0' : 'text-slate-500 flex-shrink-0'} />}
                        </button>
                      )
                    })}
                  </div>
                </DropdownPanel>
              )}
            </div>

            {!darkMode && (
              <button
                onClick={() => {
                  const keys: MapStyleKey[] = ['minimal', 'detailed', 'vivid']
                  const idx = keys.indexOf(mapStyleKey)
                  onMapStyleChange(keys[(idx + 1) % keys.length])
                }}
                className={`${iconBtn} hidden md:flex`}
                title={`Map: ${MAP_STYLES[mapStyleKey].label} - click to cycle`}
              >
                {MAP_STYLE_ICONS[mapStyleKey]}
              </button>
            )}

            <button onClick={onRandomCompany} className={iconBtn} title="Show a random company on the map">
              <Shuffle size={15} strokeWidth={2} />
            </button>

            <button onClick={onToggleDark} className={iconBtn} title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
              {darkMode ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
            </button>

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

          <div className="mt-2 grid grid-cols-5 gap-1 md:hidden">
            <button onClick={() => onViewChange(view === 'map' ? 'companies' : 'map')} className={mobileActionBtn}>
              {view === 'map' ? <LayoutList size={13} strokeWidth={2.2} /> : <Map size={13} strokeWidth={2.2} />}
              <span className="truncate">{view === 'map' ? 'List' : 'Map'}</span>
            </button>

            <div className="relative" ref={filterDrop.ref}>
              <button
                onClick={() => { filterDrop.setOpen(o => !o); cityDrop.setOpen(false) }}
                className={mobileActionBtn}
              >
                {activeColors && <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: activeColors.pin }} />}
                <span className="truncate">{activeLabel}</span>
                <ChevronDown size={11} strokeWidth={2.5} className={`flex-shrink-0 transition-transform duration-200 ${filterDrop.open ? 'rotate-180' : ''}`} />
              </button>

              {filterDrop.open && (
                <DropdownPanel dropBg={dropBg} dropBdr={dropBdr} dropShadow={dropShadow} className="left-0 right-0">
                  <div className="max-h-72 overflow-auto p-1.5 thin-scroll">
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
                          <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors ? colors.pin : '#cbd5e1' }} />
                          <span className="flex-1 truncate">{isAll ? 'All categories' : f}</span>
                          {isActive && <Check size={12} strokeWidth={2.5} className={dm ? 'text-slate-400 flex-shrink-0' : 'text-slate-500 flex-shrink-0'} />}
                        </button>
                      )
                    })}
                  </div>
                </DropdownPanel>
              )}
            </div>

            <div className="relative" ref={cityDrop.ref}>
              <button
                onClick={() => { cityDrop.setOpen(o => !o); filterDrop.setOpen(false) }}
                className={mobileActionBtn}
              >
                <Navigation size={12} strokeWidth={2.5} className="flex-shrink-0" />
                <span className="truncate">Go to</span>
                <ChevronDown size={11} strokeWidth={2.5} className={`flex-shrink-0 transition-transform duration-200 ${cityDrop.open ? 'rotate-180' : ''}`} />
              </button>

              {cityDrop.open && (
                <DropdownPanel dropBg={dropBg} dropBdr={dropBdr} dropShadow={dropShadow} className="left-0 right-0">
                  <div className="max-h-72 overflow-auto p-1.5 thin-scroll">
                    {cities.map((city) => (
                      <button
                        key={city.name}
                        onClick={() => { onCitySelect(city.lat, city.lng, city.zoom); cityDrop.setOpen(false) }}
                        className={itemClass(false)}
                      >
                        <span className="flex-1 truncate">{city.name}</span>
                        {city.country && <span className={`text-[10px] font-normal ${subText}`}>{city.country}</span>}
                      </button>
                    ))}
                  </div>
                </DropdownPanel>
              )}
            </div>

            <div
              className={`${officeToggleShell} ${view !== 'map' ? 'opacity-60' : ''}`}
              title={view !== 'map' ? 'Switch to map view to toggle offices' : showOffices ? 'Showing all offices' : 'Showing HQ only'}
            >
              <span
                className={officeToggleThumb}
                style={{ transform: `translateX(${showOffices ? '100%' : '0%'})` }}
              />
              <button
                onClick={view === 'map' && showOffices ? onToggleOffices : undefined}
                className={`relative z-10 flex min-w-0 flex-1 items-center justify-center rounded-full px-2 text-[12px] font-semibold transition-colors duration-150 ${view !== 'map' ? officeLabelDisabled : !showOffices ? officeLabelActive : officeLabelInactive}`}
              >
                HQ
              </button>
              <button
                onClick={view === 'map' && !showOffices ? onToggleOffices : undefined}
                className={`relative z-10 flex min-w-0 flex-1 items-center justify-center rounded-full px-2 text-[12px] font-semibold transition-colors duration-150 ${view !== 'map' ? officeLabelDisabled : showOffices ? officeLabelActive : officeLabelInactive}`}
              >
                All
              </button>
            </div>

            <button onClick={onRandomCompany} className={mobileActionBtn} title="Show a random company on the map">
              <Shuffle size={12} strokeWidth={2.3} />
              <span className="truncate">Random</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
