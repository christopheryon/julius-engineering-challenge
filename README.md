# Workforce Dashboard — Take-Home Challenge

> **Estimated time:** 3–4 hours
> **Stack:** React + TypeScript + Vite (frontend) · Express + TypeScript (mock backend)

Welcome! Thanks for taking the time to do this challenge.

This is meant to mirror a realistic day at Julius: you're handed a partially-working
prototype, asked to find and fix some issues, ship a small feature, and integrate
against an API endpoint. We care a lot more about **how you think, communicate,
and navigate existing code** than about a perfectly polished result.

If anything in this README is unclear, just make a reasonable assumption, **write
it down**, and keep moving.

---

## TL;DR — What you'll do

1. **Get it running** (~10 min) — clone, install, start client + server.
2. **Part 1 — Fix bugs** (~45 min) — three real bugs we've left in the codebase.
3. **Part 2 — Implement a feature** (~1.5–2 hr) — region filter + search + sorting.
4. **Part 3 — Integration task** (~45 min) — wire up a new endpoint and chart.
5. **Part 4 — Write up your work** (~20–30 min) — short `SOLUTION.md`.

You do **not** need to finish everything. If you run out of time, stop and write
about what you would have done. We genuinely mean that — partial work with great
communication beats rushed work with no context.

---

## What's in the box

```
workforce-dashboard-challenge/
├── client/                  # React + TS + Vite frontend
│   ├── src/
│   │   ├── api/             # API client layer
│   │   ├── components/      # Dashboard components (cards, charts, filters)
│   │   ├── hooks/           # Custom hooks
│   │   ├── types/           # Shared TS types
│   │   └── utils/
│   └── package.json
├── server/                  # Express mock backend
│   ├── data/                # CSV + JSON workforce data
│   ├── routes/              # API routes
│   └── package.json
├── README.md                # ← you are here
└── SOLUTION.md              # ← you'll write this
```

The data is loosely modeled on US Bureau of Labor Statistics occupational
employment & wage data — occupations, regions, median wages, employment
counts, projected growth. It's mocked but realistic-shaped.

---

## Setup

```bash
# Requires Node 20+ (see .nvmrc)
npm run install:all
npm run dev
```

This runs both apps in parallel:

- **Client:** http://localhost:5173
- **Server:** http://localhost:3001

If you'd rather run them separately:

```bash
npm run dev:server   # in one terminal
npm run dev:client   # in another
```

You should see a dashboard with a header, some KPI cards, a bar chart, and a
table. **Some things are broken on purpose.** That's Part 1.

---

## Part 1 — Fix the bugs (~45 min)

There are **three bugs** in the current code. You should be able to spot all
three by interacting with the dashboard for a couple of minutes and looking at
the browser console / network tab.

We're not going to tell you exactly what they are or where they live — finding
them is part of the exercise. We will say:

- One is a **data shape mismatch** between the API and the client.
- One is a **state-management** bug that causes a UI element to behave wrong.
- One is a **chart rendering** bug that shows up when the underlying data changes.

For each bug, in your `SOLUTION.md`:
- Briefly describe what was wrong and how you found it.
- Explain the fix (1–2 sentences is fine).
- If you have an opinion about how to prevent the class of bug going forward,
  mention it.

> 💡 We're not looking for the "cleverest" fix. We're looking for a fix that's
> understandable by the next person who touches this file.

---

## Part 2 — Implement a feature (~1.5–2 hr)

The dashboard currently shows all occupations across all regions. Product wants
users to be able to slice it. Add the following to the dashboard:

1. **Region filter** — a dropdown/select that filters the data to a single region
   (or "All regions"). The regions are returned by the API.
2. **Search** — a text input that filters occupations by name (case-insensitive,
   substring match is fine).
3. **Sorting** — let users sort the occupation table by at least two columns
   (e.g. median wage and projected growth). Indicate sort direction in the UI.

Constraints / expectations:

- All three filters should compose (region + search + sort all active at once).
- The chart and KPI cards should reflect the filtered data, not the full dataset.
- Keep state management simple — local React state and/or a single context is
  more than enough. **Don't** reach for Redux/Zustand/etc. for this.
- Handle the empty state (no occupations match the filters) gracefully.

We're paying attention to:

- How you structure the filter state (one source of truth vs scattered).
- Whether filtering is done client-side or server-side, and why.
- Component boundaries — what gets its own component, what stays inline.
- Accessibility basics (labels on inputs, keyboard usable).

---

## Part 3 — Integration task (~45 min)

> Part 3 is the most "skippable" part if you're running long. If you only get
> to outline how you'd approach it in `SOLUTION.md`, that's still useful signal.

The backend already exposes `GET /api/occupations` and `GET /api/regions`.

There's a **third endpoint** that's implemented on the server but not yet used
by the client: `GET /api/occupations/:code/trend`. It returns historical
employment data for a given occupation, year by year.

Your task:

1. Add an API client function for this endpoint (follow the pattern in
   `client/src/api/`).
2. When a user clicks a row in the occupation table, show a **line chart** of
   that occupation's employment trend over time. Where it lives in the layout
   is up to you (side panel, modal, expand-in-place — pick what feels right and
   explain why in your writeup).
3. Handle loading and error states for the new chart.

You'll need to look at the server code to understand the response shape — that's
intentional. Reading other people's code is half the job.

---

## Part 4 — Write up your work

Create a `SOLUTION.md` in the repo root. Suggested sections:

- **Bugs found & fixed** (Part 1)
- **Feature notes** (Part 2) — key decisions, tradeoffs, what you'd do differently
  with more time
- **Integration notes** (Part 3) — why you chose the UI pattern you did
- **Assumptions** — anything you decided on your own
- **What I'd build next** — 3–5 bullets, e.g. accessibility audit, virtualizing
  the table, server-side filtering, error boundaries, tests, etc.

Keep it short. A page or two is plenty. Bullet points are fine.

---

## How we'll evaluate

| Area | Weight | What we're looking at |
|---|---|---|
| **Debugging & code reading** | 25% | Did you find the bugs? Were your fixes targeted? |
| **Feature implementation** | 25% | Does it work? Is the state model sound? Empty/loading states? |
| **Code quality & autonomy** | 20% | Structure, naming, types, component boundaries. Did you make reasonable assumptions and document them rather than getting stuck? |
| **Communication** | 30% | Does your `SOLUTION.md` explain your thinking? Tradeoffs called out? |

> Communication is weighted highest because it's the strongest signal of how
> you'll work on the team. A perfectly working dashboard with no writeup tells
> us a lot less than a 70%-done one with a clear explanation.

---

## Rules of the road

- ✅ Use any libraries you'd normally use. If you add a dep, mention why in `SOLUTION.md`.
- ✅ Use AI assistants (Copilot, Cursor, Claude, ChatGPT, etc.) the way you would
  on the job. We do. If a chunk of code came from an AI suggestion that you
  reviewed and own, that's fine. If you copy-pasted something you don't
  understand, we'll be able to tell in the follow-up call.
- ✅ Commit as you go. We may look at your commit history.
- ❌ Don't rewrite the whole thing. Work *with* the existing structure even if
  you'd have done it differently from scratch.
- ❌ Don't spend more than ~4 hours. Stop and write about what's left.

---

## Submitting

Push to a **public GitHub repo** and reply to the email with the link. Make
sure `SOLUTION.md` is in the repo root.

Good luck — have fun with it!
