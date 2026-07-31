import { BLOG_CONFIG } from '@/lib/config'
import { getPage }    from '@/lib/pages'

export default function About() {
  // Design lives here in code; the bio text is edited from Decap CMS.
  const { meta, contentHtml } = getPage('about')

  return (
    <div className="wrap">
      <p className="page-kicker">{meta.kicker}</p>
      <h1 className="page-title">{meta.title}</h1>
      <div className="title-rule" />

      <div className="about">
        <div className="portrait">
          <div className="frame">
            <div className="photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/moustafa-portrait.jpg" alt={BLOG_CONFIG.siteTitle} />
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
