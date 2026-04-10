'use client'

import dynamic from 'next/dynamic'
import { useState, useRef } from 'react'
import { FilterCategory } from '@/data/companies'
import { MapStyleKey } from '@/types'
import Header from '@/components/layout/Header'
import CompanyTable from '@/components/ui/CompanyTable'

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center" style={{ background: '#f0f4f8' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-700" />
        <p className="text-sm font-medium text-slate-400">Loading map…</p>
      </div>
    </div>
  ),
})

export type AppView = 'map' | 'companies'

export default function Home() {
  const [view, setView] = useState<AppView>('map')
  const [filter, setFilter] = useState<FilterCategory>('ALL')
  const [showOffices, setShowOffices] = useState(false)
  const [mapStyleKey, setMapStyleKey] = useState<MapStyleKey>('minimal')
  const [darkMode, setDarkMode] = useState(false)
  const flyToRef = useRef<((lat: number, lng: number, zoom: number) => void) | undefined>(undefined)
  const randomCompanyRef = useRef<(() => void) | undefined>(undefined)

  return (
    <div
      className="h-screen w-screen overflow-hidden"
      style={{ background: darkMode ? '#000000' : '#f0f4f8' }}
      data-dark={darkMode ? 'true' : undefined}
    >
      <Header
        view={view}
        onViewChange={(v) => { setView(v) }}
        filter={filter}
        onFilterChange={setFilter}
        onCitySelect={(lat, lng, zoom) => {
          setView('map')
          flyToRef.current?.(lat, lng, zoom)
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
          filter={filter}
          onFilterChange={setFilter}
          onRegisterFlyTo={(fn) => { flyToRef.current = fn }}
          onRegisterRandomCompany={(fn) => { randomCompanyRef.current = fn }}
          showOffices={showOffices}
          mapStyleKey={mapStyleKey}
          darkMode={darkMode}
        />
      ) : (
        <CompanyTable
          filter={filter}
          onViewOnMap={(company) => {
            setView('map')
            if (company.lat != null && company.lng != null) {
              setTimeout(() => flyToRef.current?.(company.lat!, company.lng!, 15), 100)
            }
          }}
        />
      )}
    </div>
  )
}
