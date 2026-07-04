import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = "https://www.veereshbashetti.com/";

const blogsDir = path.join(__dirname, "public", "blogs");

const files = fs
    .readdirSync(blogsDir)
    .filter((file) => file.endsWith(".md"));

const staticRoutes = [
    "/",
    "/blog",
    "/categories",
    "/about",
    "/privacy-policy",
    "/terms",
];

const urls = [
    ...staticRoutes.map(
        (route) => `
  <url>
    <loc>${DOMAIN}${route}</loc>
  </url>`
    ),

    ...files.map((file) => {
        const slug = file.replace(".md", "");

        return `
  <url>
    <loc>${DOMAIN}/blog/${slug}</loc>
  </url>`;
    }),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

fs.writeFileSync(
    path.join(__dirname, "public", "sitemap.xml"),
    sitemap
);

console.log(`✅ Sitemap generated with ${urls.length} URLs`);