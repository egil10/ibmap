'use client'

import dynamic from 'next/dynamic'
import { useState, useRef, useEffect } from 'react'
import { FilterCategory } from '@/data/companies'
import { MapStyleKey } from '@/types'
import Header from '@/components/layout/Header'
import CompanyTable from '@/components/ui/CompanyTable'

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => <MapLoading />,
})

/* ── Minimal branded splash screen ── */
function MapLoading() {
  const [show, setShow] = useState(false)
  useEffect(() => { setShow(true) }, [])

  return (
    <div
      className="flex h-screen w-screen items-center justify-center"
      style={{
        background: '#f0f4f8',
        transition: 'opacity 0.25s ease-out',
        opacity: show ? 1 : 0,
      }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* ── Animated pin constellation ── */}
        <div className="relative flex items-center gap-3">
          {/* Connecting lines (subtle) */}
          <svg
            width="72" height="16" viewBox="0 0 72 16"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ opacity: 0.15 }}
          >
            <line x1="12" y1="8" x2="36" y2="8" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3">
              <animate attributeName="stroke-dashoffset" from="0" to="-6" dur="1.2s" repeatCount="indefinite" />
            </line>
            <line x1="36" y1="8" x2="60" y2="8" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3">
              <animate attributeName="stroke-dashoffset" from="0" to="-6" dur="1.2s" repeatCount="indefinite" />
            </line>
          </svg>
          {/* Three map-pin dots with staggered pulse */}
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative flex items-center justify-center" style={{ width: 24, height: 24 }}>
              {/* Ping ring */}
              <span
                className="absolute rounded-full"
                style={{
                  width: 24, height: 24,
                  border: '1.5px solid #94a3b8',
                  animation: `splash-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
              {/* Core dot */}
              <span
                className="relative rounded-full"
                style={{
                  width: 8, height: 8,
                  backgroundColor: '#94a3b8',
                  animation: `splash-dot 1.8s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            </div>
          ))}
        </div>

        <p
          className="text-[12px] font-black uppercase tracking-[0.2em]"
          style={{ color: '#94a3b8' }}
        >
          Kapitalkart
        </p>
      </div>
    </div>
  )
}

export type AppView = 'map' | 'companies'
export interface ActiveFilters {
  category: FilterCategory
  country: string | null
  city: string | null
}

export default function Home() {
  const [view, setView] = useState<AppView>('map')
  const [filters, setFilters] = useState<ActiveFilters>({ category: 'ALL', country: null, city: null })
  const [showOffices, setShowOffices] = useState(false)
  const [mapStyleKey, setMapStyleKey] = useState<MapStyleKey>('minimal')
  const [darkMode, setDarkMode] = useState(false)
  const flyToRef = useRef<((lat: number, lng: number, zoom: number) => void) | undefined>(undefined)
  const pendingFlyToRef = useRef<{ lat: number; lng: number; zoom: number } | null>(null)
  const randomCompanyRef = useRef<(() => void) | undefined>(undefined)

  const queueFlyTo = (lat: number, lng: number, zoom: number) => {
    pendingFlyToRef.current = { lat, lng, zoom }
  }

  const runFlyTo = (lat: number, lng: number, zoom: number) => {
    if (flyToRef.current) {
      flyToRef.current(lat, lng, zoom)
      pendingFlyToRef.current = null
      return
    }
    queueFlyTo(lat, lng, zoom)
  }

  return (
    <div
      className="h-screen w-screen overflow-hidden"
      style={{ background: darkMode ? '#000000' : '#f0f4f8' }}
      data-dark={darkMode ? 'true' : undefined}
    >
      <Header
        view={view}
        onViewChange={(v) => { setView(v) }}
        filter={filters.category}
        onFilterChange={(category) => setFilters({ category, country: null, city: null })}
        onCitySelect={(lat, lng, zoom) => {
          setView('map')
          runFlyTo(lat, lng, zoom)
        }}
        showOffices={showOffices}
        onToggleOffices={() => setShowOffices(s => !s)}
        mapStyleKey={mapStyleKey}
        onMapStyleChange={setMapStyleKey}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        onRandomCompany={() => {
          setView('map')
          randomCompanyRef.current?.()
        }}
      />

      {view === 'map' ? (
        <MapView
          filters={filters}
          onRegisterFlyTo={(fn) => {
            flyToRef.current = fn
            if (pendingFlyToRef.current) {
              const { lat, lng, zoom } = pendingFlyToRef.current
              fn(lat, lng, zoom)
              pendingFlyToRef.current = null
            }
          }}
          onRegisterRandomCompany={(fn) => { randomCompanyRef.current = fn }}
          showOffices={showOffices}
          mapStyleKey={mapStyleKey}
          darkMode={darkMode}
        />
      ) : (
        <CompanyTable
          filters={filters}
          onViewOnMap={(company) => {
            setView('map')
            if (company.lat != null && company.lng != null) {
              runFlyTo(company.lat, company.lng, 15)
            }
          }}
        />
      )}
    </div>
  )
}
