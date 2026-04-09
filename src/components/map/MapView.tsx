'use client'

import { useState, useCallback, useRef } from 'react'
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { companies } from '@/data/companies'
import { FilterCategory } from '@/data/companies'
import { Company, CATEGORY_COLORS, CATEGORY_SHORT } from '@/types'
import CompanyCard from '@/components/ui/CompanyCard'
import CompanyLogo from '@/components/ui/CompanyLogo'

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron'
const INITIAL_VIEW = { longitude: 13.5, latitude: 63.5, zoom: 4.0 }
const MAX_BOUNDS: [[number, number], [number, number]] = [[-5, 54], [35, 72]]

function LogoMarker({ company, isSelected }: { company: Company; isSelected: boolean }) {
  const colors = CATEGORY_COLORS[company.category]
  const short = CATEGORY_SHORT[company.category]
  const [attempt, setAttempt] = useState(0)
  const domain = (() => { try { return new URL(company.website).hostname.replace(/^www\./, '') } catch { return '' } })()
  const src = attempt === 0 ? `/logos/${company.id}.png` : attempt === 1 ? `https://logo.clearbit.com/${domain}` : null
  const handleError = () => { if (attempt === 0 && domain) setAttempt(1); else setAttempt(2) }

  const sz = isSelected ? 34 : 26

  return (
    <div className="group relative flex items-center justify-center cursor-pointer">
      {isSelected && (
        <span
          className="absolute rounded-full marker-pulse"
          style={{ width: sz + 10, height: sz + 10, backgroundColor: colors.pin, opacity: 0.3 }}
        />
      )}
      <span
        className="relative flex items-center justify-center overflow-hidden rounded-full bg-white transition-all duration-200 group-hover:scale-125"
        style={{
          width: sz, height: sz,
          border: `2.5px solid ${colors.pin}`,
          boxShadow: `0 2px 10px ${colors.pin}44, 0 1px 4px rgba(0,0,0,0.1)`,
        }}
      >
        {attempt < 2 && src ? (
          <img src={src} alt="" key={attempt} className="h-full w-full object-contain p-[2px]" onError={handleError} />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[8px] font-black text-white"
            style={{ backgroundColor: colors.pin }}>
            {short}
          </span>
        )}
      </span>

      {/* Name tooltip */}
      <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-white/96 backdrop-blur-md pl-1.5 pr-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xl border border-slate-100 opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-10">
        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors.pin }} />
        {company.name}
      </span>
    </div>
  )
}

interface Props {
  search: string
  filter: FilterCategory
  onFilterChange: (f: FilterCategory) => void
}

export default function MapView({ search, filter }: Props) {
  const [selected, setSelected] = useState<Company | null>(null)
  const mapRef = useRef<any>(null)

  const mappedCompanies = companies.filter(c => c.lat != null && c.lng != null)

  const filteredCompanies = mappedCompanies.filter((c) => {
    const matchesFilter = filter === 'ALL' || c.category === filter
    const q = search.toLowerCase()
    const matchesSearch = !search ||
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    return matchesFilter && matchesSearch
  })

  const handleMarkerClick = useCallback((company: Company) => {
    setSelected(company)
    if (company.lat != null && company.lng != null) {
      mapRef.current?.flyTo({
        center: [company.lng, company.lat],
        zoom: Math.max(mapRef.current?.getZoom() ?? 5, 7),
        duration: 700,
        essential: true,
      })
    }
  }, [])

  const handleBannerClick = useCallback((company: Company) => {
    setSelected(company)
    if (company.lat != null && company.lng != null) {
      mapRef.current?.flyTo({
        center: [company.lng, company.lat],
        zoom: Math.max(mapRef.current?.getZoom() ?? 5, 7),
        duration: 700,
        essential: true,
      })
    }
  }, [])

  return (
    <div className="absolute inset-0 top-0">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        renderWorldCopies={false}
        maxBounds={MAX_BOUNDS}
        reuseMaps
        onClick={() => setSelected(null)}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {filteredCompanies.map((company) => (
          <Marker
            key={company.id}
            longitude={company.lng!}
            latitude={company.lat!}
            anchor="center"
            onClick={(e) => { e.originalEvent.stopPropagation(); handleMarkerClick(company) }}
          >
            <LogoMarker company={company} isSelected={selected?.id === company.id} />
          </Marker>
        ))}
      </Map>

      {/* Company Detail Card */}
      {selected && (
        <CompanyCard company={selected} onClose={() => setSelected(null)} />
      )}

      {/* ── Scrolling company banner ── */}
      <CompanyBanner
        companies={filteredCompanies}
        selected={selected}
        onSelect={handleBannerClick}
      />
    </div>
  )
}

function CompanyBanner({
  companies: list,
  selected,
  onSelect,
}: {
  companies: Company[]
  selected: Company | null
  onSelect: (c: Company) => void
}) {
  if (list.length === 0) return null

  return (
    <div className="absolute bottom-6 left-0 right-0 z-30 pointer-events-none">
      <div className="pointer-events-auto overflow-x-auto thin-scroll pb-0.5 px-4">
        <div className="flex items-center gap-2 w-max mx-auto">
          {list.map((company) => {
            const colors = CATEGORY_COLORS[company.category]
            const isActive = selected?.id === company.id
            return (
              <button
                key={company.id}
                onClick={() => onSelect(company)}
                className={`flex items-center gap-2 rounded-2xl px-3 py-2 transition-all duration-200 flex-shrink-0 ${
                  isActive ? 'shadow-lg scale-105' : 'hover:scale-105'
                }`}
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${colors.pin}18, ${colors.pin}10)`
                    : 'rgba(255,255,255,0.75)',
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  border: `1.5px solid ${isActive ? colors.pin + '55' : 'rgba(255,255,255,0.7)'}`,
                  boxShadow: isActive
                    ? `0 4px 16px ${colors.pin}22, 0 1px 4px rgba(0,0,0,0.06)`
                    : '0 2px 8px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)',
                }}
              >
                <CompanyLogo company={company} size={24} rounded="rounded-lg" />
                <span className="text-[12px] font-semibold text-slate-800 whitespace-nowrap max-w-[120px] truncate">
                  {company.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
