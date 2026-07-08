import { n as useSaved } from "../main.mjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/pages/blog.jsx
/**
* ============================================================
* Blog.jsx — Home Page (Dynamic .md file loading)
* ============================================================
* FIXED BUGS:
* - Image fallback logic: always renders both, toggles display via state
* - parseFrontmatter: handles inline array syntax tags: ["a","b"]
* - Dynamic Tailwind gradient classes replaced with inline styles (JIT-safe)
* - PinCard aspect ratios use inline style instead of dynamic Tailwind classes
* - TopicsSection: no longer mutates array on every render
* - Newsletter: clears input after submit
* - PostRowItem: object-cover instead of object-contain
* - Mobile navbar hamburger menu added
* - Removed unused ArrowRight + SpinnerIcon imports
* - will-change: transform on reveal elements to prevent layout shift
*
* NEW SEO:
* - JSON-LD structured data (Person + Blog schema)
* - Twitter Card meta tags
* - og:url, og:image, og:description
* - Canonical link
* - robots meta
* - Article structured data per post card
*
* NEW ANIMATIONS:
* - Floating cards in hero (float up/down loop)
* - Typewriter effect on hero headline
* - Animated counters on stats (count up on mount)
* - Magnetic hover effect on CTA buttons
* - Particle/sparkle trail on hero badge
* - Smooth marquee tag strip
* - Card tilt on mouse move (3D perspective)
* - Gradient mesh background animation in hero
* ============================================================
*/
var PinIcon = ({ size = 18, className = "" }) => /* @__PURE__ */ jsx("svg", {
	width: size,
	height: size,
	viewBox: "0 0 24 24",
	fill: "currentColor",
	className,
	"aria-hidden": "true",
	children: /* @__PURE__ */ jsx("path", { d: "M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" })
});
var ArrowDown = ({ size = 16 }) => /* @__PURE__ */ jsx("svg", {
	width: size,
	height: size,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	"aria-hidden": "true",
	children: /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12l7 7 7-7" })
});
var EmailIcon = () => /* @__PURE__ */ jsxs("svg", {
	width: 14,
	height: 14,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ jsx("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" }), /* @__PURE__ */ jsx("polyline", { points: "22,6 12,13 2,6" })]
});
var MenuIcon = () => /* @__PURE__ */ jsxs("svg", {
	width: 22,
	height: 22,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	"aria-hidden": "true",
	children: [
		/* @__PURE__ */ jsx("line", {
			x1: "3",
			y1: "6",
			x2: "21",
			y2: "6"
		}),
		/* @__PURE__ */ jsx("line", {
			x1: "3",
			y1: "12",
			x2: "21",
			y2: "12"
		}),
		/* @__PURE__ */ jsx("line", {
			x1: "3",
			y1: "18",
			x2: "21",
			y2: "18"
		})
	]
});
var CloseIcon = () => /* @__PURE__ */ jsxs("svg", {
	width: 22,
	height: 22,
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ jsx("line", {
		x1: "18",
		y1: "6",
		x2: "6",
		y2: "18"
	}), /* @__PURE__ */ jsx("line", {
		x1: "6",
		y1: "6",
		x2: "18",
		y2: "18"
	})]
});
var EMOJI_PRESETS = [
	"💻",
	"🌿",
	"🏠",
	"✈️",
	"🍛",
	"⚡",
	"🧠",
	"⭐",
	"📌",
	"🎯"
];
var TOPICS = [
	{
		icon: "🏠",
		name: "Home Decor"
	},
	{
		icon: "🌿",
		name: "Lifestyle"
	},
	{
		icon: "📌",
		name: "Pinterest Picks"
	},
	{
		icon: "✈️",
		name: "Travel"
	},
	{
		icon: "🍛",
		name: "Food & Recipes"
	},
	{
		icon: "⚡",
		name: "Productivity"
	},
	{
		icon: "🧠",
		name: "Mindset"
	},
	{
		icon: "⭐",
		name: "Product Reviews"
	},
	{
		icon: "💻",
		name: "Career"
	},
	{
		icon: "🔧",
		name: "Tech"
	}
];
var PINS = [
	{
		emoji: "🚗",
		image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/wrogn-expandable-backpack-review.webp",
		title: "This Expandable Backpack Might Be the Smartest Travel Upgrade of 2026",
		desc: "Discover why this WROGN expandable backpack is becoming a Pinterest favorite.",
		category: "Pinterest Picks",
		heightPx: 280,
		slug: "wrogn-expandable-backpack-review"
	},
	{
		emoji: "⌨️",
		image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/dailyobjects-gadget-organizer-review.webp",
		title: "This Compact Tech Organizer Keeps Every Cable and Charger in One Place",
		desc: "A small canvas pouch that ends the tangled-cable mess in your travel bag — chargers, power banks, and cards all sorted in one zip-around case.",
		category: "Pinterest Picks",
		heightPx: 280,
		slug: "dailyobjects-gadget-organizer-review"
	},
	{
		emoji: "⌨️",
		image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/striff-webcam-cover-slide-review.webp",
		title: "This Tiny Webcam Cover Quietly Fixes a Privacy Blind Spot on Your Laptop",
		desc: "STRIFF ultra-thin webcam cover slide attached over a laptop camera, sliding open and closed",
		category: "Pinterest Picks",
		heightPx: 280,
		slug: "striff-webcam-cover-slide-review"
	},
	{
		emoji: "⌨️",
		image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/biggie-bean-bag-review.webp",
		title: "Why This Bean Bag Became My Favorite Spot in the House",
		desc: "After sinking into this printed bean bag daily for work breaks, gaming sessions, and lazy evenings, I can confidently say it's the coziest addition to my room",
		category: "Pinterest Picks",
		heightPx: 280,
		slug: "biggie-bean-bag-review"
	}
];
var MARQUEE_TAGS = [
	"Home Decor",
	"Lifestyle",
	"Travel",
	"Productivity",
	"Mindset",
	"Food & Recipes",
	"Pinterest Picks",
	"Career",
	"Tech",
	"Product Reviews",
	"Startup Life",
	"Personal Stories"
];
function useScrollReveal(threshold = .1) {
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
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setIsVisible(true);
				observer.disconnect();
			}
		}, { threshold });
		observer.observe(el);
		return () => observer.disconnect();
	}, [threshold]);
	return [ref, isVisible];
}
function useCountUp(target, duration = 1800, start = false) {
	const [count, setCount] = useState(0);
	useEffect(() => {
		if (!start || typeof target !== "number") return;
		let startTime = null;
		const step = (timestamp) => {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			setCount(Math.floor(eased * target));
			if (progress < 1) requestAnimationFrame(step);
		};
		requestAnimationFrame(step);
	}, [
		target,
		duration,
		start
	]);
	return count;
}
function useMagneticHover(strength = .3) {
	const ref = useRef(null);
	return {
		ref,
		onMouseMove: useCallback((e) => {
			if (!ref.current) return;
			const rect = ref.current.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;
			const dx = (e.clientX - cx) * strength;
			const dy = (e.clientY - cy) * strength;
			ref.current.style.transform = `translate(${dx}px,${dy}px)`;
		}, [strength]),
		onMouseLeave: useCallback(() => {
			if (!ref.current) return;
			ref.current.style.transform = "translate(0,0)";
			ref.current.style.transition = "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)";
			setTimeout(() => {
				if (ref.current) ref.current.style.transition = "";
			}, 400);
		}, [])
	};
}
function parseMetaString(meta) {
	const match = /(\d+\s*min read)\s*·\s*([A-Za-z]+)\s+(\d{4})/.exec(meta || "");
	if (!match) return {
		readingTime: meta || "5 min read",
		date: ""
	};
	const [, readingTime, month, year] = match;
	const parsed = /* @__PURE__ */ new Date(`${month} 1, ${year}`);
	return {
		readingTime,
		date: isNaN(parsed.getTime()) ? "" : parsed.toISOString()
	};
}
function parseGradientString(gradient) {
	const match = /from-\[(#[0-9A-Fa-f]{3,8})\]\s*to-\[(#[0-9A-Fa-f]{3,8})\]/.exec(gradient || "");
	if (!match) return { background: "#F2EDE4" };
	return { background: `linear-gradient(135deg, ${match[1]}, ${match[2]})` };
}
function useBlogPosts() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	useEffect(() => {
		let cancelled = false;
		async function loadPosts() {
			try {
				const manifestRes = await fetch("/blogs/manifest.json");
				if (!manifestRes.ok) throw new Error("manifest.json not found. See setup instructions.");
				const manifestData = await manifestRes.json();
				const rawPosts = Array.isArray(manifestData) ? manifestData : manifestData.posts || [];
				const { readingTime: _unused } = { readingTime: null };
				const loaded = rawPosts.map((p, idx) => {
					const { readingTime, date } = parseMetaString(p.meta);
					return {
						slug: p.slug,
						title: p.title || p.slug,
						excerpt: p.excerpt || "",
						date: p.date || date,
						category: p.category || p.tag || "General",
						tags: p.tag ? [p.tag] : [],
						readingTime,
						featured: p.featured === true || p.featured === "true",
						emoji: p.emoji || EMOJI_PRESETS[idx % EMOJI_PRESETS.length],
						gradientStyle: parseGradientString(p.gradient),
						image: p.image || null,
						author: p.author || "Veeresh Bashetti",
						canonicalUrl: p.canonicalUrl || null
					};
				});
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
		loadPosts();
		return () => {
			cancelled = true;
		};
	}, []);
	return {
		posts,
		loading,
		error
	};
}
var GlobalStyles = () => /* @__PURE__ */ jsx("style", { children: `
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
    .card-thumb-img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.5s ease; }
    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Outfit', sans-serif; overflow-x: hidden; }
    .font-display { font-family: 'DM Serif Display', serif; }
    .font-body    { font-family: 'Outfit', sans-serif; }

    /* ── Fade Up ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(32px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeUp { animation: fadeUp 0.75s cubic-bezier(0.4,0,0.2,1) both; }

    /* ── Pulse dot ── */
    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.4; transform: scale(0.75); }
    }
    .animate-pulseDot { animation: pulseDot 2s ease infinite; }

    /* ── Spin ── */
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .animate-spin { animation: spin 1s linear infinite; }

    /* ── Scroll reveal ── */
    @keyframes revealUp {
      from { opacity: 0; transform: translateY(28px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .reveal-hidden  { opacity: 0; transform: translateY(28px); will-change: transform, opacity; }
    .reveal-visible { animation: revealUp 0.6s cubic-bezier(0.4,0,0.2,1) both; }

    /* ── Stagger delays ── */
    .stagger-1 { animation-delay: 0.05s; } .stagger-2 { animation-delay: 0.12s; }
    .stagger-3 { animation-delay: 0.19s; } .stagger-4 { animation-delay: 0.26s; }
    .stagger-5 { animation-delay: 0.33s; } .stagger-6 { animation-delay: 0.40s; }
    .stagger-7 { animation-delay: 0.47s; } .stagger-8 { animation-delay: 0.54s; }
    .delay-100 { animation-delay: 0.10s; } .delay-200 { animation-delay: 0.20s; }
    .delay-300 { animation-delay: 0.30s; } .delay-400 { animation-delay: 0.40s; }
    .delay-550 { animation-delay: 0.55s; } .delay-700 { animation-delay: 0.70s; }

    /* ── Shimmer button ── */
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    .btn-shimmer {
      background: linear-gradient(90deg, #E60023 40%, #ff4d6d 50%, #E60023 60%);
      background-size: 200% auto;
    }
    .btn-shimmer:hover { animation: shimmer 1.2s linear infinite; }

    /* ── Float animation (hero cards) ── */
    @keyframes floatA {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33%       { transform: translateY(-12px) rotate(1deg); }
      66%       { transform: translateY(-6px) rotate(-0.5deg); }
    }
    @keyframes floatB {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33%       { transform: translateY(-8px) rotate(-1deg); }
      66%       { transform: translateY(-14px) rotate(0.8deg); }
    }
    .animate-floatA { animation: floatA 6s ease-in-out infinite; }
    .animate-floatB { animation: floatB 7s ease-in-out infinite 0.5s; }

    /* ── Typewriter cursor ── */
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    .typewriter-cursor { display: inline-block; width: 2px; height: 1em; background: #E60023; margin-left: 2px; vertical-align: text-bottom; animation: blink 1s ease infinite; }

    /* ── Gradient mesh animation ── */
    @keyframes meshMove {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-mesh {
      background: linear-gradient(-45deg, #FAF8F4, #F5EDE0, #FAF0EC, #FAF8F4, #F0F5FA);
      background-size: 400% 400%;
      animation: meshMove 12s ease infinite;
    }

    /* ── Marquee ── */
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .marquee-track { animation: marquee 28s linear infinite; display: flex; width: max-content; }
    .marquee-track:hover { animation-play-state: paused; }

    /* ── Card tilt ── */
    .card-3d { transition: transform 0.15s ease, box-shadow 0.3s ease; transform-style: preserve-3d; }
    .card-3d:hover { box-shadow: 0 24px 60px rgba(26,22,18,0.14); }

    /* ── Pin grid ── */
    .pin-grid { columns: 3; column-gap: 1rem; }
    @media (max-width: 1024px) { .pin-grid { columns: 3; } }
    @media (max-width: 640px)  { .pin-grid { columns: 2; } }
    .pin-item { break-inside: avoid; margin-bottom: 1rem; }

    /* ── Utility ── */
    .nav-glass {
      background: rgba(250,248,244,0.9);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
    }
    .text-gradient {
      background: linear-gradient(135deg, #E60023, #FF6B81);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .hover-lift { transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease; }
    .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 20px 60px rgba(26,22,18,0.13); }
    .divider-line { height: 1px; background: linear-gradient(90deg, transparent, #E8E0D5, transparent); }

    /* ── Scrollbar ── */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #FAF8F4; }
    ::-webkit-scrollbar-thumb { background: #E60023; border-radius: 3px; }

    /* ── Blog card image ── */
    .card-thumb-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.55s ease; }
    .card-thumb-wrap:hover .card-thumb-img { transform: scale(1.06); }

    /* ── Mobile menu ── */
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .mobile-menu-open { animation: slideDown 0.25s cubic-bezier(0.4,0,0.2,1) both; }

    /* ── Sparkle ── */
    @keyframes sparkle {
      0%   { opacity: 0; transform: scale(0) rotate(0deg); }
      50%  { opacity: 1; transform: scale(1) rotate(180deg); }
      100% { opacity: 0; transform: scale(0) rotate(360deg); }
    }
    .sparkle { position: absolute; pointer-events: none; animation: sparkle 1.5s ease infinite; }

    /* ── Section transition ── */
    @keyframes sectionFadeIn {
      from { opacity: 0; } to { opacity: 1; }
    }

    /* ── Pinterest shelf: hide scrollbar ── */
    #pinterest .pin-shelf-track::-webkit-scrollbar { display: none; }
  ` });
var SEOHead = ({ posts = [] }) => {
	useEffect(() => {
		const SITE_URL = window.location.origin;
		const SITE_NAME = "Veeresh Bashetti";
		const DESCRIPTION = "Personal blog by Veeresh Bashetti — startup life, lifestyle, home decor, curated Pinterest picks, product reviews & ideas that inspire.";
		const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
		document.title = "Veeresh Bashetti — Blog & Pinterest Picks | Lifestyle, Products & Ideas";
		[
			[
				"name",
				"description",
				DESCRIPTION
			],
			[
				"name",
				"robots",
				"index, follow"
			],
			[
				"name",
				"author",
				"Veeresh Bashetti"
			],
			[
				"name",
				"keywords",
				"lifestyle blog, home decor, pinterest picks, startup life, productivity, mindset, product reviews, India blog"
			],
			[
				"property",
				"og:title",
				`${SITE_NAME} — Blog & Pinterest Picks`
			],
			[
				"property",
				"og:description",
				DESCRIPTION
			],
			[
				"property",
				"og:type",
				"website"
			],
			[
				"property",
				"og:url",
				SITE_URL
			],
			[
				"property",
				"og:image",
				OG_IMAGE
			],
			[
				"property",
				"og:site_name",
				SITE_NAME
			],
			[
				"property",
				"og:locale",
				"en_IN"
			],
			[
				"name",
				"twitter:card",
				"summary_large_image"
			],
			[
				"name",
				"twitter:title",
				`${SITE_NAME} — Blog & Pinterest Picks`
			],
			[
				"name",
				"twitter:description",
				DESCRIPTION
			],
			[
				"name",
				"twitter:image",
				OG_IMAGE
			],
			[
				"name",
				"twitter:creator",
				"@veereshbashetti"
			]
		].forEach(([attr, name, content]) => {
			let el = document.querySelector(`meta[${attr}="${name}"]`);
			if (!el) {
				el = document.createElement("meta");
				el.setAttribute(attr, name);
				document.head.appendChild(el);
			}
			el.setAttribute("content", content);
		});
		let canonical = document.querySelector("link[rel='canonical']");
		if (!canonical) {
			canonical = document.createElement("link");
			canonical.setAttribute("rel", "canonical");
			document.head.appendChild(canonical);
		}
		canonical.setAttribute("href", SITE_URL);
		const jsonLd = {
			"@context": "https://schema.org",
			"@graph": [{
				"@type": "Person",
				"@id": `${SITE_URL}/#person`,
				"name": "Veeresh Bashetti",
				"url": SITE_URL,
				"sameAs": ["https://in.pinterest.com/veereshbbashetti/"],
				"jobTitle": "Writer & Content Creator",
				"description": DESCRIPTION
			}, {
				"@type": "Blog",
				"@id": `${SITE_URL}/#blog`,
				"name": SITE_NAME,
				"url": SITE_URL,
				"description": DESCRIPTION,
				"author": { "@id": `${SITE_URL}/#person` },
				"blogPost": posts.slice(0, 10).map((p) => ({
					"@type": "BlogPosting",
					"headline": p.title,
					"description": p.excerpt,
					"datePublished": p.date,
					"url": `${SITE_URL}/blog/${p.slug}`,
					"author": { "@id": `${SITE_URL}/#person` }
				}))
			}]
		};
		let ldEl = document.querySelector("script[data-schema=\"blog\"]");
		if (!ldEl) {
			ldEl = document.createElement("script");
			ldEl.type = "application/ld+json";
			ldEl.dataset.schema = "blog";
			document.head.appendChild(ldEl);
		}
		ldEl.textContent = JSON.stringify(jsonLd);
	}, [posts]);
	return null;
};
var MarqueeStrip = () => /* @__PURE__ */ jsx("div", {
	className: "overflow-hidden py-3 border-t border-b border-[#E8E0D5] bg-[#FAF8F4]",
	"aria-hidden": "true",
	children: /* @__PURE__ */ jsx("div", {
		className: "marquee-track",
		children: [...MARQUEE_TAGS, ...MARQUEE_TAGS].map((tag, i) => /* @__PURE__ */ jsxs("span", {
			className: "inline-flex items-center gap-2 mx-6 text-[0.75rem] font-semibold text-[#8C7E74] uppercase tracking-widest whitespace-nowrap",
			children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#E60023] inline-block" }), tag]
		}, i))
	})
});
var BookmarkIcon = ({ size = 20, filled = false }) => /* @__PURE__ */ jsx("svg", {
	width: size,
	height: size,
	viewBox: "0 0 24 24",
	fill: filled ? "currentColor" : "none",
	stroke: "currentColor",
	strokeWidth: "2",
	"aria-hidden": "true",
	children: /* @__PURE__ */ jsx("path", { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" })
});
var Navbar = () => {
	const [scrolled, setScrolled] = useState(false);
	const [activeSection, setActiveSection] = useState("");
	const [mobileOpen, setMobileOpen] = useState(false);
	const { saved } = useSaved();
	const scrollingTo = useRef(null);
	const scrollTimer = useRef(null);
	useEffect(() => {
		const DOM_ORDER = [
			"blog",
			"topics",
			"pinterest",
			"about"
		];
		const onScroll = () => {
			setScrolled(window.scrollY > 10);
			if (scrollingTo.current) return;
			const scrollMid = window.scrollY + window.innerHeight / 2;
			let best = "";
			for (const id of DOM_ORDER) {
				const el = document.getElementById(id);
				if (!el) continue;
				if (el.getBoundingClientRect().top + window.scrollY - 80 <= scrollMid) best = id;
			}
			setActiveSection(best);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	const scrollTo = (id) => {
		setMobileOpen(false);
		setActiveSection(id);
		scrollingTo.current = id;
		if (scrollTimer.current) clearTimeout(scrollTimer.current);
		setTimeout(() => {
			const el = document.getElementById(id);
			if (el) el.scrollIntoView({
				behavior: "smooth",
				block: "start"
			});
		}, 50);
		scrollTimer.current = setTimeout(() => {
			scrollingTo.current = null;
		}, 950);
	};
	return /* @__PURE__ */ jsxs("nav", {
		role: "navigation",
		"aria-label": "Main navigation",
		className: `fixed top-0 left-0 right-0 z-50 nav-glass border-b border-[#E8E0D5] transition-shadow duration-300 ${scrolled ? "shadow-md" : ""}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "max-w-[1320px] mx-auto px-6 flex items-center justify-between h-[68px]",
			children: [
				/* @__PURE__ */ jsxs("a", {
					href: "/",
					className: "font-display text-[1.35rem] text-[#1A1612] tracking-tight",
					children: ["Veeresh", /* @__PURE__ */ jsx("span", {
						className: "text-[#E60023]",
						children: "."
					})]
				}),
				/* @__PURE__ */ jsxs("ul", {
					className: "hidden md:flex items-center gap-8 list-none m-0 p-0",
					children: [
						[
							"blog",
							"topics",
							"pinterest",
							"about"
						].map((id) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => scrollTo(id),
							className: `font-body text-sm font-medium tracking-wide transition-colors duration-300 capitalize bg-transparent border-none cursor-pointer p-0 ${activeSection === id ? "text-[#E60023]" : "text-[#3D3530] hover:text-[#E60023]"}`,
							children: id
						}) }, id)),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
							to: "/saved",
							"aria-label": `Saved posts (${saved.length})`,
							className: "relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#E8E0D5] text-[#3D3530] hover:text-[#E60023] hover:border-[#E60023] transition-all duration-300",
							style: { background: "#F2EDE4" },
							children: [/* @__PURE__ */ jsx(BookmarkIcon, {
								size: 17,
								filled: saved.length > 0
							}), saved.length > 0 && /* @__PURE__ */ jsx("span", {
								className: "absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-[#E60023] text-white text-[0.6rem] font-bold rounded-full flex items-center justify-center px-1 leading-none",
								children: saved.length > 99 ? "99+" : saved.length
							})]
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", {
							href: "https://in.pinterest.com/veereshbbashetti/",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center gap-2 bg-[#1A1612] text-[#FAF8F4] px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#E60023] transition-all duration-300 hover:-translate-y-0.5",
							"aria-label": "Follow on Pinterest",
							children: [/* @__PURE__ */ jsx(PinIcon, { size: 14 }), " Follow on Pinterest"]
						}) })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "md:hidden flex items-center gap-3",
					children: [/* @__PURE__ */ jsxs(Link, {
						to: "/saved",
						"aria-label": `Saved posts (${saved.length})`,
						className: "relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#E8E0D5] text-[#3D3530]",
						style: { background: "#F2EDE4" },
						children: [/* @__PURE__ */ jsx(BookmarkIcon, {
							size: 17,
							filled: saved.length > 0
						}), saved.length > 0 && /* @__PURE__ */ jsx("span", {
							className: "absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-[#E60023] text-white text-[0.6rem] font-bold rounded-full flex items-center justify-center px-1 leading-none",
							children: saved.length > 99 ? "99+" : saved.length
						})]
					}), /* @__PURE__ */ jsx("button", {
						type: "button",
						className: "p-2 text-[#1A1612]",
						onClick: () => setMobileOpen((v) => !v),
						"aria-label": mobileOpen ? "Close menu" : "Open menu",
						children: mobileOpen ? /* @__PURE__ */ jsx(CloseIcon, {}) : /* @__PURE__ */ jsx(MenuIcon, {})
					})]
				})
			]
		}), mobileOpen && /* @__PURE__ */ jsxs("div", {
			className: "mobile-menu-open md:hidden nav-glass border-t border-[#E8E0D5] px-6 pb-6 pt-4",
			children: [/* @__PURE__ */ jsxs("ul", {
				className: "flex flex-col gap-4 list-none m-0 p-0 mb-4",
				children: [[
					"blog",
					"pinterest",
					"topics",
					"about"
				].map((id) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => scrollTo(id),
					className: `font-body text-base font-medium capitalize w-full text-left bg-transparent border-none cursor-pointer p-0 ${activeSection === id ? "text-[#E60023]" : "text-[#3D3530]"}`,
					children: id
				}) }, id)), /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, {
					to: "/saved",
					onClick: () => setMobileOpen(false),
					className: "font-body text-base font-medium text-[#3D3530] flex items-center gap-2",
					style: { textDecoration: "none" },
					children: [
						/* @__PURE__ */ jsx(BookmarkIcon, {
							size: 16,
							filled: saved.length > 0
						}),
						"Saved ",
						saved.length > 0 && /* @__PURE__ */ jsxs("span", {
							className: "text-[#E60023]",
							children: [
								"(",
								saved.length,
								")"
							]
						})
					]
				}) })]
			}), /* @__PURE__ */ jsxs("a", {
				href: "https://in.pinterest.com/veereshbbashetti/",
				target: "_blank",
				rel: "noopener noreferrer",
				className: "inline-flex items-center gap-2 bg-[#1A1612] text-[#FAF8F4] px-5 py-2.5 rounded-full text-sm font-semibold w-full justify-center",
				children: [/* @__PURE__ */ jsx(PinIcon, { size: 14 }), " Follow on Pinterest"]
			})]
		})]
	});
};
var Typewriter = ({ texts, speed = 70, pause = 2200 }) => {
	const [displayed, setDisplayed] = useState("");
	const [textIdx, setTextIdx] = useState(0);
	const [phase, setPhase] = useState("typing");
	useEffect(() => {
		const current = texts[textIdx];
		let timeout;
		if (phase === "typing") if (displayed.length < current.length) timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), speed);
		else timeout = setTimeout(() => setPhase("waiting"), pause);
		else if (phase === "waiting") setPhase("deleting");
		else if (displayed.length > 0) timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), speed / 2);
		else {
			setTextIdx((textIdx + 1) % texts.length);
			setPhase("typing");
		}
		return () => clearTimeout(timeout);
	}, [
		displayed,
		phase,
		textIdx,
		texts,
		speed,
		pause
	]);
	return /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("span", {
		className: "text-gradient",
		children: displayed
	}), /* @__PURE__ */ jsx("span", { className: "typewriter-cursor" })] });
};
var AnimatedStat = ({ num, label, started }) => {
	const isNumber = /^\d+/.test(String(num));
	const targetNum = isNumber ? parseInt(String(num)) : 0;
	const suffix = isNumber ? String(num).replace(/^\d+/, "") : num;
	const count = useCountUp(targetNum, 1600, started);
	return /* @__PURE__ */ jsxs("div", {
		className: "flex flex-col gap-0.5",
		children: [/* @__PURE__ */ jsx("span", {
			className: "font-display text-3xl text-[#1A1612]",
			children: isNumber ? `${count}${suffix}` : num
		}), /* @__PURE__ */ jsx("span", {
			className: "text-[0.78rem] font-medium text-[#8C7E74] uppercase tracking-wider",
			children: label
		})]
	});
};
var Hero = ({ totalPosts, categoriesCount, pinterestSaves }) => {
	const [statsRef, statsVisible] = useScrollReveal(.3);
	const magBtn1 = useMagneticHover(.25);
	const magBtn2 = useMagneticHover(.25);
	return /* @__PURE__ */ jsxs("header", {
		role: "banner",
		className: "animate-mesh relative overflow-hidden",
		children: [
			/* @__PURE__ */ jsx("div", {
				"aria-hidden": "true",
				style: {
					position: "absolute",
					top: "10%",
					right: "5%",
					width: 400,
					height: 400,
					borderRadius: "50%",
					background: "radial-gradient(circle, rgba(230,0,35,0.06) 0%, transparent 70%)",
					pointerEvents: "none"
				}
			}),
			/* @__PURE__ */ jsx("div", {
				"aria-hidden": "true",
				style: {
					position: "absolute",
					bottom: "15%",
					left: "2%",
					width: 300,
					height: 300,
					borderRadius: "50%",
					background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
					pointerEvents: "none"
				}
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "pt-[120px] pb-[100px] px-6 max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2 bg-[#F2EDE4] border border-[#E8E0D5] rounded-full px-4 py-1.5 text-xs font-bold text-[#8C7E74] uppercase tracking-widest mb-6 animate-fadeUp delay-100 relative",
						children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-[#E60023] animate-pulseDot" }), "Writer · Curator · Creator"]
					}),
					/* @__PURE__ */ jsxs("h1", {
						className: "font-display text-[clamp(2.2rem,4vw,3.4rem)] leading-[1.08] tracking-tight mb-6 text-[#1A1612] animate-fadeUp delay-200",
						children: [
							"Startup life, personal stories",
							/* @__PURE__ */ jsx("br", {}),
							"& ideas that",
							" ",
							/* @__PURE__ */ jsx(Typewriter, { texts: [
								"inspire.",
								"motivate.",
								"resonate.",
								"delight."
							] })
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-[1.05rem] text-[#8C7E74] leading-[1.8] max-w-[460px] mb-10 font-light animate-fadeUp delay-300",
						children: "A personal space for handpicked products, honest stories, and curated ideas — straight from my Pinterest boards and heart. Welcome."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex gap-4 flex-wrap items-center animate-fadeUp delay-400",
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							...magBtn1,
							onClick: () => {
								const s = document.getElementById("blog");
								if (s) s.scrollIntoView({ behavior: "smooth" });
							},
							style: { transition: "transform 0.2s ease, background 0.3s ease" },
							className: "inline-flex items-center gap-2 bg-[#1A1612] text-[#FAF8F4] font-semibold text-sm px-7 py-[0.85rem] rounded-full hover:bg-[#E60023] shadow-sm",
							children: [/* @__PURE__ */ jsx(ArrowDown, { size: 16 }), " Read the Blog"]
						}), /* @__PURE__ */ jsxs("a", {
							href: "https://in.pinterest.com/veereshbbashetti/",
							target: "_blank",
							rel: "noopener noreferrer",
							...magBtn2,
							style: { transition: "transform 0.2s ease, border-color 0.3s ease" },
							className: "inline-flex items-center gap-2 text-[#1A1612] font-semibold text-sm px-7 py-[0.85rem] rounded-full border-[1.5px] border-[#E8E0D5] hover:border-[#1A1612]",
							children: [/* @__PURE__ */ jsx(PinIcon, { size: 16 }), " Pinterest Profile"]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						ref: statsRef,
						className: "flex gap-8 mt-10 pt-8 border-t border-[#E8E0D5] animate-fadeUp delay-550",
						children: [
							/* @__PURE__ */ jsx(AnimatedStat, {
								num: totalPosts > 0 ? `${totalPosts}+` : "0",
								label: "Blog Posts",
								started: statsVisible
							}),
							/* @__PURE__ */ jsx(AnimatedStat, {
								num: `${pinterestSaves}+`,
								label: "Pinterest Saves",
								started: statsVisible
							}),
							/* @__PURE__ */ jsx(AnimatedStat, {
								num: `${categoriesCount}+`,
								label: "Categories",
								started: statsVisible
							})
						]
					})
				] }), /* @__PURE__ */ jsxs("div", {
					className: "hidden lg:grid grid-cols-2 gap-4 relative",
					"aria-hidden": "true",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl overflow-hidden shadow-lg animate-floatA",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-full flex flex-col items-center justify-center text-5xl",
							style: {
								aspectRatio: "3/4",
								background: "linear-gradient(135deg,#F2EDE4,#E8DDD0)"
							},
							children: "🏡"
						}), /* @__PURE__ */ jsxs("div", {
							className: "p-4",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-[0.78rem] font-bold text-[#8C7E74] uppercase tracking-wider",
								children: "Home Decor"
							}), /* @__PURE__ */ jsx("p", {
								className: "font-display text-base text-[#1A1612] leading-snug mt-1",
								children: "Cozy living room ideas for every budget"
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-2xl overflow-hidden shadow-lg mt-8 relative animate-floatB",
						children: [
							/* @__PURE__ */ jsxs("span", {
								className: "absolute -top-3 -right-3 z-10 bg-[#E60023] text-white rounded-full w-12 h-12 flex items-center justify-center text-[0.58rem] font-bold uppercase tracking-wide text-center leading-tight shadow-lg",
								children: [
									"Save",
									/* @__PURE__ */ jsx("br", {}),
									"Idea"
								]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "w-full flex flex-col items-center justify-center text-5xl",
								style: {
									aspectRatio: "3/4",
									background: "linear-gradient(135deg,#EDE8F2,#D9D0E8)"
								},
								children: "🌿"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "p-4",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-[0.78rem] font-bold text-[#8C7E74] uppercase tracking-wider",
									children: "Lifestyle"
								}), /* @__PURE__ */ jsx("p", {
									className: "font-display text-base text-[#1A1612] leading-snug mt-1",
									children: "Morning routines that actually work"
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsx(MarqueeStrip, {})
		]
	});
};
var BlogCard = ({ post, featured = false, index = 0 }) => {
	const [ref, isVisible] = useScrollReveal(.08);
	const [imgError, setImgError] = useState(false);
	const cardRef = useRef(null);
	const formattedDate = post.date ? new Date(post.date).toLocaleDateString("en-IN", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : "";
	const handleMouseMove = (e) => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - .5;
		const y = (e.clientY - rect.top) / rect.height - .5;
		cardRef.current.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
	};
	const handleMouseLeave = () => {
		if (!cardRef.current) return;
		cardRef.current.style.transform = "perspective(800px) rotateX(0) rotateY(0) translateY(0)";
	};
	return /* @__PURE__ */ jsx(Link, {
		ref,
		to: `/blog/${post.slug}`,
		className: `bg-white rounded-2xl overflow-hidden border border-[#E8E0D5] flex flex-col card-3d
        ${isVisible ? `reveal-visible stagger-${Math.min(index + 1, 8)}` : "reveal-hidden"}`,
		"aria-label": `Read: ${post.title}`,
		style: { textDecoration: "none" },
		onMouseMove: handleMouseMove,
		onMouseLeave: handleMouseLeave,
		children: /* @__PURE__ */ jsxs("div", {
			ref: cardRef,
			className: "flex flex-col flex-1",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "w-full overflow-hidden relative card-thumb-wrap",
				style: {
					height: featured ? "clamp(260px, 32vw, 380px)" : "220px",
					...post.gradientStyle || { background: "#F2EDE4" }
				},
				children: [post.image && !imgError ? /* @__PURE__ */ jsx("img", {
					src: post.image,
					alt: post.title,
					className: "card-thumb-img",
					loading: "lazy",
					decoding: "async",
					fetchPriority: "low",
					onError: () => setImgError(true)
				}) : /* @__PURE__ */ jsx("div", {
					className: "w-full h-full flex items-center justify-center text-5xl",
					children: post.emoji
				}), /* @__PURE__ */ jsx("span", {
					className: "absolute top-4 left-4 inline-block bg-white/90 backdrop-blur-sm text-[#3D3530] text-[0.65rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#E8E0D5]",
					children: post.category
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "p-6 flex flex-col flex-1",
				children: [
					/* @__PURE__ */ jsx("h3", {
						className: `font-display text-[#1A1612] leading-snug mb-3 line-clamp-2 ${featured ? "text-[1.7rem]" : "text-[1.1rem]"}`,
						children: post.title
					}),
					post.excerpt && /* @__PURE__ */ jsx("p", {
						className: "text-sm text-[#8C7E74] leading-[1.7] flex-1 mb-4 line-clamp-3",
						children: post.excerpt
					}),
					post.tags && post.tags.length > 0 && /* @__PURE__ */ jsx("div", {
						className: "flex flex-wrap gap-1.5 mb-3",
						children: post.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsx("span", {
							className: "text-[0.65rem] font-medium text-[#8C7E74] bg-[#F2EDE4] px-2 py-0.5 rounded-full",
							children: tag
						}, tag))
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between text-[0.78rem] text-[#8C7E74] font-medium border-t border-[#E8E0D5] pt-4 mt-auto",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-7 h-7 rounded-full bg-[#1A1612] text-[#FAF8F4] flex items-center justify-center text-[0.65rem] font-bold flex-shrink-0",
								children: "VB"
							}), /* @__PURE__ */ jsx("span", { children: post.author })]
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-right",
							children: [formattedDate, post.readingTime && ` · ${post.readingTime}`]
						})]
					})
				]
			})]
		})
	});
};
var BlogLoadingSkeleton = () => /* @__PURE__ */ jsxs("div", {
	className: "grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 mb-8",
	children: [/* @__PURE__ */ jsxs("div", {
		className: "bg-white rounded-2xl overflow-hidden border border-[#E8E0D5]",
		style: { height: 420 },
		children: [/* @__PURE__ */ jsx("div", {
			className: "w-full h-48",
			style: {
				background: "linear-gradient(90deg,#F2EDE4 25%,#FAF8F4 50%,#F2EDE4 75%)",
				backgroundSize: "200% 100%",
				animation: "shimmer 1.5s infinite"
			}
		}), /* @__PURE__ */ jsx("div", {
			className: "p-6 space-y-3",
			children: [
				20,
				75,
				100,
				65
			].map((w, i) => /* @__PURE__ */ jsx("div", {
				className: "h-4 rounded",
				style: {
					width: `${w}%`,
					background: "#F2EDE4"
				}
			}, i))
		})]
	}), /* @__PURE__ */ jsx("div", {
		className: "flex flex-col gap-6",
		children: [0, 1].map((i) => /* @__PURE__ */ jsxs("div", {
			className: "bg-white rounded-2xl overflow-hidden border border-[#E8E0D5]",
			style: { height: 180 },
			children: [/* @__PURE__ */ jsx("div", {
				className: "w-full h-28",
				style: { background: "#F2EDE4" }
			}), /* @__PURE__ */ jsxs("div", {
				className: "p-4 space-y-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "h-3 rounded w-16",
					style: { background: "#F2EDE4" }
				}), /* @__PURE__ */ jsx("div", {
					className: "h-4 rounded w-3/4",
					style: { background: "#F2EDE4" }
				})]
			})]
		}, i))
	})]
});
var BlogError = ({ message }) => /* @__PURE__ */ jsxs("div", {
	className: "rounded-2xl p-8 text-center",
	style: {
		background: "#FFF0F0",
		border: "1px solid #FFCCCC"
	},
	children: [
		/* @__PURE__ */ jsx("p", {
			className: "text-2xl mb-2",
			children: "⚠️"
		}),
		/* @__PURE__ */ jsx("p", {
			className: "font-display text-lg text-[#1A1612] mb-2",
			children: "Couldn't load blog posts"
		}),
		/* @__PURE__ */ jsx("p", {
			className: "text-sm text-[#8C7E74] mb-4",
			children: message
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "rounded-xl p-4 text-left text-xs font-mono max-w-md mx-auto",
			style: {
				background: "#F5F5F5",
				color: "#555"
			},
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "font-bold mb-2",
					children: "Quick fix:"
				}),
				/* @__PURE__ */ jsxs("p", { children: ["1. Create ", /* @__PURE__ */ jsx("code", { children: "public/blogs/manifest.json" })] }),
				/* @__PURE__ */ jsxs("p", { children: ["2. Add: ", /* @__PURE__ */ jsx("code", { children: "[\"your-post-slug\"]" })] }),
				/* @__PURE__ */ jsxs("p", { children: [
					"3. Create ",
					/* @__PURE__ */ jsx("code", { children: "public/blogs/your-post-slug.md" }),
					" with frontmatter"
				] })
			]
		})
	]
});
var BlogSection = ({ posts, loading, error }) => {
	const [headerRef, headerVisible] = useScrollReveal();
	const [activeFilter, setActiveFilter] = useState("all");
	const [showAll, setShowAll] = useState(false);
	const FILTERS = [
		{
			id: "all",
			label: "All Posts",
			icon: "✦"
		},
		{
			id: "pinterest",
			label: "Pinterest Picks",
			icon: "📌"
		},
		{
			id: "life",
			label: "Life & Stories",
			icon: "🌿"
		}
	];
	const filteredPosts = useMemo(() => {
		if (activeFilter === "all") return posts;
		if (activeFilter === "pinterest") return posts.filter((p) => p.category?.toLowerCase().includes("pinterest") || p.tags?.some((t) => t.toLowerCase().includes("pinterest")));
		if (activeFilter === "life") return posts.filter((p) => !p.category?.toLowerCase().includes("pinterest") && !p.tags?.some((t) => t.toLowerCase().includes("pinterest")));
		return posts;
	}, [posts, activeFilter]);
	const LIMIT = 6;
	const visiblePosts = showAll ? filteredPosts : filteredPosts.slice(0, LIMIT);
	const hasMore = filteredPosts.length > LIMIT;
	const handleFilterChange = (id) => {
		setActiveFilter(id);
		setShowAll(false);
	};
	return /* @__PURE__ */ jsx("section", {
		id: "blog",
		"aria-labelledby": "blog-heading",
		className: "py-24 px-6",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-[1320px] mx-auto",
			children: [
				/* @__PURE__ */ jsxs("div", {
					ref: headerRef,
					className: `mb-10 ${headerVisible ? "reveal-visible" : "reveal-hidden"}`,
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-xs font-bold tracking-[0.12em] uppercase text-[#E60023] mb-3",
							children: "Latest Writing"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row sm:items-end justify-between gap-6",
							children: [/* @__PURE__ */ jsxs("h2", {
								id: "blog-heading",
								className: "font-display text-[clamp(2.5rem,4vw,3.5rem)] text-[#1A1612]",
								children: ["Stories & ", /* @__PURE__ */ jsx("em", {
									className: "text-[#8C7E74]",
									children: "Ideas"
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: FILTERS.map((f) => /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => handleFilterChange(f.id),
									className: "inline-flex items-center gap-1.5 text-[0.78rem] font-semibold px-4 py-2 rounded-full border transition-all duration-200",
									style: {
										background: activeFilter === f.id ? "#1A1612" : "#FFFFFF",
										color: activeFilter === f.id ? "#FAF8F4" : "#5A5046",
										borderColor: activeFilter === f.id ? "#1A1612" : "#E8E0D5",
										transform: activeFilter === f.id ? "translateY(-1px)" : "none",
										boxShadow: activeFilter === f.id ? "0 4px 12px rgba(26,22,18,0.15)" : "none"
									},
									"aria-pressed": activeFilter === f.id,
									children: [/* @__PURE__ */ jsx("span", { children: f.icon }), f.label]
								}, f.id))
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx("div", {
								className: "h-px flex-1",
								style: { background: "linear-gradient(90deg, #E8E0D5, transparent)" }
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-[0.72rem] font-medium text-[#9C8E84] px-2",
								children: [
									showAll ? filteredPosts.length : Math.min(LIMIT, filteredPosts.length),
									" of ",
									filteredPosts.length,
									" post",
									filteredPosts.length !== 1 ? "s" : "",
									activeFilter !== "all" && ` in ${FILTERS.find((f) => f.id === activeFilter)?.label}`
								]
							})]
						})
					]
				}),
				loading && /* @__PURE__ */ jsx(BlogLoadingSkeleton, {}),
				!loading && error && /* @__PURE__ */ jsx(BlogError, { message: error }),
				!loading && !error && filteredPosts.length === 0 && /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl p-12 text-center",
					style: {
						background: "#F2EDE4",
						border: "1px solid #E8E0D5"
					},
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-4xl mb-4",
							children: "🔍"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "font-display text-xl text-[#1A1612] mb-2",
							children: "No posts in this category yet"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-sm text-[#8C7E74]",
							children: "Try a different filter or check back later."
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: () => handleFilterChange("all"),
							className: "mt-4 inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:opacity-80",
							style: {
								background: "#1A1612",
								color: "#FAF8F4"
							},
							children: "Show all posts"
						})
					]
				}),
				!loading && !error && filteredPosts.length > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start",
					style: { animation: "fadeUp 0.4s ease both" },
					children: visiblePosts.map((p, i) => /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(BlogCard, {
						post: p,
						index: i
					}) }, p.slug))
				}, activeFilter), hasMore && /* @__PURE__ */ jsx("div", {
					className: "mt-14 flex flex-col sm:flex-row items-center justify-center gap-4",
					style: { animation: "fadeUp 0.5s ease both" },
					children: !showAll ? /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => setShowAll(true),
							className: "inline-flex items-center gap-2 font-semibold text-sm px-7 py-3.5 rounded-full border-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
							style: {
								borderColor: "#1A1612",
								color: "#1A1612",
								background: "#FFFFFF"
							},
							children: [
								/* @__PURE__ */ jsx("svg", {
									width: 16,
									height: 16,
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2",
									children: /* @__PURE__ */ jsx("path", { d: "M12 5v14M5 12l7 7 7-7" })
								}),
								"Show ",
								filteredPosts.length - LIMIT,
								" more post",
								filteredPosts.length - LIMIT !== 1 ? "s" : ""
							]
						}),
						/* @__PURE__ */ jsx("span", {
							className: "text-[#C8BEB4] text-sm hidden sm:block",
							children: "or"
						}),
						/* @__PURE__ */ jsxs(Link, {
							to: "/blog",
							className: "inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90",
							style: {
								background: "#1A1612",
								color: "#FAF8F4"
							},
							children: ["View all posts", /* @__PURE__ */ jsx("svg", {
								width: 14,
								height: 14,
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.5",
								children: /* @__PURE__ */ jsx("path", { d: "M5 12h14M12 5l7 7-7 7" })
							})]
						})
					] }) : /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4 flex-wrap justify-center",
						children: [/* @__PURE__ */ jsxs("button", {
							type: "button",
							onClick: () => {
								setShowAll(false);
								document.getElementById("blog")?.scrollIntoView({ behavior: "smooth" });
							},
							className: "inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full border transition-all duration-300 hover:opacity-70",
							style: {
								borderColor: "#E8E0D5",
								color: "#8C7E74",
								background: "#FFFFFF"
							},
							children: [/* @__PURE__ */ jsx("svg", {
								width: 14,
								height: 14,
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								children: /* @__PURE__ */ jsx("path", { d: "M18 15l-6-6-6 6" })
							}), "Show less"]
						}), /* @__PURE__ */ jsxs(Link, {
							to: "/blog",
							className: "inline-flex items-center gap-2 font-bold text-sm px-7 py-3 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90",
							style: {
								background: "#E60023",
								color: "#fff"
							},
							children: ["Browse all posts", /* @__PURE__ */ jsx("svg", {
								width: 14,
								height: 14,
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.5",
								children: /* @__PURE__ */ jsx("path", { d: "M5 12h14M12 5l7 7-7 7" })
							})]
						})]
					})
				})] })
			]
		})
	});
};
var TopicsSection = ({ posts }) => {
	const [headerRef] = useScrollReveal();
	const trackRef = useRef(null);
	const [progress, setProgress] = useState(8);
	const topics = useMemo(() => {
		const countMap = {};
		posts.forEach((p) => {
			const cat = (p.category || "General").trim();
			countMap[cat] = (countMap[cat] || 0) + 1;
		});
		const normalize = (s) => s.trim().toLowerCase();
		const usedCats = /* @__PURE__ */ new Set();
		const result = [];
		TOPICS.forEach((t) => {
			let total = 0;
			Object.keys(countMap).forEach((cat) => {
				if (normalize(cat) === normalize(t.name)) {
					total += countMap[cat];
					usedCats.add(cat);
				}
			});
			if (total > 0) result.push({
				...t,
				count: total
			});
		});
		Object.entries(countMap).forEach(([cat, count]) => {
			if (!usedCats.has(cat)) result.push({
				icon: "📖",
				name: cat,
				count
			});
		});
		return result.sort((a, b) => b.count - a.count);
	}, [posts]);
	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;
		const updateProgress = () => {
			const max = track.scrollWidth - track.clientWidth;
			const pct = max > 0 ? track.scrollLeft / max * 100 : 0;
			setProgress(Math.max(8, pct));
		};
		track.addEventListener("scroll", updateProgress, { passive: true });
		updateProgress();
		return () => track.removeEventListener("scroll", updateProgress);
	}, [topics]);
	if (topics.length === 0) return null;
	return /* @__PURE__ */ jsx("section", {
		id: "topics",
		"aria-labelledby": "topics-heading",
		className: "py-24 px-6",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-[1320px] mx-auto",
			children: [
				/* @__PURE__ */ jsxs("div", {
					ref: headerRef,
					className: "mb-7 flex items-end justify-between gap-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
						className: "text-[11px] uppercase tracking-[0.14em] text-[#A6791E] mb-2",
						style: { fontFamily: "'IBM Plex Mono', monospace" },
						children: "Explore"
					}), /* @__PURE__ */ jsx("h2", {
						id: "topics-heading",
						className: "text-[1.9rem] sm:text-[2.2rem] font-medium text-[#1A1612]",
						style: { fontFamily: "'Fraunces', serif" },
						children: "Browse by topic"
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "hidden sm:flex gap-2",
						children: [/* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => trackRef.current?.scrollBy({
								left: -256,
								behavior: "smooth"
							}),
							"aria-label": "Scroll left",
							className: "flex-shrink-0 w-9 h-9 rounded-full border border-[#1A1612] text-[#1A1612] flex items-center justify-center hover:bg-[#1A1612] hover:text-[#FAF8F4] transition-colors duration-200",
							children: /* @__PURE__ */ jsx("svg", {
								width: 16,
								height: 16,
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								children: /* @__PURE__ */ jsx("path", { d: "M15 6l-6 6 6 6" })
							})
						}), /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => trackRef.current?.scrollBy({
								left: 256,
								behavior: "smooth"
							}),
							"aria-label": "Scroll right",
							className: "flex-shrink-0 w-9 h-9 rounded-full border border-[#1A1612] text-[#1A1612] flex items-center justify-center hover:bg-[#1A1612] hover:text-[#FAF8F4] transition-colors duration-200",
							children: /* @__PURE__ */ jsx("svg", {
								width: 16,
								height: 16,
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								children: /* @__PURE__ */ jsx("path", { d: "M9 6l6 6-6 6" })
							})
						})]
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					ref: trackRef,
					tabIndex: 0,
					"aria-label": "Topic categories, scroll horizontally",
					className: "flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
					style: { scrollSnapType: "x mandatory" },
					children: topics.map((t, i) => /* @__PURE__ */ jsxs(Link, {
						to: `/category/${t.name.toLowerCase().replace(/\s+/g, "-")}`,
						"aria-label": `Browse ${t.name} posts`,
						className: "flex-shrink-0 w-[220px] h-[300px] rounded-2xl p-5 flex flex-col justify-between",
						style: {
							background: [
								"#1A1612",
								"#283B52",
								"#6B5B2E",
								"#7A4632",
								"#2F4A4A",
								"#5C2A35"
							][i % 6],
							scrollSnapAlign: "start",
							textDecoration: "none"
						},
						children: [/* @__PURE__ */ jsx("span", {
							className: "w-[34px] h-[34px] rounded-full border flex items-center justify-center text-[#FAF8F4]",
							style: { borderColor: " rgba(250,248,244,0.6)" },
							children: /* @__PURE__ */ jsx("svg", {
								width: 15,
								height: 15,
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								children: /* @__PURE__ */ jsx("path", { d: "M7 17L17 7M7 7h10v10" })
							})
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-[25px] leading-tight text-[#FAF8F4]",
							style: {
								fontFamily: "'Fraunces', serif",
								letterSpacing: "-0.01em"
							},
							children: t.name
						}), /* @__PURE__ */ jsxs("p", {
							className: "text-xs mt-2",
							style: {
								fontFamily: "'IBM Plex Mono', monospace",
								color: "rgba(250,248,244,0.65)"
							},
							children: [
								t.count,
								" ",
								t.count === 1 ? "entry" : "entries"
							]
						})] })]
					}, t.name))
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex items-center gap-6",
					children: [/* @__PURE__ */ jsx("div", {
						className: "flex-1 h-[2px] rounded-full bg-[#E8E0D5]",
						children: /* @__PURE__ */ jsx("div", {
							className: "h-full rounded-full bg-[#A6791E] transition-[width] duration-150 ease-linear",
							style: { width: `${progress}%` }
						})
					}), /* @__PURE__ */ jsx(Link, {
						to: "/categories",
						className: "flex-shrink-0 whitespace-nowrap text-xs text-[#8C7E74] hover:text-[#1A1612] transition-colors duration-200",
						style: {
							fontFamily: "'IBM Plex Mono', monospace",
							textDecoration: "none"
						},
						children: "browse all categories"
					})]
				})
			]
		})
	});
};
var PinCard = ({ pin, large = false }) => {
	const [imgError, setImgError] = useState(false);
	const cardRef = useRef(null);
	const handleMouseMove = (e) => {
		if (!cardRef.current) return;
		const rect = cardRef.current.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width - .5;
		const y = (e.clientY - rect.top) / rect.height - .5;
		cardRef.current.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
	};
	const handleMouseLeave = () => {
		if (!cardRef.current) return;
		cardRef.current.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
	};
	const inner = /* @__PURE__ */ jsxs("div", {
		ref: cardRef,
		onMouseMove: handleMouseMove,
		onMouseLeave: handleMouseLeave,
		className: "relative rounded-[20px] overflow-hidden group flex-shrink-0",
		style: {
			width: large ? "min(78vw, 420px)" : "min(60vw, 280px)",
			height: "440px",
			transition: "transform 0.2s ease",
			border: "1px solid rgba(255,255,255,0.10)"
		},
		children: [
			pin.image && !imgError ? /* @__PURE__ */ jsx("img", {
				src: pin.image,
				alt: pin.title,
				onError: () => setImgError(true),
				loading: "lazy",
				decoding: "async",
				fetchPriority: "low",
				className: "absolute inset-0 w-full h-full",
				style: {
					objectFit: "cover",
					transition: "transform 0.6s ease"
				}
			}) : /* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 flex items-center justify-center text-6xl",
				style: { background: "rgba(255,255,255,0.04)" },
				children: pin.emoji
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0",
				style: { background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.78) 100%)" }
			}),
			/* @__PURE__ */ jsxs("span", {
				className: "absolute top-3 right-3 inline-flex items-center gap-1.5 text-white text-[0.68rem] font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100",
				style: {
					background: "#E60023",
					transition: "opacity 0.25s ease, transform 0.25s ease",
					transform: "translateY(-4px)"
				},
				children: [
					pin.slug ? "Read" : "Save",
					" ",
					/* @__PURE__ */ jsx(PinIcon, { size: 12 })
				]
			}),
			/* @__PURE__ */ jsx("span", {
				className: "absolute top-3 left-3 text-[0.62rem] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
				style: {
					background: "rgba(255,255,255,0.16)",
					color: "#FFFFFF",
					backdropFilter: "blur(6px)"
				},
				children: pin.category
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "absolute bottom-0 left-0 right-0 p-5",
				children: [/* @__PURE__ */ jsx("strong", {
					className: `block font-display text-white leading-snug mb-1.5 ${large ? "text-[1.4rem]" : "text-[1.05rem]"}`,
					children: pin.title
				}), /* @__PURE__ */ jsx("p", {
					className: "text-[0.8rem] leading-relaxed",
					style: { color: "rgba(255,255,255,0.72)" },
					children: pin.desc
				})]
			})
		]
	});
	if (pin.slug) return /* @__PURE__ */ jsx(Link, {
		to: `/blog/${pin.slug}`,
		"aria-label": `Read: ${pin.title}`,
		style: { textDecoration: "none" },
		children: inner
	});
	return /* @__PURE__ */ jsx("a", {
		href: "https://in.pinterest.com/veereshbbashetti/",
		target: "_blank",
		rel: "noopener noreferrer",
		"aria-label": `Pinterest pin: ${pin.title}`,
		style: { textDecoration: "none" },
		children: inner
	});
};
var PinterestSection = () => {
	const [headerRef, headerVisible] = useScrollReveal();
	const trackRef = useRef(null);
	const scrollByAmount = (dir) => {
		if (!trackRef.current) return;
		const amount = trackRef.current.clientWidth * .7;
		trackRef.current.scrollBy({
			left: dir * amount,
			behavior: "smooth"
		});
	};
	return /* @__PURE__ */ jsxs("section", {
		id: "pinterest",
		"aria-labelledby": "pinterest-heading",
		className: "py-24 bg-[#1A1612] overflow-hidden",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "max-w-[1320px] mx-auto px-6",
				children: /* @__PURE__ */ jsxs("div", {
					ref: headerRef,
					className: `flex items-end justify-between flex-wrap gap-8 mb-10 ${headerVisible ? "reveal-visible" : "reveal-hidden"}`,
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-xs font-bold tracking-[0.12em] uppercase mb-2",
							style: { color: "#FF6B81" },
							children: "Pinterest Picks"
						}),
						/* @__PURE__ */ jsxs("h2", {
							id: "pinterest-heading",
							className: "font-display text-[clamp(2rem,3.5vw,2.75rem)]",
							style: { color: "#FAF8F4" },
							children: ["Pin the ", /* @__PURE__ */ jsx("em", {
								style: { color: "rgba(255,255,255,0.45)" },
								children: "board"
							})]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 text-base max-w-[520px] leading-relaxed",
							style: { color: "rgba(255,255,255,0.65)" },
							children: "Scroll the shelf like you would a board — handpicked products, room ideas, and finds worth saving."
						})
					] }), /* @__PURE__ */ jsxs("div", {
						className: "hidden sm:flex items-center gap-3",
						children: [
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => scrollByAmount(-1),
								"aria-label": "Scroll pins left",
								className: "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#E60023]",
								style: {
									border: "1px solid rgba(255,255,255,0.18)",
									color: "#FAF8F4"
								},
								children: /* @__PURE__ */ jsx("svg", {
									width: 16,
									height: 16,
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2.5",
									children: /* @__PURE__ */ jsx("path", { d: "M15 18l-6-6 6-6" })
								})
							}),
							/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => scrollByAmount(1),
								"aria-label": "Scroll pins right",
								className: "w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-[#E60023]",
								style: {
									border: "1px solid rgba(255,255,255,0.18)",
									color: "#FAF8F4"
								},
								children: /* @__PURE__ */ jsx("svg", {
									width: 16,
									height: 16,
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2.5",
									children: /* @__PURE__ */ jsx("path", { d: "M9 6l6 6-6 6" })
								})
							}),
							/* @__PURE__ */ jsxs("a", {
								href: "https://in.pinterest.com/veereshbbashetti/",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "btn-shimmer inline-flex items-center gap-2 text-white font-bold text-sm px-6 py-3 rounded-full transition-all duration-300 hover:-translate-y-0.5 ml-2",
								style: { boxShadow: "0 4px 20px rgba(230,0,35,0.4)" },
								children: [/* @__PURE__ */ jsx(PinIcon, { size: 16 }), " Follow"]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				ref: trackRef,
				role: "list",
				className: "xl:ml-[110px] md:ml-5 sm:ml-4",
				style: {
					display: "flex",
					gap: "20px",
					overflowX: "auto",
					scrollSnapType: "x mandatory",
					WebkitOverflowScrolling: "touch",
					scrollbarWidth: "none",
					msOverflowStyle: "none",
					paddingLeft: "max(24px, calc((100vw - 1320px) / 2 + 24px))",
					paddingRight: "24px",
					paddingBottom: "12px",
					flexWrap: "nowrap",
					alignItems: "flex-start"
				},
				children: [
					PINS.map((pin, i) => /* @__PURE__ */ jsx("div", {
						role: "listitem",
						style: {
							flexShrink: 0,
							scrollSnapAlign: "start"
						},
						children: /* @__PURE__ */ jsx(PinCard, {
							pin,
							large: i === 0
						})
					}, pin.title)),
					/* @__PURE__ */ jsxs("a", {
						href: "https://in.pinterest.com/veereshbbashetti/",
						target: "_blank",
						rel: "noopener noreferrer",
						style: {
							flexShrink: 0,
							width: "min(60vw, 280px)",
							height: "440px",
							scrollSnapAlign: "start",
							background: "rgba(255,255,255,0.04)",
							border: "1px dashed rgba(255,255,255,0.22)",
							borderRadius: "20px",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							textAlign: "center",
							gap: "16px",
							padding: "32px",
							textDecoration: "none"
						},
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-14 h-14 rounded-full flex items-center justify-center",
								style: { background: "#E60023" },
								children: /* @__PURE__ */ jsx(PinIcon, {
									size: 22,
									className: "text-white"
								})
							}),
							/* @__PURE__ */ jsx("p", {
								className: "font-display text-[1.2rem]",
								style: { color: "#FAF8F4" },
								children: "See the full board"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-[0.8rem]",
								style: { color: "rgba(255,255,255,0.55)" },
								children: "More pins live on Pinterest — updated weekly."
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-[0.78rem] font-bold uppercase tracking-widest",
								style: { color: "#FF6B81" },
								children: "Visit Pinterest ↗"
							})
						]
					}),
					/* @__PURE__ */ jsx("div", {
						style: {
							flexShrink: 0,
							width: "24px"
						},
						"aria-hidden": "true"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "sm:hidden px-6 mt-6",
				children: /* @__PURE__ */ jsxs("a", {
					href: "https://in.pinterest.com/veereshbbashetti/",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "btn-shimmer inline-flex items-center justify-center gap-2 text-white font-bold text-sm px-6 py-3 rounded-full w-full",
					children: [/* @__PURE__ */ jsx(PinIcon, { size: 16 }), " Follow on Pinterest"]
				})
			})
		]
	});
};
var AboutSection = () => {
	const [ref, isVisible] = useScrollReveal();
	const [leftRef, leftVisible] = useScrollReveal(.08);
	const [rightRef, rightVisible] = useScrollReveal(.08);
	return /* @__PURE__ */ jsx("section", {
		id: "about",
		"aria-labelledby": "about-heading",
		className: "py-24 px-6",
		style: { background: "linear-gradient(180deg, #FAF8F5 0%, #F4EDE3 100%)" },
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-[1320px] mx-auto",
			children: [/* @__PURE__ */ jsx("div", {
				ref,
				className: `mb-14 text-center ${isVisible ? "reveal-visible" : "reveal-hidden"}`,
				children: /* @__PURE__ */ jsxs("span", {
					className: "inline-flex items-center gap-2 bg-[#FFF0F0] border border-[#FFD6D6] text-[#E60023] text-[0.68rem] font-bold uppercase tracking-[0.18em] px-4 py-1.5 rounded-full",
					children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-[#E60023] animate-pulseDot" }), "The Person Behind The Blog"]
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-16 items-start",
				children: [/* @__PURE__ */ jsxs("div", {
					ref: leftRef,
					className: leftVisible ? "reveal-visible" : "reveal-hidden",
					children: [
						/* @__PURE__ */ jsxs("h2", {
							id: "about-heading",
							className: "font-display text-[clamp(2.2rem,4.5vw,2.8rem)] leading-[1.08] tracking-tight text-[#1A1612] mb-6",
							children: [
								"I'm Veeresh —",
								" ",
								/* @__PURE__ */ jsx("br", {}),
								/* @__PURE__ */ jsx("em", {
									className: "text-[#8C7E74]",
									children: "still figuring it out,"
								}),
								" ",
								"one honest post at a time."
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-2xl p-5 mb-7",
							style: {
								background: "#FFFFFF",
								borderLeft: "3px solid #E60023",
								boxShadow: "0 4px 20px rgba(26,22,18,0.06)"
							},
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-display text-[1.1rem] leading-[1.75] text-[#1A1612] italic",
								children: "\"I'm not sharing a success story. I'm documenting a journey that's still being written.\""
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[0.72rem] font-bold text-[#8C7E74] uppercase tracking-widest mt-3",
								children: "— Veeresh Bashetti"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-4 mb-8",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "text-[1rem] leading-[1.9] text-[#5D534E]",
									children: "22-year-old web developer from India. I graduated in 2024, spent a year in sales, and eventually followed my real interest — building things on the internet."
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[1rem] leading-[1.9] text-[#5D534E]",
									children: "This blog is where I share what I learn — from code and tools to mistakes, random ideas, and things I find genuinely interesting. No filter, no facade."
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[1rem] leading-[1.9] text-[#5D534E]",
									children: "If you're someone who's still figuring things out, you'll feel at home here."
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-3 gap-3 mb-7",
							children: [
								{
									icon: "✍️",
									label: "Honest Stories",
									sub: "Real life, no highlight reels."
								},
								{
									icon: "🎯",
									label: "Intentional Living",
									sub: "Doing less, but better."
								},
								{
									icon: "💡",
									label: "Curated Ideas",
									sub: "Only what I'd actually use."
								}
							].map((h) => /* @__PURE__ */ jsxs("div", {
								className: "p-4 rounded-xl border border-[#E8E0D5] bg-white flex flex-col gap-1 hover:border-[#1A1612] hover:-translate-y-0.5 transition-all duration-300",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "text-lg",
										children: h.icon
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-sm font-semibold text-[#1A1612]",
										children: h.label
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-[0.7rem] text-[#8C7E74]",
										children: h.sub
									})
								]
							}, h.label))
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap gap-2 mb-8",
							children: [
								"Failures",
								"Wins",
								"Mindset",
								"Gaming",
								"Productivity",
								"Life",
								"Growth",
								"Ideas"
							].map((tag) => /* @__PURE__ */ jsx("span", {
								className: "px-4 py-1.5 rounded-full border border-[#E8DED2] bg-white text-sm text-[#5D544E] transition-all duration-300 hover:bg-[#1A1612] hover:text-white hover:border-[#1A1612] cursor-default",
								children: tag
							}, tag))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap gap-3",
							children: [
								/* @__PURE__ */ jsxs("a", {
									href: "https://in.pinterest.com/veereshbbashetti/",
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-flex items-center gap-2 rounded-full border border-[#E7DDD2] bg-white px-5 py-2.5 text-sm font-semibold text-[#2E2723] transition-all duration-300 hover:bg-[#E60023] hover:text-white hover:border-[#E60023]",
									children: [/* @__PURE__ */ jsx(PinIcon, { size: 15 }), " Pinterest"]
								}),
								/* @__PURE__ */ jsxs("a", {
									href: "mailto:hello@veereshbashetti.com",
									className: "inline-flex items-center gap-2 rounded-full border border-[#E7DDD2] bg-white px-5 py-2.5 text-sm font-semibold text-[#2E2723] transition-all duration-300 hover:bg-[#1A1612] hover:text-white hover:border-[#1A1612]",
									children: [/* @__PURE__ */ jsx(EmailIcon, {}), " Say Hello"]
								}),
								/* @__PURE__ */ jsx("a", {
									href: "/blog",
									className: "inline-flex items-center gap-2 rounded-full bg-[#1A1612] text-[#FAF8F4] px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:bg-[#E60023] hover:-translate-y-0.5",
									children: "Read the Blog →"
								})
							]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					ref: rightRef,
					className: `relative ${rightVisible ? "reveal-visible stagger-2" : "reveal-hidden"}`,
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "overflow-hidden rounded-[28px] border border-[#E8DED2]",
							style: { boxShadow: "0 24px 80px rgba(26,22,18,0.10)" },
							children: /* @__PURE__ */ jsx("img", {
								src: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop",
								alt: "Veeresh Bashetti writing at his desk",
								className: "w-full",
								style: {
									height: "460px",
									objectFit: "cover"
								},
								loading: "lazy",
								decoding: "async",
								fetchPriority: "low"
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "absolute -left-5 top-8 bg-white rounded-2xl px-5 py-3.5 animate-floatA",
							style: {
								boxShadow: "0 8px 32px rgba(26,22,18,0.12)",
								border: "1px solid #E8E0D5"
							},
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-display text-2xl text-[#1A1612]",
								children: "Free"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[0.68rem] font-bold text-[#8C7E74] uppercase tracking-wider mt-0.5",
								children: "Always free to read"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "absolute -right-4 bottom-32 bg-white rounded-2xl px-5 py-3.5 animate-floatB",
							style: {
								boxShadow: "0 8px 32px rgba(26,22,18,0.12)",
								border: "1px solid #E8E0D5"
							},
							children: [/* @__PURE__ */ jsx("p", {
								className: "font-display text-2xl text-[#1A1612]",
								children: "Real"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[0.68rem] font-bold text-[#8C7E74] uppercase tracking-wider mt-0.5",
								children: "No filters, no fake"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-4 rounded-2xl p-5",
							style: {
								background: "#1A1612",
								border: "1px solid rgba(255,255,255,0.08)"
							},
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-4 mb-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "w-11 h-11 rounded-xl bg-[#E60023] flex items-center justify-center font-display text-lg text-white flex-shrink-0",
										children: "V"
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
										className: "text-[0.92rem] font-semibold text-[#FAF8F4]",
										children: "Veeresh Bashetti"
									}), /* @__PURE__ */ jsx("p", {
										className: "text-[0.72rem]",
										style: { color: "rgba(255,255,255,0.50)" },
										children: "Developer · Writer · Overthinker 🫠"
									})] })]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-[0.85rem] leading-relaxed",
									style: { color: "rgba(255,255,255,0.65)" },
									children: "Based in India. Writing about dev life, setups, and everything in between."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 mt-4 pt-3.5",
									style: { borderTop: "1px solid rgba(255,255,255,0.08)" },
									children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 rounded-full bg-green-400 animate-pulseDot" }), /* @__PURE__ */ jsx("span", {
										className: "text-[0.7rem] font-medium",
										style: { color: "rgba(255,255,255,0.42)" },
										children: "Actively writing · New posts every week"
									})]
								})
							]
						})
					]
				})]
			})]
		})
	});
};
var PostRowItem = ({ post, index }) => {
	const [rowRef, rowVisible] = useScrollReveal(.05);
	const [imgError, setImgError] = useState(false);
	const formattedDate = post.date ? new Date(post.date).toLocaleDateString("en-IN", {
		year: "numeric",
		month: "long",
		day: "numeric"
	}) : "";
	return /* @__PURE__ */ jsxs(Link, {
		ref: rowRef,
		to: `/blog/${post.slug}`,
		"aria-label": `Read: ${post.title}`,
		className: `grid gap-5 items-center py-5 border-b border-[#E8E0D5] first:border-t first:border-[#E8E0D5] transition-all duration-300 group ${rowVisible ? `reveal-visible stagger-${Math.min(index + 1, 8)}` : "reveal-hidden"}`,
		style: {
			gridTemplateColumns: "120px 1fr",
			textDecoration: "none"
		},
		children: [/* @__PURE__ */ jsx("div", {
			className: "rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl",
			style: {
				width: 120,
				aspectRatio: "4/3",
				background: "#F2EDE4",
				border: "1px solid #E8E0D5"
			},
			children: post.image && !imgError ? /* @__PURE__ */ jsx("img", {
				src: post.image,
				alt: post.title,
				className: "w-full h-full",
				style: { objectFit: "cover" },
				loading: "lazy",
				decoding: "async",
				fetchPriority: "low",
				onError: () => setImgError(true)
			}) : post.emoji
		}), /* @__PURE__ */ jsxs("div", { children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-[0.68rem] font-bold uppercase tracking-widest text-[#E60023] mb-1.5",
				children: post.category
			}),
			/* @__PURE__ */ jsx("h3", {
				className: "font-display text-[1.05rem] leading-snug text-[#1A1612] mb-1.5 group-hover:text-[#E60023] transition-colors duration-300",
				children: post.title
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "text-[0.75rem] text-[#8C7E74] font-medium",
				children: [formattedDate, post.readingTime && ` · ${post.readingTime}`]
			})
		] })]
	});
};
var LatestPosts = ({ posts }) => {
	const [headerRef, headerVisible] = useScrollReveal();
	const latest = useMemo(() => [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5), [posts]);
	if (latest.length === 0) return null;
	return /* @__PURE__ */ jsx("section", {
		"aria-labelledby": "latest-heading",
		className: "py-24 px-6",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-[1320px] mx-auto",
			children: [/* @__PURE__ */ jsxs("div", {
				ref: headerRef,
				className: `flex items-end justify-between mb-10 gap-8 flex-wrap `,
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
					className: "text-xs font-bold tracking-[0.12em] uppercase text-[#E60023] mb-2",
					children: "Recent Posts"
				}), /* @__PURE__ */ jsxs("h2", {
					id: "latest-heading",
					className: "font-display text-[clamp(2rem,3.5vw,2.75rem)] text-[#1A1612]",
					children: ["More ", /* @__PURE__ */ jsx("em", {
						className: "text-[#8C7E74]",
						children: "to read"
					})]
				})] }), /* @__PURE__ */ jsxs("button", {
					type: "button",
					onClick: () => {
						const s = document.getElementById("blog");
						if (s) s.scrollIntoView({ behavior: "smooth" });
					},
					className: "inline-flex items-center gap-2 bg-[#1A1612] text-[#FAF8F4] font-semibold text-sm px-7 py-[0.85rem] rounded-full hover:bg-[#E60023] transition-all duration-300 hover:-translate-y-0.5 shadow-sm",
					children: [/* @__PURE__ */ jsx(ArrowDown, { size: 16 }), " Read the Blog"]
				})]
			}), /* @__PURE__ */ jsx("div", { children: latest.map((p, i) => /* @__PURE__ */ jsx(PostRowItem, {
				post: p,
				index: i
			}, p.slug)) })]
		})
	});
};
var Footer = () => /* @__PURE__ */ jsx("footer", {
	role: "contentinfo",
	className: "bg-[#1A1612] text-[#FAF8F4] pt-20 pb-10 px-6",
	children: /* @__PURE__ */ jsxs("div", {
		className: "max-w-[1320px] mx-auto",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 mb-16",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx(Link, {
						to: "/",
						style: { textDecoration: "none" },
						children: /* @__PURE__ */ jsxs("p", {
							className: "font-display text-[1.5rem] text-[#FAF8F4]",
							children: ["Veeresh", /* @__PURE__ */ jsx("span", {
								className: "text-[#E60023]",
								children: "."
							})]
						})
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-4 text-[0.88rem] leading-[1.75] max-w-[280px]",
						style: { color: "rgba(255,255,255,0.5)" },
						children: "A personal blog about the small things that make life better."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-6",
						children: /* @__PURE__ */ jsxs("a", {
							href: "https://in.pinterest.com/veereshbbashetti/",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "btn-shimmer inline-flex items-center gap-2 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-0.5",
							children: [/* @__PURE__ */ jsx(PinIcon, { size: 15 }), " Follow on Pinterest"]
						})
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
					className: "text-[0.75rem] font-bold uppercase tracking-widest mb-5",
					style: { color: "rgba(255,255,255,0.4)" },
					children: "Topics"
				}), /* @__PURE__ */ jsx("ul", {
					className: "space-y-2.5 list-none p-0 m-0",
					children: [
						{
							label: "Career",
							to: "/category/career"
						},
						{
							label: "Life Lessons",
							to: "/category/life-lessons"
						},
						{
							label: "Pinterest Picks",
							to: "/category/pinterest-picks"
						},
						{
							label: "Finance",
							to: "/category/finance"
						}
					].map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
						to: item.to,
						className: "text-[0.88rem] transition-colors duration-300 hover:text-[#FF6B81]",
						style: {
							color: "rgba(255,255,255,0.65)",
							textDecoration: "none"
						},
						children: item.label
					}) }, item.label))
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
					className: "text-[0.75rem] font-bold uppercase tracking-widest mb-5",
					style: { color: "rgba(255,255,255,0.4)" },
					children: "Explore"
				}), /* @__PURE__ */ jsx("ul", {
					className: "space-y-2.5 list-none p-0 m-0",
					children: [
						{
							label: "All Posts",
							to: "/blog"
						},
						{
							label: "Categories",
							to: "/categories"
						},
						{
							label: "Saved Pins",
							to: "/saved"
						},
						{
							label: "About Me",
							to: "/about"
						}
					].map((item) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
						to: item.to,
						className: "text-[0.88rem] transition-colors duration-300 hover:text-[#FF6B81]",
						style: {
							color: "rgba(255,255,255,0.65)",
							textDecoration: "none"
						},
						children: item.label
					}) }, item.label))
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
					className: "text-[0.75rem] font-bold uppercase tracking-widest mb-5",
					style: { color: "rgba(255,255,255,0.4)" },
					children: "Connect"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "space-y-2.5 list-none p-0 m-0",
					children: [
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
							href: "https://in.pinterest.com/veereshbbashetti/",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-[0.88rem] hover:text-[#FF6B81] transition-colors duration-300",
							style: {
								color: "rgba(255,255,255,0.65)",
								textDecoration: "none"
							},
							children: "Pinterest ↗"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", {
							href: "mailto:veeresh.b.bashetti@gmail.com",
							className: "text-[0.88rem] hover:text-[#FF6B81] transition-colors duration-300",
							style: {
								color: "rgba(255,255,255,0.65)",
								textDecoration: "none"
							},
							children: "Email Me"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/about",
							className: "text-[0.88rem] hover:text-[#FF6B81] transition-colors duration-300",
							style: {
								color: "rgba(255,255,255,0.65)",
								textDecoration: "none"
							},
							children: "About"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/privacy-policy",
							className: "text-[0.88rem] hover:text-[#FF6B81] transition-colors duration-300",
							style: {
								color: "rgba(255,255,255,0.65)",
								textDecoration: "none"
							},
							children: "Privacy Policy"
						}) })
					]
				})] })
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center justify-between pt-7 gap-4 text-[0.78rem]",
			style: {
				borderTop: "1px solid rgba(255,255,255,0.10)",
				color: "rgba(255,255,255,0.35)"
			},
			children: [/* @__PURE__ */ jsxs("span", { children: [
				"© ",
				(/* @__PURE__ */ new Date()).getFullYear(),
				" Veeresh Bashetti. All rights reserved."
			] }), /* @__PURE__ */ jsx("div", {
				className: "flex gap-6",
				children: [
					{
						label: "Privacy Policy",
						to: "/privacy-policy"
					},
					{
						label: "Terms",
						to: "/terms"
					},
					{
						label: "Sitemap",
						to: "/sitemap"
					}
				].map((item) => /* @__PURE__ */ jsx(Link, {
					to: item.to,
					className: "hover:opacity-70 transition-opacity duration-300",
					style: {
						color: "rgba(255,255,255,0.35)",
						textDecoration: "none"
					},
					children: item.label
				}, item.label))
			})]
		})]
	})
});
var Divider = () => /* @__PURE__ */ jsx("div", {
	className: "max-w-[1320px] mx-auto px-6",
	children: /* @__PURE__ */ jsx("div", { className: "divider-line" })
});
var NewPostsPopup = () => {
	const [posts, setPosts] = useState([]);
	const [visible, setVisible] = useState(false);
	const [closing, setClosing] = useState(false);
	const [activeIdx, setActiveIdx] = useState(0);
	useEffect(() => {
		let cancelled = false;
		async function load() {
			try {
				const res = await fetch("/blogs/manifest.json");
				if (!res.ok) return;
				const data = await res.json();
				const rawPosts = Array.isArray(data) ? data : data.posts || [];
				if (rawPosts.length === 0) return;
				const top3 = rawPosts.slice(0, 3);
				const seenKey = `seenPopup:${top3[0].slug}`;
				if (localStorage.getItem(seenKey)) return;
				if (!cancelled) setPosts(top3);
			} catch {}
		}
		load();
		return () => {
			cancelled = true;
		};
	}, []);
	useEffect(() => {
		if (posts.length === 0) return;
		const timer = setTimeout(() => setVisible(true), 2500);
		return () => clearTimeout(timer);
	}, [posts]);
	const close = () => {
		setClosing(true);
		if (posts[0]) localStorage.setItem(`seenPopup:${posts[0].slug}`, "1");
		setTimeout(() => setVisible(false), 250);
	};
	if (posts.length === 0 || !visible) return null;
	const active = posts[activeIdx];
	return /* @__PURE__ */ jsxs("div", {
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "new-posts-popup-heading",
		className: "fixed inset-0 z-[100] flex items-center justify-center px-3 sm:px-6",
		style: {
			background: "rgba(20,16,13,0.72)",
			backdropFilter: "blur(6px)",
			WebkitBackdropFilter: "blur(6px)",
			animation: closing ? "popupFadeOut 0.25s ease both" : "popupFadeIn 0.35s ease both"
		},
		onClick: close,
		children: [/* @__PURE__ */ jsxs("div", {
			onClick: (e) => e.stopPropagation(),
			className: "bg-white overflow-hidden w-full relative max-w-[900px] max-h-[92vh] overflow-y-auto",
			style: {
				borderRadius: "26px",
				boxShadow: "0 40px 100px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)",
				animation: closing ? "popupScaleOut 0.25s ease both" : "popupScaleIn 0.4s cubic-bezier(0.22,1,0.36,1) both"
			},
			children: [/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: close,
				"aria-label": "Close popup",
				className: "absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105",
				style: {
					background: "rgba(255,255,255,0.95)",
					border: "1px solid rgba(0,0,0,0.06)",
					boxShadow: "0 4px 14px rgba(0,0,0,0.15)"
				},
				children: /* @__PURE__ */ jsx(CloseIcon, {})
			}), /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 md:grid-cols-[1.05fr_1fr]",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "relative w-full h-[220px] md:h-[480px] overflow-hidden",
					style: { background: "#1A1612" },
					children: [
						active.image && /* @__PURE__ */ jsx("img", {
							src: active.image,
							alt: active.title,
							className: "w-full h-full",
							style: {
								objectFit: "cover",
								animation: "popupImgFade 0.5s ease both"
							}
						}, active.slug),
						/* @__PURE__ */ jsx("div", {
							className: "absolute inset-0 pointer-events-none",
							style: { background: "linear-gradient(180deg, rgba(26,22,18,0.35) 0%, rgba(26,22,18,0) 30%, rgba(26,22,18,0) 60%, rgba(26,22,18,0.55) 100%)" }
						}),
						/* @__PURE__ */ jsxs("span", {
							className: "absolute top-5 left-5 inline-flex items-center gap-1.5 text-white text-[0.66rem] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full",
							style: {
								background: "#E60023",
								boxShadow: "0 6px 20px rgba(230,0,35,0.45)"
							},
							children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-white animate-pulseDot" }), activeIdx === 0 ? "Newest Post" : "Also New"]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "p-6 sm:p-9 flex flex-col",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#E60023] mb-3",
							children: "Fresh off the press"
						}),
						/* @__PURE__ */ jsx("h3", {
							id: "new-posts-popup-heading",
							className: "font-display text-[1.4rem] sm:text-[1.85rem] leading-[1.2] text-[#1A1612] mb-3 pr-6 md:pr-0",
							children: active.title
						}),
						active.meta && /* @__PURE__ */ jsxs("p", {
							className: "text-[0.82rem] text-[#8C7E74] font-medium mb-6 flex items-center gap-2",
							children: [/* @__PURE__ */ jsxs("svg", {
								width: 13,
								height: 13,
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								children: [/* @__PURE__ */ jsx("circle", {
									cx: "12",
									cy: "12",
									r: "9"
								}), /* @__PURE__ */ jsx("path", { d: "M12 7v5l3 3" })]
							}), active.meta]
						}),
						/* @__PURE__ */ jsxs(Link, {
							to: `/blog/${active.slug}`,
							onClick: close,
							className: "group inline-flex items-center justify-center gap-2 bg-[#1A1612] text-[#FAF8F4] font-semibold text-sm px-6 py-3.5 rounded-full transition-all duration-300 hover:bg-[#E60023] hover:-translate-y-0.5 mb-7 w-full sm:w-auto",
							style: {
								textDecoration: "none",
								boxShadow: "0 10px 30px rgba(26,22,18,0.18)"
							},
							children: ["Read it now", /* @__PURE__ */ jsx("svg", {
								width: 14,
								height: 14,
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.5",
								className: "transition-transform duration-300 group-hover:translate-x-1",
								children: /* @__PURE__ */ jsx("path", { d: "M5 12h14M12 5l7 7-7 7" })
							})]
						}),
						posts.length > 1 && /* @__PURE__ */ jsxs("div", {
							className: "mt-auto pt-6",
							style: { borderTop: "1px solid #EFE8DE" },
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-[0.65rem] font-bold uppercase tracking-widest text-[#8C7E74] mb-3",
								children: "More new posts"
							}), /* @__PURE__ */ jsx("div", {
								className: "flex gap-3",
								children: posts.map((p, i) => /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setActiveIdx(i),
									"aria-label": `View ${p.title}`,
									"aria-pressed": i === activeIdx,
									className: "flex-1 text-left rounded-xl overflow-hidden transition-all duration-250",
									style: {
										border: i === activeIdx ? "2px solid #E60023" : "2px solid transparent",
										opacity: i === activeIdx ? 1 : .55,
										transform: i === activeIdx ? "translateY(-2px)" : "none",
										boxShadow: i === activeIdx ? "0 8px 18px rgba(230,0,35,0.18)" : "none"
									},
									children: p.image && /* @__PURE__ */ jsxs("div", {
										className: "h-14 overflow-hidden relative",
										children: [/* @__PURE__ */ jsx("img", {
											src: p.image,
											alt: p.title,
											className: "w-full h-full object-cover"
										}), i === activeIdx && /* @__PURE__ */ jsx("span", {
											className: "absolute inset-0",
											style: { background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.35))" }
										})]
									})
								}, p.slug))
							})]
						})
					]
				})]
			})]
		}), /* @__PURE__ */ jsx("style", { children: `
        @keyframes popupFadeIn   { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popupFadeOut  { from { opacity: 1; } to { opacity: 0; } }
        @keyframes popupScaleIn  { from { opacity: 0; transform: scale(0.94) translateY(14px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes popupScaleOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.96); } }
        @keyframes popupImgFade  { from { opacity: 0; } to { opacity: 1; } }
      ` })]
	});
};
function Blog() {
	const { posts, loading, error } = useBlogPosts();
	const categoriesCount = useMemo(() => {
		return new Set(posts.map((p) => p.category || "General")).size;
	}, [posts]);
	const pinterestSaves = useMemo(() => {
		return PINS.length;
	}, []);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(GlobalStyles, {}),
		/* @__PURE__ */ jsx(SEOHead, { posts }),
		/* @__PURE__ */ jsx(NewPostsPopup, {}),
		/* @__PURE__ */ jsxs("div", {
			className: "bg-[#FAF8F4] text-[#1A1612]",
			children: [
				/* @__PURE__ */ jsx(Navbar, {}),
				/* @__PURE__ */ jsxs("main", {
					id: "main-content",
					children: [
						/* @__PURE__ */ jsx(Hero, {
							totalPosts: posts.length,
							categoriesCount,
							pinterestSaves
						}),
						/* @__PURE__ */ jsx(BlogSection, {
							posts,
							loading,
							error
						}),
						/* @__PURE__ */ jsx(Divider, {}),
						/* @__PURE__ */ jsx(TopicsSection, { posts }),
						/* @__PURE__ */ jsx(Divider, {}),
						/* @__PURE__ */ jsx(PinterestSection, {}),
						/* @__PURE__ */ jsx(AboutSection, {}),
						/* @__PURE__ */ jsx(Divider, {}),
						/* @__PURE__ */ jsx(LatestPosts, { posts })
					]
				}),
				/* @__PURE__ */ jsx(Footer, {})
			]
		})
	] });
}
//#endregion
export { Blog as default };
