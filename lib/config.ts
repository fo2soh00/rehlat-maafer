/**
 * ── Blog Configuration ──────────────────────────────────────────────────
 * Edit this file to change the blog name, tagline, author details, and links.
 * This is the ONLY file you need to touch for personal details.
 */

export const BLOG_CONFIG = {
  blogName:  'رحلة معافر',
  siteTitle: 'مصطفى فؤاد',

  // ↓ Canonical origin — used by metadataBase, sitemap, RSS and JSON-LD.
  siteUrl:   'https://moustafafouad.com',
  // ← Moustafa may replace this line
  tagline:   'يوميات مؤسس بيبني، بحلوها ومرّها',

  // ↓ Author identity. authorRole shows in the author strip and the footer;
  //   authorBio is About-page only since Part C dropped the home sidebar.
  // ← Moustafa may replace this line
  authorRole: 'رائد أعمال و معافر · الرياض',
  // ← Moustafa may replace this line
  authorBio:  'بديت صيدلي، بس اخترت أبني. هنا بكتب عن رحلة البناء بحلوها ومرّها، الأيام الصعبة، الانتصارات الصغيرة، واللي بتتعلمه في الطريق.',

  // Home + tag pages: every Nth item in the list is a full card (thumbnail if
  // it has a cover), the rest are compact rows.
  cardEvery: 4,

  // ↓ Your contact links
  linkedin:  'https://www.linkedin.com/in/moustafa-fouad-81646b2b6/',
  whatsapp:  'https://wa.me/message/7CRHXZWXN44PI1',
  email:     'm.fouad@greenolasa.com',
} as const
