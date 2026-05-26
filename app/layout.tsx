import type { Metadata, Viewport } from 'next'
import { Syne, Inter } from 'next/font/google'
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

export const metadata: Metadata = {
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Merova Healthcare | Building the Future of Healthcare Manufacturing',
    description: 'Strategic platform acquiring and scaling pharmaceutical manufacturing companies.',
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
    <html lang="en" className={`${syne.variable} ${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
