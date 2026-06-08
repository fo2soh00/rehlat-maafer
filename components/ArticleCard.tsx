import Link from 'next/link'
import { ArticleListItem } from '@/lib/articles'

interface Props {
  article: ArticleListItem
}

export default function ArticleCard({ article }: Props) {
  const { slug, meta } = article

  return (
    <article className="note">
      <div className="meta">
        <span className="chip">{meta.tag}</span>
        <span className="date">{meta.date_ar}</span>
      </div>
      <h2>{meta.title}</h2>
      <p>{meta.excerpt}</p>
      <span className="read">
        اقرأ المقال <span className="arrow">←</span>
      </span>
      {/* Whole card is clickable */}
      <Link href={`/articles/${slug}`} className="cover" aria-label={meta.title} />
    </article>
  )
}
