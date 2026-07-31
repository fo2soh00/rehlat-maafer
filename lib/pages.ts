import fs     from 'fs'
import path   from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

const PAGES_DIR = path.join(process.cwd(), 'content', 'pages')

// ── Types ───────────────────────────────────────────────────────────────

export interface PageMeta {
  title:  string   // Page heading: "عني"
  kicker: string   // Small label above the heading: "عن الكاتب"
}

export interface PageFull {
  meta:        PageMeta
  contentHtml: string
}

// ── Read one static page ────────────────────────────────────────────────
// Unlike articles, page names are fixed Latin literals from our own code —
// never a URL segment — so there is no slug decoding or traversal check here.

export function getPage(name: string): PageFull {
  const raw = fs.readFileSync(path.join(PAGES_DIR, `${name}.md`), 'utf8')
  const { data, content } = matter(raw)

  return {
    meta: data as PageMeta,
    contentHtml: marked.parse(content) as string,
  }
}
