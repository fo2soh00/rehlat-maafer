'use client'

import { useEffect, useRef, useState } from 'react'

export interface GalleryItem {
  image:    string
  caption?: string
}

interface Props {
  items: GalleryItem[]
  alt:   string   // article title — used as the img alt when an item has no caption
}

export default function Gallery({ items, alt }: Props) {
  const trackRef  = useRef<HTMLDivElement>(null)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const [current, setCurrent] = useState(0)

  const count = items?.length ?? 0

  // Track the visible slide by observing the slides themselves. Measuring
  // scrollLeft would be wrong here: browsers disagree on its sign in RTL.
  useEffect(() => {
    if (count < 2) return
    const root = trackRef.current
    if (!root || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          const i = slideRefs.current.indexOf(entry.target as HTMLDivElement)
          if (i >= 0) setCurrent(i)
        })
      },
      { root, threshold: 0.6 },
    )

    slideRefs.current.forEach(el => el && io.observe(el))
    return () => io.disconnect()
  }, [count])

  if (!count) return null

  // Single image: no arrows, no dots — same treatment as the cover.
  if (count === 1) {
    const only = items[0]
    return (
      <div className="gallery gallery-single">
        <img className="art-cover" src={only.image} alt={only.caption || alt} loading="lazy" />
        {only.caption && <p className="gallery-cap">{only.caption}</p>}
      </div>
    )
  }

  // Direction-agnostic — correct in both LTR and RTL, unlike scrollBy/scrollLeft.
  const goTo = (i: number) => {
    const target = Math.max(0, Math.min(count - 1, i))
    slideRefs.current[target]?.scrollIntoView({
      behavior: 'smooth',
      block:    'nearest',
      inline:   'center',
    })
    setCurrent(target)
  }

  return (
    <div className="gallery">
      <div
        className="gallery-track"
        ref={trackRef}
        tabIndex={0}
        aria-roledescription="carousel"
        aria-label={alt}
      >
        {items.map((item, i) => (
          <div
            className="gallery-slide"
            key={`${item.image}-${i}`}
            ref={el => { slideRefs.current[i] = el }}
            aria-roledescription="slide"
            aria-label={`صورة رقم ${i + 1} من ${count}`}
          >
            <img src={item.image} alt={item.caption || alt} loading="lazy" />
            {item.caption && <p className="gallery-cap">{item.caption}</p>}
          </div>
        ))}
      </div>

      {/* RTL: the next slide sits to the left, so ← is "next" and → is "previous". */}
      <button
        type="button"
        className="gallery-nav gallery-next"
        aria-label="الصورة التالية"
        onClick={() => goTo(current + 1)}
        disabled={current >= count - 1}
      >
        ←
      </button>
      <button
        type="button"
        className="gallery-nav gallery-prev"
        aria-label="الصورة السابقة"
        onClick={() => goTo(current - 1)}
        disabled={current <= 0}
      >
        →
      </button>

      <div className="gallery-dots">
        {items.map((_, i) => (
          <button
            type="button"
            key={i}
            className={`gallery-dot${i === current ? ' is-active' : ''}`}
            aria-label={`صورة رقم ${i + 1}`}
            aria-current={i === current}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  )
}
