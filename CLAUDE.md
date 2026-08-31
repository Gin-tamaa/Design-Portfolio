# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

The portfolio site for Sumedh Kamble — product designer and design engineer on ShopOS. Next.js 14 (App Router), plain JavaScript `.jsx` (no TypeScript), Tailwind, framer-motion, GSAP. There is no test suite and no CMS: every page is hand-written JSX.

Three case studies are fully built — ShopOS Agents, Brand Memory, Enterprise Dashboard — plus a homepage, a `/work` index, and `/about`. Each case study carries an AI chat where four personas answer questions about that project.

## Running locally

```bash
npm install
npm run dev
```

Deploys are automatic: pushing to `main` ships to Vercel.

Environment variables (none are committed; `.env*.local` is gitignored):
- `OPENAI_API_KEY` — required, or `/api/chat` returns 500.
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` — rate limiting. Absent in dev, the limiter is disabled and logs a warning; set both before deploying.

## Routes

| Route | File | Notes |
|---|---|---|
| `/` | `app/page.jsx` | Intro overlay → fixed hero → `Carousel` feed |
| `/work` | `app/work/page.jsx` | H1 + `CaseCards` — not linked from the nav |
| `/work/shopos` | `app/work/shopos/page.jsx` | ~1,570 lines |
| `/work/brand-memory` | `app/work/brand-memory/page.jsx` | ~910 lines |
| `/work/enterprise-dashboard` | `app/work/enterprise-dashboard/page.jsx` | ~1,170 lines |
| `/about` | `app/about/page.jsx` | Bio, work list, workflows media feed |
| `/api/chat` | `app/api/chat/route.js` | Server-only OpenAI proxy |

**Two separate project lists exist and have drifted apart.** `Carousel.jsx` (homepage) lists ShopOS, Brand Memory, Enterprise Dashboard, and DreamCall. `CaseCards.jsx` (`/work`) lists ShopOS, Brand Memory, and HEYY. Editing one does not update the other — change both, or consolidate them.

## The case-study chat

Four personas — `creative-head` (the default), `vibe-coder`, `ai-tinkerer`, `funny-side` — answer in character. The model picks one lane per question and returns `{persona, domain, answer}` as JSON.

Content lives in `content/` as markdown, and each project has a **pair** of files:

- `content/projects/<slug>.md` — the brief. What the agent may state as fact.
- `content/projects/<slug>.guardrails.md` — what it must **not** claim. Assembled into the system prompt *after* the brief and explicitly overrides it on conflict.
- `content/agents/_shared.md` — routing rules and output format, obeyed by every voice.
- `content/agents/<persona>.md` — one file per voice.

The guardrails carry real constraints, not boilerplate: no invented metrics, no named clients, and a hard limit on overclaiming ownership (Sumedh owned research, design, and frontend — not product strategy). Preserve that precision when editing.

**After editing any file in `content/`, regenerate the bundle:**

```bash
npm run content:bundle
```

`content/bundle.js` inlines the markdown as string literals and is committed. This exists because Vercel's serverless tracer does not include `.md` files, so reading them at request time fails with ENOENT in production. `prebuild` regenerates it automatically, but commit the regenerated file so local and deployed content never diverge.

To add a chat to a new case study: add the brief/guardrails pair, register the slug in `scripts/generate-content-bundle.js`, add it to `PROJECT_CONTENT` in `app/api/chat/route.js`, regenerate, then render `<ChatLauncher project="<slug>" />`.

The model is a single constant, `MODEL`, at the top of `app/api/chat/route.js`.

## Styling and conventions

- **There are no design tokens.** `tailwind.config.js` has an empty `theme.extend` and `next.config.mjs` is an empty object. Colors are repeated literals: ink `#0a0a0a`, secondary `#525252`, muted `#6b6b6b`, meta `#aaaaaa`, hairline `#E5E5E5`. The one accent is `linear-gradient(90deg, #34d399, #8b5cf6)`.
- The only scoped token layer is `.cs-scope` in `globals.css`, which defines `--cs-ink`, `--cs-secondary`, `--cs-prose-col` and the clamped heading sizes used by case studies.
- Fonts load from one Google Fonts URL in `layout.jsx`. **Inter** for UI, **Playfair Display italic** for the wordmark and hero, **League Spartan 300** for supporting copy, **Space Grotesk** for card wordmarks. Most of the other ~14 families exist only to feed the intro's font-morph loop — do not prune them without reading `Intro.jsx`.
- Two layout rails coexist: `max-w-[1400px]` (nav, footer) and `max-w-[1080px]` (homepage feed). The hero deliberately mirrors the feed rail so their left edges align.
- **`prefers-reduced-motion` is honored throughout** — in CSS and with JS guards in `Intro`, `Carousel`, `SmoothScroll`, and every animated thumbnail. Any new animation must follow this.
- `layout.jsx` sets `paddingTop: 64` as an inline style, so full-bleed heroes override it with `body.shopos-hero` / `body.brand-memory-hero` and `!important`. Pages toggle these body classes on scroll; `body.shopos-nav-solid` solidifies the nav past the hero.

## Intentionally parked code — do not delete blindly

- `app/components/SitePet.jsx` — a walking mascot, disabled via two commented-out lines in `app/page.jsx`. Restoring it is a one-line revert; ~180 lines of `.site-pet*` CSS stay live for that reason.
- `app/components/ConnectFooter.jsx` — a canvas Breakout game spelling LETS/CONNECT. Imported nowhere; superseded by the simpler `Footer.jsx`.
- `app/work/brand-memory/PromptInput.jsx` — written but imported nowhere.
- `app/_archive/v1/` — the previous homepage. The underscore prefix keeps Next from routing it.

## Known gaps

- `/work/shopos` renders an `<ImageSlot>` with no `src` in section 11, which displays a literal "IMAGE COMING" placeholder on the live site.
- The ShopOS footer's "Next" link points to `/work` rather than `/work/brand-memory`; the "HEYY, Studio Reel" card on `/work` also points to `/work`.
- All three case studies close with a link to `/about#contact`, but no `id="contact"` exists on the about page.
- `RESUME_URL` is duplicated in `Nav.jsx` and `Footer.jsx`.
- `content/bundle.js` is committed with CRLF line endings. Regenerating it on a LF checkout rewrites the whole file — check `git diff` is real content before committing it.
