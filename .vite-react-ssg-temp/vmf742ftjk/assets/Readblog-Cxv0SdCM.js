import { t as parseFrontmatter } from "../main.mjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import ReactMarkdown from "react-markdown";
//#region src/pages/Readblog.jsx
var SITE = {
	name: "Veeresh Bashetti",
	tagline: "Writer & Curator",
	pinterestUrl: "https://in.pinterest.com/veereshbbashetti/",
	email: "veeresh.b.bashetti@gmail.com",
	baseUrl: "https://veereshbashetti.com",
	locale: "en_IN"
};
var TOC_EMOJIS = [
	"📌",
	"💡",
	"📊",
	"🔥",
	"🧠",
	"✨",
	"🚀",
	"🎯",
	"📝",
	"⚡"
];
var REACTIONS = [
	"❤️",
	"🔥",
	"💡",
	"🤔"
];
var REACTION_LABELS = {
	"❤️": "Love",
	"🔥": "Fire",
	"💡": "Insightful",
	"🤔": "Thoughtful"
};
var ADSENSE_CLIENT = "ca-pub-4423608769058806";
var CarbonAdUnit = ({ slot, format = "auto", responsive = "true", style = {}, className = "" }) => {
	const [consent, setConsent] = useState(hasConsent());
	useEffect(() => {
		const onChange = (e) => setConsent(e.detail === "accepted");
		window.addEventListener("cookieConsentChanged", onChange);
		return () => window.removeEventListener("cookieConsentChanged", onChange);
	}, []);
	useEffect(() => {
		if (!consent) return;
		try {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (e) {
			console.error("AdSense error:", e.message);
		}
	}, [slot, consent]);
	if (!consent) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: `ad-wrapper overflow-hidden clear-both my-8 text-center ${className}`,
		children: [/* @__PURE__ */ jsx("span", {
			className: "block text-[0.58rem] tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-1.5 font-medium",
			children: "— Advertisement —"
		}), /* @__PURE__ */ jsx("ins", {
			className: "adsbygoogle block rounded-xl",
			style: {
				display: "block",
				width: "100%",
				minHeight: "280px",
				...style
			},
			"data-ad-client": ADSENSE_CLIENT,
			"data-ad-slot": slot,
			"data-ad-format": format,
			"data-full-width-responsive": responsive
		})]
	});
};
var InArticleAd = () => {
	const [consent, setConsent] = useState(hasConsent());
	useEffect(() => {
		const onChange = (e) => setConsent(e.detail === "accepted");
		window.addEventListener("cookieConsentChanged", onChange);
		return () => window.removeEventListener("cookieConsentChanged", onChange);
	}, []);
	useEffect(() => {
		if (!consent) return;
		try {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
		} catch (e) {}
	}, [consent]);
	if (!consent) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "my-10",
		children: [/* @__PURE__ */ jsx("span", {
			className: "block text-center text-[0.58rem] tracking-[0.2em] uppercase text-neutral-400 mb-2",
			children: "— Advertisement —"
		}), /* @__PURE__ */ jsx("ins", {
			className: "adsbygoogle",
			style: {
				display: "block",
				textAlign: "center"
			},
			"data-ad-layout": "in-article",
			"data-ad-format": "fluid",
			"data-ad-client": "ca-pub-4423608769058806",
			"data-ad-slot": "3083346955"
		})]
	});
};
function buildTOC(md) {
	return md.split("\n").filter((l) => l.match(/^## /)).map((l, i) => {
		const label = l.replace(/^## /, "").trim();
		return {
			id: label.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim(),
			label,
			emoji: TOC_EMOJIS[i % TOC_EMOJIS.length]
		};
	});
}
function slugToId(text) {
	return String(text).toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}
function formatDate(d) {
	if (!d) return "";
	try {
		return new Date(d).toLocaleDateString("en-IN", {
			year: "numeric",
			month: "long",
			day: "numeric"
		});
	} catch {
		return d;
	}
}
function estimateReadTime(text) {
	const words = text.trim().split(/\s+/).length;
	return Math.max(1, Math.round(words / 238));
}
function normalizeTags(tags) {
	if (!Array.isArray(tags)) return [];
	return tags.map((t) => {
		if (typeof t === "string") return t.trim();
		if (t && typeof t === "object") {
			const key = Object.keys(t)[0];
			return key ? String(key).trim() : null;
		}
		return null;
	}).filter(Boolean);
}
var AFFILIATE_PLATFORMS = {
	amazon: {
		match: /amazon\.[a-z.]+|amzn\.to|amzn\.in/i,
		label: "Amazon",
		color: "#FF9900",
		bg: "#FFF6E5",
		icon: "📦"
	},
	flipkart: {
		match: /flipkart\.com|fkrt\.(it|co|cc)/i,
		label: "Flipkart",
		color: "#2874F0",
		bg: "#EAF1FF",
		icon: "🛍️"
	},
	myntra: {
		match: /myntra\.com/i,
		label: "Myntra",
		color: "#FF3F6C",
		bg: "#FFEFF3",
		icon: "👗"
	},
	meesho: {
		match: /meesho\.com|meesho\.onelink\.me/i,
		label: "Meesho",
		color: "#9F2089",
		bg: "#FBEEFA",
		icon: "🧺"
	}
};
function getPlatform(href = "") {
	for (const key in AFFILIATE_PLATFORMS) if (AFFILIATE_PLATFORMS[key].match.test(href)) return {
		key,
		...AFFILIATE_PLATFORMS[key]
	};
	return {
		key: "default",
		label: "View",
		color: "#1A1612",
		bg: "#F0EBE3",
		icon: "🔗"
	};
}
function isAffiliateLink(href = "") {
	return Object.values(AFFILIATE_PLATFORMS).some((p) => p.match.test(href));
}
function useReadingProgress() {
	const [progress, setProgress] = useState(0);
	useEffect(() => {
		const onScroll = () => {
			const doc = document.documentElement;
			const total = doc.scrollHeight - doc.clientHeight;
			setProgress(total > 0 ? Math.round(doc.scrollTop / total * 100) : 0);
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return progress;
}
function useActiveTOC(tocItems) {
	const [activeId, setActiveId] = useState(tocItems[0]?.id || "");
	const [sectionProgress, setSectionProgress] = useState({});
	useEffect(() => {
		if (!tocItems.length) return;
		const observer = new IntersectionObserver((entries) => entries.forEach((e) => {
			if (e.isIntersecting) setActiveId(e.target.id);
		}), { rootMargin: "-15% 0px -70% 0px" });
		document.querySelectorAll("h2[id]").forEach((h) => observer.observe(h));
		const calc = () => {
			const ids = tocItems.map((t) => t.id);
			const result = {};
			ids.forEach((id, i) => {
				const el = document.getElementById(id);
				if (!el) return;
				const next = i < ids.length - 1 ? document.getElementById(ids[i + 1]) : null;
				const top = el.getBoundingClientRect().top + window.scrollY;
				const bottom = next ? next.getBoundingClientRect().top + window.scrollY : document.documentElement.scrollHeight;
				const scrolled = window.scrollY + window.innerHeight * .2 - top;
				result[id] = Math.min(100, Math.max(0, scrolled / (bottom - top) * 100));
			});
			setSectionProgress(result);
		};
		window.addEventListener("scroll", calc, { passive: true });
		calc();
		return () => {
			observer.disconnect();
			window.removeEventListener("scroll", calc);
		};
	}, [tocItems]);
	return {
		activeId,
		sectionProgress
	};
}
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
function useFontSize() {
	const [size, setSize] = useState(17);
	const increase = () => setSize((s) => Math.min(s + 1, 21));
	const decrease = () => setSize((s) => Math.max(s - 1, 14));
	return [
		size,
		increase,
		decrease
	];
}
function useSelectionToolbar() {
	const [tooltip, setTooltip] = useState(null);
	useEffect(() => {
		const onMouseUp = () => {
			const sel = window.getSelection();
			if (!sel || sel.isCollapsed || sel.toString().trim().length < 3) {
				setTooltip(null);
				return;
			}
			const rect = sel.getRangeAt(0).getBoundingClientRect();
			setTooltip({
				text: sel.toString().trim(),
				x: rect.left + rect.width / 2,
				y: rect.top + window.scrollY - 48
			});
		};
		const onMouseDown = (e) => {
			if (!e.target.closest("[data-selection-toolbar]")) setTooltip(null);
		};
		document.addEventListener("mouseup", onMouseUp);
		document.addEventListener("mousedown", onMouseDown);
		return () => {
			document.removeEventListener("mouseup", onMouseUp);
			document.removeEventListener("mousedown", onMouseDown);
		};
	}, []);
	return [tooltip, setTooltip];
}
function useScrollToTop() {
	const [show, setShow] = useState(false);
	useEffect(() => {
		const onScroll = () => setShow(window.scrollY > 600);
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return show;
}
function useFadeIn(delay = 0) {
	const ref = useRef(null);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		el.style.opacity = "0";
		el.style.transform = "translateY(16px)";
		el.style.transition = `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`;
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) {
				el.style.opacity = "1";
				el.style.transform = "none";
				obs.unobserve(el);
			}
		}, { threshold: .06 });
		obs.observe(el);
		return () => obs.disconnect();
	}, [delay]);
	return ref;
}
function useSEO(frontmatter, slug, content = "", morePosts = []) {
	useEffect(() => {
		if (!frontmatter.title) return;
		document.title = frontmatter.seo?.title || `${frontmatter.title} — ${SITE.name}`;
		const setMeta = (name, value, prop = false) => {
			const attr = prop ? "property" : "name";
			let el = document.querySelector(`meta[${attr}="${name}"]`);
			if (!el) {
				el = document.createElement("meta");
				el.setAttribute(attr, name);
				document.head.appendChild(el);
			}
			el.setAttribute("content", value);
		};
		const desc = frontmatter.seo?.description || frontmatter.description || frontmatter.excerpt || "";
		const url = `${SITE.baseUrl}/blog/${slug}`;
		const img = frontmatter.image || "";
		const words = content.trim().split(/\s+/).length;
		const readMinutes = Math.max(1, Math.round(words / 238));
		setMeta("description", desc);
		if (frontmatter.seo?.keywords?.length) setMeta("keywords", frontmatter.seo.keywords.join(", "));
		setMeta("og:type", "article", true);
		setMeta("og:title", frontmatter.title, true);
		setMeta("og:description", desc, true);
		setMeta("og:url", url, true);
		setMeta("og:site_name", SITE.name, true);
		setMeta("og:locale", SITE.locale, true);
		if (img) setMeta("og:image", img, true);
		if (frontmatter.date) setMeta("article:published_time", frontmatter.date, true);
		if (frontmatter.author) setMeta("article:author", frontmatter.author, true);
		document.querySelectorAll("meta[property=\"article:tag\"]").forEach((el) => el.remove());
		normalizeTags(frontmatter.tags).forEach((t) => {
			const el = document.createElement("meta");
			el.setAttribute("property", "article:tag");
			el.setAttribute("content", t);
			document.head.appendChild(el);
		});
		setMeta("twitter:card", "summary_large_image");
		setMeta("twitter:title", frontmatter.title);
		setMeta("twitter:description", desc);
		if (img) setMeta("twitter:image", img);
		let canonical = document.querySelector("link[rel=\"canonical\"]");
		if (!canonical) {
			canonical = document.createElement("link");
			canonical.rel = "canonical";
			document.head.appendChild(canonical);
		}
		canonical.href = url;
		["prev", "next"].forEach((rel) => {
			const existing = document.querySelector(`link[rel="${rel}"]`);
			if (existing) existing.remove();
		});
		const currentIdx = morePosts.findIndex((p) => p.slug === slug);
		if (morePosts[currentIdx - 1]) {
			const el = document.createElement("link");
			el.rel = "prev";
			el.href = `${SITE.baseUrl}/blog/${morePosts[currentIdx - 1].slug}`;
			document.head.appendChild(el);
		}
		if (morePosts[currentIdx + 1]) {
			const el = document.createElement("link");
			el.rel = "next";
			el.href = `${SITE.baseUrl}/blog/${morePosts[currentIdx + 1].slug}`;
			document.head.appendChild(el);
		}
		const graph = [{
			"@type": "BlogPosting",
			"@id": `${url}#article`,
			headline: frontmatter.title,
			description: desc,
			image: img,
			datePublished: frontmatter.date || "",
			dateModified: frontmatter.date || "",
			author: {
				"@type": "Person",
				name: frontmatter.author || SITE.name,
				url: SITE.baseUrl
			},
			publisher: {
				"@type": "Person",
				name: SITE.name,
				url: SITE.baseUrl
			},
			keywords: normalizeTags(frontmatter.tags).join(", "),
			inLanguage: "en-IN",
			url,
			wordCount: words,
			timeRequired: `PT${readMinutes}M`
		}, {
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "Home",
					item: SITE.baseUrl
				},
				{
					"@type": "ListItem",
					position: 2,
					name: "Blog",
					item: `${SITE.baseUrl}/#blog`
				},
				...frontmatter.category ? [{
					"@type": "ListItem",
					position: 3,
					name: frontmatter.category,
					item: `${SITE.baseUrl}/category/${frontmatter.category?.toLowerCase().replace(/\s+/g, "-")}`
				}] : [],
				{
					"@type": "ListItem",
					position: frontmatter.category ? 4 : 3,
					name: frontmatter.title,
					item: url
				}
			]
		}];
		if (Array.isArray(frontmatter.faqs) && frontmatter.faqs.length) graph.push({
			"@type": "FAQPage",
			mainEntity: frontmatter.faqs.map(({ q, a }) => ({
				"@type": "Question",
				name: q,
				acceptedAnswer: {
					"@type": "Answer",
					text: a
				}
			}))
		});
		let schema = document.getElementById("article-schema");
		if (!schema) {
			schema = document.createElement("script");
			schema.id = "article-schema";
			schema.type = "application/ld+json";
			document.head.appendChild(schema);
		}
		schema.textContent = JSON.stringify({
			"@context": "https://schema.org",
			"@graph": graph
		});
	}, [
		frontmatter,
		slug,
		content,
		morePosts
	]);
}
function useSyncedSidebarScroll(containerRef, layoutRef) {
	useEffect(() => {
		const container = containerRef.current;
		const layout = layoutRef.current;
		if (!container || !layout) return;
		let rafId = null;
		const syncScroll = () => {
			if (rafId) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(() => {
				if (window.innerWidth < 1024) return;
				const layoutRect = layout.getBoundingClientRect();
				const stickyTopOffset = 96;
				const totalLayoutScrollable = layoutRect.height - window.innerHeight + stickyTopOffset;
				const layoutsScrolledAmount = -layoutRect.top + stickyTopOffset;
				if (totalLayoutScrollable <= 0) return;
				const progressRatio = Math.min(1, Math.max(0, layoutsScrolledAmount / totalLayoutScrollable));
				const sidebarScrollableHeight = container.scrollHeight - container.clientHeight;
				if (sidebarScrollableHeight <= 0) return;
				container.scrollTop = sidebarScrollableHeight * progressRatio;
			});
		};
		window.addEventListener("scroll", syncScroll, { passive: true });
		window.addEventListener("resize", syncScroll, { passive: true });
		syncScroll();
		return () => {
			window.removeEventListener("scroll", syncScroll);
			window.removeEventListener("resize", syncScroll);
			if (rafId) cancelAnimationFrame(rafId);
		};
	}, [containerRef, layoutRef]);
}
function useReadingStreak() {
	const [streak, setStreak] = useState(0);
	useEffect(() => {
		const today = (/* @__PURE__ */ new Date()).toDateString();
		const stored = JSON.parse(localStorage.getItem("reading-streak") || "{}");
		const last = stored.lastDate || "";
		const count = stored.count || 0;
		const yesterday = (/* @__PURE__ */ new Date(Date.now() - 864e5)).toDateString();
		if (last === today) setStreak(count);
		else if (last === yesterday) {
			const next = count + 1;
			localStorage.setItem("reading-streak", JSON.stringify({
				lastDate: today,
				count: next
			}));
			setStreak(next);
		} else {
			localStorage.setItem("reading-streak", JSON.stringify({
				lastDate: today,
				count: 1
			}));
			setStreak(1);
		}
	}, []);
	return streak;
}
function useReadingMode() {
	const [on, setOn] = useState(false);
	useEffect(() => {
		document.documentElement.setAttribute("data-reading-mode", on ? "on" : "off");
		return () => document.documentElement.removeAttribute("data-reading-mode");
	}, [on]);
	return [on, () => setOn((o) => !o)];
}
function useFinishTime(readTime, progress) {
	return useMemo(() => {
		if (!readTime || progress >= 100) return null;
		const remaining = Math.max(0, readTime * (1 - progress / 100));
		return new Date(Date.now() + remaining * 6e4).toLocaleTimeString("en-IN", {
			hour: "2-digit",
			minute: "2-digit"
		});
	}, [readTime, progress]);
}
function useHighlights(slug) {
	const [highlights, setHighlights] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem(`highlights:${slug}`) || "[]");
		} catch {
			return [];
		}
	});
	return {
		highlights,
		save: useCallback((text) => {
			setHighlights((prev) => {
				if (prev.find((h) => h.text === text)) return prev;
				const next = [{
					id: Date.now(),
					text,
					date: (/* @__PURE__ */ new Date()).toISOString()
				}, ...prev].slice(0, 20);
				localStorage.setItem(`highlights:${slug}`, JSON.stringify(next));
				return next;
			});
		}, [slug]),
		remove: useCallback((id) => {
			setHighlights((prev) => {
				const next = prev.filter((h) => h.id !== id);
				localStorage.setItem(`highlights:${slug}`, JSON.stringify(next));
				return next;
			});
		}, [slug])
	};
}
function useReactions(slug, supabaseUrl, supabaseKey) {
	const [counts, setCounts] = useState({});
	const [myVotes, setMyVotes] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem(`reactions:${slug}`) || "{}");
		} catch {
			return {};
		}
	});
	const fetchReactions = useCallback(async () => {
		if (!supabaseUrl || !supabaseKey) return;
		try {
			const rows = await (await fetch(`${supabaseUrl}/rest/v1/reactions?slug=eq.${encodeURIComponent(slug)}&select=emoji`, { headers: {
				apikey: supabaseKey,
				Authorization: `Bearer ${supabaseKey}`
			} })).json();
			const map = {};
			(rows || []).forEach((r) => {
				map[r.emoji] = (map[r.emoji] || 0) + 1;
			});
			setCounts(map);
		} catch {}
	}, [
		slug,
		supabaseUrl,
		supabaseKey
	]);
	useEffect(() => {
		fetchReactions();
	}, [fetchReactions]);
	return {
		counts,
		myVotes,
		react: useCallback(async (emoji) => {
			if (myVotes[emoji]) return;
			const next = {
				...myVotes,
				[emoji]: true
			};
			setMyVotes(next);
			localStorage.setItem(`reactions:${slug}`, JSON.stringify(next));
			setCounts((c) => ({
				...c,
				[emoji]: (c[emoji] || 0) + 1
			}));
			if (!supabaseUrl || !supabaseKey) return;
			try {
				await fetch(`${supabaseUrl}/rest/v1/reactions`, {
					method: "POST",
					headers: {
						apikey: supabaseKey,
						Authorization: `Bearer ${supabaseKey}`,
						"Content-Type": "application/json",
						Prefer: "return=minimal"
					},
					body: JSON.stringify({
						slug,
						emoji
					})
				});
			} catch {}
		}, [
			slug,
			myVotes,
			supabaseUrl,
			supabaseKey
		])
	};
}
var NARRATION_PROMPT = `You are converting a blog post into a warm, emotionally resonant spoken narration.

Rules:
- Write like an experienced Indian storyteller reading his own journal to a close friend
- Use natural spoken rhythm — short punchy sentences mixed with longer flowing ones
- Add breath pauses with commas and ellipses where a speaker would pause naturally
- Build emotion gradually: start grounded and calm, rise toward the key insight, end with warmth and reflection
- Use "I" and personal language — this feels lived-in, not reported
- No markdown, no bullet points, no headers, no lists
- Plain flowing prose only, max 200 words
- The listener should feel something, not just understand something

Blog content:`;
function useTextToSpeech(content) {
	const [speaking, setSpeaking] = useState(false);
	const [loading, setLoading] = useState(false);
	const [supported, setSupported] = useState(false);
	const audioRef = useRef(null);
	useEffect(() => {
		setSupported(true);
	}, []);
	const stop = useCallback(() => {
		if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.src = "";
			audioRef.current = null;
		}
		window.speechSynthesis?.cancel();
		setSpeaking(false);
		setLoading(false);
	}, []);
	const rewriteForStorytelling = useCallback(async (text) => {
		return (await (await fetch("https://api.anthropic.com/v1/messages", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				model: "claude-sonnet-4-6",
				max_tokens: 1e3,
				messages: [{
					role: "user",
					content: `${NARRATION_PROMPT}\n\n${text.slice(0, 3e3)}`
				}]
			})
		})).json()).content?.[0]?.text?.trim() || text;
	}, []);
	const speakWithElevenLabs = useCallback(async (text) => {
		throw new Error("No ElevenLabs key");
	}, []);
	const speakFallback = useCallback((rawText) => {
		const plain = rawText.replace(/#{1,6}\s+/g, "").replace(/\*\*?([^*]+)\*\*?/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/`[^`]+`/g, "").replace(/^\s*[-*>]\s+/gm, "").slice(0, 4e3);
		const voices = window.speechSynthesis.getVoices();
		const voice = voices.find((v) => v.name.includes("Google UK English Male")) || voices.find((v) => v.name.includes("Daniel")) || voices.find((v) => v.name.includes("Alex")) || voices.find((v) => v.lang === "en-IN") || voices.find((v) => v.lang.startsWith("en-")) || voices[0];
		const utt = new SpeechSynthesisUtterance(plain);
		if (voice) utt.voice = voice;
		utt.rate = .8;
		utt.pitch = .95;
		utt.volume = 1;
		utt.lang = "en-IN";
		utt.onend = () => setSpeaking(false);
		window.speechSynthesis.cancel();
		window.speechSynthesis.speak(utt);
		setSpeaking(true);
	}, []);
	const toggle = useCallback(async () => {
		if (!supported) return;
		if (speaking || loading) {
			stop();
			return;
		}
		setLoading(true);
		try {
			await speakWithElevenLabs(await rewriteForStorytelling(content));
			setLoading(false);
		} catch (err) {
			console.warn("ElevenLabs failed, using browser fallback:", err);
			setLoading(false);
			speakFallback(content);
		}
	}, [
		content,
		speaking,
		loading,
		supported,
		stop,
		rewriteForStorytelling,
		speakWithElevenLabs,
		speakFallback
	]);
	useEffect(() => () => stop(), [stop]);
	return {
		speaking,
		loading,
		supported,
		toggle
	};
}
var Icon = ({ d, size = 18, className = "" }) => /* @__PURE__ */ jsx("svg", {
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 1.8,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	width: size,
	height: size,
	className,
	"aria-hidden": "true",
	children: /* @__PURE__ */ jsx("path", { d })
});
var PinterestIcon = ({ size = 16 }) => /* @__PURE__ */ jsx("svg", {
	viewBox: "0 0 24 24",
	fill: "currentColor",
	width: size,
	height: size,
	"aria-hidden": "true",
	children: /* @__PURE__ */ jsx("path", { d: "M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" })
});
var SunIcon = () => /* @__PURE__ */ jsx(Icon, { d: "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" });
var MoonIcon = () => /* @__PURE__ */ jsx(Icon, { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" });
var ShareIcon = () => /* @__PURE__ */ jsx(Icon, { d: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" });
var CheckIcon = () => /* @__PURE__ */ jsx(Icon, {
	d: "M20 6L9 17l-5-5",
	size: 14
});
var CopyIcon = () => /* @__PURE__ */ jsx(Icon, {
	d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4z",
	size: 14
});
var ArrowLeftIcon = () => /* @__PURE__ */ jsx(Icon, {
	d: "M19 12H5M12 5l-7 7 7 7",
	size: 16
});
var BookmarkIcon = ({ filled }) => filled ? /* @__PURE__ */ jsx("svg", {
	viewBox: "0 0 24 24",
	fill: "currentColor",
	width: 16,
	height: 16,
	"aria-hidden": "true",
	children: /* @__PURE__ */ jsx("path", { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" })
}) : /* @__PURE__ */ jsx(Icon, {
	d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
	size: 16
});
var ProgressBar = ({ progress }) => /* @__PURE__ */ jsx("div", {
	className: "fixed top-[68px] left-0 right-0 h-[3px] z-[99] bg-neutral-200 dark:bg-neutral-800",
	"aria-hidden": "true",
	children: /* @__PURE__ */ jsx("div", {
		className: "h-full bg-gradient-to-r from-red-500 to-pink-500 transition-[width] duration-75 ease-linear",
		style: { width: `${progress}%` }
	})
});
var Navbar = ({ dark, toggleDark, fontSize, incFont, decFont, readingMode, toggleReadingMode, content }) => {
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [copied, setCopied] = useState(false);
	const { speaking, loading, supported, toggle: toggleTTS } = useTextToSpeech(content);
	useEffect(() => {
		const fn = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", fn, { passive: true });
		return () => window.removeEventListener("scroll", fn);
	}, []);
	const shareUrl = async () => {
		if (navigator.share) try {
			await navigator.share({
				title: document.title,
				url: window.location.href
			});
		} catch (_) {}
		else {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2e3);
		}
	};
	return /* @__PURE__ */ jsxs("nav", {
		className: `fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? "shadow-sm" : ""}`,
		style: {
			background: dark ? "rgba(15,14,13,0.92)" : "rgba(250,248,244,0.92)",
			backdropFilter: "blur(20px)",
			borderBottom: scrolled ? `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(26,22,18,0.08)"}` : "1px solid transparent"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			className: "max-w-[1280px] mx-auto px-6 h-[68px] flex items-center justify-between gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "font-['DM_Serif_Display',serif] text-[1.3rem] tracking-tight flex-shrink-0",
					style: { color: dark ? "#FAF8F4" : "#1A1612" },
					children: ["Veeresh", /* @__PURE__ */ jsx("span", {
						className: "text-red-500",
						children: "."
					})]
				}), /* @__PURE__ */ jsx(Link, {
					to: "/blog",
					className: "hidden md:inline-flex items-center gap-1.5 text-[0.75rem] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 hover:opacity-70",
					style: {
						borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)",
						color: dark ? "rgba(250,248,244,0.55)" : "#7A6E64",
						background: "transparent"
					},
					children: "← All Posts"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "hidden md:flex items-center gap-0.5 px-2 py-1 rounded-lg border",
						style: { borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)" },
						children: [
							/* @__PURE__ */ jsx("button", {
								onClick: decFont,
								className: "w-7 h-7 flex items-center justify-center text-[0.68rem] font-bold rounded-md transition-all hover:opacity-60",
								style: { color: dark ? "#FAF8F4" : "#3D3530" },
								"aria-label": "Decrease font size",
								children: "A−"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "w-px h-3 mx-0.5",
								style: { background: dark ? "rgba(255,255,255,0.15)" : "rgba(26,22,18,0.15)" }
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: incFont,
								className: "w-7 h-7 flex items-center justify-center text-[0.82rem] font-bold rounded-md transition-all hover:opacity-60",
								style: { color: dark ? "#FAF8F4" : "#3D3530" },
								"aria-label": "Increase font size",
								children: "A+"
							})
						]
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: toggleDark,
						className: "w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-200 hover:opacity-70",
						style: {
							borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)",
							color: dark ? "#FAF8F4" : "#3D3530"
						},
						"aria-label": dark ? "Switch to light mode" : "Switch to dark mode",
						children: dark ? /* @__PURE__ */ jsx(SunIcon, {}) : /* @__PURE__ */ jsx(MoonIcon, {})
					}),
					supported && /* @__PURE__ */ jsx("button", {
						onClick: toggleTTS,
						className: "hidden md:flex w-9 h-9 items-center justify-center rounded-lg border transition-all duration-200 hover:opacity-70",
						style: {
							borderColor: speaking || loading ? "#E60023" : dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)",
							color: speaking || loading ? "#E60023" : dark ? "#FAF8F4" : "#3D3530",
							background: speaking || loading ? dark ? "rgba(230,0,35,0.1)" : "#FFF5F6" : "transparent",
							animation: speaking ? "ttsPulse 1.5s infinite" : "none"
						},
						"aria-label": loading ? "Preparing story..." : speaking ? "Stop reading" : "Read article aloud (AI storytelling)",
						title: loading ? "Preparing…" : speaking ? "Stop" : "Read aloud",
						children: loading ? /* @__PURE__ */ jsx("span", { style: {
							display: "inline-block",
							width: 14,
							height: 14,
							border: "2px solid #E60023",
							borderTopColor: "transparent",
							borderRadius: "50%",
							animation: "spin 0.7s linear infinite"
						} }) : speaking ? /* @__PURE__ */ jsx("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: 1.8,
							strokeLinecap: "round",
							strokeLinejoin: "round",
							width: 16,
							height: 16,
							children: /* @__PURE__ */ jsx("path", { d: "M6 6h4v12H6zM14 6h4v12h-4z" })
						}) : /* @__PURE__ */ jsx("svg", {
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: 1.8,
							strokeLinecap: "round",
							strokeLinejoin: "round",
							width: 16,
							height: 16,
							children: /* @__PURE__ */ jsx("path", { d: "M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" })
						})
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: toggleReadingMode,
						className: "hidden md:flex items-center gap-1.5 text-[0.75rem] font-semibold px-3 py-2 rounded-lg border transition-all duration-200 hover:opacity-70",
						style: {
							borderColor: readingMode ? "#E60023" : dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)",
							color: readingMode ? "#E60023" : dark ? "#FAF8F4" : "#3D3530",
							background: readingMode ? dark ? "rgba(230,0,35,0.1)" : "#FFF5F6" : "transparent"
						},
						"aria-label": readingMode ? "Exit focus mode" : "Focus mode",
						"aria-pressed": readingMode,
						children: readingMode ? "✕ Exit focus" : "⊡ Focus"
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: shareUrl,
						className: "hidden md:flex items-center gap-1.5 text-[0.78rem] font-semibold px-3.5 py-2 rounded-lg border transition-all duration-200 hover:opacity-70",
						style: {
							borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)",
							color: dark ? "#FAF8F4" : "#3D3530"
						},
						"aria-label": "Share article",
						children: copied ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(CheckIcon, {}), " Copied!"] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(ShareIcon, {}), " Share"] })
					}),
					/* @__PURE__ */ jsxs("a", {
						href: SITE.pinterestUrl,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "hidden sm:inline-flex items-center gap-1.5 text-[0.78rem] font-bold px-4 py-2 rounded-full transition-all duration-300 hover:-translate-y-px hover:opacity-90",
						style: {
							background: "#E60023",
							color: "#fff"
						},
						children: [/* @__PURE__ */ jsx(PinterestIcon, { size: 13 }), " Follow"]
					}),
					/* @__PURE__ */ jsxs("button", {
						className: "lg:hidden flex flex-col gap-1.5 p-2",
						onClick: () => setOpen((o) => !o),
						"aria-label": open ? "Close menu" : "Open menu",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: `block w-5 h-0.5 transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`,
								style: { background: dark ? "#FAF8F4" : "#1A1612" }
							}),
							/* @__PURE__ */ jsx("span", {
								className: `block w-5 h-0.5 transition-all duration-300 ${open ? "opacity-0" : ""}`,
								style: { background: dark ? "#FAF8F4" : "#1A1612" }
							}),
							/* @__PURE__ */ jsx("span", {
								className: `block w-5 h-0.5 transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`,
								style: { background: dark ? "#FAF8F4" : "#1A1612" }
							})
						]
					})
				]
			})]
		}), open && /* @__PURE__ */ jsxs("div", {
			className: "lg:hidden px-6 pb-6 pt-2 flex flex-col gap-4 border-t",
			style: {
				borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(26,22,18,0.08)",
				background: dark ? "#0F0E0D" : "#FAF8F4"
			},
			children: [
				/* @__PURE__ */ jsx(Link, {
					to: "/",
					onClick: () => setOpen(false),
					className: "text-[0.88rem] font-semibold py-1",
					style: { color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" },
					children: "← All Posts"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3 pt-2",
					children: [
						/* @__PURE__ */ jsx("button", {
							onClick: decFont,
							className: "text-xs font-bold px-3 py-1.5 rounded border",
							style: {
								color: dark ? "#FAF8F4" : "#3D3530",
								borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(26,22,18,0.15)"
							},
							children: "A−"
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: incFont,
							className: "text-sm font-bold px-3 py-1.5 rounded border",
							style: {
								color: dark ? "#FAF8F4" : "#3D3530",
								borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(26,22,18,0.15)"
							},
							children: "A+"
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: toggleReadingMode,
							className: "text-xs font-bold px-3 py-1.5 rounded border",
							style: {
								color: readingMode ? "#E60023" : dark ? "#FAF8F4" : "#3D3530",
								borderColor: readingMode ? "#E60023" : dark ? "rgba(255,255,255,0.15)" : "rgba(26,22,18,0.15)"
							},
							children: readingMode ? "Exit Focus" : "Focus"
						})
					]
				}),
				/* @__PURE__ */ jsxs("a", {
					href: SITE.pinterestUrl,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-full w-fit",
					style: {
						background: "#E60023",
						color: "#fff"
					},
					children: [/* @__PURE__ */ jsx(PinterestIcon, { size: 12 }), " Follow on Pinterest"]
				})
			]
		})]
	});
};
var Breadcrumb = ({ category, title, dark }) => /* @__PURE__ */ jsxs("nav", {
	className: "max-w-[1280px] mx-auto px-6 pt-28 pb-0 flex items-center gap-2 text-xs font-medium flex-wrap",
	style: { color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" },
	"aria-label": "Breadcrumb",
	children: [
		/* @__PURE__ */ jsx(Link, {
			to: "/",
			className: "hover:text-red-500 transition-colors",
			children: "Home"
		}),
		/* @__PURE__ */ jsx("span", { children: "›" }),
		/* @__PURE__ */ jsx("a", {
			href: "/#blog",
			className: "hover:text-red-500 transition-colors",
			children: "Blog"
		}),
		category && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "›" }), /* @__PURE__ */ jsx(Link, {
			to: `/category/${category.toLowerCase().replace(/\s+/g, "-")}`,
			className: "hover:text-red-500 transition-colors capitalize",
			children: category
		})] }),
		/* @__PURE__ */ jsx("span", { children: "›" }),
		/* @__PURE__ */ jsx("span", {
			className: "truncate max-w-[180px]",
			style: { color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" },
			children: title
		})
	]
});
var ArticleHeader = ({ fm, readTime, dark, onBookmark, bookmarked, finishTime, streak, views }) => {
	const [copied, setCopied] = useState(false);
	useCallback(async () => {
		if (navigator.share) try {
			await navigator.share({
				title: fm.title,
				url: window.location.href
			});
		} catch (_) {}
		else {
			await navigator.clipboard.writeText(window.location.href);
			setCopied(true);
			setTimeout(() => setCopied(false), 2200);
		}
	}, [fm.title]);
	const initials = (fm.author || SITE.name).split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
	return /* @__PURE__ */ jsxs("header", {
		className: "max-w-[1280px] mx-auto px-6 pt-7",
		style: { animation: "fadeUp 0.65s ease forwards" },
		children: [
			fm.category && /* @__PURE__ */ jsx(Link, {
				to: `/category/${fm.category.toLowerCase().replace(/\s+/g, "-")}`,
				className: "inline-block text-[0.7rem] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full mb-5 cursor-pointer transition-all duration-200",
				style: {
					background: "#E600230F",
					color: "#E60023",
					border: "1px solid #E6002322"
				},
				children: fm.category
			}),
			/* @__PURE__ */ jsx("h1", {
				className: "font-['DM_Serif_Display',serif] leading-[1.06] tracking-[-0.022em] mb-5 max-w-[840px]",
				style: {
					fontSize: "clamp(2.1rem, 4.5vw, 3.1rem)",
					color: dark ? "#FAF8F4" : "#1A1612"
				},
				children: fm.title
			}),
			(fm.excerpt || fm.description) && /* @__PURE__ */ jsx("p", {
				className: "text-[1.1rem] leading-[1.8] mb-7 pb-7 max-w-[840px]",
				style: {
					color: dark ? "rgba(250,248,244,0.5)" : "#7A6E64",
					borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#EAE4DC"}`
				},
				children: fm.excerpt || fm.description
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "w-[90%] flex items-center justify-between flex-wrap gap-4 mb-10",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("div", {
						className: "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
						style: {
							background: "#1A1612",
							color: "#FAF8F4",
							border: `2px solid ${dark ? "rgba(255,255,255,0.12)" : "#EAE4DC"}`
						},
						children: initials
					}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
						className: "text-[0.88rem] font-semibold",
						style: { color: dark ? "#FAF8F4" : "#1A1612" },
						children: fm.author || SITE.name
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 text-[0.73rem] flex-wrap",
						style: { color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" },
						children: [
							fm.date && /* @__PURE__ */ jsx("time", {
								dateTime: fm.date,
								children: formatDate(fm.date)
							}),
							fm.date && readTime && /* @__PURE__ */ jsx("span", { children: "·" }),
							readTime && /* @__PURE__ */ jsxs("span", { children: [readTime, " min read"] }),
							views && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "·" }), /* @__PURE__ */ jsxs("span", { children: [views.toLocaleString(), " views"] })] }),
							finishTime && /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1 text-[0.68rem] font-semibold px-2 py-0.5 rounded-full",
								style: {
									background: dark ? "rgba(255,255,255,0.07)" : "#F0EBE3",
									color: dark ? "rgba(250,248,244,0.5)" : "#7A6E64"
								},
								children: ["⏱ Finish by ", finishTime]
							})
						]
					})] })]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [streak > 1 && /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1.5 text-[0.72rem] font-semibold px-3 py-1.5 rounded-full",
						style: {
							background: dark ? "rgba(255,180,0,0.12)" : "#FFFBEC",
							color: "#B97A00",
							border: "1px solid rgba(245,199,80,0.3)"
						},
						children: [
							"🔥 ",
							streak,
							"-day streak"
						]
					}), /* @__PURE__ */ jsx("button", {
						onClick: onBookmark,
						title: bookmarked ? "Remove bookmark" : "Bookmark",
						className: "w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-200 hover:opacity-60",
						style: {
							borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)",
							color: bookmarked ? "#E60023" : dark ? "rgba(250,248,244,0.5)" : "#7A6E64"
						},
						"aria-label": bookmarked ? "Remove bookmark" : "Bookmark this article",
						children: /* @__PURE__ */ jsx(BookmarkIcon, { filled: bookmarked })
					})]
				})]
			})
		]
	});
};
var HeroImage = ({ src, alt, pinterest }) => {
	if (!src) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "max-w-[1280px] mx-auto px-6 mb-14",
		children: /* @__PURE__ */ jsx("div", {
			className: "rounded-2xl overflow-hidden max-w-[1200px] mx-auto aspect-[16/9]",
			children: /* @__PURE__ */ jsx("img", {
				src,
				alt: alt || "Article hero",
				className: `w-full block ${pinterest ? "h-full object-cover" : "h-auto"}`,
				loading: "eager",
				decoding: "async",
				fetchPriority: "high"
			})
		})
	});
};
var SelectionToolbar = ({ tooltip, onClose, dark, onHighlight }) => {
	const [copied, setCopied] = useState(false);
	const [highlighted, setHighlighted] = useState(false);
	if (!tooltip) return null;
	const copyText = async () => {
		await navigator.clipboard.writeText(tooltip.text);
		setCopied(true);
		setTimeout(() => {
			setCopied(false);
			onClose();
		}, 1500);
	};
	const highlight = () => {
		if (onHighlight) onHighlight(tooltip.text);
		setHighlighted(true);
		setTimeout(() => {
			setHighlighted(false);
			onClose();
		}, 1e3);
	};
	return /* @__PURE__ */ jsxs("div", {
		"data-selection-toolbar": true,
		className: "fixed z-[200] flex items-center gap-1 px-2 py-1.5 rounded-xl shadow-2xl",
		style: {
			top: tooltip.y,
			left: Math.max(8, tooltip.x - 80),
			background: "#1A1612",
			border: "1px solid rgba(255,255,255,0.12)",
			transform: "translateX(-50%)"
		},
		children: [
			/* @__PURE__ */ jsx("button", {
				onClick: copyText,
				className: "flex items-center gap-1.5 text-[0.72rem] font-semibold px-2.5 py-1.5 rounded-lg transition-all hover:bg-white/10",
				style: { color: copied ? "#4CAF50" : "#FAF8F4" },
				children: copied ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(CheckIcon, {}), " Copied"] }) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(CopyIcon, {}), " Copy"] })
			}),
			/* @__PURE__ */ jsx("div", { className: "w-px h-4 bg-white/15" }),
			/* @__PURE__ */ jsx("button", {
				onClick: highlight,
				className: "flex items-center gap-1.5 text-[0.72rem] font-semibold px-2.5 py-1.5 rounded-lg transition-all hover:bg-white/10",
				style: { color: highlighted ? "#FFD700" : "#FAF8F4" },
				children: highlighted ? "✓ Saved" : "🖊 Highlight"
			})
		]
	});
};
var SmartTOC = ({ tocItems, activeId, sectionProgress, overallProgress, dark }) => {
	const scrollTo = useCallback((id) => {
		const el = document.getElementById(id);
		if (!el) return;
		window.scrollTo({
			top: el.getBoundingClientRect().top + window.scrollY - 96,
			behavior: "smooth"
		});
	}, []);
	const listRef = useRef(null);
	const done = tocItems.filter((t) => (sectionProgress[t.id] || 0) >= 95).length;
	useEffect(() => {
		if (!activeId || !listRef.current) return;
		const activeElement = listRef.current.querySelector(`[data-id="${activeId}"]`);
		if (!activeElement) return;
		activeElement.scrollIntoView({
			behavior: "smooth",
			block: "nearest"
		});
	}, [activeId]);
	if (!tocItems.length) return /* @__PURE__ */ jsx("p", {
		className: "text-sm",
		style: { color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" },
		children: "No sections found."
	});
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3 mb-5 pb-4",
			style: { borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#EAE4DC"}` },
			children: [/* @__PURE__ */ jsxs("div", {
				className: "relative w-10 h-10 flex-shrink-0",
				children: [/* @__PURE__ */ jsxs("svg", {
					viewBox: "0 0 40 40",
					className: "w-10 h-10 -rotate-90",
					children: [/* @__PURE__ */ jsx("circle", {
						cx: "20",
						cy: "20",
						r: "16",
						fill: "none",
						stroke: dark ? "rgba(255,255,255,0.08)" : "#EAE4DC",
						strokeWidth: "3.5"
					}), /* @__PURE__ */ jsx("circle", {
						cx: "20",
						cy: "20",
						r: "16",
						fill: "none",
						stroke: "#E60023",
						strokeWidth: "3.5",
						strokeDasharray: `${2 * Math.PI * 16}`,
						strokeDashoffset: `${2 * Math.PI * 16 * (1 - overallProgress / 100)}`,
						strokeLinecap: "round",
						style: { transition: "stroke-dashoffset 0.3s" }
					})]
				}), /* @__PURE__ */ jsxs("span", {
					className: "absolute inset-0 flex items-center justify-center text-[0.5rem] font-bold",
					style: { color: dark ? "#FAF8F4" : "#1A1612" },
					children: [Math.round(overallProgress), "%"]
				})]
			}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
				className: "text-[0.75rem] font-bold",
				style: { color: dark ? "#FAF8F4" : "#1A1612" },
				children: "Reading progress"
			}), /* @__PURE__ */ jsxs("div", {
				className: "text-[0.68rem]",
				style: { color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" },
				children: [
					done,
					"/",
					tocItems.length,
					" sections done"
				]
			})] })]
		}),
		/* @__PURE__ */ jsx("ul", {
			className: "space-y-0.5 list-none",
			ref: listRef,
			role: "navigation",
			"aria-label": "Article sections",
			children: tocItems.map((item, idx) => {
				const isActive = activeId === item.id;
				const pct = Math.round(sectionProgress[item.id] || 0);
				const isDone = pct >= 95;
				return /* @__PURE__ */ jsx("li", {
					"data-id": item.id,
					children: /* @__PURE__ */ jsxs("button", {
						onClick: () => scrollTo(item.id),
						className: "w-full text-left flex items-start gap-2.5 rounded-xl px-3 py-2.5 transition-all duration-200 group relative",
						style: {
							background: isActive ? dark ? "rgba(255,255,255,0.05)" : "#F4EFE6" : "transparent",
							border: isActive ? `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#E4DDD4"}` : "1px solid transparent"
						},
						"aria-current": isActive ? "true" : void 0,
						children: [
							isActive && /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full bg-red-500" }),
							/* @__PURE__ */ jsx("div", {
								className: "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[0.6rem] font-bold transition-all duration-200",
								style: {
									background: isDone ? "#22543D" : isActive ? "#E60023" : dark ? "rgba(255,255,255,0.08)" : "#EDEAE4",
									color: isDone ? "#fff" : isActive ? "#fff" : dark ? "rgba(250,248,244,0.5)" : "#7A6E64"
								},
								children: isDone ? "✓" : idx + 1
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-[0.8rem] font-medium leading-snug transition-colors duration-200",
									style: { color: isActive ? dark ? "#FAF8F4" : "#1A1612" : isDone ? dark ? " rgba(250,248,244,0.6)" : "#AAA09A" : dark ? "rgba(250,248,244,0.6)" : "#5A5046" },
									children: item.label
								}), pct > 0 && /* @__PURE__ */ jsx("div", {
									className: "mt-1.5 h-[2px] rounded-full overflow-hidden",
									style: { background: dark ? "rgba(255,255,255,0.07)" : "#EAE4DC" },
									children: /* @__PURE__ */ jsx("div", {
										className: "h-full rounded-full transition-[width] duration-300",
										style: {
											width: `${pct}%`,
											background: isDone ? "#22543D" : "linear-gradient(90deg,#E60023,#FF6B81)"
										}
									})
								})]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-[0.62rem] font-bold flex-shrink-0 mt-0.5",
								style: { color: isDone ? "#22543D" : isActive ? "#E60023" : dark ? "rgba(250,248,244,0.3)" : "#AAA09A" },
								children: isDone ? "Done" : pct > 0 ? `${pct}%` : ""
							})
						]
					})
				}, item.id);
			})
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mt-4 pt-4 flex items-center justify-between text-[0.68rem]",
			style: {
				borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#EAE4DC"}`,
				color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84"
			},
			children: [/* @__PURE__ */ jsxs("span", { children: [tocItems.length, " sections"] }), done === tocItems.length ? /* @__PURE__ */ jsx("span", {
				style: {
					color: "#22543D",
					fontWeight: 700
				},
				children: "✓ Fully read!"
			}) : /* @__PURE__ */ jsxs("span", { children: [
				"~",
				Math.max(1, Math.round(8 * (1 - overallProgress / 100))),
				" min left"
			] })]
		})
	] });
};
var SidebarCard = ({ header, children, dark, delay = 0 }) => {
	return /* @__PURE__ */ jsxs("div", {
		ref: useFadeIn(delay),
		className: "rounded-2xl overflow-hidden mb-4",
		style: {
			background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
			border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#EAE4DC"}`
		},
		children: [/* @__PURE__ */ jsx("div", {
			className: "px-5 py-3 text-[0.65rem] font-bold tracking-[0.13em] uppercase",
			style: {
				color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84",
				borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#EAE4DC"}`
			},
			children: header
		}), /* @__PURE__ */ jsx("div", {
			className: "p-5",
			children
		})]
	});
};
var AuthorCard = ({ author, dark }) => {
	const name = author || SITE.name;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("div", {
			className: "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold font-['DM_Serif_Display',serif] mb-3",
			style: {
				background: "#1A1612",
				color: "#FAF8F4"
			},
			children: name[0]?.toUpperCase()
		}),
		/* @__PURE__ */ jsx("div", {
			className: "font-['DM_Serif_Display',serif] text-[1rem] mb-1",
			style: { color: dark ? "#FAF8F4" : "#1A1612" },
			children: name
		}),
		/* @__PURE__ */ jsx("p", {
			className: "text-[0.8rem] leading-relaxed mb-4",
			style: { color: dark ? "rgba(250,248,244,0.655)" : "#7A6E64" },
			children: "Writer and curator based in Hubballi, India. Writing about small things that make life better."
		}),
		/* @__PURE__ */ jsx("div", {
			className: "flex gap-2 flex-wrap",
			children: [{
				href: SITE.pinterestUrl,
				label: "Pinterest",
				external: true,
				icon: /* @__PURE__ */ jsx(PinterestIcon, { size: 11 })
			}, {
				href: `mailto:${SITE.email}`,
				label: "Email",
				external: false,
				icon: /* @__PURE__ */ jsx(Icon, {
					d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
					size: 11
				})
			}].map((l) => /* @__PURE__ */ jsxs("a", {
				href: l.href,
				target: l.external ? "_blank" : void 0,
				rel: l.external ? "noopener noreferrer" : void 0,
				className: "inline-flex items-center gap-1.5 text-[0.73rem] font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 hover:opacity-70",
				style: {
					color: dark ? "rgba(250,248,244,0.7)" : "#3D3530",
					borderColor: dark ? "rgba(255,255,255,0.1)" : "#DDD7CE",
					background: dark ? "rgba(255,255,255,0.04)" : "#F5F1EB"
				},
				children: [l.icon, l.label]
			}, l.label))
		})
	] });
};
var MorePostItem = ({ post, dark, isLast }) => /* @__PURE__ */ jsxs(Link, {
	to: `/blog/${post.slug}`,
	className: "flex gap-3 items-start py-3 transition-opacity hover:opacity-70",
	style: { borderBottom: isLast ? "none" : `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#EAE4DC"}` },
	children: [/* @__PURE__ */ jsx("div", {
		className: "w-12 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0",
		style: {
			background: dark ? "rgba(255,255,255,0.06)" : "#F5F1EB",
			border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#E5DFDA"}`
		},
		children: post.emoji
	}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: "text-[0.65rem] font-bold uppercase tracking-[0.07em] mb-0.5",
		style: { color: "#E60023" },
		children: post.tag
	}), /* @__PURE__ */ jsx("div", {
		className: "text-[0.78rem] font-semibold leading-snug",
		style: { color: dark ? "rgba(250,248,244,0.75)" : "#1A1612" },
		children: post.title
	})] })]
});
var ArticleTags = ({ tags, dark }) => {
	const normalized = normalizeTags(tags);
	if (!normalized.length) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-12 pt-8 flex items-center gap-2.5 flex-wrap",
		style: { borderTop: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#EAE4DC"}` },
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-[0.72rem] font-bold uppercase tracking-[0.07em]",
			style: { color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" },
			children: "Tags:"
		}), normalized.map((tag) => /* @__PURE__ */ jsx("span", {
			to: `/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`,
			className: "inline-block text-[0.73rem] font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 hover:opacity-70",
			style: {
				background: dark ? "rgba(255,255,255,0.05)" : "#F5F1EB",
				color: dark ? "rgba(250,248,244,0.7)" : "#3D3530",
				borderColor: dark ? "rgba(255,255,255,0.09)" : "#DDD7CE"
			},
			children: tag
		}, tag))]
	});
};
var KeyTakeawaysBox = ({ takeaways, dark }) => {
	if (!takeaways?.length) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl p-6 mb-8",
		style: {
			background: dark ? "rgba(230,0,35,0.06)" : "#FFF5F6",
			border: "1.5px solid rgba(230,0,35,0.2)"
		},
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 mb-4",
			children: [/* @__PURE__ */ jsx("span", {
				style: { fontSize: "1.1rem" },
				children: "🎯"
			}), /* @__PURE__ */ jsx("span", {
				className: "font-['DM_Serif_Display',serif] text-[1.05rem]",
				style: { color: dark ? "#FAF8F4" : "#1A1612" },
				children: "Key Takeaways"
			})]
		}), /* @__PURE__ */ jsx("ul", {
			className: "space-y-2.5 list-none m-0 p-0",
			children: takeaways.map((t, i) => {
				const text = typeof t === "string" ? t : typeof t === "object" && t !== null ? Object.values(t).join(": ") : String(t);
				return /* @__PURE__ */ jsxs("li", {
					className: "flex items-start gap-3 text-[0.87rem] leading-relaxed",
					style: { color: dark ? "rgba(250,248,244,0.78)" : "#3D3530" },
					children: [/* @__PURE__ */ jsx("span", {
						className: "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold mt-0.5",
						style: {
							background: "#E60023",
							color: "#fff"
						},
						children: i + 1
					}), text]
				}, i);
			})
		})]
	});
};
var ReactionBar = ({ slug, dark, border, supabaseUrl, supabaseKey }) => {
	const { counts, myVotes, react } = useReactions(slug, supabaseUrl, supabaseKey);
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-10 pt-8 flex flex-col gap-3",
		style: { borderTop: `1px solid ${border}` },
		children: [/* @__PURE__ */ jsx("p", {
			className: "text-[0.72rem] font-bold uppercase tracking-[0.07em]",
			style: { color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" },
			children: "Did you find this helpful?"
		}), /* @__PURE__ */ jsx("div", {
			className: "flex items-center gap-2 flex-wrap",
			children: REACTIONS.map((emoji) => /* @__PURE__ */ jsxs("button", {
				onClick: () => react(emoji),
				className: "flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm transition-all duration-200 hover:-translate-y-px",
				style: {
					background: myVotes[emoji] ? dark ? "rgba(230,0,35,0.15)" : "#FFF0F1" : dark ? "rgba(255,255,255,0.04)" : "#F5F1EB",
					borderColor: myVotes[emoji] ? "rgba(230,0,35,0.35)" : dark ? "rgba(255,255,255,0.09)" : "#DDD7CE",
					transform: myVotes[emoji] ? "scale(1.05)" : "scale(1)"
				},
				title: REACTION_LABELS[emoji],
				"aria-label": `React with ${REACTION_LABELS[emoji]}`,
				"aria-pressed": !!myVotes[emoji],
				children: [/* @__PURE__ */ jsx("span", { children: emoji }), (counts[emoji] || 0) > 0 && /* @__PURE__ */ jsx("span", {
					className: "text-[0.72rem] font-semibold",
					style: { color: dark ? "rgba(250,248,244,0.55)" : "#7A6E64" },
					children: counts[emoji]
				})]
			}, emoji))
		})]
	});
};
var FAQSection = ({ faqs, dark, border }) => {
	const [open, setOpen] = useState(null);
	if (!faqs?.length) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-12 pt-8",
		style: { borderTop: `1px solid ${border}` },
		children: [
			/* @__PURE__ */ jsx("p", {
				className: "text-[0.72rem] font-bold tracking-[0.12em] uppercase mb-2",
				style: { color: "#E60023" },
				children: "FAQ"
			}),
			/* @__PURE__ */ jsx("h2", {
				className: "font-['DM_Serif_Display',serif] text-[1.6rem] mb-6",
				style: { color: dark ? "#FAF8F4" : "#1A1612" },
				children: "Frequently Asked Questions"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "space-y-2",
				itemScope: true,
				itemType: "https://schema.org/FAQPage",
				children: faqs.map((faq, i) => /* @__PURE__ */ jsxs("div", {
					className: "rounded-xl overflow-hidden",
					itemScope: true,
					itemProp: "mainEntity",
					itemType: "https://schema.org/Question",
					style: { border: `1px solid ${border}` },
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: () => setOpen(open === i ? null : i),
						className: "w-full flex items-center justify-between px-5 py-4 text-left transition-colors",
						style: { background: open === i ? dark ? "rgba(255,255,255,0.04)" : "#F9F6F1" : "transparent" },
						"aria-expanded": open === i,
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[0.88rem] font-semibold pr-4",
							itemProp: "name",
							style: { color: dark ? "#FAF8F4" : "#1A1612" },
							children: faq.q
						}), /* @__PURE__ */ jsx("span", {
							className: "flex-shrink-0 text-lg transition-transform duration-200",
							style: {
								transform: open === i ? "rotate(45deg)" : "none",
								color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84"
							},
							children: "+"
						})]
					}), open === i && /* @__PURE__ */ jsx("div", {
						className: "px-5 pb-5 text-[0.85rem] leading-relaxed",
						itemScope: true,
						itemProp: "acceptedAnswer",
						itemType: "https://schema.org/Answer",
						style: { color: dark ? "rgba(250,248,244,0.65)" : "#5A5046" },
						children: /* @__PURE__ */ jsx("span", {
							itemProp: "text",
							children: faq.a
						})
					})]
				}, i))
			})
		]
	});
};
var AISummaryCard = ({ content, dark, border }) => {
	const [state, setState] = useState("idle");
	const [summary, setSummary] = useState("");
	const generate = async () => {
		if (state === "loading" || !content) return;
		setState("loading");
		try {
			setSummary((await (await fetch("https://api.groq.com/openai/v1/chat/completions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer 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`
				},
				body: JSON.stringify({
					model: "llama-3.1-8b-instant",
					max_tokens: 300,
					messages: [{
						role: "user",
						content: `Summarize this article in exactly 3 concise bullet points. Each bullet should be one sentence capturing a key insight. Return ONLY 3 bullets using "•" as the bullet character. No preamble, no headers.\n\n${content.slice(0, 6e3)}`
					}]
				})
			})).json()).choices?.[0]?.message?.content || "");
			setState("done");
		} catch {
			setState("error");
		}
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl overflow-hidden mb-4",
		style: {
			background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
			border: `1px solid ${border}`
		},
		children: [/* @__PURE__ */ jsxs("div", {
			className: "px-5 py-3 flex items-center justify-between",
			style: { borderBottom: `1px solid ${border}` },
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "text-[0.65rem] font-bold tracking-[0.13em] uppercase",
					style: { color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" },
					children: "✦ AI Summary"
				}),
				state === "idle" && /* @__PURE__ */ jsx("button", {
					onClick: generate,
					className: "text-[0.68rem] font-bold px-2.5 py-1 rounded-full transition-all hover:opacity-80",
					style: {
						background: "#E60023",
						color: "#fff"
					},
					children: "Generate"
				}),
				state === "done" && /* @__PURE__ */ jsx("button", {
					onClick: () => {
						setState("idle");
						setSummary("");
					},
					className: "text-[0.68rem] opacity-50 hover:opacity-100 transition-opacity",
					style: { color: dark ? "#FAF8F4" : "#1A1612" },
					children: "Dismiss"
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-5",
			children: [
				state === "idle" && /* @__PURE__ */ jsx("p", {
					className: "text-[0.8rem] leading-relaxed",
					style: { color: dark ? "rgba(250,248,244,0.655)" : "#7A6E64" },
					children: "Get a 3-bullet AI summary of this article."
				}),
				state === "loading" && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 text-[0.8rem]",
					style: { color: dark ? "rgba(250,248,244,0.655)" : "#7A6E64" },
					children: [/* @__PURE__ */ jsx("span", {
						className: "inline-block w-3.5 h-3.5 border-2 rounded-full border-t-transparent animate-spin",
						style: {
							borderColor: "#E60023",
							borderTopColor: "transparent"
						}
					}), "Summarizing…"]
				}),
				state === "done" && /* @__PURE__ */ jsx("div", {
					className: "space-y-2.5",
					children: summary.split("\n").filter((l) => l.trim()).map((line, i) => /* @__PURE__ */ jsx("p", {
						className: "text-[0.82rem] leading-relaxed",
						style: { color: dark ? "rgba(250,248,244,0.75)" : "#3D3530" },
						children: line
					}, i))
				}),
				state === "error" && /* @__PURE__ */ jsxs("p", {
					className: "text-[0.8rem]",
					style: { color: "#E60023" },
					children: [
						"Failed to generate.",
						" ",
						/* @__PURE__ */ jsx("button", {
							onClick: generate,
							className: "underline",
							children: "Retry"
						})
					]
				})
			]
		})]
	});
};
var HighlightsPanel = ({ slug, dark, border }) => {
	const { highlights, remove } = useHighlights(slug);
	if (!highlights.length) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl overflow-hidden mb-4",
		style: {
			background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
			border: `1px solid ${border}`
		},
		children: [/* @__PURE__ */ jsx("div", {
			className: "px-5 py-3",
			style: { borderBottom: `1px solid ${border}` },
			children: /* @__PURE__ */ jsxs("span", {
				className: "text-[0.65rem] font-bold tracking-[0.13em] uppercase",
				style: { color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" },
				children: [
					"✎ Your Highlights (",
					highlights.length,
					")"
				]
			})
		}), /* @__PURE__ */ jsx("div", {
			className: "p-4 space-y-3",
			children: highlights.map((h) => /* @__PURE__ */ jsxs("div", {
				className: "group flex items-start gap-2",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "w-0.5 rounded-full flex-shrink-0 mt-1 self-stretch",
						style: {
							background: "#E60023",
							minHeight: "1.2rem"
						}
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "text-[0.78rem] leading-relaxed flex-1 italic",
						style: { color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" },
						children: [
							"\"",
							h.text.slice(0, 120),
							h.text.length > 120 ? "…" : "",
							"\""
						]
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => remove(h.id),
						className: "opacity-0 group-hover:opacity-60 hover:!opacity-100 text-xs transition-opacity flex-shrink-0 mt-0.5",
						style: { color: dark ? "#FAF8F4" : "#1A1612" },
						"aria-label": "Remove highlight",
						children: "✕"
					})
				]
			}, h.id))
		})]
	});
};
var RelatedCard = ({ post, delay, dark }) => {
	return /* @__PURE__ */ jsxs(Link, {
		ref: useFadeIn(delay),
		to: `/blog/${post.slug}`,
		className: "rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1",
		style: {
			background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
			border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#EAE4DC"}`
		},
		children: [/* @__PURE__ */ jsx("div", {
			className: "overflow-hidden bg-neutral-100 dark:bg-neutral-900",
			style: { aspectRatio: "16/9" },
			children: /* @__PURE__ */ jsx("img", {
				src: post.image || "/fallback.jpg",
				alt: post.title,
				loading: "lazy",
				onError: (e) => {
					e.currentTarget.src = "/fallback.jpg";
				},
				decoding: "async",
				fetchPriority: "low",
				className: "w-full h-full object-cover transition-transform duration-500 hover:scale-105"
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-5 flex-1 flex flex-col",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "text-[0.65rem] font-bold uppercase tracking-[0.09em] mb-2",
					style: { color: "#E60023" },
					children: post.tag
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "font-['DM_Serif_Display',serif] text-[1.0rem] leading-snug flex-1 mb-3",
					style: { color: dark ? "#FAF8F4" : "#1A1612" },
					children: post.title
				}),
				/* @__PURE__ */ jsx("div", {
					className: "text-[0.72rem] font-medium",
					style: { color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" },
					children: post.meta
				})
			]
		})]
	});
};
var ScrollToTop = ({ show, dark }) => /* @__PURE__ */ jsx("button", {
	onClick: () => window.scrollTo({
		top: 0,
		behavior: "smooth"
	}),
	className: "fixed bottom-8 right-8 w-11 h-11 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110",
	style: {
		background: "#1A1612",
		color: "#FAF8F4",
		opacity: show ? 1 : 0,
		pointerEvents: show ? "auto" : "none",
		transform: show ? "translateY(0)" : "translateY(12px)"
	},
	"aria-label": "Scroll to top",
	children: /* @__PURE__ */ jsx(Icon, { d: "M18 15l-6-6-6 6" })
});
var LoadingSkeleton = ({ dark }) => /* @__PURE__ */ jsx("div", {
	className: "min-h-screen pt-28",
	style: { background: dark ? "#0F0E0D" : "#FAF8F4" },
	children: /* @__PURE__ */ jsxs("div", {
		className: "max-w-[760px] mx-auto px-6 space-y-4 animate-pulse",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "h-3 rounded-full w-32",
				style: { background: dark ? "rgba(255,255,255,0.07)" : "#EAE4DC" }
			}),
			/* @__PURE__ */ jsx("div", {
				className: "h-10 rounded-xl w-3/4",
				style: { background: dark ? "rgba(255,255,255,0.07)" : "#EAE4DC" }
			}),
			/* @__PURE__ */ jsx("div", {
				className: "h-10 rounded-xl w-1/2",
				style: { background: dark ? "rgba(255,255,255,0.07)" : "#EAE4DC" }
			}),
			/* @__PURE__ */ jsx("div", {
				className: "h-3 rounded-full w-full mt-6",
				style: { background: dark ? "rgba(255,255,255,0.05)" : "#EAE4DC" }
			}),
			/* @__PURE__ */ jsx("div", {
				className: "h-3 rounded-full w-5/6",
				style: { background: dark ? "rgba(255,255,255,0.05)" : "#EAE4DC" }
			}),
			/* @__PURE__ */ jsx("div", {
				className: "h-56 rounded-2xl w-full mt-8",
				style: { background: dark ? "rgba(255,255,255,0.05)" : "#EAE4DC" }
			})
		]
	})
});
var ErrorState = ({ slug, dark }) => /* @__PURE__ */ jsxs("div", {
	className: "min-h-screen flex flex-col items-center justify-center gap-6 px-8 text-center",
	style: { background: dark ? "#0F0E0D" : "#FAF8F4" },
	children: [
		/* @__PURE__ */ jsx("div", {
			className: "text-6xl",
			children: "📄"
		}),
		/* @__PURE__ */ jsx("h1", {
			className: "font-['DM_Serif_Display',serif] text-3xl",
			style: { color: dark ? "#FAF8F4" : "#1A1612" },
			children: "Post not found"
		}),
		/* @__PURE__ */ jsxs("p", {
			className: "text-[0.88rem] max-w-sm",
			style: { color: dark ? "rgba(250,248,244,0.5)" : "#7A6E64" },
			children: [
				"Could not load ",
				/* @__PURE__ */ jsxs("code", {
					className: "px-2 py-0.5 rounded text-sm",
					style: { background: dark ? "rgba(255,255,255,0.07)" : "#F0EBE3" },
					children: [
						"/blogs/",
						slug,
						".md"
					]
				}),
				"."
			]
		}),
		/* @__PURE__ */ jsxs("button", {
			onClick: () => window.location.href = "/",
			className: "inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full transition-all hover:opacity-80",
			style: {
				background: "#1A1612",
				color: "#FAF8F4"
			},
			children: [/* @__PURE__ */ jsx(ArrowLeftIcon, {}), " Back to Blog"]
		})
	]
});
var SmartLink = ({ href = "", children }) => {
	const isInternal = href.startsWith("/") || href.startsWith("#");
	if (!isAffiliateLink(href)) return /* @__PURE__ */ jsx("a", {
		href,
		target: isInternal ? void 0 : "_blank",
		rel: isInternal ? void 0 : "noopener noreferrer",
		children
	});
	const p = getPlatform(href);
	return /* @__PURE__ */ jsxs("a", {
		href,
		target: "_blank",
		rel: "sponsored noopener noreferrer",
		className: "affiliate-chip",
		style: {
			display: "inline-flex",
			alignItems: "center",
			gap: "5px",
			padding: "2px 10px 2px 7px",
			margin: "0 2px",
			borderRadius: "999px",
			background: p.bg,
			color: p.color,
			fontWeight: 700,
			fontSize: "0.86em",
			textDecoration: "none",
			border: `1px solid ${p.color}33`,
			whiteSpace: "nowrap",
			verticalAlign: "middle"
		},
		children: [
			/* @__PURE__ */ jsx("span", {
				"aria-hidden": "true",
				children: p.icon
			}),
			children,
			/* @__PURE__ */ jsx("span", {
				"aria-hidden": "true",
				style: { fontSize: "0.8em" },
				children: "↗"
			})
		]
	});
};
var ProductCard = ({ product, dark }) => {
	const platform = getPlatform(product.link);
	const icon = product.icon || platform.icon;
	return /* @__PURE__ */ jsxs("a", {
		href: product.link || "#",
		target: "_blank",
		rel: "sponsored noopener noreferrer",
		className: "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
		style: {
			background: dark ? "rgba(255,255,255,0.04)" : "#FFFFFF",
			borderColor: dark ? "rgba(255,255,255,0.08)" : "#EAE4DC"
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0",
				style: { background: dark ? "rgba(255,255,255,0.07)" : "#F5F1EB" },
				children: icon
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ jsx("div", {
					className: "text-[0.88rem] font-semibold leading-snug mb-0.5 truncate",
					style: { color: dark ? "#FAF8F4" : "#1A1612" },
					children: product.name
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 flex-wrap",
					children: [
						product.rating && /* @__PURE__ */ jsxs("span", {
							className: "text-[0.72rem] font-bold text-amber-500",
							children: ["★ ", product.rating]
						}),
						product.price && /* @__PURE__ */ jsx("span", {
							className: "text-[0.75rem] font-semibold",
							style: { color: "#E60023" },
							children: product.price
						}),
						platform.key !== "default" && /* @__PURE__ */ jsx("span", {
							className: "text-[0.6rem] font-bold px-1.5 py-0.5 rounded",
							style: {
								background: platform.color,
								color: "#fff"
							},
							children: platform.label
						})
					]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex-shrink-0 text-[0.72rem] font-bold px-3 py-1.5 rounded-full",
				style: {
					background: "#E60023",
					color: "#fff"
				},
				children: "Buy →"
			})
		]
	});
};
var AffiliateLinksSidebar = ({ content, dark, border, fallbackIcon }) => {
	const links = useMemo(() => {
		const regex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
		const found = [];
		let match;
		while ((match = regex.exec(content)) !== null) {
			const href = match[2];
			if (isAffiliateLink(href)) {
				const platform = getPlatform(href);
				found.push({
					label: match[1],
					href,
					platform
				});
			}
		}
		return found.filter((v, i, a) => a.findIndex((x) => x.href === v.href) === i).slice(0, 8);
	}, [content]);
	if (!links.length) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "rounded-2xl overflow-hidden mb-4",
		style: {
			background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
			border: `1px solid ${border}`
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "px-5 py-3 text-[0.65rem] font-bold tracking-[0.13em] uppercase",
				style: {
					color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84",
					borderBottom: `1px solid ${border}`
				},
				children: "🛒 Links in this post"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "p-4 flex flex-col gap-2.5",
				children: links.map((item, i) => {
					const p = item.platform;
					return /* @__PURE__ */ jsxs("a", {
						href: item.href,
						target: "_blank",
						rel: "sponsored noopener noreferrer",
						className: "flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm",
						style: {
							background: p.bg,
							borderColor: `${p.color}33`,
							textDecoration: "none"
						},
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-base flex-shrink-0",
								children: p.icon
							}),
							/* @__PURE__ */ jsx("span", {
								className: "flex-1 text-[0.78rem] font-semibold leading-snug truncate",
								style: { color: p.color },
								children: item.label
							}),
							/* @__PURE__ */ jsxs("span", {
								className: "flex-shrink-0 text-[0.65rem] font-bold px-2 py-0.5 rounded-full",
								style: {
									background: p.color,
									color: "#fff"
								},
								children: [p.label, " ↗"]
							})
						]
					}, i);
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "px-5 pb-4 text-[0.65rem] leading-relaxed",
				style: { color: dark ? "rgba(250,248,244,0.3)" : "#9C8E84" },
				children: "🔗 Affiliate links — same price for you, small commission for me."
			})
		]
	});
};
var PinterestPostLayout = ({ fm, content, dark, fontSize, border, layoutRef, tocItems, activeId, sectionProgress, progress }) => /* @__PURE__ */ jsxs("div", {
	ref: layoutRef,
	className: "max-w-[1280px] mx-auto px-6 pb-24 flex flex-col lg:flex-row gap-16 items-start justify-between relative",
	children: [/* @__PURE__ */ jsx("main", {
		id: "main-content",
		className: "w-full lg:max-w-[calc(100%-446px)] min-w-0 flex-1",
		children: /* @__PURE__ */ jsxs("article", {
			className: "prose w-full",
			itemScope: true,
			itemType: "https://schema.org/BlogPosting",
			children: [
				/* @__PURE__ */ jsx("meta", {
					itemProp: "headline",
					content: fm.title
				}),
				/* @__PURE__ */ jsx("meta", {
					itemProp: "datePublished",
					content: fm.date
				}),
				/* @__PURE__ */ jsx("meta", {
					itemProp: "author",
					content: fm.author || SITE.name
				}),
				(() => {
					const paragraphs = content.split("\n\n");
					const mid = Math.floor(paragraphs.length / 2);
					const firstHalf = paragraphs.slice(0, mid).join("\n\n");
					const secondHalf = paragraphs.slice(mid).join("\n\n");
					const mdComponents = {
						h2: ({ children, ...props }) => {
							return /* @__PURE__ */ jsx("h2", {
								id: slugToId(String(children).replace(/\s+/g, " ").trim()),
								...props,
								children
							});
						},
						h3: ({ children, ...props }) => {
							return /* @__PURE__ */ jsx("h3", {
								id: slugToId(String(children).replace(/\s+/g, " ").trim()),
								...props,
								children
							});
						},
						a: ({ href, children }) => /* @__PURE__ */ jsx(SmartLink, {
							href,
							children
						}),
						p: ({ children }) => {
							const flatten = (node) => {
								if (node === null || node === void 0) return "";
								if (typeof node === "string") return node;
								if (typeof node === "number") return String(node);
								if (Array.isArray(node)) return node.map(flatten).join("");
								if (node?.props?.children !== void 0) return flatten(node.props.children);
								return "";
							};
							const youtubeMatch = flatten(children).trim().match(/^::youtube\[([a-zA-Z0-9_-]{11})\](?:\{caption="([^"]*)"\})?$/);
							if (youtubeMatch) return /* @__PURE__ */ jsx(YouTubeEmbed, {
								id: youtubeMatch[1],
								caption: youtubeMatch[2] || ""
							});
							return /* @__PURE__ */ jsx("p", { children });
						}
					};
					return /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx(ReactMarkdown, {
							components: mdComponents,
							children: firstHalf
						}),
						/* @__PURE__ */ jsx(InArticleAd, {}),
						/* @__PURE__ */ jsx(ReactMarkdown, {
							components: mdComponents,
							children: secondHalf
						})
					] });
				})(),
				/* @__PURE__ */ jsx(ArticleTags, {
					tags: fm.tags,
					dark
				})
			]
		})
	}), /* @__PURE__ */ jsxs("aside", {
		className: "w-full lg:w-[380px] lg:shrink-0 z-20 self-start lg:sticky lg:top-[96px] flex flex-col gap-4",
		"aria-label": "Article actions panel",
		children: [
			fm.pinterest && /* @__PURE__ */ jsxs("a", {
				href: fm.pinterest,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90 shadow-sm",
				style: {
					background: "#E60023",
					color: "#fff"
				},
				children: [/* @__PURE__ */ jsx(PinterestIcon, { size: 18 }), " View on Pinterest"]
			}),
			/* @__PURE__ */ jsx(SidebarCard, {
				header: "In This Post",
				dark,
				delay: 0,
				children: /* @__PURE__ */ jsx(SmartTOC, {
					tocItems,
					activeId,
					sectionProgress,
					overallProgress: progress,
					dark
				})
			}),
			/* @__PURE__ */ jsx(AffiliateLinksSidebar, {
				content,
				dark,
				border,
				fallbackIcon: fm.emoji
			}),
			/* @__PURE__ */ jsx(CarbonAdUnit, {
				slot: "3170555405",
				style: { minHeight: "250px" }
			}),
			Array.isArray(fm.products) && fm.products.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "rounded-2xl overflow-hidden",
				style: {
					background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
					border: `1px solid ${border}`
				},
				children: [/* @__PURE__ */ jsx("div", {
					className: "px-5 py-3 text-[0.65rem] font-bold tracking-[0.13em] uppercase",
					style: {
						color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84",
						borderBottom: `1px solid ${border}`
					},
					children: "Products in this post"
				}), /* @__PURE__ */ jsx("div", {
					className: "p-4 flex flex-col gap-3",
					children: fm.products.map((p, i) => /* @__PURE__ */ jsx(ProductCard, {
						product: p,
						dark
					}, i))
				})]
			}),
			Array.isArray(fm.products) && fm.products.length > 0 && /* @__PURE__ */ jsx("p", {
				className: "text-[0.68rem] leading-relaxed px-1 font-light",
				style: { color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" },
				children: "🔗 Some links are affiliate links. You pay the same price — I earn a small commission. Thank you for your support!"
			}),
			Array.isArray(fm.tags) && fm.tags.length > 0 && /* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-2 pt-2",
				children: normalizeTags(fm.tags).map((tag) => /* @__PURE__ */ jsx("span", {
					className: "text-[0.72rem] font-semibold px-3.5 py-1.5 rounded-full border",
					style: {
						background: dark ? "rgba(255,255,255,0.05)" : "#F5F1EB",
						color: dark ? "rgba(250,248,244,0.7)" : "#3D3530",
						borderColor: dark ? "rgba(255,255,255,0.09)" : "#DDD7CE"
					},
					children: tag
				}, tag))
			})
		]
	})]
});
var FloatingShareBar = ({ title, dark }) => {
	const [copied, setCopied] = useState(false);
	const [instaCopied, setInstaCopied] = useState(false);
	const url = typeof window !== "undefined" ? window.location.href : "";
	const copyLink = async () => {
		await navigator.clipboard.writeText(url);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	};
	const shareNative = async () => {
		if (navigator.share) try {
			await navigator.share({
				title,
				url
			});
		} catch (_) {}
		else copyLink();
	};
	const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(title + " " + url)}`, "_blank", "noopener");
	const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "noopener");
	const shareLinkedIn = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener");
	const shareTelegram = () => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank", "noopener");
	const shareInstagram = async () => {
		await navigator.clipboard.writeText(url);
		setInstaCopied(true);
		setTimeout(() => {
			setInstaCopied(false);
			window.open("https://www.instagram.com", "_blank", "noopener");
		}, 800);
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-2 hidden lg:flex",
		"data-floating-share": true,
		style: { animation: "fadeUp 0.6s ease forwards" },
		children: [
			{
				label: "Share",
				icon: /* @__PURE__ */ jsx(ShareIcon, {}),
				onClick: shareNative,
				color: dark ? "#FAF8F4" : "#1A1612"
			},
			{
				label: copied ? "Copied!" : "Copy",
				icon: copied ? /* @__PURE__ */ jsx(CheckIcon, {}) : /* @__PURE__ */ jsx(CopyIcon, {}),
				onClick: copyLink,
				color: copied ? "#22543D" : dark ? "#FAF8F4" : "#1A1612"
			},
			{
				label: "WhatsApp",
				onClick: shareWhatsApp,
				color: "#25D366",
				icon: /* @__PURE__ */ jsx("svg", {
					viewBox: "0 0 24 24",
					fill: "currentColor",
					width: 16,
					height: 16,
					children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" })
				})
			},
			{
				label: "Telegram",
				onClick: shareTelegram,
				color: "#26A5E4",
				icon: /* @__PURE__ */ jsx("svg", {
					viewBox: "0 0 24 24",
					fill: "currentColor",
					width: 16,
					height: 16,
					children: /* @__PURE__ */ jsx("path", { d: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" })
				})
			},
			{
				label: "Facebook",
				onClick: shareFacebook,
				color: "#1877F2",
				icon: /* @__PURE__ */ jsx("svg", {
					viewBox: "0 0 24 24",
					fill: "currentColor",
					width: 16,
					height: 16,
					children: /* @__PURE__ */ jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" })
				})
			},
			{
				label: "LinkedIn",
				onClick: shareLinkedIn,
				color: "#0A66C2",
				icon: /* @__PURE__ */ jsx("svg", {
					viewBox: "0 0 24 24",
					fill: "currentColor",
					width: 16,
					height: 16,
					children: /* @__PURE__ */ jsx("path", { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" })
				})
			},
			{
				label: instaCopied ? "Copied!" : "Instagram",
				onClick: shareInstagram,
				color: instaCopied ? "#22543D" : "#E1306C",
				icon: /* @__PURE__ */ jsx("svg", {
					viewBox: "0 0 24 24",
					fill: "currentColor",
					width: 16,
					height: 16,
					children: /* @__PURE__ */ jsx("path", { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" })
				})
			}
		].map((btn) => /* @__PURE__ */ jsxs("button", {
			onClick: btn.onClick,
			title: btn.label,
			className: "group relative w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-110 hover:-translate-x-1",
			style: {
				background: dark ? "rgba(255,255,255,0.06)" : "#FFFFFF",
				border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#EAE4DC"}`,
				color: btn.color
			},
			"aria-label": btn.label,
			children: [btn.icon, /* @__PURE__ */ jsx("span", {
				className: "absolute left-12 px-2.5 py-1 rounded-lg text-[0.7rem] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 -translate-x-1 group-hover:translate-x-0",
				style: {
					background: dark ? "#FAF8F4" : "#1A1612",
					color: dark ? "#1A1612" : "#FAF8F4"
				},
				children: btn.label
			})]
		}, btn.label))
	});
};
var SUPABASE_URL = "https://vtitrlkbheiftoakfuvr.supabase.co";
var SUPABASE_ANON_KEY = "sb_publishable_cgqiWq9oEmzPwhOkSpTkWg_MHskM_qQ";
var CommentSection = ({ slug, dark }) => {
	const border = dark ? "rgba(255,255,255,0.07)" : "#EAE4DC";
	const [comments, setComments] = useState([]);
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [done, setDone] = useState(false);
	const [error, setError] = useState("");
	const fetchComments = useCallback(async () => {
		setLoading(true);
		try {
			const data = await (await fetch(`${SUPABASE_URL}/rest/v1/comments?slug=eq.${encodeURIComponent(slug)}&approved=eq.true&order=created_at.desc`, { headers: {
				apikey: SUPABASE_ANON_KEY,
				Authorization: `Bearer ${SUPABASE_ANON_KEY}`
			} })).json();
			setComments(Array.isArray(data) ? data : []);
		} catch {
			setComments([]);
		} finally {
			setLoading(false);
		}
	}, [slug]);
	useEffect(() => {
		fetchComments();
	}, [fetchComments]);
	const submit = async (e) => {
		e.preventDefault();
		if (!name.trim() || !message.trim()) return;
		setSubmitting(true);
		setError("");
		try {
			if (!(await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
				method: "POST",
				headers: {
					apikey: SUPABASE_ANON_KEY,
					Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
					"Content-Type": "application/json",
					Prefer: "return=minimal"
				},
				body: JSON.stringify({
					slug,
					name: name.trim(),
					message: message.trim()
				})
			})).ok) throw new Error();
			setDone(true);
			setName("");
			setMessage("");
			setTimeout(() => {
				setDone(false);
				fetchComments();
			}, 2e3);
		} catch {
			setError("Failed to post comment. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};
	const inputStyle = {
		width: "100%",
		padding: "10px 14px",
		borderRadius: "10px",
		border: `1.5px solid ${dark ? "rgba(255,255,255,0.1)" : "#DDD7CE"}`,
		background: dark ? "rgba(255,255,255,0.05)" : "#FAF8F4",
		color: dark ? "#FAF8F4" : "#1A1612",
		fontSize: "0.88rem",
		outline: "none",
		fontFamily: "Outfit, sans-serif",
		boxSizing: "border-box"
	};
	return /* @__PURE__ */ jsx("section", {
		className: "max-w-[1280px] mx-auto px-6 py-16",
		style: { borderTop: `1px solid ${border}` },
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-[760px] mx-auto",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "text-[0.72rem] font-bold tracking-[0.12em] uppercase mb-2",
					style: { color: "#E60023" },
					children: "Discussion"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "font-['DM_Serif_Display',serif] text-[1.9rem] mb-10",
					style: { color: dark ? "#FAF8F4" : "#1A1612" },
					children: loading ? "Comments" : `${comments.length} Comment${comments.length !== 1 ? "s" : ""}`
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl p-6 mb-10",
					style: {
						background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
						border: `1px solid ${border}`
					},
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-[0.85rem] font-semibold mb-4",
						style: { color: dark ? "#FAF8F4" : "#1A1612" },
						children: "Leave a comment"
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: submit,
						className: "flex flex-col gap-3",
						children: [
							/* @__PURE__ */ jsx("input", {
								type: "text",
								placeholder: "Your name",
								value: name,
								onChange: (e) => setName(e.target.value),
								required: true,
								maxLength: 60,
								style: inputStyle
							}),
							/* @__PURE__ */ jsx("textarea", {
								placeholder: "Write your comment...",
								value: message,
								onChange: (e) => setMessage(e.target.value),
								required: true,
								maxLength: 1e3,
								rows: 4,
								style: {
									...inputStyle,
									resize: "vertical",
									lineHeight: 1.6
								}
							}),
							error && /* @__PURE__ */ jsx("p", {
								className: "text-[0.78rem]",
								style: { color: "#E60023" },
								children: error
							}),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: submitting || !name.trim() || !message.trim(),
								className: "self-start px-6 py-2.5 rounded-xl text-[0.82rem] font-bold transition-all hover:opacity-80 disabled:opacity-40",
								style: {
									background: done ? "#22543D" : "#1A1612",
									color: "#FAF8F4",
									cursor: submitting ? "wait" : "pointer"
								},
								children: done ? "✓ Posted!" : submitting ? "Posting..." : "Post Comment"
							})
						]
					})]
				}),
				loading ? /* @__PURE__ */ jsx("div", {
					className: "space-y-4",
					children: [1, 2].map((i) => /* @__PURE__ */ jsx("div", {
						className: "animate-pulse rounded-2xl p-5 h-24",
						style: { background: dark ? "rgba(255,255,255,0.04)" : "#F5F1EB" }
					}, i))
				}) : comments.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "text-center py-14 rounded-2xl",
					style: {
						background: dark ? "rgba(255,255,255,0.02)" : "#F9F6F1",
						border: `1px dashed ${border}`
					},
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-3xl mb-3",
						children: "💬"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[0.88rem]",
						style: { color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" },
						children: "No comments yet. Be the first!"
					})]
				}) : /* @__PURE__ */ jsx("div", {
					className: "space-y-4",
					children: comments.map((c) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl p-5",
						style: {
							background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
							border: `1px solid ${border}`
						},
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 mb-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
								style: {
									background: "#1A1612",
									color: "#FAF8F4"
								},
								children: c.name[0]?.toUpperCase()
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
								className: "text-[0.85rem] font-semibold",
								style: { color: dark ? "#FAF8F4" : "#1A1612" },
								children: c.name
							}), /* @__PURE__ */ jsx("div", {
								className: "text-[0.72rem]",
								style: { color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" },
								children: new Date(c.created_at).toLocaleDateString("en-IN", {
									year: "numeric",
									month: "short",
									day: "numeric"
								})
							})] })]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-[0.88rem] leading-relaxed",
							style: { color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" },
							children: c.message
						})]
					}, c.id))
				})
			]
		})
	});
};
var PrevNextNav = ({ allPosts, currentSlug, dark }) => {
	if (!allPosts?.length) return null;
	const currentIdx = allPosts.findIndex((p) => p.slug === currentSlug);
	const prev = currentIdx > 0 ? allPosts[currentIdx - 1] : null;
	const next = currentIdx < allPosts.length - 1 ? allPosts[currentIdx + 1] : null;
	if (!prev && !next) return null;
	const border = dark ? "rgba(255,255,255,0.07)" : "#EAE4DC";
	const bg = dark ? "rgba(255,255,255,0.03)" : "#FFFFFF";
	return /* @__PURE__ */ jsx("div", {
		className: "max-w-[1280px] mx-auto px-6 pb-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
			style: {
				borderTop: `1px solid ${border}`,
				paddingTop: "2.5rem"
			},
			children: [prev && /* @__PURE__ */ jsxs(Link, {
				to: `/blog/${prev.slug}`,
				className: "group flex flex-col gap-2 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1",
				style: {
					background: bg,
					borderColor: border,
					textDecoration: "none"
				},
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-[0.68rem] font-bold uppercase tracking-widest",
					style: { color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" },
					children: "← Older Post"
				}), /* @__PURE__ */ jsx("span", {
					className: "font-['DM_Serif_Display',serif] text-[1rem] leading-snug group-hover:text-[#E60023] transition-colors",
					style: { color: dark ? "#FAF8F4" : "#1A1612" },
					children: prev.title
				})]
			}), next && /* @__PURE__ */ jsxs(Link, {
				to: `/blog/${next.slug}`,
				className: "group flex flex-col gap-2 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 sm:text-right sm:items-end",
				style: {
					background: bg,
					borderColor: border,
					textDecoration: "none"
				},
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-[0.68rem] font-bold uppercase tracking-widest",
					style: { color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" },
					children: "Newer Post →"
				}), /* @__PURE__ */ jsx("span", {
					className: "font-['DM_Serif_Display',serif] text-[1rem] leading-snug group-hover:text-[#E60023] transition-colors",
					style: { color: dark ? "#FAF8F4" : "#1A1612" },
					children: next.title
				})]
			})]
		})
	});
};
function useViewCount(slug) {
	const [views, setViews] = useState(null);
	useEffect(() => {
		if (!slug || !hasConsent()) return;
		const track = async () => {
			try {
				const count = await (await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_view`, {
					method: "POST",
					headers: {
						apikey: SUPABASE_ANON_KEY,
						Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
						"Content-Type": "application/json"
					},
					body: JSON.stringify({ slug })
				})).json();
				if (typeof count === "number") setViews(count);
			} catch {}
		};
		track();
	}, [slug]);
	return views;
}
var YouTubeEmbed = ({ id, caption }) => {
	const [loaded, setLoaded] = useState(false);
	const [dark, setDark] = useState(() => document.documentElement.getAttribute("data-theme") === "dark");
	useEffect(() => {
		const observer = new MutationObserver(() => {
			setDark(document.documentElement.getAttribute("data-theme") === "dark");
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"]
		});
		return () => observer.disconnect();
	}, []);
	if (!id) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "my-8 rounded-2xl overflow-hidden",
		style: { border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#EAE4DC"}` },
		children: [!loaded ? /* @__PURE__ */ jsxs("div", {
			onClick: () => setLoaded(true),
			className: "relative cursor-pointer group",
			style: {
				aspectRatio: "16/9",
				background: "#000"
			},
			children: [
				/* @__PURE__ */ jsx("img", {
					decoding: "async",
					fetchPriority: "low",
					src: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
					alt: caption || "YouTube video",
					className: "w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300",
					onError: (e) => {
						e.currentTarget.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
					}
				}),
				/* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 flex items-center justify-center",
					children: /* @__PURE__ */ jsx("div", {
						className: "w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110",
						style: { background: "#E60023" },
						children: /* @__PURE__ */ jsx("svg", {
							viewBox: "0 0 24 24",
							fill: "white",
							width: 28,
							height: 28,
							children: /* @__PURE__ */ jsx("path", { d: "M8 5v14l11-7z" })
						})
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "absolute bottom-3 right-3 bg-black/60 px-2 py-0.5 rounded text-white text-xs font-bold",
					children: "▶ YouTube"
				})
			]
		}) : /* @__PURE__ */ jsx("div", {
			style: {
				aspectRatio: "16/9",
				position: "relative"
			},
			children: /* @__PURE__ */ jsx("iframe", {
				src: `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`,
				title: caption || "YouTube video",
				allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
				allowFullScreen: true,
				style: {
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					border: "none"
				}
			})
		}), caption && /* @__PURE__ */ jsx("div", {
			className: "px-5 py-3 text-[0.78rem] text-center font-medium",
			style: {
				color: dark ? "rgba(250,248,244,0.55)" : "#7A6E64",
				borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#EAE4DC"}`
			},
			children: caption
		})]
	});
};
function ReadBlog() {
	const { slug } = useParams();
	const loaderData = useLoaderData();
	const initialPost = loaderData?.post;
	const initialManifestPosts = loaderData?.manifest?.posts || [];
	const [content, setContent] = useState(initialPost?.content || "");
	const [fm, setFm] = useState(initialPost?.frontmatter || {});
	const [tocItems, setTocItems] = useState(initialPost ? buildTOC(initialPost.content) : []);
	const [loading, setLoading] = useState(!initialPost);
	const [error, setError] = useState(loaderData ? !initialPost : false);
	const [bookmarked, setBookmarked] = useState(false);
	const [dark, toggleDark] = useDarkMode();
	const [fontSize, incFont, decFont] = useFontSize();
	const progress = useReadingProgress();
	const { activeId, sectionProgress } = useActiveTOC(tocItems);
	const showScrollTop = useScrollToTop();
	const [selTooltip, setSelTooltip] = useSelectionToolbar();
	const [morePosts, setMorePosts] = useState(initialManifestPosts.filter((p) => p.slug && p.slug !== slug).slice(0, 6));
	const [allPosts, setAllPosts] = useState(initialManifestPosts);
	const [readingMode, toggleReadingMode] = useReadingMode();
	const streak = useReadingStreak();
	const { highlights, save: saveHighlight } = useHighlights(slug);
	const readTime = useMemo(() => content ? estimateReadTime(content) : null, [content]);
	const finishTime = useFinishTime(readTime, progress);
	const views = useViewCount(slug);
	const layoutRef = useRef(null);
	const sidebarScrollRef = useRef(null);
	useSyncedSidebarScroll(sidebarScrollRef, layoutRef);
	useSEO(fm, slug, content, morePosts);
	useEffect(() => {
		if (!slug) return;
		setLoading(true);
		setError(false);
		window.scrollTo({
			top: 0,
			behavior: "instant"
		});
		const loadBlog = async () => {
			try {
				const currentRes = await fetch(`/blogs/${slug}.md`);
				if (!currentRes.ok) throw new Error("BLOG_NOT_FOUND");
				if ((currentRes.headers.get("content-type") || "").includes("text/html")) throw new Error("BLOG_NOT_FOUND");
				const raw = await currentRes.text();
				if (raw.trimStart().startsWith("<!doctype") || raw.trimStart().startsWith("<html")) throw new Error("BLOG_NOT_FOUND");
				const { data, content: body } = parseFrontmatter(raw);
				const cleanBody = body.replace(/<!--[\s\S]*?-->/g, "").trim();
				setFm(data);
				setContent(cleanBody);
				setTocItems(buildTOC(cleanBody));
				setBookmarked(JSON.parse(localStorage.getItem("bookmarks") || "[]").includes(slug));
				try {
					const manifestRes = await fetch("/blogs/manifest.json");
					if (!manifestRes.ok) {
						setMorePosts([]);
						setAllPosts([]);
						return;
					}
					if ((manifestRes.headers.get("content-type") || "").includes("text/html")) {
						setMorePosts([]);
						setAllPosts([]);
						return;
					}
					const posts = (await manifestRes.json()).posts || [];
					setAllPosts(posts);
					setMorePosts(posts.filter((p) => p.slug && p.slug !== slug).slice(0, 6));
				} catch {
					setMorePosts([]);
					setAllPosts([]);
				}
			} catch (err) {
				console.error(err);
				setError(true);
			} finally {
				setLoading(false);
			}
		};
		loadBlog();
	}, [slug]);
	const toggleBookmark = useCallback(() => {
		const stored = JSON.parse(localStorage.getItem("bookmarks") || "[]");
		const next = bookmarked ? stored.filter((s) => s !== slug) : [...stored, slug];
		localStorage.setItem("bookmarks", JSON.stringify(next));
		setBookmarked(!bookmarked);
	}, [bookmarked, slug]);
	if (loading) return /* @__PURE__ */ jsx(LoadingSkeleton, { dark });
	if (error) return /* @__PURE__ */ jsx(ErrorState, {
		slug,
		dark
	});
	const bg = dark ? "#0F0E0D" : "#FAF8F4";
	const border = dark ? "rgba(255,255,255,0.07)" : "#EAE4DC";
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("style", { children: `
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ttsPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }

        html { scroll-behavior: smooth; }
        html, body { min-height: 100%; }

        body {
          font-family: 'Outfit', sans-serif;
          background: ${bg};
          color: ${dark ? "#FAF8F4" : "#1A1612"};
          overflow-x: hidden;
          transition: background 0.3s, color 0.3s;
        }

        ::selection { background: #E6002326; color: ${dark ? "#FAF8F4" : "#1A1612"}; }

        [data-reading-mode="on"] [data-floating-share],
        [data-reading-mode="on"] .ad-wrapper {
          display: none !important;
        }
        [data-reading-mode="on"] aside {
          display: none !important;
        }
        [data-reading-mode="on"] #main-content {
          max-width: 680px !important;
          margin: 0 auto !important;
        }
        [data-reading-mode="on"] .prose {
          font-size: 18px !important;
          line-height: 2.1 !important;
        }

        .prose {
          font-size: ${fontSize}px;
          line-height: 1.85;
          color: ${dark ? "rgba(250,248,244,0.78)" : "#3D3530"};
        }
        .prose p { margin-bottom: 1.55rem; font-weight: 300; }
        .prose h1, .prose h2 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.8rem; line-height: 1.12;
          color: ${dark ? "#FAF8F4" : "#1A1612"};
          margin: 2.5rem 0 1rem;
          letter-spacing: -0.015em;
          scroll-margin-top: 96px;
        }
        .prose h2 { font-size: 1.65rem; border-bottom: 1px solid ${border}; padding-bottom: 0.5rem; }
        .prose h3 {
          font-family: 'DM Serif Display', serif;
          font-size: 1.3rem;
          color: ${dark ? "#FAF8F4" : "#1A1612"};
          margin: 2rem 0 0.75rem;
          scroll-margin-top: 96px;
        }
        .prose h4 { font-size: 1rem; font-weight: 700; color: ${dark ? "#FAF8F4" : "#1A1612"}; margin: 1.5rem 0 0.5rem; }
        .prose strong { color: ${dark ? "#FAF8F4" : "#1A1612"}; font-weight: 700; }
        .prose em { font-style: italic; }
        .prose a { color: #E60023; text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
        .prose a:hover { opacity: 0.7; }
        .prose hr { border: none; border-top: 1px solid ${border}; margin: 2.5rem 0; }
        .prose blockquote {
          margin: 2rem 0; padding: 1.4rem 1.75rem;
          border-left: 3px solid #E60023;
          background: ${dark ? "rgba(230,0,35,0.05)" : "#FFF5F5"};
          border-radius: 0 1rem 1rem 0;
          font-style: italic; color: ${dark ? "rgba(250,248,244,0.65)" : "#5A5046"};
        }
        .prose code {
          font-family: 'Fira Code', monospace;
          background: ${dark ? "rgba(255,255,255,0.07)" : "#F0EBE3"};
          padding: 0.15em 0.45em; border-radius: 5px; font-size: 0.87em;
          color: ${dark ? "#F2BFBE" : "#1A1612"};
        }
        .prose pre {
          background: #1A1612; color: #FAF8F4;
          padding: 1.5rem; border-radius: 1rem;
          overflow-x: auto; margin: 2rem 0;
          font-size: 0.87rem; line-height: 1.6;
        }
        .prose pre code { background: transparent; padding: 0; color: inherit; font-size: inherit; }
        .prose table { width: 100%; margin: 2rem 0; border-collapse: collapse; text-align: left; font-size: 0.9rem; }
        .prose th { font-weight: 700; padding: 0.75rem 1rem; border-bottom: 2px solid ${border}; color: ${dark ? "#FAF8F4" : "#1A1612"}; }
        .prose td { padding: 0.75rem 1rem; border-bottom: 1px solid ${border}; color: ${dark ? "rgba(250,248,244,0.7)" : "#5A5046"}; }
        .prose ol { counter-reset: step; list-style: none; margin: 1.5rem 0; }
        .prose ol li { counter-increment: step; position: relative; padding-left: 2.75rem; margin-bottom: 1rem; }
        .prose ol li::before {
          content: counter(step);
          position: absolute; left: 0; top: 0.05em;
          width: 1.75rem; height: 1.75rem;
          background: #1A1612; color: #FAF8F4;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; font-weight: 700;
        }
        .prose ul { list-style: none; margin: 1.5rem 0; padding-left: 0; }
        .prose ul li { padding-left: 1.5rem; margin-bottom: 0.65rem; position: relative; font-weight: 300; }
        .prose ul li::before { content: '—'; position: absolute; left: 0; color: #E60023; font-weight: 700; }
        .prose img { width: 100%; border-radius: 1rem; margin: 2rem 0; border: 1px solid ${border}; }

        .affiliate-chip { transition: transform .15s ease, box-shadow .15s ease, filter .15s ease; }
        .affiliate-chip:hover { transform: translateY(-2px); box-shadow: 0 3px 10px rgba(0,0,0,.15); filter: brightness(1.04); }
        .affiliate-chip:active { transform: translateY(0); }
        .affiliate-chip, .affiliate-chip * { color: red !important; }

        .no-scrollbar { scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }

        @media (max-width: 1023px) {
          aside { position: relative !important; top: 0 !important; max-height: none !important; overflow-y: visible !important; }
        }
      ` }),
		/* @__PURE__ */ jsx(SelectionToolbar, {
			tooltip: selTooltip,
			onClose: () => setSelTooltip(null),
			dark,
			onHighlight: saveHighlight
		}),
		/* @__PURE__ */ jsx(ScrollToTop, {
			show: showScrollTop,
			dark
		}),
		/* @__PURE__ */ jsx(FloatingShareBar, {
			title: fm.title,
			dark
		}),
		/* @__PURE__ */ jsxs("div", {
			style: {
				background: bg,
				minHeight: "100vh"
			},
			children: [
				/* @__PURE__ */ jsx(ProgressBar, { progress }),
				/* @__PURE__ */ jsx(Navbar, {
					dark,
					toggleDark,
					fontSize,
					incFont,
					decFont,
					readingMode,
					toggleReadingMode,
					content
				}),
				/* @__PURE__ */ jsx(Breadcrumb, {
					category: fm.category,
					title: fm.title,
					dark
				}),
				/* @__PURE__ */ jsx(ArticleHeader, {
					fm,
					readTime,
					dark,
					onBookmark: toggleBookmark,
					bookmarked,
					finishTime,
					streak,
					views
				}),
				/* @__PURE__ */ jsx(HeroImage, {
					src: fm.image,
					alt: fm.imageAlt || fm.title,
					pinterest: fm.type === "pinterest"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "max-w-[1280px] mx-auto px-6 mb-8",
					children: /* @__PURE__ */ jsx(CarbonAdUnit, {
						slot: "3170555405",
						format: "horizontal"
					})
				}),
				fm.type === "pinterest" ? /* @__PURE__ */ jsx(PinterestPostLayout, {
					fm,
					content,
					dark,
					fontSize,
					border,
					layoutRef,
					tocItems,
					activeId,
					sectionProgress,
					progress
				}) : /* @__PURE__ */ jsxs("div", {
					ref: layoutRef,
					className: "max-w-[1280px] mx-auto px-6 pb-24 flex flex-col lg:flex-row gap-16 items-start justify-between relative",
					children: [/* @__PURE__ */ jsx("main", {
						id: "main-content",
						className: "w-full lg:max-w-[calc(100%-386px)] min-w-0 flex-1",
						children: /* @__PURE__ */ jsxs("article", {
							className: "prose w-full",
							itemScope: true,
							itemType: "https://schema.org/BlogPosting",
							children: [
								/* @__PURE__ */ jsx("meta", {
									itemProp: "headline",
									content: fm.title
								}),
								/* @__PURE__ */ jsx("meta", {
									itemProp: "datePublished",
									content: fm.date
								}),
								/* @__PURE__ */ jsx("meta", {
									itemProp: "author",
									content: fm.author || SITE.name
								}),
								/* @__PURE__ */ jsx(KeyTakeawaysBox, {
									takeaways: fm.takeaways,
									dark
								}),
								/* @__PURE__ */ jsx(ReactMarkdown, {
									components: {
										h2: ({ children, ...props }) => {
											return /* @__PURE__ */ jsx("h2", {
												id: slugToId(String(children).replace(/\s+/g, " ").trim()),
												...props,
												children
											});
										},
										h3: ({ children, ...props }) => {
											return /* @__PURE__ */ jsx("h3", {
												id: slugToId(String(children).replace(/\s+/g, " ").trim()),
												...props,
												children
											});
										},
										a: ({ href, children }) => /* @__PURE__ */ jsx(SmartLink, {
											href,
											children
										}),
										p: ({ children }) => {
											const flatten = (node) => {
												if (node === null || node === void 0) return "";
												if (typeof node === "string") return node;
												if (typeof node === "number") return String(node);
												if (Array.isArray(node)) return node.map(flatten).join("");
												if (node?.props?.children !== void 0) return flatten(node.props.children);
												return "";
											};
											const youtubeMatch = flatten(children).trim().match(/^::youtube\[([a-zA-Z0-9_-]{11})\](?:\{caption="([^"]*)"\})?$/);
											if (youtubeMatch) return /* @__PURE__ */ jsx(YouTubeEmbed, {
												id: youtubeMatch[1],
												caption: youtubeMatch[2] || ""
											});
											return /* @__PURE__ */ jsx("p", { children });
										}
									},
									children: content
								}),
								/* @__PURE__ */ jsx(InArticleAd, {}),
								/* @__PURE__ */ jsx(ReactionBar, {
									slug,
									dark,
									border,
									supabaseUrl: SUPABASE_URL,
									supabaseKey: SUPABASE_ANON_KEY
								}),
								/* @__PURE__ */ jsx(ArticleTags, {
									tags: fm.tags,
									dark
								}),
								/* @__PURE__ */ jsx(FAQSection, {
									faqs: fm.faqs,
									dark,
									border
								})
							]
						})
					}), /* @__PURE__ */ jsx("aside", {
						className: "w-full lg:w-[320px] lg:shrink-0 z-20 self-start lg:sticky lg:top-[96px]",
						"aria-label": "Article sidebar",
						children: /* @__PURE__ */ jsxs("div", {
							ref: sidebarScrollRef,
							className: "no-scrollbar w-full pb-4",
							children: [
								/* @__PURE__ */ jsx(SidebarCard, {
									header: "In This Post",
									dark,
									delay: 0,
									children: /* @__PURE__ */ jsx(SmartTOC, {
										tocItems,
										activeId,
										sectionProgress,
										overallProgress: progress,
										dark
									})
								}),
								/* @__PURE__ */ jsx(AISummaryCard, {
									content,
									dark,
									border
								}),
								/* @__PURE__ */ jsx(AffiliateLinksSidebar, {
									content,
									dark,
									border,
									fallbackIcon: fm.emoji
								}),
								/* @__PURE__ */ jsx(CarbonAdUnit, {
									slot: "3170555405",
									style: { minHeight: "250px" }
								}),
								/* @__PURE__ */ jsx(HighlightsPanel, {
									slug,
									dark,
									border
								}),
								/* @__PURE__ */ jsx(SidebarCard, {
									header: "About the Author",
									dark,
									delay: 80,
									children: /* @__PURE__ */ jsx(AuthorCard, {
										author: fm.author,
										dark
									})
								}),
								/* @__PURE__ */ jsx(SidebarCard, {
									header: "More Posts",
									dark,
									delay: 240,
									children: morePosts.length > 0 ? morePosts.map((p, i) => /* @__PURE__ */ jsx(MorePostItem, {
										post: p,
										dark,
										isLast: i === morePosts.length - 1
									}, p.slug || i)) : /* @__PURE__ */ jsx("div", {
										className: "text-[0.8rem]",
										style: { color: dark ? "rgba(250,248,244,0.655)" : "#7A6E64" },
										children: "No more posts available."
									})
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ jsx(PrevNextNav, {
					allPosts,
					currentSlug: slug,
					dark
				}),
				/* @__PURE__ */ jsx(CommentSection, {
					slug,
					dark
				}),
				/* @__PURE__ */ jsx("div", {
					className: "max-w-[1280px] mx-auto px-6 mb-4",
					children: /* @__PURE__ */ jsx(CarbonAdUnit, {
						slot: "3170555405",
						format: "horizontal"
					})
				}),
				/* @__PURE__ */ jsxs("section", {
					className: "max-w-[1280px] mx-auto px-6 pt-16 pb-24 border-t z-30 relative",
					style: {
						borderColor: border,
						background: bg
					},
					children: [/* @__PURE__ */ jsxs("div", {
						className: "mb-8",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-[0.72rem] font-bold tracking-[0.12em] uppercase mb-2",
							style: { color: "#E60023" },
							children: "Keep Reading"
						}), /* @__PURE__ */ jsx("h2", {
							className: "font-['DM_Serif_Display',serif] text-[1.9rem]",
							style: { color: dark ? "#FAF8F4" : "#1A1612" },
							children: "You might also like"
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-5",
						children: (() => {
							const currentIdx = allPosts.findIndex((p) => p.slug === slug);
							const prevSlug = currentIdx > 0 ? allPosts[currentIdx - 1]?.slug : null;
							const nextSlug = currentIdx < allPosts.length - 1 ? allPosts[currentIdx + 1]?.slug : null;
							const related = morePosts.filter((p) => p.slug !== prevSlug && p.slug !== nextSlug).slice(0, 3);
							return related.length > 0 ? related.map((p, i) => /* @__PURE__ */ jsx(RelatedCard, {
								post: p,
								delay: i * 80,
								dark
							}, p.slug || i)) : /* @__PURE__ */ jsx("div", {
								className: "text-sm",
								style: { color: dark ? "rgba(250,248,244,0.655)" : "#7A6E64" },
								children: "No related posts available."
							});
						})()
					})]
				}),
				/* @__PURE__ */ jsxs("footer", {
					className: "relative z-10 overflow-hidden",
					style: { background: "#0F0E0D" },
					children: [/* @__PURE__ */ jsx("div", {
						className: "h-px w-full",
						style: { background: "linear-gradient(90deg, transparent, #E60023, transparent)" }
					}), /* @__PURE__ */ jsxs("div", {
						className: "max-w-[1280px] mx-auto px-6 pt-16 pb-10",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col lg:flex-row justify-between gap-12 pb-12",
								style: { borderBottom: "1px solid rgba(250,248,244,0.07)" },
								children: [/* @__PURE__ */ jsxs("div", {
									className: "max-w-[320px]",
									children: [
										/* @__PURE__ */ jsxs(Link, {
											to: "/",
											className: "font-['DM_Serif_Display',serif] text-[2rem] mb-3 inline-block",
											style: {
												color: "#FAF8F4",
												textDecoration: "none"
											},
											children: ["Veeresh", /* @__PURE__ */ jsx("span", {
												style: { color: "#E60023" },
												children: "."
											})]
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[0.82rem] leading-relaxed mb-6",
											style: { color: "rgba(250,248,244,0.65)" },
											children: "Writing about small things that make life better. Based in Hubballi, India."
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ jsx("a", {
												href: SITE.pinterestUrl,
												target: "_blank",
												rel: "noopener noreferrer",
												className: "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:opacity-90",
												style: {
													background: "#E60023",
													color: "#fff"
												},
												"aria-label": "Pinterest",
												children: /* @__PURE__ */ jsx(PinterestIcon, { size: 15 })
											}), /* @__PURE__ */ jsx("a", {
												href: `mailto:${SITE.email}`,
												className: "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:opacity-90",
												style: {
													background: "rgba(255,255,255,0.08)",
													color: "#fff"
												},
												"aria-label": "Email",
												children: /* @__PURE__ */ jsx("svg", {
													viewBox: "0 0 24 24",
													fill: "none",
													stroke: "currentColor",
													strokeWidth: 1.8,
													strokeLinecap: "round",
													strokeLinejoin: "round",
													width: 15,
													height: 15,
													children: /* @__PURE__ */ jsx("path", { d: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" })
												})
											})]
										})
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16",
									children: [
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: "text-[0.65rem] font-bold tracking-[0.15em] uppercase mb-4",
											style: { color: "#E60023" },
											children: "Explore"
										}), /* @__PURE__ */ jsx("ul", {
											className: "space-y-2.5 list-none m-0 p-0",
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
													label: "Pinterest Boards",
													href: SITE.pinterestUrl,
													external: true
												}
											].map((link) => /* @__PURE__ */ jsx("li", { children: link.external ? /* @__PURE__ */ jsx("a", {
												href: link.href,
												target: "_blank",
												rel: "noopener noreferrer",
												className: "text-[0.8rem] transition-all duration-200 hover:opacity-100 hover:translate-x-1 inline-block",
												style: {
													color: "rgba(250,248,244,0.655)",
													textDecoration: "none"
												},
												children: link.label
											}) : /* @__PURE__ */ jsx(Link, {
												to: link.to,
												className: "text-[0.8rem] transition-all duration-200 hover:opacity-100 hover:translate-x-1 inline-block",
												style: {
													color: "rgba(250,248,244,0.655)",
													textDecoration: "none"
												},
												children: link.label
											}) }, link.label))
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: "text-[0.65rem] font-bold tracking-[0.15em] uppercase mb-4",
											style: { color: "#E60023" },
											children: "Topics"
										}), /* @__PURE__ */ jsx("ul", {
											className: "space-y-2.5 list-none m-0 p-0",
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
											].map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
												to: link.to,
												className: "text-[0.8rem] transition-all duration-200 hover:opacity-100 hover:translate-x-1 inline-block",
												style: {
													color: "rgba(250,248,244,0.655)",
													textDecoration: "none"
												},
												children: link.label
											}) }, link.label))
										})] }),
										/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
											className: "text-[0.65rem] font-bold tracking-[0.15em] uppercase mb-4",
											style: { color: "#E60023" },
											children: "Connect"
										}), /* @__PURE__ */ jsx("ul", {
											className: "space-y-2.5 list-none m-0 p-0",
											children: [
												{
													label: "About Me",
													to: "/about"
												},
												{
													label: "Contact",
													href: `mailto:${SITE.email}`
												},
												{
													label: "Privacy Policy",
													to: "/privacy-policy"
												},
												{
													label: "Terms of Use",
													to: "/terms"
												}
											].map((link) => /* @__PURE__ */ jsx("li", { children: link.href ? /* @__PURE__ */ jsx("a", {
												href: link.href,
												className: "text-[0.8rem] transition-all duration-200 hover:opacity-100 hover:translate-x-1 inline-block",
												style: {
													color: "rgba(250,248,244,0.655)",
													textDecoration: "none"
												},
												children: link.label
											}) : /* @__PURE__ */ jsx(Link, {
												to: link.to,
												className: "text-[0.8rem] transition-all duration-200 hover:opacity-100 hover:translate-x-1 inline-block",
												style: {
													color: "rgba(250,248,244,0.655)",
													textDecoration: "none"
												},
												children: link.label
											}) }, link.label))
										})] })
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "py-10 flex flex-col md:flex-row items-center justify-between gap-6",
								style: { borderBottom: "1px solid rgba(250,248,244,0.07)" },
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "font-['DM_Serif_Display',serif] text-[1.1rem] mb-1",
									style: { color: "#FAF8F4" },
									children: "Follow on Pinterest"
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[0.78rem]",
									style: { color: "rgba(250,248,244,0.65)" },
									children: "Get visual inspiration and curated finds every day."
								})] }), /* @__PURE__ */ jsxs("a", {
									href: SITE.pinterestUrl,
									target: "_blank",
									rel: "noopener noreferrer",
									className: "inline-flex items-center gap-2 font-bold text-[0.82rem] px-6 py-3 rounded-full transition-all duration-300 hover:opacity-90 hover:-translate-y-px flex-shrink-0",
									style: {
										background: "#E60023",
										color: "#fff"
									},
									children: [/* @__PURE__ */ jsx(PinterestIcon, { size: 14 }), " Follow on Pinterest"]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "pt-8 flex flex-col md:flex-row items-center justify-between gap-4",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2 text-[0.72rem]",
									style: { color: " rgba(250,248,244,0.5)" },
									children: [
										/* @__PURE__ */ jsxs("span", { children: [
											"© ",
											(/* @__PURE__ */ new Date()).getFullYear(),
											" Veeresh Bashetti."
										] }),
										/* @__PURE__ */ jsx("span", {
											className: "w-1 h-1 rounded-full inline-block",
											style: { background: "rgba(250,248,244,0.2)" }
										}),
										/* @__PURE__ */ jsx("span", { children: "All rights reserved." })
									]
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1.5 text-[0.72rem]",
									style: { color: "rgba(250,248,244,0.2)" },
									children: [
										/* @__PURE__ */ jsx("span", { children: "Made with" }),
										/* @__PURE__ */ jsx("span", {
											style: { color: "#E60023" },
											children: "♥"
										}),
										/* @__PURE__ */ jsx("span", { children: "in Hubballi, India" })
									]
								})]
							})
						]
					})]
				})
			]
		})
	] });
}
//#endregion
export { ReadBlog as default };
