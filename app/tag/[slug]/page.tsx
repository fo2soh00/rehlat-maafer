import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getArticlesByTag } from '@/lib/articles'
import { TAGS, tagBySlug } from '@/lib/tags'
import { BLOG_CONFIG } from '@/lib/config'
import { arabicDigits } from '@/lib/format'
import FilterRow    from '@/components/FilterRow'
import ArticleRiver from '@/components/ArticleRiver'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return TAGS.map(t => ({ slug: t.slug }))
}

/** «مقال واحد» / «مقالان» / «N مقالات» / «N مقالاً» */
function countLabel(n: number): string {
  if (n === 1) return 'مقال واحد'
  if (n === 2) return 'مقالان'
  if (n <= 10) return `${arabicDigits(n)} مقالات`
  return `${arabicDigits(n)} مقالاً`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = tagBySlug(params.slug)
  if (!tag) return {}

  const url = `/tag/${tag.slug}/`
  return {
    title:       tag.name,
    description: BLOG_CONFIG.tagline,
    alternates:  { canonical: url },
    openGraph: {
      type:        'website',
      locale:      'ar_SA',
      url,
      siteName:    BLOG_CONFIG.blogName,
      title:       tag.name,
      description: BLOG_CONFIG.tagline,
      images:      [{ url: '/og/default.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       tag.name,
      description: BLOG_CONFIG.tagline,
      images:      ['/og/default.jpg'],
    },
  }
}

export default function TagPage({ params }: Props) {
  const tag = tagBySlug(params.slug)
  if (!tag) notFound()

  const articles = getArticlesByTag(tag.name)

  return (
    <div className="shell">
      <div className="tag-head">
        <h1 className="page-title">{tag.name}</h1>
        <p className="tag-count">{countLabel(articles.length)}</p>
        <div className="title-rule" />
      </div>

      <FilterRow active={tag.slug} />

      <ArticleRiver articles={articles} />
    </div>
  )
}
