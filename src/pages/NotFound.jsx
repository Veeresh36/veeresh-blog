/**
 * ============================================================
 * Veeresh Bashetti — Premium 404 Not Found Page
 * ============================================================
 * Stack : React (functional components + hooks) + Tailwind CSS
 * SEO   : Metadata updates, Noindex injection, JSON-LD Schema
 * Anim  : Premium slow-drift floating animations via injected CSS
 * Aesthetic: Executive, Minimalist, Luxury-Curator Vibe
 * ============================================================
 */

import { useEffect, useState } from "react";

// ─── REUSABLE PREMIUM ICONS ─────────────────────────────────
const HomeIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const SearchIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

const BackIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

// ─── LOCALIZED COMPONENT STYLES ─────────────────────────────
const NotFoundStyles = () => (
    <style>{`
        /* Premium structural blur and floating effects */
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
    `}</style>
);

export default function NotFound() {
    const [searchQuery, setSearchQuery] = useState("");

    // ─── SEO & ARCHITECTURE METRIC HEAD INJECTIONS ──────────
    useEffect(() => {
        const originalTitle = document.title;
        document.title = "Page Not Found — Veeresh Bashetti";

        // Helper function for mutating head attributes safely
        const setMetaTag = (attr, value, content) => {
            let el = document.querySelector(`meta[${attr}="${value}"]`);
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute(attr, value);
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };

        // Strict SEO Requirement: Tell engines not to index broken links/404s
        setMetaTag("name", "robots", "noindex, follow");
        setMetaTag("property", "og:title", "404 — Lost in Inspiration");
        setMetaTag("property", "og:description", "The curated space or story you're looking for has drifted elsewhere.");

        // Inject 404 Specific Structured Data for Core Web Vitals mapping
        let jsonLd404 = document.querySelector("#json-ld-404");
        if (!jsonLd404) {
            jsonLd404 = document.createElement("script");
            jsonLd404.id = "json-ld-404";
            jsonLd404.type = "application/ld+json";
            document.head.appendChild(jsonLd404);
        }
        jsonLd404.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "404 Not Found Page",
            "description": "Error page for missing content routes.",
            "mainEntity": {
                "@type": "NotFoundError",
                "text": "The requested resource could not be found on veereshbashetti.com"
            }
        });

        // Cleanup function resetting values on component switch
        return () => {
            document.title = originalTitle;
            const entry = document.querySelector('meta[name="robots"]');
            if (entry) entry.setAttribute("content", "index, follow");
            if (jsonLd404) jsonLd404.remove();
        };
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Forward user to your central fallback search engine or index route
            window.location.href = `/#blog?search=${encodeURIComponent(searchQuery)}`;
        }
    };

    return (
        <>
            <NotFoundStyles />

            <div className="min-h-screen bg-[#FAF8F4] text-[#1A1612] flex flex-col justify-between relative overflow-hidden px-8 font-body">
                {/* Decorative Premium Minimal Background Gradients */}
                <div className="premium-blur-circle w-[500px] h-[500px] -top-20 -left-20 animate-slowPulse" />
                <div className="premium-blur-circle w-[600px] h-[600px] bottom-10 -right-20 animate-slowPulse" style={{ animationDelay: "2s" }} />

                {/* Minimalist Top Nav Header Strip */}
                <header role="banner" className="max-w-[1240px] w-full mx-auto h-[90px] flex items-center justify-between relative z-10">
                    <a href="/" className="font-display text-[1.35rem] text-[#1A1612] tracking-tight">
                        Veeresh<span className="text-[#E60023]">.</span>
                    </a>
                    <a href="/#blog" className="text-xs font-semibold uppercase tracking-widest text-[#8C7E74] hover:text-[#E60023] transition-colors duration-300">
                        Back to Curation Index
                    </a>
                </header>

                {/* Main Content Area */}
                <main id="main-content" role="main" className="max-w-[1240px] w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 pt-8 pb-16">
                    
                    {/* Left Column: Premium Text & Logic Mapping */}
                    <div className="animate-fadeUp">
                        {/* Status Identifier */}
                        <div className="inline-flex items-center gap-2 bg-[#F2EDE4] border border-[#E8E0D5] rounded-full px-4 py-1.5 text-xs font-bold text-[#8C7E74] uppercase tracking-widest mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E60023]" />
                            Error Code: 404
                        </div>

                        <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-tight text-[#1A1612] mb-6">
                            This layout has <br />
                            <em className="text-gradient not-italic">drifted away.</em>
                        </h1>

                        <p className="text-[1.05rem] text-[#8C7E74] leading-[1.75] max-w-[480px] mb-10 font-light">
                            The story, space, or curated product recommendation you are seeking doesn't exist here anymore—or perhaps it's moved onto a new collection layout board.
                        </p>

                        {/* SEO Dynamic Rescue Feature: Real-time Inline Search Box */}
                        <form 
                            onSubmit={handleSearchSubmit}
                            role="search"
                            aria-label="404 Rescue Search"
                            className="flex gap-3 bg-white border-[1.5px] border-[#E8E0D5] rounded-full px-5 py-2.5 shadow-sm max-w-[480px] mb-10 focus-within:border-[#1A1612] transition-colors duration-300"
                        >
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles, rooms, recipes..."
                                aria-label="Search site content fallback"
                                required
                                className="flex-1 border-none outline-none text-sm text-[#1A1612] bg-transparent placeholder-[#8C7E74] min-w-0"
                            />
                            <button
                                type="submit"
                                aria-label="Execute Search Query"
                                className="bg-[#1A1612] text-[#FAF8F4] p-2.5 rounded-full hover:bg-[#E60023] transition-colors duration-300 flex items-center justify-center flex-shrink-0"
                            >
                                <SearchIcon size={14} />
                            </button>
                        </form>

                        {/* Luxury Segment Action Items */}
                        <div className="flex flex-wrap gap-4 items-center">
                            <a
                                href="/"
                                className="inline-flex items-center gap-2.5 bg-[#1A1612] text-[#FAF8F4] font-semibold text-xs px-6 py-3.5 rounded-full hover:bg-[#E60023] transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
                            >
                                <HomeIcon size={14} />
                                Return Home
                            </a>
                            <button
                                onClick={() => window.history.back()}
                                className="inline-flex items-center gap-2.5 bg-transparent text-[#1A1612] font-semibold text-xs px-6 py-3.5 rounded-full border-[1.5px] border-[#E8E0D5] hover:border-[#1A1612] transition-all duration-300 hover:-translate-y-0.5"
                            >
                                <BackIcon size={14} />
                                Go Back One Page
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Premium Abstract Graphic Mockup */}
                    <div className="hidden lg:flex justify-center items-center relative animate-luxuryFloat" aria-hidden="true">
                        <div className="w-[380px] aspect-[3/4] bg-white rounded-2xl shadow-xl border border-[#E8E0D5] p-6 flex flex-col justify-between relative hover-lift">
                            
                            {/* Decorative Top Accent Card Line */}
                            <div className="flex justify-between items-center border-b border-[#FAF8F4] pb-4">
                                <span className="font-display text-xl text-black/10">Collection Index</span>
                                <span className="text-xl">🪞</span>
                            </div>

                            {/* Centered Large Luxury Creative Accent */}
                            <div className="text-center my-auto flex flex-col items-center justify-center">
                                <span className="text-[7rem] leading-none select-none filter drop-shadow-md">404</span>
                                <div className="w-12 h-[1px] bg-[#E8E0D5] my-4" />
                                <span className="text-[0.7rem] uppercase font-bold tracking-[0.25em] text-[#8C7E74]">
                                    Missing Inspiration
                                </span>
                            </div>

                            {/* Stylized Simulated Footer Row */}
                            <div className="flex justify-between items-center border-t border-[#F2EDE4] pt-4 mt-auto">
                                <span className="text-[0.65rem] text-[#8C7E74] font-medium uppercase tracking-wider">
                                    Veeresh Bashetti
                                </span>
                                <span className="w-5 h-5 rounded-full bg-[#E60023] flex items-center justify-center text-[0.45rem] font-bold text-white">
                                    P
                                </span>
                            </div>
                        </div>

                        {/* Secondary Overlapping Card Element */}
                        <div 
                            className="absolute -bottom-6 -left-4 w-[200px] aspect-square rounded-2xl border border-[#E8E0D5] p-4 flex flex-col justify-between shadow-md"
                            style={{ background: "linear-gradient(135deg,#F2EDE4,#E8DDD0)" }}
                        >
                            <span className="text-2xl">🌿</span>
                            <div>
                                <span className="block text-[0.7rem] font-bold text-[#8C7E74] uppercase tracking-wider mb-0.5">Recommended</span>
                                <span className="font-display text-xs text-[#1A1612] leading-tight block">Minimalist Habits inside the Index</span>
                            </div>
                        </div>
                    </div>

                </main>

                {/* Micro Footer Copyright Strip */}
                <footer role="contentinfo" className="max-w-[1240px] w-full mx-auto h-[60px] flex items-center justify-between border-t border-[#E8E0D5] relative z-10 text-[0.78rem] text-[#8C7E74]">
                    <span>&copy; {new Date().getFullYear()} Veeresh Bashetti. All rights reserved.</span>
                    <div className="flex gap-6">
                        <a href="/#blog" className="hover:text-[#E60023] transition-colors">Read Blog</a>
                        <a href="https://in.pinterest.com/veereshbbashetti/" target="_blank" rel="noopener noreferrer" className="hover:text-[#E60023] transition-colors">Pinterest ↗</a>
                    </div>
                </footer>
            </div>
        </>
    );
}