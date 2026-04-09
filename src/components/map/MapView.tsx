'use client'

import { useState, useCallback, useRef } from 'react'
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { companies } from '@/data/companies'
import { Company, CATEGORY_COLORS } from '@/types'
import { FilterCategory } from '@/data/companies'
import CompanyCard from '@/components/ui/CompanyCard'
import FilterBar from '@/components/ui/FilterBar'
import Header from '@/components/layout/Header'

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron'

const INITIAL_VIEW = {
  longitude: 15.0,
  latitude: 65.0,
  zoom: 4.4,
}

// Constrain panning to the Nordic region — prevents the world from repeating
// without pins and stops users ending up in the Pacific Ocean.
const MAX_BOUNDS: [[number, number], [number, number]] = [
  [-15, 52],  // SW: roughly Iceland SW corner / Danish border
  [40, 72],   // NE: Finnish/Russian border / top of Norway
]

export default function MapView() {
  const [selected, setSelected] = useState<Company | null>(null)
  const [filter, setFilter] = useState<FilterCategory>('ALL')
  const [search, setSearch] = useState('')
  const mapRef = useRef<any>(null)

  const filteredCompanies = companies.filter((c) => {
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
    mapRef.current?.flyTo({
      center: [company.lng, company.lat],
      zoom: Math.max(mapRef.current?.getZoom() ?? 5, 6),
      duration: 600,
      essential: true,
    })
  }, [])

  const handleClose = useCallback(() => setSelected(null), [])

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Map */}
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE}
        attributionControl={false}
        renderWorldCopies={false}
        maxBounds={MAX_BOUNDS}
        reuseMaps
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {filteredCompanies.map((company) => {
          const colors = CATEGORY_COLORS[company.category]
          const isSelected = selected?.id === company.id

          return (
            <Marker
              key={company.id}
              longitude={company.lng}
              latitude={company.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                handleMarkerClick(company)
              }}
            >
              <button
                className="group relative flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-125 focus:outline-none"
                aria-label={company.name}
              >
                {/* Pulse ring on selected */}
                {isSelected && (
                  <span
                    className="absolute inline-flex h-7 w-7 rounded-full opacity-60 marker-pulse"
                    style={{ backgroundColor: colors.pin }}
                  />
                )}
                {/* Main dot */}
                <span
                  className="relative inline-flex h-3.5 w-3.5 rounded-full shadow-md transition-all duration-200 group-hover:h-4 group-hover:w-4"
                  style={{
                    backgroundColor: colors.pin,
                    boxShadow: `0 2px 8px ${colors.pin}66`,
                    transform: isSelected ? 'scale(1.5)' : undefined,
                  }}
                />
                {/* Label on hover */}
                <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-white/95 backdrop-blur-sm pl-1.5 pr-2.5 py-1 text-xs font-semibold text-slate-700 shadow-lg border border-white/80 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <img
                    src={`https://logo.clearbit.com/${company.website.replace(/https?:\/\/(www\.)?/, '').split('/')[0]}`}
                    alt=""
                    className="h-4 w-4 rounded-sm object-contain bg-white"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                  />
                  {company.name}
                </span>
              </button>
            </Marker>
          )
        })}
      </Map>

      {/* Floating Header */}
      <Header
        search={search}
        onSearch={setSearch}
        totalCount={companies.length}
        filteredCount={filteredCompanies.length}
      />

      {/* Company Detail Card */}
      {selected && (
        <CompanyCard company={selected} onClose={handleClose} />
      )}

      {/* Filter Bar */}
      <FilterBar activeFilter={filter} onFilterChange={setFilter} />
    </div>
  )
}
