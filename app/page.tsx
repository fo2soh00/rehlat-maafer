import Link from 'next/link'
import { getAllArticles, getSeriesEpisodes } from '@/lib/articles'
import { SERIES } from '@/lib/series'
import { BLOG_CONFIG } from '@/lib/config'
import ArticleRiver from '@/components/ArticleRiver'
import AuthorStrip  from '@/components/AuthorStrip'
import SeriesTrack  from '@/components/SeriesTrack'
import FilterRow    from '@/components/FilterRow'

const SERIES_KEY = 'ai-application'

export default function Home() {
  const series   = SERIES[SERIES_KEY]
  const episodes = getSeriesEpisodes(SERIES_KEY)
  const articles = getAllArticles()

  const first  = episodes[0]
  const latest = episodes[episodes.length - 1]

  // Registry description, else episode 0's excerpt.
  const seriesLede = series.description ?? (first ? first.meta.excerpt : '')

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

      {/* ── The river ────────────────────────────────────────────────── */}
      {articles.length === 0 ? (
        <p className="sig-foot">المقالات في الطريق...</p>
      ) : (
        <>
          <section className="articles">
            <div className="articles-head">
              <div>
                <h2>المقالات</h2>
                <div className="title-rule" />
              </div>
              <FilterRow active="all" />
            </div>

            <ArticleRiver articles={articles} />
          </section>

          <p className="sig-foot">✦ <span className="road">يتبع</span> ✦</p>
        </>
      )}
    </div>
  )
}
