import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

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
});