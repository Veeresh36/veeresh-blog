import { Suspense, lazy } from "react"
import App from "../App.jsx"
import SEO from "../components/SEO.jsx"
import { loadPost, loadManifest } from "../utils/blogData.js"

const Blog = lazy(() => import("../pages/blog"))
const AllBlogs = lazy(() => import("../pages/AllBlogs"))
const ReadBlog = lazy(() => import("../pages/Readblog"))
const CategoryPage = lazy(() => import("../pages/CategoryPage"))
const SavedPins = lazy(() => import("../pages/SavedPins"))
const NotFound = lazy(() => import("../pages/NotFound"))
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"))
const TermsOfUse = lazy(() => import("../pages/TermsOfUse"))
const Sitemap = lazy(() => import("../pages/Sitemap"))
const About = lazy(() => import("../pages/About"))
const Contact = lazy(() => import("../pages/Contact"))
const CategoriesPage = lazy(() => import("../pages/Categoriespage"))

const withSuspense = (Component, seo) => (
    <Suspense
        fallback={
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
                    <p className="text-lg font-medium text-gray-600">Loading content...</p>
                </div>
            </div>
        }
    >
        {seo ? <SEO {...seo} /> : null}
        <Component />
    </Suspense>
)

export const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: withSuspense(Blog) },
            {
                path: "blog",
                element: withSuspense(AllBlogs, { title: "All Guides | Veeresh Bashetti", description: "Every Python, Django, React, SQL and developer career guide on the site, with tested code and linked sources.", path: "/blog" }),
                loader: async () => {
                    return await loadManifest();
                },
            },
            {
                path: "blog/:slug",
                element: withSuspense(ReadBlog),
                loader: async ({ params }) => {
                    const [post, manifest] = await Promise.all([
                        loadPost(params.slug),
                        loadManifest(),
                    ]);
                    const entry = manifest?.posts?.find(p => p.slug === params.slug);
                    if (!post || !entry) return { post, manifest };

                    const fm = post.frontmatter || {};
                    const published = fm.date || entry.date;
                    const modified = fm.updated || (entry.lastModified && entry.lastModified !== published ? entry.lastModified : undefined);

                    return {
                        manifest,
                        post: {
                            ...post,
                            frontmatter: {
                                ...fm,
                                title: fm.title || entry.title,
                                description: fm.description || entry.description,
                                excerpt: fm.excerpt || entry.excerpt,
                                image: fm.image || entry.image,
                                imageAlt: fm.imageAlt || entry.imageAlt,
                                category: fm.category || entry.category,
                                author: fm.author || entry.author,
                                tags: fm.tags?.length ? fm.tags : entry.tags,
                                date: published,
                                updated: modified,
                                seo: { title: entry.title, description: entry.description, ...(entry.noindex ? { robots: "noindex, follow" } : {}), ...fm.seo },
                            },
                        },
                    };
                },
            },
            { path: "category/:categorySlug", element: withSuspense(CategoryPage) },
            { path: "categories", element: withSuspense(CategoriesPage, { title: "Topics | Veeresh Bashetti", description: "Browse developer guides by topic: Python, Django, React, SQL, APIs, tools and career advice.", path: "/categories" }) },
            { path: "saved", element: withSuspense(SavedPins, { title: "Saved Posts | Veeresh Bashetti", description: "Posts you have saved on this device.", path: "/saved", noindex: true }) },
            { path: "privacy-policy", element: withSuspense(PrivacyPolicy, { title: "Privacy Policy | Veeresh Bashetti", description: "How veereshbashetti.com handles analytics, cookies, advertising and your data.", path: "/privacy-policy" }) },
            { path: "terms", element: withSuspense(TermsOfUse, { title: "Terms of Use | Veeresh Bashetti", description: "Terms of use for veereshbashetti.com.", path: "/terms" }) },
            { path: "sitemap", element: withSuspense(Sitemap, { title: "Sitemap | Veeresh Bashetti", description: "A complete list of pages and guides on veereshbashetti.com.", path: "/sitemap" }) },
            { path: "about", element: withSuspense(About, { title: "About Veeresh Bashetti | Python Full Stack Developer", description: "About Veeresh Bashetti, a Python full-stack developer from Hubballi, India who writes practical Python, Django and React guides for beginners.", path: "/about" }) },
            { path: "contact", element: withSuspense(Contact) },
            { path: "404", element: withSuspense(NotFound) },
            { path: "*", element: withSuspense(NotFound) },
        ],
    },
]