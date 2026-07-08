import {
    useState,
    useCallback,
    useMemo,
    createContext,
    useContext,
    useEffect,
} from "react"
import { Outlet, useLocation } from "react-router-dom"
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
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [pathname])

    return null
}

// ─────────────────────────────────────────────
// App
// ─────────────────────────────────────────────

function App() {
    const [saved, setSaved] = useState(getInitialSaved)

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
                <Outlet />
                {typeof window !== "undefined" && <Analytics />}
            </SavedContext.Provider>
        </HelmetProvider>
    )
}

export default App