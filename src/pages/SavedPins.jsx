import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSaved } from "../routees/Approuter";


// ─── MINIMAL DESIGN ICONS ────────────────────────────────────
const ArrowLeft = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);

const TrashIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const resolveInlineGradient = (idx) => {
    const presets = [
        "linear-gradient(135deg,#F5EFE6,#E8DDD0)",
        "linear-gradient(135deg,#E8F0E8,#D4E4D4)",
        "linear-gradient(135deg,#F0E8F0,#E0D4E4)"
    ];
    return { background: presets[idx % presets.length] };
};

export default function SavedPins() {
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { saved, toggleSave } = useSaved();


    useEffect(() => {
        async function loadSavedAssets() {
            try {
                // 1. Fetch keys from localStorage bookmarks array pool
                const rawBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
                if (rawBookmarks.length === 0) {
                    setSavedPosts([]);
                    return;
                }

                // 2. Cross-examine slugs against master directory config manifest map
                const res = await fetch("/blogs/manifest.json");
                if (!res.ok) return;
                const data = await res.json();
                const allPosts = Array.isArray(data) ? data : data.posts || [];

                // 3. Resolve metadata details loops matching active items safely
                const resolvedMatches = allPosts.filter(p => rawBookmarks.includes(p.slug));
                setSavedPosts(resolvedMatches);
            } catch (err) {
                console.error("Failed to parse saved assets stream:", err);
            } finally {
                setLoading(false);
            }
        }
        loadSavedAssets();
    }, []);

    const removeBookmark = (slug, e) => {
        e.preventDefault(); // Prevents clicking card navigation
        const currentIds = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        const filteredIds = currentIds.filter(id => id !== slug);
        localStorage.setItem("bookmarks", JSON.stringify(filteredIds));
        setSavedPosts(prev => prev.filter(p => p.slug !== slug));
    };

    return (
        <div className="bg-[#FAF9F5] text-[#1A1612] min-h-screen font-body antialiased selection:bg-[#1A1612] selection:text-white">
            <style>{`
                .font-display { font-family: 'DM Serif Display', serif; }
                .pinterest-masonry-container { column-count: 4; column-gap: 1.5rem; width: 100%; }
                @media (max-width: 1200px) { .pinterest-masonry-container { column-count: 3; } }
                @media (max-width: 840px) { .pinterest-masonry-container { column-count: 2; column-gap: 1rem; } }
                @media (max-width: 480px) { .pinterest-masonry-container { column-count: 1; } }
                @keyframes cardReveal { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
                .animate-cardReveal { animation: cardReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
            `}</style>

            <header className="bg-white border-b border-[#EAE3D2] pt-20 pb-8 px-6">
                <div className="max-w-[1440px] mx-auto flex items-end justify-between gap-6">
                    <div className="space-y-1.5">
                        <Link to="/" className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#8A7D73] hover:text-[#E60023] transition-colors mb-2" style={{ textDecoration: "none" }}>
                            <ArrowLeft /> Return to Hub
                        </Link>
                        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-[#1A1612]">Your Saved Presentation Pins</h1>
                        <p className="text-xs md:text-sm text-[#7A6E65] font-light">Handpicked layouts, articles, and workspace ergonomics boards kept inside local tracking space nodes.</p>
                    </div>
                    <span className="hidden sm:inline-block bg-[#FAF9F5] border border-[#EAE3D2] px-4 py-2 rounded-xl text-xs font-bold text-[#8A7D73] uppercase tracking-wider">
                        Stored: {savedPosts.length} Pins
                    </span>
                </div>
            </header>

            <main className="max-w-[1440px] mx-auto px-4 md:px-6 py-10">
                {loading ? (
                    <div className="text-center py-20 text-xs tracking-widest text-[#8A7D73] uppercase animate-pulse">Synchronizing local data nodes...</div>
                ) : savedPosts.length === 0 ? (
                    <div className="text-center py-24 bg-white border border-[#EAE3D2] rounded-3xl p-12 max-w-sm mx-auto shadow-sm animate-cardReveal">
                        <span className="text-4xl block mb-4">📌</span>
                        <h3 className="font-display text-base font-semibold text-[#1A1612] mb-1.5">No saved items found</h3>
                        <p className="text-xs text-[#7A6E65] font-light leading-relaxed mb-6">Bookmark articles or peripheral setup reviews across reading spaces to synchronize them directly here.</p>
                        <Link to="/" className="inline-block bg-[#1A1612] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full" style={{ textDecoration: "none" }}>Explore Dashboard</Link>
                    </div>
                ) : (
                    <div className="pinterest-masonry-container">
                        {savedPosts.map((post, idx) => (
                            <div key={post.slug} className="w-full mb-6 break-inside-avoid animate-cardReveal relative group" style={{ animationDelay: `${idx * 40}ms` }}>
                                <Link to={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
                                    <div className="w-full rounded-2xl overflow-hidden relative bg-[#FAF9F5] border border-[#EAE3D2]/60 shadow-sm group-hover:shadow-md transition-all duration-300">
                                        {post.image ? (
                                            <img src={post.image} alt="" className="w-full h-auto object-cover block max-h-[380px]" loading="lazy" />
                                        ) : (
                                            <div style={resolveInlineGradient(idx)} className="w-full h-[240px] flex items-center justify-center text-4xl">{post.emoji || "📝"}</div>
                                        )}
                                        
                                        {/* Premium Floating Remove Trigger Pin Tooltip */}
                                        <button 
                                            type="button"
                                            onClick={(e) => removeBookmark(post.slug, e)}
                                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border border-[#EAE3D2] text-[#7A6E65] hover:text-[#E60023] flex items-center justify-center transition-colors shadow-sm cursor-pointer z-20"
                                            title="Unsave pin layout"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                    <div className="pt-3 px-1">
                                        <h2 className="text-[#1A1612] font-display text-[0.92rem] font-semibold leading-tight line-clamp-2 group-hover:text-[#E60023] transition-colors duration-200">{post.title}</h2>
                                        <span className="block text-[0.6rem] font-bold text-[#8A7D73] uppercase tracking-wider mt-2">{post.category || "General"}</span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}