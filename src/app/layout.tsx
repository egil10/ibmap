import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KAPITALKART — Nordic Finance & Investment Map',
  description:
    'Discover and explore finance and investment companies across the Nordics — PE, VC, AM, hedge funds, trading firms and more, mapped interactively.',
  keywords: ['Norway finance', 'Nordic investment', 'PE', 'VC', 'asset management', 'hedge fund', 'NHH', 'BI'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  )
}
