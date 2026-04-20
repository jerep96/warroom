import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'WARROOM — Global Conflict Monitor',
    template: '%s | WARROOM',
  },
  description: 'Real-time tracker of active armed conflicts, wars and geopolitical tensions worldwide. Live map with data on casualties, displaced people and international sanctions.',
  keywords: ['war tracker', 'conflict monitor', 'active wars 2025', 'global conflicts map', 'armed conflicts', 'geopolitical tensions', 'war map', 'conflict data'],
  authors: [{ name: 'WARROOM' }],
  creator: 'WARROOM',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://warroom-dusky.vercel.app',
    siteName: 'WARROOM',
    title: 'WARROOM — Global Conflict Monitor',
    description: 'Real-time tracker of active armed conflicts and geopolitical tensions worldwide.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'WARROOM Global Conflict Monitor' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WARROOM — Global Conflict Monitor',
    description: 'Real-time tracker of active armed conflicts worldwide.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0, overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
