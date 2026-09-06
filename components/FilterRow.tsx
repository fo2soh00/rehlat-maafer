import Link from 'next/link'
import { TAGS } from '@/lib/tags'

interface Props {
  /** 'all' on Home, otherwise the slug of the tag page being viewed. */
  active: 'all' | string
}

/**
 * «الكل» plus one link per registry tag. Scrolls sideways on narrow screens
 * rather than wrapping, so the row stays one line at any width.
 */
export default function FilterRow({ active }: Props) {
  return (
    <nav className="filter-row" aria-label="تصفية">
      <Link
        href="/"
        className={active === 'all' ? 'is-active' : ''}
        aria-current={active === 'all' ? 'page' : undefined}
      >
        الكل
      </Link>

      {TAGS.map(tag => (
        <Link
          key={tag.slug}
          href={`/tag/${tag.slug}/`}
          className={active === tag.slug ? 'is-active' : ''}
          aria-current={active === tag.slug ? 'page' : undefined}
        >
          {tag.name}
        </Link>
      ))}
    </nav>
  )
}
