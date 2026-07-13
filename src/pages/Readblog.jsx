import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, Link, useLoaderData } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { parseFrontmatter as sharedParseFrontmatter } from "../utils/blogData.js";
import { hasConsent } from "../pages/CookieBanner";

// ═══════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════

const SITE = {
  name: "Veeresh Bashetti",
  tagline: "Writer & Curator",
  pinterestUrl: "https://in.pinterest.com/veereshbbashetti/",
  email: "veeresh.b.bashetti@gmail.com",
  baseUrl: "https://www.veereshbashetti.com",
  locale: "en_IN",
};

const TOC_EMOJIS = ["📌", "💡", "📊", "🔥", "🧠", "✨", "🚀", "🎯", "📝", "⚡"];
const REACTIONS = ["❤️", "🔥", "💡", "🤔"];
const REACTION_LABELS = { "❤️": "Love", "🔥": "Fire", "💡": "Insightful", "🤔": "Thoughtful" };

const ADSENSE_CLIENT = "ca-pub-4423608769058806";

// ═══════════════════════════════════════════════
// GOOGLE ADSENSE
// ═══════════════════════════════════════════════

const CarbonAdUnit = ({ slot, format = "auto", responsive = "true", style = {}, className = "" }) => {
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

  return (
    <div className={`ad-wrapper overflow-hidden clear-both my-8 text-center ${className}`}>
      <span className="block text-[0.58rem] tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-1.5 font-medium">
        — Advertisement —
      </span>
      <ins
        className="adsbygoogle block rounded-xl"
        style={{
          display: "block",
          width: "100%",
          minHeight: "280px",
          ...style,
        }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

const InArticleAd = () => {
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
    } catch (e) { /* silent */ }
  }, [consent]);

  if (!consent) return null;

  return (
    <div className="my-10">
      <span className="block text-center text-[0.58rem] tracking-[0.2em] uppercase text-neutral-400 mb-2">
        — Advertisement —
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-pub-4423608769058806"
        data-ad-slot="3083346955"
      />
    </div>
  );
};

// ═══════════════════════════════════════════════
// FRONTMATTER PARSER
// ═══════════════════════════════════════════════

// function parseFrontmatter(raw) {
//   const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
//   const match = normalized.match(/^\s*---\s*\n([\s\S]*?)\n---\s*/);
//   if (!match) return { data: {}, content: normalized };

//   const yaml = match[1];
//   const content = normalized.slice(match[0].length).trim();
//   const data = {};
//   const lines = yaml.split("\n");
//   let i = 0;

//   while (i < lines.length) {
//     const line = lines[i];
//     const colonIdx = line.search(/:\s/);
//     if (colonIdx === -1 && !line.match(/^[\w-]+:\s*$/)) { i++; continue; }

//     const keyMatch = line.match(/^([\w-]+):\s*$/);
//     if (keyMatch) {
//       const key = keyMatch[1];
//       i++;
//       const items = [];
//       while (i < lines.length) {
//         const itemLine = lines[i];
//         if (itemLine.match(/^[\w-]+:\s/) || itemLine.match(/^[\w-]+:\s*$/)) break;
//         if (itemLine.match(/^\s{0,4}-\s/)) {
//           const firstVal = itemLine.replace(/^\s*-\s*/, "").trim();
//           // Only treat as object if it looks like "key: value" with a short key (no spaces before colon)
//           const isObjectEntry = firstVal.match(/^[\w-]+:\s/);

//           if (isObjectEntry) {
//             const obj = {};
//             const fc = firstVal.indexOf(":");
//             obj[firstVal.slice(0, fc).trim()] = firstVal.slice(fc + 1).trim().replace(/^["']|["']$/g, "");
//             i++;
//             while (i < lines.length) {
//               const sub = lines[i];
//               if (!sub.match(/^\s{4,}[\w-]+:\s/) && !sub.match(/^\s{2,}[\w-]+:\s/)) break;
//               const sc = sub.indexOf(":");
//               const subKey = sub.slice(0, sc).trim();
//               const subVal = sub.slice(sc + 1).trim().replace(/^["']|["']$/g, "");
//               obj[subKey] = subVal;
//               i++;
//             }
//             items.push(obj);
//           } else {
//             items.push(firstVal.replace(/^["']|["']$/g, ""));
//             i++;
//           }
//         } else { i++; }
//       }
//       data[key] = items.length ? items : "";
//       continue;
//     }

//     const ci = line.indexOf(":");
//     const key = line.slice(0, ci).trim();
//     let val = line.slice(ci + 1).trim();
//     val = val.replace(/^["']|["']$/g, "").trim();
//     if (val === "true") val = true;
//     else if (val === "false") val = false;
//     data[key] = val;
//     i++;
//   }

//   return { data, content };
// }

// ═══════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════

function buildTOC(md) {
  return md.split("\n")
    .filter(l => l.match(/^## /))
    .map((l, i) => {
      const label = l.replace(/^## /, "").trim();
      const id = label.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
      return { id, label, emoji: TOC_EMOJIS[i % TOC_EMOJIS.length] };
    });
}

function slugToId(text) {
  return String(text).toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

function formatDate(d) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
  } catch { return d; }
}

function estimateReadTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 238));
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags
    .map(t => {
      if (typeof t === "string") return t.trim();
      if (t && typeof t === "object") {
        const key = Object.keys(t)[0];
        return key ? String(key).trim() : null;
      }
      return null;
    })
    .filter(Boolean);
}

// ── Marketplace link detection ──────────────────────────────
const AFFILIATE_PLATFORMS = {
  amazon: { match: /amazon\.[a-z.]+|amzn\.to|amzn\.in/i, label: "Amazon", color: "#FF9900", bg: "#FFF6E5", icon: "📦" },
  flipkart: { match: /flipkart\.com|fkrt\.(it|co|cc)/i, label: "Flipkart", color: "#2874F0", bg: "#EAF1FF", icon: "🛍️" },
  myntra: { match: /myntra\.com/i, label: "Myntra", color: "#FF3F6C", bg: "#FFEFF3", icon: "👗" },
  meesho: { match: /meesho\.com|meesho\.onelink\.me/i, label: "Meesho", color: "#9F2089", bg: "#FBEEFA", icon: "🧺" },
};

function getPlatform(href = "") {
  for (const key in AFFILIATE_PLATFORMS) {
    if (AFFILIATE_PLATFORMS[key].match.test(href)) return { key, ...AFFILIATE_PLATFORMS[key] };
  }
  return { key: "default", label: "View", color: "#1A1612", bg: "#F0EBE3", icon: "🔗" };
}

function isAffiliateLink(href = "") {
  return Object.values(AFFILIATE_PLATFORMS).some(p => p.match.test(href));
}

// ═══════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════

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

function useActiveTOC(tocItems) {
  const [activeId, setActiveId] = useState(tocItems[0]?.id || "");
  const [sectionProgress, setSectionProgress] = useState({});

  useEffect(() => {
    if (!tocItems.length) return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }),
      { rootMargin: "-15% 0px -70% 0px" }
    );
    document.querySelectorAll("h2[id]").forEach(h => observer.observe(h));

    const calc = () => {
      const ids = tocItems.map(t => t.id);
      const result = {};
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const next = i < ids.length - 1 ? document.getElementById(ids[i + 1]) : null;
        const top = el.getBoundingClientRect().top + window.scrollY;
        const bottom = next ? next.getBoundingClientRect().top + window.scrollY : document.documentElement.scrollHeight;
        const scrolled = window.scrollY + window.innerHeight * 0.2 - top;
        result[id] = Math.min(100, Math.max(0, (scrolled / (bottom - top)) * 100));
      });
      setSectionProgress(result);
    };

    window.addEventListener("scroll", calc, { passive: true });
    calc();
    return () => { observer.disconnect(); window.removeEventListener("scroll", calc); };
  }, [tocItems]);

  return { activeId, sectionProgress };
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

  return [dark, () => setDark(d => !d)];
}

function useFontSize() {
  const [size, setSize] = useState(17);
  const increase = () => setSize(s => Math.min(s + 1, 21));
  const decrease = () => setSize(s => Math.max(s - 1, 14));
  return [size, increase, decrease];
}

function useSelectionToolbar() {
  const [tooltip, setTooltip] = useState(null);
  useEffect(() => {
    const onMouseUp = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || sel.toString().trim().length < 3) { setTooltip(null); return; }
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setTooltip({ text: sel.toString().trim(), x: rect.left + rect.width / 2, y: rect.top + window.scrollY - 48 });
    };
    const onMouseDown = e => { if (!e.target.closest("[data-selection-toolbar]")) setTooltip(null); };
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousedown", onMouseDown);
    return () => { document.removeEventListener("mouseup", onMouseUp); document.removeEventListener("mousedown", onMouseDown); };
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
      if (e.isIntersecting) { el.style.opacity = "1"; el.style.transform = "none"; obs.unobserve(el); }
    }, { threshold: 0.06 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

import { Head } from "vite-react-ssg";

const BASE_URL = "https://www.veereshbashetti.com"; // match sitemap — use www consistently

function SEOHead({ frontmatter: fm, slug, content = "", morePosts = [] }) {
  if (!fm.title) return null;

  const title = fm.seo?.title || `${fm.title} — ${SITE.name}`;
  const desc = fm.seo?.description || fm.description || fm.excerpt || "";
  const url = `${BASE_URL}/blog/${slug}`;
  const img = fm.image || "";
  const words = content.trim().split(/\s+/).length;
  const readMinutes = Math.max(1, Math.round(words / 238));
  const tags = normalizeTags(fm.tags);

  const currentIdx = morePosts.findIndex(p => p.slug === slug);
  const prevPost = morePosts[currentIdx - 1];
  const nextPost = morePosts[currentIdx + 1];

  const graph = [
    {
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: fm.title,
      description: desc,
      image: img,
      datePublished: fm.date || "",
      dateModified: fm.date || "",
      author: { "@type": "Person", name: fm.author || SITE.name, url: BASE_URL },
      publisher: { "@type": "Person", name: SITE.name, url: BASE_URL },
      keywords: tags.join(", "),
      inLanguage: "en-IN",
      url,
      wordCount: words,
      timeRequired: `PT${readMinutes}M`,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE_URL}/blog` },
        ...(fm.category ? [{ "@type": "ListItem", position: 3, name: fm.category, item: `${BASE_URL}/category/${fm.category.toLowerCase().replace(/\s+/g, "-")}` }] : []),
        { "@type": "ListItem", position: fm.category ? 4 : 3, name: fm.title, item: url },
      ],
    },
    ...(Array.isArray(fm.faqs) && fm.faqs.length ? [{
      "@type": "FAQPage",
      mainEntity: fm.faqs.map(({ q, a }) => ({
        "@type": "Question", name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    }] : []),
  ];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={desc} />
      {fm.seo?.keywords?.length ? <meta name="keywords" content={fm.seo.keywords.join(", ")} /> : null}

      <link rel="canonical" href={url} />

      <meta property="og:type" content="article" />
      <meta property="og:title" content={fm.title} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={SITE.locale} />
      {img ? <meta property="og:image" content={img} /> : null}
      {fm.date ? <meta property="article:published_time" content={fm.date} /> : null}
      {fm.author ? <meta property="article:author" content={fm.author} /> : null}
      {tags.map(t => <meta key={t} property="article:tag" content={t} />)}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fm.title} />
      <meta name="twitter:description" content={desc} />
      {img ? <meta name="twitter:image" content={img} /> : null}

      {prevPost ? <link rel="prev" href={`${BASE_URL}/blog/${prevPost.slug}`} /> : null}
      {nextPost ? <link rel="next" href={`${BASE_URL}/blog/${nextPost.slug}`} /> : null}

      <script type="application/ld+json">
        {JSON.stringify({ "@context": "https://schema.org", "@graph": graph })}
      </script>
    </Head>
  );
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
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem("reading-streak") || "{}");
    const last = stored.lastDate || "";
    const count = stored.count || 0;
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (last === today) {
      setStreak(count);
    } else if (last === yesterday) {
      const next = count + 1;
      localStorage.setItem("reading-streak", JSON.stringify({ lastDate: today, count: next }));
      setStreak(next);
    } else {
      localStorage.setItem("reading-streak", JSON.stringify({ lastDate: today, count: 1 }));
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
  return [on, () => setOn(o => !o)];
}

function useFinishTime(readTime, progress) {
  return useMemo(() => {
    if (!readTime || progress >= 100) return null;
    const remaining = Math.max(0, readTime * (1 - progress / 100));
    const finish = new Date(Date.now() + remaining * 60000);
    return finish.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  }, [readTime, progress]);
}

function useHighlights(slug) {
  const [highlights, setHighlights] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`highlights:${slug}`) || "[]"); }
    catch { return []; }
  });

  const save = useCallback((text) => {
    setHighlights(prev => {
      if (prev.find(h => h.text === text)) return prev;
      const next = [{ id: Date.now(), text, date: new Date().toISOString() }, ...prev].slice(0, 20);
      localStorage.setItem(`highlights:${slug}`, JSON.stringify(next));
      return next;
    });
  }, [slug]);

  const remove = useCallback((id) => {
    setHighlights(prev => {
      const next = prev.filter(h => h.id !== id);
      localStorage.setItem(`highlights:${slug}`, JSON.stringify(next));
      return next;
    });
  }, [slug]);

  return { highlights, save, remove };
}

function useReactions(slug, supabaseUrl, supabaseKey) {
  const [counts, setCounts] = useState({});
  const [myVotes, setMyVotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`reactions:${slug}`) || "{}"); }
    catch { return {}; }
  });

  const fetchReactions = useCallback(async () => {
    if (!supabaseUrl || !supabaseKey) return;
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/reactions?slug=eq.${encodeURIComponent(slug)}&select=emoji`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
      );
      const rows = await res.json();
      const map = {};
      (rows || []).forEach(r => { map[r.emoji] = (map[r.emoji] || 0) + 1; });
      setCounts(map);
    } catch { /* silent */ }
  }, [slug, supabaseUrl, supabaseKey]);

  useEffect(() => { fetchReactions(); }, [fetchReactions]);

  const react = useCallback(async (emoji) => {
    if (myVotes[emoji]) return;
    const next = { ...myVotes, [emoji]: true };
    setMyVotes(next);
    localStorage.setItem(`reactions:${slug}`, JSON.stringify(next));
    setCounts(c => ({ ...c, [emoji]: (c[emoji] || 0) + 1 }));
    if (!supabaseUrl || !supabaseKey) return;
    try {
      await fetch(`${supabaseUrl}/rest/v1/reactions`, {
        method: "POST",
        headers: {
          apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json", Prefer: "return=minimal",
        },
        body: JSON.stringify({ slug, emoji }),
      });
    } catch { /* silent */ }
  }, [slug, myVotes, supabaseUrl, supabaseKey]);

  return { counts, myVotes, react };
}

// ─── VOICE CONFIG ─────────────────────────────────────────────────────
const VOICE_CONFIG = {
  voiceId: "TX3LPaxmHKxFdv7VOQHJ",
  stability: 0.30,
  similarity_boost: 0.82,
  style: 0.60,
  use_speaker_boost: true,
};

const NARRATION_PROMPT = `You are converting a blog post into a warm, emotionally resonant spoken narration.

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

  useEffect(() => { setSupported(true); }, []);

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
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `${NARRATION_PROMPT}\n\n${text.slice(0, 3000)}`
        }]
      })
    });
    const data = await response.json();
    return data.content?.[0]?.text?.trim() || text;
  }, []);

  const speakWithElevenLabs = useCallback(async (text) => {
    const ELEVENLABS_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!ELEVENLABS_KEY) throw new Error("No ElevenLabs key");

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_CONFIG.voiceId}/stream`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: VOICE_CONFIG.stability,
            similarity_boost: VOICE_CONFIG.similarity_boost,
            style: VOICE_CONFIG.style,
            use_speaker_boost: VOICE_CONFIG.use_speaker_boost,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`ElevenLabs error: ${err}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(audioUrl); };
    audio.onerror = () => { setSpeaking(false); URL.revokeObjectURL(audioUrl); };

    await audio.play();
    setSpeaking(true);
  }, []);

  const speakFallback = useCallback((rawText) => {
    const plain = rawText
      .replace(/#{1,6}\s+/g, "")
      .replace(/\*\*?([^*]+)\*\*?/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/`[^`]+`/g, "")
      .replace(/^\s*[-*>]\s+/gm, "")
      .slice(0, 4000);

    const voices = window.speechSynthesis.getVoices();
    const voice =
      voices.find(v => v.name.includes("Google UK English Male")) ||
      voices.find(v => v.name.includes("Daniel")) ||
      voices.find(v => v.name.includes("Alex")) ||
      voices.find(v => v.lang === "en-IN") ||
      voices.find(v => v.lang.startsWith("en-")) ||
      voices[0];

    const utt = new SpeechSynthesisUtterance(plain);
    if (voice) utt.voice = voice;
    utt.rate = 0.80;
    utt.pitch = 0.95;
    utt.volume = 1;
    utt.lang = "en-IN";
    utt.onend = () => setSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
    setSpeaking(true);
  }, []);

  const toggle = useCallback(async () => {
    if (!supported) return;
    if (speaking || loading) { stop(); return; }

    setLoading(true);
    try {
      const narration = await rewriteForStorytelling(content);
      await speakWithElevenLabs(narration);
      setLoading(false);
    } catch (err) {
      console.warn("ElevenLabs failed, using browser fallback:", err);
      setLoading(false);
      speakFallback(content);
    }
  }, [content, speaking, loading, supported, stop, rewriteForStorytelling, speakWithElevenLabs, speakFallback]);

  useEffect(() => () => stop(), [stop]);

  return { speaking, loading, supported, toggle };
}

// ═══════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════

const Icon = ({ d, size = 18, className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={size} height={size} className={className} aria-hidden="true"><path d={d} /></svg>
);

const PinterestIcon = ({ size = 16 }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);

const SunIcon = () => <Icon d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" />;
const MoonIcon = () => <Icon d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />;
const ShareIcon = () => <Icon d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" />;
const CheckIcon = () => <Icon d="M20 6L9 17l-5-5" size={14} />;
const CopyIcon = () => <Icon d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M8 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4z" size={14} />;
const ArrowLeftIcon = () => <Icon d="M19 12H5M12 5l-7 7 7 7" size={16} />;
const BookmarkIcon = ({ filled }) => filled
  ? <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
  : <Icon d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" size={16} />;

// ═══════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════

const AdsterraBanner = ({ adKey, width, height, label = true }) => {
  const ref = useRef(null);
  const [consent, setConsent] = useState(hasConsent());

  useEffect(() => {
    const onChange = (e) => setConsent(e.detail === "accepted");
    window.addEventListener("cookieConsentChanged", onChange);
    return () => window.removeEventListener("cookieConsentChanged", onChange);
  }, []);

  useEffect(() => {
    if (!consent || !ref.current || !adKey) return;
    ref.current.innerHTML = "";
    const conf = document.createElement("script");
    conf.text = `atOptions = { 'key':'${adKey}','format':'iframe','height':${height},'width':${width},'params':{} };`;
    const invoke = document.createElement("script");
    invoke.src = `//www.topcreativeformat.com/${adKey}/invoke.js`;
    invoke.async = true;
    ref.current.appendChild(conf);
    ref.current.appendChild(invoke);
  }, [adKey, width, height, consent]);

  if (!consent || !adKey) return null;

  return (
    <div className="ad-wrapper overflow-hidden clear-both my-8 text-center">
      {label && <span className="block text-[0.58rem] tracking-[0.2em] uppercase text-neutral-400 mb-1.5 font-medium">— Advertisement —</span>}
      <div ref={ref} style={{ minHeight: height, width: "100%", display: "flex", justifyContent: "center" }} />
    </div>
  );
};

const AdsterraNative = ({ adKey, label = true }) => {
  const ref = useRef(null);
  const [consent, setConsent] = useState(hasConsent());

  useEffect(() => {
    const onChange = (e) => setConsent(e.detail === "accepted");
    window.addEventListener("cookieConsentChanged", onChange);
    return () => window.removeEventListener("cookieConsentChanged", onChange);
  }, []);

  useEffect(() => {
    if (!consent || !ref.current || !adKey) return;
    ref.current.innerHTML = "";
    const container = document.createElement("div");
    container.id = `container-${adKey}`;
    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = `https://pl30348137.effectivecpmnetwork.com/${adKey}/invoke.js`;
    ref.current.appendChild(container);
    ref.current.appendChild(script);
  }, [adKey, consent]);

  if (!consent || !adKey) return null;

  return (
    <div className="ad-wrapper overflow-hidden clear-both my-8 text-center">
      {label && <span className="block text-[0.58rem] tracking-[0.2em] uppercase text-neutral-400 mb-1.5 font-medium">— Advertisement —</span>}
      <div ref={ref} style={{ minHeight: 250, width: "100%", display: "flex", justifyContent: "center" }} />
    </div>
  );
};

const ProgressBar = ({ progress }) => (
  <div className="fixed top-[68px] left-0 right-0 h-[3px] z-[99] bg-neutral-200 dark:bg-neutral-800" aria-hidden="true">
    <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-[width] duration-75 ease-linear" style={{ width: `${progress}%` }} />
  </div>
);

const Navbar = ({ dark, toggleDark, fontSize, incFont, decFont, readingMode, toggleReadingMode, content }) => {
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
    if (navigator.share) {
      try { await navigator.share({ title: document.title, url: window.location.href }); } catch (_) { }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? "shadow-sm" : ""}`}
      style={{ background: dark ? "rgba(15,14,13,0.92)" : "rgba(250,248,244,0.92)", backdropFilter: "blur(20px)", borderBottom: scrolled ? `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(26,22,18,0.08)"}` : "1px solid transparent" }}>
      <div className="max-w-[1280px] mx-auto px-6 h-[68px] flex items-center justify-between gap-4">

        <div className="flex items-center gap-4">
          <Link to="/" className="font-['DM_Serif_Display',serif] text-[1.3rem] tracking-tight flex-shrink-0" style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>
            Veeresh<span className="text-red-500">.</span>
          </Link>
          <Link to="/blog"
            className="hidden md:inline-flex items-center gap-1.5 text-[0.75rem] font-semibold px-3 py-1.5 rounded-full border transition-all duration-200 hover:opacity-70"
            style={{ borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)", color: dark ? "rgba(250,248,244,0.55)" : "#7A6E64", background: "transparent" }}>
            ← All Posts
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-0.5 px-2 py-1 rounded-lg border" style={{ borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)" }}>
            <button onClick={decFont} className="w-7 h-7 flex items-center justify-center text-[0.68rem] font-bold rounded-md transition-all hover:opacity-60" style={{ color: dark ? "#FAF8F4" : "#3D3530" }} aria-label="Decrease font size">A−</button>
            <div className="w-px h-3 mx-0.5" style={{ background: dark ? "rgba(255,255,255,0.15)" : "rgba(26,22,18,0.15)" }} />
            <button onClick={incFont} className="w-7 h-7 flex items-center justify-center text-[0.82rem] font-bold rounded-md transition-all hover:opacity-60" style={{ color: dark ? "#FAF8F4" : "#3D3530" }} aria-label="Increase font size">A+</button>
          </div>

          <button onClick={toggleDark}
            className="w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-200 hover:opacity-70"
            style={{ borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)", color: dark ? "#FAF8F4" : "#3D3530" }}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
            {dark ? <SunIcon /> : <MoonIcon />}
          </button>

          {supported && (
            <button
              onClick={toggleTTS}
              className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg border transition-all duration-200 hover:opacity-70"
              style={{
                borderColor: (speaking || loading) ? "#E60023" : (dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)"),
                color: (speaking || loading) ? "#E60023" : (dark ? "#FAF8F4" : "#3D3530"),
                background: (speaking || loading) ? (dark ? "rgba(230,0,35,0.1)" : "#FFF5F6") : "transparent",
                animation: speaking ? "ttsPulse 1.5s infinite" : "none",
              }}
              aria-label={loading ? "Preparing story..." : speaking ? "Stop reading" : "Read article aloud (AI storytelling)"}
              title={loading ? "Preparing…" : speaking ? "Stop" : "Read aloud"}
            >
              {loading ? (
                <span
                  style={{
                    display: "inline-block",
                    width: 14, height: 14,
                    border: "2px solid #E60023",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
              ) : speaking ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
                  <path d="M6 6h4v12H6zM14 6h4v12h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
                  <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          )}

          <button onClick={toggleReadingMode}
            className="hidden md:flex items-center gap-1.5 text-[0.75rem] font-semibold px-3 py-2 rounded-lg border transition-all duration-200 hover:opacity-70"
            style={{
              borderColor: readingMode ? "#E60023" : (dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)"),
              color: readingMode ? "#E60023" : (dark ? "#FAF8F4" : "#3D3530"),
              background: readingMode ? (dark ? "rgba(230,0,35,0.1)" : "#FFF5F6") : "transparent",
            }}
            aria-label={readingMode ? "Exit focus mode" : "Focus mode"}
            aria-pressed={readingMode}>
            {readingMode ? "✕ Exit focus" : "⊡ Focus"}
          </button>

          <button onClick={shareUrl}
            className="hidden md:flex items-center gap-1.5 text-[0.78rem] font-semibold px-3.5 py-2 rounded-lg border transition-all duration-200 hover:opacity-70"
            style={{ borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)", color: dark ? "#FAF8F4" : "#3D3530" }}
            aria-label="Share article">
            {copied ? <><CheckIcon /> Copied!</> : <><ShareIcon /> Share</>}
          </button>

          <a href={SITE.pinterestUrl} target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-[0.78rem] font-bold px-4 py-2 rounded-full transition-all duration-300 hover:-translate-y-px hover:opacity-90"
            style={{ background: "#E60023", color: "#fff" }}>
            <PinterestIcon size={13} /> Follow
          </a>

          <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen(o => !o)} aria-label={open ? "Close menu" : "Open menu"}>
            <span className={`block w-5 h-0.5 transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} style={{ background: dark ? "#FAF8F4" : "#1A1612" }} />
            <span className={`block w-5 h-0.5 transition-all duration-300 ${open ? "opacity-0" : ""}`} style={{ background: dark ? "#FAF8F4" : "#1A1612" }} />
            <span className={`block w-5 h-0.5 transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} style={{ background: dark ? "#FAF8F4" : "#1A1612" }} />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden px-6 pb-6 pt-2 flex flex-col gap-4 border-t"
          style={{ borderColor: dark ? "rgba(255,255,255,0.06)" : "rgba(26,22,18,0.08)", background: dark ? "#0F0E0D" : "#FAF8F4" }}>
          <Link to="/" onClick={() => setOpen(false)} className="text-[0.88rem] font-semibold py-1" style={{ color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" }}>← All Posts</Link>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={decFont} className="text-xs font-bold px-3 py-1.5 rounded border" style={{ color: dark ? "#FAF8F4" : "#3D3530", borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(26,22,18,0.15)" }}>A−</button>
            <button onClick={incFont} className="text-sm font-bold px-3 py-1.5 rounded border" style={{ color: dark ? "#FAF8F4" : "#3D3530", borderColor: dark ? "rgba(255,255,255,0.15)" : "rgba(26,22,18,0.15)" }}>A+</button>
            <button onClick={toggleReadingMode} className="text-xs font-bold px-3 py-1.5 rounded border" style={{ color: readingMode ? "#E60023" : (dark ? "#FAF8F4" : "#3D3530"), borderColor: readingMode ? "#E60023" : (dark ? "rgba(255,255,255,0.15)" : "rgba(26,22,18,0.15)") }}>
              {readingMode ? "Exit Focus" : "Focus"}
            </button>
          </div>
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

const Breadcrumb = ({ category, title, dark }) => (
  <nav className="max-w-[1280px] mx-auto px-6 pt-28 pb-0 flex items-center gap-2 text-xs font-medium flex-wrap" style={{ color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" }} aria-label="Breadcrumb">
    <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
    <span>›</span>
    <a href="/#blog" className="hover:text-red-500 transition-colors">Blog</a>
    {category && (<><span>›</span><Link to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`} className="hover:text-red-500 transition-colors capitalize">{category}</Link></>)}
    <span>›</span>
    <span className="truncate max-w-[180px]" style={{ color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" }}>{title}</span>
  </nav>
);

const ArticleHeader = ({ fm, readTime, dark, onBookmark, bookmarked, finishTime, streak, views }) => {
  const [copied, setCopied] = useState(false);
  const share = useCallback(async () => {
    if (navigator.share) {
      try { await navigator.share({ title: fm.title, url: window.location.href }); } catch (_) { }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }, [fm.title]);

  const initials = (fm.author || SITE.name).split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <header className="max-w-[1280px] mx-auto px-6 pt-7" style={{ animation: "fadeUp 0.65s ease forwards" }}>
      {fm.category && (
        <Link to={`/category/${fm.category.toLowerCase().replace(/\s+/g, "-")}`}
          className="inline-block text-[0.7rem] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full mb-5 cursor-pointer transition-all duration-200"
          style={{ background: "#E600230F", color: "#E60023", border: "1px solid #E6002322" }}>
          {fm.category}
        </Link>
      )}

      <h1 className="font-['DM_Serif_Display',serif] leading-[1.06] tracking-[-0.022em] mb-5 max-w-[840px]"
        style={{ fontSize: "clamp(2.1rem, 4.5vw, 3.1rem)", color: dark ? "#FAF8F4" : "#1A1612" }}>
        {fm.title}
      </h1>

      {(fm.excerpt || fm.description) && (
        <p className="text-[1.1rem] leading-[1.8] mb-7 pb-7 max-w-[840px]"
          style={{ color: dark ? "rgba(250,248,244,0.5)" : "#7A6E64", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#EAE4DC"}` }}>
          {fm.excerpt || fm.description}
        </p>
      )}

      <div className="w-[90%] flex items-center justify-between flex-wrap gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "#1A1612", color: "#FAF8F4", border: `2px solid ${dark ? "rgba(255,255,255,0.12)" : "#EAE4DC"}` }}>
            {initials}
          </div>
          <div>
            <div className="text-[0.88rem] font-semibold" style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>{fm.author || SITE.name}</div>
            <div className="flex items-center gap-2 text-[0.73rem] flex-wrap" style={{ color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" }}>
              {fm.date && <time dateTime={fm.date}>{formatDate(fm.date)}</time>}
              {fm.date && readTime && <span>·</span>}
              {readTime && <span>{readTime} min read</span>}
              {views && (
                <>
                  <span>·</span>
                  <span>{views.toLocaleString()} views</span>
                </>
              )}
              {finishTime && (
                <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: dark ? "rgba(255,255,255,0.07)" : "#F0EBE3", color: dark ? "rgba(250,248,244,0.5)" : "#7A6E64" }}>
                  ⏱ Finish by {finishTime}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {streak > 1 && (
            <div className="flex items-center gap-1.5 text-[0.72rem] font-semibold px-3 py-1.5 rounded-full"
              style={{ background: dark ? "rgba(255,180,0,0.12)" : "#FFFBEC", color: "#B97A00", border: "1px solid rgba(245,199,80,0.3)" }}>
              🔥 {streak}-day streak
            </div>
          )}
          <button onClick={onBookmark} title={bookmarked ? "Remove bookmark" : "Bookmark"}
            className="w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-200 hover:opacity-60"
            style={{ borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)", color: bookmarked ? "#E60023" : (dark ? "rgba(250,248,244,0.5)" : "#7A6E64") }}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark this article"}>
            <BookmarkIcon filled={bookmarked} />
          </button>
        </div>
      </div>
    </header>
  );
};

const HeroImage = ({ src, alt, pinterest }) => {
  if (!src) return null;
  return (
    <div className="max-w-[1280px] mx-auto px-6 mb-14">
      <div className="rounded-2xl overflow-hidden max-w-[1200px] mx-auto aspect-[16/9]">
        <img
          src={src}
          alt={alt || "Article hero"}
          className={`w-full block ${pinterest ? "h-full object-cover" : "h-auto"}`}
          loading="eager" decoding="async"
          fetchPriority="high" />
      </div>
    </div>
  );
};
const SelectionToolbar = ({ tooltip, onClose, dark, onHighlight }) => {
  const [copied, setCopied] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  if (!tooltip) return null;

  const copyText = async () => {
    await navigator.clipboard.writeText(tooltip.text);
    setCopied(true);
    setTimeout(() => { setCopied(false); onClose(); }, 1500);
  };

  const highlight = () => {
    if (onHighlight) onHighlight(tooltip.text);
    setHighlighted(true);
    setTimeout(() => { setHighlighted(false); onClose(); }, 1000);
  };

  return (
    <div data-selection-toolbar
      className="fixed z-[200] flex items-center gap-1 px-2 py-1.5 rounded-xl shadow-2xl"
      style={{ top: tooltip.y, left: Math.max(8, tooltip.x - 80), background: "#1A1612", border: "1px solid rgba(255,255,255,0.12)", transform: "translateX(-50%)" }}>
      <button onClick={copyText} className="flex items-center gap-1.5 text-[0.72rem] font-semibold px-2.5 py-1.5 rounded-lg transition-all hover:bg-white/10"
        style={{ color: copied ? "#4CAF50" : "#FAF8F4" }}>
        {copied ? <><CheckIcon /> Copied</> : <><CopyIcon /> Copy</>}
      </button>
      <div className="w-px h-4 bg-white/15" />
      <button onClick={highlight} className="flex items-center gap-1.5 text-[0.72rem] font-semibold px-2.5 py-1.5 rounded-lg transition-all hover:bg-white/10"
        style={{ color: highlighted ? "#FFD700" : "#FAF8F4" }}>
        {highlighted ? "✓ Saved" : "🖊 Highlight"}
      </button>
    </div>
  );
};

const SmartTOC = ({ tocItems, activeId, sectionProgress, overallProgress, dark }) => {
  const scrollTo = useCallback(id => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: "smooth" });
  }, []);

  const listRef = useRef(null);
  const isFirstRun = useRef(true);
  const done = tocItems.filter(t => (sectionProgress[t.id] || 0) >= 95).length;

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (!activeId || !listRef.current) return;
    const activeElement = listRef.current.querySelector(`[data-id="${activeId}"]`);
    if (!activeElement) return;
    activeElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeId]);

  if (!tocItems.length) return <p className="text-sm" style={{ color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" }}>No sections found.</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5 pb-4" style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#EAE4DC"}` }}>
        <div className="relative w-10 h-10 flex-shrink-0">
          <svg viewBox="0 0 40 40" className="w-10 h-10 -rotate-90">
            <circle cx="20" cy="20" r="16" fill="none" stroke={dark ? "rgba(255,255,255,0.08)" : "#EAE4DC"} strokeWidth="3.5" />
            <circle cx="20" cy="20" r="16" fill="none" stroke="#E60023" strokeWidth="3.5"
              strokeDasharray={`${2 * Math.PI * 16}`}
              strokeDashoffset={`${2 * Math.PI * 16 * (1 - overallProgress / 100)}`}
              strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.3s" }} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[0.5rem] font-bold" style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>
            {Math.round(overallProgress)}%
          </span>
        </div>
        <div>
          <div className="text-[0.75rem] font-bold" style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>Reading progress</div>
          <div className="text-[0.68rem]" style={{ color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" }}>{done}/{tocItems.length} sections done</div>
        </div>
      </div>

      <ul className="space-y-0.5 list-none" ref={listRef} role="navigation" aria-label="Article sections">
        {tocItems.map((item, idx) => {
          const isActive = activeId === item.id;
          const pct = Math.round(sectionProgress[item.id] || 0);
          const isDone = pct >= 95;
          return (
            <li key={item.id} data-id={item.id}>
              <button onClick={() => scrollTo(item.id)}
                className="w-full text-left flex items-start gap-2.5 rounded-xl px-3 py-2.5 transition-all duration-200 group relative"
                style={{
                  background: isActive ? (dark ? "rgba(255,255,255,0.05)" : "#F4EFE6") : "transparent",
                  border: isActive ? `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#E4DDD4"}` : "1px solid transparent",
                }}
                aria-current={isActive ? "true" : undefined}>
                {isActive && <div className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full bg-red-500" />}
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[0.6rem] font-bold transition-all duration-200"
                  style={{
                    background: isDone ? "#22543D" : isActive ? "#E60023" : (dark ? "rgba(255,255,255,0.08)" : "#EDEAE4"),
                    color: isDone ? "#fff" : isActive ? "#fff" : (dark ? "rgba(250,248,244,0.5)" : "#7A6E64"),
                  }}>
                  {isDone ? "✓" : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.8rem] font-medium leading-snug transition-colors duration-200"
                    style={{ color: isActive ? (dark ? "#FAF8F4" : "#1A1612") : isDone ? (dark ? " rgba(250,248,244,0.6)" : "#AAA09A") : (dark ? "rgba(250,248,244,0.6)" : "#5A5046") }}>
                    {item.label}
                  </div>
                  {pct > 0 && (
                    <div className="mt-1.5 h-[2px] rounded-full overflow-hidden" style={{ background: dark ? "rgba(255,255,255,0.07)" : "#EAE4DC" }}>
                      <div className="h-full rounded-full transition-[width] duration-300"
                        style={{ width: `${pct}%`, background: isDone ? "#22543D" : "linear-gradient(90deg,#E60023,#FF6B81)" }} />
                    </div>
                  )}
                </div>
                <span className="text-[0.62rem] font-bold flex-shrink-0 mt-0.5"
                  style={{ color: isDone ? "#22543D" : isActive ? "#E60023" : (dark ? "rgba(250,248,244,0.3)" : "#AAA09A") }}>
                  {isDone ? "Done" : pct > 0 ? `${pct}%` : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 pt-4 flex items-center justify-between text-[0.68rem]" style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#EAE4DC"}`, color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" }}>
        <span>{tocItems.length} sections</span>
        {done === tocItems.length
          ? <span style={{ color: "#22543D", fontWeight: 700 }}>✓ Fully read!</span>
          : <span>~{Math.max(1, Math.round(8 * (1 - overallProgress / 100)))} min left</span>}
      </div>
    </div>
  );
};

const SidebarCard = ({ header, children, dark, delay = 0 }) => {
  const ref = useFadeIn(delay);
  return (
    <div ref={ref} className="rounded-2xl overflow-hidden mb-4"
      style={{ background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#EAE4DC"}` }}>
      <div className="px-5 py-3 text-[0.65rem] font-bold tracking-[0.13em] uppercase"
        style={{ color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#EAE4DC"}` }}>
        {header}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
};

const AuthorCard = ({ author, dark }) => {
  const name = author || SITE.name;
  return (
    <>
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold font-['DM_Serif_Display',serif] mb-3"
        style={{ background: "#1A1612", color: "#FAF8F4" }}>
        {name[0]?.toUpperCase()}
      </div>
      <div className="font-['DM_Serif_Display',serif] text-[1rem] mb-1" style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>{name}</div>
      <p className="text-[0.8rem] leading-relaxed mb-4" style={{ color: dark ? "rgba(250,248,244,0.655)" : "#7A6E64" }}>
        Writer and curator based in Hubballi, India. Writing about small things that make life better.
      </p>
      <div className="flex gap-2 flex-wrap">
        {[
          { href: SITE.pinterestUrl, label: "Pinterest", external: true, icon: <PinterestIcon size={11} /> },
          { href: `mailto:${SITE.email}`, label: "Email", external: false, icon: <Icon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" size={11} /> },
        ].map(l => (
          <a key={l.label} href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1.5 text-[0.73rem] font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 hover:opacity-70"
            style={{ color: dark ? "rgba(250,248,244,0.7)" : "#3D3530", borderColor: dark ? "rgba(255,255,255,0.1)" : "#DDD7CE", background: dark ? "rgba(255,255,255,0.04)" : "#F5F1EB" }}>
            {l.icon}{l.label}
          </a>
        ))}
      </div>
    </>
  );
};

const MorePostItem = ({ post, dark, isLast }) => (
  <Link to={`/blog/${post.slug}`} className="flex gap-3 items-start py-3 transition-opacity hover:opacity-70"
    style={{ borderBottom: isLast ? "none" : `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#EAE4DC"}` }}>
    <div className="w-12 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
      style={{ background: dark ? "rgba(255,255,255,0.06)" : "#F5F1EB", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "#E5DFDA"}` }}>
      {post.emoji}
    </div>
    <div>
      <div className="text-[0.65rem] font-bold uppercase tracking-[0.07em] mb-0.5" style={{ color: "#E60023" }}>{post.tag}</div>
      <div className="text-[0.78rem] font-semibold leading-snug" style={{ color: dark ? "rgba(250,248,244,0.75)" : "#1A1612" }}>{post.title}</div>
    </div>
  </Link>
);

const ArticleTags = ({ tags, dark }) => {
  const normalized = normalizeTags(tags);
  if (!normalized.length) return null;
  return (
    <div className="mt-12 pt-8 flex items-center gap-2.5 flex-wrap" style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#EAE4DC"}` }}>
      <span className="text-[0.72rem] font-bold uppercase tracking-[0.07em]" style={{ color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" }}>Tags:</span>
      {normalized.map(tag => (
        <span key={tag} to={`/tags/${tag.toLowerCase().replace(/\s+/g, "-")}`}
          className="inline-block text-[0.73rem] font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 hover:opacity-70"
          style={{ background: dark ? "rgba(255,255,255,0.05)" : "#F5F1EB", color: dark ? "rgba(250,248,244,0.7)" : "#3D3530", borderColor: dark ? "rgba(255,255,255,0.09)" : "#DDD7CE" }}>
          {tag}
        </span>
      ))}
    </div>
  );
};

const KeyTakeawaysBox = ({ takeaways, dark }) => {
  if (!takeaways?.length) return null;
  return (
    <div className="rounded-2xl p-6 mb-8"
      style={{ background: dark ? "rgba(230,0,35,0.06)" : "#FFF5F6", border: "1.5px solid rgba(230,0,35,0.2)" }}>
      <div className="flex items-center gap-2 mb-4">
        <span style={{ fontSize: "1.1rem" }}>🎯</span>
        <span className="font-['DM_Serif_Display',serif] text-[1.05rem]"
          style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>
          Key Takeaways
        </span>
      </div>
      <ul className="space-y-2.5 list-none m-0 p-0">
        {takeaways.map((t, i) => {
          // Guard: if parser returned an object instead of string, extract first value
          const text = typeof t === "string" ? t : typeof t === "object" && t !== null
            ? Object.values(t).join(": ")
            : String(t);
          return (
            <li key={i} className="flex items-start gap-3 text-[0.87rem] leading-relaxed"
              style={{ color: dark ? "rgba(250,248,244,0.78)" : "#3D3530" }}>
              <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] font-bold mt-0.5"
                style={{ background: "#E60023", color: "#fff" }}>
                {i + 1}
              </span>
              {text}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const ReactionBar = ({ slug, dark, border, supabaseUrl, supabaseKey }) => {
  const { counts, myVotes, react } = useReactions(slug, supabaseUrl, supabaseKey);
  return (
    <div className="mt-10 pt-8 flex flex-col gap-3" style={{ borderTop: `1px solid ${border}` }}>
      <p className="text-[0.72rem] font-bold uppercase tracking-[0.07em]"
        style={{ color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" }}>
        Did you find this helpful?
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {REACTIONS.map(emoji => (
          <button key={emoji} onClick={() => react(emoji)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-sm transition-all duration-200 hover:-translate-y-px"
            style={{
              background: myVotes[emoji] ? (dark ? "rgba(230,0,35,0.15)" : "#FFF0F1") : (dark ? "rgba(255,255,255,0.04)" : "#F5F1EB"),
              borderColor: myVotes[emoji] ? "rgba(230,0,35,0.35)" : (dark ? "rgba(255,255,255,0.09)" : "#DDD7CE"),
              transform: myVotes[emoji] ? "scale(1.05)" : "scale(1)",
            }}
            title={REACTION_LABELS[emoji]}
            aria-label={`React with ${REACTION_LABELS[emoji]}`}
            aria-pressed={!!myVotes[emoji]}>
            <span>{emoji}</span>
            {(counts[emoji] || 0) > 0 && (
              <span className="text-[0.72rem] font-semibold" style={{ color: dark ? "rgba(250,248,244,0.55)" : "#7A6E64" }}>
                {counts[emoji]}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const FAQSection = ({ faqs, dark, border }) => {
  const [open, setOpen] = useState(null);
  if (!faqs?.length) return null;
  return (
    <div className="mt-12 pt-8" style={{ borderTop: `1px solid ${border}` }}>
      <p className="text-[0.72rem] font-bold tracking-[0.12em] uppercase mb-2" style={{ color: "#E60023" }}>FAQ</p>
      <h2 className="font-['DM_Serif_Display',serif] text-[1.6rem] mb-6" style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>
        Frequently Asked Questions
      </h2>
      <div className="space-y-2" itemScope itemType="https://schema.org/FAQPage">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl overflow-hidden"
            itemScope itemProp="mainEntity" itemType="https://schema.org/Question"
            style={{ border: `1px solid ${border}` }}>
            <button onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
              style={{ background: open === i ? (dark ? "rgba(255,255,255,0.04)" : "#F9F6F1") : "transparent" }}
              aria-expanded={open === i}>
              <span className="text-[0.88rem] font-semibold pr-4" itemProp="name"
                style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>{faq.q}</span>
              <span className="flex-shrink-0 text-lg transition-transform duration-200"
                style={{ transform: open === i ? "rotate(45deg)" : "none", color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" }}>
                +
              </span>
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-[0.85rem] leading-relaxed"
                itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
                style={{ color: dark ? "rgba(250,248,244,0.65)" : "#5A5046" }}>
                <span itemProp="text">{faq.a}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const AISummaryCard = ({ content, dark, border }) => {
  const [state, setState] = useState("idle");
  const [summary, setSummary] = useState("");

  const generate = async () => {
    if (state === "loading" || !content) return;
    setState("loading");
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          max_tokens: 300,
          messages: [{
            role: "user",
            content: `Summarize this article in exactly 3 concise bullet points. Each bullet should be one sentence capturing a key insight. Return ONLY 3 bullets using "•" as the bullet character. No preamble, no headers.\n\n${content.slice(0, 6000)}`
          }]
        }),
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || "";
      setSummary(text);
      setState("done");
    } catch { setState("error"); }
  };

  return (
    <div className="rounded-2xl overflow-hidden mb-4"
      style={{ background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF", border: `1px solid ${border}` }}>
      <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${border}` }}>
        <span className="text-[0.65rem] font-bold tracking-[0.13em] uppercase"
          style={{ color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" }}>
          ✦ AI Summary
        </span>
        {state === "idle" && (
          <button onClick={generate}
            className="text-[0.68rem] font-bold px-2.5 py-1 rounded-full transition-all hover:opacity-80"
            style={{ background: "#E60023", color: "#fff" }}>
            Generate
          </button>
        )}
        {state === "done" && (
          <button onClick={() => { setState("idle"); setSummary(""); }}
            className="text-[0.68rem] opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>
            Dismiss
          </button>
        )}
      </div>
      <div className="p-5">
        {state === "idle" && (
          <p className="text-[0.8rem] leading-relaxed" style={{ color: dark ? "rgba(250,248,244,0.655)" : "#7A6E64" }}>
            Get a 3-bullet AI summary of this article.
          </p>
        )}
        {state === "loading" && (
          <div className="flex items-center gap-2 text-[0.8rem]" style={{ color: dark ? "rgba(250,248,244,0.655)" : "#7A6E64" }}>
            <span className="inline-block w-3.5 h-3.5 border-2 rounded-full border-t-transparent animate-spin"
              style={{ borderColor: "#E60023", borderTopColor: "transparent" }} />
            Summarizing…
          </div>
        )}
        {state === "done" && (
          <div className="space-y-2.5">
            {summary.split("\n").filter(l => l.trim()).map((line, i) => (
              <p key={i} className="text-[0.82rem] leading-relaxed"
                style={{ color: dark ? "rgba(250,248,244,0.75)" : "#3D3530" }}>
                {line}
              </p>
            ))}
          </div>
        )}
        {state === "error" && (
          <p className="text-[0.8rem]" style={{ color: "#E60023" }}>
            Failed to generate.{" "}
            <button onClick={generate} className="underline">Retry</button>
          </p>
        )}
      </div>
    </div>
  );
};

const HighlightsPanel = ({ slug, dark, border }) => {
  const { highlights, remove } = useHighlights(slug);
  if (!highlights.length) return null;
  return (
    <div className="rounded-2xl overflow-hidden mb-4"
      style={{ background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF", border: `1px solid ${border}` }}>
      <div className="px-5 py-3" style={{ borderBottom: `1px solid ${border}` }}>
        <span className="text-[0.65rem] font-bold tracking-[0.13em] uppercase"
          style={{ color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" }}>
          ✎ Your Highlights ({highlights.length})
        </span>
      </div>
      <div className="p-4 space-y-3">
        {highlights.map(h => (
          <div key={h.id} className="group flex items-start gap-2">
            <div className="w-0.5 rounded-full flex-shrink-0 mt-1 self-stretch" style={{ background: "#E60023", minHeight: "1.2rem" }} />
            <p className="text-[0.78rem] leading-relaxed flex-1 italic"
              style={{ color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" }}>
              "{h.text.slice(0, 120)}{h.text.length > 120 ? "…" : ""}"
            </p>
            <button onClick={() => remove(h.id)}
              className="opacity-0 group-hover:opacity-60 hover:!opacity-100 text-xs transition-opacity flex-shrink-0 mt-0.5"
              style={{ color: dark ? "#FAF8F4" : "#1A1612" }}
              aria-label="Remove highlight">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const RelatedCard = ({ post, delay, dark }) => {
  const ref = useFadeIn(delay);
  return (
    <Link ref={ref} to={`/blog/${post.slug}`}
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{ background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#EAE4DC"}` }}>
      <div className="overflow-hidden bg-neutral-100 dark:bg-neutral-900" style={{ aspectRatio: "16/9" }}>
        <img src={post.image || "/fallback.jpg"} alt={post.title} loading="lazy"
          onError={(e) => { e.currentTarget.src = "/fallback.jpg"; }} decoding="async" fetchPriority="low"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-[0.65rem] font-bold uppercase tracking-[0.09em] mb-2" style={{ color: "#E60023" }}>{post.tag}</div>
        <h3 className="font-['DM_Serif_Display',serif] text-[1.0rem] leading-snug flex-1 mb-3" style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>{post.title}</h3>
        <div className="text-[0.72rem] font-medium" style={{ color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" }}>{post.meta}</div>
      </div>
    </Link>
  );
};

const ScrollToTop = ({ show, dark }) => (
  <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    className="fixed bottom-8 right-8 w-11 h-11 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110"
    style={{
      background: "#1A1612", color: "#FAF8F4",
      opacity: show ? 1 : 0, pointerEvents: show ? "auto" : "none",
      transform: show ? "translateY(0)" : "translateY(12px)",
    }}
    aria-label="Scroll to top">
    <Icon d="M18 15l-6-6-6 6" />
  </button>
);

const LoadingSkeleton = ({ dark }) => (
  <div className="min-h-screen pt-28" style={{ background: dark ? "#0F0E0D" : "#FAF8F4" }}>
    <div className="max-w-[760px] mx-auto px-6 space-y-4 animate-pulse">
      <div className="h-3 rounded-full w-32" style={{ background: dark ? "rgba(255,255,255,0.07)" : "#EAE4DC" }} />
      <div className="h-10 rounded-xl w-3/4" style={{ background: dark ? "rgba(255,255,255,0.07)" : "#EAE4DC" }} />
      <div className="h-10 rounded-xl w-1/2" style={{ background: dark ? "rgba(255,255,255,0.07)" : "#EAE4DC" }} />
      <div className="h-3 rounded-full w-full mt-6" style={{ background: dark ? "rgba(255,255,255,0.05)" : "#EAE4DC" }} />
      <div className="h-3 rounded-full w-5/6" style={{ background: dark ? "rgba(255,255,255,0.05)" : "#EAE4DC" }} />
      <div className="h-56 rounded-2xl w-full mt-8" style={{ background: dark ? "rgba(255,255,255,0.05)" : "#EAE4DC" }} />
    </div>
  </div>
);

const ErrorState = ({ slug, dark }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-8 text-center" style={{ background: dark ? "#0F0E0D" : "#FAF8F4" }}>
    <div className="text-6xl">📄</div>
    <h1 className="font-['DM_Serif_Display',serif] text-3xl" style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>Post not found</h1>
    <p className="text-[0.88rem] max-w-sm" style={{ color: dark ? "rgba(250,248,244,0.5)" : "#7A6E64" }}>
      Could not load <code className="px-2 py-0.5 rounded text-sm" style={{ background: dark ? "rgba(255,255,255,0.07)" : "#F0EBE3" }}>/blogs/{slug}.md</code>.
    </p>
    <button onClick={() => window.location.href = "/"} className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full transition-all hover:opacity-80"
      style={{ background: "#1A1612", color: "#FAF8F4" }}>
      <ArrowLeftIcon /> Back to Blog
    </button>
  </div>
);

const SmartLink = ({ href = "", children }) => {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (!isAffiliateLink(href)) {
    return <a href={href} target={isInternal ? undefined : "_blank"} rel={isInternal ? undefined : "noopener noreferrer"}>{children}</a>;
  }
  const p = getPlatform(href);
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="affiliate-chip"
      style={{
        display: "inline-flex", alignItems: "center", gap: "5px",
        padding: "2px 10px 2px 7px", margin: "0 2px",
        borderRadius: "999px", background: p.bg, color: p.color,
        fontWeight: 700, fontSize: "0.86em", textDecoration: "none",
        border: `1px solid ${p.color}33`, whiteSpace: "nowrap", verticalAlign: "middle",
      }
      }
    >
      <span aria-hidden="true">{p.icon}</span>
      {children}
      <span aria-hidden="true" style={{ fontSize: "0.8em" }}>↗</span>
    </a >
  );
};

const ProductCard = ({ product, dark }) => {
  const platform = getPlatform(product.link);
  const icon = product.icon || platform.icon; // product-specific icon wins over the platform default
  return (
    <a href={product.link || "#"} target="_blank" rel="sponsored noopener noreferrer"
      className="flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{ background: dark ? "rgba(255,255,255,0.04)" : "#FFFFFF", borderColor: dark ? "rgba(255,255,255,0.08)" : "#EAE4DC" }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: dark ? "rgba(255,255,255,0.07)" : "#F5F1EB" }}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[0.88rem] font-semibold leading-snug mb-0.5 truncate" style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>{product.name}</div>
        <div className="flex items-center gap-2 flex-wrap">
          {product.rating && <span className="text-[0.72rem] font-bold text-amber-500">★ {product.rating}</span>}
          {product.price && <span className="text-[0.75rem] font-semibold" style={{ color: "#E60023" }}>{product.price}</span>}
          {platform.key !== "default" && (
            <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded" style={{ background: platform.color, color: "#fff" }}>{platform.label}</span>
          )}
        </div>
      </div>
      <div className="flex-shrink-0 text-[0.72rem] font-bold px-3 py-1.5 rounded-full" style={{ background: "#E60023", color: "#fff" }}>Buy →</div>
    </a>
  );
};

const AffiliateLinksSidebar = ({ content, dark, border, fallbackIcon }) => {
  // Extract markdown links from content
  const links = useMemo(() => {
    const regex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    const found = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      const href = match[2];
      if (isAffiliateLink(href)) {
        const platform = getPlatform(href);
        found.push({ label: match[1], href, platform });
      }
    }
    // Deduplicate by href
    return found.filter((v, i, a) => a.findIndex(x => x.href === v.href) === i).slice(0, 8);
  }, [content]);

  if (!links.length) return null;

  return (
    <div className="rounded-2xl overflow-hidden mb-4"
      style={{ background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF", border: `1px solid ${border}` }}>
      <div className="px-5 py-3 text-[0.65rem] font-bold tracking-[0.13em] uppercase"
        style={{ color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84", borderBottom: `1px solid ${border}` }}>
        🛒 Links in this post
      </div>
      <div className="p-4 flex flex-col gap-2.5">
        {links.map((item, i) => {
          const p = item.platform;
          return (
            <a key={i} href={item.href} target="_blank" rel="sponsored noopener noreferrer"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
              style={{ background: p.bg, borderColor: `${p.color}33`, textDecoration: "none" }}>
              <span className="text-base flex-shrink-0">{p.icon}</span>
              <span className="flex-1 text-[0.78rem] font-semibold leading-snug truncate"
                style={{ color: p.color }}>
                {item.label}
              </span>
              <span className="flex-shrink-0 text-[0.65rem] font-bold px-2 py-0.5 rounded-full"
                style={{ background: p.color, color: "#fff" }}>
                {p.label} ↗
              </span>
            </a>
          );
        })}
      </div>
      <div className="px-5 pb-4 text-[0.65rem] leading-relaxed"
        style={{ color: dark ? "rgba(250,248,244,0.3)" : "#9C8E84" }}>
        🔗 Affiliate links — same price for you, small commission for me.
      </div>
    </div>
  );
};

const PinterestPostLayout = ({ fm, content, dark, fontSize, border, layoutRef, tocItems, activeId, sectionProgress, progress, slug }) => (
  <div ref={layoutRef} className="max-w-[1280px] mx-auto px-6 pb-24 flex flex-col lg:flex-row gap-16 items-start justify-between relative">
    <main id="main-content" className="w-full lg:max-w-[calc(100%-446px)] min-w-0 flex-1">
      <article className="prose w-full" itemScope itemType="https://schema.org/BlogPosting">
        <meta itemProp="headline" content={fm.title} />
        <meta itemProp="datePublished" content={fm.date} />
        <meta itemProp="author" content={fm.author || SITE.name} />
        {(() => {
          const paragraphs = content.split("\n\n");
          const mid = Math.floor(paragraphs.length / 2);
          const firstHalf = paragraphs.slice(0, mid).join("\n\n");
          const secondHalf = paragraphs.slice(mid).join("\n\n");
          const mdComponents = {
            h2: ({ children, ...props }) => { const id = slugToId(String(children).replace(/\s+/g, " ").trim()); return <h2 id={id} {...props}>{children}</h2>; },
            h3: ({ children, ...props }) => { const id = slugToId(String(children).replace(/\s+/g, " ").trim()); return <h3 id={id} {...props}>{children}</h3>; },
            a: ({ href, children }) => <SmartLink href={href}>{children}</SmartLink>,
            p: ({ children }) => {
              const flatten = (node) => {
                if (node === null || node === undefined) return "";
                if (typeof node === "string") return node;
                if (typeof node === "number") return String(node);
                if (Array.isArray(node)) return node.map(flatten).join("");
                if (node?.props?.children !== undefined) return flatten(node.props.children);
                return "";
              };

              const text = flatten(children).trim();

              const youtubeMatch = text.match(
                /^::youtube\[([a-zA-Z0-9_-]{11})\](?:\{caption="([^"]*)"\})?$/
              );

              if (youtubeMatch) {
                return <YouTubeEmbed id={youtubeMatch[1]} caption={youtubeMatch[2] || ""} />;
              }

              return <p>{children}</p>;
            },
          };
          return (
            <>
              <ReactMarkdown components={mdComponents}>{firstHalf}</ReactMarkdown>
              <AdsterraNative adKey={import.meta.env.VITE_ADSTERRA_NATIVE} />
              <ReactMarkdown components={mdComponents}>{secondHalf}</ReactMarkdown>
            </>
          );
        })()}
        <ArticleTags tags={fm.tags} dark={dark} />
      </article>
    </main>
    <aside className="w-full lg:w-[380px] lg:shrink-0 z-20 self-start lg:sticky lg:top-[96px] flex flex-col gap-4" aria-label="Article actions panel">
      {fm.pinterest && (
        <a href={fm.pinterest} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all hover:opacity-90 shadow-sm"
          style={{ background: "#E60023", color: "#fff" }}>
          <PinterestIcon size={18} /> View on Pinterest
        </a>
      )}

      <SidebarCard header="In This Post" dark={dark} delay={0}>
        <SmartTOC tocItems={tocItems} activeId={activeId} sectionProgress={sectionProgress} overallProgress={progress} dark={dark} />
      </SidebarCard>

      <AffiliateLinksSidebar content={content} dark={dark} border={border} fallbackIcon={fm.emoji} />

      <AdsterraBanner adKey={import.meta.env.VITE_ADSTERRA_300x250} width={300} height={250} />

      {Array.isArray(fm.products) && fm.products.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF", border: `1px solid ${border}` }}>

          <div className="px-5 py-3 text-[0.65rem] font-bold tracking-[0.13em] uppercase" style={{ color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84", borderBottom: `1px solid ${border}` }}>Products in this post</div>
          <div className="p-4 flex flex-col gap-3">
            {fm.products.map((p, i) => <ProductCard key={i} product={p} dark={dark} />)}
          </div>
        </div>
      )}
      {Array.isArray(fm.products) && fm.products.length > 0 && (
        <p className="text-[0.68rem] leading-relaxed px-1 font-light" style={{ color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" }}>
          🔗 Some links are affiliate links. You pay the same price — I earn a small commission. Thank you for your support!
        </p>
      )}
      {Array.isArray(fm.tags) && fm.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {normalizeTags(fm.tags).map(tag => (
            <span key={tag} className="text-[0.72rem] font-semibold px-3.5 py-1.5 rounded-full border"
              style={{ background: dark ? "rgba(255,255,255,0.05)" : "#F5F1EB", color: dark ? "rgba(250,248,244,0.7)" : "#3D3530", borderColor: dark ? "rgba(255,255,255,0.09)" : "#DDD7CE" }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </aside>
  </div>
);

const FloatingShareBar = ({ title, dark }) => {
  const [copied, setCopied] = useState(false);
  const [instaCopied, setInstaCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const shareNative = async () => { if (navigator.share) { try { await navigator.share({ title, url }); } catch (_) { } } else { copyLink(); } };
  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(title + " " + url)}`, "_blank", "noopener");
  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "noopener");
  const shareLinkedIn = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener");
  const shareTelegram = () => window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank", "noopener");
  const shareInstagram = async () => {
    await navigator.clipboard.writeText(url);
    setInstaCopied(true);
    setTimeout(() => { setInstaCopied(false); window.open("https://www.instagram.com", "_blank", "noopener"); }, 800);
  };

  const buttons = [
    { label: "Share", icon: <ShareIcon />, onClick: shareNative, color: dark ? "#FAF8F4" : "#1A1612" },
    { label: copied ? "Copied!" : "Copy", icon: copied ? <CheckIcon /> : <CopyIcon />, onClick: copyLink, color: copied ? "#22543D" : (dark ? "#FAF8F4" : "#1A1612") },
    { label: "WhatsApp", onClick: shareWhatsApp, color: "#25D366", icon: <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg> },
    { label: "Telegram", onClick: shareTelegram, color: "#26A5E4", icon: <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" /></svg> },
    { label: "Facebook", onClick: shareFacebook, color: "#1877F2", icon: <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg> },
    { label: "LinkedIn", onClick: shareLinkedIn, color: "#0A66C2", icon: <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg> },
    { label: instaCopied ? "Copied!" : "Instagram", onClick: shareInstagram, color: instaCopied ? "#22543D" : "#E1306C", icon: <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg> },
  ];

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-2 hidden lg:flex" data-floating-share style={{ animation: "fadeUp 0.6s ease forwards" }}>
      {buttons.map((btn) => (
        <button key={btn.label} onClick={btn.onClick} title={btn.label}
          className="group relative w-10 h-10 flex items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-110 hover:-translate-x-1"
          style={{ background: dark ? "rgba(255,255,255,0.06)" : "#FFFFFF", border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "#EAE4DC"}`, color: btn.color }}
          aria-label={btn.label}>
          {btn.icon}
          <span className="absolute left-12 px-2.5 py-1 rounded-lg text-[0.7rem] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
            style={{ background: dark ? "#FAF8F4" : "#1A1612", color: dark ? "#1A1612" : "#FAF8F4" }}>
            {btn.label}
          </span>
        </button>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════
// COMMENT SECTION
// ═══════════════════════════════════════════════

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const CommentSection = ({ slug, dark }) => {
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
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/comments?slug=eq.${encodeURIComponent(slug)}&approved=eq.true&order=created_at.desc`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch { setComments([]); }
    finally { setLoading(false); }
  }, [slug]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true); setError("");
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
        method: "POST",
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ slug, name: name.trim(), message: message.trim() }),
      });
      if (!res.ok) throw new Error();
      setDone(true); setName(""); setMessage("");
      setTimeout(() => { setDone(false); fetchComments(); }, 2000);
    } catch { setError("Failed to post comment. Please try again."); }
    finally { setSubmitting(false); }
  };

  const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: "10px", border: `1.5px solid ${dark ? "rgba(255,255,255,0.1)" : "#DDD7CE"}`, background: dark ? "rgba(255,255,255,0.05)" : "#FAF8F4", color: dark ? "#FAF8F4" : "#1A1612", fontSize: "0.88rem", outline: "none", fontFamily: "Outfit, sans-serif", boxSizing: "border-box" };

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-16" style={{ borderTop: `1px solid ${border}` }}>
      <div className="max-w-[760px] mx-auto">
        <p className="text-[0.72rem] font-bold tracking-[0.12em] uppercase mb-2" style={{ color: "#E60023" }}>Discussion</p>
        <h2 className="font-['DM_Serif_Display',serif] text-[1.9rem] mb-10" style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>
          {loading ? "Comments" : `${comments.length} Comment${comments.length !== 1 ? "s" : ""}`}
        </h2>
        <div className="rounded-2xl p-6 mb-10" style={{ background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF", border: `1px solid ${border}` }}>
          <div className="text-[0.85rem] font-semibold mb-4" style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>Leave a comment</div>
          <form onSubmit={submit} className="flex flex-col gap-3">
            <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required maxLength={60} style={inputStyle} />
            <textarea placeholder="Write your comment..." value={message} onChange={e => setMessage(e.target.value)} required maxLength={1000} rows={4} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
            {error && <p className="text-[0.78rem]" style={{ color: "#E60023" }}>{error}</p>}
            <button type="submit" disabled={submitting || !name.trim() || !message.trim()}
              className="self-start px-6 py-2.5 rounded-xl text-[0.82rem] font-bold transition-all hover:opacity-80 disabled:opacity-40"
              style={{ background: done ? "#22543D" : "#1A1612", color: "#FAF8F4", cursor: submitting ? "wait" : "pointer" }}>
              {done ? "✓ Posted!" : submitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>
        {loading ? (
          <div className="space-y-4">{[1, 2].map(i => <div key={i} className="animate-pulse rounded-2xl p-5 h-24" style={{ background: dark ? "rgba(255,255,255,0.04)" : "#F5F1EB" }} />)}</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-14 rounded-2xl" style={{ background: dark ? "rgba(255,255,255,0.02)" : "#F9F6F1", border: `1px dashed ${border}` }}>
            <div className="text-3xl mb-3">💬</div>
            <p className="text-[0.88rem]" style={{ color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" }}>No comments yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map(c => (
              <div key={c.id} className="rounded-2xl p-5" style={{ background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF", border: `1px solid ${border}` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ background: "#1A1612", color: "#FAF8F4" }}>{c.name[0]?.toUpperCase()}</div>
                  <div>
                    <div className="text-[0.85rem] font-semibold" style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>{c.name}</div>
                    <div className="text-[0.72rem]" style={{ color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" }}>
                      {new Date(c.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  </div>
                </div>
                <p className="text-[0.88rem] leading-relaxed" style={{ color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" }}>{c.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const PrevNextNav = ({ allPosts, currentSlug, dark }) => {
  if (!allPosts?.length) return null;

  const currentIdx = allPosts.findIndex(p => p.slug === currentSlug);
  const prev = currentIdx > 0 ? allPosts[currentIdx - 1] : null;
  const next = currentIdx < allPosts.length - 1 ? allPosts[currentIdx + 1] : null;

  if (!prev && !next) return null;

  const border = dark ? "rgba(255,255,255,0.07)" : "#EAE4DC";
  const bg = dark ? "rgba(255,255,255,0.03)" : "#FFFFFF";

  return (
    <div className="max-w-[1280px] mx-auto px-6 pb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        style={{ borderTop: `1px solid ${border}`, paddingTop: "2.5rem" }}>
        {prev && (
          <Link to={`/blog/${prev.slug}`}
            className="group flex flex-col gap-2 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
            style={{ background: bg, borderColor: border, textDecoration: "none" }}>
            <span className="text-[0.68rem] font-bold uppercase tracking-widest"
              style={{ color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" }}>← Older Post</span>
            <span className="font-['DM_Serif_Display',serif] text-[1rem] leading-snug group-hover:text-[#E60023] transition-colors"
              style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>{prev.title}</span>
          </Link>
        )}
        {next && (
          <Link to={`/blog/${next.slug}`}
            className="group flex flex-col gap-2 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 sm:text-right sm:items-end"
            style={{ background: bg, borderColor: border, textDecoration: "none" }}>
            <span className="text-[0.68rem] font-bold uppercase tracking-widest"
              style={{ color: dark ? " rgba(250,248,244,0.6)" : "#9C8E84" }}>Newer Post →</span>
            <span className="font-['DM_Serif_Display',serif] text-[1rem] leading-snug group-hover:text-[#E60023] transition-colors"
              style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>{next.title}</span>
          </Link>
        )}
      </div>
    </div>
  );
};

function useViewCount(slug) {
  const [views, setViews] = useState(null);

  useEffect(() => {
    if (!slug || !SUPABASE_URL || !SUPABASE_ANON_KEY || !hasConsent()) return;

    const track = async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_view`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug: slug }),
        });
        const count = await res.json();
        if (typeof count === "number") setViews(count);
      } catch { /* silent */ }
    };

    track();
  }, [slug]);

  return views;
}

// ═══════════════════════════════════════════════
// YOUTUBE EMBED
// ═══════════════════════════════════════════════

const YouTubeEmbed = ({ id, caption }) => {
  const [loaded, setLoaded] = useState(false);
  const [dark, setDark] = useState(
    () => typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "dark"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.getAttribute("data-theme") === "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  if (!id) return null;

  return (
    <div
      className="my-8 rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "#EAE4DC"}` }}
    >
      {!loaded ? (
        <div
          onClick={() => setLoaded(true)}
          className="relative cursor-pointer group"
          style={{ aspectRatio: "16/9", background: "#000" }}
        >
          <img decoding="async" fetchPriority="low"
            src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
            alt={caption || "YouTube video"}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300"
            onError={e => { e.currentTarget.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`; }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
              style={{ background: "#E60023" }}
            >
              <svg viewBox="0 0 24 24" fill="white" width={28} height={28}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-3 right-3 bg-black/60 px-2 py-0.5 rounded text-white text-xs font-bold">
            ▶ YouTube
          </div>
        </div>
      ) : (
        <div
          style={{ aspectRatio: "16/9", position: "relative" }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
            title={caption || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0, left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>
      )}

      {caption && (
        <div
          className="px-5 py-3 text-[0.78rem] text-center font-medium"
          style={{
            color: dark ? "rgba(250,248,244,0.55)" : "#7A6E64",
            borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "#EAE4DC"}`,
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════

export default function ReadBlog() {
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
  const [morePosts, setMorePosts] = useState(
    initialManifestPosts.filter(p => p.slug && p.slug !== slug).slice(0, 6)
  );
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

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(false);
    window.scrollTo({ top: 0, behavior: "instant" });

    const loadBlog = async () => {
      try {
        const currentRes = await fetch(`/blogs/${slug}.md`);
        if (!currentRes.ok) throw new Error("BLOG_NOT_FOUND");

        const contentType = currentRes.headers.get("content-type") || "";
        if (contentType.includes("text/html")) throw new Error("BLOG_NOT_FOUND");

        const raw = await currentRes.text();

        if (raw.trimStart().startsWith("<!doctype") || raw.trimStart().startsWith("<html")) {
          throw new Error("BLOG_NOT_FOUND");
        }

        const { data, content: body } = sharedParseFrontmatter(raw);

        // Strip HTML comments like <!-- ... -->
        const cleanBody = body.replace(/<!--[\s\S]*?-->/g, "").trim();

        setFm(data);
        setContent(cleanBody);
        setTocItems(buildTOC(cleanBody));
        const storedBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
        setBookmarked(storedBookmarks.includes(slug));

        try {
          const manifestRes = await fetch("/blogs/manifest.json");
          if (!manifestRes.ok) { setMorePosts([]); setAllPosts([]); return; }

          const manifestType = manifestRes.headers.get("content-type") || "";
          if (manifestType.includes("text/html")) { setMorePosts([]); setAllPosts([]); return; }

          const manifest = await manifestRes.json();
          const posts = manifest.posts || [];
          setAllPosts(posts);
          setMorePosts(posts.filter(p => p.slug && p.slug !== slug).slice(0, 6));
        } catch { setMorePosts([]); setAllPosts([]); }
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
    const next = bookmarked ? stored.filter(s => s !== slug) : [...stored, slug];
    localStorage.setItem("bookmarks", JSON.stringify(next));
    setBookmarked(!bookmarked);
  }, [bookmarked, slug]);

  if (loading) return <LoadingSkeleton dark={dark} />;
  if (error) return <ErrorState slug={slug} dark={dark} />;

  const bg = dark ? "#0F0E0D" : "#FAF8F4";
  const border = dark ? "rgba(255,255,255,0.07)" : "#EAE4DC";

  return (
    <>
      <SEOHead frontmatter={fm} slug={slug} content={content} morePosts={morePosts} />
      <style>{`
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

        html { scroll-behavior: smooth; overflow-anchor: none; }
        html, body { min-height: 100%; overflow-anchor: none; }

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
      `}</style>

      <SelectionToolbar tooltip={selTooltip} onClose={() => setSelTooltip(null)} dark={dark} onHighlight={saveHighlight} />
      <ScrollToTop show={showScrollTop} dark={dark} />
      <FloatingShareBar title={fm.title} dark={dark} />

      <div style={{ background: bg, minHeight: "100vh" }}>
        <ProgressBar progress={progress} />

        <Navbar
          dark={dark} toggleDark={toggleDark}
          fontSize={fontSize} incFont={incFont} decFont={decFont}
          readingMode={readingMode} toggleReadingMode={toggleReadingMode}
          content={content}
        />

        <Breadcrumb category={fm.category} title={fm.title} dark={dark} />

        <ArticleHeader
          fm={fm} readTime={readTime} dark={dark}
          onBookmark={toggleBookmark} bookmarked={bookmarked}
          finishTime={finishTime} streak={streak} views={views}
        />

        <HeroImage src={fm.image} alt={fm.imageAlt || fm.title} pinterest={fm.type === "pinterest"} />


        <div className="max-w-[1280px] mx-auto px-6 mb-8">
          <AdsterraBanner adKey={import.meta.env.VITE_ADSTERRA_728x90} width={728} height={90} />
        </div>

        {fm.type === "pinterest" ? (
          <PinterestPostLayout
            fm={fm} content={content} dark={dark} fontSize={fontSize} border={border} layoutRef={layoutRef}
            tocItems={tocItems} activeId={activeId} sectionProgress={sectionProgress} progress={progress} slug={slug}
          />
        ) : (
          <div ref={layoutRef} className="max-w-[1280px] mx-auto px-6 pb-24 flex flex-col lg:flex-row gap-16 items-start justify-between relative">

            {/* ARTICLE */}
            <main id="main-content" className="w-full lg:max-w-[calc(100%-386px)] min-w-0 flex-1">
              <article className="prose w-full" itemScope itemType="https://schema.org/BlogPosting">
                <meta itemProp="headline" content={fm.title} />
                <meta itemProp="datePublished" content={fm.date} />
                <meta itemProp="author" content={fm.author || SITE.name} />

                <KeyTakeawaysBox takeaways={fm.takeaways} dark={dark} />

                <ReactMarkdown
                  components={{
                    h2: ({ children, ...props }) => {
                      const id = slugToId(String(children).replace(/\s+/g, " ").trim());
                      return <h2 id={id} {...props}>{children}</h2>;
                    },
                    h3: ({ children, ...props }) => {
                      const id = slugToId(String(children).replace(/\s+/g, " ").trim());
                      return <h3 id={id} {...props}>{children}</h3>;
                    },
                    a: ({ href, children }) => <SmartLink href={href}>{children}</SmartLink>,

                    // ← ADD THIS BLOCK
                    p: ({ children }) => {
                      const flatten = (node) => {
                        if (node === null || node === undefined) return "";
                        if (typeof node === "string") return node;
                        if (typeof node === "number") return String(node);
                        if (Array.isArray(node)) return node.map(flatten).join("");
                        if (node?.props?.children !== undefined) return flatten(node.props.children);
                        return "";
                      };
                      const text = flatten(children).trim();

                      const youtubeMatch = text.match(
                        /^::youtube\[([a-zA-Z0-9_-]{11})\](?:\{caption="([^"]*)"\})?$/
                      );

                      if (youtubeMatch) {
                        return (
                          <YouTubeEmbed
                            id={youtubeMatch[1]}
                            caption={youtubeMatch[2] || ""}
                          />
                        );
                      }

                      return <p>{children}</p>;
                    },
                  }}
                >
                  {content}
                </ReactMarkdown>

                <AdsterraBanner adKey={import.meta.env.VITE_ADSTERRA_NATIVE} width={300} height={250} />

                <ReactionBar slug={slug} dark={dark} border={border} supabaseUrl={SUPABASE_URL} supabaseKey={SUPABASE_ANON_KEY} />

                <ArticleTags tags={fm.tags} dark={dark} />

                <FAQSection faqs={fm.faqs} dark={dark} border={border} />
              </article>
            </main>

            {/* SIDEBAR */}
            <aside className="w-full lg:w-[320px] lg:shrink-0 z-20 self-start lg:sticky lg:top-[96px]" aria-label="Article sidebar">
              <div ref={sidebarScrollRef} className="no-scrollbar w-full pb-4">

                <SidebarCard header="In This Post" dark={dark} delay={0}>
                  <SmartTOC key={slug} tocItems={tocItems} activeId={activeId} sectionProgress={sectionProgress} overallProgress={progress} dark={dark} />
                </SidebarCard>

                <AISummaryCard content={content} dark={dark} border={border} />

                <AffiliateLinksSidebar content={content} dark={dark} border={border} fallbackIcon={fm.emoji} />


                <AdsterraBanner adKey={import.meta.env.VITE_ADSTERRA_300x250} width={300} height={250} />

                <HighlightsPanel slug={slug} dark={dark} border={border} />

                <SidebarCard header="About the Author" dark={dark} delay={80}>
                  <AuthorCard author={fm.author} dark={dark} />
                </SidebarCard>

                <SidebarCard header="More Posts" dark={dark} delay={240}>
                  {morePosts.length > 0 ? (
                    morePosts.map((p, i) => <MorePostItem key={p.slug || i} post={p} dark={dark} isLast={i === morePosts.length - 1} />)
                  ) : (
                    <div className="text-[0.8rem]" style={{ color: dark ? "rgba(250,248,244,0.655)" : "#7A6E64" }}>No more posts available.</div>
                  )}
                </SidebarCard>
              </div>
            </aside>
          </div>
        )}

        <PrevNextNav allPosts={allPosts} currentSlug={slug} dark={dark} />

        <CommentSection slug={slug} dark={dark} />

        <div className="max-w-[1280px] mx-auto px-6 mb-4">
          <AdsterraBanner adKey={import.meta.env.VITE_ADSTERRA_728x90} width={728} height={90} />
        </div>
        {/* RELATED */}
        <section className="max-w-[1280px] mx-auto px-6 pt-16 pb-24 border-t z-30 relative" style={{ borderColor: border, background: bg }}>
          <div className="mb-8">
            <p className="text-[0.72rem] font-bold tracking-[0.12em] uppercase mb-2" style={{ color: "#E60023" }}>Keep Reading</p>
            <h2 className="font-['DM_Serif_Display',serif] text-[1.9rem]" style={{ color: dark ? "#FAF8F4" : "#1A1612" }}>You might also like</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(() => {
              const currentIdx = allPosts.findIndex(p => p.slug === slug);
              const prevSlug = currentIdx > 0 ? allPosts[currentIdx - 1]?.slug : null;
              const nextSlug = currentIdx < allPosts.length - 1 ? allPosts[currentIdx + 1]?.slug : null;
              const related = morePosts
                .filter(p => p.slug !== prevSlug && p.slug !== nextSlug)
                .slice(0, 3);
              return related.length > 0
                ? related.map((p, i) => <RelatedCard key={p.slug || i} post={p} delay={i * 80} dark={dark} />)
                : <div className="text-sm" style={{ color: dark ? "rgba(250,248,244,0.655)" : "#7A6E64" }}>No related posts available.</div>;
            })()}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="relative z-10 overflow-hidden" style={{ background: "#0F0E0D" }}>

          <div className="h-px w-full"
            style={{ background: "linear-gradient(90deg, transparent, #E60023, transparent)" }} />

          <div className="max-w-[1280px] mx-auto px-6 pt-16 pb-10">

            <div className="flex flex-col lg:flex-row justify-between gap-12 pb-12"
              style={{ borderBottom: "1px solid rgba(250,248,244,0.07)" }}>

              <div className="max-w-[320px]">
                <Link to="/"
                  className="font-['DM_Serif_Display',serif] text-[2rem] mb-3 inline-block"
                  style={{ color: "#FAF8F4", textDecoration: "none" }}>
                  Veeresh<span style={{ color: "#E60023" }}>.</span>
                </Link>
                <p className="text-[0.82rem] leading-relaxed mb-6"
                  style={{ color: "rgba(250,248,244,0.65)" }}>
                  Writing about small things that make life better. Based in Hubballi, India.
                </p>
                <div className="flex items-center gap-3">
                  <a href={SITE.pinterestUrl} target="_blank" rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:opacity-90"
                    style={{ background: "#E60023", color: "#fff" }}
                    aria-label="Pinterest">
                    <PinterestIcon size={15} />
                  </a>
                  <a href={`mailto:${SITE.email}`}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 hover:opacity-90"
                    style={{ background: "rgba(255,255,255,0.08)", color: "#fff" }}
                    aria-label="Email">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
                      strokeLinecap="round" strokeLinejoin="round" width={15} height={15}>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16">

                <div>
                  <div className="text-[0.65rem] font-bold tracking-[0.15em] uppercase mb-4"
                    style={{ color: "#E60023" }}>
                    Explore
                  </div>
                  <ul className="space-y-2.5 list-none m-0 p-0">
                    {[
                      { label: "All Posts", to: "/blog" },
                      { label: "Categories", to: "/categories" },
                      { label: "Saved Pins", to: "/saved" },
                      { label: "Pinterest Boards", href: SITE.pinterestUrl, external: true },
                    ].map(link => (
                      <li key={link.label}>
                        {link.external ? (
                          <a href={link.href} target="_blank" rel="noopener noreferrer"
                            className="text-[0.8rem] transition-all duration-200 hover:opacity-100 hover:translate-x-1 inline-block"
                            style={{ color: "rgba(250,248,244,0.655)", textDecoration: "none" }}>
                            {link.label}
                          </a>
                        ) : (
                          <Link to={link.to}
                            className="text-[0.8rem] transition-all duration-200 hover:opacity-100 hover:translate-x-1 inline-block"
                            style={{ color: "rgba(250,248,244,0.655)", textDecoration: "none" }}>
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-[0.65rem] font-bold tracking-[0.15em] uppercase mb-4"
                    style={{ color: "#E60023" }}>
                    Topics
                  </div>
                  <ul className="space-y-2.5 list-none m-0 p-0">
                    {[
                      { label: "Career", to: "/category/career" },
                      { label: "Life Lessons", to: "/category/life-lessons" },
                      { label: "Pinterest Picks", to: "/category/pinterest-picks" },
                      { label: "Finance", to: "/category/finance" },
                    ].map(link => (
                      <li key={link.label}>
                        <Link to={link.to}
                          className="text-[0.8rem] transition-all duration-200 hover:opacity-100 hover:translate-x-1 inline-block"
                          style={{ color: "rgba(250,248,244,0.655)", textDecoration: "none" }}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-[0.65rem] font-bold tracking-[0.15em] uppercase mb-4"
                    style={{ color: "#E60023" }}>
                    Connect
                  </div>
                  <ul className="space-y-2.5 list-none m-0 p-0">
                    {[
                      { label: "About Me", to: "/about" },
                      { label: "Contact", href: `mailto:${SITE.email}` },
                      { label: "Privacy Policy", to: "/privacy-policy" },
                      { label: "Terms of Use", to: "/terms" },
                    ].map(link => (
                      <li key={link.label}>
                        {link.href ? (
                          <a href={link.href}
                            className="text-[0.8rem] transition-all duration-200 hover:opacity-100 hover:translate-x-1 inline-block"
                            style={{ color: "rgba(250,248,244,0.655)", textDecoration: "none" }}>
                            {link.label}
                          </a>
                        ) : (
                          <Link to={link.to}
                            className="text-[0.8rem] transition-all duration-200 hover:opacity-100 hover:translate-x-1 inline-block"
                            style={{ color: "rgba(250,248,244,0.655)", textDecoration: "none" }}>
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>

            <div className="py-10 flex flex-col md:flex-row items-center justify-between gap-6"
              style={{ borderBottom: "1px solid rgba(250,248,244,0.07)" }}>
              <div>
                <div className="font-['DM_Serif_Display',serif] text-[1.1rem] mb-1"
                  style={{ color: "#FAF8F4" }}>
                  Follow on Pinterest
                </div>
                <p className="text-[0.78rem]" style={{ color: "rgba(250,248,244,0.65)" }}>
                  Get visual inspiration and curated finds every day.
                </p>
              </div>
              <a href={SITE.pinterestUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold text-[0.82rem] px-6 py-3 rounded-full transition-all duration-300 hover:opacity-90 hover:-translate-y-px flex-shrink-0"
                style={{ background: "#E60023", color: "#fff" }}>
                <PinterestIcon size={14} /> Follow on Pinterest
              </a>
            </div>

            <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[0.72rem]"
                style={{ color: " rgba(250,248,244,0.5)" }}>
                <span>© {new Date().getFullYear()} Veeresh Bashetti.</span>
                <span className="w-1 h-1 rounded-full inline-block"
                  style={{ background: "rgba(250,248,244,0.2)" }} />
                <span>All rights reserved.</span>
              </div>
              <div className="flex items-center gap-1.5 text-[0.72rem]"
                style={{ color: "rgba(250,248,244,0.2)" }}>
                <span>Made with</span>
                <span style={{ color: "#E60023" }}>♥</span>
                <span>in Hubballi, India</span>
              </div>
            </div>

          </div>
        </footer>

      </div >
    </>
  );
}