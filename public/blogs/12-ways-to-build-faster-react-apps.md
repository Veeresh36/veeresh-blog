---
title: "12 Practical Ways to Build Faster React Apps (2026 Guide)"
slug: "12-ways-to-build-faster-react-apps"
description: "12 practical React performance tips: measure first, keep state local, memo, useCallback, useMemo, code splitting, list virtualization, Server Components and the React Compiler, with code and common traps."
excerpt: "Most React performance lists say 'use memo' and stop. This guide walks through 12 practical techniques in the order you should apply them, shows the code, explains when each one backfires, and covers where React Compiler changes the advice."
author: "Veeresh Bashetti"
date: "2026-10-20"
lastModified: "2026-10-20"
category: "tech"
tag: "react"
emoji: "⚡"
gradient: "from-[#0B1020] to-[#16305A]"
readingTime: "14 min read"
meta: "14 min read · 20 October 2026 · Checked against the React docs, sources linked"
featured: false
image: "https://raw.githubusercontent.com/Veeresh36/bog_images/main/12-ways-to-build-faster-react-apps.webp"
imageAlt: "12 practical ways to build faster React apps: profiling, local state, memo, useCallback, useMemo, code splitting, list virtualization and Server Components"
authorUrl: "https://www.veereshbashetti.com/about"
canonicalUrl: "https://www.veereshbashetti.com/blog/12-ways-to-build-faster-react-apps"

tags:
  - React Performance
  - React Optimization
  - useMemo
  - useCallback
  - React Compiler
  - Frontend
  - Learn to Code
  - 2026

seo:
  title: "12 Ways to Build Faster React Apps (2026 Guide)"
  description: "12 practical React performance tips: measure first, keep state local, memo, useCallback, useMemo, code splitting, list virtualization, Server Components and React Compiler."
  focusKeyword: "how to build faster React apps"
  keywords:
    - how to build faster React apps
    - React performance optimization
    - React performance tips 2026
    - how to reduce re-renders in React
    - React.memo vs useMemo vs useCallback
    - when to use useMemo
    - when to use useCallback
    - React lazy and Suspense code splitting
    - React list virtualization
    - react-window example
    - React Server Components performance
    - React Compiler automatic memoization
    - React DevTools Profiler
    - why is my React app slow
    - React bundle size optimization
    - React key prop performance
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  canonical: "https://www.veereshbashetti.com/blog/12-ways-to-build-faster-react-apps"
  locale: "en_IN"
  inLanguage: "en-IN"
  articleSection: "Technology"
  publishedTime: "2026-10-20T00:00:00+05:30"
  modifiedTime: "2026-10-20T00:00:00+05:30"
  og:
    type: "article"
    siteName: "Veeresh Bashetti"
    title: "12 Ways to Build Faster React Apps (2026)"
    description: "12 practical React performance techniques in the order to apply them, with code, common traps and what React Compiler changes."
    image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/12-ways-to-build-faster-react-apps.webp"
    imageAlt: "12 practical ways to build faster React apps, from profiling to Server Components"
    url: "https://www.veereshbashetti.com/blog/12-ways-to-build-faster-react-apps"
  twitter:
    card: "summary_large_image"
    title: "12 Ways to Build Faster React Apps (2026)"
    description: "Measure first, keep state local, memoize carefully, split code, virtualize lists and know what React Compiler changes."
    image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/12-ways-to-build-faster-react-apps.webp"
    imageAlt: "12 practical ways to build faster React apps, from profiling to Server Components"
  schema:
    types:
      - Article
      - FAQPage
      - BreadcrumbList
    articleType: "TechArticle"
    about:
      - "React"
      - "Web performance"
    proficiencyLevel: "Intermediate"
  breadcrumbs:
    - name: "Home"
      url: "https://www.veereshbashetti.com/"
    - name: "Tech"
      url: "https://www.veereshbashetti.com/category/tech"
    - name: "12 Practical Ways to Build Faster React Apps (2026 Guide)"
      url: "https://www.veereshbashetti.com/blog/12-ways-to-build-faster-react-apps"

takeaways:
  - "Measure before you optimize. The React DevTools Profiler shows which components render and how long they take, so you fix the real bottleneck instead of guessing."
  - "The cheapest fix is structural: keep state as close as possible to where it is used, so a keystroke re-renders one small component instead of a whole page."
  - "memo, useCallback and useMemo are tools for specific cases, not defaults. React's own docs say memo only pays off when a component re-renders often with the same props and its render is expensive."
  - "Bundle size matters as much as re-renders. Lazy-load routes and heavy components, import only what you use, and check what each dependency costs."
  - "React Compiler 1.0 automates much of the manual memoization, but it does not replace profiling, code splitting, list virtualization or good component structure."

faqs:
  - q: "Why is my React app slow?"
    a: "The usual causes are components re-rendering more often than needed, expensive work running on every render, very long lists rendered all at once, and a large JavaScript bundle. Record a session in the React DevTools Profiler first. It shows which components rendered, how long they took, and in recent versions why they rendered, so you can fix the actual cause."
  - q: "When should I use React.memo?"
    a: "Use it when a component re-renders often with the same props and its rendering is expensive. React's documentation says that if there is no noticeable lag when the component re-renders, memo is unnecessary. It compares props shallowly, so new object, array or function props on every render will defeat it."
  - q: "What is the difference between useMemo and useCallback?"
    a: "useMemo caches the result of calling a function. useCallback caches the function itself and does not call it. useCallback is mainly useful when you pass a function to a child wrapped in memo, or when the function is a dependency of another hook."
  - q: "Do I still need useMemo and useCallback with React Compiler?"
    a: "Far less often. React Compiler 1.0 is a build-time tool that applies automatic memoization to components and hooks, and the React docs say it reduces the need for manual useMemo and useCallback calls. It works best when your code follows the Rules of React, and you still profile to confirm where time is spent."
  - q: "What is code splitting in React?"
    a: "Code splitting means loading parts of your app only when they are needed instead of shipping one large bundle. In React you do it with dynamic import(), React.lazy and a Suspense boundary that shows a fallback while the code loads. Splitting by route is the usual first step."
  - q: "How do I render a very long list in React without lag?"
    a: "Virtualize it. A windowing library such as react-window renders only the rows currently visible plus a small buffer, so the DOM stays small however long the list is. Also give each item a stable, unique key and keep each row component lightweight."
  - q: "Do React Server Components make an app faster?"
    a: "They can. Server Components render ahead of time, before bundling, in an environment separate from the client app, so the code that runs there does not need to be shipped to the browser. They need a framework or bundler that supports them, and interactive parts still need Client Components."
---

# 12 Practical Ways to Build Faster React Apps (2026 Guide)

**Published:** October 20, 2026 · **Last updated:** October 20, 2026 · **14 min read** · By [Veeresh Bashetti](https://www.veereshbashetti.com/about) · Sources linked below

---

> 💡 **Quick answer, if you're in a hurry:** Apply these in order. **Find the problem:** profile first. **Fix structure:** keep state local, avoid unnecessary re-renders, split large components. **Use targeted tools:** `memo`, `useCallback`, `useMemo`, only where measurement says so. **Shrink what you ship:** code splitting, lazy loading, lighter libraries, Server Components. **Keep going:** monitor real users and set performance budgets.

## Table of Contents

1. [Why React Performance Needs a Method](#why-react-performance-needs-a-method)
2. [The 12 Ways at a Glance](#the-12-ways-at-a-glance)
3. [Phase 1 Find and Fix the Cause](#phase-1-find-and-fix-the-cause)
4. [Phase 2 Memoize With Care](#phase-2-memoize-with-care)
5. [Phase 3 Ship Less JavaScript](#phase-3-ship-less-javascript)
6. [Phase 4 Keep It Fast](#phase-4-keep-it-fast)
7. [Where React Compiler Fits](#where-react-compiler-fits)
8. [What the Cheat Sheet Leaves Out](#what-the-cheat-sheet-leaves-out)
9. [Common Mistakes](#common-mistakes)
10. [Free Video to Go Deeper](#free-video-to-go-deeper)
11. [Copyable React Performance Checklist](#copyable-react-performance-checklist)
12. [Final Word My Honest Take](#final-word-my-honest-take)
13. [Sources and Further Reading](#sources-and-further-reading)
14. [More Useful Resources](#more-useful-resources)

---

## Why React Performance Needs a Method

"Make React faster" sounds like one problem. It is really three: **too much rendering work**, **too much code to download**, and **not knowing which of the two you actually have**. Most one-line tips, such as "wrap everything in `memo`", only touch the first and often make things worse by adding complexity for no gain.

This guide follows the structure of a popular infographic called "12 Practical Ways to Build Faster React Apps". I could not find a creator credit on it, so I cannot name one. It orders the ideas sensibly: measure, then fix structure, then optimize, then ship less. The explanations, code, caveats and corrections below are my own, checked against the official React documentation, web.dev and the React team's blog posts. Where I add nuance or disagree with the infographic, I say so.

A note on scope: the code patterns here follow the React documentation, but I did not run benchmarks for this article, so I give no "X% faster" numbers. Your app is different from any demo, which is exactly why step 1 is to measure it.

If you are still choosing what to learn, my [frontend developer roadmap for 2026](/blog/frontend-developer-roadmap-2026-learn-in-this-order) shows where performance fits. If your React app talks to a backend, [types of APIs and their use cases](/blog/types-of-apis-and-their-use-cases-explained) is worth a read, because a slow API can look like a slow component.

## The 12 Ways at a Glance

| # | Technique | What it does | The trap to remember |
|---|---|---|---|
| 1 | Measure before you optimize | Finds the real bottleneck | Profile realistic data, not an empty page |
| 2 | Keep state local | Limits how much re-renders | Do not lift state higher than needed |
| 3 | Avoid unnecessary re-renders | Skips work that changes nothing | Keys help lists, they do not stop re-renders |
| 4 | Use `React.memo` | Skips a component when props are equal | New object or function props defeat it |
| 5 | Use `useCallback` | Keeps a function reference stable | Pointless unless something depends on that identity |
| 6 | Use `useMemo` | Caches an expensive result | Memoizing cheap work costs more than it saves |
| 7 | Split large components | Smaller, focused render units | Splitting alone does not stop re-renders |
| 8 | Code splitting and lazy loading | Loads code on demand | Needs a Suspense boundary and a default export |
| 9 | Optimize lists | Renders only what is needed | Never use random keys |
| 10 | Avoid heavy libraries | Smaller bundle | Check the cost before you install |
| 11 | Server Components | Less client JavaScript | Needs framework support |
| 12 | Keep improving | Catches regressions | Lab scores are not real-user scores |

## Phase 1 Find and Fix the Cause

### 1. Measure Before You Optimize

**Use it for:** finding out what is actually slow.

Open React DevTools, go to the **Profiler** tab, press record, perform the slow interaction, then stop. The React team introduced the Profiler in React 16.5 to collect timing information about each component that renders, and the DevTools view groups that data by commit. In its flame chart, components that took more time are shown in yellow, faster ones in blue, and components that did not render in that commit in gray.

For measurements you want to log or send to analytics, React also provides a `<Profiler>` component:

```jsx
import { Profiler } from "react";

function onRender(id, phase, actualDuration) {
  console.log(`${id} (${phase}): ${actualDuration.toFixed(1)}ms`);
}

export default function Page() {
  return (
    <Profiler id="ProductList" onRender={onRender}>
      <ProductList />
    </Profiler>
  );
}
```

Two habits make profiling honest. First, use realistic data volumes, because a list of five items hides problems a list of five thousand reveals. Second, remember the default development build is slower than production, so treat absolute numbers cautiously and look at **relative** differences between components and before-and-after runs.

> 💡 **Tip:** If you cannot name the slowest component and the interaction that triggers it, you are not ready to optimize yet. Write that sentence down first.

### 2. Keep State Local

**Use it for:** shrinking the part of the tree that re-renders.

React re-renders a component when its state changes, and by default that includes everything inside it. So the position of your state decides how much work an update causes. Put state high in the tree and every keystroke can re-render a large subtree.

```jsx
// Slower structure: typing re-renders the whole page, including HeavyChart
function Page() {
  const [query, setQuery] = useState("");
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <HeavyChart />
    </>
  );
}

// Better: state lives in the only component that needs it
function SearchBox() {
  const [query, setQuery] = useState("");
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}

function Page() {
  return (
    <>
      <SearchBox />
      <HeavyChart />
    </>
  );
}
```

This costs nothing, adds no hooks and makes no promises about cache invalidation, which is why I try it before any memoization. The infographic's diagram shows the same idea: state close to where it is used.

### 3. Avoid Unnecessary Re-renders

**Use it for:** not doing work whose result cannot change.

The React docs describe the default plainly: a component re-renders when its parent re-renders, even if its props are the same. That is usually fine, because rendering is cheap. It becomes a problem only when the skipped work is expensive or very frequent.

Besides moving state down (step 2), a second structural trick is to pass components as `children`. When the parent holding the state does not itself re-render, the child elements it received keep the same identity, so React skips them:

```jsx
function ColorWrapper({ children }) {
  const [color, setColor] = useState("red");
  return (
    <div style={{ color }}>
      <button onClick={() => setColor("blue")}>Change color</button>
      {children}   {/* created by the parent, so not re-created here */}
    </div>
  );
}

function App() {
  return (
    <ColorWrapper>
      <ExpensiveTree />
    </ColorWrapper>
  );
}
```

> ⚠️ **Heads up:** The infographic lists "stable props, keys and memoization" together under this step. Keys are about identifying list items between renders, which matters for correctness and efficient updates (see step 9). They do not stop a component from re-rendering. Stable props only help when the receiving component is wrapped in `memo`, which is step 4.

## Phase 2 Memoize With Care

### 4. Use React.memo (When It Helps)

**Use it for:** skipping a re-render when props have not changed.

```jsx
import { memo } from "react";

const ProductCard = memo(function ProductCard({ product, onSelect }) {
  // expensive rendering here
  return <button onClick={() => onSelect(product.id)}>{product.name}</button>;
});
```

`memo` compares the previous and next props shallowly. The React documentation is direct about when this is worth it: optimizing with `memo` is only valuable when a component re-renders often with the exact same props and its re-rendering logic is expensive. If you see no perceptible lag, it is unnecessary.

The trap is props that are new on every render. An object literal, an array literal, a function defined inline, or JSX passed as `children` creates a new reference each time, so the shallow comparison fails and `memo` does nothing. That is why `memo` is so often paired with `useCallback` and `useMemo`.

### 5. Use useCallback for Stable Functions

**Use it for:** keeping a function's identity the same between renders.

```jsx
import { useCallback, memo } from "react";

const ProductCard = memo(function ProductCard({ product, onSelect }) { /* ... */ });

function ProductList({ products }) {
  const handleSelect = useCallback((id) => {
    console.log("selected", id);
  }, []); // add values it reads from the component to this array

  return products.map((p) => (
    <ProductCard key={p.id} product={p} onSelect={handleSelect} />
  ));
}
```

The docs state the difference with `useMemo` clearly: `useMemo` caches the result of calling your function, while `useCallback` caches the function itself and does not call it.

Without `memo` on the child, wrapping the handler in `useCallback` buys you nothing, because the child re-renders with its parent anyway. The infographic's advice to "keep function references stable when passing to child components" is correct only for children that actually compare their props.

> ⚠️ **Heads up:** The infographic also says to "avoid inline functions in render" for lists. For plain DOM elements like `<button onClick={() => ...}>`, an inline function is fine and often clearer. It only matters when the function is passed to a memoized child or used as a hook dependency.

### 6. Use useMemo for Expensive Calculations

**Use it for:** caching a slow computation between renders.

```jsx
import { useMemo } from "react";

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(
    () => filterTodos(todos, tab),
    [todos, tab]
  );
  // ...
}
```

How do you know a calculation is expensive? The React docs suggest measuring it with `console.time` and `console.timeEnd`. They note that unless you are creating or looping over thousands of objects, it is probably not expensive, and they give about 1 ms of total logged time as a point where memoizing might make sense. They also point out that `useMemo` will not make the first render faster, because it only helps on later ones.

```jsx
console.time("filter array");
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
console.timeEnd("filter array");
```

> 💡 **Tip:** The infographic's "memoize expensive computations, not everything" is exactly right. Every `useMemo` adds a dependency array to maintain and a cache to hold. Add it where a measurement justifies it.

### 7. Split Large Components

**Use it for:** making components small enough to reason about and to skip.

A 400-line component that mixes a form, a table and a chart re-renders all three whenever any piece of its state changes. Splitting it gives each part its own state and its own render boundary.

```jsx
// Before: one component, one big re-render
function Dashboard() { /* form state + table state + chart state */ }

// After: each piece owns its state
function Dashboard() {
  return (
    <>
      <FilterForm />
      <OrdersTable />
      <RevenueChart />
    </>
  );
}
```

Be honest about what this does. Splitting by itself does not stop a parent's re-render from reaching its children. It becomes a performance win when combined with step 2 (state moves into the small component) or step 4 (the pieces are memoized). It is also a readability win, which is a good enough reason on its own.

## Phase 3 Ship Less JavaScript

### 8. Use Code Splitting and Lazy Loading

**Use it for:** loading code only when the user needs it.

`React.lazy` loads a component with a dynamic `import()`, and `Suspense` shows a fallback while it loads. web.dev describes this as a way to code-split at the component level.

```jsx
import { lazy, Suspense } from "react";

const SettingsPage = lazy(() => import("./SettingsPage"));

function App() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <SettingsPage />
    </Suspense>
  );
}
```

Where should you split first? The older React documentation recommends route-based splitting as a sensible starting point, since users expect a pause when navigating. Also note a limitation from the same docs: `React.lazy` supports default exports, so a component exported only by name needs a small re-export wrapper.

> ⚠️ **Heads up:** Do not lazy-load things the user sees immediately, such as your above-the-fold content. A loading spinner there makes the page feel slower, not faster.

### 9. Optimize Lists

**Use it for:** rendering long lists without freezing the page.

Three rules cover most cases.

**Use stable, unique keys.** A key identifies an item among its siblings across renders. Use an ID from your data. Do not generate keys during render, and never use `Math.random()`, which gives every item a new key on every render so React destroys and re-creates them.

```jsx
// Good
{items.map((item) => <Row key={item.id} item={item} />)}

// Bad: every item remounts on every render
{items.map((item) => <Row key={Math.random()} item={item} />)}
```

**Virtualize long lists.** For hundreds or thousands of rows, render only what is visible. web.dev's walkthrough uses `react-window`, which keeps a small moving "window" of rows in the DOM:

```jsx
import { FixedSizeList } from "react-window";

const Row = ({ index, style }) => (
  <div style={style}>{items[index].name}</div>
);

<FixedSizeList height={400} width="100%" itemCount={items.length} itemSize={40}>
  {Row}
</FixedSizeList>
```

That example follows the web.dev article's API. Library APIs change between major versions, so check the documentation for the version you install.

**Keep row components light.** Memoize the row component (step 4) if the list re-renders often, and avoid heavy work inside each row.

### 10. Avoid Heavy Third-Party Libraries

**Use it for:** keeping your bundle small.

Every dependency you add ships to the user. Three habits help:

- **Choose lightweight alternatives** when a small library or a few lines of your own code do the job.
- **Import only what you use.** `import debounce from "lodash/debounce"` pulls one function. `import _ from "lodash"` can pull far more, depending on your bundler's tree-shaking.
- **Check bundle size.** Run a bundle analyzer after the build, such as `rollup-plugin-visualizer` for Vite or `@next/bundle-analyzer` for Next.js, and look at the biggest boxes.

I am deliberately not quoting a magic "keep your bundle under X KB" number. The right budget depends on your audience and network conditions, which is what step 12 is for.

### 11. Leverage Server Components (React 19+)

**Use it for:** moving work to the server and sending less JavaScript to the client.

The React documentation describes Server Components as a type of component that renders ahead of time, before bundling, in an environment separate from your client app or SSR server. They can run once at build time or per request on a web server. The React team first introduced the "zero-bundle-size" idea in a December 2020 research post, and the documentation now says Server Components in React 19 are stable.

```jsx
// A Server Component in a framework that supports them (for example, Next.js App Router)
export default async function ProductsPage() {
  const products = await getProducts();   // runs on the server
  return <ProductList products={products} />;
}
```

Two cautions. First, you generally get Server Components through a framework or bundler that supports them, not by adding a line to a plain client-side app. The docs also warn that the underlying APIs for building such a bundler or framework do not follow semver between minor releases, so pin versions if you build that layer yourself. Second, anything interactive, such as state, effects and event handlers, still belongs in Client Components. The win comes from keeping heavy, non-interactive work off the client.

## Phase 4 Keep It Fast

### 12. Keep Improving

**Use it for:** making sure today's fix is still there next month.

Performance regresses quietly, one dependency and one feature at a time. Three practices keep it honest:

- **Monitor in production.** Lab tools help you debug, but real users on real devices decide whether the app feels fast.
- **Track real-user metrics.** Google's Core Web Vitals are Largest Contentful Paint (LCP), Interaction to Next Paint (INP) and Cumulative Layout Shift (CLS), which cover loading, responsiveness and visual stability. The widely published "good" targets are LCP at or under 2.5 seconds, INP at or under 200 milliseconds and CLS at or under 0.1, measured at the 75th percentile of real users.
- **Set performance budgets.** Pick limits for bundle size or key metrics and fail the build when they are exceeded.

```js
import { onINP, onLCP, onCLS } from "web-vitals";

onINP(console.log);   // replace console.log with a call to your analytics endpoint
onLCP(console.log);
onCLS(console.log);
```

INP is the metric most directly connected to React re-render problems, because it measures how quickly the page responds after interactions like clicks and typing.

## Where React Compiler Fits

Steps 4, 5 and 6 are manual memoization, and that is the part React Compiler automates. The React team describes React Compiler 1.0 as a build-time tool that optimizes components and hooks through automatic memoization, works with both React and React Native, and does not require rewrites. If you are not on React 19 yet, it can still be used by setting a minimum target and adding a small runtime package.

The React docs for `useMemo` and `useCallback` now carry a note that the compiler reduces the need for manual calls. In practice that changes the advice like this:

| Situation | What I would do |
|---|---|
| New project | Enable the compiler early and write straightforward code, then profile |
| Existing project with lots of manual `useMemo` and `useCallback` | Do not rip them out in one go. The compiler docs recommend adopting it incrementally and warn that changing memoization can alter behavior if code depended on it |
| A slow interaction after enabling it | Profile it. The compiler cannot fix a huge list, an oversized bundle or state in the wrong place |

The compiler also depends on your code following the Rules of React, and it skips components it cannot safely optimize. So steps 1, 2, 7, 8, 9, 10 and 11 stay as relevant as ever.

## What the Cheat Sheet Leaves Out

Twelve tips are a strong start, and no infographic fits everything. These are the gaps I would fill next.

| Topic | Why it matters |
|---|---|
| `useTransition` and `useDeferredValue` | Keep typing responsive while a slow update renders in the background |
| Context re-renders | A changing context value re-renders every consumer, so split contexts by how often they change |
| Image and font optimization | Often the biggest LCP win, and unrelated to React itself |
| Network and data fetching | Waterfalls and over-fetching can dwarf render time |
| Production vs development builds | Always measure a production build for real numbers |
| Web Workers for heavy computation | Moves CPU-heavy work off the main thread |

> ℹ️ **Note:** React Native apps share the rendering ideas in steps 1 to 7 and 9, but code splitting and bundle analysis work differently there. Check the React Native documentation for those.

## Common Mistakes

- **Optimizing before measuring.** Profile first, then fix the top offender.
- **Wrapping everything in `memo`, `useMemo` and `useCallback`.** Each one adds comparison and bookkeeping cost, and React's own docs say to use them where there is a real benefit.
- **Passing new objects, arrays or functions to memoized children.** The shallow comparison fails and the memoization is wasted.
- **Using `Math.random()` or an unstable value as a list key.** It forces remounting on every render.
- **Lazy-loading above-the-fold content.** The user sees a spinner instead of the page.
- **Keeping state too high in the tree.** Move it down before reaching for memoization.
- **Judging speed on a fast dev machine.** Test on a slower device and a throttled network.
- **Treating the compiler as a magic fix.** It automates memoization, not architecture.

## Free Video to Go Deeper

Watch for the concepts, and always check the publication date, because React tooling moves quickly.

::youtube[T-rHmWSZajc]{caption="A React Compiler walkthrough, linked by the Web Performance Calendar article on the compiler as the video version of that piece. It covers why manual memo, useMemo and useCallback became hard to maintain and what the compiler does about it. Recorded when the compiler was in beta, before the 1.0 release, so check the official 1.0 announcement for current setup details."}

- [React Compiler v1.0 (React blog)](https://react.dev/blog/2025/10/07/react-compiler-1): the official announcement, install steps and incremental adoption advice.
- [Virtualize large lists with react-window (web.dev)](https://web.dev/articles/virtualize-long-lists-react-window): a written walkthrough with fixed and variable size lists.
- [Code splitting with React.lazy and Suspense (web.dev)](https://web.dev/articles/code-splitting-suspense): a short, practical guide to step 8.

Want a gentler start? My [frontend developer roadmap](/blog/frontend-developer-roadmap-2026-learn-in-this-order) lists what to learn before performance work.

## Copyable React Performance Checklist

Copy this into your notes or paste it into a PR template.

**Find**
- [ ] I recorded the slow interaction in the React DevTools Profiler
- [ ] I can name the slowest component and what triggers it
- [ ] I tested with realistic data and a production build

**Fix structure**
- [ ] State lives as close as possible to where it is used
- [ ] Large components are split into focused pieces
- [ ] Heavy children are passed as `children` where it helps

**Memoize with evidence**
- [ ] I added `memo` only to components that re-render often with equal props
- [ ] I used `useCallback` only for functions passed to memoized children or hook dependencies
- [ ] I measured a calculation before wrapping it in `useMemo`

**Ship less**
- [ ] Routes and heavy components are lazy-loaded with a Suspense fallback
- [ ] Long lists are virtualized and use stable keys
- [ ] I checked the bundle with an analyzer and trimmed heavy imports

**Keep it fast**
- [ ] I track LCP, INP and CLS from real users
- [ ] I have a performance budget that fails the build when exceeded

## Final Word My Honest Take

If I had to compress this guide into one idea, it would be this: **performance work is a loop of measure, change one thing, measure again.** The twelve techniques are the "change one thing" options, and the order matters. Structure first, because it is free. Memoization second, because it is targeted. Bundle size third, because it affects everyone on first load. Monitoring last and forever, because apps drift.

The tip I would underline is the first one. Most of the slowness I have seen in React apps comes from one or two components, or one oversized dependency, and the Profiler finds them in minutes. Everything else in this article is a tool you pick up once you know what you are fixing.

Pick one slow screen in your own app today, record it in the Profiler, and write down the top three components by render time before you change a line of code.

<!-- AUTHOR NOTE: add one or two sentences about a real performance problem you fixed in a Django + React or React Native project. First-hand experience is the strongest E-E-A-T signal and I have not invented any for you. -->

## Sources and Further Reading

Technical claims in this article were checked against the following sources in October 2026. I did not run benchmarks, so the article contains no speed-up percentages.

- [React docs: memo](https://react.dev/reference/react/memo): when memo is worth using, shallow prop comparison, and the note that React re-renders children when a parent re-renders
- [React docs: useCallback](https://react.dev/reference/react/useCallback): what useCallback caches, how it differs from useMemo, and the React Compiler note
- [React docs: useMemo](https://react.dev/reference/react/useMemo): measuring a calculation with console.time, the roughly 1 ms guideline, and that useMemo does not speed up the first render
- [React docs: Render and Commit](https://react.dev/learn/render-and-commit): what triggers a re-render
- [React docs: Server Components](https://react.dev/reference/rsc/server-components): rendering ahead of time before bundling, build-time versus per-request, stability in React 19 and the bundler API caveat
- [React blog: React Compiler v1.0](https://react.dev/blog/2025/10/07/react-compiler-1): automatic memoization at build time, React and React Native support, adoption guidance
- [React blog: Introducing Zero-Bundle-Size React Server Components (2020)](https://react.dev/blog/2020/12/21/data-fetching-with-react-server-components): the original research announcement
- [React blog: Introducing the React Profiler (2018)](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html): what the DevTools Profiler collects and how commits and colors are shown
- [Legacy React docs: Code-Splitting](https://legacy.reactjs.org/docs/code-splitting.html): dynamic import, React.lazy, route-based splitting, default export limitation
- [web.dev: Code splitting with React.lazy and Suspense](https://web.dev/articles/code-splitting-suspense): component-level code splitting and Suspense fallbacks
- [web.dev: Virtualize large lists with react-window](https://web.dev/articles/virtualize-long-lists-react-window): list virtualization with FixedSizeList
- [web.dev: How the Core Web Vitals metrics thresholds were defined](https://web.dev/articles/defining-core-web-vitals-thresholds): the three Core Web Vitals metrics and how "good", "needs improvement" and "poor" are defined
- [CodePath: Rendering Lists](https://guides.codepath.com/webdev/Rendering-Lists): key rules, including unique among siblings and not generated during render
- [Web Performance Calendar: React Compiler article](https://calendar.perfplanet.com/?p=2850): source of the linked YouTube video

React and its tooling change quickly, so confirm details against the documentation for the version you use before applying them to production code. Examples are simplified for teaching.

*This article is maintained and updated as tools change. If you spot outdated information, please use the Contact page to flag it.*

## About the Author

**Veeresh Bashetti** is a full-stack developer who builds Django and React applications and writes practical, project-tested guides for developers and students, with a focus on separating genuine industry trends from marketing hype. Read more on the [About page](https://www.veereshbashetti.com/about).

## More Useful Resources

- [Frontend Developer Roadmap 2026: 12 Steps, in Order](/blog/frontend-developer-roadmap-2026-learn-in-this-order)
- [Types of APIs and Their Use Cases (2026 Guide)](/blog/types-of-apis-and-their-use-cases-explained)
- [Best Programming Languages to Learn for Different Careers (2026 Guide)](/blog/best-programming-languages-to-learn-for-different-careers)
- [15 SQL Queries Every Developer Should Know (2026 Guide)](/blog/15-sql-queries-every-developer-should-know)
- [5 Common Django Mistakes Beginners Make (and Fixes)](/blog/5-django-mistakes-i-made-as-a-beginner)
- [More Tech Articles](/category/tech)