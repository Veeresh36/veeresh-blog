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

  // Prerender.io expects the FULL target URL appended after service.prerender.io/
  const url = new URL(request.url);
  const prerenderUrl = `https://service.prerender.io/${url.href}`;

  try {
    const prerenderResponse = await fetch(prerenderUrl, {
      headers: {
        "X-Prerender-Token": process.env.PRERENDER_TOKEN,
        "User-Agent": userAgent,
      },
    });

    const html = await prerenderResponse.text();

    return new Response(html, {
      status: prerenderResponse.status,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (err) {
    // If Prerender.io fails for any reason, fall back to normal SPA
    // rather than showing a broken page to the bot
    return;
  }
}