import type { Metadata } from 'next'
import { BLOG_CONFIG } from '@/lib/config'
import { getPage }    from '@/lib/pages'

const TITLE = 'عني'

export const metadata: Metadata = {
  title:       TITLE,
  description: BLOG_CONFIG.authorBio,
  alternates:  { canonical: '/about/' },
  openGraph: {
    type:        'profile',
    locale:      'ar_SA',
    url:         '/about/',
    siteName:    BLOG_CONFIG.blogName,
    title:       `${TITLE} — ${BLOG_CONFIG.siteTitle}`,
    description: BLOG_CONFIG.authorBio,
    images:      [{ url: '/og/default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       `${TITLE} — ${BLOG_CONFIG.siteTitle}`,
    description: BLOG_CONFIG.authorBio,
    images:      ['/og/default.jpg'],
  },
}

export default function About() {
  // Design lives here in code; the bio text is edited from Decap CMS.
  const { meta, contentHtml } = getPage('about')

  // ── JSON-LD: Person ───────────────────────────────────────────────────
  const personLd = {
    '@context':   'https://schema.org',
    '@type':      'Person',
    name:         BLOG_CONFIG.siteTitle,
    url:          `${BLOG_CONFIG.siteUrl}/about/`,
    image:        `${BLOG_CONFIG.siteUrl}/moustafa-portrait-800.jpg`,
    jobTitle:     BLOG_CONFIG.authorRole,
    description:  BLOG_CONFIG.authorBio,
    sameAs:       [BLOG_CONFIG.linkedin],
    email:        `mailto:${BLOG_CONFIG.email}`,
  }

  return (
    <div className="wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />

      <p className="page-kicker">{meta.kicker}</p>
      <h1 className="page-title">{meta.title}</h1>
      <div className="title-rule" />

      <div className="about">
        <div className="portrait">
          <div className="frame">
            <div className="photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/moustafa-portrait-800.jpg" alt={BLOG_CONFIG.siteTitle} width={800} height={800} />
            </div>
            <p className="cap">{BLOG_CONFIG.siteTitle}</p>
          </div>
        </div>

        <div className="bio-long">
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />

          <div className="contact">
            <p className="lbl">تواصل معايا</p>
            <div className="links">
              <a href={BLOG_CONFIG.linkedin} target="_blank" rel="noopener noreferrer">لينكدإن ↗</a>
              <a href={BLOG_CONFIG.whatsapp} target="_blank" rel="noopener noreferrer">واتساب ↗</a>
              <a href={`mailto:${BLOG_CONFIG.email}`}>إيميل ↗</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
