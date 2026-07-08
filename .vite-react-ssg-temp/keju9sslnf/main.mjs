import { ViteReactSSG } from "vite-react-ssg";
import { Suspense, createContext, lazy, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import { jsx, jsxs } from "react/jsx-runtime";
import fs from "node:fs";
import path from "node:path";
//#region src/pages/CookieBanner.jsx
var CONSENT_KEY = "cookie_consent";
var hasConsent = () => {
	if (typeof window === "undefined") return false;
	try {
		return localStorage.getItem(CONSENT_KEY) !== null;
	} catch {
		return false;
	}
};
var fireConsentEvent = (status, prefs) => {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new CustomEvent("cookieConsentChanged", { detail: {
		status,
		prefs
	} }));
};
var CATEGORIES = [
	{
		id: "necessary",
		title: "Strictly Necessary",
		description: "Essential for the site to function. These cannot be disabled.",
		locked: true
	},
	{
		id: "analytics",
		title: "Analytics",
		description: "Help us understand how visitors interact with the site so we can improve it.",
		locked: false
	},
	{
		id: "marketing",
		title: "Marketing",
		description: "Used to deliver personalized content and measure advertising campaigns.",
		locked: false
	}
];
var CookieIcon = ({ size = 22 }) => /* @__PURE__ */ jsxs("svg", {
	width: size,
	height: size,
	viewBox: "0 0 24 24",
	fill: "none",
	xmlns: "http://www.w3.org/2000/svg",
	"aria-hidden": "true",
	children: [
		/* @__PURE__ */ jsx("path", {
			d: "M21.5 11.5a3 3 0 0 1-3-3 3 3 0 0 1-3-3 3 3 0 0 1-3-3A9.5 9.5 0 1 0 21.5 11.5z",
			fill: "url(#ck-grad)"
		}),
		/* @__PURE__ */ jsx("circle", {
			cx: "9",
			cy: "10",
			r: "1.1",
			fill: "#1A1612"
		}),
		/* @__PURE__ */ jsx("circle", {
			cx: "13.5",
			cy: "13.5",
			r: "1.1",
			fill: "#1A1612"
		}),
		/* @__PURE__ */ jsx("circle", {
			cx: "15.5",
			cy: "9",
			r: "0.85",
			fill: "#1A1612"
		}),
		/* @__PURE__ */ jsx("circle", {
			cx: "10",
			cy: "15.5",
			r: "0.85",
			fill: "#1A1612"
		}),
		/* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", {
			id: "ck-grad",
			x1: "2",
			y1: "2",
			x2: "22",
			y2: "22",
			children: [/* @__PURE__ */ jsx("stop", {
				offset: "0%",
				stopColor: "#FF5571"
			}), /* @__PURE__ */ jsx("stop", {
				offset: "100%",
				stopColor: "#E60023"
			})]
		}) })
	]
});
var Toggle = ({ checked, locked, onChange, id }) => /* @__PURE__ */ jsx("button", {
	type: "button",
	role: "switch",
	"aria-checked": checked,
	"aria-labelledby": `${id}-label`,
	disabled: locked,
	onClick: () => !locked && onChange(!checked),
	className: [
		"relative inline-flex h-[26px] w-[46px] shrink-0 items-center rounded-full",
		"transition-colors duration-200 ease-out",
		"focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1A1612]",
		locked ? "cursor-not-allowed opacity-50" : "cursor-pointer",
		checked ? "bg-[#E60023]" : "bg-white/15"
	].join(" "),
	children: /* @__PURE__ */ jsx("span", { className: [
		"inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-md",
		"transition-transform duration-200 ease-out",
		checked ? "translate-x-[23px]" : "translate-x-[3px]"
	].join(" ") })
});
var CookieBanner = () => {
	const [visible, setVisible] = useState(false);
	const [closing, setClosing] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [prefs, setPrefs] = useState({
		necessary: true,
		analytics: true,
		marketing: false
	});
	const enterTimer = useRef(null);
	useEffect(() => {
		try {
			if (localStorage.getItem("cookie_consent")) return;
		} catch {
			return;
		}
		enterTimer.current = setTimeout(() => setVisible(true), 500);
		return () => clearTimeout(enterTimer.current);
	}, []);
	useEffect(() => {
		const onReset = () => {
			setShowSettings(false);
			setClosing(false);
			setVisible(true);
		};
		window.addEventListener("cookieConsentReset", onReset);
		return () => window.removeEventListener("cookieConsentReset", onReset);
	}, []);
	const persist = (status, preferences) => {
		try {
			localStorage.setItem(CONSENT_KEY, JSON.stringify({
				status,
				prefs: preferences,
				ts: Date.now()
			}));
		} catch {}
		fireConsentEvent(status, preferences);
	};
	const dismiss = (status, preferences) => {
		persist(status, preferences);
		setClosing(true);
		setTimeout(() => {
			setVisible(false);
			setClosing(false);
		}, 380);
	};
	const acceptAll = () => dismiss("accepted", {
		necessary: true,
		analytics: true,
		marketing: true
	});
	const declineAll = () => dismiss("declined", {
		necessary: true,
		analytics: false,
		marketing: false
	});
	const saveCustom = () => dismiss("custom", prefs);
	if (!visible) return null;
	return /* @__PURE__ */ jsx("div", {
		role: "dialog",
		"aria-modal": "false",
		"aria-labelledby": "cookie-banner-title",
		className: [
			"fixed inset-x-0 bottom-0 z-[9999]",
			"px-3 pb-3 sm:px-5 sm:pb-5 md:px-6 md:pb-6",
			"transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
			closing ? "translate-y-[120%] opacity-0" : "translate-y-0 opacity-100"
		].join(" "),
		children: /* @__PURE__ */ jsx("div", {
			className: "mx-auto w-full max-w-3xl",
			children: /* @__PURE__ */ jsxs("div", {
				className: [
					"relative overflow-hidden rounded-2xl sm:rounded-3xl",
					"border border-white/10",
					"shadow-[0_-12px_60px_-12px_rgba(0,0,0,0.6)]",
					"backdrop-blur-2xl"
				].join(" "),
				style: { background: "linear-gradient(180deg, rgba(34,28,22,0.94) 0%, rgba(20,16,12,0.94) 100%)" },
				children: [/* @__PURE__ */ jsx("div", {
					"aria-hidden": true,
					className: "pointer-events-none absolute inset-x-0 top-0 h-px",
					style: { background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.20) 50%, transparent 100%)" }
				}), !showSettings ? /* @__PURE__ */ jsxs("div", {
					className: "p-4 sm:p-5 md:p-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col gap-3.5 sm:flex-row sm:items-start sm:gap-4 md:gap-5",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10 sm:h-11 sm:w-11",
								children: /* @__PURE__ */ jsx(CookieIcon, { size: 20 })
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ jsx("h2", {
									id: "cookie-banner-title",
									className: "text-[14.5px] font-semibold leading-tight tracking-[-0.01em] text-white sm:text-[15px]",
									children: "We value your privacy"
								}), /* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-[12.5px] leading-relaxed text-white/55 sm:text-[13px]",
									children: [
										"We use cookies to enhance browsing, serve personalized content, and analyze traffic.",
										" ",
										/* @__PURE__ */ jsx("a", {
											href: "/privacy-policy",
											className: "font-medium text-white/70 underline decoration-white/30 underline-offset-2 transition-colors hover:text-white hover:decoration-white/60",
											children: "Privacy Policy"
										})
									]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "hidden shrink-0 flex-col items-end gap-1.5 sm:flex",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ jsx("button", {
										onClick: declineAll,
										className: "h-10 rounded-full px-4 text-[13px] font-semibold transition-all duration-200 hover:bg-white/[0.08] md:px-5",
										style: {
											background: "rgba(255,255,255,0.05)",
											color: "rgba(255,255,255,0.78)",
											border: "1px solid rgba(255,255,255,0.10)"
										},
										children: "Decline"
									}), /* @__PURE__ */ jsx("button", {
										onClick: acceptAll,
										className: "h-10 rounded-full px-5 text-[13px] font-semibold text-white shadow-[0_6px_20px_-6px_rgba(230,0,35,0.5)] transition-all duration-200 hover:shadow-[0_8px_28px_-6px_rgba(230,0,35,0.65)] active:scale-[0.98] md:px-6",
										style: { background: "#E60023" },
										onMouseEnter: (e) => e.currentTarget.style.background = "#FF1A3D",
										onMouseLeave: (e) => e.currentTarget.style.background = "#E60023",
										children: "Accept All"
									})]
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => setShowSettings(true),
									className: "text-[11.5px] font-medium text-white/45 transition-colors hover:text-white/80",
									children: "Customize settings"
								})]
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-4 flex flex-col gap-2 sm:hidden",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: declineAll,
								className: "h-10 flex-1 rounded-full text-[13px] font-semibold transition-all duration-200 active:scale-[0.98]",
								style: {
									background: "rgba(255,255,255,0.05)",
									color: "rgba(255,255,255,0.78)",
									border: "1px solid rgba(255,255,255,0.10)"
								},
								children: "Decline"
							}), /* @__PURE__ */ jsx("button", {
								onClick: acceptAll,
								className: "h-10 flex-1 rounded-full text-[13px] font-semibold text-white shadow-[0_6px_20px_-6px_rgba(230,0,35,0.5)] transition-all duration-200 active:scale-[0.98]",
								style: { background: "#E60023" },
								children: "Accept All"
							})]
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setShowSettings(true),
							className: "h-8 w-full text-[12px] font-medium text-white/55 transition-colors hover:text-white/85",
							children: "Customize settings →"
						})]
					})]
				}) : /* @__PURE__ */ jsxs("div", {
					className: "p-4 sm:p-6",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-4 flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ jsx("h2", {
									className: "text-[15px] font-semibold tracking-[-0.01em] text-white sm:text-base",
									children: "Cookie Preferences"
								}), /* @__PURE__ */ jsx("p", {
									className: "mt-0.5 text-[12.5px] text-white/50",
									children: "Choose which cookies you want to allow."
								})]
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => setShowSettings(false),
								"aria-label": "Close settings",
								className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/55 transition-all hover:bg-white/5 hover:text-white",
								children: /* @__PURE__ */ jsx("svg", {
									width: "14",
									height: "14",
									viewBox: "0 0 24 24",
									fill: "none",
									children: /* @__PURE__ */ jsx("path", {
										d: "M18 6L6 18M6 6l12 12",
										stroke: "currentColor",
										strokeWidth: "2",
										strokeLinecap: "round"
									})
								})
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "space-y-1",
							children: CATEGORIES.map((cat) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-start justify-between gap-4 rounded-xl p-3 transition-colors hover:bg-white/[0.025]",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ jsxs("h3", {
										id: `${cat.id}-label`,
										className: "flex flex-wrap items-center gap-2 text-[13.5px] font-semibold text-white",
										children: [cat.title, cat.locked && /* @__PURE__ */ jsx("span", {
											className: "rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[9.5px] font-medium uppercase tracking-wider text-white/55",
											children: "Always on"
										})]
									}), /* @__PURE__ */ jsx("p", {
										className: "mt-0.5 text-[12.5px] leading-relaxed text-white/50",
										children: cat.description
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "pt-0.5",
									children: /* @__PURE__ */ jsx(Toggle, {
										id: cat.id,
										checked: prefs[cat.id],
										locked: cat.locked,
										onChange: (v) => setPrefs((p) => ({
											...p,
											[cat.id]: v
										}))
									})
								})]
							}, cat.id))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: declineAll,
								className: "text-[12.5px] font-medium text-white/45 transition-colors hover:text-white/85",
								children: "Reject all"
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ jsx("button", {
									onClick: saveCustom,
									className: "h-10 flex-1 rounded-full px-4 text-[13px] font-semibold text-white/85 transition-all duration-200 hover:bg-white/[0.08] sm:flex-none sm:px-5",
									style: {
										background: "rgba(255,255,255,0.05)",
										border: "1px solid rgba(255,255,255,0.10)"
									},
									children: "Save preferences"
								}), /* @__PURE__ */ jsx("button", {
									onClick: acceptAll,
									className: "h-10 flex-1 rounded-full px-4 text-[13px] font-semibold text-white shadow-[0_6px_20px_-6px_rgba(230,0,35,0.5)] transition-all duration-200 hover:shadow-[0_8px_28px_-6px_rgba(230,0,35,0.65)] active:scale-[0.98] sm:flex-none sm:px-6",
									style: { background: "#E60023" },
									children: "Accept all"
								})]
							})]
						})
					]
				})]
			})
		})
	});
};
//#endregion
//#region src/App.jsx
var SavedContext = createContext({
	saved: [],
	toggleSave: () => {}
});
var useSaved = () => useContext(SavedContext);
function getInitialSaved() {
	if (typeof window === "undefined") return [];
	try {
		const oldBookmarks = localStorage.getItem("saved_posts");
		const bookmarks = localStorage.getItem("bookmarks");
		if (oldBookmarks && (!bookmarks || bookmarks === "[]")) {
			localStorage.setItem("bookmarks", oldBookmarks);
			localStorage.removeItem("saved_posts");
			return JSON.parse(oldBookmarks);
		}
		return JSON.parse(bookmarks || "[]");
	} catch (error) {
		console.error("Failed to load bookmarks:", error);
		return [];
	}
}
function ScrollToTop() {
	const { pathname } = useLocation();
	useEffect(() => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}, [pathname]);
	return null;
}
function App() {
	const [saved, setSaved] = useState(getInitialSaved);
	const toggleSave = useCallback((slug) => {
		setSaved((prev) => {
			const next = prev.includes(slug) ? prev.filter((item) => item !== slug) : [...prev, slug];
			if (typeof window !== "undefined") localStorage.setItem("bookmarks", JSON.stringify(next));
			return next;
		});
	}, []);
	const contextValue = useMemo(() => ({
		saved,
		toggleSave
	}), [saved, toggleSave]);
	return /* @__PURE__ */ jsx(HelmetProvider, { children: /* @__PURE__ */ jsxs(SavedContext.Provider, {
		value: contextValue,
		children: [
			/* @__PURE__ */ jsx(CookieBanner, {}),
			/* @__PURE__ */ jsx(ScrollToTop, {}),
			/* @__PURE__ */ jsx(Outlet, {}),
			typeof window !== "undefined" && /* @__PURE__ */ jsx(Analytics, {})
		]
	}) });
}
//#endregion
//#region src/utils/blogData.js
function parseFrontmatter(raw) {
	const normalized = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	const match = normalized.match(/^\s*---\s*\n([\s\S]*?)\n---\s*/);
	if (!match) return {
		data: {},
		content: normalized
	};
	const yaml = match[1];
	const content = normalized.slice(match[0].length).trim();
	const data = {};
	const lines = yaml.split("\n");
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (line.search(/:\s/) === -1 && !line.match(/^[\w-]+:\s*$/)) {
			i++;
			continue;
		}
		const keyMatch = line.match(/^([\w-]+):\s*$/);
		if (keyMatch) {
			const key = keyMatch[1];
			i++;
			const items = [];
			while (i < lines.length) {
				const itemLine = lines[i];
				if (itemLine.match(/^[\w-]+:\s/) || itemLine.match(/^[\w-]+:\s*$/)) break;
				if (itemLine.match(/^\s{0,4}-\s/)) {
					const firstVal = itemLine.replace(/^\s*-\s*/, "").trim();
					if (firstVal.match(/^[\w-]+:\s/)) {
						const obj = {};
						const fc = firstVal.indexOf(":");
						obj[firstVal.slice(0, fc).trim()] = firstVal.slice(fc + 1).trim().replace(/^["']|["']$/g, "");
						i++;
						while (i < lines.length) {
							const sub = lines[i];
							if (!sub.match(/^\s{4,}[\w-]+:\s/) && !sub.match(/^\s{2,}[\w-]+:\s/)) break;
							const sc = sub.indexOf(":");
							const subKey = sub.slice(0, sc).trim();
							obj[subKey] = sub.slice(sc + 1).trim().replace(/^["']|["']$/g, "");
							i++;
						}
						items.push(obj);
					} else {
						items.push(firstVal.replace(/^["']|["']$/g, ""));
						i++;
					}
				} else i++;
			}
			data[key] = items.length ? items : "";
			continue;
		}
		const ci = line.indexOf(":");
		const key = line.slice(0, ci).trim();
		let val = line.slice(ci + 1).trim();
		val = val.replace(/^["']|["']$/g, "").trim();
		if (val === "true") val = true;
		else if (val === "false") val = false;
		data[key] = val;
		i++;
	}
	return {
		data,
		content
	};
}
function loadPost(slug) {
	const filePath = path.resolve(process.cwd(), "public/blogs", `${slug}.md`);
	if (!fs.existsSync(filePath)) return null;
	const { data, content } = parseFrontmatter(fs.readFileSync(filePath, "utf-8"));
	return {
		frontmatter: data,
		content: content.replace(/<!--[\s\S]*?-->/g, "").trim()
	};
}
function loadManifest() {
	const manifestPath = path.resolve(process.cwd(), "public/blogs/manifest.json");
	if (!fs.existsSync(manifestPath)) return { posts: [] };
	return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
}
//#endregion
//#region src/routees/Approuter.jsx
var Blog = lazy(() => import("./assets/blog-V_osudEY.js"));
var AllBlogs = lazy(() => import("./assets/AllBlogs-CJUV2Xpl.js"));
var ReadBlog = lazy(() => import("./assets/Readblog-BaFUzysV.js"));
var CategoryPage = lazy(() => import("./assets/CategoryPage-DUr6bQfo.js"));
var SavedPins = lazy(() => import("./assets/SavedPins-D5eU7WGb.js"));
var NotFound = lazy(() => import("./assets/NotFound-VDSZBw1F.js"));
var PrivacyPolicy = lazy(() => import("./assets/PrivacyPolicy-ce7WUoSg.js"));
var TermsOfUse = lazy(() => import("./assets/TermsOfUse-g-jgGGiD.js"));
var Sitemap = lazy(() => import("./assets/Sitemap-D53cfV79.js"));
var About = lazy(() => import("./assets/About-BW-FpNZ1.js"));
var CategoriesPage = lazy(() => import("./assets/Categoriespage-30_1LNl8.js"));
var withSuspense = (Component) => /* @__PURE__ */ jsx(Suspense, {
	fallback: /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center",
		children: /* @__PURE__ */ jsxs("div", {
			className: "text-center",
			children: [/* @__PURE__ */ jsx("div", { className: "mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" }), /* @__PURE__ */ jsx("p", {
				className: "text-lg font-medium text-gray-600",
				children: "Loading content..."
			})]
		})
	}),
	children: /* @__PURE__ */ jsx(Component, {})
});
//#endregion
//#region src/main.jsx
var createRoot = ViteReactSSG({
	routes: [{
		path: "/",
		element: /* @__PURE__ */ jsx(App, {}),
		children: [
			{
				index: true,
				element: withSuspense(Blog)
			},
			{
				path: "blog",
				element: withSuspense(AllBlogs)
			},
			{
				path: "blog/:slug",
				element: withSuspense(ReadBlog),
				loader: ({ params }) => ({
					post: loadPost(params.slug),
					manifest: loadManifest()
				})
			},
			{
				path: "category/:categorySlug",
				element: withSuspense(CategoryPage)
			},
			{
				path: "categories",
				element: withSuspense(CategoriesPage)
			},
			{
				path: "saved",
				element: withSuspense(SavedPins)
			},
			{
				path: "privacy-policy",
				element: withSuspense(PrivacyPolicy)
			},
			{
				path: "terms",
				element: withSuspense(TermsOfUse)
			},
			{
				path: "sitemap",
				element: withSuspense(Sitemap)
			},
			{
				path: "about",
				element: withSuspense(About)
			},
			{
				path: "*",
				element: withSuspense(NotFound)
			}
		]
	}],
	basename: "/"
});
//#endregion
export { createRoot, useSaved as n, hasConsent as r, parseFrontmatter as t };
