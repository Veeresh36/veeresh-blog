/**
 * ============================================================
 * Veeresh Bashetti — 404 Not Found Page (updated)
 * ============================================================
 * Changes from previous version:
 *  - noindex now set with react-helmet-async, so it is written into
 *    the prerendered 404.html at build time (not only in the browser)
 *  - Removed the useEffect head injection and invalid JSON-LD
 *  - Fixed broken "/#blog" links -> real "/blog" route
 *  - Uses <Link> / useNavigate so navigation doesn't reload the site
 *  - "Go back" falls back to home when there is no history
 *  - Copy updated to match the blog's real topics
 * ============================================================
 */

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";

// ─── ICONS ──────────────────────────────────────────────────
const HomeIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const SearchIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

const BackIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

// ─── LOCAL STYLES ───────────────────────────────────────────
const NotFoundStyles = () => (
    <style>{`
        @keyframes luxuryFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes slowPulse {
            0%, 100% { opacity: 0.15; transform: scale(1); }
            50% { opacity: 0.25; transform: scale(1.05); }
        }
        .animate-luxuryFloat { animation: luxuryFloat 6s ease-in-out infinite; }
        .animate-slowPulse { animation: slowPulse 8s ease-in-out infinite; }

        .premium-blur-circle {
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(230,0,35,0.08) 0%, transparent 70%);
            filter: blur(60px);
            pointer-events: none;
            z-index: 0;
        }

        @media (prefers-reduced-motion: reduce) {
            .animate-luxuryFloat,
            .animate-slowPulse { animation: none; }
        }
    `}</style>
);

export default function NotFound() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = searchQuery.trim();
        if (query) {
            navigate(`/blog?search=${encodeURIComponent(query)}`);
        }
    };

    const handleGoBack = () => {
        if (typeof window !== "undefined" && window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    return (
        <>
            {/* Written into the prerendered HTML at build time */}
            <Helmet>
                <title>Page Not Found — Veeresh Bashetti</title>
                <meta name="robots" content="noindex, follow" />
                <meta property="og:title" content="404 — Page Not Found" />
                <meta
                    property="og:description"
                    content="The page you are looking for has moved or no longer exists."
                />
            </Helmet>

            <NotFoundStyles />

            <div className="min-h-screen bg-[#FAF8F4] text-[#1A1612] flex flex-col justify-between relative overflow-hidden px-8 font-body">
                {/* Background glows */}
                <div className="premium-blur-circle w-[500px] h-[500px] -top-20 -left-20 animate-slowPulse" />
                <div
                    className="premium-blur-circle w-[600px] h-[600px] bottom-10 -right-20 animate-slowPulse"
                    style={{ animationDelay: "2s" }}
                />

                {/* Header */}
                <header role="banner" className="max-w-[1240px] w-full mx-auto h-[90px] flex items-center justify-between relative z-10">
                    <Link to="/" className="font-display text-[1.35rem] text-[#1A1612] tracking-tight">
                        Veeresh<span className="text-[#E60023]">.</span>
                    </Link>
                    <Link
                        to="/blog"
                        className="text-xs font-semibold uppercase tracking-widest text-[#8C7E74] hover:text-[#E60023] transition-colors duration-300"
                    >
                        Back to Blog
                    </Link>
                </header>

                {/* Main */}
                <main id="main-content" role="main" className="max-w-[1240px] w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 pt-8 pb-16">
                    {/* Left column */}
                    <div className="animate-fadeUp">
                        <div className="inline-flex items-center gap-2 bg-[#F2EDE4] border border-[#E8E0D5] rounded-full px-4 py-1.5 text-xs font-bold text-[#8C7E74] uppercase tracking-widest mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E60023]" />
                            Error Code: 404
                        </div>

                        <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-tight text-[#1A1612] mb-6">
                            This page has <br />
                            <em className="text-gradient not-italic">drifted away.</em>
                        </h1>

                        <p className="text-[1.05rem] text-[#8C7E74] leading-[1.75] max-w-[480px] mb-10 font-light">
                            The article or page you are looking for doesn't exist here anymore. It may have been moved or removed. Try searching, or head back to the blog.
                        </p>

                        {/* Search */}
                        <form
                            onSubmit={handleSearchSubmit}
                            role="search"
                            aria-label="Search the blog"
                            className="flex gap-3 bg-white border-[1.5px] border-[#E8E0D5] rounded-full px-5 py-2.5 shadow-sm max-w-[480px] mb-10 focus-within:border-[#1A1612] transition-colors duration-300"
                        >
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles..."
                                aria-label="Search articles"
                                required
                                className="flex-1 border-none outline-none text-sm text-[#1A1612] bg-transparent placeholder-[#8C7E74] min-w-0"
                            />
                            <button
                                type="submit"
                                aria-label="Search"
                                className="bg-[#1A1612] text-[#FAF8F4] p-2.5 rounded-full hover:bg-[#E60023] transition-colors duration-300 flex items-center justify-center flex-shrink-0"
                            >
                                <SearchIcon size={14} />
                            </button>
                        </form>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4 items-center">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2.5 bg-[#1A1612] text-[#FAF8F4] font-semibold text-xs px-6 py-3.5 rounded-full hover:bg-[#E60023] transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
                            >
                                <HomeIcon size={14} />
                                Return Home
                            </Link>
                            <button
                                type="button"
                                onClick={handleGoBack}
                                className="inline-flex items-center gap-2.5 bg-transparent text-[#1A1612] font-semibold text-xs px-6 py-3.5 rounded-full border-[1.5px] border-[#E8E0D5] hover:border-[#1A1612] transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <BackIcon size={14} />
                                Go Back One Page
                            </button>
                        </div>
                    </div>

                    {/* Right column: decorative card */}
                    <div className="hidden lg:flex justify-center items-center relative animate-luxuryFloat" aria-hidden="true">
                        <div className="w-[380px] aspect-[3/4] bg-white rounded-2xl shadow-xl border border-[#E8E0D5] p-6 flex flex-col justify-between relative hover-lift">
                            <div className="flex justify-between items-center border-b border-[#FAF8F4] pb-4">
                                <span className="font-display text-xl text-black/10">Blog Index</span>
                                <span className="text-xl">🪞</span>
                            </div>

                            <div className="text-center my-auto flex flex-col items-center justify-center">
                                <span className="text-[7rem] leading-none select-none filter drop-shadow-md">404</span>
                                <div className="w-12 h-[1px] bg-[#E8E0D5] my-4" />
                                <span className="text-[0.7rem] uppercase font-bold tracking-[0.25em] text-[#8C7E74]">
                                    Page Not Found
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-t border-[#F2EDE4] pt-4 mt-auto">
                                <span className="text-[0.65rem] text-[#8C7E74] font-medium uppercase tracking-wider">
                                    Veeresh Bashetti
                                </span>
                                <span className="w-5 h-5 rounded-full bg-[#E60023] flex items-center justify-center text-[0.45rem] font-bold text-white">
                                    P
                                </span>
                            </div>
                        </div>

                        <div
                            className="absolute -bottom-6 -left-4 w-[200px] aspect-square rounded-2xl border border-[#E8E0D5] p-4 flex flex-col justify-between shadow-md"
                            style={{ background: "linear-gradient(135deg,#F2EDE4,#E8DDD0)" }}
                        >
                            <span className="text-2xl">🌿</span>
                            <div>
                                <span className="block text-[0.7rem] font-bold text-[#8C7E74] uppercase tracking-wider mb-0.5">Try this</span>
                                <span className="font-display text-xs text-[#1A1612] leading-tight block">Browse all articles on the blog</span>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer role="contentinfo" className="max-w-[1240px] w-full mx-auto h-[60px] flex items-center justify-between border-t border-[#E8E0D5] relative z-10 text-[0.78rem] text-[#8C7E74]">
                    <span>&copy; {new Date().getFullYear()} Veeresh Bashetti. All rights reserved.</span>
                    <div className="flex gap-6">
                        <Link to="/blog" className="hover:text-[#E60023] transition-colors">Read Blog</Link>
                        <a
                            href="https://in.pinterest.com/veereshbbashetti/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-[#E60023] transition-colors"
                        >
                            Pinterest ↗
                        </a>
                    </div>
                </footer>
            </div>
        </>
    );
}