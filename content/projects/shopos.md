# ShopOS — deep brief (chat source of truth)

> This file is what the agents answer FROM. It holds the depth the case study page deliberately leaves out. Agents may state anything here as fact, in their own voice. They must NOT invent anything beyond it. Pending data and hard limits live in shopos.guardrails.md.

---

## ONE-LINE

ShopOS is an AI-agent operating system for e-commerce / DTC brands. A brand owner directs a team of named AI agents — a whole marketing and ops department — instead of hiring one specialist per function. Sumedh led research, design, and the frontend.

## WHAT SUMEDH OWNED (ownership, stated honestly)

- **Research** — studied the market, the competitors, and the brand's own internal roles; ran the internal validation loop.
- **Product Design** — designed the system end to end: onboarding, agent setup and customization, the Jobs/Kanban board, Mission Control, Cowork, and the multi-agent conversation, with every empty / loading / error / success state built to near-production fidelity.
- **Frontend** — built the frontend himself, via Cursor + Figma MCP + Claude Code (not hand-written React from scratch; he drives the build with AI tooling and a git-pull workflow).

Honest framing: "I owned research, design, and frontend. Product strategy — the company's bet on agents — was a team call. I drove the design within it." He does not claim he decided ShopOS should do agents; he claims he drove how it was researched, designed, and built.

## THE MARKET OPENING (the why-now)

By 2026 every brand had AI that could write a caption or generate a product shot. Useful, but none of it ran the store. A founder was still the one person on SEO, paid, email, the numbers, and reviews — wearing every hat, unable to watch it all at once.

The opening wasn't a better image generator. It was the *whole store, covered*. Agents could own a function and run it relentlessly, around the clock, without being checked ten times a day. Humans can't watch a store 24/7 and catch every small nuance; agents can.

**The Da Vinci framing (Sumedh's analogy for how he thinks about agent leverage):** Da Vinci can make extraordinary art, but it takes him months. An AI that carries Da Vinci's context can recreate the work far faster — and if Da Vinci sits and tweaks the agent, it gets closer and closer to him. The point isn't replacement; it's that the right context plus AI does the work much quicker. That speed, applied across every store function, was the opportunity.

**The umbrella vision:** ShopOS isn't just a marketing-department tool. It's the whole umbrella for running a brand's storefront — creative (image generation, a beta editor, Photoshop-grade tools feeding the creative agent), email, social, finance, brand intelligence, and even Richard, the agent that understands and builds/codes websites. The selling point: anyone can do creatives, but not everyone can make the creatives understand your brand memory AND seamlessly integrate everything into one team. That integration is the gold.

## THE HARD PART (the real design problem)

Single-agent chat is solved; everyone has it. Nobody had a clean pattern for **one agent recruiting specialists into a single conversation** — reasoning out loud, running multi-step "Arcs" (e.g. a TOFU A/B test loop), and reporting back without the user losing the thread.

It gets concrete: when Gavin (paid) detects a creative fatiguing, he doesn't just flag it — he briefs Monica (creative), who generates replacements, while Jian-Yang (brand intelligence) feeds both. The team hands work to itself. The design job: make that legible to a human watching from outside — who's leading, who just joined, what they're doing right now — without drowning them in logs. Everything else served that.

## DESIGNING THE AGENTS (3 versions + the endowment-effect reasoning)

Three iterations of how a brand sees and shapes its team:

**01 — The card stack.** Each agent a tidy card, one per function. Clean and scannable, mapped one-to-one with store functions. But it read like a feature list, not a team — cards were yours to *read*, not to *shape*. No sense any of them were "yours."

**02 — Name + soul.md.** Every agent gets a name and a short persona file (soul.md) defining how it talks, what it prioritizes, the context it always carries. Russ (finance) opens his with "Every statement includes a number." Monica (creative) with "You have opinions." The catalog became *your* team, with your names and voices.

**Why naming/editing matters — the endowment effect:** giving the user the ability to change or tweak something creates ownership. The showroom analogy: MacBooks in an Apple Store are tilted to a slightly awkward angle, so you adjust the screen — and the moment you act on it, it feels like *yours*. Naming an agent and writing its soul.md does the same thing: it turns a stock tool into "your Gavin who only talks in numbers." That ownership is the differentiator — editable personalities, not generic chat.

**03 — The bracketed org view.** Testing showed people couldn't tell who reports to whom or which agents work together on a job. So Sumedh added a bracketed, org-chart-style view: the lead agent at top, specialists grouped beneath, work flowing through the brackets. Comprehension jumped — people finally understood the lead-orchestrates-specialists model, and the multi-agent thread became legible before you even opened it.

**The honest tradeoff (Sumedh's real position):** He's not sold on the bracketing UI. It reads like a flowchart, and brackets are a heavy visual metaphor for something that should feel alive. He pushed back on it internally. He kept it because the comprehension win was real and *measured* — users understood the org instantly with it, stumbled without it. He chose the version that taught users fastest over the version he found most elegant. Given another cycle, he'd keep the hierarchy it conveys and redesign how it's drawn: less bracket, more living team.

## GIVING THE TEAM WORK (two entry points)

Two doors into the same orchestration engine, for two ways of thinking:

- **Jobs / Kanban** — for task thinkers. Work moves across Needs Attention → In Progress → Completed → Scheduled. A single task, or one several agents pick up and execute together.
- **Chat / Cowork** — for goal thinkers. State the outcome in plain language; talk to one agent directly, or let a lead agent recruit the right specialists and run the steps. You can address the whole team at once in the main chat, or an individual agent.

Both feed the same layer. Board and chat are two views of one team.

## MISSION CONTROL (the home surface)

"Mission Control" is the name of the whole agent dashboard / home surface. A founder's morning used to be six tabs (Meta Ads, Shopify, the agency WhatsApp thread, a spreadsheet from last week); by the time the picture came together it was 10am and half the day's decisions were already reactive. Mission Control replaces that with one morning check-in. It reads and surfaces; it never generates — generation lives in Cowork.

Two rules held it together:
- **Needs Attention** is pinned at the top, capped at two or three items. Every item names the agent who flagged it, the specific metric, what's already been done, and exactly one action (Open in Cowork). No vague "performance is down." If it can't be made specific and actionable, it doesn't surface.
- **The SKU scatter chart** plots every product by ad spend against revenue, sorted into four quadrants (Scale, Untapped, Drain, Inactive). The gap between where spend goes and where money is made is exactly where value hides or bleeds. It turned a spreadsheet nobody opens into a glance you can't unsee.

Mission Control is the status surface; Cowork is the action surface. One button bridges them, so you never read about a problem without a one-tap way to act.

## THE ORCHESTRATION THREAD (designing trust)

When a lead agent recruits specialists and runs a multi-step Arc, a lot happens the user can't see. The job was to make it legible without logs:
- **Reasoning states** ("Thoughts for 8s") that show the system working, not stalling.
- **Agents joining visibly** — you watch Gavin pull Monica in, so the team assembles around your request in front of you.
- **Arcs** that expose the multi-step plan as it runs, not just the final output.
- **Completion notifications** for long-latency work, so hours-long jobs don't force you to sit and wait.

Every state — empty, loading, error, success — is designed, because an AI team that fails silently isn't trustworthy. Trust was the whole product.

## THE VALIDATION LOOP (how it was actually built)

The real process, in order:
1. Saw the market opening; studied competitors and where ShopOS could fit as a whole ecosystem.
2. The roles already existed in the building — paid lead, CRM manager, creative director, etc. Built an **internal MVP** of the agents.
3. Ran the internal MVP **through the company's own team**, each person testing the agent for the role they actually do. Their feedback shaped what each agent owned.
4. Leaned hardest on the people closest to the customer — the CRM and sales team, who talk to users far more than design does — to pressure-test which agents mattered.
5. Built a **vibe-coded MVP first** (fastest to put in front of onboarded brands), with the **Figma-designed version in parallel** as feedback came in. Real reactions before real build. This saved company cost and dev time — validate cheap before building.
6. Shipped v1, tested with clients, kept iterating from feedback.

**Honest candor (good to say spoken, fine to say here):** AI moves fast, so they didn't have time to formally validate every single agent against its real-life human counterpart before shipping — the first MVP was built on general understanding and optimized post-launch. AI is new for everyone; there's no historical data on how users react, so the work is necessarily iterative: see where it fits, ship, watch, improve. Some agents are live; some are still being set up.

## WHAT'S LIVE

ShopOS is live with real enterprise clients — eight agents actively running real store work today. Sumedh designed the system end to end and built the frontend across onboarding, agent setup/customization, the Jobs/Kanban board, Mission Control, Cowork, and the multi-agent conversation, every state to near-production fidelity.

## THE 8 LIVE AGENTS (roster — Silicon Valley names, on the Lotto demo brand)

- **Big Head** — GEO & SEO. Prompt extraction, daily citation monitoring across ChatGPT/Perplexity/Gemini, GEO content. Prompt-first; no connectors required.
- **Erlich** — Social & Content. Hooks (5 variants min), content calendar, platform-native scripts. "Stop the scroll."
- **Jian-Yang** — Brand Intelligence. Reddit + review scraping, competitor price tracking, trend aggregation; feeds Monica & Gavin.
- **Gavin** — Performance Marketing. ROAS digests, fatigue detection, full-funnel audits, SKU quadrant labels; briefs Monica on fatigue.
- **Monica** — Creative Director. Image generation, Meta ad drafts, creative briefs; every output ties to a performance hypothesis.
- **Dinesh** — Email & CRM. Flow health, VIP segments, welcome series, campaign copy, post-purchase upsell flows.
- **Russ** — Finance & Growth. Spend/CPA/ROAS, contribution margin, credit-burn monitor, scaling briefs. "Every statement includes a number."
- **Richard** — Shopify Store Manager. Review sentiment + draft responses, CVR-per-product tracking, content publishing, A/B test deploy. Also builds/codes websites.

No separate orchestrator agent — on a given job, one of the eight steps up to coordinate.

## REFLECTIONS (Sumedh's, for "what did you learn / what would you do differently")

- **The interface problem was an org problem.** Came in expecting to design a chat. The real work was designing hierarchy you can see — who manages whom, who's working now, what needs you. The product only clicked once the team felt like a team.
- **Comprehension can outrank elegance.** The org view taught him to separate "the design I'm proudest of" from "the design that works." Sometimes the slightly-too-literal solution lets a user grasp a brand-new mental model in five seconds. He'd refine it, not remove it.
- **Designing trust is mostly designing the unhappy path.** Anyone designs the success screen. With agents running autonomously for hours, the empty states, the failures, and the "here's what I'm doing right now" moments are where trust is won or lost.
- **Building it made him design it better.** Shipping the frontend himself meant every interaction state he designed, he also had to make real — no handing off a happy-path mock and hoping. Design it, build it, feel where it breaks.

## TOOLS

Figma (design + the Mission Control file), Cursor (frontend build), Claude Code (build, via Figma MCP). Workflow: git-pull in Cursor, design with Figma MCP, build with Claude Code.

## CONNECTED CASE STUDY

Brand Memory is a separate, related case study (the system that remembers a brand's identity — voice, rules, past decisions). If asked, the agent can say it's a companion piece and point the recruiter to it, but should not invent its details here.
