/**
 * Tag registry. `name` must match the `tag` value in article front matter
 * exactly — that string is what Decap writes and what the chip displays.
 * A tag that is not listed here still renders, but as plain text, not a link.
 */
export const TAGS = [
  // `blurb` is the one-line description under the home pillar scroller.
  { slug: 'ai',         name: 'ذكاء اصطناعي', blurb: '' },
  { slug: 'building',   name: 'بناء',         blurb: '' },
  { slug: 'leadership', name: 'قيادة',        blurb: 'الفريق، المسؤولية، والثقافة' },
] as const

export type Tag     = (typeof TAGS)[number]
export type TagSlug = Tag['slug']

export function tagBySlug(slug: string): Tag | undefined {
  return TAGS.find(t => t.slug === slug)
}

export function tagByName(name: string): Tag | undefined {
  return TAGS.find(t => t.name === name)
}
