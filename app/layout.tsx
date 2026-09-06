import type { Metadata } from 'next'
import { Cairo, Rakkas } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BLOG_CONFIG } from '@/lib/config'

const SITE_TITLE = `${BLOG_CONFIG.blogName} — ${BLOG_CONFIG.siteTitle}`

// Self-hosted at build time by next/font — no runtime request to Google.
const cairo = Cairo({
  subsets:  ['arabic', 'latin'],
  // 500 is required by Part E (.art-head .sub and the article lede). Cairo is
  // emitted as discrete static weights, so without it the browser synthesises
  // a fake medium instead of loading Cairo Medium.
  weight:   ['400', '500', '600', '700'],
  variable: '--font-cairo',
  display:  'swap',
})

const rakkas = Rakkas({
  subsets:  ['arabic', 'latin'],
  weight:   '400',
  variable: '--font-rakkas',
  display:  'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(BLOG_CONFIG.siteUrl),
  title: {
    default:  SITE_TITLE,
    template: `%s — ${BLOG_CONFIG.siteTitle}`,
  },
  description: BLOG_CONFIG.tagline,
  alternates: { canonical: '/' },
  openGraph: {
    type:        'website',
    locale:      'ar_SA',
    url:         '/',
    siteName:    BLOG_CONFIG.blogName,
    title:       SITE_TITLE,
    description: BLOG_CONFIG.tagline,
    images:      [{ url: '/og/default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       SITE_TITLE,
    description: BLOG_CONFIG.tagline,
    images:      ['/og/default.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${rakkas.variable}`}>
      <head>
        <link rel="alternate" type="application/rss+xml" title={SITE_TITLE} href="/feed.xml" />
      </head>
      <body>
        <a href="#content" className="skip">تخطَّ إلى المحتوى</a>
        <Header />
        <main id="content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
