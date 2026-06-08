import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BLOG_CONFIG } from '@/lib/config'

export const metadata: Metadata = {
  title:       `${BLOG_CONFIG.blogName} — ${BLOG_CONFIG.siteTitle}`,
  description: BLOG_CONFIG.tagline,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Arabic Google Fonts — Rakkas for headlines, Cairo for body (NOT next/font) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rakkas&family=Cairo:wght@300;400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
