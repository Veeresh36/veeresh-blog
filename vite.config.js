import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import fs from "fs";
import path from "path";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),

        visualizer({
            filename: "stats.html",
            open: false,
            gzipSize: true,
            brotliSize: true,
        }),
    ],

    build: {
        target: "es2020",
        cssCodeSplit: true,
        chunkSizeWarningLimit: 1000,
    },

    server: {
        proxy: {
            "/api/claude": {
                target: "https://api.anthropic.com",
                changeOrigin: true,
                rewrite: () => "/v1/messages",
            },
        },
    },

    ssgOptions: {
        includedRoutes(paths) {
            const manifestPath = path.resolve(__dirname, "public/blogs/manifest.json");
            const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

            const blogPaths = manifest.posts.map((post) => `/blog/${post.slug}`);

            // Category slugs actually linked to across the site (footer, About, Sitemap,
            // and the /category/:slug links generated from each post's category field).
            // Keep this in sync with the CATEGORY_SLUGS list in generate-sitemap.js and
            // with any new categories introduced in post frontmatter.
            const staticCategorySlugs = [
                "career",
                "life-lessons",
                "pinterest-picks",
                "finance",
                "tech",
                "lifestyle",
                "personal-growth",
            ];

            const postCategorySlugs = manifest.posts
                .map((post) => post.category)
                .filter(Boolean)
                .map((category) => category.toLowerCase().replace(/\s+/g, "-"));

            const categorySlugs = [...new Set([...staticCategorySlugs, ...postCategorySlugs])];
            const categoryPaths = categorySlugs.map((slug) => `/category/${slug}`);

            return [...paths, ...blogPaths, ...categoryPaths];
        },
    },
});