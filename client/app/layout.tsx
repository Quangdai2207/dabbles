import { Toaster } from '@/components/ui/sonner'
import type { Metadata, Viewport } from 'next'
import { Comfortaa } from 'next/font/google'
import './globals.css'

const comfortaa = Comfortaa({
  variable: '--font-comfortaa',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

export const metadata: Metadata = {
  title: {
    default: 'Dabble',
    template: '%s | Dabble'
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://dabble.vn'),
  description: 'An all-in-one platform to showcase and discover creative work.',
  keywords: ['Dabble', 'Creative Work', 'Showcase', 'Discover', 'Art', 'Design', 'Inspiration', 'Community'],
  openGraph: {
    title: 'Dabble',
    description: 'An all-in-one platform to showcase and discover creative work.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://dabble.vn',
    siteName: 'Dabble',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Dabble - Showcase and Discover Creative Work'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dabble',
    description: 'An all-in-one platform to showcase and discover creative work.',
    images: ['/twitter-image.png']
  },
  robots: {
    index: true,
    follow: true
  }
}

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang='en'>
      <body className={` ${comfortaa.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}

export default RootLayout
