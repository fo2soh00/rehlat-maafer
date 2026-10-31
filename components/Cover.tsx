import Link from 'next/link'
import { tagByName } from '@/lib/tags'
import { BLOG_CONFIG } from '@/lib/config'
import { arabicDigits } from '@/lib/format'

/**
 * A designed cover drawn in code — no image file. The art is a function of
 * the pillar (tag) and is laid out from a PRNG seeded by the article slug, so
 * every cover differs but the same article draws the same cover every build.
 *
 *   ذكاء اصطناعي → network of connected dots on navy→ink
 *   بناء          → rising bars + dashed growth line on orange
 *   قيادة         → rings around an orange centre + people dots on sky→navy
 */

export type CoverSize = 'xl' | 'm' | 's'

interface Props {
  slug:     string
  title:    string
  tag:      string
  episode?: number
  size:     CoverSize
  /** When given, the title is the item's link (whole-item click via ::after). */
  href?:    string
  /** Heading level for the title; article page passes 'p' (h1 lives below). */
  as?:      'h2' | 'h3' | 'p'
}

// FNV-1a → mulberry32. Small, deterministic, no dependency.
function seedOf(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}
function rng(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6D2B79F5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const r1 = (n: number) => Math.round(n * 10) / 10

type Pillar = 'ai' | 'building' | 'leadership'

function ArtAI({ rand }: { rand: () => number }) {
  // Nodes kept in the upper/left part so the title (bottom, right) stays clear.
  const n = 11
  const pts = Array.from({ length: n }, () => ({
    x: r1(20 + rand() * 360), y: r1(16 + rand() * 150),
    r: [3, 4, 6, 9][Math.floor(rand() * 4)], c: ['d1', 'd2', 'd3'][Math.floor(rand() * 3)],
  }))
  const lines: [number, number][] = []
  for (let i = 0; i < n; i++) { if (i + 1 < n) lines.push([i, i + 1]); if (i + 2 < n) lines.push([i, i + 2]) }
  return (
    <>
      <g className="ln">{lines.map(([a, b], i) => <line key={i} x1={pts[a].x} y1={pts[a].y} x2={pts[b].x} y2={pts[b].y} />)}</g>
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r} className={p.c} />)}
    </>
  )
}

function ArtBuilding({ rand }: { rand: () => number }) {
  const bars = 7, w = 26, gap = 14, x0 = 18
  let h = 30 + rand() * 20
  const tops: { x: number; y: number }[] = []
  const rects = Array.from({ length: bars }, (_, i) => {
    h = Math.min(220, h + 8 + rand() * 26)
    const x = x0 + i * (w + gap), y = 250 - h
    tops.push({ x: x + w / 2, y: r1(y - 10 - rand() * 12) })
    return <rect key={i} x={x} y={r1(y)} width={w} height={r1(h)} rx="3" className={i === bars - 1 ? 'b2' : 'b1'} />
  })
  return (
    <>
      {rects}
      <polyline className="tr" points={tops.map(t => `${t.x},${t.y}`).join(' ')} />
      <circle cx={tops[bars - 1].x} cy={tops[bars - 1].y} r="6" className="tip" />
    </>
  )
}

function ArtLeadership({ rand }: { rand: () => number }) {
  const cx = r1(70 + rand() * 140), cy = r1(60 + rand() * 60)
  const people = Array.from({ length: 6 }, () => {
    const a = rand() * Math.PI * 2, d = 40 + rand() * 70
    return { x: r1(cx + Math.cos(a) * d), y: r1(cy + Math.sin(a) * d) }
  })
  return (
    <>
      {[30, 60, 95, 135].map(r => <circle key={r} cx={cx} cy={cy} r={r} className="rg" />)}
      <circle cx={cx} cy={cy} r="12" className="core" />
      {people.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="7" className="pp" />)}
    </>
  )
}

export default function Cover({ slug, title, tag, episode, size, href, as = 'h3' }: Props) {
  const pillar = (tagByName(tag)?.slug ?? 'ai') as Pillar
  const rand   = rng(seedOf(slug))
  const Title  = as

  return (
    <div className={`cv cv-${size} cv-${pillar}`}>
      <svg className="cv-art" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        {pillar === 'ai' && <ArtAI rand={rand} />}
        {pillar === 'building' && <ArtBuilding rand={rand} />}
        {pillar === 'leadership' && <ArtLeadership rand={rand} />}
      </svg>
      <span className="cv-pill">{tag}</span>
      {typeof episode === 'number' && <span className="cv-ep">الحلقة {arabicDigits(episode)}</span>}
      <Title className="cv-title">{href ? <Link href={href}>{title}</Link> : title}</Title>
      <span className="cv-sig" aria-hidden="true"><bdi dir="ltr">{BLOG_CONFIG.blogName}</bdi><i /></span>
    </div>
  )
}
