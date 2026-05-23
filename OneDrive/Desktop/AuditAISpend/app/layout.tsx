import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Credex Auditor - AI Spend Optimization',
  description: 'Analyze your team\'s AI subscriptions and discover hidden savings.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
