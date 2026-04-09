'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { companies } from '@/data/companies'
import { FilterCategory } from '@/data/companies'
import { Company, CompanyOffice, CATEGORY_COLORS, CATEGORY_SHORT } from '@/types'
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

// HQ marker
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
        <span className="absolute rounded-full marker-pulse"
          style={{ width: sz + 10, height: sz + 10, backgroundColor: colors.pin, opacity: 0.3 }} />
      )}
      <span
        className="relative flex items-center justify-center rounded-full bg-white transition-colors duration-150"
        style={{
          width: sz, height: sz,
          border: isSelected ? `2px solid rgba(0,0,0,0.2)` : `1.5px solid rgba(0,0,0,0.1)`,
        }}
      >
        {attempt < 2 && src ? (
          <img src={src} alt="" key={attempt} className="w-full h-full object-contain" onError={handleError}
            style={{ padding: sz > 28 ? 3 : 2, overflow: 'hidden', borderRadius: '50%' }} />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[8px] font-black text-white rounded-full"
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

// Satellite office marker — smaller dot with logo
function OfficeMarker({ company, office, isSelected }: { company: Company; office: CompanyOffice; isSelected: boolean }) {
  const colors = CATEGORY_COLORS[company.category]
  const short = CATEGORY_SHORT[company.category]
  const [attempt, setAttempt] = useState(0)
  const domain = (() => { try { return new URL(company.website).hostname.replace(/^www\./, '') } catch { return '' } })()
  const src = attempt === 0 ? `/logos/${company.id}.png` : attempt === 1 ? `https://logo.clearbit.com/${domain}` : null
  const handleError = () => { if (attempt === 0 && domain) setAttempt(1); else setAttempt(2) }
  const sz = 20

  return (
    <div className="group relative flex items-center justify-center cursor-pointer">
      <span
        className="relative flex items-center justify-center rounded-full bg-white transition-colors duration-150"
        style={{
          width: sz, height: sz,
          border: `1.5px dashed ${isSelected ? colors.pin : 'rgba(0,0,0,0.18)'}`,
          opacity: isSelected ? 1 : 0.78,
        }}
      >
        {attempt < 2 && src ? (
          <img src={src} alt="" key={attempt} className="w-full h-full object-contain rounded-full" onError={handleError}
            style={{ padding: 2 }} />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[6px] font-black text-white rounded-full"
            style={{ backgroundColor: colors.pin }}>
            {short}
          </span>
        )}
      </span>
      <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-white/96 backdrop-blur-md pl-1.5 pr-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-xl border border-slate-100 opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-10">
        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors.pin }} />
        {company.name}
        {office.label && <span className="text-slate-400 font-normal ml-0.5">· {office.city}</span>}
      </span>
    </div>
  )
}

// When multiple markers share the exact same coordinates, offset them in a small circle
function jitterMarkers(list: Company[]): Array<{ company: Company; lat: number; lng: number }> {
  const groups: Record<string, Company[]> = {}
  for (const c of list) {
    const key = `${c.lat?.toFixed(5)},${c.lng?.toFixed(5)}`
    if (!groups[key]) groups[key] = []
    groups[key].push(c)
  }
  const out: Array<{ company: Company; lat: number; lng: number }> = []
  for (const group of Object.values(groups)) {
    if (group.length === 1) {
      out.push({ company: group[0], lat: group[0].lat!, lng: group[0].lng! })
    } else {
      const baseLat = group[0].lat!
      const baseLng = group[0].lng!
      const r = 0.00042 // ~45m radius
      const cosLat = Math.cos(baseLat * Math.PI / 180)
      group.forEach((c, i) => {
        const angle = (2 * Math.PI * i) / group.length - Math.PI / 2
        out.push({
          company: c,
          lat: baseLat + r * Math.sin(angle),
          lng: baseLng + (r / cosLat) * Math.cos(angle),
        })
      })
    }
  }
  return out
}

interface Props {
  filter: FilterCategory
  onFilterChange: (f: FilterCategory) => void
  onRegisterFlyTo?: (fn: (lat: number, lng: number, zoom: number) => void) => void
}

export default function MapView({ filter, onRegisterFlyTo }: Props) {
  const [selected, setSelected] = useState<Company | null>(null)
  const [bannerPinned, setBannerPinned] = useState(false)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    onRegisterFlyTo?.((lat, lng, zoom) => {
      mapRef.current?.flyTo({ center: [lng, lat], zoom, duration: 900, essential: true })
    })
  }, [onRegisterFlyTo])

  const mappedCompanies = companies.filter(c => c.lat != null && c.lng != null)
  const filteredCompanies = mappedCompanies.filter(c => filter === 'ALL' || c.category === filter)
  const jitteredFiltered = jitterMarkers(filteredCompanies)

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

  const flyTo = useCallback((lat: number, lng: number) => {
    mapRef.current?.flyTo({
      center: [lng, lat],
      zoom: 15,   // ~500m street-level view
      duration: 900,
      essential: true,
    })
  }, [])

  const handleMarkerClick = useCallback((company: Company) => {
    setSelected(company)
    setBannerPinned(false)
    if (company.lat != null && company.lng != null) flyTo(company.lat, company.lng)
  }, [flyTo])

  const handleOfficeClick = useCallback((company: Company, office: CompanyOffice) => {
    setSelected(company)
    setBannerPinned(false)
    flyTo(office.lat, office.lng)
  }, [flyTo])

  const handleBannerClick = useCallback((company: Company) => {
    setSelected(company)
    setBannerPinned(true)
    if (company.lat != null && company.lng != null) flyTo(company.lat, company.lng)
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

        {/* HQ markers */}
        {jitteredFiltered.map(({ company, lat, lng }) => (
          <Marker
            key={company.id}
            longitude={lng}
            latitude={lat}
            anchor="center"
            onClick={(e) => { e.originalEvent.stopPropagation(); handleMarkerClick(company) }}
          >
            <LogoMarker company={company} isSelected={selected?.id === company.id} />
          </Marker>
        ))}

        {/* Satellite office markers */}
        {filteredCompanies.flatMap((company) =>
          (company.offices ?? []).map((office, i) => (
            <Marker
              key={`${company.id}-office-${i}`}
              longitude={office.lng}
              latitude={office.lat}
              anchor="center"
              onClick={(e) => { e.originalEvent.stopPropagation(); handleOfficeClick(company, office) }}
            >
              <OfficeMarker company={company} office={office} isSelected={selected?.id === company.id} />
            </Marker>
          ))
        )}
      </Map>

      {selected && (
        <CompanyCard company={selected} onClose={() => { setSelected(null); setBannerPinned(false) }} />
      )}

      {/* Banner always shows ALL mapped companies for consistent scroll speed */}
      <CompanyBanner
        companies={mappedCompanies}
        filteredIds={new Set(filteredCompanies.map(c => c.id))}
        selected={selected}
        pinned={bannerPinned}
        onSelect={handleBannerClick}
      />
    </div>
  )
}

function CompanyBanner({
  companies: list,
  filteredIds,
  selected,
  pinned,
  onSelect,
}: {
  companies: Company[]
  filteredIds: Set<string>
  selected: Company | null
  pinned: boolean
  onSelect: (c: Company) => void
}) {
  if (list.length === 0) return null

  const doubled = [...list, ...list]
  // Fixed duration based on total list so speed never changes with filter
  const duration = Math.max(120, list.length * 3)

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
        <div className="banner-track" style={{ animationDuration: `${duration}s` }}>
          {doubled.map((company, i) => {
            const isActive = selected?.id === company.id
            const isFiltered = filteredIds.has(company.id)
            return (
              <button
                key={`${company.id}-${i}`}
                onClick={() => onSelect(company)}
                className="banner-item flex items-center gap-2 rounded-2xl px-3 py-1.5 transition-all duration-200 flex-shrink-0"
                style={{
                  background: isActive ? 'rgba(226,232,240,1)' : 'rgba(248,250,252,0.9)',
                  border: `1.5px solid ${isActive ? 'rgba(0,0,0,0.14)' : 'rgba(0,0,0,0.06)'}`,
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.07)' : '0 1px 3px rgba(0,0,0,0.04)',
                  opacity: filteredIds.size < list.length && !isFiltered ? 0.35 : 1,
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
