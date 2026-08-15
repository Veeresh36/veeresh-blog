import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

/* ────────────────────────────────────────────────────────────
   DESIGN TOKENS (shared with the rest of the site)
   Background  #FAF9F5   Surface  #FFFFFF   Ink   #1A1612
   Border      #EAE3D2   Muted    #7A6E65   Accent #E60023
   Display     'DM Serif Display'   Body   'Outfit'
──────────────────────────────────────────────────────────── */

// Each category gets one small, fixed identity: an icon + a soft tint of
// the accent color. It's the one recognizable thing that makes a category
// page feel like a specific place rather than an interchangeable filter view.
const CATEGORY_META = {
    "career": {
        title: "Career Strategy",
        subtitle: "Software systems, team culture, and the growth frameworks that actually move the needle.",
        icon: "💼",
    },
    "life-lessons": {
        title: "Life Lessons",
        subtitle: "Honest retrospectives and the mental frameworks that came out of getting things wrong first.",
        icon: "🌱",
    },
    "pinterest-picks": {
        title: "Pinterest Picks",
        subtitle: "Products, room ideas, and finds worth saving — curated the way a good Pinterest board should be.",
        icon: "📌",
    },
    "finance": {
        title: "Finance",
        subtitle: "Money, budgeting, and investing basics explained the way I wish someone had explained them to me.",
        icon: "💰",
    },
    "tech": {
        title: "Tech",
        subtitle: "Tools, workflows, and dev write-ups grounded in things I actually built and broke.",
        icon: "📱",
    },
    "lifestyle": {
        title: "Lifestyle",
        subtitle: "Small everyday habits and choices that quietly add up to something bigger.",
        icon: "🌿",
    },
    "personal-growth": {
        title: "Personal Growth",
        subtitle: "Learning, mindset, and becoming a slightly better version of yourself, one post at a time.",
        icon: "🧠",
    },
};

const ACCENT = "#E60023";

const ArrowLeftIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);

const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const CloseIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const resolveInlineGradient = (twGradient) => {
    if (!twGradient) return { backgroundColor: "#FAF9F5" };
    const hexes = twGradient.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g);
    if (hexes && hexes.length >= 2) {
        return { background: `linear-gradient(135deg, ${hexes[0]}, ${hexes[1]})` };
    }
    return { backgroundColor: "#FAF9F5" };
};

// Same slugify rule used everywhere else in the app when building
// /category/:slug links. Category pages must filter on this exact rule
// or the slugs will never match.
const slugify = (value) => (value || "").toLowerCase().trim().replace(/\s+/g, "-");

const readableFromSlug = (slug) =>
    slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

/* ─── POST CARD ────────────────────────────────────────────── */
const PostCard = ({ post, index }) => {
    const [imgErr, setImgErr] = useState(false);
    const styleBg = useMemo(() => resolveInlineGradient(post.gradient), [post.gradient]);

    const formattedDate = useMemo(() => {
        if (!post.date) return "";
        return new Date(post.date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }, [post.date]);

    return (
        <article
            className="cat-card opacity-0 translate-y-3"
            style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
        >
            <Link
                to={`/blog/${post.slug}`}
                className="group flex flex-col md:flex-row bg-white rounded-2xl border overflow-hidden transition-all duration-300 ease-out hover:-translate-y-0.5"
                style={{ borderColor: "#EAE3D2", textDecoration: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1A1612"; e.currentTarget.style.boxShadow = "0 20px 40px -20px rgba(26,22,18,0.14)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#EAE3D2"; e.currentTarget.style.boxShadow = "none"; }}
            >
                <div className="relative w-full md:w-[280px] lg:w-[320px] h-[190px] md:h-auto flex-shrink-0 overflow-hidden border-b md:border-b-0 md:border-r" style={{ borderColor: "#EAE3D2" }}>
                    {post.image && !imgErr ? (
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                            loading="lazy"
                            onError={() => setImgErr(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl" style={styleBg}>
                            <span>{post.emoji || "📝"}</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between gap-4 min-w-0">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[0.68rem] font-semibold tracking-wide" style={{ color: "#8A7D73" }}>
                            <time dateTime={post.date}>{formattedDate}</time>
                            {post.readingTime && (
                                <>
                                    <span aria-hidden="true">·</span>
                                    <span>{post.readingTime}</span>
                                </>
                            )}
                            {post.featured && (
                                <span
                                    className="ml-1 text-[0.6rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                                    style={{ background: "#E600230F", color: ACCENT }}
                                >
                                    Featured
                                </span>
                            )}
                        </div>

                        <h2
                            className="font-display text-[1.25rem] leading-snug font-bold tracking-tight line-clamp-2 transition-colors"
                            style={{ color: "#1A1612" }}
                        >
                            {post.title}
                        </h2>

                        {post.excerpt && (
                            <p className="text-[0.85rem] leading-relaxed line-clamp-2" style={{ color: "#7A6E65" }}>
                                {post.excerpt}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-3 border-t" style={{ borderColor: "#F4EFE6" }}>
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[0.5rem] font-bold flex-shrink-0" style={{ background: "#1A1612", color: "#FAF9F5" }}>VB</div>
                            <span className="text-[0.72rem] font-medium truncate" style={{ color: "#1A1612" }}>{post.author || "Veeresh Bashetti"}</span>
                        </div>
                        <span
                            className="text-[0.75rem] font-bold flex items-center gap-1 flex-shrink-0 transition-transform"
                            style={{ color: ACCENT }}
                        >
                            Read article
                            <span className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">→</span>
                        </span>
                    </div>
                </div>
            </Link>
        </article>
    );
};

const CardSkeleton = () => (
    <div className="flex flex-col md:flex-row bg-white rounded-2xl border h-[190px] md:h-[152px] overflow-hidden" style={{ borderColor: "#EAE3D2" }}>
        <div className="w-full md:w-[280px] lg:w-[320px] h-[90px] md:h-full animate-pulse" style={{ background: "#F4EFE6" }} />
        <div className="flex-1 p-6 flex flex-col justify-center gap-3">
            <div className="h-2.5 w-24 rounded-full animate-pulse" style={{ background: "#F4EFE6" }} />
            <div className="h-4 w-4/5 rounded-full animate-pulse" style={{ background: "#F4EFE6" }} />
            <div className="h-3 w-3/5 rounded-full animate-pulse" style={{ background: "#F4EFE6" }} />
        </div>
    </div>
);

/* ─── MAIN PAGE ────────────────────────────────────────────── */
export default function CategoryPage() {
    const { categorySlug } = useParams();
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const meta = useMemo(() => {
        if (CATEGORY_META[categorySlug]) return CATEGORY_META[categorySlug];
        const readable = readableFromSlug(categorySlug);
        return { title: readable, subtitle: `Posts filed under ${readable}.`, icon: "🗂️" };
    }, [categorySlug]);

    const otherCategories = useMemo(
        () => Object.entries(CATEGORY_META).filter(([slug]) => slug !== categorySlug),
        [categorySlug]
    );

    // ─── SEO: document title, meta description, canonical, per category ───
    useEffect(() => {
        const originalTitle = document.title;
        document.title = `${meta.title} | Veeresh Bashetti`;

        const setMetaTag = (attr, value, content) => {
            let el = document.querySelector(`meta[${attr}="${value}"]`);
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute(attr, value);
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };

        setMetaTag("name", "description", meta.subtitle);
        setMetaTag("property", "og:title", `${meta.title} | Veeresh Bashetti`);
        setMetaTag("property", "og:description", meta.subtitle);
        setMetaTag("property", "og:url", `https://www.veereshbashetti.com/category/${categorySlug}`);

        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.setAttribute("rel", "canonical");
            document.head.appendChild(canonical);
        }
        canonical.setAttribute("href", `https://www.veereshbashetti.com/category/${categorySlug}`);

        return () => { document.title = originalTitle; };
    }, [categorySlug, meta]);

    // ─── Data: match on post.category (slugified), falling back to tags ───
    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(null);

        (async () => {
            try {
                const res = await fetch("/blogs/manifest.json");
                if (!res.ok) throw new Error("request-failed");
                const data = await res.json();
                const manifestPosts = Array.isArray(data) ? data : data.posts || [];

                const filtered = manifestPosts.filter((post) => {
                    if (slugify(post.category) === categorySlug.toLowerCase().trim()) return true;
                    const tags = Array.isArray(post.tags) ? post.tags : [];
                    return tags.some((tag) => slugify(tag) === categorySlug.toLowerCase().trim());
                });

                if (active) setPosts(filtered);
            } catch {
                if (active) setError("We couldn't load posts for this category. Try refreshing the page.");
            } finally {
                if (active) setLoading(false);
            }
        })();

        return () => { active = false; };
    }, [categorySlug]);

    const visiblePosts = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return posts;
        return posts.filter(
            (p) => p.title.toLowerCase().includes(query) || (p.excerpt && p.excerpt.toLowerCase().includes(query))
        );
    }, [posts, searchQuery]);

    const postCountLabel = loading ? "" : `${posts.length} ${posts.length === 1 ? "post" : "posts"}`;

    return (
        <div className="min-h-screen font-body antialiased" style={{ background: "#FAF9F5", color: "#1A1612" }}>
            <style>{`
                .font-display { font-family: 'DM Serif Display', serif; }
                .font-body { font-family: 'Outfit', sans-serif; }

                @keyframes catHeaderReveal { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes catCardReveal { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .cat-header { animation: catHeaderReveal .5s cubic-bezier(.16,1,.3,1) both; }
                .cat-card { animation: catCardReveal .5s cubic-bezier(.16,1,.3,1) both; }

                @media (prefers-reduced-motion: reduce) {
                    .cat-header, .cat-card { animation: none; opacity: 1; transform: none; }
                }

                .cat-focusable:focus-visible { outline: 2px solid ${ACCENT}; outline-offset: 2px; border-radius: 6px; }
            `}</style>

            {/* Breadcrumb */}
            <div className="max-w-[1080px] mx-auto px-4 md:px-6 pt-8">
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[0.72rem] font-medium" style={{ color: "#8A7D73" }}>
                    <Link to="/" className="cat-focusable hover:text-[#1A1612] transition-colors" style={{ textDecoration: "none" }}>Home</Link>
                    <span aria-hidden="true">/</span>
                    <Link to="/blog" className="cat-focusable hover:text-[#1A1612] transition-colors" style={{ textDecoration: "none" }}>Blog</Link>
                    <span aria-hidden="true">/</span>
                    <span style={{ color: "#1A1612" }} aria-current="page">{meta.title}</span>
                </nav>
            </div>

            {/* Header */}
            <header className="cat-header max-w-[1080px] mx-auto px-4 md:px-6 pt-6 pb-10">
                <Link
                    to="/categories"
                    className="cat-focusable inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] mb-5 transition-colors hover:text-[#1A1612]"
                    style={{ color: "#8A7D73", textDecoration: "none" }}
                >
                    <ArrowLeftIcon />
                    All categories
                </Link>

                <div className="flex items-start gap-5">
                    <div
                        className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border"
                        style={{ background: "#FFFFFF", borderColor: "#EAE3D2" }}
                        aria-hidden="true"
                    >
                        {meta.icon}
                    </div>
                    <div className="min-w-0">
                        <h1 className="font-display text-[2rem] md:text-[2.4rem] leading-[1.05] font-bold tracking-tight">
                            {meta.title}
                        </h1>
                        <p className="mt-2 text-[0.92rem] leading-relaxed max-w-xl" style={{ color: "#7A6E65" }}>
                            {meta.subtitle}
                        </p>
                    </div>
                </div>

                {/* Meta row: count + search */}
                <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="text-[0.78rem] font-semibold" style={{ color: "#1A1612" }} aria-live="polite">
                        {postCountLabel}
                    </span>

                    {!loading && posts.length > 0 && (
                        <div className="relative sm:ml-auto w-full sm:w-[260px]">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "#B3A99E" }} aria-hidden="true">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={`Search ${meta.title.toLowerCase()}…`}
                                aria-label={`Search within ${meta.title}`}
                                className="cat-focusable w-full pl-9 pr-9 py-2.5 bg-white border rounded-xl text-[0.8rem] font-medium outline-none transition-colors"
                                style={{ borderColor: "#EAE3D2", color: "#1A1612" }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = "#1A1612")}
                                onBlur={(e) => (e.currentTarget.style.borderColor = "#EAE3D2")}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    aria-label="Clear search"
                                    className="cat-focusable absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition-colors hover:text-[#1A1612]"
                                    style={{ color: "#B3A99E" }}
                                >
                                    <CloseIcon />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </header>

            {/* Content */}
            <main className="max-w-[1080px] mx-auto px-4 md:px-6 pb-16" aria-live="polite">
                {loading && (
                    <div className="flex flex-col gap-4" aria-label="Loading posts">
                        {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
                    </div>
                )}

                {!loading && error && (
                    <div
                        className="text-center py-14 bg-white border rounded-2xl max-w-md mx-auto px-6"
                        style={{ borderColor: "#F0CDCD" }}
                    >
                        <p className="text-[0.85rem] font-medium" style={{ color: ACCENT }}>{error}</p>
                    </div>
                )}

                {!loading && !error && visiblePosts.length === 0 && (
                    <div
                        className="cat-card text-center py-16 px-6 bg-white border rounded-2xl max-w-sm mx-auto"
                        style={{ borderColor: "#EAE3D2" }}
                    >
                        <span className="text-2xl block mb-2" aria-hidden="true">{meta.icon}</span>
                        {searchQuery ? (
                            <>
                                <h2 className="font-display text-base font-semibold mb-1">No matches for "{searchQuery}"</h2>
                                <p className="text-[0.8rem]" style={{ color: "#7A6E65" }}>Try a different search term, or clear the search to see everything in {meta.title}.</p>
                            </>
                        ) : (
                            <>
                                <h2 className="font-display text-base font-semibold mb-1">No posts here yet</h2>
                                <p className="text-[0.8rem]" style={{ color: "#7A6E65" }}>New {meta.title.toLowerCase()} posts will show up here as soon as they're published.</p>
                            </>
                        )}
                    </div>
                )}

                {!loading && !error && visiblePosts.length > 0 && (
                    <div className="flex flex-col gap-4">
                        {visiblePosts.map((post, idx) => (
                            <PostCard key={post.slug} post={post} index={idx} />
                        ))}
                    </div>
                )}
            </main>

            {/* Related categories — keeps people (and crawlers) moving through the site */}
            <div className="border-t" style={{ borderColor: "#EAE3D2" }}>
                <div className="max-w-[1080px] mx-auto px-4 md:px-6 py-10">
                    <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.14em] mb-4" style={{ color: "#8A7D73" }}>
                        Explore other categories
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {otherCategories.map(([slug, m]) => (
                            <Link
                                key={slug}
                                to={`/category/${slug}`}
                                className="cat-focusable inline-flex items-center gap-1.5 text-[0.78rem] font-semibold px-3.5 py-2 rounded-full border bg-white transition-colors"
                                style={{ borderColor: "#EAE3D2", color: "#1A1612", textDecoration: "none" }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1A1612")}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#EAE3D2")}
                            >
                                <span aria-hidden="true">{m.icon}</span>
                                {m.title}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}