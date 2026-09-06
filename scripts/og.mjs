/**
 * Render one 1200×630 share card per article into public/og/.
 *
 * Run: npm run og      (after publishing an article, then commit public/og/)
 *
 * Needs a Chromium once:  npx playwright install chromium
 * Cards whose JPG is newer than their markdown are skipped.
 */
import fs   from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { chromium } from 'playwright'

const ROOT     = process.cwd()
const ART_DIR  = path.join(ROOT, 'content', 'articles')
const OUT_DIR  = path.join(ROOT, 'public', 'og')
const TEMPLATE = path.join(ROOT, 'scripts', 'og-template.html')

// Read the copy slots straight out of lib/config.ts so this script never
// carries its own copy of any Arabic string.
function readConfig() {
  const src = fs.readFileSync(path.join(ROOT, 'lib', 'config.ts'), 'utf8')
  const pick = key => {
    const m = src.match(new RegExp(`${key}\\s*:\\s*'((?:[^'\\\\]|\\\\.)*)'`))
    if (!m) throw new Error(`could not read ${key} from lib/config.ts`)
    return m[1].replace(/\\'/g, "'")
  }
  return {
    blogName:   pick('blogName'),
    siteTitle:  pick('siteTitle'),
    authorRole: pick('authorRole'),
    tagline:    pick('tagline'),
  }
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const cfg  = readConfig()
const tpl  = fs.readFileSync(TEMPLATE, 'utf8')

fs.mkdirSync(OUT_DIR, { recursive: true })

// Build the work list: every article, plus the site default card.
const jobs = fs
  .readdirSync(ART_DIR)
  .filter(f => f.endsWith('.md'))
  .map(file => {
    const slug = file.replace(/\.md$/, '')
    const src  = path.join(ART_DIR, file)
    const { data } = matter(fs.readFileSync(src, 'utf8'))
    return { slug, title: data.title ?? '', src, out: path.join(OUT_DIR, `${slug}.jpg`) }
  })

jobs.push({
  slug:  'default',
  title: cfg.tagline,
  src:   path.join(ROOT, 'lib', 'config.ts'),
  out:   path.join(OUT_DIR, 'default.jpg'),
})

const isFresh = job => {
  if (!fs.existsSync(job.out)) return false
  return fs.statSync(job.out).mtimeMs > fs.statSync(job.src).mtimeMs
}

const todo = jobs.filter(j => !isFresh(j))
const skipped = jobs.length - todo.length

if (!todo.length) {
  console.log(`✓ og: nothing to do (${skipped} card${skipped === 1 ? '' : 's'} already current)`)
  process.exit(0)
}

const browser = await chromium.launch()
const page    = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
})

for (const job of todo) {
  const html = tpl
    .replace('{{BRAND}}',  esc(cfg.blogName))
    .replace('{{TITLE}}',  esc(job.title))
    .replace('{{AUTHOR}}', esc(cfg.siteTitle))
    .replace('{{ROLE}}',   esc(cfg.authorRole))

  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: job.out, type: 'jpeg', quality: 86 })

  const kb = (fs.statSync(job.out).size / 1024).toFixed(0)
  console.log(`✓ og/${job.slug}.jpg  ${kb} KB`)
}

await browser.close()
console.log(`\n${todo.length} rendered, ${skipped} skipped.`)
