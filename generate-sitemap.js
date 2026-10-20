import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = "https://www.veereshbashetti.com";
const BLOGS_DIR = path.join(__dirname, "public", "blogs");
const MANIFEST_PATH = path.join(BLOGS_DIR, "manifest.json");
const OUTPUT = path.join(__dirname, "public", "sitemap.xml");

// Keep this in sync with the staticCategorySlugs list in vite.config.js and
// with any new categories introduced in post frontmatter.
const CATEGORY_SLUGS = ["tech", "career"];

// Only these categories are indexable (see CategoryPage.jsx). Thin or off-niche
// categories are noindex and kept out of the sitemap.
const INDEXABLE_CATEGORIES = new Set(CATEGORY_SLUGS);

const staticRoutes = [
    {
        url: "/",
        lastmod: "2026-10-19",
        priority: "1.0",
        changefreq: "daily",
    },
    {
        url: "/blog",
        lastmod: "2026-10-19",
        priority: "0.9",
        changefreq: "daily",
    },
    {
        url: "/categories",
        lastmod: "2026-10-19",
        priority: "0.8",
        changefreq: "weekly",
    },
    {
        url: "/about",
        lastmod: "2026-10-19",
        priority: "0.6",
        changefreq: "monthly",
    },
    {
        url: "/contact",
        lastmod: "2026-10-19",
        priority: "0.5",
        changefreq: "yearly",
    },
    {
        url: "/privacy-policy",
        lastmod: "2026-10-19",
        priority: "0.3",
        changefreq: "yearly",
    },
    {
        url: "/terms",
        lastmod: "2026-10-19",
        priority: "0.3",
        changefreq: "yearly",
    },
];

const formatDate = (date) => {
    return date.toISOString().split("T")[0];
};

const escapeXml = (value) => {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
};

/**
 * Converts:
 * 2026-08-07
 * "2026-08-07"
 * '2026-08-07'
 * 2026-08-07T10:30:00Z
 *
 * into:
 * 2026-08-07
 */
function normalizeDate(value) {
    if (!value) {
        return null;
    }

    const cleanedValue = value
        .trim()
        .replace(/^["']|["']$/g, "");

    // Already valid YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleanedValue)) {
        const date = new Date(`${cleanedValue}T00:00:00Z`);

        if (!Number.isNaN(date.getTime())) {
            return cleanedValue;
        }

        return null;
    }

    // Handle ISO date/time
    const date = new Date(cleanedValue);

    if (!Number.isNaN(date.getTime())) {
        return formatDate(date);
    }

    return null;
}

function getLastModified(filePath) {
    const content = fs.readFileSync(filePath, "utf8");

    // Prefer updated date
    const updatedMatch = content.match(/^updated:\s*(.+)$/m);

    if (updatedMatch) {
        const updatedDate = normalizeDate(updatedMatch[1]);

        if (updatedDate) {
            return updatedDate;
        }
    }

    // Otherwise use published date
    const dateMatch = content.match(/^date:\s*(.+)$/m);

    if (dateMatch) {
        const publishedDate = normalizeDate(dateMatch[1]);

        if (publishedDate) {
            return publishedDate;
        }
    }

    // Final fallback: file modification date
    return formatDate(fs.statSync(filePath).mtime);
}

const NOINDEX_SLUGS = new Set();
if (fs.existsSync(MANIFEST_PATH)) {
    const m = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    (m.posts || []).filter((p) => p.noindex).forEach((p) => NOINDEX_SLUGS.add(p.slug));
}

const urls = [];

// Generate static page URLs
for (const route of staticRoutes) {
    urls.push(`
    <url>
        <loc>${DOMAIN}${escapeXml(route.url)}</loc>
        <lastmod>${route.lastmod}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`);
}

// Generate category URLs
let categorySlugs = [...CATEGORY_SLUGS];

if (fs.existsSync(MANIFEST_PATH)) {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    const postCategorySlugs = (manifest.posts || [])
        .filter((post) => !post.noindex)
        .map((post) => post.category)
        .filter(Boolean)
        .map((category) => category.toLowerCase().replace(/\s+/g, "-"));

    categorySlugs = [...new Set([...categorySlugs, ...postCategorySlugs])].filter((slug) => INDEXABLE_CATEGORIES.has(slug));
}

for (const slug of categorySlugs) {
    urls.push(`
    <url>
        <loc>${DOMAIN}/category/${escapeXml(slug)}</loc>
        <lastmod>2026-10-19</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>`);
}

// Generate blog URLs
if (fs.existsSync(BLOGS_DIR)) {
    const blogFiles = fs
        .readdirSync(BLOGS_DIR)
        .filter((file) => file.endsWith(".md"))
        .sort();

    for (const file of blogFiles) {
        const slug = file.replace(/\.md$/, "");
        if (NOINDEX_SLUGS.has(slug)) continue;
        const filePath = path.join(BLOGS_DIR, file);
        const lastModified = getLastModified(filePath);

        urls.push(`
    <url>
        <loc>${DOMAIN}/blog/${escapeXml(slug)}</loc>
        <lastmod>${lastModified}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`);
    }
} else {
    console.error(`❌ Blog directory not found: ${BLOGS_DIR}`);
    process.exit(1);
}

// Generate complete sitemap
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

// Write sitemap
fs.writeFileSync(OUTPUT, sitemap, "utf8");

console.log("✅ Sitemap generated successfully");
console.log(`📄 Total URLs: ${urls.length}`);
console.log(`📍 Saved to: ${OUTPUT}`);

// ───────────────────────────────────────────────────────────
// RSS feed — built from the manifest, indexable posts only
// ───────────────────────────────────────────────────────────
if (fs.existsSync(MANIFEST_PATH)) {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
    const feedPosts = (manifest.posts || [])
        .filter((post) => !post.noindex && post.date)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 30);

    const items = feedPosts
        .map((post) => `
  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${DOMAIN}/blog/${escapeXml(post.slug)}</link>
    <guid>${DOMAIN}/blog/${escapeXml(post.slug)}</guid>
    <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
    <description>${escapeXml(post.description || post.excerpt || "")}</description>
  </item>`)
        .join("\n");

    const lastBuild = feedPosts.length
        ? new Date(`${feedPosts[0].date}T00:00:00Z`).toUTCString()
        : new Date().toUTCString();

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Veeresh Bashetti — Python, Django &amp; React Guides</title>
  <link>${DOMAIN}</link>
  <description>Practical Python, Django, React and SQL guides for beginner developers.</description>
  <language>en-in</language>
  <lastBuildDate>${lastBuild}</lastBuildDate>
  <atom:link href="${DOMAIN}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>
`;
    fs.writeFileSync(path.join(__dirname, "public", "rss.xml"), rss, "utf8");
    console.log(`📡 RSS feed generated (${feedPosts.length} posts)`);
}
