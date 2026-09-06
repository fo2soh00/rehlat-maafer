import Link from 'next/link'
import { getStreamArticles, getSeriesEpisodes } from '@/lib/articles'
import { SERIES } from '@/lib/series'
import { BLOG_CONFIG } from '@/lib/config'
import ArticleCard from '@/components/ArticleCard'
import ArticleRow  from '@/components/ArticleRow'
import AuthorStrip from '@/components/AuthorStrip'
import SeriesTrack from '@/components/SeriesTrack'

const SERIES_KEY = 'ai-application'

export default function Home() {
  const series   = SERIES[SERIES_KEY]
  const episodes = getSeriesEpisodes(SERIES_KEY)

  const first  = episodes[0]
  const latest = episodes[episodes.length - 1]

  // Registry description, else episode 0's excerpt.
  const seriesLede = series.description ?? (first ? first.meta.excerpt : '')

  const streams = BLOG_CONFIG.streams.map(s => ({
    ...s,
    articles: getStreamArticles(s.key),
  }))

  const hasArticles = streams.some(s => s.articles.length > 0)

  return (
    <div className="shell">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero">
        <h1 className="hero-title">{BLOG_CONFIG.tagline}</h1>
        <AuthorStrip />
      </section>

      {/* ── Series hero ──────────────────────────────────────────────── */}
      {episodes.length > 0 && (
        <section className="series-hero">
          <div className="series-hero-main">
            <p className="series-hero-kicker">سلسلة</p>
            <p className="series-hero-title">{series.title}</p>
            {seriesLede && <p className="series-hero-lede">{seriesLede}</p>}
            <SeriesTrack total={series.total} episodes={episodes} />
          </div>

          <div className="series-hero-links">
            {first  && <Link href={`/articles/${first.slug}/`}>ابدأ من البداية</Link>}
            {latest && <Link href={`/articles/${latest.slug}/`}>آخر حلقة ←</Link>}
          </div>
        </section>
      )}

      {/* ── Streams ──────────────────────────────────────────────────── */}
      {!hasArticles ? (
        <p className="sig-foot">المقالات في الطريق...</p>
      ) : (
        <>
          <section className="streams">
            {streams.map(stream => (
              <div className="stream" key={stream.key}>
                <h2 className="stream-title">{stream.label}</h2>
                <div className="title-rule" />

                {stream.articles.map((article, i) =>
                  i === 0
                    ? <ArticleCard key={article.slug} article={article} />
                    : <ArticleRow  key={article.slug} article={article} />
                )}
              </div>
            ))}
          </section>

          <p className="sig-foot">✦ <span className="road">يتبع</span> ✦</p>
        </>
      )}
    </div>
  )
}
