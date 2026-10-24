/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // ─── Design System Tokens (رحلة معافر) ───────────────────────────
      colors: {
        paper:          '#FFFFFF',   // white — main background
        card:           '#FFFFFF',   // white — card backgrounds
        ink:            '#111111',   // near-black — headlines, body lead
        'ink-mid':      '#2B2B2B',   // body text
        'ink-light':    '#5A5A5A',   // grey — meta, dates, captions (7.0:1 on white)
        accent:         '#111111',   // ink — titles, links, active nav
        'accent-soft':  'rgba(17,17,17,0.06)',   // ink tint — chip background
        accent2:        '#E63946',   // THE red — dots, borders, bullets, underlines (large/decoration only)
        'accent2-soft': 'rgba(230,57,70,0.08)',
        'accent2-text': '#C22D39',   // red that carries body-size text (5.4:1)
        sky:            '#E63946',   // legacy name — red underline
        'sky-tint':     'rgba(230,57,70,0.08)',
        mustard:        '#E63946',   // legacy name — red list bullets
        rule:           '#E6E6E6',   // hairline rule
        'rule-strong':  '#111111',   // strong divider (header border)
      },
      fontFamily: {
        // Self-hosted by next/font in app/layout.tsx, exposed as CSS variables.
        cairo:  ['var(--font-cairo)',  'sans-serif'], // everything — headlines at 800, body 400–700
      },
      maxWidth: {
        shell:   '1080px',  // home + header inner width
        wrap:    '1000px',  // about page width
        reading: '720px',   // article reading column
      },
    },
  },
  plugins: [],
}
