*ShopOS · "Agents" · Research · Product Design · Frontend · Mar 2026 – Present*

# From wearing eight hats to directing eight agents

How a solo store owner went from doing every job themselves to briefing a department of named AI agents, and watching them hand work to each other in one thread.

## TL;DR

| | |
|---|---|
| **Challenge** | A brand owner had AI that could write a caption or fake a product shot, but nothing that could *own* a function and run it. They were still personally on SEO, paid, email, reviews, and the numbers, all at once. |
| **Approach** | Don't build a smarter chatbot. Model the team that already existed in our building (a paid lead, a CRM manager, a creative director) and make agent-to-agent handoff legible to the human watching. |
| **Solution** | One AI team of named agents the founder briefs like a department: a task board for people who think in tasks, chat for people who think in goals, and Mission Control as the 60-second morning read. |
| **Impact** | Eight agents live with real enterprise clients, running real store work today. In a 15-day GEO pilot the agents took a brand from cited by zero AI engines to cited by all four. I designed the system end to end and built the frontend to near-production fidelity. |

**My role.** *Owned:* the research loop, end-to-end product design, and the shipped frontend (onboarding, agent setup, Kanban, Mission Control, Cowork, the multi-agent thread). *Co-created:* the agent roster and what each agent owns, with the founding team and our CRM/sales people. *Guided:* production handoff with engineers.

**Timeline:** Mar 2026 – present · **Team:** Founding team + engineers · **Tools:** Figma, Cursor, Claude Code

---

## A founder running a store is running eight jobs at once

By 2026, a brand owner had AI that could write a caption or generate a product shot. Useful, but it didn't run the store. They were still the one on SEO, on paid, on email, watching the numbers, answering reviews. One person wearing every hat, with no way to watch it all at once.

*Write a launch email · Generate a product shot · Run a paid campaign · Pull yesterday's ROAS · Write a product caption · Check store analytics · Reply to customers · Draft a video script · SEO audit · Post to social · Restock alerts · Send newsletter. Twelve jobs, one person.*

Then agents changed what was possible. Not another tool to open, but something that could own a function and run it relentlessly, around the clock, without being checked ten times a day. The opening wasn't a better image generator. It was the whole store, covered.

## This wasn't a chat problem. It was an org problem.

Plenty of products do single-agent chat. Nobody had a clean pattern for one agent recruiting specialists into a single conversation, reasoning out loud, handing work to itself, and reporting back without losing the human watching from outside.

That reframe is the whole project. The design challenge wasn't the prompt box; it was **Legible Orchestration**: making a team of autonomous agents *watchable*, so a founder can trust work they never personally checked. An AI team that fails silently isn't a team. Trust was the product.

## We didn't invent the team. We modeled it on our own.

The roles already existed in the building: a paid lead, a CRM manager, a creative director. So I built an internal MVP and ran it through our own team, each person testing the agent for the role they actually do. Their feedback shaped what each agent owned.

I leaned hardest on the people closest to the customer. Our CRM and sales team talk to users far more than design does, so I used them to pressure-test which agents mattered.

Then I validated cheap and fast: a vibe-coded MVP first, because it was quickest to put in front of onboarded brands, with the Figma-designed version built in parallel as feedback came in. Real reactions before real build.

*▢ Approach Process: Internal MVP → team feedback → user MVP → feedback → live. The validation loop shown end to end.*

## One AI team, eight functions, one place to direct them

Connect your tools once, and a roster of named agents spins up to cover the store. Gavin runs paid. Monica owns creative. Jian-Yang reads the market, Russ watches the numbers, Richard minds the store, with more on GEO, social, email, and brand intelligence.

You don't prompt a model. You brief a team, all at once in one chat, or one agent at a time.

*▢ Agent Roster / Mission Control: the named roster and Mission Control side by side, where the team gets briefed.*

## How do you make an agent feel like a teammate, not a tool?

Three versions. I'll be honest about all three.

**01 · Cards.** Each agent a tidy card. Clean, but it read like a feature list. Yours to *read*, not to *shape*.

*▢ Card Stack: each function a tidy card. Scannable, but it read as a feature list.*

**02 · Name + `soul.md`.** Every agent gets a name and a short persona file. Russ opens his with *"Every statement includes a number."* The catalog became *your* team.

*▢ soul.md Editor: name, persona, what it always carries. The screen that turns "a stock agent" into "your Russ who only talks in numbers."*

**03 · The org view.** People couldn't tell who reported to whom, so I added a bracketed org-chart view: lead agents up top, specialists grouped beneath, work flowing through the brackets.

*▢ Org View: lead agents at the top, specialists grouped beneath, work flowing through the brackets.*

## The tradeoff I'd redo

I'm not sold on how I drew the org view. It reads more like a flowchart than a living team, and I pushed back on it internally. I kept it because the comprehension win was real and measured: people understood the model instantly with it, and stumbled without it. I chose what taught users fastest over what I found most elegant. I'd keep the hierarchy and redraw how it's shown.

## Two doors into one team, depending on how you think

**Jobs / Kanban, for task thinkers.** Work moves across *Needs Attention → In Progress → Completed*. One task, or one a few agents pick up together.

**Chat / Cowork, for goal thinkers.** State the outcome; talk to one agent, or let a lead agent recruit the team.

Two views of one engine.

*▢ Kanban + Chat Side by Side: the two entry points to the same engine.*

## A founder's morning, in 60 seconds instead of six tabs

Mission Control replaces the morning tab-crawl with one check-in. It reads and surfaces; it never generates. Needs Attention is pinned at the top, capped at three items, each naming the agent, the metric, and one action. Below it, a chart sorts every product by where ad spend goes versus where revenue comes from, so the gaps surface at a glance.

*▢ Needs Attention: pinned at top, capped at three; each item names the agent, the metric, and one action.*
*▢ SKU Scatter: every product plotted by ad spend × revenue; gaps surface at a glance.*

## Making "thinking for 8 seconds" feel like progress, not a spinner

You watch Gavin pull Monica into the thread. Reasoning states show the work. Multi-step Arcs expose the plan as it runs. Long jobs notify you when they're done. Every state is designed: empty, loading, error, success. An AI team that fails silently isn't trustworthy. This is Legible Orchestration made concrete: the handoff happens in front of you, not behind a spinner.

*▢ Arc Execution: a multi-step Arc in flight: the plan, the current step, what's pending, who's working on what.*

## What shipped

Eight agents running real store work today, live with real enterprise clients. I designed the system end to end and built the frontend: onboarding, agent setup, the Kanban board, Mission Control, Cowork, and the multi-agent conversation, every state built to near-production fidelity.

*▢ Shipped Surfaces: onboarding, agent setup, Kanban, Mission Control, Cowork, multi-agent conversation.*

## What we're measuring, live and honest about it

The product is live and the agents are already moving real numbers. Here is the proof that exists today, then the bets still being instrumented. No dressed-up data.

**Real, today**

**8** agents live with real enterprise clients, running real store work.

**0 → 4.** In a 15-day GEO pilot for a denim DTC brand, the GEO agent took the brand from cited by *zero* AI engines to cited by *all four* (ChatGPT, Claude, Perplexity, Gemini). In plain terms: the brand went from invisible when a customer asks an AI, to present everywhere they might ask. Perplexity citations rose 7% to 13%, technical health 59% to 65%, with 20 articles published as an owned content hub. One brand, fifteen days, early and directional. But real, and run end to end by an agent.

**Still being instrumented**

**Goal:** specialist hours collapse into agent minutes.
**Signal:** founders stop opening the six tabs and brief the team instead.
**Metric:** hours run per agent, and the multiplier of specialist-hours saved. *(Instrumented, pending real data.)*

**Goal:** the team feels like a team, not a feature list.
**Signal:** clients refer to agents by name, unprompted.
**Metric:** client-confirmed lift on the function the agents own. *(Instrumented, pending real data.)*

*Client quote pending real confirmation: the kind of line that proves the team feels like a team.*

---

The roster shipped exactly as designed, and it runs real stores today. The durable idea underneath it isn't eight agents. It's that an autonomous team only earns trust when a human can watch it think. That's the pattern ShopOS now builds everything else on.

Curious how the orchestration thread actually behaves? [Say hello](https://www.sumedhkamble.com/about#contact) and I'll walk you through it.
