import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/pages/CategoryPage.jsx
var ArrowLeft = () => /* @__PURE__ */ jsxs("svg", {
	width: "13",
	height: "13",
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
var SearchIcon = () => /* @__PURE__ */ jsxs("svg", {
	width: "13",
	height: "13",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "2.5",
	"aria-hidden": "true",
	children: [/* @__PURE__ */ jsx("circle", {
		cx: "11",
		cy: "11",
		r: "8"
	}), /* @__PURE__ */ jsx("line", {
		x1: "21",
		y1: "21",
		x2: "16.65",
		y2: "16.65"
	})]
});
var CATEGORY_META = {
	"career": {
		title: "Career Strategy",
		subtitle: "Deep-dives into software systems design engineering, team culture mechanics, and actionable growth frameworks."
	},
	"life-lessons": {
		title: "Life Architecture",
		subtitle: "Transparent personal retrospectives, systematic mental frameworks, and tactical lessons documented over code."
	},
	"gaming-setup": {
		title: "Workspace Aesthetics",
		subtitle: "Curated minimalistic desk spaces, peripheral teardowns, hardware inputs evaluation, and ergonomics logs."
	}
};
var resolveInlineGradient = (twGradient) => {
	if (!twGradient) return { backgroundColor: "#FAF9F5" };
	const hexes = twGradient.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/g);
	if (hexes && hexes.length >= 2) return { background: `linear-gradient(135deg, ${hexes[0]}, ${hexes[1]})` };
	return { backgroundColor: "#FAF9F5" };
};
var PremiumPostRowCard = ({ post, index }) => {
	const [imgErr, setImgErr] = useState(false);
	const styleBg = useMemo(() => resolveInlineGradient(post.gradient), [post.gradient]);
	const formattedDate = useMemo(() => {
		if (!post.date) return "";
		return new Date(post.date).toLocaleDateString("en-IN", {
			year: "numeric",
			month: "short",
			day: "numeric"
		});
	}, [post.date]);
	return /* @__PURE__ */ jsx("article", {
		className: "pinterest-row-item w-full opacity-0 translate-y-4 animate-pinReveal",
		style: {
			animationDelay: `${index * 45}ms`,
			animationFillMode: "forwards"
		},
		children: /* @__PURE__ */ jsxs(Link, {
			to: `/blog/${post.slug}`,
			className: "group flex flex-col md:flex-row bg-white rounded-2xl border border-[#EAE3D2] overflow-hidden hover:shadow-[0_24px_48px_-15px_rgba(26,22,18,0.07)] hover:border-[#1A1612] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-y-[-3px]",
			style: { textDecoration: "none" },
			children: [/* @__PURE__ */ jsxs("div", {
				className: "w-full md:w-[360px] lg:w-[440px] h-[220px] md:h-[250px] flex-shrink-0 relative overflow-hidden bg-[#FAF9F5] border-b md:border-b-0 md:border-r border-[#EAE3D2]/40",
				children: [post.image && !imgErr ? /* @__PURE__ */ jsx("img", {
					src: post.image,
					alt: post.title,
					className: "w-full h-full object-cover object-center transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]",
					loading: "lazy",
					onError: () => setImgErr(true)
				}) : /* @__PURE__ */ jsx("div", {
					className: "w-full h-full flex items-center justify-center text-4xl transition-transform duration-700 group-hover:scale-[1.03]",
					style: styleBg,
					children: /* @__PURE__ */ jsx("span", { children: post.emoji || "📝" })
				}), /* @__PURE__ */ jsx("div", {
					className: "absolute top-4 left-4 z-20 pointer-events-none",
					children: /* @__PURE__ */ jsx("span", {
						className: "bg-white/95 backdrop-blur-sm text-[#1A1612] text-[0.62rem] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#EAE3D2]/50 shadow-sm",
						children: post.tag || "Index Log"
					})
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex-1 p-6 lg:p-8 flex flex-col justify-between gap-6 min-w-0",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-[0.62rem] font-bold tracking-[0.22em] text-[#E60023] uppercase",
								children: post.category || "Collection Log"
							}), post.featured && /* @__PURE__ */ jsx("span", {
								className: "bg-[#E60023] text-white text-[0.55rem] font-black uppercase tracking-widest px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5",
								children: "Prime"
							})]
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-[#1A1612] font-display text-[1.35rem] lg:text-[1.55rem] font-bold leading-[1.2] tracking-tight group-hover:text-[#E60023] transition-colors duration-300 line-clamp-2",
							children: post.title
						}),
						post.excerpt ? /* @__PURE__ */ jsx("p", {
							className: "text-xs md:text-[0.88rem] text-[#7A6E65] leading-relaxed line-clamp-2 font-light tracking-wide pt-0.5",
							children: post.excerpt
						}) : /* @__PURE__ */ jsx("p", {
							className: "text-xs md:text-[0.85rem] text-neutral-300 font-light italic",
							children: "Preview description missing from resource tracking nodes."
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#F4EFE6] pt-4 mt-auto",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-5 h-5 rounded-full bg-[#1A1612] text-[#FAF9F5] text-[0.5rem] font-bold flex items-center justify-center",
									children: "VB"
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[0.72rem] text-[#1A1612] font-semibold",
									children: post.author || "Veeresh Bashetti"
								})]
							}),
							/* @__PURE__ */ jsx("span", {
								className: "text-neutral-300 hidden sm:inline",
								children: "•"
							}),
							/* @__PURE__ */ jsx("time", {
								className: "text-[0.72rem] text-[#8A7D73] font-medium",
								dateTime: post.date,
								children: formattedDate
							}),
							post.tags && post.tags.length > 0 && /* @__PURE__ */ jsx("div", {
								className: "hidden lg:flex items-center gap-1.5 ml-2",
								children: post.tags.slice(0, 2).map((t, idx) => /* @__PURE__ */ jsxs("span", {
									className: "text-[0.62rem] font-semibold text-[#8A7D73] bg-[#FAF9F5] px-2.5 py-0.5 rounded-full border border-[#EAE3D2]/40",
									children: ["#", t.toLowerCase().trim()]
								}, idx))
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4 justify-between sm:justify-end shrink-0",
						children: [/* @__PURE__ */ jsx("span", {
							className: "bg-[#FAF9F5] border border-[#EAE3D2]/60 px-2.5 py-0.5 rounded text-[0.65rem] font-medium text-[#7A6E65]",
							children: post.meta || post.readingTime || "3 min read"
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-xs font-bold text-[#1A1612] group-hover:text-[#E60023] transition-colors duration-200 flex items-center gap-1",
							children: ["Open Article ", /* @__PURE__ */ jsx("span", {
								className: "transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300",
								children: "→"
							})]
						})]
					})]
				})]
			})]
		})
	});
};
function CategoryPage() {
	const { categorySlug } = useParams();
	const [posts, setPosts] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const currentMeta = useMemo(() => {
		if (CATEGORY_META[categorySlug]) return CATEGORY_META[categorySlug];
		const readable = categorySlug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
		return {
			title: readable,
			subtitle: `Curated logs and setup blueprints indexed inside the ${readable} space.`
		};
	}, [categorySlug]);
	useEffect(() => {
		let active = true;
		setLoading(true);
		async function fetchPayloadDirectly() {
			try {
				const res = await fetch("/blogs/manifest.json");
				if (!res.ok) throw new Error("Could not load tracking indices database elements mapping.");
				const data = await res.json();
				const filtered = (Array.isArray(data) ? data : data.posts || []).filter((post) => {
					return (Array.isArray(post.tag) ? post.tag : [post.tag]).some((tag) => {
						return tag.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-") === categorySlug.toLowerCase().trim();
					});
				});
				if (active) {
					setPosts(filtered);
					setError(null);
				}
			} catch (err) {
				if (active) setError(err.message);
			} finally {
				if (active) setLoading(false);
			}
		}
		fetchPayloadDirectly();
		return () => {
			active = false;
		};
	}, [categorySlug]);
	const matchingFilteredPosts = useMemo(() => {
		const query = searchQuery.toLowerCase().trim();
		if (!query) return posts;
		return posts.filter((p) => p.title.toLowerCase().includes(query) || p.excerpt && p.excerpt.toLowerCase().includes(query));
	}, [posts, searchQuery]);
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-[#FAF9F5] text-[#1A1612] min-h-screen font-body antialiased selection:bg-[#1A1612] selection:text-white",
		children: [
			/* @__PURE__ */ jsx("style", { children: `
                .font-display { font-family: 'DM Serif Display', serif; }
                .font-body { font-family: 'Outfit', sans-serif; }
                
                @keyframes headerReveal {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pinReveal {
                    from { opacity: 0; transform: translateY(12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-headerReveal {
                    animation: headerReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .animate-pinReveal {
                    animation: pinReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                .scrollbar-none::-webkit-scrollbar { display: none; }
                .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            ` }),
			/* @__PURE__ */ jsx("header", {
				className: "bg-white border-b border-[#EAE3D2] pt-20 pb-8 px-4 md:px-6 animate-headerReveal",
				children: /* @__PURE__ */ jsxs("div", {
					className: "max-w-[1140px] mx-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "space-y-1 flex-1 max-w-xl",
						children: [
							/* @__PURE__ */ jsxs(Link, {
								to: "/",
								className: "inline-flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.15em] text-[#8A7D73] hover:text-[#E60023] transition-colors mb-2",
								style: { textDecoration: "none" },
								children: [/* @__PURE__ */ jsx("span", {
									className: "transform transition-transform duration-300 inline-block",
									children: /* @__PURE__ */ jsx(ArrowLeft, {})
								}), "Return to Index"]
							}),
							/* @__PURE__ */ jsx("h1", {
								className: "font-display text-2xl md:text-3xl text-[#1A1612] tracking-tight font-bold",
								children: currentMeta.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs md:text-[0.82rem] text-[#7A6E65] font-light leading-relaxed",
								children: currentMeta.subtitle
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 w-full sm:w-auto",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "hidden sm:inline-flex bg-[#FAF9F5] border border-[#EAE3D2] rounded-xl px-4 py-2 text-left items-center gap-2",
							children: [/* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-[#E60023] animate-pulse" }), /* @__PURE__ */ jsxs("span", {
								className: "text-[0.65rem] font-bold text-[#8A7D73] uppercase tracking-wider whitespace-nowrap",
								children: ["Board Maps: ", /* @__PURE__ */ jsx("strong", {
									className: "text-[#1A1612] font-display text-sm ml-0.5",
									children: matchingFilteredPosts.length
								})]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative flex items-center w-full sm:w-[230px]",
							children: [/* @__PURE__ */ jsx("span", {
								className: "absolute left-3.5 text-neutral-400",
								children: /* @__PURE__ */ jsx(SearchIcon, {})
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								placeholder: "Scan board entries...",
								className: "w-full pl-9 pr-4 py-2.5 bg-[#FAF9F5] border border-[#EAE3D2] rounded-xl text-xs font-medium outline-none text-[#1A1612] focus:border-[#1A1612] focus:bg-white transition-all shadow-none placeholder:text-neutral-400/80"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "max-w-[1140px] mx-auto px-4 md:px-6 py-10",
				"aria-live": "polite",
				children: [
					loading && /* @__PURE__ */ jsx("div", {
						className: "flex flex-col gap-4",
						"aria-label": "Loading pins structural preview",
						children: [
							1,
							2,
							3
						].map((i) => /* @__PURE__ */ jsx("div", { className: "bg-white border border-[#EAE3D2] rounded-2xl h-[160px] animate-pulse relative overflow-hidden" }, i))
					}),
					!loading && error && /* @__PURE__ */ jsxs("div", {
						className: "text-center py-16 bg-white border border-red-200 text-xs text-[#E60023] rounded-2xl max-w-md mx-auto px-6 font-medium shadow-sm",
						children: ["⚠️ Archive Loop Synchronization Deferred: ", error]
					}),
					!loading && !error && matchingFilteredPosts.length === 0 && /* @__PURE__ */ jsxs("div", {
						className: "text-center py-20 bg-white border border-[#EAE3D2] rounded-3xl p-8 max-w-sm mx-auto shadow-[0_4px_24px_rgba(0,0,0,0.01)] animate-pinReveal",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-3xl block mb-2 opacity-80",
								role: "img",
								"aria-label": "Empty layout state flag",
								children: "🔮"
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "font-display text-base text-[#1A1612] font-semibold mb-1",
								children: "Board ledger is clear"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-[#7A6E65] font-light leading-relaxed",
								children: "No active logs or peripheral product entries found matching your query filters."
							})
						]
					}),
					!loading && !error && matchingFilteredPosts.length > 0 && /* @__PURE__ */ jsx("div", {
						className: "flex flex-col gap-5",
						children: matchingFilteredPosts.map((post, idx) => /* @__PURE__ */ jsx(PremiumPostRowCard, {
							post,
							index: idx
						}, post.slug))
					})
				]
			})
		]
	});
}
//#endregion
export { CategoryPage as default };
