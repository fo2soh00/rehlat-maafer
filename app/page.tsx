import { getAllArticles } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'
import { BLOG_CONFIG } from '@/lib/config'

export default function Home() {
  const articles = getAllArticles()

  return (
    <div className="shell">
      <main>
        {articles.length === 0 ? (
          <p className="sig-foot">المقالات في الطريق...</p>
        ) : (
          <>
            {articles.map(article => (
              <ArticleCard key={article.slug} article={article} />
            ))}
            <p className="sig-foot">✦ <span className="road">يتبع</span> ✦</p>
          </>
        )}
      </main>

      <aside>
        <div className="author">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="avatar" src="/moustafa-portrait.jpg" alt={BLOG_CONFIG.siteTitle} />
          <p className="kicker">عن الكاتب</p>
          <p className="name">{BLOG_CONFIG.siteTitle}</p>
          <p className="role">{BLOG_CONFIG.authorRole}</p>
          <p className="bio">{BLOG_CONFIG.authorBio}</p>
          <div className="links">
            <a href={BLOG_CONFIG.linkedin} target="_blank" rel="noopener noreferrer">لينكدإن</a>
            <a href={BLOG_CONFIG.whatsapp} target="_blank" rel="noopener noreferrer">واتساب</a>
            <a href={`mailto:${BLOG_CONFIG.email}`}>إيميل</a>
          </div>
        </div>
      </aside>
    </div>
  )
}
