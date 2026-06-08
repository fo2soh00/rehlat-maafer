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
        paper:          '#FAF7F0',   // warm paper — main background
        card:           '#FFFFFF',   // white — card backgrounds
        ink:            '#15130F',   // near-black — main text
        'ink-mid':      '#4E4636',   // warm grey-brown — secondary text
        'ink-light':    '#938775',   // light taupe — meta, dates, captions
        accent:         '#2C4A6E',   // navy — titles, links, active nav
        'accent-soft':  'rgba(44,74,110,0.10)',  // navy tint — chip background
        accent2:        '#8E2B20',   // oxblood — dot, borders, "read" link
        'accent2-soft': 'rgba(142,43,32,0.08)',
        rule:           '#E2DACA',   // hairline rule
        'rule-strong':  '#D2C8B2',   // stronger rule (header border)
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
