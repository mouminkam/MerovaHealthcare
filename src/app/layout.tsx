import type { Metadata, Viewport } from 'next'
import { Syne, Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const syne = Syne({ 
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Utility face for data: exhibit labels, axis ticks, figures.
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://merova-project-2.vercel.app'),
  title: 'Merova Healthcare | Building the Future of Healthcare Manufacturing',
  description: 'Merova Healthcare Holding Ltd. is a strategic platform acquiring, integrating, and scaling pharmaceutical manufacturing companies across generics, CMO services, and specialty products.',
  keywords: ['healthcare', 'pharmaceutical', 'manufacturing', 'CMO', 'generics', 'investment', 'healthcare holding'],
  authors: [{ name: 'Merova Healthcare Holding Ltd.' }],
  openGraph: {
    title: 'Merova Healthcare | Building the Future of Healthcare Manufacturing',
    description: 'Strategic platform acquiring and scaling pharmaceutical manufacturing companies.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Merova Healthcare',
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: 'Merova Healthcare — investor website' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Merova Healthcare | Building the Future of Healthcare Manufacturing',
    description: 'Strategic platform acquiring and scaling pharmaceutical manufacturing companies.',
    images: ['/og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f0f14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
