import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";

// ─── ICONS (OPTIMIZED) ───────────────────────────────────────
const PinIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
);

const ArrowLeft = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);

const SparklesIcon = ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
    </svg>
);

const SearchIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

// ─── DESIGN CONFIGURATIONS ───────────────────────────────────
const TARGET_CATEGORY = "Pinterest Picks";

const GRADIENT_PRESETS = [
    { background: "linear-gradient(135deg, #F9F6F0, #EAE3D2)" },
    { background: "linear-gradient(135deg, #F3F7F3, #DBE7DB)" },
    { background: "linear-gradient(135deg, #F7F3F7, #E7DBE7)" },
    { background: "linear-gradient(135deg, #F6F7F3, #E3E7DB)" },
];

const EMOJI_PRESETS = ["📌", "⭐", "⚡", "🎯", "🌿", "✨"];

// ─── FRONTMATTER PARSER ENGINE ───────────────────────────────
function parseFrontmatter(raw) {
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
        if (/^\s*-\s/.test(line) && !line.includes(":")) { i++; continue; }

        const colonIdx = line.indexOf(":");
        if (colonIdx === -1) { i++; continue; }

        const key = line.slice(0, colonIdx).trim();
        let val = line.slice(colonIdx + 1).trim();

        if (/^\[/.test(val)) {
            try {
                data[key] = JSON.parse(val.replace(/'/g, '"'));
            } catch {
                data[key] = val.slice(1, -1).split(",").map(s => s.trim().replace(/^["']|["']$/g, ""));
            }
            i++;
            continue;
        }

        if (val === "" || val === "|" || val === ">") {
            i++;
            const items = [];
            while (i < lines.length && /^\s+-/.test(lines[i])) {
                const itemLine = lines[i].replace(/^\s+-\s*/, "").trim();
                if (itemLine.includes(": ")) {
                    const obj = {};
                    const [k, ...rest] = itemLine.split(": ");
                    obj[k.trim()] = rest.join(": ").replace(/^["']|["']$/g, "").trim();
                    i++;
                    while (i < lines.length && /^\s{4,}/.test(lines[i]) && lines[i].includes(":")) {
                        const subLine = lines[i].trim();
                        const subColon = subLine.indexOf(":");
                        obj[subLine.slice(0, subColon).trim()] = subLine.slice(subColon + 1).trim().replace(/^["']|["']$/g, "");
                        i++;
                    }
                    items.push(obj);
                } else {
                    items.push(itemLine.replace(/^["']|["']$/g, "").trim());
                    i++;
                }
            }
            data[key] = items.length ? items : "";
            continue;
        }

        val = val.replace(/^["']|["']$/g, "").trim();
        if (val === "true") val = true;
        else if (val === "false") val = false;
        data[key] = val;
        i++;
    }
    return { data, content };
}

// ─── SCROLL REVEAL ENGINE ────────────────────────────────────
function useScrollReveal(threshold = 0.01) {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return [ref, isVisible];
}

// ─── AUTHENTIC PINTEREST PIN CARD COMPONENT ──────────────────
const PinterestPinCard = ({ post, index }) => {
    const [ref, isVisible] = useScrollReveal(0.01);
    const [imgError, setImgError] = useState(false);

    const formattedDate = useMemo(() => {
        if (!post.date) return "";
        return new Date(post.date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    }, [post.date]);

    return (
        <div
            ref={ref}
            className={`pinterest-pin-item w-full mb-5 break-inside-avoid ${isVisible ? `reveal-visible stagger-${Math.min(index + 1, 6)}` : "reveal-hidden"}`}
        >
            <Link
                to={`/blog/${post.slug}`}
                className="group block w-full bg-transparent border-none outline-none text-none select-none relative"
                style={{ textDecoration: "none" }}
            >
                <div className="w-full rounded-2xl overflow-hidden relative bg-[#FAF9F5] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.12)] group-hover:shadow-[0_12px_28px_-4px_rgba(26,22,18,0.12)] transition-all duration-300 transform group-hover:translate-y-[-2px]">
                    {post.image && !imgError ? (
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-auto object-cover block transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                            loading="lazy"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div
                            className="w-full aspect-[4/5] flex items-center justify-center text-4xl transition-transform duration-700 group-hover:scale-[1.02]"
                            style={post.gradientStyle || { background: "#FAF6F0" }}
                        >
                            <span>{post.emoji}</span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
                        <span className="bg-[#E60023] text-white text-xs font-bold tracking-wide px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <PinIcon size={12} /> Read Presentation
                        </span>
                    </div>

                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-20 pointer-events-none mix-blend-normal">
                        <span className="bg-white/95 backdrop-blur-sm text-[#1A1612] text-[0.62rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm border border-[#EAE3D2]/50">
                            {post.tags?.[0] || "Curated"}
                        </span>
                        {post.featured && (
                            <span className="bg-[#E60023] text-white text-[0.58rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
                                <SparklesIcon /> Prime
                            </span>
                        )}
                    </div>
                </div>

                <div className="pt-3 pb-1 px-1 flex flex-col">
                    <h2 className="text-[#1A1612] font-display text-[0.92rem] font-semibold leading-tight tracking-tight group-hover:text-[#E60023] transition-colors duration-200 line-clamp-2">
                        {post.title}
                    </h2>
                    
                    {post.excerpt && (
                        <p className="text-[0.78rem] text-[#7A6E65] leading-[1.4] mt-1.5 line-clamp-2 font-light">
                            {post.excerpt}
                        </p>
                    )}

                    <div className="flex items-center gap-1.5 mt-2.5 text-[0.68rem] font-medium text-[#8A7D73] border-t border-[#F4EFE6]/70 pt-2.5">
                        <div className="w-4 h-4 rounded-full bg-[#1A1612] text-[#FAF9F5] text-[0.45rem] font-bold flex items-center justify-center">VB</div>
                        <span className="truncate max-w-[110px] text-[#1A1612] font-semibold">{post.author || "Veeresh Bashetti"}</span>
                        <span className="text-neutral-300">•</span>
                        <time dateTime={post.date}>{formattedDate}</time>
                    </div>
                </div>
            </Link>
        </div>
    );
};

// ─── MASTER PLATFORM VIEW COMPONENT ──────────────────────────
export default function PinterestPicksCategory() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchContainerRef = useRef(null);

    useEffect(() => {
        let isCancelled = false;
        async function fetchCategoryPosts() {
            try {
                const manifestRes = await fetch("/blogs/manifest.json");
                if (!manifestRes.ok) throw new Error("Manifest configurations not found.");
                const manifestData = await manifestRes.json();

                const slugs = Array.isArray(manifestData)
                    ? manifestData
                    : (manifestData.posts || []).map(p => p.slug);

                const results = await Promise.allSettled(
                    slugs.map(async (slug, idx) => {
                        const res = await fetch(`/blogs/${slug}.md`);
                        if (!res.ok) throw new Error(`Failed execution on ${slug}.md`);
                        const raw = await res.text();
                        const { data } = parseFrontmatter(raw);

                        return {
                            slug: data.slug || slug,
                            title: data.title || slug,
                            excerpt: data.excerpt || data.description || "",
                            date: data.date || "",
                            category: data.category || (Array.isArray(data.tags) ? data.tags[0] : "") || "General",
                            tags: Array.isArray(data.tags) ? data.tags : [],
                            readingTime: data.readingTime || data["reading-time"] || "3 min read",
                            featured: data.featured === true || data.featured === "true",
                            emoji: data.emoji || EMOJI_PRESETS[idx % EMOJI_PRESETS.length],
                            gradientStyle: GRADIENT_PRESETS[idx % GRADIENT_PRESETS.length],
                            image: data.image || data.banner || null,
                            author: data.author || "Veeresh Bashetti"
                        };
                    })
                );

                const loaded = results
                    .filter(r => r.status === "fulfilled")
                    .map(r => r.value)
                    .filter(p => String(p.category).toLowerCase().trim() === TARGET_CATEGORY.toLowerCase().trim());

                loaded.sort((a, b) => new Date(b.date) - new Date(a.date));

                if (!isCancelled) setPosts(loaded);
            } catch (err) {
                if (!isCancelled) setError(err.message);
            } finally {
                if (!isCancelled) setLoading(false);
            }
        }

        fetchCategoryPosts();
        return () => { isCancelled = true; };
    }, []);

    // Extract raw topic parameters for fallback view setups
    const staticPopularChips = useMemo(() => {
        const unique = new Set();
        posts.forEach(p => p.tags?.forEach(t => unique.add(t.toLowerCase().trim())));
        return Array.from(unique).slice(0, 4);
    }, [posts]);

    // Live search query matching auto-suggestions dropdown compiler
    const autoSuggestions = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return [];

        const structuralMatches = new Set();
        posts.forEach(p => {
            // Match structural tags
            p.tags?.forEach(t => {
                if (t.toLowerCase().includes(query)) {
                    structuralMatches.add({ type: "tag", label: t.toLowerCase(), value: t });
                }
            });
            // Match structural descriptive key titles
            if (p.title.toLowerCase().includes(query)) {
                structuralMatches.add({ type: "post", label: p.title, value: p.title });
            }
        });

        return Array.from(structuralMatches).slice(0, 6);
    }, [posts, searchQuery]);

    // Main layout results sorting mechanism
    const filteredPosts = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return posts;
        
        return posts.filter(p => 
            p.title.toLowerCase().includes(query) ||
            p.excerpt.toLowerCase().includes(query) ||
            p.tags.some(t => t.toLowerCase().includes(query))
        );
  }, [posts, searchQuery]);

    // Closes suggestion panel layout safely when user clicks anywhere outside the input zone
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, []);

    return (
        <div className="bg-[#FAF9F5] text-[#1A1612] min-h-screen font-body selection:bg-[#E60023] selection:text-white antialiased">
            {/* Global Style Scope Injection */}
            <style>{`
                .pinterest-masonry-container {
                    column-count: 5;
                    column-gap: 1.25rem;
                    width: 100%;
                }
                @media (max-width: 1500px) { .pinterest-masonry-container { column-count: 4; } }
                @media (max-width: 1140px) { .pinterest-masonry-container { column-count: 3; } }
                @media (max-width: 768px) { .pinterest-masonry-container { column-count: 2; column-gap: 0.85rem; } }
                @media (max-width: 480px) { .pinterest-masonry-container { column-count: 1; } }
                
                .reveal-hidden { opacity: 0; transform: translateY(14px); }
                .reveal-visible {
                    opacity: 1;
                    transform: translateY(0);
                    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .stagger-1 { transition-delay: 0.04s; }
                .stagger-2 { transition-delay: 0.09s; }
                .stagger-3 { transition-delay: 0.14s; }
                .stagger-4 { transition-delay: 0.19s; }
                .stagger-5 { transition-delay: 0.24s; }
                .stagger-6 { transition-delay: 0.29s; }
            `}</style>

            {/* Pinterest Native Auto-Suggest Header Hub */}
            <header className="max-w-[1600px] mx-auto px-4 md:px-6 pt-10 md:pt-14 pb-6">
                <div className="flex flex-col gap-6 md:gap-8 border-b border-[#EAE3D2] pb-6">
                    
                    {/* Top Level Brand Row */}
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="inline-flex items-center gap-1 text-[0.62rem] font-bold tracking-[0.25em] text-[#E60023] uppercase">
                                <PinIcon size={10} /> Visual Architecture Index
                            </div>
                            <h1 className="font-display text-[#1A1612] text-xl font-bold tracking-tight">
                                Pinterest Picks
                            </h1>
                        </div>

                        <Link
                          to="/"
                          className="inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-[#7A6E65] hover:text-[#E60023] transition-colors duration-300 bg-white border border-[#EAE3D2] px-4 py-2 rounded-full shadow-sm"
                          style={{ textDecoration: "none" }}
                        >
                            <ArrowLeft size={12} /> Workspace
                        </Link>
                    </div>

                    {/* Auto-Suggest Input Node */}
                    <div ref={searchContainerRef} className="w-full max-w-xl mx-auto relative z-50">
                        <div className="relative w-full">
                            <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onFocus={() => setShowSuggestions(true)}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                placeholder="Type to explore workspace designs, tags, keyboard layouts..."
                                className="w-full text-sm pl-11 pr-12 py-3.5 rounded-2xl bg-[#FAF9F5] border border-[#EAE3D2] text-[#1A1612] outline-none transition-all duration-300 focus:border-[#1A1612] focus:bg-white placeholder:text-neutral-400 font-light shadow-sm"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => {
                                        setSearchQuery("");
                                        setShowSuggestions(false);
                                    }}
                                    type="button"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.68rem] uppercase font-bold tracking-wider text-neutral-400 hover:text-[#E60023]"
                                >
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* LIVE AUTO-SUGGEST DROPDOWN MODULE CONTAINER */}
                        {showSuggestions && searchQuery.trim().length > 0 && autoSuggestions.length > 0 && (
                            <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-white border border-[#EAE3D2] rounded-2xl shadow-[0_15px_35px_-5px_rgba(26,22,18,0.1)] overflow-hidden animate-fadeUp">
                                <div className="px-4 py-2 bg-neutral-50/60 border-b border-[#F4EFE6] text-[0.62rem] font-bold text-[#8A7D73] uppercase tracking-widest">
                                    Suggested Matches
                                </div>
                                <div className="flex flex-col">
                                    {autoSuggestions.map((suggestion, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => {
                                                setSearchQuery(suggestion.value);
                                                setShowSuggestions(false);
                                            }}
                                            className="w-full px-4 py-3 text-left text-xs text-[#3D3530] hover:bg-neutral-50 border-b border-neutral-100 last:border-none transition-colors flex items-center justify-between group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2 truncate pr-4">
                                                <span className="text-neutral-300 group-hover:text-[#E60023] transition-colors shrink-0">
                                                    {suggestion.type === "tag" ? "#" : "📌"}
                                                </span>
                                                <span className={`truncate ${suggestion.type === "tag" ? "capitalize font-medium" : "font-light"}`}>
                                                    {suggestion.label}
                                                </span>
                                            </div>
                                            <span className="text-[0.58rem] font-bold text-neutral-400 uppercase tracking-wider shrink-0 bg-neutral-100 px-2 py-0.5 rounded">
                                                {suggestion.type}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* STATIC FALLBACK SUGGESTION CHIPS (Hides completely once query string initializes) */}
                        {(!searchQuery || !showSuggestions) && staticPopularChips.length > 0 && (
                            <div className="flex flex-wrap items-center justify-center gap-2 pt-3" aria-label="Static parameter choices">
                                <span className="text-[0.65rem] text-neutral-400 uppercase tracking-wider font-semibold mr-1">Trending:</span>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    type="button"
                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                                        !searchQuery 
                                            ? "bg-[#1A1612] text-white border-[#1A1612]" 
                                            : "bg-white text-[#5A4F43] border-[#EAE3D2] hover:border-[#1A1612]"
                                    }`}
                                >
                                    All Pins
                                </button>
                                {staticPopularChips.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setSearchQuery(tag)}
                                        type="button"
                                        className="px-3 py-1 rounded-full text-xs capitalize bg-white text-[#5A4F43] border border-[#EAE3D2] hover:border-[#1A1612] transition-colors cursor-pointer"
                                    >
                                        {tag}
                                    </button>
                               
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </header>

            {/* Main Dynamic Grid showcase scope */}
            <main id="category-showcase" className="max-w-[1600px] mx-auto px-4 md:px-6 py-2" aria-live="polite">
                {loading && (
                    <div className="pinterest-masonry-container" aria-label="Loading pins structural preview">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="bg-white rounded-2xl border border-[#EAE3D2] p-4 mb-4 space-y-3 shadow-sm">
                                <div className="bg-[#F5EFE4] w-full rounded-xl animate-pulse" style={{ height: i % 2 === 0 ? "310px" : "220px" }} />
                                <div className="h-4 bg-[#F5EFE4] rounded-md w-3/4 animate-pulse" />
                                <div className="h-3 bg-[#F5EFE4] rounded-md w-1/2 animate-pulse" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="text-center py-20 bg-white border border-[#EAE3D2] rounded-2xl p-8 max-w-xl mx-auto shadow-sm">
                        <span className="text-2xl block mb-2" role="img" aria-label="Warning flag">⚠️</span>
                        <h2 className="font-display text-base font-bold mb-1">Grid Sync Failed</h2>
                        <p className="text-xs text-[#7A6E65] font-light">{error}</p>
                    </div>
                )}

                {!loading && !error && filteredPosts.length === 0 && (
                    <div className="text-center py-24 bg-white border border-[#EAE3D2] rounded-2xl p-12 max-w-lg mx-auto shadow-sm">
                        <span className="text-3xl block mb-3" role="img" aria-label="Empty grid block">🔮</span>
                        <h2 className="font-display text-base font-bold text-[#1A1612] mb-1">No matching assets found</h2>
                        <p className="text-xs text-[#7A6E65] font-light leading-relaxed">
                            No layout assets match your typing search parameters. Try using alternative query terms.
                        </p>
                    </div>
                )}

                {!loading && !error && filteredPosts.length > 0 && (
                    <div className="pinterest-masonry-container">
                        {filteredPosts.map((post, idx) => (
                            <PinterestPinCard key={post.slug} post={post} index={idx} />
                        ))}
                    </div>
                )}
            </main>

            {/* Exclusive Minimal Action Footer Area */}
            <section className="bg-[#1A1612] text-[#FAF9F5] py-16 px-6 text-center border-t border-[#EAE3D2]">
                <div className="max-w-2xl mx-auto space-y-5">
                    <p className="text-[0.62rem] font-bold tracking-[0.25em] text-[#E60023] uppercase">Real-Time Continuous Integration</p>
                    <h2 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-white">
                        Seeking continuous design matrix synchronization?
                    </h2>
                    <p className="text-xs leading-relaxed text-white/60 font-light max-w-md mx-auto">
                        I publish daily workspace transformations, computational design setups, and aesthetic framework overhauls.
                    </p>
                    <div className="pt-1">
                        <a
                            href="https://in.pinterest.com/veereshbbashetti/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#E60023] hover:bg-[#ff2a4b] text-white text-[0.68rem] font-bold tracking-widest uppercase px-6 py-3 rounded-full transition-all duration-300 shadow-xl hover:shadow-[#E60023]/20 hover:-translate-y-0.5"
                            style={{ textDecoration: "none" }}
                        >
                            <PinIcon size={11} /> Sync Global Pinterest Engine
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}