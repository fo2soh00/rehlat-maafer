# مصطفى فؤاد — Personal Blog (Next.js)

A warm, journal-style Arabic blog. You write `.md` files, everything else handles itself.

---

## First-Time Setup (run once)

Open this folder in Terminal or Claude Code, then run:

```bash
npm install
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Adding a New Article

1. Create a new file in `content/articles/`
2. Name it: `YYYY-MM-DD-short-title.md`  
   Example: `2026-06-15-sabr-wel-bena.md`

3. Paste this header at the top of the file:

```
---
title: "عنوان المقال"
subtitle: "جملة فرعية توضح أكتر"
date: "2026-06-15"
date_ar: "١٥ يونيو ٢٠٢٦"
tag: "بناء"
readTime: "٥ دقايق"
excerpt: "جملة واحدة بتظهر في الصفحة الرئيسية — اجعلها مثيرة للاهتمام."
---
```

4. Write your article below the `---` line, in normal Arabic text.

5. Save. The dev server auto-refreshes — the article appears immediately.

---

## Formatting in Articles

| Format | What to write |
|--------|--------------|
| Normal paragraph | Just write. Leave a blank line between paragraphs. |
| Pull quote (blockquote) | Start line with `> ` |
| Section heading | Start line with `### ` |
| **Bold** | Wrap in `**double stars**` |

---

## Customizing Your Info

Everything personal is in one file: **`lib/config.ts`**

```typescript
export const BLOG_CONFIG = {
  blogName:  'اسم المدونة — قريباً',   // ← change this when you decide on a name
  siteTitle: 'مصطفى فؤاد',
  tagline:   'يوميات مؤسس بيبني وسط الصعوبات',
  linkedin:  '...',
  whatsapp:  '...',
  email:     '...',
}
```

---

## Colors & Fonts (Design System)

Defined in two places:

| File | What's in it |
|------|-------------|
| `tailwind.config.js` | Color names (`text-accent`, `bg-bg`, etc.) |
| `app/globals.css` | CSS variables + article body styles |

The palette:
- **#F3EDE0** — warm cream (background)
- **#1C1208** — deep brown-black (main text)
- **#B8401A** — burnt sienna (accent, links, tags)
- **Amiri** — headlines, pull quotes (serif, literary)
- **Cairo** — body text, labels, meta (clean sans)

---

## Deploying to Cloudflare Pages

Deploys run automatically on every push to `main` via GitHub Actions
(`.github/workflows/deploy.yml`): it runs `npm ci` → `npm run build` →
`wrangler pages deploy out --project-name=moustafafouad --branch=main`.

Requires two GitHub repo secrets (Settings → Secrets and variables → Actions):
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN` (Cloudflare → My Profile → API Tokens → "Edit Cloudflare Workers")

Every time you push a new article → the Action builds and publishes to Cloudflare Pages (live at moustafafouad.com).

---

## Project Structure

```
blog-nextjs/
├── app/                     — Next.js pages
│   ├── layout.tsx           — Root layout (fonts, header, footer)
│   ├── page.tsx             — Home (article list)
│   ├── about/page.tsx       — About you
│   └── articles/[slug]/     — Individual article page
├── components/              — Reusable UI
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ArticleCard.tsx
├── content/articles/        — ← YOUR MARKDOWN FILES GO HERE
├── lib/
│   ├── articles.ts          — Markdown file reader (don't edit)
│   └── config.ts            — ← YOUR PERSONAL DETAILS (edit this)
└── app/globals.css          — Design tokens + article styles
```
