import Link from 'next/link'
import { ArticleListItem } from '@/lib/articles'
import { arabicDigits } from '@/lib/digits'

interface Props {
  /** Planned episode count — the track always renders this many dots. */
  total:    number
  /** Published episodes, ordered by episode number ascending. */
  episodes: ArticleListItem[]
  /** Highlight nothing as "newest" (used when the page is itself an episode). */
  currentSlug?: string
}

/**
 * `total` dots in a row. Published = mustard, the newest published = orange
 * and wider, unpublished = sky tint. Published dots link to their episode.
 */
export default function SeriesTrack({ total, episodes, currentSlug }: Props) {
  const byEpisode = new Map(episodes.map(e => [e.meta.episode as number, e]))
  const newest    = episodes.length ? (episodes[episodes.length - 1].meta.episode as number) : -1

  return (
    <div className="track" role="list">
      {Array.from({ length: total }, (_, n) => {
        const ep = byEpisode.get(n)

        if (!ep) {
          return <span key={n} className="track-dot is-todo" role="listitem" aria-hidden="true" />
        }

        const isCurrent = currentSlug === ep.slug
        const cls = [
          'track-dot',
          'is-done',
          n === newest ? 'is-newest' : '',
          isCurrent ? 'is-current' : '',
        ].filter(Boolean).join(' ')

        return (
          <Link
            key={n}
            href={`/articles/${ep.slug}/`}
            className={cls}
            role="listitem"
            aria-label={`الحلقة ${arabicDigits(n)}`}
            aria-current={isCurrent ? 'page' : undefined}
          />
        )
      })}
    </div>
  )
}
