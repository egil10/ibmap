'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { companies } from '@/data/companies'
import { FilterCategory } from '@/data/companies'
import { Company, CompanyOffice, CATEGORY_COLORS, CATEGORY_SHORT, MapStyleKey, MAP_STYLES } from '@/types'
import CompanyCard from '@/components/ui/CompanyCard'
import CompanyLogo from '@/components/ui/CompanyLogo'

const INITIAL_VIEW = { longitude: 8.5, latitude: 64.2, zoom: 3.45 }
const MAX_BOUNDS: [[number, number], [number, number]] = [[-32, 34], [50, 76]]

const WORLD_MASK_GEOJSON = {
  type: 'Feature' as const,
  geometry: {
    type: 'Polygon' as const,
    coordinates: [
      [[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]],
      [[-25, 34], [-25, 75], [50, 75], [50, 34], [-25, 34]],
    ],
  },
}

const MARKER_ACCENT = '#94a3b8'

function LogoMarker({ company, isSelected, darkMode }: { company: Company; isSelected: boolean; darkMode: boolean }) {
  const colors = CATEGORY_COLORS[company.category]
  const short = CATEGORY_SHORT[company.category]
  const [attempt, setAttempt] = useState(0)
  const domain = (() => { try { return new URL(company.website).hostname.replace(/^www\./, '') } catch { return '' } })()
  const src = attempt === 0
    ? `/logos/${company.id}.png`
    : attempt === 1
      ? `https://www.google.com/s2/favicons?domain=${domain}&sz=256`
      : attempt === 2
        ? `https://logo.clearbit.com/${domain}`
        : null
  const handleError = () => { if (attempt === 0 && domain) setAttempt(1); else if (attempt === 1 && domain) setAttempt(2); else setAttempt(3) }
  const sz = isSelected ? 34 : 26

  const tooltipBg    = darkMode ? 'rgba(0,0,0,0.96)'  : 'rgba(255,255,255,0.96)'
  const tooltipText  = darkMode ? '#f1f5f9'              : '#334155'
  const tooltipBdr   = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'

  return (
    <div className="group relative flex items-center justify-center cursor-pointer">
      {isSelected && (
        <span className="absolute rounded-full marker-pulse"
          style={{ width: sz + 10, height: sz + 10, backgroundColor: MARKER_ACCENT, opacity: 0.3 }} />
      )}
      <span
        className="relative flex items-center justify-center rounded-full bg-white transition-colors duration-150"
        style={{
          width: sz, height: sz,
          border: isSelected ? `2px solid rgba(0,0,0,0.2)` : `1.5px solid rgba(0,0,0,0.1)`,
        }}
      >
        {attempt < 3 && src ? (
          <img src={src} alt="" key={attempt} className="w-full h-full object-contain" onError={handleError}
            style={{ padding: sz > 28 ? 3 : 2, overflow: 'hidden', borderRadius: '50%' }} />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[8px] font-black text-white rounded-full"
            style={{ backgroundColor: colors.pin }}>
            {short}
          </span>
        )}
      </span>
      <span
        className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-xl backdrop-blur-md pl-1.5 pr-2.5 py-1 text-[11px] font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-10"
        style={{ background: tooltipBg, color: tooltipText, border: `1px solid ${tooltipBdr}` }}
      >
        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: MARKER_ACCENT }} />
        {company.name}
      </span>
    </div>
  )
}

function OfficeMarker({ company, office, isSelected, darkMode }: { company: Company; office: CompanyOffice; isSelected: boolean; darkMode: boolean }) {
  const colors = CATEGORY_COLORS[company.category]
  const short = CATEGORY_SHORT[company.category]
  const [attempt, setAttempt] = useState(0)
  const domain = (() => { try { return new URL(company.website).hostname.replace(/^www\./, '') } catch { return '' } })()
  const src = attempt === 0
    ? `/logos/${company.id}.png`
    : attempt === 1
      ? `https://www.google.com/s2/favicons?domain=${domain}&sz=256`
      : attempt === 2
        ? `https://logo.clearbit.com/${domain}`
        : null
  const handleError = () => { if (attempt === 0 && domain) setAttempt(1); else if (attempt === 1 && domain) setAttempt(2); else setAttempt(3) }
  const sz = 20

  const tooltipBg   = darkMode ? 'rgba(0,0,0,0.96)'   : 'rgba(255,255,255,0.96)'
  const tooltipText = darkMode ? '#f1f5f9'               : '#334155'
  const tooltipBdr  = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'

  return (
    <div className="group relative flex items-center justify-center cursor-pointer">
      <span
        className="relative flex items-center justify-center rounded-full bg-white transition-colors duration-150"
        style={{
          width: sz, height: sz,
          border: `1.5px dashed ${isSelected ? MARKER_ACCENT : 'rgba(0,0,0,0.18)'}`,
          opacity: isSelected ? 1 : 0.78,
        }}
      >
        {attempt < 3 && src ? (
          <img src={src} alt="" key={attempt} className="w-full h-full object-contain rounded-full" onError={handleError}
            style={{ padding: 2 }} />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[6px] font-black text-white rounded-full"
            style={{ backgroundColor: colors.pin }}>
            {short}
          </span>
        )}
      </span>
      <span
        className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-xl backdrop-blur-md pl-1.5 pr-2.5 py-1 text-[11px] font-semibold shadow-xl opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-10"
        style={{ background: tooltipBg, color: tooltipText, border: `1px solid ${tooltipBdr}` }}
      >
        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: MARKER_ACCENT }} />
        {company.name}
        {office.label && <span style={{ color: MARKER_ACCENT }} className="font-normal ml-0.5">· {office.city}</span>}
      </span>
    </div>
  )
}

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
      const r = 0.00042
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
  showOffices?: boolean
  mapStyleKey: MapStyleKey
  darkMode: boolean
}

export default function MapView({ filter, onRegisterFlyTo, showOffices = false, mapStyleKey, darkMode }: Props) {
  const [selected, setSelected] = useState<Company | null>(null)
  const [bannerPinned, setBannerPinned] = useState(false)
  const mapRef = useRef<any>(null)

  // Derive active tile variant from style + dark mode
  const activeVariant = MAP_STYLES[mapStyleKey][darkMode ? 'dark' : 'light']

  // Keep refs current so the style.load handler always uses latest values
  const maskColorRef   = useRef(activeVariant.maskColor)
  const maskOpacityRef = useRef(activeVariant.maskOpacity)
  maskColorRef.current   = activeVariant.maskColor
  maskOpacityRef.current = activeVariant.maskOpacity

  useEffect(() => {
    onRegisterFlyTo?.((lat, lng, zoom) => {
      mapRef.current?.flyTo({ center: [lng, lat], zoom, duration: 900, essential: true })
    })
  }, [onRegisterFlyTo])

  const mappedCompanies  = companies.filter(c => c.lat != null && c.lng != null)
  const filteredCompanies = mappedCompanies.filter(c => filter === 'ALL' || c.category === filter)
  const jitteredFiltered  = jitterMarkers(filteredCompanies)

  const handleMapLoad = useCallback((e: any) => {
    const map = e.target
    const addMask = () => {
      try {
        if (!map.getSource('world-mask')) {
          map.addSource('world-mask', { type: 'geojson', data: WORLD_MASK_GEOJSON })
        }
        if (!map.getLayer('world-mask-fill')) {
          map.addLayer({
            id: 'world-mask-fill',
            type: 'fill',
            source: 'world-mask',
            paint: { 'fill-color': maskColorRef.current, 'fill-opacity': maskOpacityRef.current },
          })
        }
      } catch { /* ignore */ }
    }
    addMask()
    map.on('style.load', addMask)
  }, []) // refs used — no deps needed

  const flyTo = useCallback((lat: number, lng: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 15, duration: 900, essential: true })
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
        mapStyle={activeVariant.url}
        attributionControl={false}
        renderWorldCopies={false}
        maxBounds={MAX_BOUNDS}
        reuseMaps
        onLoad={handleMapLoad}
        onClick={handleMapClick}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {jitteredFiltered.map(({ company, lat, lng }) => (
          <Marker
            key={company.id}
            longitude={lng}
            latitude={lat}
            anchor="center"
            onClick={(e) => { e.originalEvent.stopPropagation(); handleMarkerClick(company) }}
          >
            <LogoMarker company={company} isSelected={selected?.id === company.id} darkMode={darkMode} />
          </Marker>
        ))}

        {showOffices && filteredCompanies.flatMap((company) =>
          (company.offices ?? []).map((office, i) => (
            <Marker
              key={`${company.id}-office-${i}`}
              longitude={office.lng}
              latitude={office.lat}
              anchor="center"
              onClick={(e) => { e.originalEvent.stopPropagation(); handleOfficeClick(company, office) }}
            >
              <OfficeMarker company={company} office={office} isSelected={selected?.id === company.id} darkMode={darkMode} />
            </Marker>
          ))
        )}
      </Map>

      {selected && (
        <CompanyCard company={selected} onClose={() => { setSelected(null); setBannerPinned(false) }} darkMode={darkMode} />
      )}

      <CompanyBanner
        companies={filteredCompanies}
        selected={selected}
        pinned={bannerPinned}
        onSelect={handleBannerClick}
        darkMode={darkMode}
      />
    </div>
  )
}

function CompanyBanner({
  companies: list,
  selected,
  pinned,
  onSelect,
  darkMode,
}: {
  companies: Company[]
  selected: Company | null
  pinned: boolean
  onSelect: (c: Company) => void
  darkMode: boolean
}) {
  if (list.length === 0) return null

  const doubled  = [...list, ...list]
  const duration = Math.max(60, list.length * 3)

  const bannerBg  = darkMode ? 'rgba(0,0,0,0.94)'   : 'rgba(255,255,255,0.94)'
  const bannerBdr = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const textColor = darkMode ? '#cbd5e1'               : '#334155'
  const activeItemBg = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(226,232,240,1)'

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30"
      style={{
        background: bannerBg,
        backdropFilter: 'blur(16px) saturate(160%)',
        WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        borderTop: `1px solid ${bannerBdr}`,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.05)',
        paddingTop: 8,
        paddingBottom: 10,
      }}
    >
      <div className={`banner-track-wrap${pinned ? ' banner-pinned' : ''}`}>
        <div className="banner-track" style={{ animationDuration: `${duration}s` }}>
          {doubled.map((company, i) => {
            const isActive = selected?.id === company.id
            return (
              <button
                key={`${company.id}-${i}`}
                onClick={() => onSelect(company)}
                className="banner-item flex items-center gap-2 px-3 py-1.5 transition-all duration-200 flex-shrink-0"
                style={{ background: isActive ? activeItemBg : 'transparent' }}
              >
                <CompanyLogo company={company} size={22} rounded="rounded-lg" />
                <span className="text-[12px] font-semibold whitespace-nowrap" style={{ color: textColor }}>
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
