import Link from 'next/link'
import { ArticleListItem } from '@/lib/articles'
import { arabicDigits, formatReadTime } from '@/lib/format'
import TagChip from '@/components/TagChip'

interface Props {
  article: ArticleListItem
}

/**
 * The compact entry in the river: title + meta line, no excerpt and no
 * thumbnail.
 *
 * The whole row is clickable through `.row-title a::after`, the same overlay
 * the card uses — not by wrapping the row in an anchor. Wrapping puts the tag
 * chip's own <a> inside another <a>, which is invalid HTML: React cannot
 * hydrate it and falls back to re-rendering the whole root on the client.
 */
export default function ArticleRow({ article }: Props) {
  const { slug, meta } = article

  return (
    <article className="row">
      <h3 className="row-title">
        <Link href={`/articles/${slug}/`}>{meta.title}</Link>
      </h3>
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
            <span className="date">{formatReadTime(meta.readTime)}</span>
          </>
        )}
      </div>
    </article>
  )
}
