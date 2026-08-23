#!/usr/bin/env node
/**
 * generate-amp.mjs
 * Generates real, valid AMP HTML documents from your existing
 * Markdown blog posts at public/blogs/*.md.
 *
 * Handles:
 * - ::youtube[ID]{caption="..."} shortcode -> real <amp-youtube>
 * - Strips a duplicate leading "# Title" heading from the body,
 *   since the page header already renders the title once from
 *   frontmatter.
 */

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const SITE_URL = "https://www.veereshbashetti.com";
const AUTHOR_DEFAULT = "Veeresh Bashetti";
const AD_CLIENT = "ca-pub-1349373945527283"; // verify this

const POSTS_DIR = path.resolve("public/blogs");
const OUTPUT_DIR = path.resolve("dist/amp/blog");

function escapeHtml(str = "") {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function resolveSlug(frontmatter, filename) {
    if (frontmatter.slug) return frontmatter.slug;
    return filename.replace(/\.md$/i, "");
}

function stripLeadingH1(md) {
    const trimmed = md.replace(/^\s+/, "");
    const match = trimmed.match(/^#{1}[^\S\r\n][^\r\n]*\r?\n+/);
    if (match) {
        return trimmed.slice(match[0].length);
    }
    return md;
}

function convertYoutubeShortcodesInHtml(html) {
    const wrapped = /<p>::youtube\[([^\]]+)\]\{caption=(?:"([^"]*)"|'([^']*)')\}<\/p>/g;
    const bare = /::youtube\[([^\]]+)\]\{caption=(?:"([^"]*)"|'([^']*)')\}/g;

    const render = (videoId, capDouble, capSingle) => {
        const caption = capDouble ?? capSingle ?? "";
        const safeCaption = escapeHtml(caption);
        return `<amp-youtube data-videoid="${escapeHtml(videoId)}" layout="responsive" width="480" height="270"></amp-youtube>${safeCaption ? `<p class="amp-video-caption">${safeCaption}</p>` : ""}`;
    };

    let result = html.replace(wrapped, (full, videoId, capDouble, capSingle) => render(videoId, capDouble, capSingle));
    result = result.replace(bare, (full, videoId, capDouble, capSingle) => render(videoId, capDouble, capSingle));
    return result;
}

function ampPageTemplate({ slug, frontmatter, htmlBody }) {
    const title = escapeHtml(frontmatter.title || slug);
    const description = escapeHtml(
        frontmatter.excerpt || frontmatter.description || frontmatter.subtitle || ""
    );
    const author = frontmatter.author || AUTHOR_DEFAULT;
    const category = frontmatter.category || "Blog";
    const image = frontmatter.image || `${SITE_URL}/og-image.png`;
    const dateISO = frontmatter.date ? new Date(frontmatter.date).toISOString() : new Date().toISOString();
    const canonical = `${SITE_URL}/blog/${slug}`;

    return `<!doctype html>
<html amp lang="en-IN">
<head>
  <meta charset="utf-8" />
  <title>${title} | ${escapeHtml(author)}</title>
  <link rel="canonical" href="${canonical}" />
  <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="description" content="${description}" />
  <meta name="author" content="${escapeHtml(author)}" />

  <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
  <noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  <script async src="https://cdn.ampproject.org/v0.js"></script>

  <script async custom-element="amp-auto-ads"
    src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js">
  </script>

  <script async custom-element="amp-img"
    src="https://cdn.ampproject.org/v0/amp-img-0.1.js"></script>

  <script async custom-element="amp-youtube"
    src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js"></script>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap"
  />

  <style amp-custom>
    body {
      font-family: 'Outfit', sans-serif;
      background: #FAF9F5;
      color: #1A1612;
      margin: 0;
      padding: 0 16px 48px;
    }
    .amp-wrap { max-width: 720px; margin: 0 auto; }
    .amp-eyebrow { font-size: 0.75rem; font-weight: 600; color: #7A6E65; margin-top: 24px; }
    h1 {
      font-family: 'DM Serif Display', serif;
      font-size: 2rem;
      line-height: 1.15;
      margin: 8px 0 16px;
    }
    .amp-meta { font-size: 0.8rem; color: #7A6E65; margin-bottom: 20px; }
    .amp-content { font-size: 1rem; line-height: 1.7; }
    .amp-content p { margin: 0 0 1.2em; }
    .amp-content h2 { font-family: 'DM Serif Display', serif; font-size: 1.4rem; margin: 1.6em 0 0.6em; }
    .amp-content h3 { font-size: 1.15rem; margin: 1.4em 0 0.5em; }
    .amp-content ul, .amp-content ol { margin: 0 0 1.2em; padding-left: 1.4em; }
    .amp-content img { max-width: 100%; height: auto; }
    .amp-content code { background: #F4EFE6; padding: 0.15em 0.4em; border-radius: 4px; }
    .amp-content pre { background: #1A1612; color: #FAF9F5; padding: 1em; border-radius: 8px; overflow-x: auto; }
    .amp-content amp-youtube { margin: 1.2em 0 0.4em; }
    .amp-video-caption { font-size: 0.8rem; color: #7A6E65; text-align: center; margin: 0 0 1.4em; }
    a { color: #E60023; }
  </style>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": ${JSON.stringify(frontmatter.title || "")},
    "description": ${JSON.stringify(description)},
    "image": ${JSON.stringify(image)},
    "datePublished": ${JSON.stringify(dateISO)},
    "author": { "@type": "Person", "name": ${JSON.stringify(author)} },
    "mainEntityOfPage": ${JSON.stringify(canonical)}
  }
  </script>
</head>
<body>
  <div class="amp-wrap">
    <p class="amp-eyebrow">${escapeHtml(category)}</p>
    <h1>${title}</h1>
    <p class="amp-meta">${escapeHtml(author)} - ${new Date(dateISO).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</p>

    ${frontmatter.image ? `<amp-img
      src="${escapeHtml(frontmatter.image)}"
      width="720"
      height="405"
      layout="responsive"
      alt="${title}">
    </amp-img>` : ""}

    <div class="amp-content">
      ${htmlBody}
    </div>
  </div>

  <amp-auto-ads type="adsense"
    data-ad-client="${AD_CLIENT}">
  </amp-auto-ads>
</body>
</html>
`;
}

async function main() {
    let files;
    try {
        files = (await readdir(POSTS_DIR)).filter((f) => f.toLowerCase().endsWith(".md"));
    } catch (err) {
        console.error(`Could not read posts directory at ${POSTS_DIR}`);
        console.error(err.message);
        process.exit(1);
    }

    if (files.length === 0) {
        console.warn(`No .md files found in ${POSTS_DIR} - nothing to generate.`);
        return;
    }

    await mkdir(OUTPUT_DIR, { recursive: true });

    let count = 0;
    for (const filename of files) {
        const raw = await readFile(path.join(POSTS_DIR, filename), "utf-8");
        const { data: frontmatter, content } = matter(raw);
        const slug = resolveSlug(frontmatter, filename);

        const strippedContent = stripLeadingH1(content);
        const rawHtml = marked.parse(strippedContent);
        const htmlBody = convertYoutubeShortcodesInHtml(rawHtml);

        const html = ampPageTemplate({ slug, frontmatter, htmlBody });
        const outPath = path.join(OUTPUT_DIR, `${slug}.html`);
        await writeFile(outPath, html, "utf-8");
        count++;
    }

    console.log(`Generated ${count} AMP page(s) in ${path.relative(process.cwd(), OUTPUT_DIR)}`);
    console.log(`Remember: each React blog post page should link to its AMP twin via`);
    console.log(`<link rel="amphtml" href="${SITE_URL}/amp/blog/<slug>.html" /> in its <head>.`);
}

main();

