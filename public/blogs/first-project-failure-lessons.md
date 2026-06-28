---
title: "What My First Freelance Project Failure Taught Me About Money, Trust, and Saying What You Don't Know"
slug: "first-project-failure-lessons"
excerpt: "I built a complete matrimony platform. The client loved it. Then one sentence — one wrong number I gave with full confidence — ended everything. Here's what I learned."
description: "A real story of a freelance project failure in India — scope creep, a wrong hosting quote, and the lessons every junior developer needs to hear before their first client project."
date: "2026-03-10"
lastModified: "2026-06-28"
category: "Life Lessons"
tags:
  - first project failure
  - freelance lessons India
  - developer life India
  - client communication mistakes
  - web hosting India
  - VPS vs shared hosting
  - freelance mistakes students
  - software developer 20s
  - learning from mistakes
  - growth mindset developer
  - matrimony website project
  - full stack project lessons
readingTime: "10 min read"
featured: false
emoji: "🔧"
author: "Veeresh Bashetti"

image: "https://cdn.jsdelivr.net/gh/Veeresh36/bog_images@main/my-code-worked-but-the-project-still-failed.webp"
imageAlt: "My Code Worked But The Project Still Failed — Freelance Lessons India"

authorUrl: "https://veereshbashetti.com/about"
canonicalUrl: "https://veereshbashetti.com/blog/first-project-failure-lessons"

takeaways:
  - "Research every cost before you quote it — one wrong number said with confidence can end a project that took months to build."
  - "Shared hosting and VPS are not the same thing. Any full-stack app with a database, file uploads, or real traffic needs a VPS, not shared hosting."
  - "Scope creep does not feel like a problem while it is happening — it feels like enthusiasm. A written scope document is the only thing that stops it."
  - "The three sentences that make you look more professional, not less: I do not know. That is outside scope. I need time to give you an accurate number."
  - "The code was not the failure. The communication was. Technical skills and honest communication are both required — neither replaces the other."

faqs:
  - q: "What is the most common reason freelance projects fail in India?"
    a: "Poor communication around cost, scope, and hosting requirements — not bad code. Most junior developers in India lose projects because of unclear quotes or scope that expands without a written agreement, not because of technical skill gaps."
  - q: "What is the difference between shared hosting and VPS in India?"
    a: "Shared hosting (Rs 1,500-5,000 per year) works for static sites and simple blogs. A VPS (Rs 10,000-60,000 per year) is required for any full-stack application with a database, file uploads, real-time features, or more than a handful of concurrent users. Quoting shared hosting prices for a VPS project is one of the most expensive mistakes a junior developer can make."
  - q: "How do I avoid scope creep on my first freelance project?"
    a: "Write a scope document before writing a single line of code. List exactly what you are building and exactly what you are not building. Get the client to agree to both lists in writing. Any new feature request after that is a new conversation about budget and timeline."
  - q: "Should I start coding immediately when a client agrees on a project?"
    a: "No. Before writing any code, confirm the scope in writing, identify the hosting requirements, research all third-party costs, and get a signed agreement. Starting to code before these steps are done is how you end up building three times the work for the same money."
  - q: "What VPS providers should Indian developers consider for full-stack projects?"
    a: "DigitalOcean, Hostinger VPS, Hetzner, and Linode (now Akamai) are all reliable options. Budget Rs 800-1,500 per month for a basic setup, and Rs 3,000-5,000 per month for a production app with image storage and real traffic."
  - q: "Is it unprofessional to say I don't know to a client?"
    a: "The opposite. Saying I'll check and confirm by tomorrow is far more professional than guessing and being wrong. Every experienced developer uses this phrase. It shows you take accuracy seriously, which is exactly what a client needs to trust you with their money and time."

author: "Veeresh Bashetti"
---

# What My First Freelance Project Failure Taught Me About Money, Trust, and Saying What You Don't Know

The project was complete.

Every feature built. Every screen working. Every edge case handled.

I should have been proud. Instead, I watched a client walk away — not because I wrote bad code, but because of one sentence I said with more confidence than I had any right to feel.

That sentence cost me the project, the payment, and months of work.

This is the story of Sapthapadi Matrimony — and the lessons I will never forget.

---

## The Beginning: Rs 25,000 and a Vision

A client came to me with an idea for a matrimony platform. A proper one — profile matching, search filters, contact requests, the works. I was excited. This was a real project. A full-stack application with actual users, actual stakes, actual purpose.

We agreed on Rs 25,000. I thought that was fair. I thought I had calculated everything.

I hadn't.

I started building immediately, which — if you have read anything about project management — you will already know is a warning sign. But I was young and eager and the vision felt clear enough.

---

## What I Built

Over the following weeks, I built Sapthapadi Matrimony from scratch.

- Profile creation and matching logic
- Search and filter by location, caste, profession, age
- Photo upload and gallery
- Contact request system
- Admin panel for approvals
- Mobile-responsive design

And then the features started growing.

Every week there was something new. A chat feature. Aadhaar integration for verification. Notification system. More filter options. The client was enthusiastic — and I, not knowing how to say "that's out of scope," kept building.

The project that started as a simple matrimony directory became a full platform. And I built all of it, because I didn't yet know how to protect my own time and energy with a scope document.

But none of that is what killed the project.

---

## The Sentence That Ended Everything

When the project was nearly done, we sat down to discuss deployment.

I quoted Rs 5,000 for hosting and domain for the year.

I said it casually, confidently — the way you say something when you want to appear like you know what you're talking about, even when you're not entirely sure.

The client nodded. We moved on.

A few days later, I actually looked into it.

A full-stack matrimony platform — with a database, image uploads, real-time features, Aadhaar integration, and dozens of concurrent users — cannot run on shared hosting. It needs a **VPS**. A Virtual Private Server. A proper environment with dedicated resources, SSH access, and a server you can actually configure.

The real annual cost? **Rs 55,000 to Rs 60,000.**

Eleven times what I had quoted.

I had to go back to the client with that number. The conversation was short. The project, which I had spent months building, was complete — and it didn't launch. The client left. I didn't get paid. I was left with a codebase, a lesson, and a lot of quiet.

---

## Why I Got It So Wrong

I want to be precise about the mistake, because vague lessons don't help anyone.

**I didn't research before I spoke.** I had a rough, vague sense that hosting costs "a few thousand rupees a year" from building small static projects. I applied that number to an entirely different class of application without checking. I mistook familiarity with the concept of hosting for actual knowledge of what this specific project needed.

**I confused shared hosting with VPS.** These are not the same thing at all.

| | Shared Hosting | VPS Hosting |
|---|---|---|
| Resources | Shared with hundreds of others | Dedicated to your server |
| Cost in India | Rs 1,500–5,000 per year | Rs 10,000–60,000 per year |
| Best for | Static sites, simple blogs | Full-stack apps, databases, real traffic |
| Custom config | Very limited | Full root access |

Sapthapadi Matrimony was never a shared hosting project. It was a VPS project from day one. I just didn't know the difference well enough to recognize it.

**I didn't say "I'll check and confirm."** That's the real mistake. Not the knowledge gap — everyone has knowledge gaps. The mistake was presenting a guess as a fact to a client who was making financial decisions based on it.

Four words — "let me check first" — would have saved everything.

---

## What Scope Creep Looks Like When You're Living It

There's another lesson buried in this story that I almost glossed over.

The project started at Rs 25,000. By the time it was done, it had a chat system, Aadhaar verification, a full admin dashboard, and notification features that were never part of the original conversation.

I built all of it. Because the client asked, and I didn't have a contract, and I didn't know how to say: "That's a new feature. That's a new conversation about budget and timeline."

Here's what scope creep feels like from the inside: it doesn't feel like a problem. It feels like enthusiasm. It feels like the client trusting you. It feels like you're being helpful and collaborative. And then you realize you've tripled the work for the same money — and you can't even collect that money because a hosting quote went wrong.

If you are a student or a junior developer taking on freelance work, this is the most important thing I can tell you:

**Write down exactly what you are building. Write down exactly what you are not building. Get the client to agree to both lists. Do this before you write a single line of code.**

I didn't do any of that. I paid the price for it.

---

## The Emotions Nobody Talks About

I want to be honest about what this period felt like, because most "lessons from failure" posts skip this part.

After the project fell apart, I didn't feel philosophical about it. I felt stupid. I felt like I had wasted months of work on something that would never exist in the world. I felt embarrassed that a technical mistake — one that a more experienced developer would never have made — had undone something I had genuinely worked hard on.

I also felt the financial pressure of it. I had spent time on this project that I wasn't spending earning money elsewhere. That's a real cost that's hard to calculate but easy to feel.

And I felt something I wasn't expecting: grief for the project itself. Sapthapadi Matrimony was good. It was solid work. It just never launched. Somewhere in a folder on an old hard drive, it still exists — finished, functional, and invisible. That's a strange thing to carry.

If you are reading this and you have a dead project like that — something you built that nobody saw — I want you to know that the work was not wasted. What you built is in your hands now, even if it never shipped. The skills transferred. The lessons transferred. The work counts.

---

## What I Do Differently Now

**I research before I quote.** Any cost that goes into a client proposal — hosting, domains, third-party APIs, SMS gateways, payment processors — I look up the actual number before I say anything. If I don't know, I say "I'll confirm this by tomorrow."

**I write a scope document.** Before the first line of code, I define: what is included, what is not included, and what the process is if the client wants to add something. This document exists in writing. Both parties have a copy.

**I identify the hosting requirement during scoping, not after building.** The question "what kind of server does this need?" is a design question, not a deployment question. It shapes the cost conversation from the start.

**I separate what I know from what I think I know.** These are different categories. Treating them as the same is how you end up in a conversation where a client looks at you and asks why the budget just tripled.

**I've also learned to say three sentences that used to feel uncomfortable:** "I don't know — let me find out." "That's outside the original scope." "I need more time to give you an accurate number."

None of those sentences make you look less professional. They make you look more professional. Every experienced developer I respect uses them freely.

---

## A Note on Hosting for Fellow Developers in India

Since this post may reach other junior developers who might make the same mistake, here's a quick reference:

**Use shared hosting for:** Portfolio sites, static blogs, simple HTML/CSS pages, WordPress sites with low traffic.

**Use VPS hosting for:** Django, Node.js, or Laravel applications; anything with a database and real user traffic; apps with file uploads, real-time features, or third-party API integrations.

**VPS providers worth knowing in India:** DigitalOcean, Hostinger VPS, Linode (now Akamai), Hetzner. Prices start around Rs 800–1,500 per month for a basic setup, which adds up to Rs 10,000–18,000 per year at minimum. A production app with image storage and decent traffic is closer to Rs 3,000–5,000 per month.

Always calculate this before you quote. Always.

---

If you are early in your freelancing journey as a developer in India, this video is one of the most honest accounts of what those first two years actually look like — the real earnings, the real client dynamics, and what nobody tells you before you start:

::youtube[XNHgOCoXfZk]{caption="Reality of Software Development Freelancing in India — 2 years of real experience, international clients, and what college students need to know before taking on projects"}

---

## The Real Lesson

I used to tell this story as a story about bad luck. Wrong timing. A client who didn't understand.

I don't tell it that way anymore.

The real story is about the gap between what I knew and what I presented myself as knowing. And about the professional responsibility that comes with being the technical person in the room — the person the client is trusting to give them accurate information.

When a client hires a developer, they are not just hiring someone who can write code. They are hiring someone who understands the full picture: what the project costs, what it needs to run, what complications might arise, and what questions to ask before any money changes hands.

I didn't yet understand the full picture. And I didn't say so.

That gap — between actual knowledge and projected confidence — is the most expensive gap in a young developer's career.

The code will get better with practice. The technical skills will come. But learning to be honest about what you know, and what you don't, and what you need to find out before you make a promise — that lesson only comes from a moment like this one.

I wish I had learned it cheaper.

But I'm glad I learned it.

---

**Related reading:**
- [I Spent Rs 13,000 of My Scholarship Money on a CPU — Here's What It Taught Me](/blog/13k-second-hand-cpu-mistake-in-20s)
- [The Developer Setup Trap: Why Better Hardware Won't Make You a Better Developer](/blog/developer-setup-trap)
- [The Biggest Money Mistakes People Make in Their 20s](/blog/money-mistakes-20s)
- [Stop Comparing Yourself to People Online. It Is Costing You More Than You Think.](/blog/stop-comparing-yourself-social-media)