import Link from 'next/link'
import { getAdjacent } from '@/lib/articles'
import AuthorStrip from '@/components/AuthorStrip'

interface Props {
  slug: string
}

/**
 * Foot of an article: where to go next, then who wrote it.
 * `next` sits at the inline-end, `prev` at the inline-start, so in RTL the
 * later article is on the left — the direction the ← arrow points.
 */
export default function ArticleEnd({ slug }: Props) {
  const { prev, next, isSeries } = getAdjacent(slug)

  return (
    <div className="art-end">
      {(prev || next) && (
        <nav className="adjacent" aria-label="مقالات قريبة">
          {prev && (
            <Link href={`/articles/${prev.slug}/`} className="adj adj-prev">
              <span className="adj-label">{isSeries ? '→ الحلقة السابقة' : '→ الأقدم'}</span>
              <span className="adj-title">{prev.meta.title}</span>
            </Link>
          )}
          {next && (
            <Link href={`/articles/${next.slug}/`} className="adj adj-next">
              <span className="adj-label">{isSeries ? 'الحلقة التالية ←' : 'الأحدث ←'}</span>
              <span className="adj-title">{next.meta.title}</span>
            </Link>
          )}
        </nav>
      )}

      <AuthorStrip />
    </div>
  )
}
