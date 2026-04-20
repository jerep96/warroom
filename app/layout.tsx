import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WARROOM — Global Conflict Monitor',
  description: 'Real-time global conflict monitoring dashboard. UNCLASSIFIED.',
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
