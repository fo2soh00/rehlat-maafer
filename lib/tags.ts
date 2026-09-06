/**
 * Tag registry. `name` must match the `tag` value in article front matter
 * exactly — that string is what Decap writes and what the chip displays.
 * A tag that is not listed here still renders, but as plain text, not a link.
 */
export const TAGS = [
  { slug: 'ai',         name: 'ذكاء اصطناعي' },
  { slug: 'building',   name: 'بناء' },
  { slug: 'leadership', name: 'قيادة' },
] as const

export type Tag     = (typeof TAGS)[number]
export type TagSlug = Tag['slug']

export function tagBySlug(slug: string): Tag | undefined {
  return TAGS.find(t => t.slug === slug)
}

export function tagByName(name: string): Tag | undefined {
  return TAGS.find(t => t.name === name)
}
