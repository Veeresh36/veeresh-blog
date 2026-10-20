import { Head } from "vite-react-ssg";

const SITE_URL = "https://www.veereshbashetti.com";

/**
 * Per-page <head> tags that are written into the prerendered HTML.
 * Without this, every static page shipped the same title and no canonical.
 */
export default function SEO({ title, description, path = "/", noindex = false }) {
    const url = `${SITE_URL}${path === "/" ? "" : path}`;
    return (
        <Head>
            <title>{title}</title>
            {description ? <meta name="description" content={description} /> : null}
            <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />
            <link rel="canonical" href={url} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Veeresh Bashetti" />
            <meta property="og:title" content={title} />
            {description ? <meta property="og:description" content={description} /> : null}
            <meta property="og:url" content={url} />
        </Head>
    );
}
