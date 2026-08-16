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
        ink:            '#15130F',   // near-black — main text
        'ink-mid':      '#2B2722',   // warm dark — secondary text
        'ink-light':    '#2C4A6E',   // navy — meta, dates, captions
        accent:         '#2C4A6E',   // navy — titles, links, active nav
        'accent-soft':  'rgba(44,74,110,0.10)',  // navy tint — chip background
        accent2:        '#D97757',   // Claude orange — dots, borders (decoration only)
        'accent2-soft': 'rgba(217,119,87,0.10)',
        'accent2-text': '#B24A28',   // darkened orange — accent words in text
        sky:            '#6CABDD',   // Man City sky — surfaces
        'sky-tint':     'rgba(108,171,221,0.16)',
        mustard:        '#E8A23D',   // list bullets
        rule:           'rgba(108,171,221,0.34)',   // hairline rule
        'rule-strong':  'rgba(108,171,221,0.55)',   // stronger rule (header border)
      },
      fontFamily: {
        // Loaded via Google Fonts <link> in app/layout.tsx (NOT next/font)
        rakkas: ['"Rakkas"', 'serif'],     // headlines, pull quotes, brand
        cairo:  ['"Cairo"',  'sans-serif'], // body, UI labels, meta
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
