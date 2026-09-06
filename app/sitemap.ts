import type { MetadataRoute } from 'next'
import { getAllArticles, isoDate } from '@/lib/articles'
import { SERIES } from '@/lib/series'
import { BLOG_CONFIG } from '@/lib/config'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const base     = BLOG_CONFIG.siteUrl
  const articles = getAllArticles()

  // Newest article date doubles as the home page's lastModified. getAllArticles
  // sorts pinned-first, so articles[0] is not necessarily the most recent —
  // take the max explicitly.
  const newest = articles.length
    ? articles.map(a => isoDate(a.meta.date)).sort().at(-1)!
    : isoDate(new Date())

  return [
    { url: `${base}/`,       lastModified: newest, changeFrequency: 'weekly',  priority: 1 },
    { url: `${base}/about/`, lastModified: newest, changeFrequency: 'yearly',  priority: 0.5 },

    ...Object.keys(SERIES).map(key => ({
      url:             `${base}/series/${key}/`,
      lastModified:    newest,
      changeFrequency: 'weekly' as const,
      priority:        0.8,
    })),

    ...articles.map(a => ({
      url:             `${base}/articles/${a.slug}/`,
      lastModified:    isoDate(a.meta.date),
      changeFrequency: 'monthly' as const,
      priority:        0.7,
    })),
  ]
}
