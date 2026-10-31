'use client'
import { useEffect, useRef, useState } from 'react'

export interface FilterOption {
  key:   string   // 'all' or a tag slug
  label: string
  count: string   // already in Arabic-Indic digits
}

interface Props {
  options: FilterOption[]
  /** CSS selector of the region whose items/sections are filtered. */
  scope:   string
}

/**
 * Client-side pillar filter for the home page.
 *
 * Every filterable item carries `data-t="<tag slug>"`; every section that holds
 * such items carries `data-fsec`. Picking a pillar hides the other pillars'
 * items across the whole page and hides any section left empty. The choice is
 * mirrored in `?t=<slug>` so a filtered home can be shared; with JS off the
 * page simply shows everything (the /tag/<slug>/ pages still exist).
 */
export default function HomeFilter({ options, scope }: Props) {
  const [active, setActive] = useState('all')
  const anchor = useRef<HTMLDivElement>(null)

  const apply = (key: string) => {
    const root = document.querySelector(scope)
    if (!root) return
    root.querySelectorAll<HTMLElement>('[data-t]').forEach(el => {
      el.classList.toggle('is-gone', key !== 'all' && el.dataset.t !== key)
    })
    root.querySelectorAll<HTMLElement>('[data-fsec]').forEach(sec => {
      const items = Array.from(sec.querySelectorAll<HTMLElement>('[data-t]'))
      sec.classList.toggle('is-gone', items.length > 0 && items.every(i => i.classList.contains('is-gone')))
    })
  }

  // The bar sticks right under the topbar, whose height changes with width.
  useEffect(() => {
    const set = () => {
      const h = document.querySelector<HTMLElement>('.topbar')?.offsetHeight
      if (h) document.documentElement.style.setProperty('--topbar-h', `${h}px`)
    }
    set()
    window.addEventListener('resize', set)
    return () => window.removeEventListener('resize', set)
  }, [])

  // Initial state from the URL (?t=ai|building|leadership).
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('t')
    if (t && options.some(o => o.key === t)) { setActive(t); apply(t) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const choose = (key: string) => {
    setActive(key)
    apply(key)

    const url = new URL(window.location.href)
    if (key === 'all') url.searchParams.delete('t')
    else url.searchParams.set('t', key)
    window.history.replaceState(null, '', url.pathname + url.search + url.hash)

    // Bring the bar back to the top of the viewport, under the topbar.
    const top = anchor.current
    if (top) {
      const bar = document.querySelector<HTMLElement>('.topbar')?.offsetHeight ?? 0
      const y   = top.getBoundingClientRect().top + window.scrollY - bar
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (window.scrollY > y) window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
    }
  }

  return (
    <>
      <div ref={anchor} aria-hidden="true" />
      <div className="hf" role="group" aria-label="تصفية حسب المحور">
        <div className="hf-in">
          {options.map(o => (
            <button
              key={o.key}
              type="button"
              className={`hf-b${o.key !== 'all' ? ` hf-${o.key}` : ''}`}
              aria-pressed={active === o.key}
              onClick={() => choose(o.key)}
            >
              {o.label} <em>{o.count}</em>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
