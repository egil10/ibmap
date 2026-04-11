'use client'

import { useState, useCallback, useRef, useEffect, useMemo, memo, startTransition } from 'react'
import MapGL, { Marker, NavigationControl, Source, Layer } from 'react-map-gl/maplibre'
import type { MapLayerMouseEvent, GeoJSONSource as GeoJSONSourceType } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { companies } from '@/data/companies'
import { Company, CompanyOffice, MapStyleKey, MAP_STYLES, CATEGORY_COLORS } from '@/types'
import type { ActiveFilters } from '@/app/page'
import CompanyCard from '@/components/ui/CompanyCard'
import CompanyLogo from '@/components/ui/CompanyLogo'

const INITIAL_VIEW = { longitude: 6.5, latitude: 64.4, zoom: 3.1 }
const MAX_BOUNDS: [[number, number], [number, number]] = [[-36, 33], [52, 77]]
const MARKER_ACCENT = '#94a3b8'

/* ────────────────────────── Cluster zoom threshold ────────────────────────── */
const CLUSTER_ZOOM = 9 // below this, we show clusters; above, individual markers

/* ────────────────────────── Performance constants ────────────────────────── */
const MARKER_BATCH_SIZE = 40      // render markers in batches
const MARKER_BATCH_DELAY = 80     // ms between batches
const VIEWPORT_PAD = 0.02         // extra lat/lng padding for viewport culling
const MAX_VISIBLE_MARKERS = 200   // absolute cap on simultaneous DOM markers
const MOVE_DEBOUNCE_MS = 120      // debounce move/zoom events

/* ────────────────────────── Logo Marker (DOM — only for visible pins at zoom ≥ CLUSTER_ZOOM) ── */
const LogoMarker = memo(function LogoMarker({ company, isSelected, darkMode }: { company: Company; isSelected: boolean; darkMode: boolean }) {
  const sz = isSelected ? 34 : 26
  const tooltipBg = darkMode ? 'rgba(0,0,0,0.96)' : 'rgba(255,255,255,0.96)'
  const tooltipText = darkMode ? '#f1f5f9' : '#334155'
  const tooltipBdr = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'

  return (
    <div className="group relative flex items-center justify-center cursor-pointer">
      {isSelected && (
        <span
          className="absolute rounded-full marker-pulse"
          style={{ width: sz + 10, height: sz + 10, backgroundColor: MARKER_ACCENT, opacity: 0.3 }}
        />
      )}
      <span
        className="relative flex items-center justify-center rounded-full bg-white overflow-hidden"
        style={{
          width: sz,
          height: sz,
          border: isSelected ? '2px solid rgba(0,0,0,0.2)' : '1.5px solid rgba(0,0,0,0.1)',
        }}
      >
        <CompanyLogo company={company} size={sz} rounded="rounded-full" />
      </span>
      <span
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-xl border px-2.5 py-1 text-[11px] font-semibold opacity-0 shadow-xl backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100"
        style={{ background: tooltipBg, color: tooltipText, borderColor: tooltipBdr }}
      >
        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: MARKER_ACCENT }} />
        {company.name}
      </span>
    </div>
  )
})

const OfficeMarker = memo(function OfficeMarker({ company, office, isSelected, darkMode }: { company: Company; office: CompanyOffice; isSelected: boolean; darkMode: boolean }) {
  const sz = 20
  const tooltipBg = darkMode ? 'rgba(0,0,0,0.96)' : 'rgba(255,255,255,0.96)'
  const tooltipText = darkMode ? '#f1f5f9' : '#334155'
  const tooltipBdr = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'

  return (
    <div className="group relative flex items-center justify-center cursor-pointer">
      <span
        className="relative flex items-center justify-center rounded-full bg-white overflow-hidden"
        style={{
          width: sz,
          height: sz,
          border: `1.5px dashed ${isSelected ? MARKER_ACCENT : 'rgba(0,0,0,0.18)'}`,
          opacity: isSelected ? 1 : 0.78,
        }}
      >
        <CompanyLogo company={company} size={sz} rounded="rounded-full" />
      </span>
      <span
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-xl border px-2.5 py-1 text-[11px] font-semibold opacity-0 shadow-xl backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100"
        style={{ background: tooltipBg, color: tooltipText, borderColor: tooltipBdr }}
      >
        <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: MARKER_ACCENT }} />
        {company.name}
        {office.label && <span className="ml-0.5 font-normal" style={{ color: MARKER_ACCENT }}>· {office.city}</span>}
      </span>
    </div>
  )
})

/* ────────────────────────── Jitter logic (only for visible markers) ────────────────────────── */
function jitterMarkers(list: Company[]): Array<{ company: Company; lat: number; lng: number }> {
  const groups: Record<string, Company[]> = {}
  for (const company of list) {
    const key = `${company.lat?.toFixed(5)},${company.lng?.toFixed(5)}`
    if (!groups[key]) groups[key] = []
    groups[key].push(company)
  }

  const out: Array<{ company: Company; lat: number; lng: number }> = []
  for (const group of Object.values(groups)) {
    if (group.length === 1) {
      out.push({ company: group[0], lat: group[0].lat!, lng: group[0].lng! })
      continue
    }

    const baseLat = group[0].lat!
    const baseLng = group[0].lng!
    const radius = 0.00042
    const cosLat = Math.cos(baseLat * Math.PI / 180)
    group.forEach((company, index) => {
      const angle = (2 * Math.PI * index) / group.length - Math.PI / 2
      out.push({
        company,
        lat: baseLat + radius * Math.sin(angle),
        lng: baseLng + (radius / cosLat) * Math.cos(angle),
      })
    })
  }

  return out
}

/* ────────────────────────── Navigation helpers ────────────────────────── */
function compareByLocation(a: Company, b: Company) {
  return a.country.localeCompare(b.country) || a.city.localeCompare(b.city) || a.name.localeCompare(b.name)
}

function buildNavigationSequence(anchor: Company | null, list: Company[]) {
  if (!anchor) return list
  if (!list.some(company => company.id === anchor.id)) return list

  const sameCity = list
    .filter(company => company.id !== anchor.id && company.country === anchor.country && company.city === anchor.city)
    .sort((a, b) => a.name.localeCompare(b.name))

  const sameCountry = list
    .filter(company => company.id !== anchor.id && company.country === anchor.country && company.city !== anchor.city)
    .sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name))

  const otherCountries = list
    .filter(company => company.id !== anchor.id && company.country !== anchor.country)
    .sort(compareByLocation)

  return [anchor, ...sameCity, ...sameCountry, ...otherCountries]
}

/* ────────────────────────── GeoJSON builder ────────────────────────── */
function buildGeoJSON(list: Company[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: list.map(company => ({
      type: 'Feature' as const,
      properties: { id: company.id },
      geometry: {
        type: 'Point' as const,
        coordinates: [company.lng!, company.lat!],
      },
    })),
  }
}

/* ────────────────────────── Company lookup ────────────────────────── */
const companyById = new globalThis.Map<string, Company>(companies.map(c => [c.id, c]))

/* ────────────────────────── Props ────────────────────────── */
interface Props {
  filters: ActiveFilters
  onRegisterFlyTo?: (fn: (lat: number, lng: number, zoom: number) => void) => void
  onRegisterRandomCompany?: (fn: () => void) => void
  showOffices?: boolean
  mapStyleKey: MapStyleKey
  darkMode: boolean
}

export default function MapView({
  filters,
  onRegisterFlyTo,
  onRegisterRandomCompany,
  showOffices = false,
  mapStyleKey,
  darkMode,
}: Props) {
  const [selected, setSelected] = useState<Company | null>(null)
  const [navigationAnchorId, setNavigationAnchorId] = useState<string | null>(null)
  const [bannerPinned, setBannerPinned] = useState(false)
  const [currentZoom, setCurrentZoom] = useState(INITIAL_VIEW.zoom)
  const [viewportKey, setViewportKey] = useState(0)   // bumped on move-end to refresh culling
  const mapRef = useRef<any>(null)
  const lastAutoFitKeyRef = useRef<string | null>(null)
  const moveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const batchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const viewportRef = useRef<{ swLat: number; swLng: number; neLat: number; neLng: number } | null>(null)
  const prevShowMarkersRef = useRef(false)

  const activeVariant = MAP_STYLES[mapStyleKey][darkMode ? 'dark' : 'light']
  const showIndividualMarkers = currentZoom >= CLUSTER_ZOOM

  useEffect(() => {
    onRegisterFlyTo?.((lat, lng, zoom) => {
      mapRef.current?.flyTo({ center: [lng, lat], zoom, duration: 900, essential: true })
    })
  }, [onRegisterFlyTo])

  const filteredCompanies = useMemo(() =>
    companies.filter(company =>
      company.lat != null && company.lng != null &&
      (filters.category === 'ALL' || company.category === filters.category) &&
      (!filters.country || company.country === filters.country) &&
      (!filters.city || company.city === filters.city)
    ),
    [filters]
  )

  /* GeoJSON for the clustered source */
  const geojsonData = useMemo(() => buildGeoJSON(filteredCompanies), [filteredCompanies])

  /* Only jitter when zoomed in enough to show individual markers */
  const jitteredFiltered = useMemo(
    () => showIndividualMarkers ? jitterMarkers(filteredCompanies) : [],
    [filteredCompanies, showIndividualMarkers]
  )

  /* Update viewport bounds ref (non-reactive, avoids re-render) */
  const updateViewport = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    const bounds = map.getBounds()
    if (!bounds) return
    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()
    viewportRef.current = {
      swLat: sw.lat - VIEWPORT_PAD,
      swLng: sw.lng - VIEWPORT_PAD,
      neLat: ne.lat + VIEWPORT_PAD,
      neLng: ne.lng + VIEWPORT_PAD,
    }
  }, [])

  /* Viewport-culled markers — stays stable during movement, refreshes on move-end */
  const visibleMarkers = useMemo(() => {
    if (!showIndividualMarkers) return []
    const vp = viewportRef.current
    if (!vp) return jitteredFiltered.slice(0, MAX_VISIBLE_MARKERS)
    return jitteredFiltered
      .filter(({ lat, lng }) =>
        lat >= vp.swLat && lat <= vp.neLat && lng >= vp.swLng && lng <= vp.neLng
      )
      .slice(0, MAX_VISIBLE_MARKERS)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jitteredFiltered, showIndividualMarkers, viewportKey])

  /* Progressive reveal only on initial zoom-in transition (cluster → markers) */
  const [revealedCount, setRevealedCount] = useState(MAX_VISIBLE_MARKERS)

  useEffect(() => {
    const wasShowingMarkers = prevShowMarkersRef.current
    prevShowMarkersRef.current = showIndividualMarkers

    // Only batch-reveal when transitioning from clusters → individual markers
    if (showIndividualMarkers && !wasShowingMarkers && visibleMarkers.length > MARKER_BATCH_SIZE) {
      if (batchTimerRef.current) clearTimeout(batchTimerRef.current)
      setRevealedCount(MARKER_BATCH_SIZE)

      let shown = MARKER_BATCH_SIZE
      const revealNext = () => {
        if (shown >= visibleMarkers.length) return
        shown = Math.min(shown + MARKER_BATCH_SIZE, visibleMarkers.length)
        startTransition(() => setRevealedCount(shown))
        if (shown < visibleMarkers.length) {
          batchTimerRef.current = setTimeout(revealNext, MARKER_BATCH_DELAY)
        }
      }
      batchTimerRef.current = setTimeout(revealNext, MARKER_BATCH_DELAY)
    } else if (showIndividualMarkers) {
      // Already showing markers, just make sure everything is revealed
      setRevealedCount(MAX_VISIBLE_MARKERS)
    }

    return () => { if (batchTimerRef.current) clearTimeout(batchTimerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showIndividualMarkers])

  /* Final marker list (progressive reveal cap only matters during initial transition) */
  const renderedMarkers = useMemo(
    () => visibleMarkers.slice(0, revealedCount),
    [visibleMarkers, revealedCount]
  )

  const navigationAnchor = useMemo(
    () => filteredCompanies.find(company => company.id === navigationAnchorId) ?? selected,
    [filteredCompanies, navigationAnchorId, selected]
  )

  const navigationCompanies = useMemo(
    () => buildNavigationSequence(navigationAnchor, filteredCompanies),
    [filteredCompanies, navigationAnchor]
  )

  const selectedIndex = selected ? navigationCompanies.findIndex(company => company.id === selected.id) : -1

  useEffect(() => {
    if (!mapRef.current || filteredCompanies.length === 0) return
    const filterKey = JSON.stringify(filters)
    if (lastAutoFitKeyRef.current === filterKey) return

    lastAutoFitKeyRef.current = filterKey

    if (filters.category === 'ALL' && !filters.country && !filters.city) {
      mapRef.current?.flyTo({
        center: [INITIAL_VIEW.longitude, INITIAL_VIEW.latitude],
        zoom: INITIAL_VIEW.zoom,
        duration: 900,
        essential: true,
      })
      return
    }

    const points = filteredCompanies.map(company => [company.lng as number, company.lat as number] as [number, number])

    if (points.length === 0) return
    if (points.length === 1) {
      mapRef.current?.flyTo({ center: points[0], zoom: 6, duration: 900, essential: true })
      return
    }

    let minLng = points[0][0], maxLng = points[0][0]
    let minLat = points[0][1], maxLat = points[0][1]
    for (const [lng, lat] of points) {
      minLng = Math.min(minLng, lng)
      maxLng = Math.max(maxLng, lng)
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
    }

    mapRef.current?.fitBounds(
      [[minLng, minLat], [maxLng, maxLat]],
      { padding: { top: 110, right: 60, bottom: 120, left: 60 }, duration: 900, essential: true, maxZoom: 6.2 }
    )
  }, [filters, filteredCompanies])

  const flyTo = useCallback((lat: number, lng: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 15, duration: 900, essential: true })
  }, [])

  const selectCompany = useCallback((company: Company, pinned = false, resetNavigationAnchor = false) => {
    setSelected(company)
    if (resetNavigationAnchor) setNavigationAnchorId(company.id)
    setBannerPinned(pinned)
    if (company.lat != null && company.lng != null) flyTo(company.lat, company.lng)
  }, [flyTo])

  const selectRelativeCompany = useCallback((direction: 1 | -1) => {
    if (navigationCompanies.length === 0) return
    const startIndex = selectedIndex >= 0 ? selectedIndex : 0
    const nextIndex = (startIndex + direction + navigationCompanies.length) % navigationCompanies.length
    selectCompany(navigationCompanies[nextIndex], false, false)
  }, [navigationCompanies, selectCompany, selectedIndex])

  const selectRandomCompany = useCallback(() => {
    if (filteredCompanies.length === 0) return
    if (filteredCompanies.length === 1) {
      selectCompany(filteredCompanies[0])
      return
    }
    let nextCompany = filteredCompanies[Math.floor(Math.random() * filteredCompanies.length)]
    if (selected && nextCompany.id === selected.id) {
      const currentIndex = filteredCompanies.findIndex(company => company.id === selected.id)
      nextCompany = filteredCompanies[(currentIndex + 1) % filteredCompanies.length]
    }
    selectCompany(nextCompany, false, true)
  }, [filteredCompanies, selectCompany, selected])

  useEffect(() => {
    onRegisterRandomCompany?.(selectRandomCompany)
  }, [onRegisterRandomCompany, selectRandomCompany])

  const handleMarkerClick = useCallback((company: Company) => {
    selectCompany(company, false, true)
  }, [selectCompany])

  const handleOfficeClick = useCallback((company: Company, office: CompanyOffice) => {
    setSelected(company)
    setNavigationAnchorId(company.id)
    setBannerPinned(false)
    flyTo(office.lat, office.lng)
  }, [flyTo])

  const handleBannerClick = useCallback((company: Company) => {
    selectCompany(company, true, true)
  }, [selectCompany])

  const handleMapClick = useCallback((e: MapLayerMouseEvent) => {
    // Check if a cluster was clicked
    const map = mapRef.current
    if (!map) { setSelected(null); setNavigationAnchorId(null); setBannerPinned(false); return }

    const features = map.queryRenderedFeatures(e.point, { layers: ['cluster-circles', 'unclustered-points'] })
    if (features && features.length > 0) {
      const feature = features[0]
      if (feature.properties?.cluster) {
        // Cluster click → zoom in
        const source = map.getSource('companies-src') as GeoJSONSourceType | undefined
        if (source && typeof source.getClusterExpansionZoom === 'function') {
          source.getClusterExpansionZoom(feature.properties.cluster_id).then((zoom: number) => {
            map.flyTo({
              center: (feature.geometry as GeoJSON.Point).coordinates as [number, number],
              zoom: Math.min(zoom, 16),
              duration: 500,
              essential: true,
            })
          })
        }
      } else {
        // Single unclustered point
        const id = feature.properties?.id as string
        const company = companyById.get(id)
        if (company) {
          selectCompany(company, false, true)
        }
      }
      return
    }

    setSelected(null)
    setNavigationAnchorId(null)
    setBannerPinned(false)
  }, [selectCompany])

  /* ── Debounced move/zoom handler ── */
  const handleMoveEnd = useCallback(() => {
    if (moveTimerRef.current) clearTimeout(moveTimerRef.current)
    moveTimerRef.current = setTimeout(() => {
      updateViewport()
      const z = mapRef.current?.getZoom() ?? currentZoom
      startTransition(() => {
        setCurrentZoom(z)
        setViewportKey(k => k + 1)
      })
    }, MOVE_DEBOUNCE_MS)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateViewport])

  /* Cleanup timers */
  useEffect(() => {
    return () => {
      if (moveTimerRef.current) clearTimeout(moveTimerRef.current)
      if (batchTimerRef.current) clearTimeout(batchTimerRef.current)
    }
  }, [])

  /* Cluster colors */
  const clusterBg = darkMode ? '#1e293b' : '#ffffff'
  const clusterBorder = darkMode ? '#475569' : '#94a3b8'
  const clusterText = darkMode ? '#e2e8f0' : '#334155'
  const dotColor = darkMode ? '#64748b' : '#94a3b8'

  return (
    <div className="absolute inset-0 top-0">
      <MapGL
        ref={mapRef}
        initialViewState={INITIAL_VIEW}
        style={{ width: '100%', height: '100%' }}
        mapStyle={activeVariant.url}
        attributionControl={false}
        renderWorldCopies={false}
        maxBounds={MAX_BOUNDS}
        reuseMaps
        onClick={handleMapClick}
        onMoveEnd={handleMoveEnd}
        interactiveLayerIds={['cluster-circles', 'unclustered-points']}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {/* ── Clustered GeoJSON source (GPU-rendered circles when zoomed out) ── */}
        <Source
          id="companies-src"
          type="geojson"
          data={geojsonData}
          cluster={true}
          clusterMaxZoom={CLUSTER_ZOOM - 1}
          clusterRadius={50}
        >
          {/* Cluster circles */}
          <Layer
            id="cluster-circles"
            type="circle"
            filter={['has', 'point_count']}
            paint={{
              'circle-color': clusterBg,
              'circle-radius': ['step', ['get', 'point_count'], 18, 10, 22, 50, 28, 100, 34],
              'circle-stroke-width': 2,
              'circle-stroke-color': clusterBorder,
              'circle-opacity': 0.92,
            }}
          />
          {/* Cluster count labels */}
          <Layer
            id="cluster-count"
            type="symbol"
            filter={['has', 'point_count']}
            layout={{
              'text-field': '{point_count_abbreviated}',
              'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
              'text-size': 12,
              'text-allow-overlap': true,
            }}
            paint={{
              'text-color': clusterText,
            }}
          />
          {/* Unclustered points (small dots when zoomed out, hidden when we show logo markers) */}
          <Layer
            id="unclustered-points"
            type="circle"
            filter={['!', ['has', 'point_count']]}
            paint={{
              'circle-color': dotColor,
              'circle-radius': showIndividualMarkers ? 0 : 5,
              'circle-stroke-width': showIndividualMarkers ? 0 : 1.5,
              'circle-stroke-color': clusterBg,
              'circle-opacity': showIndividualMarkers ? 0 : 0.8,
            }}
          />
        </Source>

        {/* ── Individual logo markers (only when zoomed in past CLUSTER_ZOOM) ── */}
        {showIndividualMarkers && renderedMarkers.map(({ company, lat, lng }) => (
          <Marker
            key={company.id}
            longitude={lng}
            latitude={lat}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              handleMarkerClick(company)
            }}
          >
            <LogoMarker company={company} isSelected={selected?.id === company.id} darkMode={darkMode} />
          </Marker>
        ))}

        {showOffices && showIndividualMarkers && filteredCompanies.flatMap((company) =>
          (company.offices ?? []).map((office, index) => (
            <Marker
              key={`${company.id}-office-${index}`}
              longitude={office.lng}
              latitude={office.lat}
              anchor="center"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                handleOfficeClick(company, office)
              }}
            >
              <OfficeMarker company={company} office={office} isSelected={selected?.id === company.id} darkMode={darkMode} />
            </Marker>
          ))
        )}
      </MapGL>

      {selected && (
        <CompanyCard
          company={selected}
          onClose={() => {
            setSelected(null)
            setBannerPinned(false)
          }}
          darkMode={darkMode}
          onPrevious={navigationCompanies.length > 1 ? () => selectRelativeCompany(-1) : undefined}
          onNext={navigationCompanies.length > 1 ? () => selectRelativeCompany(1) : undefined}
          onRandom={filteredCompanies.length > 0 ? selectRandomCompany : undefined}
          navigationLabel={selectedIndex >= 0 ? `${selectedIndex + 1} / ${navigationCompanies.length}` : undefined}
        />
      )}

      <div className="hidden md:block">
        <CompanyBanner
          companies={filteredCompanies}
          selected={selected}
          pinned={bannerPinned}
          onSelect={handleBannerClick}
          darkMode={darkMode}
        />
      </div>
    </div>
  )
}

/* ────────────────────────── Scrolling banner (virtualized) ────────────────────────── */
const CompanyBanner = memo(function CompanyBanner({
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

  /* Only duplicate if we have enough to scroll. For very large lists, cap at 80 items total. */
  const cappedList = list.length > 40 ? list.slice(0, 40) : list
  const doubled = useMemo(() => [...cappedList, ...cappedList], [cappedList])
  const duration = Math.max(60, cappedList.length * 3)

  const bannerBg = darkMode ? 'rgba(0,0,0,0.94)' : 'rgba(255,255,255,0.94)'
  const bannerBdr = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const textColor = darkMode ? '#cbd5e1' : '#334155'
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
          {doubled.map((company, index) => {
            const isActive = selected?.id === company.id
            return (
              <button
                key={`${company.id}-${index}`}
                onClick={() => onSelect(company)}
                className="banner-item flex flex-shrink-0 items-center gap-2 px-3 py-1.5 transition-all duration-200"
                style={{ background: isActive ? activeItemBg : 'transparent' }}
              >
                <CompanyLogo company={company} size={22} rounded="rounded-lg" />
                <span className="whitespace-nowrap text-[12px] font-semibold" style={{ color: textColor }}>
                  {company.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
})
