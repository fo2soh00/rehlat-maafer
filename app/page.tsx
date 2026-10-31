import Link from 'next/link'
import { getAllArticles, getSeriesEpisodes, type ArticleListItem } from '@/lib/articles'
import { SERIES } from '@/lib/series'
import { TAGS, tagByName } from '@/lib/tags'
import { BLOG_CONFIG } from '@/lib/config'
import { arabicDigits } from '@/lib/format'
import HomeFilter from '@/components/HomeFilter'
import Scroller   from '@/components/Scroller'
import { Featured, Tile, ScrollCard, TextRow, Breaker } from '@/components/HomeCards'

const SERIES_KEY = 'ai-application'

/**
 * Home — layout C. Top to bottom: hero · filter · featured · series scroller ·
 * grid of 4 · quote band · 3 text rows · pillar scroller · remaining grid.
 * Every article appears once. Slots fill from the newest-first list: the
 * featured article first, then the pillar scroller's articles are reserved,
 * then the grids and rows take the rest, so a new article pushes the others down.
 */
export default function Home() {
  const all      = getAllArticles()
  const series   = SERIES[SERIES_KEY]
  const episodes = getSeriesEpisodes(SERIES_KEY)
  const essays   = all.filter(a => !a.meta.series)

  const used = new Set<string>(episodes.map(e => e.slug))
  const take = (list: ArticleListItem[], n = Infinity) => {
    const out: ArticleListItem[] = []
    for (const a of list) {
      if (out.length >= n) break
      if (!used.has(a.slug)) { used.add(a.slug); out.push(a) }
    }
    return out
  }

  // Featured = newest article outside the series, so the series row stays whole.
  const [featured] = take(essays, 1)

  // The pillar scroller is reserved next, so the grids above it cannot use up
  // its articles and leave the row empty.
  const scrollerTag = tagByName(BLOG_CONFIG.homeScrollerTag)
  const pillarItems = scrollerTag ? take(essays.filter(a => a.meta.tag === scrollerTag.name)) : []

  const grid1      = take(essays, 4)

  const quoteBySlug = BLOG_CONFIG.homeQuoteSlug
    ? essays.find(a => a.slug === BLOG_CONFIG.homeQuoteSlug && !used.has(a.slug))
    : undefined
  const [quote] = quoteBySlug ? take([quoteBySlug], 1) : take(essays, 1)

  const rows = take(essays, 3)

  const rest         = take(essays)

  const options = [
    { key: 'all', label: 'الكل', count: arabicDigits(all.length) },
    ...TAGS.map(t => ({ key: t.slug, label: t.name, count: arabicDigits(all.filter(a => a.meta.tag === t.name).length) })),
  ]

  if (all.length === 0) return <p className="sig-foot">المقالات في الطريق...</p>

  return (
    <div className="home" id="home">
      <header className="w home-hero">
        <h1><bdi dir="ltr">{BLOG_CONFIG.blogName}</bdi></h1>
        <p>{BLOG_CONFIG.tagline}</p>
      </header>

      <HomeFilter options={options} scope="#home" />

      {featured && (
        <section className="w sec" data-fsec><Featured a={featured} /></section>
      )}

      {episodes.length > 0 && (
        <section className="scroller" data-fsec aria-label={series.title}>
          <Scroller label={`سلسلة · ${arabicDigits(episodes.length)} حلقات`} title={series.title} titleLtr>
            {episodes.map(e => <ScrollCard key={e.slug} a={e} />)}
          </Scroller>
        </section>
      )}

      {grid1.length > 0 && (
        <section className="w sec" data-fsec>
          <span className="lab">مقالات</span>
          <div className="grid2">{grid1.map(a => <Tile key={a.slug} a={a} />)}</div>
        </section>
      )}

      {quote && <Breaker a={quote} />}

      {rows.length > 0 && (
        <section className="w sec" data-fsec>
          <span className="lab">المزيد</span>
          {rows.map(a => <TextRow key={a.slug} a={a} />)}
        </section>
      )}

      {scrollerTag && pillarItems.length > 0 && (
        <section className="scroller" data-fsec aria-label={scrollerTag.name}>
          <Scroller label={scrollerTag.name} title={scrollerTag.blurb || scrollerTag.name}>
            {pillarItems.map(a => <ScrollCard key={a.slug} a={a} />)}
          </Scroller>
        </section>
      )}

      {rest.length > 0 && (
        <section className="w sec" data-fsec>
          <div className="grid2">{rest.map(a => <Tile key={a.slug} a={a} />)}</div>
        </section>
      )}

      <div className="w"><Link className="allbtn" href="/articles/">كل المقالات ←</Link></div>
    </div>
  )
}
