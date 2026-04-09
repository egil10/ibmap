export type CompanyCategory =
  | 'Asset Management'
  | 'Hedge Fund'
  | 'Private Equity'
  | 'Venture Capital'
  | 'Investment Banking'
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
  'Trading':            { bg: 'bg-rose-50',    text: 'text-rose-700',    pin: '#E11D48', border: 'border-rose-200'   },
  'Consulting':         { bg: 'bg-teal-50',    text: 'text-teal-700',    pin: '#0D9488', border: 'border-teal-200'   },
  'Holding':            { bg: 'bg-orange-50',  text: 'text-orange-700',  pin: '#EA580C', border: 'border-orange-200' },
  'Shipping':           { bg: 'bg-cyan-50',    text: 'text-cyan-700',    pin: '#0891B2', border: 'border-cyan-200'   },
}

export interface Company {
  id: string
  name: string
  category: CompanyCategory
  website: string
  city: string
  country: string
  lat?: number
  lng?: number
  description: string
  aum?: string
  employees?: string
  isNordic?: boolean
}
