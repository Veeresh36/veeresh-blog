/**
 * ============================================================
 * AllBlogs.jsx — Pinterest-Style All Posts Page
 * ============================================================
 * Route: /blogs  (add to your router as shown at bottom)
 *
 * PERF FIXES APPLIED:
 * - useBlogPosts now reads fields straight from manifest.json
 *   instead of firing a separate fetch+parse for every post's
 *   .md file (was N+1 network waterfall — 40+ requests just to
 *   render the grid).
 * - Removed @import url(...) font-loading from GlobalStyles.
 *   That's render-blocking — move the font <link> to index.html
 *   using preload + async apply (same fix already done there for
 *   ReadBlog.jsx). If index.html already loads Outfit + DM Serif
 *   Display, this component gets it for free with zero extra cost.
 *
 * ASSUMPTION: your manifest.json posts already carry title,
 * excerpt/description, category, tags, date, image, featured,
 * readingTime — same shape ReadBlog.jsx's `morePosts` expects.
 * If any field is missing in your actual manifest, adjust the
 * mapping in useBlogPosts below (marked with comments).
 * ============================================================
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

// ─── Re-export SavedContext (or import from Blog.jsx if co-located) ──────────
import { SavedContext, useSaved } from "../App";


// ─── ICONS ──────────────────────────────────────────────────
const PinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

const SearchIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

const BookmarkIcon = ({ size = 18, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const GridIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);

const ListIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const CloseIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronLeft = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const SparkleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0 L13.5 9 L22 10.5 L13.5 12 L12 21 L10.5 12 L2 10.5 L10.5 9 Z" />
  </svg>
);

// ─── GRADIENTS + EMOJIS (mirrors Blog.jsx) ──────────────────
const GRADIENT_PRESETS = [
  { background: "linear-gradient(135deg,#F5EFE6,#E8DDD0)" },
  { background: "linear-gradient(135deg,#E8F0E8,#D4E4D4)" },
  { background: "linear-gradient(135deg,#F0E8F0,#E0D4E4)" },
  { background: "linear-gradient(135deg,#EEF0E8,#DDE4D4)" },
  { background: "linear-gradient(135deg,#F0EEE8,#E4DDD4)" },
  { background: "linear-gradient(135deg,#E8ECF0,#D4DCE4)" },
  { background: "linear-gradient(135deg,#F0EAE8,#E4D4D0)" },
  { background: "linear-gradient(135deg,#EAF0EA,#D0E4D0)" },
];
const EMOJI_PRESETS = ["💻", "🌿", "🏠", "✈️", "🍛", "⚡", "🧠", "⭐", "📌", "🎯"];

// Variable card heights for masonry feel
const CARD_HEIGHTS = [260, 320, 280, 360, 240, 300, 340, 260, 310, 280];

// ─── HOOKS ──────────────────────────────────────────────────
function useScrollReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) { setIsVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setIsVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, isVisible];
}

/**
 * FIXED: reads everything straight off manifest.json.
 * No more per-post .md fetch — this was the N+1 waterfall
 * causing "network dependency tree" / unused-JS / main-thread flags.
 *
 * If your manifest.posts[] entries use different key names than
 * what's mapped below, adjust the right-hand side only — e.g. if
 * your manifest calls it `desc` instead of `excerpt`, change
 * `p.excerpt || p.description` to `p.desc`.
 */
function useBlogPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/blogs/manifest.json");
        if (!res.ok) throw new Error("manifest.json not found");
        const manifest = await res.json();
        const rawPosts = Array.isArray(manifest) ? manifest : (manifest.posts || []);

        const loaded = rawPosts.map((p, idx) => ({
          slug: p.slug,
          title: p.title || p.slug,
          excerpt: p.excerpt || p.description || "",
          date: p.date || "",
          category: p.category || (Array.isArray(p.tags) ? p.tags[0] : "") || "General",
          tags: Array.isArray(p.tags) ? p.tags : [],
          readingTime: p.readingTime || p["reading-time"] || "5 min read",
          featured: p.featured === true || p.featured === "true",
          emoji: p.emoji || EMOJI_PRESETS[idx % EMOJI_PRESETS.length],
          gradientStyle: GRADIENT_PRESETS[idx % GRADIENT_PRESETS.length],
          image: p.image || null,
          author: p.author || "Veeresh Bashetti",
          heightPx: CARD_HEIGHTS[idx % CARD_HEIGHTS.length],
        }));

        loaded.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.date) - new Date(a.date);
        });

        if (!cancelled) setPosts(loaded);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { posts, loading, error };
}

// ─── GLOBAL STYLES ──────────────────────────────────────────
// FIXED: removed @import url(...) font loading — that's render-blocking.
// Fonts should be loaded once via index.html <link rel="preload"> + async
// apply. If Outfit / DM Serif Display are already loaded there (they should
// be, from the ReadBlog.jsx fix), this component just inherits them free.
const GlobalStyles = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Outfit', sans-serif; overflow-x: hidden; background: #FAF8F4; }
    .font-display { font-family: 'DM Serif Display', serif; }

    @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    .fade-up { animation: fadeUp 0.6s cubic-bezier(0.4,0,0.2,1) both; }

    @keyframes revealUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
    .reveal-hidden  { opacity:0; transform:translateY(22px); will-change:transform,opacity; }
    .reveal-visible { animation:revealUp 0.55s cubic-bezier(0.4,0,0.2,1) both; }

    .d-100 { animation-delay:0.05s } .d-200 { animation-delay:0.10s }
    .d-300 { animation-delay:0.15s } .d-400 { animation-delay:0.20s }
    .d-500 { animation-delay:0.25s } .d-600 { animation-delay:0.30s }
    .d-700 { animation-delay:0.35s } .d-800 { animation-delay:0.40s }

    @keyframes pulseDot { 0%,100% { opacity:1;transform:scale(1); } 50% { opacity:0.4;transform:scale(0.7); } }
    .pulse-dot { animation: pulseDot 2s ease infinite; }

    @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
    .btn-shimmer {
      background: linear-gradient(90deg,#E60023 40%,#ff4d6d 50%,#E60023 60%);
      background-size: 200% auto;
    }
    .btn-shimmer:hover { animation: shimmer 1.2s linear infinite; }

    /* Masonry columns */
    .masonry-grid { columns: 4; column-gap: 16px; }
    @media (max-width:1280px) { .masonry-grid { columns: 3; } }
    @media (max-width:900px)  { .masonry-grid { columns: 2; } }
    @media (max-width:560px)  { .masonry-grid { columns: 2; } }
    .masonry-item { break-inside: avoid; margin-bottom: 16px; display: block; }

    /* List view */
    .list-view .masonry-grid { columns: 1; }
    .list-view .masonry-item { margin-bottom: 12px; }

    /* Card */
    .pin-card { background:#fff; border-radius:20px; overflow:hidden; border:1px solid #F0EBE3; cursor:pointer;
      transition: transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s ease; position:relative; }
    .pin-card:hover { transform:translateY(-6px); box-shadow:0 20px 56px rgba(26,22,18,0.13); }
    .pin-card:hover .card-img { transform:scale(1.06); }
    .card-img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s ease; display:block; }
    .card-img-wrap { overflow:hidden; position:relative; }

    /* Save btn */
    .save-btn { position:absolute; top:12px; right:12px; width:36px; height:36px; border-radius:50%;
      background:rgba(255,255,255,0.92); backdrop-filter:blur(6px); border:none; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
      transition:background 0.2s, transform 0.2s; z-index:5; }
    .save-btn:hover { background:#fff; transform:scale(1.12); }
    .save-btn.saved { background:#E60023; color:#fff; }

    /* Search */
    .search-wrap { position:relative; }
    .search-wrap input { width:100%; border:1.5px solid #E8E0D5; border-radius:50px;
      padding:0.65rem 1rem 0.65rem 2.8rem; font-family:'Outfit',sans-serif; font-size:0.9rem;
      color:#1A1612; background:#fff; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
    .search-wrap input:focus { border-color:#1A1612; box-shadow:0 0 0 3px rgba(26,22,18,0.06); }
    .search-wrap svg { position:absolute; left:0.9rem; top:50%; transform:translateY(-50%); color:#8C7E74; pointer-events:none; }

    /* Filter pill */
    .filter-pill { border:1.5px solid #E8E0D5; border-radius:50px; padding:0.4rem 1rem;
      font-size:0.78rem; font-weight:600; font-family:'Outfit',sans-serif; cursor:pointer;
      white-space:nowrap; transition:all 0.2s; background:#fff; color:#3D3530; }
    .filter-pill:hover { border-color:#1A1612; background:#FAF8F4; }
    .filter-pill.active { background:#1A1612; color:#FAF8F4; border-color:#1A1612; }
    .filter-pill.all-active { background:#E60023; color:#fff; border-color:#E60023; }

    /* Sticky filter bar */
    .filter-bar { position:sticky; top:0; z-index:40; background:rgba(250,248,244,0.92);
      backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px); border-bottom:1px solid #E8E0D5; }

    /* Scrollbar */
    ::-webkit-scrollbar { width:5px; }
    ::-webkit-scrollbar-track { background:#FAF8F4; }
    ::-webkit-scrollbar-thumb { background:#E60023; border-radius:3px; }

    /* Nav glass */
    .nav-glass { background:rgba(250,248,244,0.9); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); }

    /* Tag chip */
    .tag-chip { background:#F2EDE4; color:#8C7E74; border-radius:50px; padding:2px 10px;
      font-size:0.65rem; font-weight:600; display:inline-block; }

    /* Featured badge */
    .featured-badge { position:absolute; top:12px; left:12px; background:#E60023; color:#fff;
      font-size:0.6rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em;
      padding:4px 10px; border-radius:50px; z-index:5; display:flex; align-items:center; gap:4px; }

    /* Sort select */
    .sort-select { border:1.5px solid #E8E0D5; border-radius:50px; padding:0.4rem 0.8rem;
      font-size:0.78rem; font-family:'Outfit',sans-serif; color:#3D3530; background:#fff;
      cursor:pointer; outline:none; }

    /* Empty state */
    @keyframes float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
    .float-anim { animation:float 3s ease-in-out infinite; }

    /* View toggle */
    .view-btn { border:1.5px solid #E8E0D5; border-radius:10px; padding:7px; background:#fff;
      color:#8C7E74; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; }
    .view-btn.active { background:#1A1612; color:#FAF8F4; border-color:#1A1612; }
    .view-btn:hover:not(.active) { background:#F2EDE4; color:#3D3530; }

    /* Category badge on card */
    .cat-badge { position:absolute; bottom:12px; left:12px; background:rgba(255,255,255,0.9);
      backdrop-filter:blur(6px); font-size:0.62rem; font-weight:700; text-transform:uppercase;
      letter-spacing:0.08em; color:#3D3530; padding:4px 10px; border-radius:50px;
      border:1px solid rgba(255,255,255,0.7); z-index:5; }

    /* Hover overlay on card image */
    .card-overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(26,22,18,0.3) 0%, transparent 50%);
      opacity:0; transition:opacity 0.3s ease; }
    .pin-card:hover .card-overlay { opacity:1; }

    /* List card */
    .list-card { display:grid; grid-template-columns:120px 1fr; gap:16px; align-items:center;
      background:#fff; border-radius:16px; border:1px solid #F0EBE3; padding:16px;
      transition:transform 0.2s, box-shadow 0.2s; text-decoration:none; }
    .list-card:hover { transform:translateY(-2px); box-shadow:0 12px 40px rgba(26,22,18,0.10); }

    /* Skeleton shimmer */
    @keyframes skelShimmer {
      0% { background-position: -400px 0; }
      100% { background-position: 400px 0; }
    }
    .skeleton { background: linear-gradient(90deg, #F2EDE4 25%, #FAF8F4 50%, #F2EDE4 75%);
      background-size: 800px 100%; animation: skelShimmer 1.5s infinite; border-radius: 12px; }
  `}</style>
);

// ─── MINI NAVBAR ────────────────────────────────────────────
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { saved } = useSaved();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav className={`nav-glass fixed top-0 left-0 right-0 z-50 border-b border-[#E8E0D5] transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`}
      aria-label="Main navigation">
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-[64px]">
        <Link to="/" className="flex items-center gap-2 no-underline" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.3rem", color: "#1A1612" }}>
            Veeresh<span style={{ color: "#E60023" }}>.</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-[0.82rem] font-semibold text-[#3D3530] hover:text-[#E60023] transition-colors no-underline"
            style={{ textDecoration: "none" }}>
            <ChevronLeft size={16} /> Home
          </Link>

          <Link to="/saved" aria-label={`Saved (${saved.length})`}
            className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#E8E0D5]"
            style={{ background: "#F2EDE4", textDecoration: "none", color: "#3D3530" }}>
            <BookmarkIcon size={16} filled={saved.length > 0} />
            {saved.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-[#E60023] text-white text-[0.6rem] font-bold rounded-full flex items-center justify-center px-1">
                {saved.length > 99 ? "99+" : saved.length}
              </span>
            )}
          </Link>

          <a href="https://in.pinterest.com/veereshbbashetti/" target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#1A1612] text-[#FAF8F4] px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#E60023] transition-all duration-300"
            aria-label="Follow on Pinterest">
            <PinIcon size={13} /> Follow
          </a>
        </div>
      </div>
    </nav>
  );
};

// ─── SKELETON CARDS ─────────────────────────────────────────
const SkeletonGrid = () => (
  <div className="masonry-grid">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="masonry-item">
        <div className="skeleton" style={{ height: CARD_HEIGHTS[i % CARD_HEIGHTS.length] }} />
        <div style={{ padding: "12px 4px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="skeleton" style={{ height: 10, width: "40%", borderRadius: 8 }} />
          <div className="skeleton" style={{ height: 14, width: "85%", borderRadius: 8 }} />
          <div className="skeleton" style={{ height: 10, width: "60%", borderRadius: 8 }} />
        </div>
      </div>
    ))}
  </div>
);

// ─── PIN CARD (masonry) ──────────────────────────────────────
const PinCard = ({ post, index }) => {
  const [ref, isVisible] = useScrollReveal(0.04);
  const [imgError, setImgError] = useState(false);
  const { saved, toggleSave } = useSaved();
  const isSaved = saved.includes(post.slug);
  const cardRef = useRef(null);

  const delayClass = `d-${Math.min((index % 8 + 1) * 100, 800)}`;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(900px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg) translateY(-6px)`;
  };
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "";
  };

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div className={`masonry-item ${isVisible ? `reveal-visible ${delayClass}` : "reveal-hidden"}`} ref={ref}>
      <div ref={cardRef} className="pin-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
        style={{ transformStyle: "preserve-3d" }}>

        {/* Featured badge */}
        {post.featured && (
          <div className="featured-badge">
            <SparkleIcon size={10} /> Featured
          </div>
        )}

        {/* Save button */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave(post.slug); }}
          className={`save-btn ${isSaved ? "saved" : ""}`}
          aria-label={isSaved ? "Remove from saved" : "Save post"}
          style={{ color: isSaved ? "#fff" : "#E60023" }}>
          <BookmarkIcon size={16} filled={isSaved} />
        </button>

        {/* Image / Emoji thumbnail */}
        <Link to={`/blog/${post.slug}`} style={{ textDecoration: "none" }} aria-label={`Read: ${post.title}`}>
          <div className="card-img-wrap" style={{ height: post.heightPx }}>
            {post.image && !imgError ? (
              <img src={post.image} alt={post.title} className="card-img" loading="lazy" decoding="async" onError={() => setImgError(true)} />
            ) : (
              <div className="card-img" style={{ ...post.gradientStyle, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3.2rem" }}>
                {post.emoji}
              </div>
            )}
            <div className="card-overlay" />
            {/* Category badge on image */}
            <span className="cat-badge">{post.category}</span>
          </div>

          {/* Card body */}
          <div style={{ padding: "14px 16px 16px" }}>
            <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1rem", color: "#1A1612", margin: "0 0 6px", lineHeight: 1.35 }}>
              {post.title}
            </h3>
            {post.excerpt && (
              <p style={{
                fontSize: "0.8rem", color: "#8C7E74", lineHeight: 1.6, margin: "0 0 10px",
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
              }}>
                {post.excerpt}
              </p>
            )}
            {post.tags?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                {post.tags.slice(0, 2).map(t => <span key={t} className="tag-chip">{t}</span>)}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #F0EBE3", paddingTop: 10, marginTop: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%", background: "#1A1612", color: "#FAF8F4",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, flexShrink: 0
                }}>VB</div>
                <span style={{ fontSize: "0.72rem", color: "#8C7E74", fontWeight: 500 }}>{formattedDate}</span>
              </div>
              <span style={{ fontSize: "0.72rem", color: "#8C7E74", fontWeight: 500 }}>{post.readingTime}</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

// ─── LIST CARD ───────────────────────────────────────────────
const ListCard = ({ post, index }) => {
  const [ref, isVisible] = useScrollReveal(0.04);
  const [imgError, setImgError] = useState(false);
  const { saved, toggleSave } = useSaved();
  const isSaved = saved.includes(post.slug);
  const delayClass = `d-${Math.min((index % 8 + 1) * 100, 800)}`;

  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <div ref={ref} className={`masonry-item ${isVisible ? `reveal-visible ${delayClass}` : "reveal-hidden"}`}>
      <Link to={`/blog/${post.slug}`} className="list-card" style={{ textDecoration: "none" }} aria-label={`Read: ${post.title}`}>
        {/* Thumb */}
        <div style={{ width: 120, height: 90, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
          {post.image && !imgError ? (
            <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" decoding="async" onError={() => setImgError(true)} />
          ) : (
            <div style={{ ...post.gradientStyle, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
              {post.emoji}
            </div>
          )}
        </div>
        {/* Text */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#E60023" }}>{post.category}</span>
            {post.featured && <span style={{ fontSize: "0.58rem", fontWeight: 700, textTransform: "uppercase", background: "#FFF0F2", color: "#E60023", padding: "2px 7px", borderRadius: 50 }}>Featured</span>}
          </div>
          <h3 style={{
            fontFamily: "'DM Serif Display',serif", fontSize: "1rem", color: "#1A1612", margin: "0 0 5px", lineHeight: 1.3,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
          }}>
            {post.title}
          </h3>
          {post.excerpt && (
            <p style={{
              fontSize: "0.78rem", color: "#8C7E74", lineHeight: 1.5, margin: "0 0 8px",
              display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden"
            }}>
              {post.excerpt}
            </p>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.7rem", color: "#B0A49A" }}>{formattedDate} · {post.readingTime}</span>
            <button type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave(post.slug); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: isSaved ? "#E60023" : "#C8BDB4", padding: 4 }}
              aria-label={isSaved ? "Remove from saved" : "Save"}>
              <BookmarkIcon size={15} filled={isSaved} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

// ─── EMPTY STATE ─────────────────────────────────────────────
const EmptyState = ({ query, onClear }) => (
  <div style={{ textAlign: "center", padding: "80px 24px" }}>
    <div className="float-anim" style={{ fontSize: "4rem", marginBottom: 20 }}>🔍</div>
    <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.5rem", color: "#1A1612", marginBottom: 8 }}>
      No posts found
    </p>
    <p style={{ fontSize: "0.9rem", color: "#8C7E74", marginBottom: 24 }}>
      {query ? `No results for "${query}". Try a different search.` : "No posts in this category yet."}
    </p>
    <button type="button" onClick={onClear}
      style={{
        background: "#1A1612", color: "#FAF8F4", border: "none", borderRadius: 50, padding: "0.7rem 1.8rem",
        fontFamily: "'Outfit',sans-serif", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer"
      }}>
      Clear filters
    </button>
  </div>
);

// ─── MAIN PAGE ───────────────────────────────────────────────
export default function AllBlogs() {
  const { posts, loading, error } = useBlogPosts();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("cat") || "All");
  const [sort, setSort] = useState("latest");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [visibleCount, setVisibleCount] = useState(24);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Sync URL params
  useEffect(() => {
    const p = {};
    if (query) p.q = query;
    if (activeCategory !== "All") p.cat = activeCategory;
    setSearchParams(p, { replace: true });
  }, [query, activeCategory, setSearchParams]);

  // All unique categories
  const categories = useMemo(() => {
    const cats = new Set(posts.map(p => p.category || "General"));
    return ["All", ...Array.from(cats).sort()];
  }, [posts]);

  // Filter + sort
  const filtered = useMemo(() => {
    let result = [...posts];
    if (activeCategory !== "All") result = result.filter(p => p.category === activeCategory);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (sort === "latest") result.sort((a, b) => new Date(b.date) - new Date(a.date));
    else if (sort === "featured") result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    else if (sort === "az") result.sort((a, b) => a.title.localeCompare(b.title));
    return result;
  }, [posts, query, activeCategory, sort]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const clearFilters = useCallback(() => {
    setQuery("");
    setActiveCategory("All");
    setSort("latest");
    setVisibleCount(24);
  }, []);

  // Load more on scroll
  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400 && hasMore) {
        setVisibleCount(v => v + 16);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasMore]);

  // Reset visible on filter change
  useEffect(() => { setVisibleCount(24); }, [query, activeCategory, sort]);

  return (
    <>
      <GlobalStyles />
      <div style={{ background: "#FAF8F4", minHeight: "100vh" }}>
        <Navbar />

        {/* ── Page Header ── */}
        <div style={{ paddingTop: 100, paddingBottom: 56, paddingLeft: 24, paddingRight: 24, maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 40 }}>
            <div>
              <div className="fade-up d-100" style={{
                display: "inline-flex", alignItems: "center", gap: 8, background: "#F2EDE4",
                border: "1px solid #E8E0D5", borderRadius: 50, padding: "6px 16px", marginBottom: 16
              }}>
                <span className="pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#E60023", display: "inline-block" }} />
                <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8C7E74" }}>
                  All Posts
                </span>
              </div>
              <h1 className="fade-up d-200" style={{
                fontFamily: "'DM Serif Display',serif", fontSize: "clamp(2rem,4vw,3.2rem)",
                color: "#1A1612", margin: "0 0 10px", lineHeight: 1.08
              }}>
                Every story,<br /><em style={{ color: "#8C7E74" }}>in one place.</em>
              </h1>
              <p className="fade-up d-300" style={{ fontSize: "1rem", color: "#8C7E74", margin: 0 }}>
                {loading ? "Loading posts…" : `${posts.length} post${posts.length !== 1 ? "s" : ""} published`}
              </p>
            </div>

            {/* Search */}
            <div className="fade-up d-400" style={{ width: "100%", maxWidth: 380 }}>
              <div className="search-wrap">
                <SearchIcon size={17} />
                <label htmlFor="blog-search" className="sr-only">
                  Search Blog Posts
                </label>

                <input
                  id="blog-search"
                  type="search"
                  placeholder="Search posts, topics, tags…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search blog posts"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Filter Bar ── */}
        <div className="filter-bar fade-up d-300">
          <div style={{ maxWidth: 1400, margin: "0 auto", padding: "10px 24px", display: "flex", alignItems: "center", gap: 12, overflowX: "auto" }}>
            {/* Category pills */}
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              {categories.map(cat => (
                <button key={cat} type="button"
                  className={`filter-pill ${cat === "All" && activeCategory === "All" ? "all-active" : activeCategory === cat && cat !== "All" ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat)}>
                  {cat}
                  {cat !== "All" && (
                    <span style={{ marginLeft: 4, opacity: 0.6 }}>
                      {posts.filter(p => p.category === cat).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              {/* Active filter indicator */}
              {(query || activeCategory !== "All") && (
                <button type="button" onClick={clearFilters}
                  style={{
                    display: "flex", alignItems: "center", gap: 5, background: "#FFF0F2", color: "#E60023",
                    border: "1.5px solid #FFD0D8", borderRadius: 50, padding: "4px 12px",
                    fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap"
                  }}>
                  <CloseIcon size={11} /> Clear
                </button>
              )}

              {/* Sort */}
              <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort posts">
                <option value="latest">Latest</option>
                <option value="featured">Featured</option>
                <option value="az">A – Z</option>
              </select>

              {/* View toggle */}
              <div style={{ display: "flex", gap: 4 }}>
                <button type="button" className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")} aria-label="Grid view" title="Grid view">
                  <GridIcon size={16} />
                </button>
                <button type="button" className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")} aria-label="List view" title="List view">
                  <ListIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Results count bar ── */}
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "16px 24px 0" }}>
          {!loading && !error && (
            <p style={{ fontSize: "0.8rem", color: "#B0A49A", marginBottom: 0 }}>
              Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              {activeCategory !== "All" && ` in "${activeCategory}"`}
              {query && ` for "${query}"`}
            </p>
          )}
        </div>

        {/* ── Grid / List ── */}
        <main id="main-content" style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 24px 80px" }}
          className={viewMode === "list" ? "list-view" : ""}>

          {loading && <SkeletonGrid />}

          {!loading && error && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontSize: "3rem", marginBottom: 12 }}>⚠️</p>
              <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.4rem", color: "#1A1612", marginBottom: 8 }}>Couldn't load posts</p>
              <p style={{ fontSize: "0.88rem", color: "#8C7E74" }}>{error}</p>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <EmptyState query={query} onClear={clearFilters} />
          )}

          {!loading && !error && filtered.length > 0 && (
            <>
              <div className="masonry-grid">
                {visible.map((post, i) =>
                  viewMode === "list"
                    ? <ListCard key={post.slug} post={post} index={i} />
                    : <PinCard key={post.slug} post={post} index={i} />
                )}
              </div>

              {/* Load more / End */}
              <div style={{ textAlign: "center", paddingTop: 40 }}>
                {hasMore ? (
                  <button type="button"
                    onClick={() => setVisibleCount(v => v + 16)}
                    style={{
                      background: "#1A1612", color: "#FAF8F4", border: "none", borderRadius: 50,
                      padding: "0.8rem 2.2rem", fontFamily: "'Outfit',sans-serif", fontWeight: 600,
                      fontSize: "0.88rem", cursor: "pointer", transition: "background 0.2s"
                    }}
                    onMouseEnter={e => e.target.style.background = "#E60023"}
                    onMouseLeave={e => e.target.style.background = "#1A1612"}>
                    Load more posts
                  </button>
                ) : (
                  <p style={{ fontSize: "0.82rem", color: "#C8BDB4", fontWeight: 600, letterSpacing: "0.06em" }}>
                    ✦ You've seen everything ✦
                  </p>
                )}
              </div>
            </>
          )}
        </main>

        {/* ── Footer strip ── */}
        <footer style={{ background: "#1A1612", padding: "28px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: "1.2rem", color: "#FAF8F4", margin: "0 0 4px" }}>
            Veeresh<span style={{ color: "#E60023" }}>.</span>
          </p>
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.35)", margin: 0 }}>
            © {new Date().getFullYear()} Veeresh Bashetti. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}