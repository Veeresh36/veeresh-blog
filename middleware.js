
export const config = {
  matcher: "/((?!api|_next|assets|blogs|.*\\..*).*)",
};

const BOT_USER_AGENTS = [
  "googlebot",
  "mediapartners-google",
  "adsbot-google",
  "bingbot",
  "yandex",
  "duckduckbot",
  "baiduspider",
  "facebookexternalhit",
  "twitterbot",
  "linkedinbot",
];

export default async function middleware(request) {
  const userAgent = request.headers.get("user-agent") || "";

  const isBot = BOT_USER_AGENTS.some((bot) =>
    userAgent.toLowerCase().includes(bot)
  );

  if (!isBot) {
    return;
  }

  const token = process.env.PRERENDER_TOKEN;

  // If Prerender is not configured, serve the normal SPA.
  if (!token) {
    return;
  }

  const prerenderUrl = `https://service.prerender.io/${request.url}`;

  try {
    const prerenderResponse = await fetch(prerenderUrl, {
      headers: {
        "X-Prerender-Token": token,
        "User-Agent": userAgent,
      },
    });

    // Only return successful prerendered HTML.
    if (prerenderResponse.ok) {
      const html = await prerenderResponse.text();

      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }

    // On Prerender errors, fall back to the regular SPA.
    console.error(
      `Prerender failed: ${prerenderResponse.status} for ${request.url}`
    );

    return;
  } catch (error) {
    console.error("Prerender request failed:", error);

    // Fall back to the regular SPA.
    return;
  }
}
