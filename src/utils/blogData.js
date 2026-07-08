import fs from "node:fs";
import path from "node:path";

export function parseFrontmatter(raw) {
    const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const match = normalized.match(/^\s*---\s*\n([\s\S]*?)\n---\s*/);
    if (!match) return { data: {}, content: normalized };

    const yaml = match[1];
    const content = normalized.slice(match[0].length).trim();
    const data = {};
    const lines = yaml.split("\n");
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const colonIdx = line.search(/:\s/);
        if (colonIdx === -1 && !line.match(/^[\w-]+:\s*$/)) { i++; continue; }

        const keyMatch = line.match(/^([\w-]+):\s*$/);
        if (keyMatch) {
            const key = keyMatch[1];
            i++;
            const items = [];
            while (i < lines.length) {
                const itemLine = lines[i];
                if (itemLine.match(/^[\w-]+:\s/) || itemLine.match(/^[\w-]+:\s*$/)) break;
                if (itemLine.match(/^\s{0,4}-\s/)) {
                    const firstVal = itemLine.replace(/^\s*-\s*/, "").trim();
                    const isObjectEntry = firstVal.match(/^[\w-]+:\s/);
                    if (isObjectEntry) {
                        const obj = {};
                        const fc = firstVal.indexOf(":");
                        obj[firstVal.slice(0, fc).trim()] = firstVal.slice(fc + 1).trim().replace(/^["']|["']$/g, "");
                        i++;
                        while (i < lines.length) {
                            const sub = lines[i];
                            if (!sub.match(/^\s{4,}[\w-]+:\s/) && !sub.match(/^\s{2,}[\w-]+:\s/)) break;
                            const sc = sub.indexOf(":");
                            const subKey = sub.slice(0, sc).trim();
                            const subVal = sub.slice(sc + 1).trim().replace(/^["']|["']$/g, "");
                            obj[subKey] = subVal;
                            i++;
                        }
                        items.push(obj);
                    } else {
                        items.push(firstVal.replace(/^["']|["']$/g, ""));
                        i++;
                    }
                } else { i++; }
            }
            data[key] = items.length ? items : "";
            continue;
        }

        const ci = line.indexOf(":");
        const key = line.slice(0, ci).trim();
        let val = line.slice(ci + 1).trim();
        val = val.replace(/^["']|["']$/g, "").trim();
        if (val === "true") val = true;
        else if (val === "false") val = false;
        data[key] = val;
        i++;
    }

    return { data, content };
}

// Browser-safe: fetch from the public/ folder over HTTP instead of node:fs.
export async function loadPost(slug) {
    const res = await fetch(`/blogs/${slug}.md`);
    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("text/html")) return null;

    const raw = await res.text();
    if (raw.trimStart().startsWith("<!doctype") || raw.trimStart().startsWith("<html")) return null;

    const { data, content } = parseFrontmatter(raw);
    const cleanBody = content.replace(/<!--[\s\S]*?-->/g, "").trim();
    return { frontmatter: data, content: cleanBody };
}

export async function loadManifest() {
    try {
        const res = await fetch("/blogs/manifest.json");
        if (!res.ok) return { posts: [] };
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("text/html")) return { posts: [] };
        return await res.json();
    } catch {
        return { posts: [] };
    }
}