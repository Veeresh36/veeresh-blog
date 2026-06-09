import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const SITE = {
  name: "Veeresh Bashetti",
  pinterestUrl: "https://in.pinterest.com/veereshbbashetti/",
  email: "veeresh.b.bashetti@gmail.com",
};

// ─── REAL POSTS (hardcoded from your manifest) ───────────────────────
const REAL_POSTS = [
  {
    slug: "22-year-old-startup-developer-life",
    title: "22 Years Old, -₹400 in My Bank Account...",
    tag: "Career",
    emoji: "💻",
    meta: "8 min read · May 2026",
    image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/22-year-old-startup-developer-bank-account-struggle.png",
  },
  {
    slug: "13k-second-hand-cpu-mistake-in-20s",
    title: "The ₹13,000 Mistake I Made in My 20s",
    tag: "Life Lessons",
    emoji: "💸",
    meta: "8 min read · May 2026",
    image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/13k-cpu-mistake-in-20s-emotional-startup-story.png",
  },
  {
    slug: "toycills-vintage-toy-car-review",
    title: "Toycills Vintage 1:24 Die-Cast Car — Honest Review",
    tag: "Pinterest Picks",
    emoji: "🚗",
    meta: "5 min read · May 2026",
    image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/toycills-vintage-124-die-cast-car-review.png",
  },
  {
    slug: "redragon-k630-dragonborn-review",
    title: "Redragon K630 Dragonborn — Best Budget 60% Keyboard?",
    tag: "Pinterest Picks",
    emoji: "⌨️",
    meta: "7 min read · May 2026",
    image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/redragon-k630-dragonborn-review-banner.png",
  },
  {
    slug: "minimal-gaming-setup-ideas",
    title: "Minimal Gaming Setup Ideas That Look Expensive",
    tag: "Pinterest Picks",
    emoji: "🎮",
    meta: "6 min read · May 2026",
    image: "https://raw.githubusercontent.com/Veeresh36/bog_images/main/minimal-gaming-controller-setup-2026.png",
  },
  {
    slug: "suffering-without-generational-wealth",
    title: "Why Suffering Without Generational Wealth Hits Different",
    tag: "Finance",
    emoji: "💰",
    meta: "7 min read · May 2025",
    image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/why-suffering-without-generational-wealth-hits-different.png",
  },
];

// ─── CATEGORY STYLE MAP (exactly your 4 real tags) ───────────────────
const CATEGORY_META = {
  "Career": {
    emoji: "💻",
    accent: "#1A56DB",
    accentLight: "rgba(26,86,219,0.08)",
    accentBorder: "rgba(26,86,219,0.22)",
    description: "Raw, honest stories from startup life — zero-balance accounts, big decisions, and what nobody tells you about your 20s.",
    tagLabel: "Work & Hustle",
  },
  "Life Lessons": {
    emoji: "💸",
    accent: "#92400E",
    accentLight: "rgba(146,64,14,0.08)",
    accentBorder: "rgba(146,64,14,0.22)",
    description: "Expensive mistakes and hard realisations. The kind of wisdom that only comes from messing up first.",
    tagLabel: "Real Talk",
  },
  "Pinterest Picks": {
    emoji: "📌",
    accent: "#E60023",
    accentLight: "rgba(230,0,35,0.07)",
    accentBorder: "rgba(230,0,35,0.22)",
    description: "Honest product reviews and aesthetic finds — keyboards, cars, gaming setups and gear actually worth your money.",
    tagLabel: "Reviews & Finds",
  },
  "Finance": {
    emoji: "💰",
    accent: "#276749",
    accentLight: "rgba(39,103,73,0.08)",
    accentBorder: "rgba(39,103,73,0.22)",
    description: "Money talk without the fluff — generational wealth gaps, financial realities, and what it actually takes to get ahead.",
    tagLabel: "Money & Wealth",
  },
};

// ─── GROUP POSTS BY TAG ───────────────────────────────────────────────
function groupByTag(posts) {
  const map = {};
  posts.forEach((p) => {
    const t = p.tag || "Other";
    if (!map[t]) map[t] = [];
    map[t].push(p);
  });
  // preserve order of first appearance
  return Object.entries(map).map(([tag, posts]) => ({
    tag,
    posts,
    ...(CATEGORY_META[tag] || {
      emoji: "📝",
      accent: "#E60023",
      accentLight: "rgba(230,0,35,0.07)",
      accentBorder: "rgba(230,0,35,0.2)",
      description: `All posts tagged "${tag}".`,
      tagLabel: tag,
    }),
  }));
}

// ─── HOOKS ───────────────────────────────────────────────────────────
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const s = localStorage.getItem("blog-theme");
    return s ? s === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("blog-theme", dark ? "dark" : "light");
  }, [dark]);
  return [dark, () => setDark((d) => !d)];
}

function useFadeIn(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(22px)";
    el.style.transition = `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { el.style.opacity = "1"; el.style.transform = "none"; obs.unobserve(el); }
      },
      { threshold: 0.04 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

// ─── ICONS ───────────────────────────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
    strokeLinecap="round" strokeLinejoin="round" width={size} height={size} aria-hidden>
    <path d={d} />
  </svg>
);

const PinterestIcon = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

// ─── NAVBAR ──────────────────────────────────────────────────────────
const Navbar = ({ dark, toggleDark }) => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const bg = dark ? "rgba(15,14,13,0.93)" : "rgba(250,248,244,0.93)";
  const bdr = dark ? "rgba(255,255,255,0.06)" : "rgba(26,22,18,0.08)";

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
      style={{ background: bg, backdropFilter: "blur(20px)", borderBottom: scrolled ? `1px solid ${bdr}` : "1px solid transparent" }}>
      <div className="max-w-[1280px] mx-auto px-6 h-[68px] flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-['DM_Serif_Display',serif] text-[1.3rem] tracking-tight"
            style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>
            Veeresh<span style={{ color: "#E60023" }}>.</span>
          </Link>
          <Link to="/#blog"
            className="hidden md:inline-flex items-center gap-1.5 text-[0.75rem] font-semibold px-3 py-1.5 rounded-full border transition-all hover:opacity-70"
            style={{ borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)", color: dark ? "rgba(250,248,244,0.55)" : "#7A6E64" }}>
            ← All Posts
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleDark}
            className="w-9 h-9 flex items-center justify-center rounded-lg border transition-all hover:opacity-70"
            style={{ borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)", color: dark ? "#FAF8F4" : "#3D3530" }}
            aria-label="Toggle dark mode">
            {dark
              ? <Icon d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
              : <Icon d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            }
          </button>
          <a href={SITE.pinterestUrl} target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-[0.78rem] font-bold px-4 py-2 rounded-full transition-all hover:opacity-90"
            style={{ background: "#E60023", color: "#fff" }}>
            <PinterestIcon /> Follow
          </a>
          <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(o => !o)} aria-label="Menu">
            {[0, 1, 2].map(i => (
              <span key={i} className="block w-5 h-0.5 transition-all duration-300"
                style={{
                  background: dark ? "#FAF8F4" : "#1A1612",
                  transform: open && i === 0 ? "rotate(45deg) translateY(8px)" : open && i === 2 ? "rotate(-45deg) translateY(-8px)" : "none",
                  opacity: open && i === 1 ? 0 : 1,
                }} />
            ))}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden px-6 pb-5 pt-2 flex flex-col gap-3 border-t"
          style={{ borderColor: bdr, background: dark ? "#0F0E0D" : "#FAF8F4" }}>
          <Link to="/" onClick={() => setOpen(false)} className="text-[0.88rem] font-semibold"
            style={{ color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" }}>← Home</Link>
          <a href={SITE.pinterestUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full w-fit"
            style={{ background: "#E60023", color: "#fff" }}>
            <PinterestIcon size={12} /> Follow on Pinterest
          </a>
        </div>
      )}
    </nav>
  );
};

// ─── POST MINI CARD (inside category) ────────────────────────────────
const PostMiniCard = ({ post, dark, accent }) => (
  <Link to={`/blog/${post.slug}`}
    className="flex items-start gap-3 py-3 transition-opacity hover:opacity-70"
    style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "#EAE4DC"}`, textDecoration: "none" }}>
    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
      style={{ background: dark ? "rgba(255,255,255,0.05)" : "#F5F1EB", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#EAE4DC"}` }}>
      {post.image
        ? <img src={post.image} alt={post.title} className="w-full h-full object-cover"
            onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement.textContent = post.emoji; }} />
        : <span className="w-full h-full flex items-center justify-center text-lg">{post.emoji}</span>
      }
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[0.78rem] font-medium leading-snug truncate"
        style={{ color: dark ? "rgba(250,248,244,0.78)" : "#1A1612" }}>
        {post.title}
      </div>
      <div className="text-[0.67rem] mt-0.5" style={{ color: dark ? "rgba(250,248,244,0.32)" : "#9C8E84" }}>
        {post.meta}
      </div>
    </div>
    <span className="text-[0.7rem] font-bold flex-shrink-0 mt-0.5" style={{ color: accent }}>→</span>
  </Link>
);

// ─── CATEGORY CARD ───────────────────────────────────────────────────
const CategoryCard = ({ group, dark, delay }) => {
  const ref = useFadeIn(delay);
  const [hovered, setHovered] = useState(false);
  const border = dark ? "rgba(255,255,255,0.07)" : "#EAE4DC";

  return (
    <div ref={ref}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
        border: `1px solid ${hovered ? group.accentBorder : border}`,
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow: hovered ? (dark ? "0 20px 48px rgba(0,0,0,0.38)" : "0 20px 48px rgba(26,22,18,0.1)") : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      {/* Accent bar */}
      <div className="h-[3px] w-full transition-all duration-300"
        style={{ background: hovered ? group.accent : "transparent" }} />

      {/* Hero image — first post's image */}
      <div className="relative overflow-hidden" style={{ height: "130px" }}>
        {group.posts[0]?.image ? (
          <>
            <img src={group.posts[0].image} alt={group.posts[0].title}
              className="w-full h-full object-cover"
              style={{ transform: hovered ? "scale(1.06)" : "scale(1)", transition: "transform 0.5s ease" }}
              loading="lazy"
              onError={e => { e.currentTarget.parentElement.style.background = group.accentLight; e.currentTarget.style.display = "none"; }} />
            <div className="absolute inset-0" style={{
              background: dark
                ? "linear-gradient(to bottom, rgba(15,14,13,0.05) 0%, rgba(15,14,13,0.65) 100%)"
                : "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(250,248,244,0.6) 100%)"
            }} />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl"
            style={{ background: group.accentLight }}>
            {group.emoji}
          </div>
        )}

        {/* Post count pill */}
        <div className="absolute top-3 right-3">
          <span className="text-[0.6rem] font-bold tracking-[0.08em] uppercase px-2.5 py-1 rounded-full"
            style={{ background: "rgba(10,9,8,0.68)", color: "#FAF8F4", backdropFilter: "blur(6px)" }}>
            {group.posts.length} {group.posts.length === 1 ? "post" : "posts"}
          </span>
        </div>

        {/* Emoji pill */}
        <div className="absolute bottom-3 left-3 w-9 h-9 rounded-xl flex items-center justify-center text-[1.1rem]"
          style={{
            background: "rgba(10,9,8,0.62)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.14)",
            transition: "transform 0.3s ease",
            transform: hovered ? "scale(1.1) rotate(-6deg)" : "scale(1) rotate(0deg)",
          }}>
          {group.emoji}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Tag label */}
        <div className="text-[0.6rem] font-bold uppercase tracking-[0.12em] mb-1"
          style={{ color: group.accent }}>
          {group.tagLabel}
        </div>

        {/* Title */}
        <h2 className="font-['DM_Serif_Display',serif] text-[1.22rem] leading-tight mb-2"
          style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>
          {group.tag}
        </h2>

        {/* Description */}
        <p className="text-[0.79rem] leading-relaxed mb-4"
          style={{ color: dark ? "rgba(250,248,244,0.48)" : "#7A6E64" }}>
          {group.description}
        </p>

        {/* Posts list */}
        <div className="flex-1">
          {group.posts.map((p, i) => (
            <PostMiniCard key={p.slug} post={p} dark={dark} accent={group.accent} />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4"
          style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#EAE4DC"}` }}>
          <span className="text-[0.68rem]" style={{ color: dark ? "rgba(250,248,244,0.28)" : "#9C8E84" }}>
            {group.posts.length} {group.posts.length === 1 ? "article" : "articles"}
          </span>
          <Link to={`/category/${group.tag.toLowerCase().replace(/\s+/g, "-")}`}
            className="inline-flex items-center gap-1.5 text-[0.75rem] font-bold transition-all duration-200 hover:gap-2.5"
            style={{ color: group.accent, textDecoration: "none" }}>
            View all →
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── STATS ROW ───────────────────────────────────────────────────────
const StatsRow = ({ categories, totalPosts, dark }) => {
  const border = dark ? "rgba(255,255,255,0.07)" : "#EAE4DC";
  const stats = [
    { label: "Total Posts", value: totalPosts },
    { label: "Categories", value: categories.length },
    { label: "Latest", value: "May 2026" },
    { label: "Avg Read", value: "7 min" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden mb-12"
      style={{ border: `1px solid ${border}` }}>
      {stats.map((s, i) => (
        <div key={i} className="flex flex-col items-center justify-center py-5 px-4 text-center"
          style={{
            background: dark ? "rgba(255,255,255,0.022)" : "#FFFFFF",
            borderRight: i < 3 ? `1px solid ${border}` : "none",
          }}>
          <div className="font-['DM_Serif_Display',serif] text-[1.85rem] leading-none mb-0.5"
            style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>{s.value}</div>
          <div className="text-[0.63rem] font-semibold uppercase tracking-[0.1em]"
            style={{ color: dark ? "rgba(250,248,244,0.33)" : "#9C8E84" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
};

// ─── FOOTER ──────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{ background: "#0F0E0D" }}>
    <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,#E60023,transparent)" }} />
    <div className="max-w-[1280px] mx-auto px-6 pt-10 pb-8">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-8"
        style={{ borderBottom: "1px solid rgba(250,248,244,0.07)" }}>
        <div>
          <div className="font-['DM_Serif_Display',serif] text-[1.7rem] mb-1.5" style={{ color: "#FAF8F4" }}>
            Veeresh<span style={{ color: "#E60023" }}>.</span>
          </div>
          <p className="text-[0.78rem] max-w-[240px] leading-relaxed" style={{ color: "rgba(250,248,244,0.38)" }}>
            Writing about small things that make life better. Based in Hubballi, India.
          </p>
        </div>
        <a href={SITE.pinterestUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-bold text-[0.8rem] px-5 py-2.5 rounded-full hover:opacity-90 transition-all flex-shrink-0"
          style={{ background: "#E60023", color: "#fff" }}>
          <PinterestIcon /> Follow on Pinterest
        </a>
      </div>
      <div className="pt-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="text-[0.7rem]" style={{ color: "rgba(250,248,244,0.22)" }}>
          © {new Date().getFullYear()} Veeresh Bashetti. All rights reserved.
        </span>
        <span className="flex items-center gap-1 text-[0.7rem]" style={{ color: "rgba(250,248,244,0.18)" }}>
          Made with <span style={{ color: "#E60023" }}>♥</span> in Hubballi, India
        </span>
      </div>
    </div>
  </footer>
);

// ─── PAGE ────────────────────────────────────────────────────────────
export default function CategoriesPage() {
  const [dark, toggleDark] = useDarkMode();
  const [posts, setPosts] = useState(REAL_POSTS);
  const [query, setQuery] = useState("");

  const bg = dark ? "#0F0E0D" : "#FAF8F4";
  const border = dark ? "rgba(255,255,255,0.07)" : "#EAE4DC";

  // Try to fetch live manifest; fall back to REAL_POSTS
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/blogs/manifest.json");
        const ct = res.headers.get("content-type") || "";
        if (!res.ok || ct.includes("text/html")) return;
        const data = await res.json();
        if (Array.isArray(data.posts) && data.posts.length) setPosts(data.posts);
      } catch { /* use hardcoded fallback */ }
    })();
  }, []);

  const allGroups = groupByTag(posts);
  const filtered = allGroups.filter(g =>
    g.tag.toLowerCase().includes(query.toLowerCase()) ||
    g.description.toLowerCase().includes(query.toLowerCase()) ||
    g.tagLabel.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
        html { scroll-behavior:smooth; }
        body { font-family:'Outfit',sans-serif; background:${bg}; color:${dark?"#FAF8F4":"#1A1612"}; overflow-x:hidden; transition:background .3s,color .3s; }
        ::selection { background:#E6002326; }
        input::placeholder { color:${dark?"rgba(250,248,244,0.3)":"#9C8E84"}; }
        input:focus { border-color:rgba(230,0,35,0.4)!important; box-shadow:0 0 0 3px rgba(230,0,35,0.08); outline:none; }
        a { text-decoration:none; }
      `}</style>

      <div style={{ background: bg, minHeight: "100vh" }}>
        <Navbar dark={dark} toggleDark={toggleDark} />

        {/* ── HERO HEADER ── */}
        <section className="max-w-[1280px] mx-auto px-6 pt-28 pb-10"
          style={{ animation: "fadeUp 0.6s ease forwards" }}>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[0.72rem] font-medium mb-8 flex-wrap"
            style={{ color: dark ? "rgba(250,248,244,0.38)" : "#9C8E84" }}>
            <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
            <span>›</span>
            <Link to="/#blog" className="hover:text-red-500 transition-colors">Blog</Link>
            <span>›</span>
            <span style={{ color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" }}>Categories</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-[560px]">
              <span className="inline-block text-[0.66rem] font-bold tracking-[0.13em] uppercase px-3 py-1.5 rounded-full mb-4"
                style={{ background: "#E600230F", color: "#E60023", border: "1px solid #E6002322" }}>
                Browse Topics
              </span>
              <h1 className="font-['DM_Serif_Display',serif] leading-[1.04] tracking-[-0.02em] mb-3"
                style={{ fontSize: "clamp(2.2rem,5vw,3.4rem)", color: dark ? "#FAF8F4" : "#1A1612" }}>
                All Categories
              </h1>
              <p className="text-[0.96rem] leading-relaxed"
                style={{ color: dark ? "rgba(250,248,244,0.48)" : "#7A6E64" }}>
                {posts.length} posts across {allGroups.length} topics — pick a thread and pull.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full max-w-[320px]">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: dark ? "rgba(250,248,244,0.3)" : "#9C8E84" }}>
                <Icon d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" size={15} />
              </span>
              <input type="text" placeholder="Search categories…"
                value={query} onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-3 rounded-xl text-[0.84rem] transition-all"
                style={{
                  background: dark ? "rgba(255,255,255,0.05)" : "#FFFFFF",
                  border: `1.5px solid ${border}`,
                  color: dark ? "#FAF8F4" : "#1A1612",
                  fontFamily: "Outfit,sans-serif",
                }} />
              {query && (
                <button onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 transition-opacity"
                  style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>
                  <Icon d="M18 6L6 18M6 6l12 12" size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full mt-8"
            style={{ background: `linear-gradient(90deg,#E60023 0%,${border} 40%,transparent 100%)` }} />
        </section>

        {/* ── STATS ── */}
        <section className="max-w-[1280px] mx-auto px-6">
          <StatsRow categories={allGroups} totalPosts={posts.length} dark={dark} />
        </section>

        {/* ── CARDS GRID ── */}
        <section className="max-w-[1280px] mx-auto px-6 pb-20">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-2xl text-center"
              style={{ background: dark ? "rgba(255,255,255,0.02)" : "#F9F6F1", border: `1px dashed ${border}` }}>
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="font-['DM_Serif_Display',serif] text-2xl mb-2"
                style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>No categories found</h2>
              <p className="text-[0.84rem] mb-5" style={{ color: dark ? "rgba(250,248,244,0.4)" : "#9C8E84" }}>
                Try a different search term.
              </p>
              <button onClick={() => setQuery("")}
                className="px-5 py-2.5 rounded-full text-[0.8rem] font-bold hover:opacity-80 transition-all"
                style={{ background: "#E60023", color: "#fff" }}>
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filtered.map((group, i) => (
                <CategoryCard key={group.tag} group={group} dark={dark} delay={i * 80} />
              ))}
            </div>
          )}
        </section>

        {/* ── CTA ── */}
        <section className="max-w-[1280px] mx-auto px-6 pb-20">
          <div className="rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF", border: `1px solid ${border}` }}>
            <div>
              <h2 className="font-['DM_Serif_Display',serif] text-[1.5rem] mb-1"
                style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>
                Want visual inspiration?
              </h2>
              <p className="text-[0.82rem]" style={{ color: dark ? "rgba(250,248,244,0.42)" : "#7A6E64" }}>
                Follow the Pinterest board — curated finds across all topics, daily.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
              <a href={SITE.pinterestUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold text-[0.82rem] px-6 py-3 rounded-full hover:opacity-90 hover:-translate-y-px transition-all"
                style={{ background: "#E60023", color: "#fff" }}>
                <PinterestIcon /> Follow on Pinterest
              </a>
              <a href={`mailto:${SITE.email}`}
                className="inline-flex items-center text-[0.8rem] font-semibold px-5 py-3 rounded-full border hover:opacity-70 transition-all"
                style={{ borderColor: border, color: dark ? "rgba(250,248,244,0.65)" : "#3D3530" }}>
                Say hi →
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}