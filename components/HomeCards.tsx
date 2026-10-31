import Link from 'next/link'
import type { ArticleListItem } from '@/lib/articles'
import { tagByName } from '@/lib/tags'
import { formatReadTime } from '@/lib/format'
import TagChip from '@/components/TagChip'
import Cover   from '@/components/Cover'

/*
 * Listing items for the home layout and the full list. Each item is clickable
 * as a whole through its title link's ::after overlay (`.hit`), never by
 * wrapping it in an <a> — the meta line holds a tag-chip link of its own.
 */

const href = (slug: string) => `/articles/${slug}/`
const tKey = (tag: string) => tagByName(tag)?.slug ?? 'other'

function Meta({ a }: { a: ArticleListItem }) {
  const { meta, slug } = a
  return (
    <div className="meta">
      <TagChip tag={meta.tag} slug={slug} />
      <span className="date">{meta.date_ar}</span>
      {meta.readTime && <><span className="sep">·</span><span className="date">{formatReadTime(meta.readTime)}</span></>}
    </div>
  )
}

export function Featured({ a }: { a: ArticleListItem }) {
  const { meta, slug } = a
  return (
    <article className="feat hit" data-t={tKey(meta.tag)}>
      <Cover slug={slug} title={meta.title} tag={meta.tag} episode={meta.episode} size="xl" href={href(slug)} as="h2" />
      <div className="feat-b">
        <span className="lab">الأحدث</span>
        <Meta a={a} />
        {meta.excerpt && <p className="feat-x">{meta.excerpt}</p>}
        <span className="more" aria-hidden="true">اقرأ المقال ←</span>
      </div>
    </article>
  )
}

export function Tile({ a }: { a: ArticleListItem }) {
  const { meta, slug } = a
  return (
    <article className="tile hit" data-t={tKey(meta.tag)}>
      <Cover slug={slug} title={meta.title} tag={meta.tag} episode={meta.episode} size="m" href={href(slug)} />
      <div className="tile-b">
        <Meta a={a} />
        {meta.excerpt && <p className="clamp2">{meta.excerpt}</p>}
      </div>
    </article>
  )
}

export function ScrollCard({ a }: { a: ArticleListItem }) {
  const { meta, slug } = a
  return (
    <article className="scard hit" data-t={tKey(meta.tag)}>
      <Cover slug={slug} title={meta.title} tag={meta.tag} episode={meta.episode} size="s" href={href(slug)} />
      {meta.excerpt && <p className="clamp2">{meta.excerpt}</p>}
    </article>
  )
}

export function TextRow({ a }: { a: ArticleListItem }) {
  const { meta, slug } = a
  return (
    <article className="trow hit" data-t={tKey(meta.tag)}>
      <Meta a={a} />
      <h3 className="trow-t"><Link href={href(slug)}>{meta.title}</Link></h3>
      {meta.excerpt && <p className="clamp1">{meta.excerpt}</p>}
    </article>
  )
}

export function Breaker({ a }: { a: ArticleListItem }) {
  const { meta, slug } = a
  return (
    <section className="breaker" data-fsec>
      <div className="w hit" data-t={tKey(meta.tag)}>
        <span className="lab">من مقال «{meta.title}»</span>
        <blockquote>{meta.excerpt}</blockquote>
        <Link className="more lt" href={href(slug)}>اقرأ المقال ←</Link>
      </div>
    </section>
  )
}
