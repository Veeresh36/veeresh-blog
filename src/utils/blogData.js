const isNode = typeof window === "undefined";

let _fs, _path, _blogsDir;

async function getNodeModules() {
    if (!isNode) return null;
    if (_fs && _path && _blogsDir) return { fs: _fs, path: _path, blogsDir: _blogsDir };

    const fsMod = await import("node:fs");
    const pathMod = await import("node:path");
    const { fileURLToPath } = await import("node:url");

    _fs = fsMod;
    _path = pathMod;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = _path.dirname(__filename);
    // this file lives at src/utils/blogData.js → project root is two levels up
    _blogsDir = _path.resolve(__dirname, "../../public/blogs");

    return { fs: _fs, path: _path, blogsDir: _blogsDir };
}

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

// Isomorphic: reads from disk during SSG build (Node), fetches over HTTP in the browser.
export async function loadPost(slug) {
    if (isNode) {
        try {
            const { fs, path, blogsDir } = await getNodeModules();
            const filePath = path.join(blogsDir, `${slug}.md`);
            if (!fs.existsSync(filePath)) return null;
            const raw = fs.readFileSync(filePath, "utf-8");
            const { data, content } = parseFrontmatter(raw);
            const cleanBody = content.replace(/<!--[\s\S]*?-->/g, "").trim();
            return { frontmatter: data, content: cleanBody };
        } catch (err) {
            console.error("loadPost (node) failed:", err);
            return null;
        }
    }

    // Browser: fetch from the public/ folder over HTTP
    try {
        const res = await fetch(`/blogs/${slug}.md`);
        if (!res.ok) return null;

        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("text/html")) return null;

        const raw = await res.text();
        if (raw.trimStart().startsWith("<!doctype") || raw.trimStart().startsWith("<html")) return null;

        const { data, content } = parseFrontmatter(raw);
        const cleanBody = content.replace(/<!--[\s\S]*?-->/g, "").trim();
        return { frontmatter: data, content: cleanBody };
    } catch {
        return null;
    }
}

export async function loadManifest() {
    if (isNode) {
        try {
            const { fs, path, blogsDir } = await getNodeModules();
            const filePath = path.join(blogsDir, "manifest.json");
            if (!fs.existsSync(filePath)) return { posts: [] };
            const raw = fs.readFileSync(filePath, "utf-8");
            return JSON.parse(raw);
        } catch (err) {
            console.error("loadManifest (node) failed:", err);
            return { posts: [] };
        }
    }

    // Browser: fetch as before
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