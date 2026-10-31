import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import { BLOG_CONFIG } from '@/lib/config'
import { arabicDigits } from '@/lib/format'
import FilterRow from '@/components/FilterRow'
import { Tile } from '@/components/HomeCards'

export const metadata: Metadata = {
  title:       'كل المقالات',
  description: BLOG_CONFIG.tagline,
  alternates:  { canonical: '/articles/' },
}

/** The full list: every article, newest first, as the home grid. */
export default function AllArticles() {
  const all = getAllArticles()
  return (
    <div className="home">
      <header className="w list-head">
        <h1>كل المقالات</h1>
        <p>{arabicDigits(all.length)} {all.length <= 10 ? 'مقالات' : 'مقالاً'}</p>
        <FilterRow active="all" />
      </header>
      <section className="w sec">
        <div className="grid2">{all.map(a => <Tile key={a.slug} a={a} />)}</div>
      </section>
    </div>
  )
}
