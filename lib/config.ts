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
  tagline:   'يوميات مؤسس بيبني — بحلوها ومرّها',

  // ↓ Author identity (shown on the home author card + about page)
  authorRole: 'مؤسس ستارت أب · الرياض',
  authorBio:  'بديت صيدلي، بس اخترت أبني. هنا بكتب عن رحلة البناء بحلوها ومرّها — الأيام الصعبة، الانتصارات الصغيرة، واللي بتتعلمه في الطريق.',

  // ↓ Home page streams. Every article's `tag` must appear in exactly one
  //   stream or the article vanishes from the front page. The second tag in
  //   each list is a legacy value written before Decap constrained the field
  //   to three options — keep them until the old posts are re-tagged.
  streams: [
    { key: 'method',  label: 'الطريقة', tags: ['ذكاء اصطناعي', 'الذكاء الاصطناعي'] },
    { key: 'journey', label: 'الرحلة',  tags: ['بناء', 'قيادة', 'تسويق'] },
  ],

  // ↓ Your contact links
  linkedin:  'https://www.linkedin.com/in/moustafa-fouad-81646b2b6/',
  whatsapp:  'https://wa.me/message/7CRHXZWXN44PI1',
  email:     'm.fouad@greenolasa.com',
} as const
