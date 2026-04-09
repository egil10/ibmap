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
const MAX_BOUNDS: [[number, number], [number, number]] = [[-10, 52], [40, 73]]

const WORLD_MASK_GEOJSON = {
  type: 'Feature' as const,
  geometry: {
    type: 'Polygon' as const,
    coordinates: [
      [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]],
      [[-10, 52], [-10, 73], [40, 73], [40, 52], [-10, 52]],
    ],
  },
}

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
        className="relative flex items-center justify-center rounded-full bg-white transition-all duration-200 group-hover:scale-125"
        style={{
          width: sz, height: sz,
          border: isSelected ? `2px solid rgba(0,0,0,0.18)` : `1.5px solid rgba(0,0,0,0.1)`,
          boxShadow: `0 2px 8px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)`,
          overflow: 'hidden',
        }}
      >
        {attempt < 2 && src ? (
          <img src={src} alt="" key={attempt} className="w-full h-full object-contain" style={{ padding: sz > 28 ? 3 : 2 }} onError={handleError} />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[8px] font-black text-white"
            style={{ backgroundColor: colors.pin }}>
            {short}
          </span>
        )}
      </span>

      <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-white/96 backdrop-blur-md pl-1.5 pr-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xl border border-slate-100 opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-10">
        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors.pin }} />
        {company.name}
      </span>
    </div>
  )
}

interface Props {
  filter: FilterCategory
  onFilterChange: (f: FilterCategory) => void
}

export default function MapView({ filter }: Props) {
  const [selected, setSelected] = useState<Company | null>(null)
  const [bannerPinned, setBannerPinned] = useState(false)
  const mapRef = useRef<any>(null)

  const mappedCompanies = companies.filter(c => c.lat != null && c.lng != null)
  const filteredCompanies = mappedCompanies.filter(c => filter === 'ALL' || c.category === filter)

  const handleMapLoad = useCallback((e: any) => {
    const map = e.target
    try {
      map.addSource('world-mask', { type: 'geojson', data: WORLD_MASK_GEOJSON })
      map.addLayer({
        id: 'world-mask-fill',
        type: 'fill',
        source: 'world-mask',
        paint: { 'fill-color': '#f0f4f8', 'fill-opacity': 0.88 },
      })
    } catch { /* already exists on remount */ }
  }, [])

  const flyTo = useCallback((company: Company) => {
    if (company.lat != null && company.lng != null) {
      mapRef.current?.flyTo({
        center: [company.lng, company.lat],
        zoom: Math.max(mapRef.current?.getZoom() ?? 5, 7),
        duration: 700,
        essential: true,
      })
    }
  }, [])

  const handleMarkerClick = useCallback((company: Company) => {
    setSelected(company)
    setBannerPinned(false)
    flyTo(company)
  }, [flyTo])

  const handleBannerClick = useCallback((company: Company) => {
    setSelected(company)
    setBannerPinned(true)
    flyTo(company)
  }, [flyTo])

  const handleMapClick = useCallback(() => {
    setSelected(null)
    setBannerPinned(false)
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
        onLoad={handleMapLoad}
        onClick={handleMapClick}
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

      {selected && (
        <CompanyCard company={selected} onClose={() => { setSelected(null); setBannerPinned(false) }} />
      )}

      <CompanyBanner
        companies={filteredCompanies}
        selected={selected}
        pinned={bannerPinned}
        onSelect={handleBannerClick}
      />
    </div>
  )
}

function CompanyBanner({
  companies: list,
  selected,
  pinned,
  onSelect,
}: {
  companies: Company[]
  selected: Company | null
  pinned: boolean
  onSelect: (c: Company) => void
}) {
  if (list.length === 0) return null

  const doubled = [...list, ...list]

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30"
      style={{
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(16px) saturate(160%)',
        WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.05)',
        paddingTop: 8,
        paddingBottom: 10,
      }}
    >
      <div className={`banner-track-wrap${pinned ? ' banner-pinned' : ''}`}>
        <div className="banner-track">
          {doubled.map((company, i) => {
            const colors = CATEGORY_COLORS[company.category]
            const isActive = selected?.id === company.id
            return (
              <button
                key={`${company.id}-${i}`}
                onClick={() => onSelect(company)}
                className={`banner-item flex items-center gap-2 rounded-2xl px-3 py-1.5 transition-all duration-200 flex-shrink-0 ${
                  isActive ? 'shadow-md scale-105' : 'hover:scale-105'
                }`}
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${colors.pin}18, ${colors.pin}0d)`
                    : 'rgba(248,250,252,0.9)',
                  border: `1.5px solid ${isActive ? colors.pin + '44' : 'rgba(0,0,0,0.06)'}`,
                  boxShadow: isActive
                    ? `0 4px 16px ${colors.pin}20`
                    : '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <CompanyLogo company={company} size={22} rounded="rounded-lg" />
                <span className="text-[12px] font-semibold text-slate-700 whitespace-nowrap max-w-[110px] truncate">
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
