---
title: "Types of APIs and Their Use Cases: Open, Internal and Partner APIs Explained (2026)"
slug: "types-of-apis-and-their-use-cases-explained"
description: "Types of APIs explained: Open, Internal and Partner APIs, plus REST, SOAP and GraphQL, with 9 real use cases, JavaScript code and a free video."
excerpt: "Most 'types of APIs' lists mix two different questions: who can use the API, and how it talks. This guide separates them, walks through 9 real use cases from weather data to affiliate tracking, and shows JavaScript code for each."
author: "Veeresh Bashetti"
date: "2026-10-09"
lastModified: "2026-10-09"
category: "tech"
tag: "backend"
emoji: "🔌"
gradient: "from-[#0D1321] to-[#1D2D50]"
readingTime: "14 min read"
meta: "14 min read · 9 October 2026 · Checked against GitHub Docs, OpenAPI and freeCodeCamp, sources linked"
featured: false
image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/Types%20of%20APIs_%20A%20Developer%E2%80%99s%20Guide.webp"
imageAlt: "Types of APIs and their use cases: open, internal and partner APIs with REST, SOAP, GraphQL, backend to backend, frontend to backend, B2B and affiliate examples"
authorUrl: "https://veereshbashetti.com/about"
canonicalUrl: "https://www.veereshbashetti.com/blog/types-of-apis-and-their-use-cases-explained"

tags:
  - Types of APIs
  - API Use Cases
  - REST API
  - SOAP API
  - GraphQL
  - Internal API
  - Partner API
  - Open API
  - Frontend Developer
  - JavaScript
  - Students
  - 2026

seo:
  title: "Types of APIs and Their Use Cases (2026 Guide)"
  description: "Types of APIs explained: Open, Internal and Partner APIs, plus REST, SOAP and GraphQL, with 9 real use cases, JavaScript code and a free video."
  focusKeyword: "types of apis"
  keywords:
    - types of apis
    - types of apis and their use cases
    - open api vs internal api vs partner api
    - public api vs private api vs partner api
    - rest vs soap vs graphql
    - what is a partner api
    - what is an internal api
    - frontend to backend api
    - backend to backend api
    - b2b api integration
    - affiliate api
    - open api vs openapi
    - api types for beginners
    - api examples with use cases
    - which api type should i use
    - rest api example javascript
    - graphql query example javascript
    - soap api example
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  canonical: "https://www.veereshbashetti.com/blog/types-of-apis-and-their-use-cases-explained"
  locale: "en_IN"
  inLanguage: "en-IN"
  articleSection: "Technology"
  publishedTime: "2026-10-09T00:00:00+05:30"
  modifiedTime: "2026-10-09T00:00:00+05:30"
  og:
    type: "article"
    siteName: "Veeresh Bashetti"
    title: "Types of APIs and Their Use Cases (2026 Guide)"
    description: "Open, Internal and Partner APIs, plus REST, SOAP and GraphQL, each tied to a real use case with JavaScript code."
    image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/types-of-apis-and-their-use-cases.webp"
    imageAlt: "Types of APIs and their use cases: open, internal and partner APIs with REST, SOAP, GraphQL, backend to backend, frontend to backend, B2B and affiliate examples"
    url: "https://www.veereshbashetti.com/blog/types-of-apis-and-their-use-cases-explained"
  twitter:
    card: "summary_large_image"
    title: "Types of APIs and Their Use Cases (2026 Guide)"
    description: "Who can use an API and how it talks are two different questions. Here are 9 API types with real use cases and code."
    image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/types-of-apis-and-their-use-cases.webp"
    imageAlt: "Types of APIs and their use cases: open, internal and partner APIs with REST, SOAP, GraphQL, backend to backend, frontend to backend, B2B and affiliate examples"
  schema:
    types:
      - Article
      - FAQPage
      - BreadcrumbList
    articleType: "TechArticle"
    about:
      - "Application programming interfaces"
      - "Web development"
    proficiencyLevel: "Beginner"
  breadcrumbs:
    - name: "Home"
      url: "https://www.veereshbashetti.com/"
    - name: "Tech"
      url: "https://www.veereshbashetti.com/category/tech"
    - name: "Types of APIs and Their Use Cases"
      url: "https://www.veereshbashetti.com/blog/types-of-apis-and-their-use-cases-explained"

takeaways:
  - "There are two separate questions inside 'what type of API is this?'. Who is allowed to use it (open, internal or partner) and how does it exchange data (REST, SOAP, GraphQL and others). Most confusion comes from mixing them."
  - "Open, internal and partner describe access. REST, SOAP and GraphQL describe style. A single company can run a REST open API, a GraphQL internal API and a SOAP partner API at the same time."
  - "For most new web and mobile work, REST is the default, GraphQL helps when screens need flexible data shapes, and SOAP mostly shows up when you integrate with older enterprise, finance or government systems."
  - "Internal APIs are the ones you will touch first as a developer: your frontend calling your backend, and your services calling each other. Partner APIs add contracts, keys and verification on top."
  - "'Open API' (a public API) and 'OpenAPI' (a specification for describing HTTP APIs) are different things, and mixing them up is one of the most common beginner mistakes."

faqs:
  - q: "What are the main types of APIs?"
    a: "The simplest way to group them is by who can access them: open (public) APIs available to any developer who accepts the terms, internal (private) APIs used only inside one organisation, and partner APIs shared with specific business partners under an agreement. Separately, APIs differ in style, such as REST, SOAP and GraphQL, and newer styles such as gRPC, WebSocket and webhooks."
  - q: "What is the difference between an open API, an internal API and a partner API?"
    a: "An open API is available to anyone willing to follow its terms, usually with an API key or OAuth. An internal API is consumed inside one organisation and is not meant to be exposed outside it. A partner API sits in the middle: it is shared only with partners who have an established relationship and usually a contract with the provider."
  - q: "Is REST, SOAP or GraphQL an open API?"
    a: "Not by definition. REST, SOAP and GraphQL describe how an API exchanges data, not who can use it. A REST API can be open, internal or partner-only. The same is true for SOAP and GraphQL, so always ask the access question and the style question separately."
  - q: "What is the difference between 'Open API' and 'OpenAPI'?"
    a: "An open API is simply a public API that developers can use. OpenAPI is a vendor-neutral specification, maintained under the Linux Foundation, for describing HTTP APIs in a machine-readable YAML or JSON file. You can write an OpenAPI document for a public, private or partner API."
  - q: "Which API type should a beginner learn first?"
    a: "Start with REST, because most public web APIs and tutorials use it, then learn how a frontend calls a backend with fetch. After that, learn GraphQL to understand flexible queries, and read about SOAP so you recognise it when you meet an older enterprise system."
  - q: "Is SOAP still used in 2026?"
    a: "Yes, in specific places. It remains common in some enterprise, finance, healthcare and legacy integrations because of its formal contracts and built-in standards for security and reliability. For new public web APIs, REST and GraphQL are much more common."
  - q: "What is a partner API used for?"
    a: "Partner APIs let a company share data or functions with selected business partners under agreed terms. Typical examples are B2B integrations such as hotel, airline or payment gateway connections, affiliate programmes that track links and commissions, and data-sharing APIs for health, finance or logistics information."
---

# Types of APIs and Their Use Cases: Open, Internal and Partner APIs Explained

**Published:** October 9, 2026 · **Last updated:** October 9, 2026 · **14 min read** · By [Veeresh Bashetti](https://veereshbashetti.com/about) · Sources linked below

---

> 💡 **Quick answer, if you're in a hurry:** APIs are usually grouped by **who can use them**: open (public) APIs for any developer, internal (private) APIs inside one company, and partner APIs for selected business partners. Separately, they differ in **style**: REST, SOAP and GraphQL are the three most common. The 9 use cases below show where each type appears in real products, with JavaScript code and an order to learn them in.

## Table of Contents

1. [Why "Types of APIs" Is So Confusing](#why-types-of-apis-is-so-confusing)
2. [The 9 API Types at a Glance](#the-9-api-types-at-a-glance)
3. [Open APIs: REST, SOAP and GraphQL](#open-apis-rest-soap-and-graphql)
4. [Internal APIs: Backend, Frontend and Database](#internal-apis-backend-frontend-and-database)
5. [Partner APIs: B2B, Affiliate and Data Sharing](#partner-apis-b2b-affiliate-and-data-sharing)
6. [Open API vs OpenAPI: Do Not Mix Them Up](#open-api-vs-openapi-do-not-mix-them-up)
7. [What the Infographic Leaves Out](#what-the-infographic-leaves-out)
8. [Which API Type Should You Use?](#which-api-type-should-you-use)
9. [Common API Mistakes Beginners Make](#common-api-mistakes-beginners-make)
10. [Free Video to Go Deeper](#free-video-to-go-deeper)
11. [Copyable API Types Checklist](#copyable-api-types-checklist)
12. [Final Word: My Honest Take](#final-word-my-honest-take)
13. [Sources and Further Reading](#sources-and-further-reading)
14. [More Useful Resources](#more-useful-resources)

---

## Why "Types of APIs" Is So Confusing

Search for "types of APIs" and you will find lists that put REST, SOAP, public APIs, private APIs and webhooks side by side as if they were the same kind of thing. They are not, and that is why the topic feels messier than it needs to be.

An API (application programming interface) is a set of rules for how one piece of software asks another for data or actions. Once you accept that, there are really **two different questions** you can ask about any API:

1. **Who is allowed to use it?** This is the *access* question. The common answers are open (public), internal (private) and partner.
2. **How does it exchange data?** This is the *style* question. The common answers are REST, SOAP and GraphQL.

A popular infographic titled "Types of APIs & Their Use Cases" organises the topic as a tree. It starts with three access groups (Open, Internal and Partner), and under each group it lists three examples with a small use case next to each. The Open branch happens to contain the three styles (REST, SOAP and GraphQL), while the Internal and Partner branches list *situations* (backend to backend, B2B integration and so on). That is a handy way to remember nine examples, and this guide follows the same nine, but I add explanations, code and a few corrections where the infographic is loose.

The biggest correction is this: **style and access are independent.** A company can run a REST API for the public, a GraphQL API for its own mobile app and a SOAP API for one banking partner, all at once. Keep the two questions apart and the rest of this guide will feel simple.

If you are still building your fundamentals, start with my [frontend developer roadmap for 2026](/blog/frontend-developer-roadmap-2026-learn-in-this-order), because APIs make the most sense once you are comfortable with JavaScript and HTTP. If status codes are the part that confuses you, read [HTTP status codes explained with real code examples](/blog/every-http-status-code-explained-with-real-examples) alongside this guide.

## The 9 API Types at a Glance

| # | Group | Type | Typical use case | Style most often used |
|---|---|---|---|---|
| 1 | Open | REST API | Weather data, login, product fetch | REST over HTTP and JSON |
| 2 | Open | SOAP API | Bank transfer, insurance claim, government records | XML messages with a formal contract |
| 3 | Open | GraphQL API | Flexible data for feeds, stats, custom queries | One endpoint with a query language |
| 4 | Internal | Backend to Backend | Payment sync, token verification, stock update | REST, gRPC or messaging |
| 5 | Internal | Frontend to Backend | Login request, profile fetch, live search | REST or GraphQL |
| 6 | Internal | Service to Database | User insert, profile update, report query | Database driver or ORM (see the note below) |
| 7 | Partner | B2B Integration | Hotel booking, airline data, payment gateway | REST or SOAP, with keys and contracts |
| 8 | Partner | Affiliate Integration | Product links, commission tracking, click analytics | REST, tracked links and webhooks |
| 9 | Partner | Data Sharing API | Health records, finance data, logistics tracking | REST or SOAP, with strict access rules |

The definitions I use for the three groups are the ones API practitioners commonly use. A private API is consumed inside an organisation and is not meant for outsiders. A partner API is consumed by partners who have an established relationship and usually some form of contract. A public API is meant for anyone interested and tries to make consumption easy, as described in [Axway's explanation of private, partner and public APIs](https://blog.axway.com/api-creation/private-partner-public-apis-whats-the-difference/).

## Open APIs: REST, SOAP and GraphQL

An open API (also called a public API) is available to any developer willing to accept its terms. That does not mean it is free or unprotected. Many public APIs still require authentication through API keys, tokens or OAuth, and some limit usage by country or by plan.

### Type 1: REST API

**Use cases from the infographic:** weather data, login system, product fetch.

REST (Representational State Transfer) is an architectural style where each *resource* has its own URL and you act on it with standard HTTP methods such as GET, POST, PUT and DELETE. Roy Fielding described it in his 2000 doctoral dissertation. Its main characteristics are statelessness (every request carries what the server needs), a uniform interface and cacheable responses. That is why REST is the default for weather widgets, product catalogues and most mobile app backends.

```js
async function getWeather(city) {
  const response = await fetch(
    `https://api.example.com/v1/weather?city=${encodeURIComponent(city)}`,
    { headers: { Authorization: `Bearer ${API_KEY}` } }
  );

  // fetch only rejects on network failure, so check the status yourself
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}
```

Notice the `response.ok` check. `fetch` does not throw on a 404 or 500, which surprises almost every beginner. If you want the full list of what each status code means, my [HTTP status codes guide](/blog/every-http-status-code-explained-with-real-examples) covers it.

**Strengths:** easy to learn, widely supported, cache-friendly. **Trade-offs:** there is no strict standard, so APIs vary in quality, and a screen that needs data from several resources may need several requests.

> 🛠 **Proof of skill:** You understand REST if you can fetch a resource, handle a non-200 response and explain why the same URL with GET and DELETE does two different things.

### Type 2: SOAP API

**Use cases from the infographic:** bank transfer, insurance claim, government records.

SOAP (Simple Object Access Protocol) is an XML-based messaging protocol. Every message is wrapped in an *envelope* with an optional header and a body, and the service's contract is usually described in a WSDL file. It supports standards for security and reliable messaging, which is why it is still common in legacy enterprise, finance, healthcare and government integrations, as freeCodeCamp's guide to [SOAP, REST and GraphQL](https://www.freecodecamp.org/news/rest-vs-graphql-apis/) explains.

```js
const soapMessage = `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <GetAccountBalance xmlns="http://example.com/bank">
      <AccountId>12345</AccountId>
    </GetAccountBalance>
  </soap:Body>
</soap:Envelope>`;

const response = await fetch("https://bank.example.com/soap", {
  method: "POST", // SOAP over HTTP normally uses POST
  headers: {
    "Content-Type": "text/xml; charset=utf-8",
    SOAPAction: "http://example.com/bank/GetAccountBalance",
  },
  body: soapMessage,
});

const xml = await response.text();
const doc = new DOMParser().parseFromString(xml, "text/xml");
```

**Strengths:** a formal, machine-readable contract and built-in standards for security and transactions. **Trade-offs:** verbose messages, more setup and generally heavier than REST. For a new project you will rarely *choose* SOAP, but you may well have to *consume* it.

### Type 3: GraphQL API

**Use cases from the infographic:** Facebook feed, GitHub stats, custom queries.

GraphQL is a query language for APIs. Instead of many endpoints, the client usually sends one request to a single endpoint and describes exactly which fields it wants. It was created at Facebook and released publicly in 2015. A typical screen that needs a user and their latest posts can ask for both in one request, and the response mirrors the shape of the query.

GitHub is the clearest real-world example of the infographic's "GitHub stats" use case. Its [GraphQL API documentation](https://docs.github.com/en/graphql) describes it as offering more precise and flexible queries than its REST API. A request for a repository's star and fork counts looks like this (GitHub requires an authentication token):

```js
const query = `
  query ($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      stargazerCount
      forkCount
    }
  }
`;

const response = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query,
    variables: { owner: "facebook", name: "react" },
  }),
});

const { data } = await response.json();
console.log(data.repository.stargazerCount);
```

**Strengths:** fetch exactly what a screen needs, strongly typed schema, one request for related data. **Trade-offs:** caching is more complicated than with REST, and the server needs more care to stop expensive queries.

A small correction to the infographic: it lists a Facebook feed under GraphQL, but Facebook's public developer interface is called the **Graph API**, which models data as nodes and edges and is a different thing from the GraphQL specification. GraphQL grew out of Facebook's internal needs, and GitHub's v4 API is the better-known public example of a real GraphQL API.

> 🛠 **Proof of skill:** You understand GraphQL if you can explain why the query above needs POST, and what over-fetching means in a REST response.

## Internal APIs: Backend, Frontend and Database

Internal (private) APIs are used inside one organisation and are not meant to be exposed outside it. They are the APIs you will work with first as a developer, even if you never publish one.

### Type 4: Backend to Backend

**Use cases from the infographic:** payment sync, token verify, stock update.

Large products are rarely one program. An order service tells a payment service to charge a card, and a payment service tells an inventory service to reduce stock. These services talk through internal APIs, often REST, and in high-throughput setups often gRPC. The security model here is different from a browser: one server authenticates to another with a service token, and the calls are not exposed to the public internet.

```js
// Order service asking the payment service to confirm a payment
async function confirmPayment(orderId) {
  const response = await fetch("http://payments.internal/v1/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SERVICE_TOKEN}`,
    },
    body: JSON.stringify({ orderId }),
    signal: AbortSignal.timeout(5000), // never wait forever on another service
  });

  if (!response.ok) throw new Error(`Payment service returned ${response.status}`);
  return response.json();
}
```

The `AbortSignal.timeout(5000)` line matters more than it looks. When a service you depend on is slow, a missing timeout lets the slowness spread through your whole system.

### Type 5: Frontend to Backend

**Use cases from the infographic:** login request, profile fetch, live search.

This is the API your own website or app uses to talk to your own server, and it is the one most frontend developers meet first. The browser sends a login request, loads a profile when a page opens, or asks for search suggestions as the user types.

```jsx
import { useEffect, useState } from "react";

function useProfile(userId) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/users/${userId}`, { signal: controller.signal })
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(setProfile)
      .catch(err => {
        if (err.name !== "AbortError") console.error("Profile failed:", err);
      });

    return () => controller.abort(); // cancel when the component unmounts
  }, [userId]);

  return profile;
}
```

For live search, add a short delay (debounce) so you do not send a request on every keystroke, and cancel the previous request when a new one starts. For more on keeping fetched data in the right place inside a component, see my guide to [React state](/blog/react-state-12-things-every-developer-should-know).

### Type 6: Service to Database

**Use cases from the infographic:** user insert, profile update, report query.

I want to add some nuance here. In most applications, a service does not call its database through a web-style API. It uses a **database driver or an ORM**, which is a programming interface in the broad sense, with a query language (usually SQL) over a database connection. Some databases and cloud services do expose HTTP APIs, but that is the exception. So treat this branch as "the data access layer", the last hop before your data is stored.

```js
// Insert a user with a parameterised query (node-postgres)
const result = await pool.query(
  "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id",
  [name, email]
);
const userId = result.rows[0].id;
```

Using `$1` and `$2` placeholders instead of pasting values into the SQL string is what protects you from SQL injection. It is the single most important habit in this layer.

> 🛠 **Proof of skill:** You understand internal APIs if you can trace one user action, say "update my profile", from the browser to the backend to the database, and name what authenticates each hop.

## Partner APIs: B2B, Affiliate and Data Sharing

A partner API is shared with selected business partners, not the whole internet. Think of it as the middle ground between open and private: there is a relationship, usually a contract, and the provider decides who gets access. Because of that, partner APIs tend to come with API keys per partner, rate limits, signed requests and an onboarding process.

### Type 7: B2B Integration

**Use cases from the infographic:** hotel booking, airline data, payment gateway.

Business-to-business integration connects two companies' systems. A travel website pulls hotel availability or airline data from suppliers. An online shop sends a payment to a gateway. The values at stake (money, bookings) mean reliability features matter, such as retry-safe requests. Many payment APIs support an *idempotency key*, a unique value you send so that a retried request is not processed twice.

```js
async function createBooking(booking) {
  const response = await fetch("https://api.partner-hotels.example/v2/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.PARTNER_API_KEY,
      "Idempotency-Key": booking.requestId, // same id on every retry of this booking
    },
    body: JSON.stringify(booking),
  });

  if (!response.ok) throw new Error(`Partner returned ${response.status}`);
  return response.json();
}
```

Always keep partner keys on the **server**, never in frontend code, because anything shipped to the browser can be read by the user.

### Type 8: Affiliate Integration

**Use cases from the infographic:** product links, commission tracking, click analytics.

Affiliate programmes let a partner (a blogger, a comparison site, an influencer) promote your products and earn a commission. The API side has three jobs: give partners product links, record clicks and sales against each partner, and report the results back.

```js
// Build a tracked product link for a partner
function buildAffiliateLink(productUrl, partnerId, campaign) {
  const url = new URL(productUrl);
  url.searchParams.set("ref", partnerId);
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}

buildAffiliateLink("https://shop.example.com/product/42", "partner-81", "oct-sale");
// https://shop.example.com/product/42?ref=partner-81&utm_campaign=oct-sale
```

Commission and conversion data often arrive later through **webhooks**, which are HTTP callbacks the provider sends to your server when an event happens. Never trust a webhook blindly. Verify its signature first:

```js
import crypto from "node:crypto";

function isValidSignature(rawBody, signatureHex, secret) {
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signatureHex);
  // constant-time comparison, and lengths must match first
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
```

The exact header name and signing scheme differ by provider, so follow the partner's documentation for the details.

### Type 9: Data Sharing API

**Use cases from the infographic:** health records, finance data, logistics tracking.

Data sharing APIs let one organisation expose records to another, for example a hospital sharing a patient summary with a clinic, a bank sharing account data with an approved app, or a courier sharing shipment status with an online shop. The data is sensitive, so the focus is on **consent, scoped access and audit trails**. Instead of a single all-powerful key, modern data-sharing APIs usually use OAuth-style scopes, so a partner can be allowed to read shipment status but not customer addresses.

Because these APIs often handle personal or regulated data, check the legal requirements for your region and industry before you build one. This guide covers the engineering side, not the compliance side.

> 🛠 **Proof of skill:** You understand partner APIs if you can explain three things that differ from an open API: how a partner is onboarded, how its requests are authenticated, and how you would prove a webhook really came from the partner.

## Open API vs OpenAPI: Do Not Mix Them Up

The infographic's first branch is called "Open API", and the name collides with something else in the API world.

- An **open API** (or public API) is an API that a provider makes available to almost anyone who accepts its terms. Companies such as Stripe and Twilio run public APIs, and an open API is not automatically free.
- **OpenAPI** is a *specification*: a vendor-neutral standard for describing HTTP APIs in a machine-readable YAML or JSON document. It is maintained by the OpenAPI Initiative under the Linux Foundation. SmartBear donated the Swagger specification when the initiative launched in 2015.

The specification says nothing about whether the API it describes is public, partner-only or internal. You can write an OpenAPI document for any of the three, and many teams use one to generate documentation and client code. See the [OpenAPI explainer from API Handyman](https://apihandyman.io/what-is-the-openapi-specification/) for the full story.

## What the Infographic Leaves Out

Any one-page diagram has to stop somewhere. If you keep learning, these are the styles you will meet next, as listed in ByteByteGo's [cheatsheet on API architectural styles](https://bytebytego.com/guides/a-cheatsheet-on-comparing-api-architectural-styles):

- **gRPC:** a high-performance framework that uses HTTP/2 and Protocol Buffers, common between internal microservices.
- **WebSocket:** a long-lived two-way connection, used for chat, live scores and collaborative editing.
- **Webhook:** an HTTP callback sent when an event happens, such as a payment succeeding. You saw one in the affiliate section.

I would also mention the newer HTTP QUERY method, a proposed safe and cacheable way to send complex search requests. I cover it in [HTTP QUERY method explained](/blog/http-query-method-explained).

## Which API Type Should You Use?

Use this as a starting point, not a rulebook.

| Your situation | Good starting choice | Why |
|---|---|---|
| Building a public API for a normal web or mobile product | REST | Simple, familiar, cache-friendly and well supported |
| One screen needs data from many related resources | GraphQL | Ask for exactly the fields you need in one request |
| Integrating with a bank, insurer, government or older enterprise system | SOAP (consume it) | The other side already defines the contract |
| Services inside your own system calling each other | REST or gRPC | Fast, and not exposed to the public |
| Your frontend talking to your own backend | REST, or GraphQL if screens are data-heavy | Match the style to how your UI consumes data |
| Sharing with specific companies under a contract | Partner API (REST or SOAP) | Per-partner keys, limits and onboarding |
| Pushing events when something happens | Webhooks | The provider calls you instead of you polling |
| Live two-way updates | WebSocket | Keeps one connection open |

My own rule: **default to REST, reach for GraphQL when the UI's data needs justify it, and accept SOAP when the other side requires it.** Switching style never fixes a badly designed API.

## Common API Mistakes Beginners Make

- **Mixing up access and style.** "Is this REST or open?" is a muddled question. Ask who can use it, then how it talks.
- **Assuming `fetch` throws on HTTP errors.** It only rejects on network failure. Always check `response.ok`.
- **Putting secret keys in frontend code.** Anything in the browser is public. Call partner and paid APIs from your server.
- **Trusting webhooks without verifying them.** Check the signature before acting on the payload.
- **No timeouts between services.** One slow dependency can stall everything. Set a timeout and decide what happens on failure.
- **Building SQL strings by hand.** Use parameterised queries every time.
- **Confusing Open API with OpenAPI.** One is an access model. The other is a description format.
- **Choosing GraphQL because it sounds modern.** Pick it for a real need, such as flexible data shapes, not for fashion.

## Free Video to Go Deeper

If you prefer to watch before you read, this freeCodeCamp.org course walks through what APIs are, how the web works, how to explore APIs with tools such as Postman, and how to build a small project with Node.js and Flask:

::youtube[GZvSYJDk-us]{caption="APIs for Beginners: How to use an API (freeCodeCamp.org, taught by Craig Dennis, roughly 3 hours, February 2023). Covers what APIs are, RESTful basics, exploring APIs with Postman, and building a small project. It is an older course, so use it for the concepts and check the video description for the full contents."}

For a written comparison of the three Open API styles, freeCodeCamp also has a clear article, [Different Types of APIs: SOAP vs REST vs GraphQL](https://www.freecodecamp.org/news/rest-vs-graphql-apis/).

## Copyable API Types Checklist

Copy this into your notes or paste it into a study tracker.

**The basics**
- [ ] I can explain the difference between *who can use* an API and *how it talks*
- [ ] I can define open, internal and partner APIs in one sentence each
- [ ] I can explain why Open API and OpenAPI are different things

**Styles**
- [ ] I can fetch a REST resource and handle a non-200 response with `response.ok`
- [ ] I can send a GraphQL query with variables and explain over-fetching
- [ ] I can recognise a SOAP envelope and say why it still exists

**Internal and partner**
- [ ] I can trace one user action from the browser through the backend to the database
- [ ] I can use parameterised queries and explain why
- [ ] I know why partner keys belong on the server
- [ ] I can verify a webhook signature and explain why a retry needs an idempotency key

## Final Word: My Honest Take

The question "how many types of APIs are there?" has no single answer, because there are two ways to slice the topic. Ask **who can use it** (open, internal, partner) and **how it talks** (REST, SOAP, GraphQL and friends), and most of the confusion disappears.

For a beginner, the order I would learn them in is simple. Start with REST and `fetch`. Then build a frontend-to-backend call of your own, because that is the API you will use most. After that, try one GraphQL query against a real service, and read a SOAP example once so it never surprises you. Partner APIs make sense last, because they add contracts, keys and verification on top of everything else.

Pick one of the nine use cases today, build the smallest version of it, and you will learn more than from reading another list. And if you use an AI assistant while you learn, treat it as a tutor and not an answer key. [How I use AI every day as a developer](/blog/how-i-actually-use-ai-every-day-as-a-developer-2026) shows my workflow.

## Sources and Further Reading

Technical claims in this article were checked against the following sources in October 2026:

- [freeCodeCamp: Different Types of APIs, SOAP vs REST vs GraphQL](https://www.freecodecamp.org/news/rest-vs-graphql-apis/): characteristics, strengths and typical uses of SOAP, REST and GraphQL
- [GitHub Docs: GraphQL API](https://docs.github.com/en/graphql): GitHub's GraphQL API and how it compares with its REST API
- [Axway: Private, partner and public APIs, what's the difference?](https://blog.axway.com/api-creation/private-partner-public-apis-whats-the-difference/): the access-based definitions used in this guide
- [API Handyman: What is the OpenAPI Specification?](https://apihandyman.io/what-is-the-openapi-specification/): open API versus OpenAPI, and what the specification is for
- [Zapier: Introduction to Graph APIs](https://zapier.com/blog/graph-apis.md): Facebook's Graph API compared with GraphQL
- [ByteByteGo: A cheatsheet on comparing API architectural styles](https://bytebytego.com/guides/a-cheatsheet-on-comparing-api-architectural-styles): SOAP, REST, GraphQL, gRPC, WebSocket and webhook
- [freeCodeCamp: APIs for Beginners, full course](https://www.freecodecamp.org/news/apis-for-beginners-full-course/): course details for the embedded video

Code examples are simplified for teaching, and the URLs in them are placeholders. Always follow the documentation of the specific API you use, because header names, authentication and signing schemes differ by provider. Partner and data-sharing APIs can involve legal and compliance requirements that depend on your region and industry.

*This article is maintained and updated as the API ecosystem changes. If you spot outdated information, please use the Contact page to flag it.*

## About the Author

**Veeresh Bashetti** is a full-stack developer who builds Django and React applications and writes practical, project-tested guides for developers and students, with a focus on separating genuine industry trends from marketing hype. Read more on the [About page](https://veereshbashetti.com/about).

## More Useful Resources

- [Frontend Developer Roadmap 2026: 12 Steps, in Order](/blog/frontend-developer-roadmap-2026-learn-in-this-order)
- [HTTP Status Codes Explained with Real Code Examples (2026)](/blog/every-http-status-code-explained-with-real-examples)
- [HTTP QUERY Method Explained: Python & Node.js Examples](/blog/http-query-method-explained)
- [React State Explained: 12 Rules Every Developer Should Know (2026)](/blog/react-state-12-things-every-developer-should-know)
- [How I Use AI Every Day as a Developer: My Real Workflow](/blog/how-i-actually-use-ai-every-day-as-a-developer-2026)
- [More Tech Articles](/category/tech)