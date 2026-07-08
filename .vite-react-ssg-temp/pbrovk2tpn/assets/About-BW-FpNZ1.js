import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/pages/About.jsx
var SITE = {
	name: "Veeresh Bashetti",
	email: "veeresh.b.bashetti@gmail.com",
	pinterestUrl: "https://in.pinterest.com/veereshbbashetti/",
	baseUrl: "https://veereshbashetti.com",
	location: "Hubballi, Karnataka, India"
};
var TOPICS = [
	{
		emoji: "💰",
		label: "Finance",
		desc: "Personal finance, smart saving, and investment basics explained simply.",
		path: "/category/finance"
	},
	{
		emoji: "📱",
		label: "Tech",
		desc: "Apps, tools, and technology that actually make life easier.",
		path: "/category/tech"
	},
	{
		emoji: "🌿",
		label: "Lifestyle",
		desc: "Small habits and everyday choices that quietly change everything.",
		path: "/category/lifestyle"
	},
	{
		emoji: "🧠",
		label: "Personal Growth",
		desc: "Learning, mindset, and becoming a slightly better version of yourself.",
		path: "/category/personal-growth"
	}
];
var VALUES = [
	{
		icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
		label: "Write to understand",
		text: "I write to figure things out, not to show off. If a post helped me understand something, I share it."
	},
	{
		icon: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
		label: "Honest over impressive",
		text: "No affiliate-first listicles. If something is bad, I say so. I'd rather be useful than popular."
	},
	{
		icon: "M13 10V3L4 14h7v7l9-11h-7z",
		label: "Small things compound",
		text: "Most of what I write about is small. Small habits, small changes, small tools. They add up."
	}
];
var TIMELINE = [
	{
		year: "2026",
		event: "Building websites, learning every day, and documenting my experiences through this blog."
	},
	{
		year: "2025",
		event: "Joined a web development course and started taking software development seriously."
	},
	{
		year: "2024",
		event: "Graduated from college and spent a year working in sales, where I learned how people think, communicate, and make decisions."
	},
	{
		year: "2023",
		event: "Still figuring out what I wanted to do and exploring different possibilities."
	},
	{
		year: "Earlier",
		event: "Always curious about how things work, even when I didn't know where that curiosity would lead."
	}
];
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
function useFadeIn(delay = 0) {
	const ref = useRef(null);
	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		el.style.opacity = "0";
		el.style.transform = "translateY(16px)";
		el.style.transition = `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`;
		const obs = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) {
				el.style.opacity = "1";
				el.style.transform = "none";
				obs.unobserve(el);
			}
		}, { threshold: .08 });
		obs.observe(el);
		return () => obs.disconnect();
	}, [delay]);
	return ref;
}
var Navbar = ({ dark, toggleDark }) => {
	const [scrolled, setScrolled] = useState(false);
	useEffect(() => {
		const fn = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", fn, { passive: true });
		return () => window.removeEventListener("scroll", fn);
	}, []);
	return /* @__PURE__ */ jsx("nav", {
		className: "fixed top-0 left-0 right-0 z-[100] transition-all duration-300",
		style: {
			background: dark ? "rgba(15,14,13,0.92)" : "rgba(250,248,244,0.92)",
			backdropFilter: "blur(20px)",
			borderBottom: scrolled ? `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(26,22,18,0.08)"}` : "1px solid transparent"
		},
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-[1280px] mx-auto px-6 h-[68px] flex items-center justify-between gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "font-['DM_Serif_Display',serif] text-[1.3rem] tracking-tight",
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
						color: dark ? "rgba(250,248,244,0.55)" : "#7A6E64"
					},
					children: "← Blog"
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("button", {
					onClick: toggleDark,
					className: "w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-200 hover:opacity-70",
					style: {
						borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(26,22,18,0.12)",
						color: dark ? "#FAF8F4" : "#3D3530"
					},
					"aria-label": dark ? "Switch to light mode" : "Switch to dark mode",
					children: dark ? /* @__PURE__ */ jsx(SunIcon, {}) : /* @__PURE__ */ jsx(MoonIcon, {})
				}), /* @__PURE__ */ jsxs("a", {
					href: SITE.pinterestUrl,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "hidden sm:inline-flex items-center gap-1.5 text-[0.78rem] font-bold px-4 py-2 rounded-full transition-all duration-300 hover:-translate-y-px hover:opacity-90",
					style: {
						background: "#E60023",
						color: "#fff"
					},
					children: [/* @__PURE__ */ jsx(PinterestIcon, { size: 13 }), " Follow"]
				})]
			})]
		})
	});
};
var Avatar = ({ dark, size = 96 }) => /* @__PURE__ */ jsx("div", {
	className: "rounded-full flex items-center justify-center font-['DM_Serif_Display',serif] flex-shrink-0 select-none",
	style: {
		width: size,
		height: size,
		background: "linear-gradient(135deg, #1A1612 60%, #3D3530)",
		color: "#FAF8F4",
		fontSize: size * .35,
		border: `3px solid ${dark ? "rgba(255,255,255,0.1)" : "#EAE4DC"}`,
		boxShadow: dark ? "0 0 0 6px rgba(255,255,255,0.03)" : "0 0 0 6px rgba(26,22,18,0.04)"
	},
	"aria-label": "Veeresh Bashetti",
	children: "VB"
});
var SectionHeading = ({ eyebrow, title, dark }) => /* @__PURE__ */ jsxs("div", {
	className: "mb-8",
	children: [/* @__PURE__ */ jsx("p", {
		className: "text-[0.7rem] font-bold tracking-[0.12em] uppercase mb-2",
		style: { color: "#E60023" },
		children: eyebrow
	}), /* @__PURE__ */ jsx("h2", {
		className: "font-['DM_Serif_Display',serif] text-[1.9rem] leading-tight",
		style: { color: dark ? "#FAF8F4" : "#1A1612" },
		children: title
	})]
});
var TopicCard = ({ topic, dark, border, delay }) => {
	return /* @__PURE__ */ jsxs(Link, {
		ref: useFadeIn(delay),
		to: topic.path,
		className: "flex flex-col gap-3 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-sm",
		style: {
			background: dark ? "rgba(255,255,255,0.02)" : "#FFFFFF",
			borderColor: border,
			textDecoration: "none"
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-2xl",
					children: topic.emoji
				}), /* @__PURE__ */ jsx("span", {
					className: "font-semibold text-[0.92rem]",
					style: { color: dark ? "#FAF8F4" : "#1A1612" },
					children: topic.label
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-[0.82rem] leading-relaxed font-light",
				style: { color: dark ? "rgba(250,248,244,0.5)" : "#7A6E64" },
				children: topic.desc
			}),
			/* @__PURE__ */ jsx("span", {
				className: "text-[0.72rem] font-semibold mt-auto",
				style: { color: "#E60023" },
				children: "Browse articles →"
			})
		]
	});
};
var ValueCard = ({ item, dark, border, delay }) => {
	return /* @__PURE__ */ jsxs("div", {
		ref: useFadeIn(delay),
		className: "flex gap-4 p-5 rounded-2xl border",
		style: {
			background: dark ? "rgba(255,255,255,0.02)" : "#FFFFFF",
			borderColor: border
		},
		children: [/* @__PURE__ */ jsx("div", {
			className: "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
			style: { background: dark ? "rgba(230,0,35,0.12)" : "#FFF0F1" },
			children: /* @__PURE__ */ jsx(Icon, {
				d: item.icon,
				size: 15,
				className: "text-red-500"
			})
		}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
			className: "font-semibold text-[0.9rem] mb-1.5",
			style: { color: dark ? "#FAF8F4" : "#1A1612" },
			children: item.label
		}), /* @__PURE__ */ jsx("p", {
			className: "text-[0.84rem] leading-relaxed font-light",
			style: { color: dark ? "rgba(250,248,244,0.55)" : "#5A5046" },
			children: item.text
		})] })]
	});
};
var RecentPosts = ({ dark, border }) => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const load = async () => {
			try {
				const res = await fetch("/blogs/manifest.json");
				if (!res.ok) throw new Error();
				setPosts(((await res.json()).posts || []).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 4));
			} catch {
				setPosts([]);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);
	if (loading) return /* @__PURE__ */ jsx("div", {
		className: "space-y-3",
		children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsxs("div", {
			className: "animate-pulse flex gap-3 items-center py-2",
			children: [/* @__PURE__ */ jsx("div", {
				className: "w-10 h-10 rounded-xl flex-shrink-0",
				style: { background: dark ? "rgba(255,255,255,0.05)" : "#EAE4DC" }
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex-1 space-y-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "h-3 rounded-full w-3/4",
					style: { background: dark ? "rgba(255,255,255,0.05)" : "#EAE4DC" }
				}), /* @__PURE__ */ jsx("div", {
					className: "h-2.5 rounded-full w-1/3",
					style: { background: dark ? "rgba(255,255,255,0.04)" : "#F0EBE3" }
				})]
			})]
		}, i))
	});
	if (!posts.length) return /* @__PURE__ */ jsx("p", {
		className: "text-[0.84rem] font-light",
		style: { color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" },
		children: "No posts yet."
	});
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-0",
		children: posts.map((post, i) => /* @__PURE__ */ jsxs(Link, {
			to: `/blog/${post.slug}`,
			className: "flex items-start gap-3 py-3.5 group transition-opacity hover:opacity-70",
			style: {
				borderBottom: i < posts.length - 1 ? `1px solid ${border}` : "none",
				textDecoration: "none"
			},
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0",
					style: {
						background: dark ? "rgba(255,255,255,0.05)" : "#F5F1EB",
						border: `1px solid ${border}`
					},
					children: post.emoji || "📝"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex-1 min-w-0",
					children: [/* @__PURE__ */ jsx("div", {
						className: "text-[0.85rem] font-semibold leading-snug truncate group-hover:text-red-500 transition-colors",
						style: { color: dark ? "rgba(250,248,244,0.88)" : "#1A1612" },
						children: post.title
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-[0.72rem] mt-0.5 font-light",
						style: { color: dark ? "rgba(250,248,244,0.6)" : "#9C8E84" },
						children: [post.category && /* @__PURE__ */ jsxs("span", {
							className: "font-semibold",
							style: { color: "#E60023" },
							children: [post.category, " · "]
						}), post.date && new Date(post.date).toLocaleDateString("en-IN", {
							month: "short",
							year: "numeric"
						})]
					})]
				}),
				/* @__PURE__ */ jsx(Icon, {
					d: "M9 18l6-6-6-6",
					size: 14,
					className: "flex-shrink-0 mt-1 opacity-0 group-hover:opacity-40 transition-opacity",
					style: { color: dark ? "#FAF8F4" : "#1A1612" }
				})
			]
		}, post.slug || i))
	});
};
function About() {
	const [dark, toggleDark] = useDarkMode();
	const heroRef = useFadeIn(0);
	const bg = dark ? "#0F0E0D" : "#FAF8F4";
	const border = dark ? "rgba(255,255,255,0.07)" : "#EAE4DC";
	useEffect(() => {
		document.title = `About — ${SITE.name}`;
		let canonical = document.querySelector("link[rel=\"canonical\"]");
		if (!canonical) {
			canonical = document.createElement("link");
			canonical.rel = "canonical";
			document.head.appendChild(canonical);
		}
		canonical.href = `${SITE.baseUrl}/about`;
	}, []);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("style", { children: `

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
      ` }),
		/* @__PURE__ */ jsx(Navbar, {
			dark,
			toggleDark
		}),
		/* @__PURE__ */ jsxs("div", {
			style: {
				background: bg,
				minHeight: "100vh"
			},
			children: [
				/* @__PURE__ */ jsxs("nav", {
					className: "max-w-[1280px] mx-auto px-6 pt-28 pb-0 flex items-center gap-2 text-xs font-medium",
					style: { color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" },
					"aria-label": "Breadcrumb",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/",
							className: "hover:text-red-500 transition-colors",
							children: "Home"
						}),
						/* @__PURE__ */ jsx("span", { children: "›" }),
						/* @__PURE__ */ jsx("span", {
							style: { color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" },
							children: "About"
						})
					]
				}),
				/* @__PURE__ */ jsx("section", {
					ref: heroRef,
					className: "max-w-[1280px] mx-auto px-6 pt-10 pb-20",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col md:flex-row md:items-start gap-10 max-w-[860px]",
						children: [/* @__PURE__ */ jsx(Avatar, {
							dark,
							size: 104
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex-1",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full mb-5",
									style: {
										background: "#E600230F",
										color: "#E60023",
										border: "1px solid #E6002322"
									},
									children: "Developer • Builder • Curious Learner • Writer"
								}),
								/* @__PURE__ */ jsx("h1", {
									className: "font-['DM_Serif_Display',serif] leading-[1.06] tracking-[-0.02em] mb-5",
									style: {
										fontSize: "clamp(2.2rem, 4.5vw, 3rem)",
										color: dark ? "#FAF8F4" : "#1A1612"
									},
									children: "Hi, I'm Veeresh."
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "space-y-4 max-w-[650px]",
									children: [
										"```",
										/* @__PURE__ */ jsx("p", {
											className: "text-[1rem] leading-[1.85] font-light",
											style: { color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" },
											children: "Hi, I'm Veeresh, a 22-year-old web developer from India who loves building things, learning new skills, and exploring how technology works."
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[1rem] leading-[1.85] font-light",
											style: { color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" },
											children: "I graduated from college in 2024."
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[1rem] leading-[1.85] font-light",
											style: { color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" },
											children: "Like many people in their early twenties, I wasn't completely sure what path I wanted to follow. After graduation, I spent about a year working in sales. That experience taught me a lot about communication, people, confidence, and solving real-world problems."
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[1rem] leading-[1.85] font-light",
											style: { color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" },
											children: "But deep down, I was always curious about technology, websites, software, and how digital products are built. That curiosity eventually led me to web development."
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[1rem] leading-[1.85] font-light",
											style: { color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" },
											children: "I joined a web development course and started learning seriously. Since then, I've spent countless hours building projects, fixing bugs, experimenting with new technologies, and improving my skills one step at a time."
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[1rem] leading-[1.85] font-light",
											style: { color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" },
											children: "This blog is where I document that journey. I share things I learn, projects I build, useful tools I discover, mistakes I make, and experiences that help me grow both professionally and personally."
										}),
										/* @__PURE__ */ jsx("p", {
											className: "text-[1rem] leading-[1.85] font-light",
											style: { color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" },
											children: "I'm still learning, still building, and still figuring things out. That's what makes the journey exciting."
										}),
										"```"
									]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center flex-wrap gap-3 mt-8",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1.5 text-[0.78rem]",
											style: { color: dark ? "rgba(250,248,244,0.65)" : "#9C8E84" },
											children: [/* @__PURE__ */ jsx(Icon, {
												d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
												size: 14
											}), SITE.location]
										}),
										/* @__PURE__ */ jsx("div", {
											className: "w-px h-4",
											style: { background: border }
										}),
										/* @__PURE__ */ jsxs("a", {
											href: SITE.pinterestUrl,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "inline-flex items-center gap-1.5 text-[0.78rem] font-bold px-4 py-2 rounded-full transition-all duration-300 hover:-translate-y-px hover:opacity-90",
											style: {
												background: "#E60023",
												color: "#fff"
											},
											children: [/* @__PURE__ */ jsx(PinterestIcon, { size: 13 }), " Pinterest"]
										}),
										/* @__PURE__ */ jsxs("a", {
											href: `mailto:${SITE.email}`,
											className: "inline-flex items-center gap-1.5 text-[0.78rem] font-semibold px-4 py-2 rounded-full border transition-all duration-200 hover:opacity-70",
											style: {
												borderColor: dark ? "rgba(255,255,255,0.12)" : "#DDD7CE",
												color: dark ? "rgba(250,248,244,0.75)" : "#3D3530",
												background: dark ? "rgba(255,255,255,0.04)" : "#F5F1EB"
											},
											children: [/* @__PURE__ */ jsx(Icon, {
												d: "M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z",
												size: 13
											}), "Email me"]
										}),
										/* @__PURE__ */ jsx(Link, {
											to: "/blog",
											className: "inline-flex items-center gap-1.5 text-[0.78rem] font-semibold px-4 py-2 rounded-full border transition-all duration-200 hover:opacity-70",
											style: {
												borderColor: dark ? "rgba(255,255,255,0.12)" : "#DDD7CE",
												color: dark ? "rgba(250,248,244,0.75)" : "#3D3530",
												background: dark ? "rgba(255,255,255,0.04)" : "#F5F1EB"
											},
											children: "Read the blog →"
										})
									]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ jsx("div", {
					className: "max-w-[1280px] mx-auto px-6",
					children: /* @__PURE__ */ jsx("div", {
						className: "h-px w-full",
						style: { background: border }
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "max-w-[1280px] mx-auto px-6 pt-20 pb-10 flex flex-col lg:flex-row gap-16 items-start",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ jsxs("section", {
								className: "mb-20",
								children: [/* @__PURE__ */ jsx(SectionHeading, {
									eyebrow: "What I write about",
									title: "The four things I keep coming back to.",
									dark
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: TOPICS.map((topic, i) => /* @__PURE__ */ jsx(TopicCard, {
										topic,
										dark,
										border,
										delay: i * 70
									}, topic.label))
								})]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "mb-20",
								children: [/* @__PURE__ */ jsx(SectionHeading, {
									eyebrow: "How I think",
									title: "What I believe about writing.",
									dark
								}), /* @__PURE__ */ jsx("div", {
									className: "flex flex-col gap-4",
									children: VALUES.map((item, i) => /* @__PURE__ */ jsx(ValueCard, {
										item,
										dark,
										border,
										delay: i * 80
									}, item.label))
								})]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "mb-20",
								children: [/* @__PURE__ */ jsx(SectionHeading, {
									eyebrow: "A short backstory",
									title: "How I got here.",
									dark
								}), /* @__PURE__ */ jsxs("div", {
									className: "relative",
									children: [/* @__PURE__ */ jsx("div", {
										className: "absolute left-[19px] top-2 bottom-2 w-px",
										style: { background: dark ? "rgba(255,255,255,0.07)" : "#EAE4DC" }
									}), /* @__PURE__ */ jsx("div", {
										className: "space-y-0",
										children: TIMELINE.map((item, i) => /* @__PURE__ */ jsxs("div", {
											className: "flex gap-6 pb-8 relative",
											children: [/* @__PURE__ */ jsx("div", {
												className: "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10",
												style: {
													background: i === 0 ? "#E60023" : dark ? "#1A1815" : "#F5F1EB",
													border: `2px solid ${i === 0 ? "#E60023" : border}`
												},
												children: /* @__PURE__ */ jsx("span", {
													className: "text-[0.65rem] font-bold",
													style: { color: i === 0 ? "#fff" : dark ? "rgba(250,248,244,0.65)" : "#9C8E84" },
													children: item.year.slice(2)
												})
											}), /* @__PURE__ */ jsxs("div", {
												className: "flex-1 pt-2 pb-4",
												children: [/* @__PURE__ */ jsx("div", {
													className: "text-[0.7rem] font-bold uppercase tracking-widest mb-1",
													style: { color: i === 0 ? "#E60023" : dark ? "rgba(250,248,244,0.3)" : "#AAA09A" },
													children: item.year
												}), /* @__PURE__ */ jsx("p", {
													className: "text-[0.9rem] leading-relaxed font-light",
													style: { color: dark ? "rgba(250,248,244,0.7)" : "#3D3530" },
													children: item.event
												})]
											})]
										}, i))
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("section", {
								className: "mb-10",
								children: [/* @__PURE__ */ jsx(SectionHeading, {
									eyebrow: "Right now",
									title: "What I'm up to these days.",
									dark
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
									children: [
										{
											icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
											label: "Reading",
											value: "Indian Ocean — a history of monsoon traders"
										},
										{
											icon: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
											label: "Writing",
											value: "A series on low-effort money habits"
										},
										{
											icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0zM15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z",
											label: "Based in",
											value: "Hubballi, Karnataka"
										}
									].map((item) => /* @__PURE__ */ jsxs("div", {
										className: "p-5 rounded-2xl border flex flex-col gap-2",
										style: {
											background: dark ? "rgba(255,255,255,0.02)" : "#FFFFFF",
											borderColor: border
										},
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("div", {
												className: "w-6 h-6 rounded-full flex items-center justify-center",
												style: { background: dark ? "rgba(230,0,35,0.12)" : "#FFF0F1" },
												children: /* @__PURE__ */ jsx(Icon, {
													d: item.icon,
													size: 12,
													className: "text-red-500"
												})
											}), /* @__PURE__ */ jsx("span", {
												className: "text-[0.68rem] font-bold uppercase tracking-widest",
												style: { color: dark ? "rgba(250,248,244,0.6)" : "#9C8E84" },
												children: item.label
											})]
										}), /* @__PURE__ */ jsx("p", {
											className: "text-[0.85rem] leading-snug font-light",
											style: { color: dark ? "rgba(250,248,244,0.72)" : "#3D3530" },
											children: item.value
										})]
									}, item.label))
								})]
							})
						]
					}), /* @__PURE__ */ jsxs("aside", {
						className: "w-full lg:w-[300px] lg:shrink-0 lg:sticky lg:top-[96px] self-start flex flex-col gap-5",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl overflow-hidden",
								style: {
									background: dark ? "rgba(255,255,255,0.02)" : "#FFFFFF",
									border: `1px solid ${border}`
								},
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "px-5 py-3.5 text-[0.62rem] font-bold tracking-[0.14em] uppercase",
										style: {
											color: dark ? "rgba(250,248,244,0.6)" : "#9C8E84",
											borderBottom: `1px solid ${border}`
										},
										children: "Recent articles"
									}),
									/* @__PURE__ */ jsx("div", {
										className: "px-5",
										children: /* @__PURE__ */ jsx(RecentPosts, {
											dark,
											border
										})
									}),
									/* @__PURE__ */ jsx("div", {
										className: "px-5 py-3",
										style: { borderTop: `1px solid ${border}` },
										children: /* @__PURE__ */ jsx(Link, {
											to: "/blog",
											className: "text-[0.78rem] font-semibold hover:opacity-70 transition-opacity",
											style: { color: "#E60023" },
											children: "All articles →"
										})
									})
								]
							}),
							/* @__PURE__ */ jsxs("a", {
								href: SITE.pinterestUrl,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90",
								style: {
									background: "#E60023",
									borderColor: "#E60023",
									textDecoration: "none"
								},
								children: [/* @__PURE__ */ jsx("div", {
									className: "w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0",
									children: /* @__PURE__ */ jsx(PinterestIcon, { size: 18 })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "text-[0.85rem] font-bold text-white mb-0.5",
									children: "Follow on Pinterest"
								}), /* @__PURE__ */ jsx("div", {
									className: "text-[0.73rem] text-white/70",
									children: "Curated finds and visual inspiration"
								})] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl overflow-hidden",
								style: {
									background: dark ? "rgba(255,255,255,0.02)" : "#FFFFFF",
									border: `1px solid ${border}`
								},
								children: [/* @__PURE__ */ jsx("div", {
									className: "px-5 py-3.5 text-[0.62rem] font-bold tracking-[0.14em] uppercase",
									style: {
										color: dark ? "rgba(250,248,244,0.6)" : "#9C8E84",
										borderBottom: `1px solid ${border}`
									},
									children: "Get in touch"
								}), /* @__PURE__ */ jsxs("div", {
									className: "p-5",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-[0.82rem] leading-relaxed font-light mb-4",
										style: { color: dark ? "rgba(250,248,244,0.5)" : "#7A6E64" },
										children: "Questions, feedback, or just want to say hello? I read every email."
									}), /* @__PURE__ */ jsxs("a", {
										href: `mailto:${SITE.email}`,
										className: "flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[0.82rem] font-bold border transition-all duration-200 hover:opacity-75",
										style: {
											borderColor: dark ? "rgba(255,255,255,0.12)" : "#DDD7CE",
											color: dark ? "#FAF8F4" : "#1A1612",
											background: dark ? "rgba(255,255,255,0.04)" : "#F5F1EB"
										},
										children: [/* @__PURE__ */ jsx(Icon, {
											d: "M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z",
											size: 14
										}), SITE.email]
									})]
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "rounded-2xl overflow-hidden",
								style: {
									background: dark ? "rgba(255,255,255,0.02)" : "#FFFFFF",
									border: `1px solid ${border}`
								},
								children: [/* @__PURE__ */ jsx("div", {
									className: "px-5 py-3.5 text-[0.62rem] font-bold tracking-[0.14em] uppercase",
									style: {
										color: dark ? "rgba(250,248,244,0.6)" : "#9C8E84",
										borderBottom: `1px solid ${border}`
									},
									children: "Pages"
								}), /* @__PURE__ */ jsx("nav", {
									className: "p-2",
									children: [
										{
											label: "Blog",
											path: "/blog",
											icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
										},
										{
											label: "Privacy Policy",
											path: "/privacy-policy",
											icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
										},
										{
											label: "Terms of Use",
											path: "/terms",
											icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z"
										},
										{
											label: "Sitemap",
											path: "/sitemap",
											icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
										}
									].map((link) => /* @__PURE__ */ jsxs(Link, {
										to: link.path,
										className: "flex items-center gap-2.5 px-3 py-2 rounded-xl text-[0.8rem] transition-all hover:opacity-70 group",
										style: {
											color: dark ? "rgba(250,248,244,0.6)" : "#5A5046",
											textDecoration: "none"
										},
										children: [/* @__PURE__ */ jsx(Icon, {
											d: link.icon,
											size: 13,
											className: "flex-shrink-0 opacity-60"
										}), link.label]
									}, link.path))
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ jsx("section", {
					className: "max-w-[1280px] mx-auto px-6 pb-24",
					children: /* @__PURE__ */ jsxs("div", {
						className: "rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8",
						style: {
							background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
							border: `1px solid ${border}`
						},
						children: [/* @__PURE__ */ jsxs("div", {
							className: "max-w-[480px]",
							children: [/* @__PURE__ */ jsx("h2", {
								className: "font-['DM_Serif_Display',serif] text-[1.7rem] leading-snug mb-3",
								style: { color: dark ? "#FAF8F4" : "#1A1612" },
								children: "Start with a good article."
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[0.9rem] leading-relaxed font-light",
								style: { color: dark ? "rgba(250,248,244,0.5)" : "#7A6E64" },
								children: "Browse everything I've written — or pick a topic that interests you and start there."
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap gap-3",
							children: [/* @__PURE__ */ jsx(Link, {
								to: "/blog",
								className: "inline-flex items-center gap-2 font-bold text-[0.85rem] px-6 py-3 rounded-full transition-all duration-300 hover:-translate-y-px hover:opacity-90",
								style: {
									background: "#1A1612",
									color: "#FAF8F4"
								},
								children: "Browse all posts"
							}), /* @__PURE__ */ jsxs("a", {
								href: SITE.pinterestUrl,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "inline-flex items-center gap-2 font-bold text-[0.85rem] px-6 py-3 rounded-full transition-all duration-300 hover:-translate-y-px hover:opacity-90",
								style: {
									background: "#E60023",
									color: "#fff"
								},
								children: [/* @__PURE__ */ jsx(PinterestIcon, { size: 14 }), " Follow on Pinterest"]
							})]
						})]
					})
				}),
				/* @__PURE__ */ jsxs("footer", {
					className: "relative z-10 overflow-hidden",
					style: { background: "#0F0E0D" },
					children: [/* @__PURE__ */ jsx("div", {
						className: "h-px w-full",
						style: { background: "linear-gradient(90deg, transparent, #E60023, transparent)" }
					}), /* @__PURE__ */ jsxs("div", {
						className: "max-w-[1280px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsxs(Link, {
								to: "/",
								className: "font-['DM_Serif_Display',serif] text-[1.2rem]",
								style: { color: "#FAF8F4" },
								children: ["Veeresh", /* @__PURE__ */ jsx("span", {
									style: { color: "#E60023" },
									children: "."
								})]
							}), /* @__PURE__ */ jsxs("span", {
								className: "text-[0.72rem]",
								style: { color: "rgba(250,248,244,0.5)" },
								children: [
									"© ",
									(/* @__PURE__ */ new Date()).getFullYear(),
									" All rights reserved."
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4 text-[0.78rem]",
							style: { color: "rgba(250,248,244,0.65)" },
							children: [
								/* @__PURE__ */ jsx(Link, {
									to: "/blog",
									className: "hover:text-white transition-colors",
									children: "Blog"
								}),
								/* @__PURE__ */ jsx("span", {
									style: { color: "rgba(250,248,244,0.15)" },
									children: "·"
								}),
								/* @__PURE__ */ jsx(Link, {
									to: "/privacy-policy",
									className: "hover:text-white transition-colors",
									children: "Privacy Policy"
								}),
								/* @__PURE__ */ jsx("span", {
									style: { color: "rgba(250,248,244,0.15)" },
									children: "·"
								}),
								/* @__PURE__ */ jsx(Link, {
									to: "/terms",
									className: "hover:text-white transition-colors",
									children: "Terms"
								}),
								/* @__PURE__ */ jsx("span", {
									style: { color: "rgba(250,248,244,0.15)" },
									children: "·"
								}),
								/* @__PURE__ */ jsx(Link, {
									to: "/sitemap",
									className: "hover:text-white transition-colors",
									children: "Sitemap"
								})
							]
						})]
					})]
				})
			]
		})
	] });
}
//#endregion
export { About as default };
