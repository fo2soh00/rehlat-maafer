'use client'
import { useRef } from 'react'

interface Props {
  label:     string            // small kicker, e.g. «سلسلة · ٥ حلقات»
  title:     React.ReactNode   // section heading
  titleLtr?: boolean
  children:  React.ReactNode   // the cards
}

/**
 * A sideways row of cards. The track scrolls inside itself (scroll-snap,
 * hidden scrollbar, swipe on phones); arrow buttons page it on desktop.
 * In RTL a negative `left` moves forward, so «التالي» scrolls by -width.
 */
export default function Scroller({ label, title, titleLtr, children }: Props) {
  const track = useRef<HTMLDivElement>(null)

  const page = (dir: 1 | -1) => {
    const el = track.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <>
      <div className="w sc-head">
        <div>
          <span className="lab">{label}</span>
          <h2 className="sc-title">{titleLtr ? <bdi dir="ltr">{title}</bdi> : title}</h2>
        </div>
        <div className="sc-arrows">
          <button type="button" onClick={() => page(1)} aria-label="السابق">→</button>
          <button type="button" onClick={() => page(-1)} aria-label="التالي">←</button>
        </div>
      </div>
      <div className="sc-track" ref={track}>{children}</div>
    </>
  )
}
