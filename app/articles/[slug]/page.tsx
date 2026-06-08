import Link from 'next/link'
import { getArticleBySlug, getAllSlugs } from '@/lib/articles'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

// ── Pre-generate all article pages at build time ─────────────────────────
export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

// ── Page metadata (browser tab title) ────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  return {
    title:       `${article.meta.title} — مصطفى فؤاد`,
    description: article.meta.excerpt,
  }
}

// ── Article page ──────────────────────────────────────────────────────────
export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug)
  const { meta, contentHtml } = article

  return (
    <article className="reading">
      <Link href="/" className="back">
        <span>→</span><span>كل المقالات</span>
      </Link>

      <header className="art-head">
        <div className="meta">
          <span className="chip">{meta.tag}</span>
          <span className="date">{meta.date_ar}</span>
          {meta.readTime && (
            <>
              <span className="dot" />
              <span className="date">{meta.readTime} للقراءة</span>
            </>
          )}
        </div>
        <h1>{meta.title}</h1>
        {meta.subtitle && <p className="sub">{meta.subtitle}</p>}
      </header>

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <p className="art-foot">✦ <span className="road">يتبع</span> ✦</p>

      <Link href="/" className="back">
        <span>→</span><span>عودة للمقالات</span>
      </Link>
    </article>
  )
}
