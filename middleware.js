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

  const prerenderUrl = `https://service.prerender.io${request.nextUrl.pathname}`;

  const prerenderResponse = await fetch(prerenderUrl, {
    headers: {
      "X-Prerender-Token": process.env.PRERENDER_TOKEN,
      "User-Agent": userAgent,
    },
  });

  const html = await prerenderResponse.text();

  return new Response(html, {
    status: prerenderResponse.status,
    headers: { "Content-Type": "text/html" },
  });
}