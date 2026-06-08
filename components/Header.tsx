'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BLOG_CONFIG } from '@/lib/config'

export default function Header() {
  const pathname = usePathname()
  // Articles (home + any /articles/*) count as "المقالات"
  const onAbout = pathname?.startsWith('/about')

  return (
    <div className="topbar">
      <div className="inner">
        <Link href="/" className="brand">
          <span className="dot" />
          {BLOG_CONFIG.blogName}
        </Link>
        <nav>
          <Link href="/" className={onAbout ? '' : 'active'}>المقالات</Link>
          <Link href="/about" className={onAbout ? 'active' : ''}>عني</Link>
        </nav>
      </div>
    </div>
  )
}
