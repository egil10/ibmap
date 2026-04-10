'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { companies, FilterCategory } from '@/data/companies'
import { Company, CompanyOffice, CATEGORY_COLORS, CATEGORY_SHORT, MapStyleKey, MAP_STYLES } from '@/types'
import type { ActiveFilters } from '@/app/page'
import CompanyCard from '@/components/ui/CompanyCard'
import CompanyLogo from '@/components/ui/CompanyLogo'

const INITIAL_VIEW = { longitude: 6.5, latitude: 64.4, zoom: 3.1 }
const MAX_BOUNDS: [[number, number], [number, number]] = [[-36, 33], [52, 77]]
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
        : attempt === 3
          ? '/logos/_placeholder.svg'
          : null
  const handleError = () => {
    if (attempt === 0 && domain) setAttempt(1)
    else if (attempt === 1 && domain) setAttempt(2)
    else if (attempt === 2) setAttempt(3)
    else setAttempt(4)
  }
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
        className="relative flex items-center justify-center rounded-full bg-white transition-colors duration-150"
        style={{
          width: sz,
          height: sz,
          border: isSelected ? '2px solid rgba(0,0,0,0.2)' : '1.5px solid rgba(0,0,0,0.1)',
        }}
      >
        {attempt < 4 && src ? (
          <img
            src={src}
            alt=""
            key={attempt}
            className="w-full h-full object-contain"
            onError={handleError}
            style={{ padding: sz > 28 ? 3 : 2, overflow: 'hidden', borderRadius: '50%' }}
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center rounded-full text-[8px] font-black text-white"
            style={{ backgroundColor: colors.pin }}
          >
            {short}
          </span>
        )}
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
        : attempt === 3
          ? '/logos/_placeholder.svg'
          : null
  const handleError = () => {
    if (attempt === 0 && domain) setAttempt(1)
    else if (attempt === 1 && domain) setAttempt(2)
    else if (attempt === 2) setAttempt(3)
    else setAttempt(4)
  }
  const sz = 20

  const tooltipBg = darkMode ? 'rgba(0,0,0,0.96)' : 'rgba(255,255,255,0.96)'
  const tooltipText = darkMode ? '#f1f5f9' : '#334155'
  const tooltipBdr = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'

  return (
    <div className="group relative flex items-center justify-center cursor-pointer">
      <span
        className="relative flex items-center justify-center rounded-full bg-white transition-colors duration-150"
        style={{
          width: sz,
          height: sz,
          border: `1.5px dashed ${isSelected ? MARKER_ACCENT : 'rgba(0,0,0,0.18)'}`,
          opacity: isSelected ? 1 : 0.78,
        }}
      >
        {attempt < 4 && src ? (
          <img
            src={src}
            alt=""
            key={attempt}
            className="h-full w-full rounded-full object-contain"
            onError={handleError}
            style={{ padding: 2 }}
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center rounded-full text-[6px] font-black text-white"
            style={{ backgroundColor: colors.pin }}
          >
            {short}
          </span>
        )}
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
}

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
  const mapRef = useRef<any>(null)
  const lastAutoFitKeyRef = useRef<string | null>(null)

  const activeVariant = MAP_STYLES[mapStyleKey][darkMode ? 'dark' : 'light']

  useEffect(() => {
    onRegisterFlyTo?.((lat, lng, zoom) => {
      mapRef.current?.flyTo({ center: [lng, lat], zoom, duration: 900, essential: true })
    })
  }, [onRegisterFlyTo])

  const mappedCompanies = companies.filter(company => company.lat != null && company.lng != null)
  const filteredCompanies = mappedCompanies.filter(company =>
    (filters.category === 'ALL' || company.category === filters.category) &&
    (!filters.country || company.country === filters.country) &&
    (!filters.city || company.city === filters.city)
  )
  const jitteredFiltered = jitterMarkers(filteredCompanies)
  const navigationAnchor = filteredCompanies.find(company => company.id === navigationAnchorId) ?? selected
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

    const points = filteredCompanies
      .filter(company => company.lat != null && company.lng != null)
      .map(company => [company.lng as number, company.lat as number] as [number, number])

    if (points.length === 0) return
    if (points.length === 1) {
      mapRef.current?.flyTo({
        center: points[0],
        zoom: 6,
        duration: 900,
        essential: true,
      })
      return
    }

    let minLng = points[0][0]
    let maxLng = points[0][0]
    let minLat = points[0][1]
    let maxLat = points[0][1]

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

  const handleMapClick = useCallback(() => {
    setSelected(null)
    setNavigationAnchorId(null)
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
        onClick={handleMapClick}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {jitteredFiltered.map(({ company, lat, lng }) => (
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

        {showOffices && filteredCompanies.flatMap((company) =>
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
      </Map>

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

  const doubled = [...list, ...list]
  const duration = Math.max(60, list.length * 3)

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
}
