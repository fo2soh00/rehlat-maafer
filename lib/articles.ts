import fs    from 'fs'
import path  from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

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

  const contentHtml = marked.parse(content) as string

  return {
    slug: decoded,
    meta: data as ArticleMeta,
    contentHtml,
  }
}

// ── Used by generateStaticParams in the article page ────────────────────

export function getAllSlugs(): string[] {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''))
}
