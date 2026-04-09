'use client'

import dynamic from 'next/dynamic'

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-500" />
        <p className="text-sm font-medium text-slate-400">Loading map…</p>
      </div>
    </div>
  ),
})

export default function Home() {
  return <MapView />
}
