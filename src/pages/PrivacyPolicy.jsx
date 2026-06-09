import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// ═══════════════════════════════════════════════
// CONFIG — mirrors ReadBlog.jsx
// ═══════════════════════════════════════════════
const SITE = {
    name: "Veeresh Bashetti",
    email: "veeresh.b.bashetti@gmail.com",
    pinterestUrl: "https://in.pinterest.com/veereshbbashetti/",
    baseUrl: "https://veereshbashetti.com",
};

const LAST_UPDATED = "May 31, 2025";

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

const SunIcon = () => <Icon d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />;
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

function useReadingProgress() {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const doc = document.documentElement;
            const total = doc.scrollHeight - doc.clientHeight;
            setProgress(total > 0 ? Math.round((doc.scrollTop / total) * 100) : 0);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return progress;
}

// ═══════════════════════════════════════════════
// POLICY SECTIONS DATA
// ═══════════════════════════════════════════════
const sections = [
    {
        id: "overview",
        title: "Overview",
        icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
        content: [
            {
                type: "text",
                value:
                    "This Privacy Policy describes how Veeresh Bashetti ('I', 'me', or 'my') collects, uses, and shares information when you visit veereshbashetti.com (the 'Site'). I take your privacy seriously and I've written this in plain language so it's actually readable.",
            },
            {
                type: "text",
                value:
                    "By using the Site, you agree to the collection and use of information in accordance with this policy. If you have any questions, feel free to reach out directly.",
            },
        ],
    },
    {
        id: "information-collected",
        title: "What I collect",
        icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
        content: [
            {
                type: "subheading",
                value: "Information you give me",
            },
            {
                type: "list",
                items: [
                    "Comments — your name and message when you leave a comment on a post.",
                    "Email — if you reach out to me directly via the contact email.",
                    "Nothing else. I don't run a newsletter or ask you to create an account.",
                ],
            },
            {
                type: "subheading",
                value: "Information collected automatically",
            },
            {
                type: "list",
                items: [
                    "Page views — which articles you read (anonymized, via Google Analytics).",
                    "Referral source — how you found the site (e.g. search, Pinterest, direct).",
                    "Device & browser type — for ensuring the site renders correctly.",
                    "Approximate location — country/city level only, never precise GPS.",
                ],
            },
            {
                type: "subheading",
                value: "Locally stored preferences",
            },
            {
                type: "text",
                value:
                    "Certain features — dark mode preference, font size, bookmarks, highlights, and reading streak — are stored in your browser's localStorage. This data never leaves your device and I cannot access it.",
            },
        ],
    },
    {
        id: "cookies",
        title: "Cookies",
        icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z",
        content: [
            {
                type: "text",
                value:
                    "The Site uses a small number of cookies. A cookie is a tiny file placed on your device that helps the site work properly.",
            },
            {
                type: "table",
                rows: [
                    { name: "Google Analytics (_ga, _gid)", purpose: "Measures site traffic anonymously", duration: "Up to 2 years" },
                    { name: "Google AdSense", purpose: "Shows relevant ads", duration: "Up to 13 months" },
                    { name: "Supabase session", purpose: "Authenticates comment API requests", duration: "Session only" },
                ],
            },
            {
                type: "text",
                value:
                    "You can disable cookies in your browser settings at any time. Doing so may affect how some features of the Site function, but the articles will still be fully readable.",
            },
        ],
    },
    {
        id: "third-parties",
        title: "Third-party services",
        icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
        content: [
            {
                type: "text",
                value:
                    "I use a handful of third-party services to run the Site. Each has their own privacy policy that governs how they handle data.",
            },
            {
                type: "cards",
                items: [
                    {
                        name: "Google Analytics",
                        description: "Anonymized traffic analytics. IP addresses are truncated before storage.",
                        link: "https://policies.google.com/privacy",
                    },
                    {
                        name: "Google AdSense",
                        description: "Displays advertisements. Google may use cookies to serve relevant ads.",
                        link: "https://policies.google.com/privacy",
                    },
                    {
                        name: "Supabase",
                        description: "Stores comments and emoji reactions. Data is held on secure servers.",
                        link: "https://supabase.com/privacy",
                    },
                    {
                        name: "Pinterest",
                        description: "The Follow button links to my Pinterest profile. Pinterest may set their own cookies.",
                        link: "https://policy.pinterest.com/en/privacy-policy",
                    },
                ],
            },
            {
                type: "text",
                value:
                    "Affiliate links — some articles contain affiliate links (primarily Amazon). If you click one and make a purchase, I may earn a small commission at no extra cost to you. These links are always disclosed near the relevant content.",
            },
        ],
    },
    {
        id: "data-use",
        title: "How I use your data",
        icon: "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 0-2 2h-2a2 2 0 0 0-2-2z",
        content: [
            {
                type: "list",
                items: [
                    "To display and improve the Site — understanding which content is useful helps me write better.",
                    "To show comments — names and messages posted publicly are visible to all readers.",
                    "To display ads — Google AdSense uses browsing data to show relevant advertisements.",
                    "To respond to enquiries — if you email me, I'll use your address only to reply.",
                    "Nothing is sold — I do not sell, rent, or trade your personal information to any third party.",
                ],
            },
        ],
    },
    {
        id: "your-rights",
        title: "Your rights",
        icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
        content: [
            {
                type: "text",
                value:
                    "Depending on where you live, you may have certain rights under applicable data protection laws (including GDPR if you're in the EU/EEA, or India's DPDP Act).",
            },
            {
                type: "list",
                items: [
                    "Access — request a copy of the personal data I hold about you.",
                    "Correction — ask me to correct inaccurate data.",
                    "Deletion — ask me to delete your comment or personal data.",
                    "Objection — object to processing based on legitimate interests.",
                    "Portability — receive your data in a machine-readable format.",
                ],
            },
            {
                type: "text",
                value:
                    "To exercise any of these rights, simply email me. I'll respond within 30 days.",
            },
        ],
    },
    {
        id: "children",
        title: "Children's privacy",
        icon: "M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zM9 13a3 3 0 0 0 6 0",
        content: [
            {
                type: "text",
                value:
                    "The Site is not directed at children under 13 years of age. I do not knowingly collect personal information from children. If you believe a child has submitted personal data to this Site, please contact me and I will remove it promptly.",
            },
        ],
    },
    {
        id: "changes",
        title: "Changes to this policy",
        icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15",
        content: [
            {
                type: "text",
                value:
                    "I may update this policy from time to time. When I do, I'll update the 'Last updated' date at the top of this page. Significant changes will be noted clearly. Continued use of the Site after changes constitutes acceptance of the revised policy.",
            },
        ],
    },
    {
        id: "contact",
        title: "Contact",
        icon: "M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z",
        content: [
            {
                type: "text",
                value:
                    "If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please reach out:",
            },
            {
                type: "contact",
                name: SITE.name,
                email: SITE.email,
                location: "Hubballi, Karnataka, India",
            },
        ],
    },
];

// ═══════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════

const ProgressBar = ({ progress }) => (
    <div
        className="fixed top-[68px] left-0 right-0 h-[3px] z-[99]"
        style={{ background: "transparent" }}
        aria-hidden="true"
    >
        <div
            className="h-full transition-[width] duration-75 ease-linear"
            style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #E60023, #FF6B81)",
            }}
        />
    </div>
);

const Navbar = ({ dark, toggleDark }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", fn, { passive: true });
        return () => window.removeEventListener("scroll", fn);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300`}
            style={{
                background: dark ? "rgba(15,14,13,0.92)" : "rgba(250,248,244,0.92)",
                backdropFilter: "blur(20px)",
                borderBottom: scrolled
                    ? `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(26,22,18,0.08)"}`
                    : "1px solid transparent",
                boxShadow: scrolled ? "0 1px 0 rgba(0,0,0,0.04)" : "none",
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

// Renders a single section's content blocks
const SectionContent = ({ content, dark }) => {
    const border = dark ? "rgba(255,255,255,0.07)" : "#EAE4DC";

    return (
        <div className="space-y-4">
            {content.map((block, i) => {
                if (block.type === "text") {
                    return (
                        <p
                            key={i}
                            className="text-[0.95rem] leading-[1.85] font-light"
                            style={{ color: dark ? "rgba(250,248,244,0.72)" : "#3D3530" }}
                        >
                            {block.value}
                        </p>
                    );
                }

                if (block.type === "subheading") {
                    return (
                        <h3
                            key={i}
                            className="font-['DM_Serif_Display',serif] text-[1.1rem] mt-6 mb-2"
                            style={{ color: dark ? "#FAF8F4" : "#1A1612" }}
                        >
                            {block.value}
                        </h3>
                    );
                }

                if (block.type === "list") {
                    return (
                        <ul key={i} className="space-y-2 mt-2">
                            {block.items.map((item, j) => (
                                <li
                                    key={j}
                                    className="flex items-start gap-3 text-[0.9rem] leading-relaxed font-light"
                                    style={{ color: dark ? "rgba(250,248,244,0.72)" : "#3D3530" }}
                                >
                                    <span
                                        className="flex-shrink-0 mt-[0.35rem] w-1.5 h-1.5 rounded-full"
                                        style={{ background: "#E60023" }}
                                    />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    );
                }

                if (block.type === "table") {
                    return (
                        <div key={i} className="overflow-x-auto mt-4 rounded-xl border" style={{ borderColor: border }}>
                            <table className="w-full text-[0.85rem] border-collapse">
                                <thead>
                                    <tr style={{ background: dark ? "rgba(255,255,255,0.04)" : "#F5F1EB" }}>
                                        {["Cookie", "Purpose", "Duration"].map((h) => (
                                            <th
                                                key={h}
                                                className="text-left px-4 py-3 font-semibold text-[0.75rem] uppercase tracking-wide"
                                                style={{ color: dark ? "rgba(250,248,244,0.5)" : "#7A6E64", borderBottom: `1px solid ${border}` }}
                                            >
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {block.rows.map((row, j) => (
                                        <tr key={j} style={{ borderBottom: j < block.rows.length - 1 ? `1px solid ${border}` : "none" }}>
                                            <td className="px-4 py-3 font-medium text-[0.82rem]" style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>{row.name}</td>
                                            <td className="px-4 py-3 text-[0.82rem]" style={{ color: dark ? "rgba(250,248,244,0.6)" : "#5A5046" }}>{row.purpose}</td>
                                            <td className="px-4 py-3 text-[0.82rem]" style={{ color: dark ? "rgba(250,248,244,0.6)" : "#5A5046" }}>{row.duration}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                }

                if (block.type === "cards") {
                    return (
                        <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            {block.items.map((card, j) => (
                                <a
                                    key={j}
                                    href={card.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col gap-1 p-4 rounded-xl border transition-all duration-200 hover:opacity-80 hover:-translate-y-0.5"
                                    style={{
                                        background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
                                        borderColor: border,
                                    }}
                                >
                                    <div
                                        className="text-[0.85rem] font-semibold"
                                        style={{ color: dark ? "#FAF8F4" : "#1A1612" }}
                                    >
                                        {card.name}
                                    </div>
                                    <p className="text-[0.78rem] leading-relaxed font-light" style={{ color: dark ? "rgba(250,248,244,0.5)" : "#7A6E64" }}>
                                        {card.description}
                                    </p>
                                    <span className="text-[0.72rem] font-semibold mt-1" style={{ color: "#E60023" }}>
                                        View policy →
                                    </span>
                                </a>
                            ))}
                        </div>
                    );
                }

                if (block.type === "contact") {
                    return (
                        <div
                            key={i}
                            className="mt-4 p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center gap-5"
                            style={{
                                background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
                                borderColor: border,
                            }}
                        >
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold font-['DM_Serif_Display',serif] flex-shrink-0"
                                style={{ background: "#1A1612", color: "#FAF8F4" }}
                            >
                                V
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="font-semibold text-[0.9rem]" style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>
                                    {block.name}
                                </div>
                                <a
                                    href={`mailto:${block.email}`}
                                    className="text-[0.85rem] font-medium hover:opacity-70 transition-opacity"
                                    style={{ color: "#E60023" }}
                                >
                                    {block.email}
                                </a>
                                <div className="text-[0.78rem]" style={{ color: dark ? "rgba(250,248,244,0.4)" : "#9C8E84" }}>
                                    {block.location}
                                </div>
                            </div>
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
};

// ═══════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════

export default function PrivacyPolicy() {
    const [dark, toggleDark] = useDarkMode();
    const progress = useReadingProgress();
    const [activeSection, setActiveSection] = useState(sections[0].id);

    const bg = dark ? "#0F0E0D" : "#FAF8F4";
    const border = dark ? "rgba(255,255,255,0.07)" : "#EAE4DC";

    // Track active section on scroll
    useEffect(() => {
        const onScroll = () => {
            for (let i = sections.length - 1; i >= 0; i--) {
                const el = document.getElementById(sections[i].id);
                if (el && el.getBoundingClientRect().top <= 110) {
                    setActiveSection(sections[i].id);
                    break;
                }
            }
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: "smooth" });
    };

    // SEO
    useEffect(() => {
        document.title = `Privacy Policy — ${SITE.name}`;
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement("link");
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
        }
        canonical.href = `${SITE.baseUrl}/privacy-policy`;
    }, []);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
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
      `}</style>

            <ProgressBar progress={progress} />
            <Navbar dark={dark} toggleDark={toggleDark} />

            <div style={{ background: bg, minHeight: "100vh" }}>

                {/* ── Breadcrumb ── */}
                <nav
                    className="max-w-[1280px] mx-auto px-6 pt-28 pb-0 flex items-center gap-2 text-xs font-medium"
                    style={{ color: dark ? "rgba(250,248,244,0.4)" : "#9C8E84" }}
                    aria-label="Breadcrumb"
                >
                    <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
                    <span>›</span>
                    <span style={{ color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" }}>Privacy Policy</span>
                </nav>

                {/* ── Hero header ── */}
                <header
                    className="max-w-[1280px] mx-auto px-6 pt-8 pb-14"
                    style={{ animation: "fadeUp 0.6s ease forwards" }}
                >
                    <div
                        className="inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full mb-5"
                        style={{ background: "#E600230F", color: "#E60023", border: "1px solid #E6002322" }}
                    >
                        Legal
                    </div>
                    <h1
                        className="font-['DM_Serif_Display',serif] leading-[1.06] tracking-[-0.02em] mb-4 max-w-[600px]"
                        style={{ fontSize: "clamp(2rem, 4vw, 2.8rem)", color: dark ? "#FAF8F4" : "#1A1612" }}
                    >
                        Privacy Policy
                    </h1>
                    <p
                        className="text-[1rem] leading-relaxed max-w-[520px] font-light"
                        style={{ color: dark ? "rgba(250,248,244,0.5)" : "#7A6E64" }}
                    >
                        A plain-language explanation of what data is collected on this site, how it's used, and your rights.
                    </p>
                    <div
                        className="flex items-center gap-3 mt-6 text-[0.78rem]"
                        style={{ color: dark ? "rgba(250,248,244,0.4)" : "#9C8E84" }}
                    >
                        <span>Last updated: <strong style={{ color: dark ? "rgba(250,248,244,0.65)" : "#5A5046", fontWeight: 500 }}>{LAST_UPDATED}</strong></span>
                        <span
                            className="w-1 h-1 rounded-full inline-block"
                            style={{ background: dark ? "rgba(255,255,255,0.2)" : "#C8C0B8" }}
                        />
                        <span>Applies to veereshbashetti.com</span>
                    </div>
                </header>

                {/* ── Layout: TOC sidebar + content ── */}
                <div className="max-w-[1280px] mx-auto px-6 pb-28 flex flex-col lg:flex-row gap-12 items-start">

                    {/* Sticky sidebar TOC */}
                    <aside
                        className="w-full lg:w-[240px] lg:shrink-0 lg:sticky lg:top-[96px] self-start hidden lg:block"
                        aria-label="Table of contents"
                    >
                        <div
                            className="rounded-2xl overflow-hidden"
                            style={{
                                background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
                                border: `1px solid ${border}`,
                            }}
                        >
                            <div
                                className="px-4 py-3 text-[0.62rem] font-bold tracking-[0.14em] uppercase"
                                style={{
                                    color: dark ? "rgba(250,248,244,0.35)" : "#9C8E84",
                                    borderBottom: `1px solid ${border}`,
                                }}
                            >
                                Contents
                            </div>
                            <nav className="p-2">
                                {sections.map((s) => {
                                    const isActive = activeSection === s.id;
                                    return (
                                        <button
                                            key={s.id}
                                            onClick={() => scrollTo(s.id)}
                                            className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-[0.78rem] transition-all duration-150 relative"
                                            style={{
                                                background: isActive ? (dark ? "rgba(255,255,255,0.05)" : "#F4EFE6") : "transparent",
                                                color: isActive
                                                    ? dark ? "#FAF8F4" : "#1A1612"
                                                    : dark ? "rgba(250,248,244,0.5)" : "#5A5046",
                                                fontWeight: isActive ? 600 : 400,
                                            }}
                                        >
                                            {isActive && (
                                                <span
                                                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                                                    style={{ background: "#E60023" }}
                                                />
                                            )}
                                            <Icon d={s.icon} size={13} className="flex-shrink-0 opacity-70" />
                                            {s.title}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 min-w-0 max-w-[760px]">

                        {/* Mobile quick-links */}
                        <div
                            className="lg:hidden flex flex-wrap gap-2 mb-10 pb-8"
                            style={{ borderBottom: `1px solid ${border}` }}
                        >
                            {sections.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => scrollTo(s.id)}
                                    className="text-[0.72rem] font-semibold px-3 py-1.5 rounded-full border transition-all hover:opacity-70"
                                    style={{
                                        borderColor: border,
                                        color: dark ? "rgba(250,248,244,0.65)" : "#5A5046",
                                        background: dark ? "rgba(255,255,255,0.04)" : "#F5F1EB",
                                    }}
                                >
                                    {s.title}
                                </button>
                            ))}
                        </div>

                        {/* Sections */}
                        <div className="space-y-14">
                            {sections.map((section, idx) => (
                                <section key={section.id} id={section.id} style={{ scrollMarginTop: "96px" }}>
                                    {/* Section heading */}
                                    <div className="flex items-center gap-3 mb-5">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ background: dark ? "rgba(230,0,35,0.12)" : "#FFF0F1" }}
                                        >
                                            <Icon d={section.icon} size={14} className="text-red-500" />
                                        </div>
                                        <h2
                                            className="font-['DM_Serif_Display',serif] text-[1.5rem] leading-tight"
                                            style={{ color: dark ? "#FAF8F4" : "#1A1612" }}
                                        >
                                            {section.title}
                                        </h2>
                                    </div>

                                    {/* Divider */}
                                    <div
                                        className="w-full h-px mb-6"
                                        style={{ background: border }}
                                    />

                                    <SectionContent content={section.content} dark={dark} />

                                    {/* Section number (subtle) */}
                                    <div
                                        className="mt-6 text-[0.68rem] font-bold"
                                        style={{ color: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }}
                                    >
                                        §{String(idx + 1).padStart(2, "0")}
                                    </div>
                                </section>
                            ))}
                        </div>

                        {/* Bottom note */}
                        <div
                            className="mt-16 pt-8 pb-2"
                            style={{ borderTop: `1px solid ${border}` }}
                        >
                            <p
                                className="text-[0.78rem] leading-relaxed font-light"
                                style={{ color: dark ? "rgba(250,248,244,0.35)" : "#9C8E84" }}
                            >
                                This policy was written by a human — not generated by AI. It reflects the actual practices of this site as of {LAST_UPDATED}. If anything here seems unclear or incorrect, please email me.
                            </p>
                        </div>
                    </main>
                </div>

                {/* ── Footer ── */}
                <footer className="relative z-10 overflow-hidden" style={{ background: "#0F0E0D" }}>
                    <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #E60023, transparent)" }} />
                    <div className="max-w-[1280px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <Link
                                to="/"
                                className="font-['DM_Serif_Display',serif] text-[1.2rem]"
                                style={{ color: "#FAF8F4" }}
                            >
                                Veeresh<span style={{ color: "#E60023" }}>.</span>
                            </Link>
                            <span className="text-[0.72rem]" style={{ color: "rgba(250,248,244,0.25)" }}>
                                © {new Date().getFullYear()} All rights reserved.
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-[0.78rem]" style={{ color: "rgba(250,248,244,0.4)" }}>
                            <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
                            <span style={{ color: "rgba(250,248,244,0.15)" }}>·</span>
                            <a href={`mailto:${SITE.email}`} className="hover:text-white transition-colors">Contact</a>
                            <span style={{ color: "rgba(250,248,244,0.15)" }}>·</span>
                            <a
                                href={SITE.pinterestUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white transition-colors"
                            >
                                Pinterest
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}