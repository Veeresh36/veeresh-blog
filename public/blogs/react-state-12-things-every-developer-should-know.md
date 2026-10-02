---
title: "12 Things Every React Developer Should Know About State (2026 Guide)"
slug: "react-state-12-things-every-developer-should-know"
description: "React state explained in 12 rules: keep it local, derive instead of store, treat it as immutable, and know when to use useReducer, Context or a global store."
excerpt: "Most React bugs are state bugs. These 12 rules cover where state should live, how updates really work, how to structure it, and when Context, reducers, server-state tools or a global store are the right call, with code, free videos and a checklist."
author: "Veeresh Bashetti"
date: "2026-10-01"
lastModified: "2026-10-01"
category: "tech"
tag: "react"
emoji: "⚛️"
gradient: "from-[#0B1220] to-[#16264A]"
readingTime: "13 min read"
meta: "13 min read · 1 October 2026 · Checked against react.dev, sources linked"
featured: true
image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/react-state-12-things-every-react-developer-should-know.webp"
imageAlt: "12 things every React developer should know about state: local state, derived values, immutability, reducers, Context and global stores"
authorUrl: "https://veereshbashetti.com/about"
canonicalUrl: "https://www.veereshbashetti.com/blog/react-state-12-things-every-developer-should-know"

tags:
  - React
  - React State
  - useState
  - useReducer
  - Context API
  - State Management
  - React Hooks
  - JavaScript
  - Frontend Developer
  - TanStack Query
  - Zustand
  - Redux Toolkit
  - Web Development
  - Students
  - 2026

seo:
  title: "12 Things Every React Developer Should Know About State"
  description: "React state explained in 12 rules: keep it local, derive instead of store, treat it as immutable, and know when to use useReducer, Context or a global store."
  focusKeyword: "react state management"
  keywords:
    - react state management
    - react state explained
    - react state best practices
    - react state management 2026
    - react useState best practices
    - react derived state
    - react state vs props
    - react state immutability
    - react state updates are asynchronous
    - why setState is not updating immediately
    - react context vs redux
    - is context api a state management solution
    - react useReducer when to use
    - react server state vs client state
    - react global state management
    - react lift state up
    - react avoid duplicated state
    - react useEffect sync state mistake
    - react state mistakes beginners
    - react state checklist
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
  canonical: "https://www.veereshbashetti.com/blog/react-state-12-things-every-developer-should-know"
  locale: "en_IN"
  inLanguage: "en-IN"
  articleSection: "Technology"
  publishedTime: "2026-10-01T00:00:00+05:30"
  modifiedTime: "2026-10-01T00:00:00+05:30"
  og:
    type: "article"
    siteName: "Veeresh Bashetti"
    title: "12 Things Every React Developer Should Know About State"
    description: "Own it. Derive it. Share it intentionally. 12 rules for React state with code examples, a tool-choice table, free videos and a checklist."
    image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/react-state-12-things-every-react-developer-should-know.webp"
    imageAlt: "12 things every React developer should know about state: local state, derived values, immutability, reducers, Context and global stores"
    url: "https://www.veereshbashetti.com/blog/react-state-12-things-every-developer-should-know"
  twitter:
    card: "summary_large_image"
    title: "12 Things Every React Developer Should Know About State"
    description: "Own it. Derive it. Share it intentionally. 12 React state rules with code, a tool-choice table and free videos."
    image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/react-state-12-things-every-react-developer-should-know.webp"
    imageAlt: "12 things every React developer should know about state: local state, derived values, immutability, reducers, Context and global stores"
  schema:
    types:
      - Article
      - FAQPage
      - BreadcrumbList
    articleType: "TechArticle"
    about:
      - "React state management"
      - "React hooks"
    proficiencyLevel: "Beginner"
  breadcrumbs:
    - name: "Home"
      url: "https://www.veereshbashetti.com/"
    - name: "Tech"
      url: "https://www.veereshbashetti.com/category/tech"
    - name: "12 Things Every React Developer Should Know About State"
      url: "https://www.veereshbashetti.com/blog/react-state-12-things-every-developer-should-know"

takeaways:
  - "Own it, derive it, share it intentionally. Keep state as local as possible, never store what you can calculate during render, and give every piece of state exactly one owner."
  - "State updates are scheduled, not instant. Inside an event handler, the state variable is a snapshot of the current render, so use the updater form (setCount(c => c + 1)) when the next value depends on the previous one."
  - "Treat state as immutable. Create new objects and arrays instead of mutating existing ones, otherwise React can miss the change and your UI goes stale."
  - "Context is a way to deliver values deep into the tree, not a full state management solution. Pair it with useReducer if you need logic, and separate UI state from server state, which tools like TanStack Query handle better."
  - "Reach for a global store such as Redux Toolkit, Zustand or Jotai only when many distant components genuinely share complex state. Most apps need less global state than they think."

faqs:
  - q: "What is state in React?"
    a: "State is data a component remembers between renders. When it changes, React re-renders the component so the screen matches the new data. You create it with the useState or useReducer hooks, and it is private to the component that owns it unless you pass it down as props."
  - q: "What is the difference between state and props in React?"
    a: "State is owned and changed by the component that declares it. Props are values passed down from a parent and are read-only for the child. A parent's state often becomes a child's props, which is how data flows down the component tree."
  - q: "Why is my React state not updating immediately after setState?"
    a: "Because a state variable is a snapshot of the render that is currently running. Calling the setter schedules a new render with the new value. It does not change the variable in your current function, so logging it right after the call prints the old value. Use the updater form or compute the next value in a local variable if you need it straight away."
  - q: "When should I use useReducer instead of useState?"
    a: "Use useReducer when several state updates depend on each other or when the next state depends on the previous state in non-trivial ways, such as a cart, a multi-step form or a game. It moves the update logic into one pure function, which is easier to read, test and debug than many scattered setState calls."
  - q: "Is the Context API a replacement for Redux?"
    a: "Not exactly. Context only delivers a value to components deep in the tree, so you avoid passing props through every level. It does not manage updates, caching or devtools on its own. For small to medium apps, Context plus useReducer is often enough. For large apps with complex, widely shared state, a dedicated store such as Redux Toolkit or Zustand is usually a better fit."
  - q: "Do I still need Redux in 2026?"
    a: "Often not. Many apps do well with local state, Context for a few shared values, and a server-state library like TanStack Query for API data. Redux Toolkit remains a solid choice for large teams and complex client state, but it is no longer the default answer for every React app."
  - q: "What is derived state in React and why avoid storing it?"
    a: "Derived state is any value you can calculate from existing props or state, such as a full name from first and last name, or a total from a list of items. Storing it in its own state variable creates two sources of truth that can drift apart. Calculate it during render instead."
---

# 12 Things Every React Developer Should Know About State

**Published:** October 1, 2026 · **Last updated:** October 1, 2026 · **13 min read** · By [Veeresh Bashetti](https://veereshbashetti.com/about) · Sources linked below

---

> 💡 **Quick answer, if you're in a hurry:** React state management comes down to three habits: **own it, derive it, share it intentionally.** Keep state as local as possible, never store a value you can calculate during render, give each piece of state one owner, update it immutably, and only move to Context, reducers, server-state tools or a global store when the simpler option stops working. The 12 rules below explain each habit with code.

## Table of Contents

1. [Why React State Trips Up Even Experienced Developers](#why-react-state-trips-up-even-experienced-developers)
2. [The 12 Rules of React State at a Glance](#the-12-rules-of-react-state-at-a-glance)
3. [Phase 1 Where State Lives Rules 1 to 3](#phase-1-where-state-lives-rules-1-to-3)
4. [Phase 2 How State Behaves Rules 4 to 6](#phase-2-how-state-behaves-rules-4-to-6)
5. [Phase 3 Structuring and Sharing State Rules 7 to 9](#phase-3-structuring-and-sharing-state-rules-7-to-9)
6. [Phase 4 Complex Logic and Global State Rules 10 to 12](#phase-4-complex-logic-and-global-state-rules-10-to-12)
7. [Which Tool for Which Kind of State](#which-tool-for-which-kind-of-state)
8. [Common React State Mistakes](#common-react-state-mistakes)
9. [Free Videos to Go Deeper](#free-videos-to-go-deeper)
10. [Copyable React State Checklist](#copyable-react-state-checklist)
11. [Final Word My Honest Take](#final-word-my-honest-take)
12. [Sources and Further Reading](#sources-and-further-reading)
13. [More Useful Resources](#more-useful-resources)

---

## Why React State Trips Up Even Experienced Developers

Most React bugs are not really React bugs. They are state bugs: a value that is out of date, two copies of the same data that disagree, an effect that fires in a loop, or a global store that grew until nobody understood it.

The fix is rarely a new library. It is a few habits about where state lives, how it changes, and who is allowed to own it. This guide turns those habits into 12 rules you can apply to any React project, from a first to-do app to a production dashboard.

The 12-rule structure follows a popular React state infographic, which I liked because it states each idea as a short, memorable rule. The explanations, code, corrections and resources here are my own writing, and I checked the technical claims against the official [react.dev](https://react.dev) documentation. Where I add nuance or disagree with a simplification, I say so.

If you are still building your fundamentals, start with my [frontend developer roadmap for 2026](/blog/frontend-developer-roadmap-2026-learn-in-this-order). State makes the most sense after you are comfortable with JavaScript and the DOM (Steps 3 and 4 there) and are ready for React (Step 7).

## The 12 Rules of React State at a Glance

| # | Rule | One-line version |
|---|---|---|
| 1 | Keep state as local as possible | Lift it up only when several components need it |
| 2 | Don't store what you can calculate | Derive values during render |
| 3 | State has an owner | One clear source of truth per piece of state |
| 4 | Understand state vs props | State is internal, props flow down |
| 5 | State updates are scheduled | The variable is a snapshot, not a live value |
| 6 | Treat state as immutable | Create new objects and arrays |
| 7 | Avoid duplicated state | Two copies will eventually disagree |
| 8 | Context isn't a state manager | It delivers values, it doesn't manage them |
| 9 | Separate UI state from server state | Different problems, different tools |
| 10 | Use reducers for complex transitions | One pure function for related updates |
| 11 | Don't use Effects to sync state | Derive during render instead |
| 12 | Choose global state intentionally | Only when many components truly share it |

## Phase 1 Where State Lives Rules 1 to 3

### Rule 1: Keep state as local as possible

Put state in the component that uses it. If only a dropdown cares whether it is open, `isOpen` belongs inside the dropdown, not in the page and certainly not in a global store.

When two sibling components need the same value, move it up to their closest common parent and pass it down as props. React's docs call this "lifting state up". Move it only as far as you need to and no further.

```jsx
function Parent() {
  const [selected, setSelected] = useState(null);
  return (
    <>
      <List selected={selected} onSelect={setSelected} />
      <Details selected={selected} />
    </>
  );
}
```

Local state is faster to reason about, easier to delete and cheaper to render, because fewer components are affected when it changes.

### Rule 2: Don't store what you can calculate

This is the single most common beginner mistake. If a value can be worked out from existing props or state, it should not have its own state variable.

```jsx
// Avoid: redundant state that can drift out of sync
const [firstName, setFirstName] = useState("Taylor");
const [lastName, setLastName] = useState("Swift");
const [fullName, setFullName] = useState("Taylor Swift");

// Good: calculated during render
const [firstName, setFirstName] = useState("Taylor");
const [lastName, setLastName] = useState("Swift");
const fullName = `${firstName} ${lastName}`;
```

The React documentation states the rule plainly: when something can be calculated from the existing props or state, don't put it in state, calculate it during rendering. That makes the code faster, simpler and less error-prone.

The same applies to filtered lists, totals, counts and sorted arrays. Compute them in the component body. If a calculation is genuinely expensive, wrap it in `useMemo`, but measure first, because the React Compiler can handle much of this memoization automatically.

> ⚠️ **Heads up:** If you ever write an Effect whose only job is to call `setSomething` based on other state, you almost certainly have redundant state. Rule 11 covers this.

### Rule 3: State has an owner

Every piece of state needs exactly one component that owns it, meaning the only place that can change it. Everything else reads it through props or context and asks the owner to change it by calling a function.

When two components each keep their own copy of the same data, you have no single source of truth, and you will spend your evenings hunting for which one is stale. A useful question to ask for each piece of state is: who is the owner, and who merely reads it?

A form input is a good example. A "controlled" input has its value owned by React state. An "uncontrolled" input has its value owned by the DOM. Mixing the two for the same field is a classic source of confusing bugs.

## Phase 2 How State Behaves Rules 4 to 6

### Rule 4: Understand state vs props

State and props both hold data, but they play different roles.

| | State | Props |
|---|---|---|
| Owned by | The component itself | The parent component |
| Can the component change it? | Yes, via the setter | No, read-only |
| Typical use | Things that change over time | Configuration and data passed down |

State is internal to a component. Props pass data downward. A parent's state frequently becomes a child's props, which is the "data flows down" model that makes React apps predictable. If a child needs to change the parent's data, the parent passes down a function (like `onSelect` in Rule 1) and the child calls it.

### Rule 5: State updates are scheduled

This is the rule that confuses almost everyone once.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    console.log(count); // still the OLD value, not count + 1
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

The infographic describes updates as asynchronous, which is a handy shorthand, but the precise idea is slightly different. A state variable is a snapshot of the render that is currently running. Calling `setCount` does not change that variable. It asks React to schedule a new render in which `count` has the new value. React also batches several updates inside one event handler into a single re-render.

That snapshot behaviour has a famous consequence:

```jsx
function handleClick() {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
  // count goes from 0 to 1, not to 3
}
```

All three calls use the same snapshot value of `count`, so they all say "set it to 1". When the next value depends on the previous one, pass an updater function:

```jsx
function handleClick() {
  setCount(c => c + 1);
  setCount(c => c + 1);
  setCount(c => c + 1);
  // count goes from 0 to 3
}
```

> 🛠 **Proof of skill:** You understand this rule if you can predict, without running the code, what the two snippets above display after one click, and explain why.

Because every state change triggers a re-render, it is worth knowing why components re-render and which optimisations are actually worth doing. This freeCodeCamp video (January 2026) covers re-rendering, memoization and lazy loading in about two hours:

::youtube[keTcXT145CI]{caption="How to Optimize React by Tapas Adhikary (freeCodeCamp, about 2 hours). Covers re-rendering, memoization, lazy loading, Suspense and virtualization, and when each is worth using."}

### Rule 6: Treat state as immutable

Never change an object or array in state directly. Create a new one and pass it to the setter.

```jsx
// Don't mutate
user.name = "John";
setUser(user);

// Create a new object
setUser({ ...user, name: "John" });
```

The same goes for arrays. Prefer methods that return new arrays over methods that change the original.

```jsx
// Add
setTodos([...todos, newTodo]);

// Remove
setTodos(todos.filter(t => t.id !== id));

// Update one item
setTodos(todos.map(t => (t.id === id ? { ...t, done: true } : t)));
```

Why it matters: React decides whether state changed by comparing the old and new values by reference. If you mutate the same object and hand it back, React may see "the same thing" and skip the update, and memoized children will not re-render when they should. If deeply nested updates get tedious, libraries like Immer let you write mutation-style code that produces immutable results. Redux Toolkit uses Immer internally for exactly this reason.

## Phase 3 Structuring and Sharing State Rules 7 to 9

### Rule 7: Avoid duplicated state

Two copies of the same information will eventually disagree. React's own guide on structuring state lists duplication as something to avoid, and its example is a good one to remember: store the **id** of the selected item, not a copy of the item.

```jsx
// Avoid: selectedItem is a copy that goes stale when items change
const [items, setItems] = useState(initialItems);
const [selectedItem, setSelectedItem] = useState(items[0]);

// Good: keep the id, derive the item
const [items, setItems] = useState(initialItems);
const [selectedId, setSelectedId] = useState(items[0].id);
const selectedItem = items.find(item => item.id === selectedId);
```

The cart example from the infographic is the same idea. If you keep both a list of cart items and a separate "total items" counter in state, the two can fall out of sync. Keep the list, and derive the count with `items.length` or a sum of quantities.

The same guide also recommends grouping related state, avoiding contradictions (such as `isSending` and `isSent` both being true) and preferring flat structures over deeply nested ones.

### Rule 8: Context isn't a state management solution

Context solves prop drilling, the chore of passing a value through many components that do not use it. It is mainly a way of making values available deeper in the tree. On its own it does not give you update logic, caching or devtools.

```jsx
const ThemeContext = createContext("light");

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}

function Button() {
  const theme = useContext(ThemeContext); // no props needed
  return <button className={theme}>Click</button>;
}
```

Two practical cautions. First, every component that reads a context re-renders when that context's value changes, so a big, frequently changing context can be a performance problem. Splitting unrelated values into separate contexts helps. Second, Context is the delivery mechanism, not the state itself. The state still lives in `useState` or `useReducer` somewhere above the provider.

For a small or medium app, Context plus `useReducer` (Rule 10) is a solid, dependency-free combination. When it starts to hurt, that is the signal to consider a dedicated store (Rule 12).

### Rule 9: Separate UI state from server state

These look similar in code but are different problems.

- **UI state** is local, short-lived and belongs to your interface: whether a modal is open, which tab is selected, what is typed in a field.
- **Server state** is data that lives on a server and is copied into your app: a product list, a user profile, a feed. It can go stale, needs loading and error states, may be fetched by several components at once and benefits from caching.

If you store API responses in `useState` and write your own `useEffect` fetching, you end up rebuilding caching, deduplication and refetching by hand. Libraries such as TanStack Query and SWR exist for exactly this.

```jsx
// Server state: let a dedicated tool handle caching and refetching
const { data, isPending, error } = useQuery({
  queryKey: ["products"],
  queryFn: fetchProducts,
});

// UI state: plain local state is perfect
const [isFilterOpen, setIsFilterOpen] = useState(false);
```

Once you separate the two, your global store (if you still need one) shrinks dramatically, because most of what people put in Redux is really server data.

This three-hour freeCodeCamp course by Jack Herrington walks through useState, useReducer, Context, React Query, Zustand, Jotai and Redux in one place. It was published in 2022, before React 19, so use it for the concepts rather than the newest APIs:

::youtube[-bEzt5ISACA]{caption="React State Management by Jack Herrington (freeCodeCamp, about 3 hours). Covers useState, useReducer, Context, React Query, Zustand, Jotai and Redux. Published in 2022, so treat it as a concepts course."}

> ℹ️ **Note:** If you are building the API side too, my guide to [every HTTP status code explained with real examples](/blog/every-http-status-code-explained-with-real-examples) helps you handle server responses properly in your loading and error states.

## Phase 4 Complex Logic and Global State Rules 10 to 12

### Rule 10: Use reducers for complex transitions

When many state changes depend on the previous state, a pile of `setState` calls becomes hard to follow. A reducer collects all the update logic in one pure function: `(state, action) => newState`.

```jsx
function cartReducer(state, action) {
  switch (action.type) {
    case "added":
      return { ...state, items: [...state.items, action.item] };
    case "removed":
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case "cleared":
      return { ...state, items: [] };
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

const [state, dispatch] = useReducer(cartReducer, { items: [] });

dispatch({ type: "added", item });
```

The flow is Action, Reducer, New State. Components describe what happened ("an item was added") and the reducer decides how state changes. That separation makes logic easier to test, because a reducer is just a function you can call with inputs and check the output.

Reducers must be pure: no API calls, no random numbers, no mutation. In development, React's Strict Mode intentionally runs reducers twice to help you catch impure ones.

Use `useState` for simple, independent values. Switch to `useReducer` when updates are related, numerous or dependent on previous state.

### Rule 11: Don't use Effects to synchronize state unnecessarily

Effects exist to synchronize your component with something outside React, such as the network, a timer or the browser DOM. They are not a tool for keeping two pieces of React state in sync.

```jsx
// Avoid: an Effect that copies one state into another
const [filtered, setFiltered] = useState([]);
useEffect(() => {
  setFiltered(data.filter(item => item.active));
}, [data]);

// Good: derive it during render
const filtered = data.filter(item => item.active);
```

The Effect version renders once with stale data, runs the Effect, sets state, and then renders again. The derived version is correct on the first render. The React documentation puts it simply: if there is no external system involved, such as updating state when props or state change, you shouldn't need an Effect. It also warns that handling user events in Effects loses information about what the user did, so put that logic in the event handler instead.

A related trick: if you want to reset all of a component's state when some value changes (for example, switching user profiles), give the component a `key` instead of writing an Effect that clears each field.

```jsx
<Profile userId={userId} key={userId} />
```

> ⚠️ **Heads up:** Data fetching is a legitimate Effect use case when you are not using a data library, but remember Rule 9. A server-state tool handles race conditions, caching and retries better than a hand-written Effect.

### Rule 12: Choose global state intentionally

Global state is powerful, but not every app needs it. Reach for it when the state is genuinely shared by many distant components, changes often or has complex update logic, and when Context plus a reducer has become painful.

Popular options include Redux Toolkit, Zustand and Jotai. A tiny Zustand store shows how little code a global store can need:

```jsx
import { create } from "zustand";

const useCartStore = create(set => ({
  items: [],
  add: item => set(state => ({ items: [...state.items, item] })),
}));

// Any component can use it
const items = useCartStore(state => state.items);
```

How to choose is mostly about your team and your problem. Redux Toolkit has strong conventions, devtools and a large ecosystem, which suits big teams. Zustand and Jotai are lighter and need less boilerplate. Whichever you pick, do not put server data in it by default (Rule 9) and do not use it to avoid thinking about ownership (Rule 3).

If you want a deep, structured walkthrough of Redux Toolkit specifically, this long freeCodeCamp course covers the core concepts, React-Redux hooks and Immer-based updates:

::youtube[SlC8941Wwrk]{caption="Redux and Redux Toolkit course by Khaiser Khanam (freeCodeCamp, about 8 hours). Covers actions, reducers, the store, React-Redux hooks and Immer. Dip into the sections you need."}

## Which Tool for Which Kind of State

Use this table when you are unsure where a piece of state should live. Start at the top and stop at the first row that fits.

| Situation | Best fit |
|---|---|
| Only one component uses it | `useState` inside that component |
| A few nearby components need it | Lift it to the closest common parent |
| It can be calculated from other state or props | No state at all, derive it during render |
| Several related updates depend on each other | `useReducer` |
| Many components deep in the tree need a mostly stable value (theme, auth user) | Context, with state held above the provider |
| It comes from an API | TanStack Query or SWR |
| Many distant components share complex, frequently changing client state | Redux Toolkit, Zustand or Jotai |

## Common React State Mistakes

- **Storing derived values.** Full names, totals, filtered lists. Calculate them (Rule 2).
- **Mutating state.** `push`, `splice` or direct assignment on state objects. Create new ones (Rule 6).
- **Reading state right after setting it.** The variable is a snapshot. Use the updater form or a local variable (Rule 5).
- **Copying props into state.** The state is only initialised on the first render, so later prop changes are ignored. Read the prop directly, or reset with a `key`.
- **Syncing state with Effects.** If an Effect only calls a setter, derive instead (Rule 11).
- **Treating Context as a store.** Large, fast-changing contexts re-render every consumer (Rule 8).
- **Putting everything global.** Most state is local or server state (Rules 1 and 9).
- **Duplicating data.** Store ids, not copies of objects (Rule 7).

## Free Videos to Go Deeper

You do not need to pay to learn this well. Watch for the concepts, and always check the publication date, because React changes quickly.

- [React State Management, Jack Herrington (freeCodeCamp)](https://www.youtube.com/watch?v=-bEzt5ISACA): a broad tour of state tools, from `useState` to Redux.
- [Redux and Redux Toolkit course (freeCodeCamp)](https://youtu.be/SlC8941Wwrk): the longest and most detailed option here.
- [How to Optimize React (freeCodeCamp)](https://www.youtube.com/results?search_query=freeCodeCamp+How+to+Optimize+React+Tapas+Adhikary): useful once you understand why state changes cause re-renders.
- The interactive lessons on [react.dev](https://react.dev/learn/managing-state) are the most reliable reference of all, and they are free.

## Copyable React State Checklist

Copy this into your notes or paste it into a pull-request template.

**Where state lives**
- [ ] Each piece of state lives in the lowest component that needs it
- [ ] Nothing is stored that can be calculated during render
- [ ] Every piece of state has one clear owner

**How state behaves**
- [ ] I can explain state vs props in my own words
- [ ] I use the updater form (`setX(x => ...)`) when the next value depends on the previous one
- [ ] I never mutate state objects or arrays

**Structure and sharing**
- [ ] No duplicated data (I store ids, not copies)
- [ ] Context is used for delivery, with the state held above the provider
- [ ] API data is handled by a server-state tool, not hand-rolled Effects

**Complex and global**
- [ ] Related updates use `useReducer`
- [ ] No Effect exists only to copy state into other state
- [ ] Global state is only used where many distant components truly share it

## Final Word My Honest Take

React state is not hard because the API is large. `useState` is one line. It is hard because good state design is a design skill, and no hook can do it for you.

If you remember one thing from this guide, make it the tagline: **own it, derive it, share it intentionally.** Start local, calculate instead of storing, keep one source of truth, and add tools only when the simple version genuinely stops working. Most of the "state management" problems people ask about online disappear once those habits are in place.

Pick one component in your current project today and run it through the checklist above. Delete one redundant state variable, and you have already learned the most valuable rule in this guide.

## Sources and Further Reading

Technical claims in this article were checked against the following sources in October 2026:

- [react.dev: Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure): principles for grouping, deriving and de-duplicating state
- [react.dev: You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect): deriving values during render instead of syncing with Effects
- [react.dev: Managing State](https://react.dev/learn/managing-state): lifting state up, reducers and Context
- [react.dev: set-state-in-effect lint rule](https://react.dev/reference/eslint-plugin-react-hooks/lints/set-state-in-effect): why setting state inside an Effect causes extra renders
- [freeCodeCamp: How to Manage State in React](https://www.freecodecamp.org/news/how-to-manage-state-in-react/): course details for the Jack Herrington video
- [freeCodeCamp: Learn Redux and Redux Toolkit for State Management](https://www.freecodecamp.org/news/learn-redux-and-redux-toolkit-for-state-management/): course details for the Redux video

Code examples are simplified for teaching. Library APIs such as TanStack Query, Zustand and Redux Toolkit change between major versions, so confirm the details against their current documentation before using them in production.

*This article is maintained and updated as React and its ecosystem change. If you spot outdated information, please use the Contact page to flag it.*

## About the Author

**Veeresh Bashetti** is a full-stack developer who builds Django and React applications and writes practical, project-tested guides for developers and students, with a focus on separating genuine industry trends from marketing hype. Read more on the [About page](https://veereshbashetti.com/about).
## More Useful Resources

- [Frontend Developer Roadmap 2026: What to Learn, in Exactly This Order (12 Steps)](/blog/frontend-developer-roadmap-2026-learn-in-this-order)
- [Every HTTP Status Code Explained with Real Examples (2026 Guide)](/blog/every-http-status-code-explained-with-real-examples)
- [9 AI Tools That Are Actually 100% Free for Developers in 2026](/blog/9-totally-free-ai-tools-for-developers-2026)
- [15 Chrome Extensions Every Developer Should Have Installed in 2026](/blog/best-chrome-extensions-for-developers-2026)
- [More Career and Tech Articles](/category/career)