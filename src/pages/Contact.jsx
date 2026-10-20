import { Link } from "react-router-dom";
import { Head } from "vite-react-ssg";

const SITE_URL = "https://www.veereshbashetti.com";
const EMAIL = "veeresh.b.bashetti@gmail.com";
const GITHUB = "https://github.com/Veeresh36";
const LINKEDIN = "https://www.linkedin.com/in/veeresh-bashetti";

const REASONS = [
    {
        title: "Corrections",
        text: "Found a mistake in a tutorial, a broken code sample or an outdated fact? Tell me the post URL and what is wrong. I fix verified errors and note the update date on the post.",
    },
    {
        title: "Topic requests",
        text: "Stuck on a Python, Django, React or SQL concept and want a guide on it? Send the topic and what confused you. Reader questions decide what I write next.",
    },
    {
        title: "Collaboration",
        text: "For guest posts, freelance web development or tool partnerships, share a short summary of the project and your timeline.",
    },
];

export default function Contact() {
    const graph = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact Veeresh Bashetti",
        url: `${SITE_URL}/contact`,
        mainEntity: {
            "@type": "Person",
            name: "Veeresh Bashetti",
            email: EMAIL,
            url: SITE_URL,
            sameAs: [GITHUB, LINKEDIN],
        },
    };

    return (
        <div className="min-h-screen" style={{ background: "#FAF8F4", color: "#1A1612", fontFamily: "'Outfit', system-ui, sans-serif" }}>
            <Head>
                <title>Contact | Veeresh Bashetti</title>
                <meta name="description" content="Contact Veeresh Bashetti to report a correction, suggest a tutorial topic or discuss a web development project. Replies within 2 to 3 working days." />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`${SITE_URL}/contact`} />
                <script type="application/ld+json">{JSON.stringify(graph)}</script>
            </Head>

            <header style={{ borderBottom: "1px solid #E8E0D5" }}>
                <div style={{ maxWidth: 960, margin: "0 auto", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Link to="/" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#1A1612", textDecoration: "none" }}>
                        Veeresh<span style={{ color: "#E60023" }}>.</span>
                    </Link>
                    <nav aria-label="Primary" style={{ display: "flex", gap: 20, fontSize: 14 }}>
                        <Link to="/blog" style={{ color: "#5D534E", textDecoration: "none" }}>Blog</Link>
                        <Link to="/about" style={{ color: "#5D534E", textDecoration: "none" }}>About</Link>
                        <Link to="/contact" style={{ color: "#1A1612", textDecoration: "none", fontWeight: 600 }}>Contact</Link>
                    </nav>
                </div>
            </header>

            <main style={{ maxWidth: 760, margin: "0 auto", padding: "64px 24px 96px" }}>
                <p style={{ fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "#A6791E", marginBottom: 12 }}>Contact</p>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1.1, margin: "0 0 20px" }}>
                    Get in touch
                </h1>
                <p style={{ fontSize: 17, lineHeight: 1.8, color: "#5D534E", marginBottom: 36 }}>
                    I'm Veeresh Bashetti, a web developer from Hubballi, Karnataka, India, and I write every guide on this site myself.
                    The best way to reach me is email. I read every message and usually reply within 2 to 3 working days.
                </p>

                <div style={{ background: "#fff", border: "1px solid #E8E0D5", borderRadius: 16, padding: 24, marginBottom: 40 }}>
                    <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8C7E74", margin: "0 0 6px" }}>Email</p>
                    <a href={`mailto:${EMAIL}`} style={{ fontSize: 20, fontWeight: 600, color: "#1A1612" }}>{EMAIL}</a>
                    <p style={{ fontSize: 14, color: "#8C7E74", margin: "16px 0 0" }}>
                        Also on <a href={GITHUB} target="_blank" rel="noopener noreferrer" style={{ color: "#1A1612" }}>GitHub</a> and{" "}
                        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" style={{ color: "#1A1612" }}>LinkedIn</a>.
                    </p>
                </div>

                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, margin: "0 0 16px" }}>What to write to me about</h2>
                <div style={{ display: "grid", gap: 14 }}>
                    {REASONS.map((r) => (
                        <section key={r.title} style={{ background: "#fff", border: "1px solid #E8E0D5", borderRadius: 14, padding: "18px 20px" }}>
                            <h3 style={{ margin: "0 0 6px", fontSize: 17 }}>{r.title}</h3>
                            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.75, color: "#5D534E" }}>{r.text}</p>
                        </section>
                    ))}
                </div>

                <p style={{ fontSize: 14, lineHeight: 1.8, color: "#8C7E74", marginTop: 40 }}>
                    Please include the post URL when you write about a specific guide. For how your data is handled, see the <Link to="/privacy-policy" style={{ color: "#1A1612" }}>Privacy Policy</Link>.
                </p>
            </main>

            <footer style={{ borderTop: "1px solid #E8E0D5", padding: "24px", textAlign: "center", fontSize: 13, color: "#8C7E74" }}>
                © 2026 Veeresh Bashetti ·{" "}
                <Link to="/privacy-policy" style={{ color: "#8C7E74" }}>Privacy</Link> ·{" "}
                <Link to="/terms" style={{ color: "#8C7E74" }}>Terms</Link> ·{" "}
                <Link to="/sitemap" style={{ color: "#8C7E74" }}>Sitemap</Link>
            </footer>
        </div>
    );
}
