import { getAllArticles, rfc822Date } from '@/lib/articles'
import { BLOG_CONFIG } from '@/lib/config'

// Static export: this route is rendered once at build time into out/feed.xml.
export const dynamic = 'force-static'

const esc = (s: string) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export async function GET() {
  const base  = BLOG_CONFIG.siteUrl
  const items = getAllArticles().slice(0, 20)

  const body = items
    .map(({ slug, meta }) => {
      const url = `${base}/articles/${slug}/`
      return `    <item>
      <title>${esc(meta.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822Date(meta.date)}</pubDate>
      <description>${esc(meta.excerpt ?? '')}</description>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(`${BLOG_CONFIG.blogName} — ${BLOG_CONFIG.siteTitle}`)}</title>
    <link>${base}/</link>
    <description>${esc(BLOG_CONFIG.tagline)}</description>
    <language>ar</language>
${body}
  </channel>
</rss>
`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
