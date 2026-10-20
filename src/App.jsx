import {
    useState,
    useCallback,
    useMemo,
    createContext,
    useContext,
    useEffect,
} from "react"
import { Outlet, useLocation, useNavigation } from "react-router-dom"
import { HelmetProvider } from "react-helmet-async"
import { Analytics } from "@vercel/analytics/react"
import CookieBanner from "./pages/CookieBanner"
import "./App.css"

// ─────────────────────────────────────────────
// Saved Context
// ─────────────────────────────────────────────

export const SavedContext = createContext({
    saved: [],
    toggleSave: () => {},
})


export const useSaved = () => useContext(SavedContext)

function getInitialSaved() {
    if (typeof window === "undefined") return []

    try {
        const oldBookmarks = localStorage.getItem("saved_posts")
        const bookmarks = localStorage.getItem("bookmarks")

        if (oldBookmarks && (!bookmarks || bookmarks === "[]")) {
            localStorage.setItem("bookmarks", oldBookmarks)
            localStorage.removeItem("saved_posts")
            return JSON.parse(oldBookmarks)
        }

        return JSON.parse(bookmarks || "[]")
    } catch (error) {
        console.error("Failed to load bookmarks:", error)
        return []
    }
}

// ─────────────────────────────────────────────
// Scroll To Top
// ─────────────────────────────────────────────

function ScrollToTop() {
    const { pathname } = useLocation()

    useEffect(() => {
        const html = document.documentElement
        const prevBehavior = html.style.scrollBehavior
        html.style.scrollBehavior = "auto"
        window.scrollTo(0, 0)
        html.style.scrollBehavior = prevBehavior
    }, [pathname])

    return null
}

// ─────────────────────────────────────────────
// Navigation Loading Bar
// ─────────────────────────────────────────────

function NavigationProgress() {
    const navigation = useNavigation()
    const isLoading = navigation.state === "loading"

    if (!isLoading) return null

    return (
        <div
            className="fixed top-0 left-0 right-0 h-[3px] z-[200] bg-gradient-to-r from-red-500 to-pink-500 animate-pulse"
            aria-hidden="true"
        />
    )
}

// ─────────────────────────────────────────────
// App
// ─────────────────────────────────────────────

function App() {
    const [saved, setSaved] = useState(getInitialSaved)

    // Prevent the browser from restoring old scroll positions on client-side
    // navigation — this was fighting with our own scroll-to-top logic and
    // causing pages to load already scrolled down.
    useEffect(() => {
        if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual"
        }
    }, [])

    const toggleSave = useCallback((slug) => {
        setSaved((prev) => {
            const next = prev.includes(slug)
                ? prev.filter((item) => item !== slug)
                : [...prev, slug]

            if (typeof window !== "undefined") {
                localStorage.setItem("bookmarks", JSON.stringify(next))
            }

            return next
        })
    }, [])

    const contextValue = useMemo(() => ({ saved, toggleSave }), [saved, toggleSave])

    return (
        <HelmetProvider>
            <SavedContext.Provider value={contextValue}>
                <CookieBanner />
                <ScrollToTop />
                <NavigationProgress />
                <Outlet />
                {typeof window !== "undefined" && <Analytics />}
            </SavedContext.Provider>
        </HelmetProvider>
    )
}

export default App