import Link from 'next/link'
import { ArticleListItem } from '@/lib/articles'
import { arabicDigits } from '@/lib/format'
import TagChip from '@/components/TagChip'

interface Props {
  article: ArticleListItem
}

/**
 * Every article in a stream after the first one: title + meta line, no
 * excerpt and no thumbnail. The whole row is the link.
 */
export default function ArticleRow({ article }: Props) {
  const { slug, meta } = article

  return (
    <article className="row">
      <Link href={`/articles/${slug}/`} className="row-link">
        <h3 className="row-title">{meta.title}</h3>
        <div className="meta">
          {meta.pinned && <span className="pin">مثبت</span>}
          <TagChip tag={meta.tag} slug={slug} />
          {typeof meta.episode === 'number' && (
            <span className="chip chip-ep">الحلقة {arabicDigits(meta.episode)}</span>
          )}
          <span className="date">{meta.date_ar}</span>
          {meta.readTime && (
            <>
              <span className="sep">·</span>
              <span className="date">{meta.readTime}</span>
            </>
          )}
        </div>
      </Link>
    </article>
  )
}
