import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'IBMap — Norwegian Finance & Investment Map',
  description:
    'Discover and explore finance and investment companies in Norway — PE, VC, AM, IB, trading firms and more, mapped interactively.',
  keywords: ['Norway finance', 'Norwegian investment', 'PE', 'VC', 'asset management', 'NHH', 'BI'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  )
}
