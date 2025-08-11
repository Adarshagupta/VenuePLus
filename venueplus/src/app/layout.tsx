import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/providers'
import { TripProvider } from '@/contexts/TripContext'

export const metadata: Metadata = {
  title: 'VenuePlus - Plan Your Perfect Trip',
  description: 'Create personalized travel itineraries with AI-powered recommendations. Discover destinations, book packages, and plan your dream vacation.',
  keywords: ['travel', 'trip planning', 'vacation', 'itinerary', 'AI travel', 'book packages', 'destinations'],
  authors: [{ name: 'VenuePlus Team' }],
  creator: 'VenuePlus',
  publisher: 'VenuePlus',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://venueplus.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'VenuePlus - Plan Your Perfect Trip',
    description: 'Create personalized travel itineraries with AI-powered recommendations.',
    url: 'https://venueplus.vercel.app',
    siteName: 'VenuePlus',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'VenuePlus - AI-Powered Travel Planning',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VenuePlus - Plan Your Perfect Trip',
    description: 'Create personalized travel itineraries with AI-powered recommendations.',
    images: ['/logo.png'],
    creator: '@venueplus',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/logo.png',
    },
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <TripProvider>
            {children}
          </TripProvider>
        </Providers>
      </body>
    </html>
  )
}