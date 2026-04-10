export type MapStyleKey = 'minimal' | 'detailed' | 'vivid'

interface MapStyleVariant { url: string; maskColor: string; maskOpacity: number }
export interface MapStyleOption { label: string; light: MapStyleVariant; dark: MapStyleVariant }

export const MAP_STYLES: Record<MapStyleKey, MapStyleOption> = {
  minimal: {
    label: 'Minimal',
    light: { url: 'https://tiles.openfreemap.org/styles/positron', maskColor: '#f0f4f8', maskOpacity: 0.88 },
    dark:  { url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json', maskColor: '#000000', maskOpacity: 0.78 },
  },
  detailed: {
    label: 'Detailed',
    light: { url: 'https://tiles.openfreemap.org/styles/liberty',  maskColor: '#dde4ef', maskOpacity: 0.72 },
    dark:  { url: 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json', maskColor: '#000000', maskOpacity: 0.70 },
  },
  vivid: {
    label: 'Vivid',
    light: { url: 'https://tiles.openfreemap.org/styles/bright',   maskColor: '#e8edf5', maskOpacity: 0.68 },
    dark:  { url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json', maskColor: '#080c20', maskOpacity: 0.84 },
  },
}

export type CompanyCategory =
  | 'Asset Management'
  | 'Hedge Fund'
  | 'Private Equity'
  | 'Venture Capital'
  | 'Investment Banking'
  | 'Fintech'
  | 'Trading'
  | 'Consulting'
  | 'Holding'
  | 'Shipping'

export const CATEGORY_SHORT: Record<CompanyCategory, string> = {
  'Asset Management':   'AM',
  'Hedge Fund':         'HF',
  'Private Equity':     'PE',
  'Venture Capital':    'VC',
  'Investment Banking': 'IB',
  'Fintech':            'FT',
  'Trading':            'TR',
  'Consulting':         'CO',
  'Holding':            'HL',
  'Shipping':           'SH',
}

export const CATEGORY_COLORS: Record<CompanyCategory, { bg: string; text: string; pin: string; border: string }> = {
  'Asset Management':   { bg: 'bg-blue-50',    text: 'text-blue-700',    pin: '#2563EB', border: 'border-blue-200'   },
  'Hedge Fund':         { bg: 'bg-violet-50',  text: 'text-violet-700',  pin: '#7C3AED', border: 'border-violet-200' },
  'Private Equity':     { bg: 'bg-purple-50',  text: 'text-purple-700',  pin: '#9333EA', border: 'border-purple-200' },
  'Venture Capital':    { bg: 'bg-emerald-50', text: 'text-emerald-700', pin: '#059669', border: 'border-emerald-200'},
  'Investment Banking': { bg: 'bg-amber-50',   text: 'text-amber-700',   pin: '#D97706', border: 'border-amber-200'  },
  'Fintech':            { bg: 'bg-fuchsia-50', text: 'text-fuchsia-700', pin: '#C026D3', border: 'border-fuchsia-200'},
  'Trading':            { bg: 'bg-rose-50',    text: 'text-rose-700',    pin: '#E11D48', border: 'border-rose-200'   },
  'Consulting':         { bg: 'bg-teal-50',    text: 'text-teal-700',    pin: '#0D9488', border: 'border-teal-200'   },
  'Holding':            { bg: 'bg-orange-50',  text: 'text-orange-700',  pin: '#EA580C', border: 'border-orange-200' },
  'Shipping':           { bg: 'bg-cyan-50',    text: 'text-cyan-700',    pin: '#0891B2', border: 'border-cyan-200'   },
}

export interface CompanyOffice {
  city: string
  country: string
  lat: number
  lng: number
  label?: string   // e.g. "Stockholm office"
}

export interface Company {
  id: string
  name: string
  category: CompanyCategory
  website: string
  city: string
  country: string
  lat?: number          // HQ
  lng?: number
  offices?: CompanyOffice[]  // additional locations
  description: string
  aum?: string
  employees?: string
  isNordic?: boolean
}
