import { BLOG_CONFIG } from '@/lib/config'

/**
 * One horizontal row: portrait, name, role, contact links. Used under the
 * home hero and again at the foot of every article. Carries no bio text —
 * the long version lives on /about/.
 */
export default function AuthorStrip() {
  return (
    <div className="who-strip">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="who-avatar"
        src="/moustafa-portrait-240.jpg"
        alt={BLOG_CONFIG.siteTitle}
        width={56}
        height={56}
        loading="lazy"
        decoding="async"
      />
      <p className="who-name">{BLOG_CONFIG.siteTitle}</p>
      <p className="who-role">{BLOG_CONFIG.authorRole}</p>
      <div className="who-links">
        <a href={BLOG_CONFIG.linkedin} target="_blank" rel="noopener noreferrer">لينكدإن</a>
        <a href={BLOG_CONFIG.whatsapp} target="_blank" rel="noopener noreferrer">واتساب</a>
        <a href={`mailto:${BLOG_CONFIG.email}`}>إيميل</a>
      </div>
    </div>
  )
}
