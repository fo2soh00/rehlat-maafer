import fs    from 'fs'
import path  from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import { imageSize } from 'image-size'
import { BLOG_CONFIG } from '@/lib/config'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')
const PUBLIC_DIR   = path.join(process.cwd(), 'public')

// ── Image dimensions ────────────────────────────────────────────────────
// Stamping width/height on every <img> reserves the right box before the
// file arrives, so the article text does not jump as images stream in.

const dimCache = new Map<string, { width: number; height: number } | null>()

export function imageDimensions(src: string): { width: number; height: number } | null {
  if (dimCache.has(src)) return dimCache.get(src)!

  let result: { width: number; height: number } | null = null
  // Only local, root-relative paths can be measured; remote ones we skip.
  if (src.startsWith('/')) {
    const file = path.join(PUBLIC_DIR, src.split('?')[0].split('#')[0])
    try {
      const { width, height } = imageSize(fs.readFileSync(file))
      if (width && height) result = { width, height }
    } catch {
      console.warn(`[articles] image not found, no dimensions emitted: ${src}`)
    }
  }

  dimCache.set(src, result)
  return result
}

// Emit <img> with intrinsic size + lazy loading for every markdown image.
const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

marked.use({
  renderer: {
    image(href: string, title: string | null, text: string) {
      const dim  = imageDimensions(href)
      const size = dim ? ` width="${dim.width}" height="${dim.height}"` : ''
      const ttl  = title ? ` title="${escapeAttr(title)}"` : ''
      return `<img src="${escapeAttr(href)}" alt="${escapeAttr(text ?? '')}"${ttl}${size} loading="lazy" decoding="async">`
    },
  },
})

// Some articles hand-write raw <img> tags in the markdown body instead of
// using ![](). marked passes raw HTML straight through, so the renderer above
// never sees those — stamp them here after parsing.
export function stampRawImages(html: string): string {
  return html.replace(/<img\b[^>]*>/g, tag => {
    const src = tag.match(/\bsrc\s*=\s*"([^"]*)"/)?.[1]
    if (!src) return tag

    let out = tag.replace(/\s*\/?>$/, '')

    if (!/\bwidth\s*=/.test(out) && !/\bheight\s*=/.test(out)) {
      const dim = imageDimensions(src)
      if (dim) out += ` width="${dim.width}" height="${dim.height}"`
    }
    if (!/\bloading\s*=/.test(out))  out += ' loading="lazy"'
    if (!/\bdecoding\s*=/.test(out)) out += ' decoding="async"'

    return `${out}>`
  })
}

// ── Types ───────────────────────────────────────────────────────────────

export interface ArticleMeta {
  title:    string
  subtitle: string
  // Unquoted YAML dates parse as a JS Date, quoted ones stay strings — Decap
  // writes both. Never format this field directly; run it through isoDate().
  date:     string | Date   // ISO: "2026-06-07" — used for sorting
  date_ar:  string   // Display: "٧ يونيو ٢٠٢٦"
  tag:      string   // Category badge: "بناء" / "قيادة" / "ذكاء اصطناعي"
  readTime: string   // "٦ دقايق"
  excerpt:  string   // One-sentence shown on home page
  cover?:   string   // optional hero image path, e.g. /images/uploads/x.png
  gallery?: { image: string; caption?: string }[]  // optional carousel, rendered under the cover
  pinned?:  boolean  // when true, floats to top of home list regardless of date
  series?:  string   // series key, e.g. "ai-application" — see lib/series.ts
  episode?: number   // 0-based episode number within that series
}

export interface ArticleListItem {
  slug: string
  meta: ArticleMeta
}

export interface ArticleFull extends ArticleListItem {
  contentHtml: string
}

// ── Dates ───────────────────────────────────────────────────────────────
// `meta.date` is a Date when the YAML value is unquoted and a string when it
// is quoted; Decap has written both over time. Everything that emits a date
// (sitemap, RSS, JSON-LD, OpenGraph) must go through here so a stray quote in
// the front matter can never change the output.

export function isoDate(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime())
    ? String(value)              // unparseable — pass through rather than lie
    : d.toISOString().slice(0, 10)
}

export function rfc822Date(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toUTCString()
}

// ── Read all articles (for home page list) ──────────────────────────────

export function getAllArticles(): ArticleListItem[] {
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'))

  return files
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const raw  = fs.readFileSync(path.join(ARTICLES_DIR, fileName), 'utf8')
      const { data } = matter(raw)
      return { slug, meta: data as ArticleMeta }
    })
    .sort((a, b) => {
      const ap = a.meta.pinned ? 1 : 0
      const bp = b.meta.pinned ? 1 : 0
      if (ap !== bp) return bp - ap                 // pinned articles first
      return new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime()  // then newest first
    })
}

// ── Read one article (for article page) ─────────────────────────────────

// Next hands us the raw URL segment, which is percent-encoded for non-Latin
// filenames. decodeURIComponent throws on malformed input, so fall back to the
// slug as-given — an already-decoded Arabic slug must pass through untouched.
function safeDecode(slug: string): string {
  try {
    return decodeURIComponent(slug)
  } catch {
    return slug
  }
}

export async function getArticleBySlug(slug: string): Promise<ArticleFull> {
  const decoded = safeDecode(slug)

  // `decoded` comes from a URL segment — never let it escape ARTICLES_DIR.
  if (decoded.includes('/') || decoded.includes('\\') || decoded.includes('..')) {
    throw new Error(`Invalid article slug: ${slug}`)
  }

  const filePath = path.join(ARTICLES_DIR, `${decoded}.md`)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  const contentHtml = stampRawImages(marked.parse(content) as string)

  return {
    slug: decoded,
    meta: data as ArticleMeta,
    contentHtml,
  }
}

// ── Series ──────────────────────────────────────────────────────────────

/** Published episodes of one series, ordered by episode number ascending. */
export function getSeriesEpisodes(seriesKey: string): ArticleListItem[] {
  return getAllArticles()
    .filter(a => a.meta.series === seriesKey && typeof a.meta.episode === 'number')
    .sort((a, b) => (a.meta.episode! - b.meta.episode!))
}

// ── Tags ────────────────────────────────────────────────────────────────

/** Articles carrying one tag name, in the same order as getAllArticles(). */
export function getArticlesByTag(name: string): ArticleListItem[] {
  return getAllArticles().filter(a => a.meta.tag === name)
}

/**
 * Warn once per unknown tag at build time. An article whose tag is not in the
 * registry still lists and still renders its chip — just not as a link — so a
 * typo in Decap can never drop a post off the site or fail the build.
 */
const warnedTags = new Set<string>()

export function warnUnknownTag(tag: string, slug: string): void {
  if (warnedTags.has(tag)) return
  warnedTags.add(tag)
  console.warn(`[tags] unknown tag "${tag}" in ${slug}.md`)
}

// ── Streams ─────────────────────────────────────────────────────────────

/** The stream an article belongs to, by its tag. */
export function streamKeyForTag(tag: string): string | null {
  const stream = BLOG_CONFIG.streams.find(s => (s.tags as readonly string[]).includes(tag))
  return stream ? stream.key : null
}

/** Articles in one stream, newest first, pinned floated to the top. */
export function getStreamArticles(streamKey: string): ArticleListItem[] {
  return getAllArticles().filter(a => streamKeyForTag(a.meta.tag) === streamKey)
}

// ── Adjacent articles (article page end block) ──────────────────────────
// `next` is always the newer/later neighbour, `prev` the older/earlier one.
// Series articles step by episode number; everything else steps by date
// inside its own stream, so «الطريقة» never hands the reader off to «الرحلة».

export interface Adjacent {
  prev:     ArticleListItem | null
  next:     ArticleListItem | null
  isSeries: boolean
}

export function getAdjacent(slug: string): Adjacent {
  const all     = getAllArticles()
  const current = all.find(a => a.slug === slug)
  if (!current) return { prev: null, next: null, isSeries: false }

  const { series, episode } = current.meta

  if (series && typeof episode === 'number') {
    const line = getSeriesEpisodes(series)
    const i    = line.findIndex(a => a.slug === slug)
    return {
      prev:     i > 0 ? line[i - 1] : null,
      next:     i >= 0 && i < line.length - 1 ? line[i + 1] : null,
      isSeries: true,
    }
  }

  // Non-series: order this article's stream strictly by date, newest first.
  // getStreamArticles floats pinned posts, which would make "older/newer"
  // lie — so re-sort by date here and ignore `pinned`.
  const streamKey = streamKeyForTag(current.meta.tag)
  const line = (streamKey ? getStreamArticles(streamKey) : all)
    .slice()
    .sort((a, b) => new Date(isoDate(b.meta.date)).getTime() - new Date(isoDate(a.meta.date)).getTime())

  const i = line.findIndex(a => a.slug === slug)
  return {
    prev:     i >= 0 && i < line.length - 1 ? line[i + 1] : null,  // older
    next:     i > 0 ? line[i - 1] : null,                          // newer
    isSeries: false,
  }
}

// ── Used by generateStaticParams in the article page ────────────────────

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''))
}
