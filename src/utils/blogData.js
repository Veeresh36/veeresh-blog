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

export function loadPost(slug) {
    const filePath = path.resolve(process.cwd(), "public/blogs", `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = parseFrontmatter(raw);
    const cleanBody = content.replace(/<!--[\s\S]*?-->/g, "").trim();
    return { frontmatter: data, content: cleanBody };
}

export function loadManifest() {
    const manifestPath = path.resolve(process.cwd(), "public/blogs/manifest.json");
    if (!fs.existsSync(manifestPath)) return { posts: [] };
    return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
}