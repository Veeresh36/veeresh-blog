import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";

// ─── MINIMAL ACCENT ICONS ────────────────────────────────────
const ArrowLeft = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);

const SearchIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

// ─── PLATFORM EDITORIAL METADATA CONFIGURATION ───────────────
const CATEGORY_META = {
    "career": {
        title: "Career Strategy",
        subtitle: "Deep-dives into software systems design engineering, team culture mechanics, and actionable growth frameworks."
    },
    "life-lessons": {
        title: "Life Architecture",
        subtitle: "Transparent personal retrospectives, systematic mental frameworks, and tactical lessons documented over code."
    },
    "gaming-setup": {
        title: "Workspace Aesthetics",
        subtitle: "Curated minimalistic desk spaces, peripheral teardowns, hardware inputs evaluation, and ergonomics logs."
    }
};

const resolveInlineGradient = (twGradient) => {
    if (!twGradient) return { backgroundColor: "#FAF9F5" };
    const hexes = twGradient.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g);
    if (hexes && hexes.length >= 2) {
        return { background: `linear-gradient(135deg, ${hexes[0]}, ${hexes[1]})` };
    }
    return { backgroundColor: "#FAF9F5" };
};

// ─── LUXURY EDITORIAL INDEX ROW COMPONENT ────────────────────
const PremiumPostRowCard = ({ post, index }) => {
    const [imgErr, setImgErr] = useState(false);
    const styleBg = useMemo(() => resolveInlineGradient(post.gradient), [post.gradient]);

    const formattedDate = useMemo(() => {
        if (!post.date) return "";
        return new Date(post.date).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    }, [post.date]);

    return (
        <article
            className="pinterest-row-item w-full opacity-0 translate-y-4 animate-pinReveal"
            style={{
                animationDelay: `${index * 45}ms`,
                animationFillMode: "forwards"
            }}
        >
            <Link
                to={`/blog/${post.slug}`}
                className="group flex flex-col md:flex-row bg-white rounded-2xl border border-[#EAE3D2] overflow-hidden hover:shadow-[0_24px_48px_-15px_rgba(26,22,18,0.07)] hover:border-[#1A1612] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-y-[-3px]"
                style={{ textDecoration: "none" }}
            >
                {/* Image Framing Slot Container Block */}
                <div className="w-full md:w-[360px] lg:w-[440px] h-[220px] md:h-[250px] flex-shrink-0 relative overflow-hidden bg-[#FAF9F5] border-b md:border-b-0 md:border-r border-[#EAE3D2]/40">
                    {post.image && !imgErr ? (
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover object-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                            loading="lazy"
                            onError={() => setImgErr(true)}
                        />

                    ) : (
                        <div
                            className="w-full h-full flex items-center justify-center text-4xl transition-transform duration-700 group-hover:scale-[1.03]"
                            style={styleBg}
                        >
                            <span>{post.emoji || "📝"}</span>
                        </div>
                    )}

                    <div className="absolute top-4 left-4 z-20 pointer-events-none">
                        <span className="bg-white/95 backdrop-blur-sm text-[#1A1612] text-[0.62rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#EAE3D2]/50 shadow-sm">
                            {post.tag || "Index Log"}
                        </span>
                    </div>
                </div>

                {/* Typography Information Deck Layout Block */}
                <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between gap-6 min-w-0">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                            <span className="text-[0.62rem] font-bold tracking-[0.22em] text-[#E60023] uppercase">
                                {post.category || "Collection Log"}
                            </span>
                            {post.featured && (
                                <span className="bg-[#E60023] text-white text-[0.55rem] font-black uppercase tracking-widest px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
                                    Prime
                                </span>
                            )}
                        </div>

                        <h2 className="text-[#1A1612] font-display text-[1.35rem] lg:text-[1.55rem] font-bold leading-[1.2] tracking-tight group-hover:text-[#E60023] transition-colors duration-300 line-clamp-2">
                            {post.title}
                        </h2>

                        {post.excerpt ? (
                            <p className="text-xs md:text-[0.88rem] text-[#7A6E65] leading-relaxed line-clamp-2 font-light tracking-wide pt-0.5">
                                {post.excerpt}
                            </p>
                        ) : (
                            <p className="text-xs md:text-[0.85rem] text-neutral-300 font-light italic">
                                Preview description missing from resource tracking nodes.
                            </p>
                        )}
                    </div>

                    {/* Integrated System Metrics & Author Footnotes */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#F4EFE6] pt-4 mt-auto">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-[#1A1612] text-[#FAF9F5] text-[0.5rem] font-bold flex items-center justify-center">VB</div>
                                <span className="text-[0.72rem] text-[#1A1612] font-semibold">{post.author || "Veeresh Bashetti"}</span>
                            </div>
                            <span className="text-neutral-300 hidden sm:inline">•</span>
                            <time className="text-[0.72rem] text-[#8A7D73] font-medium" dateTime={post.date}>{formattedDate}</time>

                            {/* Discrete Inline Metadata Tag Arrays Mapping */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="hidden lg:flex items-center gap-1.5 ml-2">
                                    {post.tags.slice(0, 2).map((t, idx) => (
                                        <span key={idx} className="text-[0.62rem] font-semibold text-[#8A7D73] bg-[#FAF9F5] px-2.5 py-0.5 rounded-full border border-[#EAE3D2]/40">
                                            #{t.toLowerCase().trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0">
                            <span className="bg-[#FAF9F5] border border-[#EAE3D2]/60 px-2.5 py-0.5 rounded text-[0.65rem] font-medium text-[#7A6E65]">
                                {post.meta || post.readingTime || "3 min read"}
                            </span>
                            <span className="text-xs font-bold text-[#1A1612] group-hover:text-[#E60023] transition-colors duration-200 flex items-center gap-1">
                                Open Article <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">→</span>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </article>
    );
};

// ─── MAIN MASTER VIEW LAYER ─────────────────────────────────
export default function CategoryPage() {
    const { categorySlug } = useParams();
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentMeta = useMemo(() => {
        if (CATEGORY_META[categorySlug]) return CATEGORY_META[categorySlug];
        const readable = categorySlug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        return { title: readable, subtitle: `Curated logs and setup blueprints indexed inside the ${readable} space.` };
    }, [categorySlug]);

    useEffect(() => {
        let active = true;
        setLoading(true);

        async function fetchPayloadDirectly() {
            try {
                const res = await fetch("/blogs/manifest.json");
                if (!res.ok) throw new Error("Could not load tracking indices database elements mapping.");
                const data = await res.json();

                const manifestPosts = Array.isArray(data) ? data : data.posts || [];

                const filtered = manifestPosts.filter(post => {
                    const tags = Array.isArray(post.tag) ? post.tag : [post.tag];
                    return tags.some(tag => {
                        const normalizedTag = tag.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
                        return normalizedTag === categorySlug.toLowerCase().trim();
                    });
                });

                if (active) {
                    setPosts(filtered);
                    setError(null);
                }
            } catch (err) {
                if (active) setError(err.message);
            } finally {
                if (active) setLoading(false);
            }
        }

        fetchPayloadDirectly();
        return () => { active = false; };
    }, [categorySlug]);

    const matchingFilteredPosts = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return posts;
        return posts.filter(p =>
            p.title.toLowerCase().includes(query) ||
            (p.excerpt && p.excerpt.toLowerCase().includes(query))
        );
    }, [posts, searchQuery]);

    return (
        <div className="bg-[#FAF9F5] text-[#1A1612] min-h-screen font-body antialiased selection:bg-[#1A1612] selection:text-white">
            <style>{`
                .font-display { font-family: 'DM Serif Display', serif; }
                .font-body { font-family: 'Outfit', sans-serif; }
                
                @keyframes headerReveal {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pinReveal {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-headerReveal {
                    animation: headerReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .animate-pinReveal {
                    animation: pinReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .scrollbar-none::-webkit-scrollbar { display: none; }
                .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>

            {/* Premium Minimal Editorial Control Header Block */}
            <header className="bg-white border-b border-[#EAE3D2] pt-20 pb-8 px-4 md:px-6 animate-headerReveal">
                <div className="max-w-[1140px] mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                    <div className="space-y-1 flex-1 max-w-xl">
                        <Link to="/" className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#8A7D73] hover:text-[#E60023] transition-colors mb-2" style={{ textDecoration: "none" }}>
                            <span className="transform transition-transform duration-300 inline-block">
                                <ArrowLeft />
                            </span>
                            Return to Index
                        </Link>
                        <h1 className="font-display text-2xl md:text-3xl text-[#1A1612] tracking-tight font-bold">
                            {currentMeta.title}
                        </h1>
                        <p className="text-xs md:text-[0.82rem] text-[#7A6E65] font-light leading-relaxed">
                            {currentMeta.subtitle}
                        </p>
                    </div>

                    {/* Integrated Metric Tag Counters & Search Input Filter */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="hidden sm:inline-flex bg-[#FAF9F5] border border-[#EAE3D2] rounded-xl px-4 py-2 text-left items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#E60023] animate-pulse" />
                            <span className="text-[0.65rem] font-bold text-[#8A7D73] uppercase tracking-wider whitespace-nowrap">
                                Board Maps: <strong className="text-[#1A1612] font-display text-sm ml-0.5">{matchingFilteredPosts.length}</strong>
                            </span>
                        </div>
                        <div className="relative flex items-center w-full sm:w-[230px]">
                            <span className="absolute left-3.5 text-neutral-400">
                                <SearchIcon />
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Scan board entries..."
                                className="w-full pl-9 pr-4 py-2.5 bg-[#FAF9F5] border border-[#EAE3D2] rounded-xl text-xs font-medium outline-none text-[#1A1612] focus:border-[#1A1612] focus:bg-white transition-all shadow-none placeholder:text-neutral-400/80"
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Balanced Content Flow Node */}
            <main className="max-w-[1140px] mx-auto px-4 md:px-6 py-10" aria-live="polite">
                {loading && (
                    <div className="flex flex-col gap-4" aria-label="Loading pins structural preview">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white border border-[#EAE3D2] rounded-2xl h-[160px] animate-pulse relative overflow-hidden" />
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="text-center py-16 bg-white border border-red-200 text-xs text-[#E60023] rounded-2xl max-w-md mx-auto px-6 font-medium shadow-sm">
                        ⚠️ Archive Loop Synchronization Deferred: {error}
                    </div>
                )}

                {!loading && !error && matchingFilteredPosts.length === 0 && (
                    <div className="text-center py-20 bg-white border border-[#EAE3D2] rounded-3xl p-8 max-w-sm mx-auto shadow-[0_4px_24px_rgba(0,0,0,0.01)] animate-pinReveal">
                        <span className="text-3xl block mb-2 opacity-80" role="img" aria-label="Empty layout state flag">🔮</span>
                        <h3 className="font-display text-base text-[#1A1612] font-semibold mb-1">Board ledger is clear</h3>
                        <p className="text-xs text-[#7A6E65] font-light leading-relaxed">
                            No active logs or peripheral product entries found matching your query filters.
                        </p>
                    </div>
                )}

                {!loading && !error && matchingFilteredPosts.length > 0 && (
                    <div className="flex flex-col gap-5">
                        {matchingFilteredPosts.map((post, idx) => (
                            <PremiumPostRowCard key={post.slug} post={post} index={idx} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}