import Link from 'next/link'
import { tagByName } from '@/lib/tags'
import { warnUnknownTag } from '@/lib/articles'

interface Props {
  tag:   string
  /** Article slug — only used to name the file in the build-time warning. */
  slug?: string
}

/**
 * A tag chip. Links to its tag page when the tag is in the registry; falls
 * back to plain text (and a build-time warning) when it is not, so a stray
 * tag never produces a link to a page that does not exist.
 */
export default function TagChip({ tag, slug }: Props) {
  const known = tagByName(tag)

  if (!known) {
    if (slug) warnUnknownTag(tag, slug)
    return <span className="chip">{tag}</span>
  }

  return (
    <Link href={`/tag/${known.slug}/`} className="chip">{tag}</Link>
  )
}
