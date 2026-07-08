import { Suspense, lazy } from "react"
import App from "../App.jsx"
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
const CategoriesPage = lazy(() => import("../pages/Categoriespage"))

const withSuspense = (Component) => (
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
        <Component />
    </Suspense>
)

export const routes = [
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: withSuspense(Blog) },
            { path: "blog", element: withSuspense(AllBlogs) },
            {
                path: "blog/:slug",
                element: withSuspense(ReadBlog),
                loader: async ({ params }) => {
                    const [post, manifest] = await Promise.all([
                        loadPost(params.slug),
                        loadManifest(),
                    ]);
                    return { post, manifest };
                },
            },
            { path: "category/:categorySlug", element: withSuspense(CategoryPage) },
            { path: "categories", element: withSuspense(CategoriesPage) },
            { path: "saved", element: withSuspense(SavedPins) },
            { path: "privacy-policy", element: withSuspense(PrivacyPolicy) },
            { path: "terms", element: withSuspense(TermsOfUse) },
            { path: "sitemap", element: withSuspense(Sitemap) },
            { path: "about", element: withSuspense(About) },
            { path: "*", element: withSuspense(NotFound) },
        ],
    },
]