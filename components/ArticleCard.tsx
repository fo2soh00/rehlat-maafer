import Link from 'next/link'
import { ArticleListItem } from '@/lib/articles'
import { arabicDigits } from '@/lib/format'
import TagChip from '@/components/TagChip'

interface Props {
  article: ArticleListItem
}

export default function ArticleCard({ article }: Props) {
  const { slug, meta } = article
  const hasCover = Boolean(meta.cover)

  return (
    <article className={`note${hasCover ? ' has-thumb' : ''}`}>
      <div className="note-text">
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

        {/* The ::after on this link covers the whole card — see .note h3 a::after */}
        <h3><Link href={`/articles/${slug}/`}>{meta.title}</Link></h3>

        <p>{meta.excerpt}</p>

        <span className="read">
          اقرأ المقال <span className="arrow">←</span>
        </span>
      </div>

      {meta.cover && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          className="note-thumb"
          src={meta.cover}
          alt=""
          width={300}
          height={225}
          loading="lazy"
          decoding="async"
        />
      )}
    </article>
  )
}
