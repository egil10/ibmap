export type CompanyCategory = 'AM' | 'PE' | 'VC' | 'IB' | 'TR' | 'MC' | 'HF' | 'HL' | 'SH'

export interface Company {
  id: string
  name: string
  category: CompanyCategory
  website: string
  city: string
  country: string
  lat: number
  lng: number
  description?: string
  aum?: string
  founded?: number
  employees?: string
  isNordic?: boolean
}

export const CATEGORY_LABELS: Record<CompanyCategory, string> = {
  AM: 'Asset Management',
  PE: 'Private Equity',
  VC: 'Venture Capital',
  IB: 'Investment Banking',
  TR: 'Trading',
  MC: 'Management Consulting',
  HF: 'Hedge Fund',
  HL: 'Holding',
  SH: 'Shipping',
}

export const CATEGORY_COLORS: Record<CompanyCategory, { bg: string; text: string; pin: string; border: string }> = {
  AM: { bg: 'bg-blue-50', text: 'text-blue-700', pin: '#2563EB', border: 'border-blue-200' },
  PE: { bg: 'bg-purple-50', text: 'text-purple-700', pin: '#7C3AED', border: 'border-purple-200' },
  VC: { bg: 'bg-emerald-50', text: 'text-emerald-700', pin: '#059669', border: 'border-emerald-200' },
  IB: { bg: 'bg-amber-50', text: 'text-amber-700', pin: '#D97706', border: 'border-amber-200' },
  TR: { bg: 'bg-rose-50', text: 'text-rose-700', pin: '#E11D48', border: 'border-rose-200' },
  MC: { bg: 'bg-teal-50', text: 'text-teal-700', pin: '#0D9488', border: 'border-teal-200' },
  HF: { bg: 'bg-indigo-50', text: 'text-indigo-700', pin: '#4F46E5', border: 'border-indigo-200' },
  HL: { bg: 'bg-orange-50', text: 'text-orange-700', pin: '#EA580C', border: 'border-orange-200' },
  SH: { bg: 'bg-cyan-50', text: 'text-cyan-700', pin: '#0891B2', border: 'border-cyan-200' },
}
