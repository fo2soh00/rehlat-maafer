import { ArticleListItem } from '@/lib/articles'
import { BLOG_CONFIG } from '@/lib/config'
import ArticleCard from '@/components/ArticleCard'
import ArticleRow  from '@/components/ArticleRow'

interface Props {
  articles: ArticleListItem[]
}

/**
 * One chronological list with a rhythm: every Nth entry is a full card, the
 * rest are compact rows. The pinned article sorts first, so it is always the
 * opening card.
 */
export default function ArticleRiver({ articles }: Props) {
  return (
    <div className="river">
      {articles.map((article, i) =>
        i % BLOG_CONFIG.cardEvery === 0
          ? <ArticleCard key={article.slug} article={article} />
          : <ArticleRow  key={article.slug} article={article} />
      )}
    </div>
  )
}
