# AdSense "Low value content" fix: what changed (19 Oct 2026)

## Site focus
- Homepage, About, footer, meta tags and llms.txt now describe one niche: practical Python, Django, React and SQL guides for beginner developers.
- Removed the Home Decor / Travel / Food / Pinterest / Product Reviews messaging, the Unsplash stock image and the Pinterest follow buttons (replaced with GitHub).

## Thin and off-topic content
- 15 off-niche posts (life lessons, finance, movie review, two workplace essays) are flagged `"noindex": true` in `public/blogs/manifest.json`.
  They still open by direct URL, send `noindex, follow`, and are hidden from the homepage, /blog, categories, sitemap, RSS and AMP.
  To bring one back, delete its `noindex` line.
- Only `tech` and `career` category pages are indexable and in the sitemap. Others send `noindex`.
- The 5 Pinterest affiliate reviews were never in the manifest; they stay unlinked. `/blogs/` is now disallowed in robots.txt.

## Technical SEO
- Every `https://veereshbashetti.com` link (non-www) changed to `https://www.veereshbashetti.com` in src, posts and config.
- vercel.json: permanent redirect from non-www to www.
- New `src/components/SEO.jsx` + router wiring: About, Blog, Categories, Privacy, Terms, Sitemap and Saved now prerender their own title, description and canonical (before, they all shipped the same title and no canonical).
- Removed the static robots meta and `<title>` from index.html (they conflicted with per-page tags).
- manifest.json: added the missing `learn-to-say-no-workplace-boundaries` entry and filled the missing `date` fields.
- generate-sitemap.js: current lastmod dates, /contact added, noindex posts and thin categories excluded, and it now also regenerates `public/rss.xml`.
- generate-amp.mjs skips noindex posts.
- robots.txt explicitly allows Mediapartners-Google (the AdSense crawler).

## New
- /contact page (src/pages/Contact.jsx), linked from the footer and homepage. Check the reply-time wording and edit if needed.

## Build
`npm install` then `npm run build`. Tested with a clean install: build passes and 25 AMP pages are generated.
