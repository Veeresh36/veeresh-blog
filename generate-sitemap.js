import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = "https://www.veereshbashetti.com";
const BLOGS_DIR = path.join(__dirname, "public", "blogs");
const OUTPUT = path.join(__dirname, "public", "sitemap.xml");

const staticRoutes = [
    {
        url: "/",
        priority: "1.0",
        changefreq: "daily",
    },
    {
        url: "/blog",
        priority: "0.9",
        changefreq: "daily",
    },
    {
        url: "/categories",
        priority: "0.8",
        changefreq: "weekly",
    },
    {
        url: "/about",
        priority: "0.6",
        changefreq: "monthly",
    },
    {
        url: "/privacy-policy",
        priority: "0.3",
        changefreq: "yearly",
    },
    {
        url: "/terms",
        priority: "0.3",
        changefreq: "yearly",
    },
];

const formatDate = (date) => date.toISOString().split("T")[0];

const escapeXml = (str) =>
    str.replace(/[<>&'"]/g, (char) => {
        switch (char) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "'":
                return "&apos;";
            case '"':
                return "&quot;";
            default:
                return char;
        }
    });

const urls = [];

// Static pages
for (const route of staticRoutes) {
    urls.push(`
    <url>
        <loc>${DOMAIN}${escapeXml(route.url)}</loc>
        <lastmod>${formatDate(new Date())}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>`);
}

// Blog posts
const blogFiles = fs
    .readdirSync(BLOGS_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort();

for (const file of blogFiles) {
    const slug = file.replace(".md", "");
    const filePath = path.join(BLOGS_DIR, file);

    const stats = fs.statSync(filePath);

    urls.push(`
    <url>
        <loc>${DOMAIN}/blog/${escapeXml(slug)}</loc>
        <lastmod>${formatDate(stats.mtime)}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

fs.writeFileSync(OUTPUT, sitemap, "utf8");

console.log(`✅ Sitemap generated successfully`);
console.log(`📄 Total URLs: ${urls.length}`);
console.log(`📍 Saved to: ${OUTPUT}`);