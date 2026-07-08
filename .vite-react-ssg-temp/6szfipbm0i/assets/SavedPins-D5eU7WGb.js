import { n as useSaved } from "../main.mjs";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/pages/SavedPins.jsx
var ArrowLeft = () => /* @__PURE__ */ jsxs("svg", {
	width: "14",
	height: "14",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2.5",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ jsx("line", {
		x1: "19",
		y1: "12",
		x2: "5",
		y2: "12"
	}), /* @__PURE__ */ jsx("polyline", { points: "12 19 5 12 12 5" })]
});
var TrashIcon = () => /* @__PURE__ */ jsxs("svg", {
	width: "13",
	height: "13",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ jsx("polyline", { points: "3 6 5 6 21 6" }), /* @__PURE__ */ jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })]
});
var resolveInlineGradient = (idx) => {
	const presets = [
		"linear-gradient(135deg,#F5EFE6,#E8DDD0)",
		"linear-gradient(135deg,#E8F0E8,#D4E4D4)",
		"linear-gradient(135deg,#F0E8F0,#E0D4E4)"
	];
	return { background: presets[idx % presets.length] };
};
function SavedPins() {
	const [savedPosts, setSavedPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const { saved, toggleSave } = useSaved();
	useEffect(() => {
		async function loadSavedAssets() {
			try {
				const rawBookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
				if (rawBookmarks.length === 0) {
					setSavedPosts([]);
					return;
				}
				const res = await fetch("/blogs/manifest.json");
				if (!res.ok) return;
				const data = await res.json();
				setSavedPosts((Array.isArray(data) ? data : data.posts || []).filter((p) => rawBookmarks.includes(p.slug)));
			} catch (err) {
				console.error("Failed to parse saved assets stream:", err);
			} finally {
				setLoading(false);
			}
		}
		loadSavedAssets();
	}, []);
	const removeBookmark = (slug, e) => {
		e.preventDefault();
		const filteredIds = JSON.parse(localStorage.getItem("bookmarks") || "[]").filter((id) => id !== slug);
		localStorage.setItem("bookmarks", JSON.stringify(filteredIds));
		setSavedPosts((prev) => prev.filter((p) => p.slug !== slug));
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-[#FAF9F5] text-[#1A1612] min-h-screen font-body antialiased selection:bg-[#1A1612] selection:text-white",
		children: [
			/* @__PURE__ */ jsx("style", { children: `
                .font-display { font-family: 'DM Serif Display', serif; }
                .pinterest-masonry-container { column-count: 4; column-gap: 1.5rem; width: 100%; }
                @media (max-width: 1200px) { .pinterest-masonry-container { column-count: 3; } }
                @media (max-width: 840px) { .pinterest-masonry-container { column-count: 2; column-gap: 1rem; } }
                @media (max-width: 480px) { .pinterest-masonry-container { column-count: 1; } }
                @keyframes cardReveal { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
                .animate-cardReveal { animation: cardReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
            ` }),
			/* @__PURE__ */ jsx("header", {
				className: "bg-white border-b border-[#EAE3D2] pt-20 pb-8 px-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-[1440px] mx-auto flex items-end justify-between gap-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-1.5",
						children: [
							/* @__PURE__ */ jsxs(Link, {
								to: "/",
								className: "inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#8A7D73] hover:text-[#E60023] transition-colors mb-2",
								style: { textDecoration: "none" },
								children: [/* @__PURE__ */ jsx(ArrowLeft, {}), " Return to Hub"]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "font-display text-2xl md:text-3xl font-bold tracking-tight text-[#1A1612]",
								children: "Your Saved Presentation Pins"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs md:text-sm text-[#7A6E65] font-light",
								children: "Handpicked layouts, articles, and workspace ergonomics boards kept inside local tracking space nodes."
							})
						]
					}), /* @__PURE__ */ jsxs("span", {
						className: "hidden sm:inline-block bg-[#FAF9F5] border border-[#EAE3D2] px-4 py-2 rounded-xl text-xs font-bold text-[#8A7D73] uppercase tracking-wider",
						children: [
							"Stored: ",
							savedPosts.length,
							" Pins"
						]
					})]
				})
			}),
			/* @__PURE__ */ jsx("main", {
				className: "max-w-[1440px] mx-auto px-4 md:px-6 py-10",
				children: loading ? /* @__PURE__ */ jsx("div", {
					className: "text-center py-20 text-xs tracking-widest text-[#8A7D73] uppercase animate-pulse",
					children: "Synchronizing local data nodes..."
				}) : savedPosts.length === 0 ? /* @__PURE__ */ jsxs("div", {
					className: "text-center py-24 bg-white border border-[#EAE3D2] rounded-3xl p-12 max-w-sm mx-auto shadow-sm animate-cardReveal",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-4xl block mb-4",
							children: "📌"
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "font-display text-base font-semibold text-[#1A1612] mb-1.5",
							children: "No saved items found"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-[#7A6E65] font-light leading-relaxed mb-6",
							children: "Bookmark articles or peripheral setup reviews across reading spaces to synchronize them directly here."
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/",
							className: "inline-block bg-[#1A1612] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full",
							style: { textDecoration: "none" },
							children: "Explore Dashboard"
						})
					]
				}) : /* @__PURE__ */ jsx("div", {
					className: "pinterest-masonry-container",
					children: savedPosts.map((post, idx) => /* @__PURE__ */ jsx("div", {
						className: "w-full mb-6 break-inside-avoid animate-cardReveal relative group",
						style: { animationDelay: `${idx * 40}ms` },
						children: /* @__PURE__ */ jsxs(Link, {
							to: `/blog/${post.slug}`,
							style: { textDecoration: "none" },
							children: [/* @__PURE__ */ jsxs("div", {
								className: "w-full rounded-2xl overflow-hidden relative bg-[#FAF9F5] border border-[#EAE3D2]/60 shadow-sm group-hover:shadow-md transition-all duration-300",
								children: [post.image ? /* @__PURE__ */ jsx("img", {
									src: post.image,
									alt: "",
									className: "w-full h-auto object-cover block max-h-[380px]",
									loading: "lazy"
								}) : /* @__PURE__ */ jsx("div", {
									style: resolveInlineGradient(idx),
									className: "w-full h-[240px] flex items-center justify-center text-4xl",
									children: post.emoji || "📝"
								}), /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: (e) => removeBookmark(post.slug, e),
									className: "absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm border border-[#EAE3D2] text-[#7A6E65] hover:text-[#E60023] flex items-center justify-center transition-colors shadow-sm cursor-pointer z-20",
									title: "Unsave pin layout",
									children: /* @__PURE__ */ jsx(TrashIcon, {})
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "pt-3 px-1",
								children: [/* @__PURE__ */ jsx("h2", {
									className: "text-[#1A1612] font-display text-[0.92rem] font-semibold leading-tight line-clamp-2 group-hover:text-[#E60023] transition-colors duration-200",
									children: post.title
								}), /* @__PURE__ */ jsx("span", {
									className: "block text-[0.6rem] font-bold text-[#8A7D73] uppercase tracking-wider mt-2",
									children: post.category || "General"
								})]
							})]
						})
					}, post.slug))
				})
			})
		]
	});
}
//#endregion
export { SavedPins as default };
