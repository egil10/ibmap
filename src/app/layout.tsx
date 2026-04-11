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
      <head>
        {/* Preconnect to tile servers and font CDNs for faster first paint */}
        <link rel="preconnect" href="https://tiles.openfreemap.org" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://basemaps.cartocdn.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        {/* Preload the default map style */}
        <link rel="preload" href="https://tiles.openfreemap.org/styles/positron" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  )
}
