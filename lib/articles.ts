import fs    from 'fs'
import path  from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

// ── Types ───────────────────────────────────────────────────────────────

export interface ArticleMeta {
  title:    string
  subtitle: string
  date:     string   // ISO: "2026-06-07" — used for sorting
  date_ar:  string   // Display: "٧ يونيو ٢٠٢٦"
  tag:      string   // Category badge: "بناء" / "قيادة" / "ذكاء اصطناعي"
  readTime: string   // "٦ دقايق"
  excerpt:  string   // One-sentence shown on home page
  pinned?:  boolean  // when true, floats to top of home list regardless of date
}

export interface ArticleListItem {
  slug: string
  meta: ArticleMeta
}

export interface ArticleFull extends ArticleListItem {
  contentHtml: string
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

export async function getArticleBySlug(slug: string): Promise<ArticleFull> {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`)
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)

  const contentHtml = marked.parse(content) as string

  return {
    slug,
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
