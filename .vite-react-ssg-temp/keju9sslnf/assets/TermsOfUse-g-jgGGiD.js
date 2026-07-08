import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/pages/TermsOfUse.jsx
var SITE = {
	name: "Veeresh Bashetti",
	email: "veeresh.b.bashetti@gmail.com",
	pinterestUrl: "https://in.pinterest.com/veereshbbashetti/",
	baseUrl: "https://veereshbashetti.com"
};
var LAST_UPDATED = "May 31, 2025";
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
var sections = [
	{
		id: "acceptance",
		title: "Acceptance of terms",
		icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z",
		content: [{
			type: "text",
			value: "By accessing or using veereshbashetti.com (the 'Site'), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use the Site."
		}, {
			type: "text",
			value: "These terms apply to all visitors, readers, and anyone who interacts with the Site in any way — including leaving comments, clicking affiliate links, or sharing content."
		}]
	},
	{
		id: "content",
		title: "Content & intellectual property",
		icon: "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z",
		content: [
			{
				type: "text",
				value: "All original content on this Site — articles, photographs, graphics, and other materials — is owned by Veeresh Bashetti unless explicitly stated otherwise. It is protected under applicable copyright laws."
			},
			{
				type: "subheading",
				value: "What you may do"
			},
			{
				type: "list",
				items: [
					"Read, share links to, and quote short excerpts (up to ~50 words) with clear attribution and a link back to the original article.",
					"Save articles for personal, non-commercial reading.",
					"Share articles on social media with credit."
				]
			},
			{
				type: "subheading",
				value: "What you may not do"
			},
			{
				type: "list",
				items: [
					"Reproduce full articles, posts, or substantial portions on another website, publication, or platform without written permission.",
					"Scrape or auto-extract content for any commercial or AI training purpose.",
					"Remove or alter any copyright, trademark, or attribution notices.",
					"Present my content as your own in any form."
				]
			},
			{
				type: "highlight",
				value: "To request permission for republishing or licensing, please email me directly. I'm generally happy to say yes for non-commercial educational uses."
			}
		]
	},
	{
		id: "comments",
		title: "Comments & user content",
		icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
		content: [
			{
				type: "text",
				value: "The Site allows readers to leave comments on articles. By submitting a comment, you agree to the following:"
			},
			{
				type: "list",
				items: [
					"Your comment and the name you provide will be publicly visible.",
					"You grant me a non-exclusive, royalty-free licence to display your comment on the Site.",
					"You are solely responsible for the content you submit.",
					"I reserve the right to remove any comment at any time, for any reason, without notice — including spam, harassment, hate speech, or off-topic content.",
					"Comments are moderated and may not appear immediately."
				]
			},
			{
				type: "text",
				value: "Please be kind and constructive. This is a small personal blog — I'd like it to stay a pleasant place."
			}
		]
	},
	{
		id: "affiliate",
		title: "Affiliate links & advertising",
		icon: "M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1",
		content: [
			{
				type: "text",
				value: "Some links on this Site are affiliate links, primarily through Amazon Associates and similar programmes. This means:"
			},
			{
				type: "list",
				items: [
					"If you click an affiliate link and make a purchase, I may earn a small commission.",
					"Your purchase price is not affected in any way.",
					"Affiliate links are always disclosed near the content that contains them.",
					"I only link to products I genuinely find useful or have researched. Affiliate relationships do not influence editorial opinions."
				]
			},
			{
				type: "text",
				value: "The Site also displays advertisements served by Google AdSense. I do not control which specific ads appear. Ad content does not constitute an endorsement by me."
			}
		]
	},
	{
		id: "disclaimer",
		title: "Disclaimer",
		icon: "M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
		content: [
			{
				type: "text",
				value: "The content on this Site is published for general informational and entertainment purposes only. It is not intended as professional advice of any kind."
			},
			{
				type: "cards",
				items: [
					{
						label: "Financial",
						icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
						text: "Nothing on this Site is financial or investment advice. Always consult a qualified professional before making financial decisions."
					},
					{
						label: "Medical",
						icon: "M4.318 6.318a4.5 4.5 0 0 0 0 6.364L12 20.364l7.682-7.682a4.5 4.5 0 0 0-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 0 0-6.364 0z",
						text: "No content constitutes medical advice. Consult a qualified healthcare professional for any health-related concerns."
					},
					{
						label: "Legal",
						icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 0 0 6.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 0 0 6.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
						text: "No content constitutes legal advice. Laws vary by jurisdiction. Consult a qualified lawyer for legal matters."
					}
				]
			},
			{
				type: "text",
				value: "While I make every effort to ensure information is accurate and up to date, I make no warranties — express or implied — about the completeness, accuracy, or fitness of the content for any particular purpose."
			}
		]
	},
	{
		id: "external-links",
		title: "External links",
		icon: "M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14",
		content: [{
			type: "text",
			value: "Articles on this Site may contain links to third-party websites. These links are provided for convenience and reference only."
		}, {
			type: "list",
			items: [
				"I do not control, endorse, or take responsibility for the content of any external site.",
				"Clicking an external link means you leave this Site and are subject to the privacy policy and terms of that third party.",
				"External links are not sponsorships or endorsements unless explicitly marked as such."
			]
		}]
	},
	{
		id: "limitation",
		title: "Limitation of liability",
		icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
		content: [
			{
				type: "text",
				value: "To the fullest extent permitted by applicable law, Veeresh Bashetti shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from:"
			},
			{
				type: "list",
				items: [
					"Your use of or inability to use the Site.",
					"Any reliance placed on content published on the Site.",
					"Errors, omissions, or inaccuracies in content.",
					"Unauthorised access to or alteration of your data.",
					"Any matter beyond my reasonable control."
				]
			},
			{
				type: "text",
				value: "This limitation applies regardless of the theory of liability and even if I have been advised of the possibility of such damages."
			}
		]
	},
	{
		id: "governing-law",
		title: "Governing law",
		icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 0 0 6.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 0 0 6.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
		content: [{
			type: "text",
			value: "These Terms of Use are governed by and construed in accordance with the laws of India. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Karnataka, India."
		}, {
			type: "text",
			value: "If you are accessing the Site from outside India, you do so voluntarily and are responsible for compliance with local laws."
		}]
	},
	{
		id: "changes",
		title: "Changes to these terms",
		icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15",
		content: [{
			type: "text",
			value: "I may revise these Terms of Use at any time. The most current version will always be available at this URL with an updated 'Last updated' date at the top."
		}, {
			type: "text",
			value: "Continued use of the Site after any changes constitutes your acceptance of the new terms. If a change is significant, I'll make a note of it clearly."
		}]
	},
	{
		id: "contact",
		title: "Questions",
		icon: "M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z",
		content: [{
			type: "text",
			value: "If you have any questions about these Terms of Use, please get in touch:"
		}, {
			type: "contact",
			name: SITE.name,
			email: SITE.email,
			location: "Hubballi, Karnataka, India"
		}]
	}
];
var ProgressBar = ({ progress }) => /* @__PURE__ */ jsx("div", {
	className: "fixed top-[68px] left-0 right-0 h-[3px] z-[99]",
	"aria-hidden": "true",
	children: /* @__PURE__ */ jsx("div", {
		className: "h-full transition-[width] duration-75 ease-linear",
		style: {
			width: `${progress}%`,
			background: "linear-gradient(90deg, #E60023, #FF6B81)"
		}
	})
});
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
var SectionContent = ({ content, dark }) => {
	const border = dark ? "rgba(255,255,255,0.07)" : "#EAE4DC";
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-4",
		children: content.map((block, i) => {
			if (block.type === "text") return /* @__PURE__ */ jsx("p", {
				className: "text-[0.95rem] leading-[1.85] font-light",
				style: { color: dark ? "rgba(250,248,244,0.72)" : "#3D3530" },
				children: block.value
			}, i);
			if (block.type === "subheading") return /* @__PURE__ */ jsx("h3", {
				className: "font-['DM_Serif_Display',serif] text-[1.1rem] mt-6 mb-1",
				style: { color: dark ? "#FAF8F4" : "#1A1612" },
				children: block.value
			}, i);
			if (block.type === "list") return /* @__PURE__ */ jsx("ul", {
				className: "space-y-2 mt-1",
				children: block.items.map((item, j) => /* @__PURE__ */ jsxs("li", {
					className: "flex items-start gap-3 text-[0.9rem] leading-relaxed font-light",
					style: { color: dark ? "rgba(250,248,244,0.72)" : "#3D3530" },
					children: [/* @__PURE__ */ jsx("span", {
						className: "flex-shrink-0 mt-[0.38rem] w-1.5 h-1.5 rounded-full",
						style: { background: "#E60023" }
					}), item]
				}, j))
			}, i);
			if (block.type === "highlight") return /* @__PURE__ */ jsxs("div", {
				className: "flex items-start gap-3 p-4 rounded-xl mt-2",
				style: {
					background: dark ? "rgba(230,0,35,0.06)" : "#FFF5F6",
					border: "1.5px solid rgba(230,0,35,0.18)"
				},
				children: [/* @__PURE__ */ jsx("span", {
					className: "flex-shrink-0 mt-0.5 text-[#E60023]",
					children: /* @__PURE__ */ jsx(Icon, {
						d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
						size: 16
					})
				}), /* @__PURE__ */ jsx("p", {
					className: "text-[0.87rem] leading-relaxed font-light",
					style: { color: dark ? "rgba(250,248,244,0.75)" : "#3D3530" },
					children: block.value
				})]
			}, i);
			if (block.type === "cards") return /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4",
				children: block.items.map((card, j) => /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-2 p-4 rounded-xl border",
					style: {
						background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
						borderColor: border
					},
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ jsx("div", {
							className: "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
							style: { background: dark ? "rgba(230,0,35,0.12)" : "#FFF0F1" },
							children: /* @__PURE__ */ jsx(Icon, {
								d: card.icon,
								size: 13,
								className: "text-red-500"
							})
						}), /* @__PURE__ */ jsx("span", {
							className: "text-[0.75rem] font-bold uppercase tracking-wider",
							style: { color: dark ? "rgba(250,248,244,0.5)" : "#9C8E84" },
							children: card.label
						})]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-[0.8rem] leading-relaxed font-light",
						style: { color: dark ? "rgba(250,248,244,0.6)" : "#5A5046" },
						children: card.text
					})]
				}, j))
			}, i);
			if (block.type === "contact") return /* @__PURE__ */ jsxs("div", {
				className: "mt-4 p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center gap-5",
				style: {
					background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
					borderColor: border
				},
				children: [/* @__PURE__ */ jsx("div", {
					className: "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold font-['DM_Serif_Display',serif] flex-shrink-0",
					style: {
						background: "#1A1612",
						color: "#FAF8F4"
					},
					children: "V"
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-1",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "font-semibold text-[0.9rem]",
							style: { color: dark ? "#FAF8F4" : "#1A1612" },
							children: block.name
						}),
						/* @__PURE__ */ jsx("a", {
							href: `mailto:${block.email}`,
							className: "text-[0.85rem] font-medium hover:opacity-70 transition-opacity",
							style: { color: "#E60023" },
							children: block.email
						}),
						/* @__PURE__ */ jsx("div", {
							className: "text-[0.78rem]",
							style: { color: dark ? "rgba(250,248,244,0.4)" : "#9C8E84" },
							children: block.location
						})
					]
				})]
			}, i);
			return null;
		})
	});
};
function TermsOfUse() {
	const [dark, toggleDark] = useDarkMode();
	const progress = useReadingProgress();
	const [activeSection, setActiveSection] = useState(sections[0].id);
	const bg = dark ? "#0F0E0D" : "#FAF8F4";
	const border = dark ? "rgba(255,255,255,0.07)" : "#EAE4DC";
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
		window.scrollTo({
			top: el.getBoundingClientRect().top + window.scrollY - 96,
			behavior: "smooth"
		});
	};
	useEffect(() => {
		document.title = `Terms of Use — ${SITE.name}`;
		let canonical = document.querySelector("link[rel=\"canonical\"]");
		if (!canonical) {
			canonical = document.createElement("link");
			canonical.rel = "canonical";
			document.head.appendChild(canonical);
		}
		canonical.href = `${SITE.baseUrl}/terms`;
	}, []);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("style", { children: `
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
      ` }),
		/* @__PURE__ */ jsx(ProgressBar, { progress }),
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
					style: { color: dark ? "rgba(250,248,244,0.4)" : "#9C8E84" },
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
							children: "Terms of Use"
						})
					]
				}),
				/* @__PURE__ */ jsxs("header", {
					className: "max-w-[1280px] mx-auto px-6 pt-8 pb-14",
					style: { animation: "fadeUp 0.6s ease forwards" },
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.1em] uppercase px-3 py-1.5 rounded-full mb-5",
							style: {
								background: "#E600230F",
								color: "#E60023",
								border: "1px solid #E6002322"
							},
							children: "Legal"
						}),
						/* @__PURE__ */ jsx("h1", {
							className: "font-['DM_Serif_Display',serif] leading-[1.06] tracking-[-0.02em] mb-4 max-w-[560px]",
							style: {
								fontSize: "clamp(2rem, 4vw, 2.8rem)",
								color: dark ? "#FAF8F4" : "#1A1612"
							},
							children: "Terms of Use"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-[1rem] leading-relaxed max-w-[500px] font-light",
							style: { color: dark ? "rgba(250,248,244,0.5)" : "#7A6E64" },
							children: "The rules and conditions that apply when you use this site. Written to be understood, not to intimidate."
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-3 mt-6 text-[0.78rem]",
							style: { color: dark ? "rgba(250,248,244,0.4)" : "#9C8E84" },
							children: [
								/* @__PURE__ */ jsxs("span", { children: [
									"Last updated:",
									" ",
									/* @__PURE__ */ jsx("strong", {
										style: {
											color: dark ? "rgba(250,248,244,0.65)" : "#5A5046",
											fontWeight: 500
										},
										children: LAST_UPDATED
									})
								] }),
								/* @__PURE__ */ jsx("span", {
									className: "w-1 h-1 rounded-full inline-block",
									style: { background: dark ? "rgba(255,255,255,0.2)" : "#C8C0B8" }
								}),
								/* @__PURE__ */ jsx("span", { children: "Applies to veereshbashetti.com" }),
								/* @__PURE__ */ jsx("span", {
									className: "w-1 h-1 rounded-full inline-block",
									style: { background: dark ? "rgba(255,255,255,0.2)" : "#C8C0B8" }
								}),
								/* @__PURE__ */ jsx(Link, {
									to: "/privacy-policy",
									className: "font-medium hover:opacity-70 transition-opacity",
									style: { color: "#E60023" },
									children: "Privacy Policy →"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "max-w-[1280px] mx-auto px-6 pb-28 flex flex-col lg:flex-row gap-12 items-start",
					children: [/* @__PURE__ */ jsxs("aside", {
						className: "w-full lg:w-[240px] lg:shrink-0 lg:sticky lg:top-[96px] self-start hidden lg:block",
						"aria-label": "Table of contents",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "rounded-2xl overflow-hidden",
							style: {
								background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
								border: `1px solid ${border}`
							},
							children: [/* @__PURE__ */ jsx("div", {
								className: "px-4 py-3 text-[0.62rem] font-bold tracking-[0.14em] uppercase",
								style: {
									color: dark ? "rgba(250,248,244,0.35)" : "#9C8E84",
									borderBottom: `1px solid ${border}`
								},
								children: "Contents"
							}), /* @__PURE__ */ jsx("nav", {
								className: "p-2",
								children: sections.map((s) => {
									const isActive = activeSection === s.id;
									return /* @__PURE__ */ jsxs("button", {
										onClick: () => scrollTo(s.id),
										className: "w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-[0.78rem] transition-all duration-150 relative",
										style: {
											background: isActive ? dark ? "rgba(255,255,255,0.05)" : "#F4EFE6" : "transparent",
											color: isActive ? dark ? "#FAF8F4" : "#1A1612" : dark ? "rgba(250,248,244,0.5)" : "#5A5046",
											fontWeight: isActive ? 600 : 400
										},
										children: [
											isActive && /* @__PURE__ */ jsx("span", {
												className: "absolute left-0 top-2 bottom-2 w-0.5 rounded-full",
												style: { background: "#E60023" }
											}),
											/* @__PURE__ */ jsx(Icon, {
												d: s.icon,
												size: 13,
												className: "flex-shrink-0 opacity-70"
											}),
											s.title
										]
									}, s.id);
								})
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "rounded-2xl overflow-hidden mt-3",
							style: {
								background: dark ? "rgba(255,255,255,0.03)" : "#FFFFFF",
								border: `1px solid ${border}`
							},
							children: [/* @__PURE__ */ jsx("div", {
								className: "px-4 py-3 text-[0.62rem] font-bold tracking-[0.14em] uppercase",
								style: {
									color: dark ? "rgba(250,248,244,0.35)" : "#9C8E84",
									borderBottom: `1px solid ${border}`
								},
								children: "Also see"
							}), /* @__PURE__ */ jsx("div", {
								className: "p-2",
								children: /* @__PURE__ */ jsxs(Link, {
									to: "/privacy-policy",
									className: "flex items-center gap-2.5 px-3 py-2 rounded-xl text-[0.78rem] transition-all hover:opacity-70",
									style: { color: dark ? "rgba(250,248,244,0.6)" : "#5A5046" },
									children: [/* @__PURE__ */ jsx(Icon, {
										d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
										size: 13,
										className: "flex-shrink-0 opacity-60"
									}), "Privacy Policy"]
								})
							})]
						})]
					}), /* @__PURE__ */ jsxs("main", {
						className: "flex-1 min-w-0 max-w-[760px]",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "lg:hidden flex flex-wrap gap-2 mb-10 pb-8",
								style: { borderBottom: `1px solid ${border}` },
								children: sections.map((s) => /* @__PURE__ */ jsx("button", {
									onClick: () => scrollTo(s.id),
									className: "text-[0.72rem] font-semibold px-3 py-1.5 rounded-full border transition-all hover:opacity-70",
									style: {
										borderColor: border,
										color: dark ? "rgba(250,248,244,0.65)" : "#5A5046",
										background: dark ? "rgba(255,255,255,0.04)" : "#F5F1EB"
									},
									children: s.title
								}, s.id))
							}),
							/* @__PURE__ */ jsx("div", {
								className: "space-y-14",
								children: sections.map((section, idx) => /* @__PURE__ */ jsxs("section", {
									id: section.id,
									style: { scrollMarginTop: "96px" },
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-3 mb-5",
											children: [/* @__PURE__ */ jsx("div", {
												className: "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
												style: { background: dark ? "rgba(230,0,35,0.12)" : "#FFF0F1" },
												children: /* @__PURE__ */ jsx(Icon, {
													d: section.icon,
													size: 14,
													className: "text-red-500"
												})
											}), /* @__PURE__ */ jsx("h2", {
												className: "font-['DM_Serif_Display',serif] text-[1.5rem] leading-tight",
												style: { color: dark ? "#FAF8F4" : "#1A1612" },
												children: section.title
											})]
										}),
										/* @__PURE__ */ jsx("div", {
											className: "w-full h-px mb-6",
											style: { background: border }
										}),
										/* @__PURE__ */ jsx(SectionContent, {
											content: section.content,
											dark
										}),
										/* @__PURE__ */ jsxs("div", {
											className: "mt-6 text-[0.68rem] font-bold",
											style: { color: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" },
											children: ["§", String(idx + 1).padStart(2, "0")]
										})
									]
								}, section.id))
							}),
							/* @__PURE__ */ jsx("div", {
								className: "mt-16 pt-8 pb-2",
								style: { borderTop: `1px solid ${border}` },
								children: /* @__PURE__ */ jsxs("p", {
									className: "text-[0.78rem] leading-relaxed font-light",
									style: { color: dark ? "rgba(250,248,244,0.35)" : "#9C8E84" },
									children: [
										"These terms were written by a human and reflect the actual practices of this site as of ",
										LAST_UPDATED,
										". They're meant to be fair and readable. If something seems off, please email me."
									]
								})
							})
						]
					})]
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
								style: { color: "rgba(250,248,244,0.25)" },
								children: [
									"© ",
									(/* @__PURE__ */ new Date()).getFullYear(),
									" All rights reserved."
								]
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4 text-[0.78rem]",
							style: { color: "rgba(250,248,244,0.4)" },
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
								/* @__PURE__ */ jsx("a", {
									href: `mailto:${SITE.email}`,
									className: "hover:text-white transition-colors",
									children: "Contact"
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
export { TermsOfUse as default };
