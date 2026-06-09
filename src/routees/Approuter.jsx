import React, {
    Suspense,
    lazy,
    useState,
    useCallback,
    useMemo,
    createContext,
    useContext,
} from "react";

import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

import { useEffect } from "react";

// ─────────────────────────────────────────────
// Saved Context
// ─────────────────────────────────────────────

export const SavedContext = createContext({
    saved: [],
    toggleSave: () => { },
});

export const useSaved = () => useContext(SavedContext);

// ─────────────────────────────────────────────
// Lazy Loaded Pages
// ─────────────────────────────────────────────

const Blog = lazy(() => import("../pages/blog"));
const AllBlogs = lazy(() => import("../pages/AllBlogs"));
const ReadBlog = lazy(() => import("../pages/Readblog"));
const CategoryPage = lazy(() => import("../pages/CategoryPage"));
const SavedPins = lazy(() => import("../pages/SavedPins"));
const NotFound = lazy(() => import("../pages/NotFound"));

const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const TermsOfUse = lazy(() => import("../pages/TermsOfUse"));
const Sitemap = lazy(() => import("../pages/Sitemap"));
const About = lazy(() => import("../pages/About"));
const CategoriesPage = lazy(() => import("../pages/Categoriespage"));

// ─────────────────────────────────────────────
// Scroll To Top
// ─────────────────────────────────────────────

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [pathname]);

    return null;
}

// ─────────────────────────────────────────────
// App Router
// ─────────────────────────────────────────────

const AppRouter = () => {
    const [saved, setSaved] = useState(() => {
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
    });

    const toggleSave = useCallback((slug) => {
        setSaved((prev) => {
            const next = prev.includes(slug)
                ? prev.filter((item) => item !== slug)
                : [...prev, slug];

            localStorage.setItem(
                "bookmarks",
                JSON.stringify(next)
            );

            return next;
        });
    }, []);

    const contextValue = useMemo(
        () => ({
            saved,
            toggleSave,
        }),
        [saved, toggleSave]
    );

    return (
        <SavedContext.Provider value={contextValue}>
            <Router>
                <ScrollToTop />

                <Suspense
                    fallback={
                        <div className="flex min-h-screen items-center justify-center">
                            <div className="text-center">
                                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
                                <p className="text-lg font-medium text-gray-600">
                                    Loading content...
                                </p>
                            </div>
                        </div>
                    }
                >
                    <Routes>
                        <Route path="/" element={<Blog />} />

                        <Route
                            path="/blog"
                            element={<AllBlogs />}
                        />

                        <Route
                            path="/blog/:slug"
                            element={<ReadBlog />}
                        />

                        <Route
                            path="/category/:categorySlug"
                            element={<CategoryPage />}
                        />

                        <Route
                            path="/categories"
                            element={<CategoriesPage />}
                        />

                        <Route
                            path="/saved"
                            element={<SavedPins />}
                        />

                        <Route
                            path="/privacy-policy"
                            element={<PrivacyPolicy />}
                        />

                        <Route
                            path="/terms"
                            element={<TermsOfUse />}
                        />

                        <Route
                            path="/sitemap"
                            element={<Sitemap />}
                        />

                        <Route
                            path="/about"
                            element={<About />}
                        />

                        <Route
                            path="*"
                            element={<NotFound />}
                        />
                    </Routes>
                </Suspense>
            </Router>
        </SavedContext.Provider>
    );
};

export default AppRouter;