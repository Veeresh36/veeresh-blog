import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ═══════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════
const SITE = {
    name: "Veeresh Bashetti",
    email: "veeresh.b.bashetti@gmail.com",
    pinterestUrl: "https://in.pinterest.com/veereshbbashetti/",
    baseUrl: "https://veereshbashetti.com",
};

// ═══════════════════════════════════════════════
// STATIC PAGES
// ═══════════════════════════════════════════════
const STATIC_SECTIONS = [
    {
        id: "main",
        label: "Main pages",
        icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        pages: [
            { label: "Home", path: "/", description: "The homepage — latest posts and about section" },
            { label: "Blog", path: "/blog", description: "All articles, sorted by date" },
        ],
    },
    {
        id: "categories",
        label: "Categories",
        icon: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14",
        pages: [
            { label: "Finance", path: "/category/finance", description: "Money, investing, and personal finance" },
            { label: "Tech", path: "/category/tech", description: "Apps, tools, and technology" },
            { label: "Lifestyle", path: "/category/lifestyle", description: "Everyday habits and living well" },
            { label: "Personal Growth", path: "/category/personal-growth", description: "Learning, mindset, and self-improvement" },
        ],
    },
    {
        id: "legal",
        label: "Legal",
        icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        pages: [
            { label: "Privacy Policy", path: "/privacy-policy", description: "How your data is collected and used" },
            { label: "Terms of Use", path: "/terms", description: "Rules and conditions for using this site" },
            { label: "Sitemap", path: "/sitemap", description: "All pages on this site" },
        ],
    },
];

// ═══════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════
const Icon = ({ d, size = 18, className = "" }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={size}
        height={size}
        className={className}
        aria-hidden="true"
    >
        <path d={d} />
    </svg>
);

const PinterestIcon = ({ size = 16 }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
);

const SunIcon = () => (
    <Icon d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />
);
const MoonIcon = () => <Icon d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />;

// ═══════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════
function useDarkMode() {
    const [dark, setDark] = useState(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("blog-theme");
            if (stored) return stored === "dark";
            return window.matchMedia("(prefers-color-scheme: dark)").matches;
        }
        return false;
    });
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
        localStorage.setItem("blog-theme", dark ? "dark" : "light");
    }, [dark]);
    return [dark, () => setDark((d) => !d)];
}

function formatDate(d) {
    if (!d) return "";
    try {
        return new Date(d).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return d;
    }
}

function normalizeTags(tags) {
    if (!Array.isArray(tags)) return [];
    return tags
        .map((t) => {
            if (typeof t === "string") return t.trim();
            if (t && typeof t === "object") {
                const key = Object.keys(t)[0];
                return key ? String(key).trim() : null;
            }
            return null;
        })
        .filter(Boolean);
}

// ═══════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════
const Navbar = ({ dark, toggleDark }) => {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
            style={{
                background: dark ? "rgba(15,14,13,0.92)" : "rgba(250,248,244,0.92)",
                backdropFilter: "blur(20px)",
                borderBottom: scrolled
                    ? `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(26,22,18,0.08)"}`
                    : "1px solid transparent",
            }}
        >
            <div className="max-w-[1280px] mx-auto px-6 h-[68px] flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="font-['DM_Serif_Display',serif] text-[1.3rem] tracking-tight flex-shrink-0"
                        style={{ color: dark ? "#FAF8F4" : "#1A1612" }}
                    >
                        Veeresh<span className="text-red-500">.</span>
                    </Link>
                    <Link
                        to="/blog"
                        className="hidden md:inline-flex items-center gap-1.5 text-[0.75rem] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 hover:opacity-70"
                        style={{
                            borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)",
                            color: dark ? "rgba(250,248,244,0.55)" : "#7A6E64",
                        }}
                    >
                        ← Blog
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleDark}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-200 hover:opacity-70"
                        style={{
                            borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)",
                            color: dark ? "#FAF8F4" : "#3D3530",
                        }}
                        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {dark ? <SunIcon /> : <MoonIcon />}
                    </button>
                    <a
                        href={SITE.pinterestUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:inline-flex items-center gap-1.5 text-[0.78rem] font-bold px-4 py-2 rounded-full transition-all duration-300 hover:-translate-y-px hover:opacity-90"
                        style={{ background: "#E60023", color: "#fff" }}
                    >
                        <PinterestIcon size={13} /> Follow
                    </a>
                </div>
            </div>
        </nav>
    );
};

// Skeleton loader for blog posts
const PostSkeleton = ({ dark }) => (
    <div className="animate-pulse flex items-start gap-4 py-3.5">
        <div
            className="w-10 h-10 rounded-xl flex-shrink-0"
            style={{ background: dark ? "rgba(255,255,255,0.05)" : "#EAE4DC" }}
        />
        <div className="flex-1 space-y-2">
            <div
                className="h-3.5 rounded-full w-2/3"
                style={{ background: dark ? "rgba(255,255,255,0.05)" : "#EAE4DC" }}
            />
            <div
                className="h-2.5 rounded-full w-1/3"
                style={{ background: dark ? "rgba(255,255,255,0.04)" : "#F0EBE3" }}
            />
        </div>
    </div>
);

// Single static page row
const PageRow = ({ page, dark, border, isLast }) => (
    <Link
        to={page.path}
        className="flex items-center gap-4 py-3.5 transition-all duration-200 group hover:opacity-75"
        style={{
            borderBottom: isLast ? "none" : `1px solid ${border}`,
            textDecoration: "none",
        }}
    >
        <div
            className="w-1.5 h-1.5 rounded-full flex-shrink-0 ml-1"
            style={{ background: "#E60023" }}
        />
        <div className="flex-1 min-w-0">
            <div
                className="text-[0.88rem] font-semibold group-hover:text-red-500 transition-colors truncate"
                style={{ color: dark ? "rgba(250,248,244,0.85)" : "#1A1612" }}
            >
                {page.label}
            </div>
            {page.description && (
                <div
                    className="text-[0.76rem] font-light mt-0.5 truncate"
                    style={{ color: dark ? "rgba(250,248,244,0.38)" : "#9C8E84" }}
                >
                    {page.description}
                </div>
            )}
        </div>
        <div
            className="text-[0.7rem] font-mono opacity-40 flex-shrink-0 hidden sm:block"
            style={{ color: dark ? "#FAF8F4" : "#1A1612" }}
        >
            {page.path}
        </div>
        <Icon
            d="M9 18l6-6-6-6"
            size={14}
            className="flex-shrink-0 opacity-0 group-hover:opacity-40 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-200"
            style={{ color: dark ? "#FAF8F4" : "#1A1612" }}
        />
    </Link>
);

// Single blog post row
const PostRow = ({ post, dark, border, isLast }) => {
    const tags = normalizeTags(post.tags);
    return (
        <Link
            to={`/blog/${post.slug}`}
            className="flex items-start gap-4 py-3.5 transition-all duration-200 group hover:opacity-75"
            style={{
                borderBottom: isLast ? "none" : `1px solid ${border}`,
                textDecoration: "none",
            }}
        >
            {/* Emoji / thumbnail */}
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{
                    background: dark ? "rgba(255,255,255,0.05)" : "#F5F1EB",
                    border: `1px solid ${border}`,
                }}
            >
                {post.emoji || "📝"}
            </div>

            <div className="flex-1 min-w-0">
                <div
                    className="text-[0.88rem] font-semibold leading-snug group-hover:text-red-500 transition-colors"
                    style={{ color: dark ? "rgba(250,248,244,0.88)" : "#1A1612" }}
                >
                    {post.title}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {post.category && (
                        <span
                            className="text-[0.65rem] font-bold uppercase tracking-wider"
                            style={{ color: "#E60023" }}
                        >
                            {post.category}
                        </span>
                    )}
                    {post.category && post.date && (
                        <span style={{ color: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)" }}>·</span>
                    )}
                    {post.date && (
                        <span
                            className="text-[0.72rem] font-light"
                            style={{ color: dark ? "rgba(250,248,244,0.38)" : "#9C8E84" }}
                        >
                            {formatDate(post.date)}
                        </span>
                    )}
                    {tags.slice(0, 2).map((tag) => (
                        <span
                            key={tag}
                            className="text-[0.62rem] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                                background: dark ? "rgba(255,255,255,0.05)" : "#F0EBE3",
                                color: dark ? "rgba(250,248,244,0.655)" : "#7A6E64",
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <Icon
                d="M9 18l6-6-6-6"
                size={14}
                className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-40 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-200"
                style={{ color: dark ? "#FAF8F4" : "#1A1612" }}
            />
        </Link>
    );
};

// Section card wrapper
const SectionCard = ({ section, dark, border, children, count }) => (
    <div
        id={section.id}
        className="rounded-2xl overflow-hidden"
        style={{
            background: dark ? "rgba(255,255,255,0.02)" : "#FFFFFF",
            border: `1px solid ${border}`,
        }}
    >
        {/* Card header */}
        <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: `1px solid ${border}` }}
        >
            <div className="flex items-center gap-3">
                <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: dark ? "rgba(230,0,35,0.12)" : "#FFF0F1" }}
                >
                    <Icon d={section.icon} size={13} className="text-red-500" />
                </div>
                <span
                    className="font-['DM_Serif_Display',serif] text-[1.05rem]"
                    style={{ color: dark ? "#FAF8F4" : "#1A1612" }}
                >
                    {section.label}
                </span>
            </div>
            {count !== undefined && (
                <span
                    className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full"
                    style={{
                        background: dark ? "rgba(255,255,255,0.06)" : "#F0EBE3",
                        color: dark ? "rgba(250,248,244,0.655)" : "#7A6E64",
                    }}
                >
                    {count}
                </span>
            )}
        </div>

        {/* Card body */}
        <div className="px-5">{children}</div>
    </div>
);

// ═══════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════
export default function Sitemap() {
    const [dark, toggleDark] = useDarkMode();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    const bg = dark ? "#0F0E0D" : "#FAF8F4";
    const border = dark ? "rgba(255,255,255,0.07)" : "#EAE4DC";

    // Fetch posts from manifest
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/blogs/manifest.json");
                if (!res.ok) throw new Error();
                const contentType = res.headers.get("content-type") || "";
                if (contentType.includes("text/html")) throw new Error();
                const manifest = await res.json();
                const sorted = (manifest.posts || []).sort(
                    (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
                );
                setPosts(sorted);
            } catch {
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // SEO
    useEffect(() => {
        document.title = `Sitemap — ${SITE.name}`;
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
        }
        canonical.href = `${SITE.baseUrl}/sitemap`;
    }, []);

    // Derived data
    const categories = ["all", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];

    const filteredPosts = posts.filter((p) => {
        const matchesSearch =
            !searchQuery ||
            p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            normalizeTags(p.tags).some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = activeCategory === "all" || p.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const totalPages =
        STATIC_SECTIONS.reduce((acc, s) => acc + s.pages.length, 0) + posts.length;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        html { scroll-behavior: smooth; }
        body {
          font-family: 'Outfit', sans-serif;
          background: ${bg};
          color: ${dark ? "#FAF8F4" : "#1A1612"};
          overflow-x: hidden;
          transition: background 0.3s, color 0.3s;
        }
        ::selection { background: #E6002326; }

        input[type="search"]::-webkit-search-cancel-button { display: none; }
        input::placeholder { color: ${dark ? "rgba(250,248,244,0.28)" : "#B0A89E"}; }
      `}</style>

            <Navbar dark={dark} toggleDark={toggleDark} />

            <div style={{ background: bg, minHeight: "100vh" }}>

                {/* ── Breadcrumb ── */}
                <nav
                    className="max-w-[1280px] mx-auto px-6 pt-28 pb-0 flex items-center gap-2 text-xs font-medium"
                    style={{ color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" }}
                    aria-label="Breadcrumb"
                >
                    <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
                    <span>›</span>
                    <span style={{ color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" }}>Sitemap</span>
                </nav>

                {/* ── Hero header ── */}
                <header
                    className="max-w-[1280px] mx-auto px-6 pt-8 pb-12"
                    style={{ animation: "fadeUp 0.6s ease forwards" }}
                >
                    <div
                        className="inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full mb-5"
                        style={{ background: "#E600230F", color: "#E60023", border: "1px solid #E6002322" }}
                    >
                        Navigation
                    </div>
                    <h1
                        className="font-['DM_Serif_Display',serif] leading-[1.06] tracking-[-0.02em] mb-4"
                        style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", color: dark ? "#FAF8F4" : "#1A1612" }}
                    >
                        Sitemap
                    </h1>
                    <p
                        className="text-[1rem] leading-relaxed max-w-[480px] font-light mb-6"
                        style={{ color: dark ? "rgba(250,248,244,0.5)" : "#7A6E64" }}
                    >
                        Every page on this site, in one place. Browse by section or search for something specific.
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 flex-wrap">
                        {[
                            { value: loading ? "—" : posts.length, label: "articles" },
                            { value: STATIC_SECTIONS.reduce((a, s) => a + s.pages.length, 0), label: "pages" },
                            { value: loading ? "—" : totalPages, label: "total URLs" },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="flex items-baseline gap-1.5 px-3.5 py-2 rounded-xl"
                                style={{
                                    background: dark ? "rgba(255,255,255,0.04)" : "#F5F1EB",
                                    border: `1px solid ${border}`,
                                }}
                            >
                                <span
                                    className="font-['DM_Serif_Display',serif] text-[1.2rem]"
                                    style={{ color: dark ? "#FAF8F4" : "#1A1612" }}
                                >
                                    {stat.value}
                                </span>
                                <span
                                    className="text-[0.72rem] font-medium"
                                    style={{ color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" }}
                                >
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </header>

                {/* ── Main content ── */}
                <div className="max-w-[1280px] mx-auto px-6 pb-28">

                    {/* Search + category filter bar */}
                    <div
                        className="flex flex-col sm:flex-row gap-3 mb-8 pb-8"
                        style={{ borderBottom: `1px solid ${border}` }}
                    >
                        {/* Search */}
                        <div className="relative flex-1 max-w-sm">
                            <Icon
                                d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                                size={15}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ color: dark ? "rgba(250,248,244,0.3)" : "#AAA09A" }}
                            />
                            <label htmlFor="sitemap-search" className="sr-only">
                                Search articles
                            </label>

                            <input
                                id="sitemap-search"
                                type="search"
                                placeholder="Search articles…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label="Search articles"
                                className="w-full pl-9 pr-4 py-2.5 text-[0.85rem] rounded-xl border outline-none transition-all duration-200"
                                style={{
                                    background: dark ? "rgba(255,255,255,0.04)" : "#FFFFFF",
                                    borderColor: border,
                                    color: dark ? "#FAF8F4" : "#1A1612",
                                    fontFamily: "Outfit, sans-serif",
                                }}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-70 transition-opacity"
                                    style={{ color: dark ? "#FAF8F4" : "#1A1612" }}
                                    aria-label="Clear search"
                                >
                                    <Icon d="M18 6L6 18M6 6l12 12" size={14} />
                                </button>
                            )}
                        </div>

                        {/* Category pills */}
                        {!loading && categories.length > 1 && (
                            <div className="flex items-center gap-2 flex-wrap">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className="text-[0.73rem] font-semibold px-3.5 py-2 rounded-full border transition-all duration-200 capitalize"
                                        style={{
                                            background:
                                                activeCategory === cat
                                                    ? "#E60023"
                                                    : dark
                                                        ? "rgba(255,255,255,0.04)"
                                                        : "#F5F1EB",
                                            borderColor:
                                                activeCategory === cat ? "#E60023" : border,
                                            color:
                                                activeCategory === cat
                                                    ? "#fff"
                                                    : dark
                                                        ? "rgba(250,248,244,0.65)"
                                                        : "#5A5046",
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">

                        {/* ── Left: Blog posts ── */}
                        <div>
                            <SectionCard
                                section={{
                                    id: "blog-posts",
                                    label: "Blog articles",
                                    icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
                                }}
                                dark={dark}
                                border={border}
                                count={loading ? undefined : filteredPosts.length}
                            >
                                {loading ? (
                                    <div>
                                        {[...Array(6)].map((_, i) => (
                                            <PostSkeleton key={i} dark={dark} />
                                        ))}
                                    </div>
                                ) : filteredPosts.length === 0 ? (
                                    <div
                                        className="py-14 text-center"
                                        style={{ color: dark ? "rgba(250,248,244,0.35)" : "#9C8E84" }}
                                    >
                                        <div className="text-3xl mb-3">🔍</div>
                                        <p className="text-[0.88rem]">
                                            No articles match{" "}
                                            <span className="font-semibold">"{searchQuery}"</span>
                                        </p>
                                        <button
                                            onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                                            className="mt-3 text-[0.8rem] font-semibold underline"
                                            style={{ color: "#E60023" }}
                                        >
                                            Clear filters
                                        </button>
                                    </div>
                                ) : (
                                    filteredPosts.map((post, i) => (
                                        <PostRow
                                            key={post.slug || i}
                                            post={post}
                                            dark={dark}
                                            border={border}
                                            isLast={i === filteredPosts.length - 1}
                                        />
                                    ))
                                )}
                            </SectionCard>
                        </div>

                        {/* ── Right: Static pages ── */}
                        <div className="flex flex-col gap-5 lg:sticky lg:top-[96px] self-start">
                            {STATIC_SECTIONS.map((section) => (
                                <SectionCard
                                    key={section.id}
                                    section={section}
                                    dark={dark}
                                    border={border}
                                    count={section.pages.length}
                                >
                                    {section.pages.map((page, i) => (
                                        <PageRow
                                            key={page.path}
                                            page={page}
                                            dark={dark}
                                            border={border}
                                            isLast={i === section.pages.length - 1}
                                        />
                                    ))}
                                </SectionCard>
                            ))}

                            {/* XML sitemap note */}
                            <div
                                className="rounded-2xl p-4 flex items-start gap-3"
                                style={{
                                    background: dark ? "rgba(255,255,255,0.02)" : "#F9F6F1",
                                    border: `1px solid ${border}`,
                                }}
                            >
                                <Icon
                                    d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                                    size={15}
                                    className="flex-shrink-0 mt-0.5"
                                    style={{ color: dark ? "rgba(250,248,244,0.3)" : "#AAA09A" }}
                                />
                                <div>
                                    <p
                                        className="text-[0.78rem] font-medium mb-1"
                                        style={{ color: dark ? "rgba(250,248,244,0.5)" : "#7A6E64" }}
                                    >
                                        Looking for the XML sitemap?
                                    </p>
                                    <a
                                        href="/sitemap.xml"
                                        className="text-[0.75rem] font-semibold hover:opacity-70 transition-opacity"
                                        style={{ color: "#E60023" }}
                                    >
                                        /sitemap.xml →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
                <footer className="relative z-10 overflow-hidden" style={{ background: "#0F0E0D" }}>
                    <div
                        className="h-px w-full"
                        style={{ background: "linear-gradient(90deg, transparent, #E60023, transparent)" }}
                    />
                    <div className="max-w-[1280px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <Link
                                to="/"
                                className="font-['DM_Serif_Display',serif] text-[1.2rem]"
                                style={{ color: "#FAF8F4" }}
                            >
                                Veeresh<span style={{ color: "#E60023" }}>.</span>
                            </Link>
                            <span className="text-[0.72rem]" style={{ color: "rgba(250,248,244,0.5)" }}>
                                © {new Date().getFullYear()} All rights reserved.
                            </span>
                        </div>
                        <div
                            className="flex items-center gap-4 text-[0.78rem]"
                            style={{ color: "rgba(250,248,244,0.65)" }}
                        >
                            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
                            <span style={{ color: "rgba(250,248,244,0.15)" }}>·</span>
                            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <span style={{ color: "rgba(250,248,244,0.15)" }}>·</span>
                            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}