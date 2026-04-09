'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { FilterCategory } from '@/data/companies'
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
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterCategory>('ALL')

  return (
    <div className="h-screen w-screen overflow-hidden" style={{ background: '#f0f4f8' }}>
      <Header
        view={view}
        onViewChange={setView}
        search={search}
        onSearch={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />

      {view === 'map' ? (
        <MapView search={search} filter={filter} onFilterChange={setFilter} />
      ) : (
        <CompanyTable search={search} filter={filter} />
      )}
    </div>
  )
}
