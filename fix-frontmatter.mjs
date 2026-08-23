#!/usr/bin/env node
/**
 * fix-frontmatter.mjs
 * One-time cleanup: fixes frontmatter blocks that use "*" for list
 * items instead of the YAML-standard "-". Only touches the
 * frontmatter block (between the first two --- lines) - never
 * touches the article body below it.
 */

import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";

const POSTS_DIR = path.resolve("public/blogs");

function fixFrontmatterStars(raw) {
    const lines = raw.split(/\r\n|\n/);
    const delimiterIndexes = [];
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim() === "---") {
            delimiterIndexes.push(i);
            if (delimiterIndexes.length === 2) break;
        }
    }

    if (delimiterIndexes.length < 2) {
        return { changed: false, content: raw };
    }

    const [start, end] = delimiterIndexes;
    let changed = false;

    for (let i = start + 1; i < end; i++) {
        const fixed = lines[i].replace(/^(\s*)\*(\s)/, (m, indent, space) => {
            changed = true;
            return `${indent}-${space}`;
        });
        lines[i] = fixed;
    }

    return { changed, content: lines.join("\r\n") };
}

async function main() {
    const files = (await readdir(POSTS_DIR)).filter((f) => f.toLowerCase().endsWith(".md"));
    let fixedCount = 0;

    for (const filename of files) {
        const filePath = path.join(POSTS_DIR, filename);
        const raw = await readFile(filePath, "utf-8");
        const { changed, content } = fixFrontmatterStars(raw);
        if (changed) {
            await writeFile(filePath, content, "utf-8");
            console.log(`Fixed: ${filename}`);
            fixedCount++;
        }
    }

    console.log(`\nDone. Fixed ${fixedCount} file(s).`);
}

main();

