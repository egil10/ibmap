'use client'

import { useState, useCallback, useRef } from 'react'
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { companies } from '@/data/companies'
import { FilterCategory } from '@/data/companies'
import { Company, CATEGORY_COLORS, CATEGORY_SHORT } from '@/types'
import CompanyCard from '@/components/ui/CompanyCard'

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron'

const INITIAL_VIEW = { longitude: 14.0, latitude: 64.5, zoom: 4.2 }

const MAX_BOUNDS: [[number, number], [number, number]] = [
  [-18, 50],
  [42, 73],
]

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') } catch { return '' }
}

function LogoMarker({ company, isSelected }: { company: Company; isSelected: boolean }) {
  const colors = CATEGORY_COLORS[company.category]
  const domain = getDomain(company.website)
  const short = CATEGORY_SHORT[company.category]
  const [imgErr, setImgErr] = useState(false)

  return (
    <div className="group relative flex items-center justify-center cursor-pointer">
      {/* Pulse ring when selected */}
      {isSelected && (
        <span
          className="absolute rounded-full marker-pulse"
          style={{ width: 36, height: 36, backgroundColor: colors.pin, opacity: 0.35 }}
        />
      )}

      {/* Logo/badge circle */}
      <span
        className="relative flex items-center justify-center overflow-hidden rounded-full bg-white transition-all duration-200 group-hover:scale-125"
        style={{
          width: isSelected ? 32 : 26,
          height: isSelected ? 32 : 26,
          border: `2.5px solid ${colors.pin}`,
          boxShadow: `0 2px 10px ${colors.pin}44, 0 1px 3px rgba(0,0,0,0.12)`,
        }}
      >
        {domain && !imgErr ? (
          <img
            src={`https://logo.clearbit.com/${domain}`}
            alt=""
            className="h-full w-full object-contain p-0.5"
            onError={() => setImgErr(true)}
          />
        ) : (
          <span
            className="text-[8px] font-black tracking-tight text-white"
            style={{ backgroundColor: colors.pin, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {short}
          </span>
        )}
      </span>

      {/* Hover name tooltip */}
      <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-white/95 backdrop-blur-md pl-1.5 pr-2.5 py-1 text-xs font-semibold text-slate-700 shadow-xl border border-white/80 opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-10">
        {domain && !imgErr ? (
          <img
            src={`https://logo.clearbit.com/${domain}`}
            alt=""
            className="h-3.5 w-3.5 rounded object-contain bg-white"
          />
        ) : (
          <span className="h-3.5 w-3.5 rounded flex items-center justify-center text-[7px] font-black text-white" style={{ backgroundColor: colors.pin }}>
            {short}
          </span>
        )}
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

  // Only show companies that have verified coordinates
  const mappedCompanies = companies.filter((c) =>
    c.lat != null && c.lng != null
  )

  const filteredCompanies = mappedCompanies.filter((c) => {
    const matchesFilter = filter === 'ALL' || c.category === filter
    const matchesSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase())
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

  const handleClose = useCallback(() => setSelected(null), [])

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
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              handleMarkerClick(company)
            }}
          >
            <LogoMarker company={company} isSelected={selected?.id === company.id} />
          </Marker>
        ))}
      </Map>

      {/* Result count chip */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="glass rounded-full px-4 py-2 shadow-sm text-xs font-semibold text-slate-600">
          {filteredCompanies.length} firms on map
        </div>
      </div>

      {/* Company Detail Card */}
      {selected && (
        <CompanyCard company={selected} onClose={handleClose} />
      )}
    </div>
  )
}
