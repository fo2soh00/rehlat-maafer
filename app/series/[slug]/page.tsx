import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSeriesEpisodes } from '@/lib/articles'
import { SERIES, type SeriesKey } from '@/lib/series'
import { BLOG_CONFIG } from '@/lib/config'
import { arabicDigits } from '@/lib/format'
import SeriesTrack from '@/components/SeriesTrack'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return Object.keys(SERIES).map(slug => ({ slug }))
}

function seriesOr404(slug: string) {
  const entry = SERIES[slug as SeriesKey]
  if (!entry) notFound()
  return entry
}

/** The registry description, or episode 0's excerpt when it is null. */
function seriesDescription(slug: string): string {
  const entry = seriesOr404(slug)
  if (entry.description) return entry.description
  const episodes = getSeriesEpisodes(slug)
  return episodes.length ? (episodes[0].meta.excerpt ?? '') : ''
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = seriesOr404(params.slug)
  const description = seriesDescription(params.slug)
  const url = `/series/${params.slug}/`

  return {
    title:       entry.title,
    description,
    alternates:  { canonical: url },
    openGraph: {
      type:     'website',
      locale:   'ar_SA',
      url,
      siteName: BLOG_CONFIG.blogName,
      title:    entry.title,
      description,
      images:   [{ url: '/og/default.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card:   'summary_large_image',
      title:  entry.title,
      description,
      images: ['/og/default.jpg'],
    },
  }
}

export default function SeriesPage({ params }: Props) {
  const entry       = seriesOr404(params.slug)
  const episodes    = getSeriesEpisodes(params.slug)
  const description = seriesDescription(params.slug)

  return (
    <div className="wrap">
      <p className="page-kicker">سلسلة</p>
      <h1 className="page-title">{entry.title}</h1>
      <div className="title-rule" />

      {description && <p className="series-lede">{description}</p>}

      <div className="series-meter">
        <SeriesTrack total={entry.total} episodes={episodes} />
        <span className="series-count">
          {arabicDigits(episodes.length)} / {arabicDigits(entry.total)}
        </span>
      </div>

      <ol className="ep-list">
        {episodes.map(ep => (
          <li key={ep.slug} className="ep">
            <Link href={`/articles/${ep.slug}/`} className="ep-link">
              <span className="ep-num">{arabicDigits(ep.meta.episode as number)}</span>
              <span className="ep-body">
                <span className="ep-title">{ep.meta.title}</span>
                {ep.meta.subtitle && <span className="ep-sub">{ep.meta.subtitle}</span>}
                <span className="ep-meta">
                  {ep.meta.date_ar}
                  {ep.meta.readTime && <> <span className="sep">·</span> {ep.meta.readTime}</>}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
