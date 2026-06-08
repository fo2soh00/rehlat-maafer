import { BLOG_CONFIG } from '@/lib/config'

export default function Footer() {
  return (
    <footer className="site-foot">
      <div className="inner">
        <span className="sig">
          {BLOG_CONFIG.siteTitle} <span className="dot">·</span> {BLOG_CONFIG.authorRole}
        </span>
        <div className="links">
          <a href={BLOG_CONFIG.linkedin} target="_blank" rel="noopener noreferrer">لينكدإن</a>
          <a href={BLOG_CONFIG.whatsapp} target="_blank" rel="noopener noreferrer">واتساب</a>
          <a href={`mailto:${BLOG_CONFIG.email}`}>إيميل</a>
        </div>
      </div>
    </footer>
  )
}
