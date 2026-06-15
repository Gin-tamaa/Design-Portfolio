*ShopOS · "Mission Control" · Research · Product Design · Frontend · Mar 2026 – Present*

# From wearing eight hats to directing eight agents

How an under-resourced brand went from doing every job by hand to directing a department of named AI agents that hand work to each other in real time.

## TL;DR

| | |
|---|---|
| **Challenge** | A brand had AI that could write a caption or fake a product shot, but nothing that could *own* a function and run it. Someone was still personally on SEO, paid, email, reviews, and the numbers, all at once. |
| **Approach** | Don't build a smarter chatbot. Model the team that already existed in our building, then design one surface where a brand can see that team, brief it, and watch it work. |
| **Solution** | Mission Control: a single screen that opens on your team, lets you shape and brief any agent, surfaces only what needs you, and shows the work happening live. |
| **Impact** | Eight agents live with 10+ enterprise brands. In a 15-day GEO pilot, the agents took a brand from cited by zero AI engines to cited by all four. Designed end to end, frontend built to near-production fidelity. |

**My role.** *Owned:* research loop, end-to-end product design, the shipped frontend (onboarding, agent setup, Kanban, Mission Control, Cowork, the multi-agent thread). *Co-created:* the agent roster and what each agent owns. *Guided:* production handoff with engineers.

**Timeline:** Mar 2026 – present · **Team:** Founding team + engineers · **Tools:** Figma, Cursor, Claude Code

---

## A brand running a store is running eight jobs at once

By 2026, a brand had AI that could write a caption or generate a product shot. Useful, but it didn't run the store. Someone was still on SEO, on paid, on email, watching the numbers, answering reviews. Every hat worn at once, with no way to watch it all.

*Launch email · product shot · paid campaign · yesterday's ROAS · caption · analytics · customer replies · video script · SEO audit · social post · restock alerts · newsletter.*

Then agents changed what was possible. Not another tool to open, but something that could own a function and run it around the clock. The opening wasn't a better image generator. It was the whole store, covered.

## This wasn't a chat problem. It was an org problem.

*Single-agent chat is solved. Nobody had a pattern for one agent recruiting specialists into a conversation, reasoning out loud, and reporting back without losing the human watching.*

That reframe is the whole project. The challenge wasn't the prompt box. It was **Legible Orchestration**: making a team of autonomous agents *watchable*, so a brand can trust work it never personally checked. An AI team that fails silently isn't a team. Trust was the product, and the rest of this is how one screen earns it.

## We didn't invent the team. We modeled it on our own.

*The roles already existed in our building. I built the team on people we had, then pressure-tested it on the ones closest to the customer.*

- Modeled each agent on a real role: paid lead, CRM manager, creative director
- Built an internal MVP, ran it through our own team, each person testing the agent for the job they actually do
- Leaned hardest on CRM and sales, the people closest to users, to pressure-test which agents mattered
- Validated cheap: a vibe-coded MVP in front of onboarded brands first, the Figma version built in parallel as feedback came in

*▢ Approach loop: internal MVP → team feedback → user MVP → feedback → live.*

---

## The product, the way you actually move through it

*Built for founders, but the founder rarely sits in it all day. A founder buys a super team for the org; the brand's own marketing, CRM, and ops people run it, each working the agents they own.*

The walk below is that surface, in the order you move through it: meet the team → shape and brief an agent → watch the work → read what needs you. Each screen carries the one decision that earned it.

## First, you meet your team

*Mission Control opens on the team, not a prompt box. Showing a team took three iterations, each one killing the last's confusion.*

**01 · Kanban MVP** → *what not to build*
- Agents down the left, tasks in Kanban columns on the right
- Couldn't tell an agent from a task, or what any agent owned
- No connector path: tools were buried in settings, nothing nudged you
- Red team: "this doesn't look like an agent experience"

*▢ v1 wireframe: agents crammed left, tasks right, no line between who works and what the work is.*

**02 · Cards + onboarding** → *closer*
- Each agent a card: who it is, what it can do, the jobs it runs
- Onboarding pulls connectors upfront, the team unlocks the moment you connect
- Feedback turned positive, new gap surfaced: "we still don't know what the agents *are*, or where each fits"

*▢ Cards view: each agent legible on its own card; connectors unlocked in onboarding.*

**03 · Org view** → *shipped*
- Orchestrator at top, five lifecycle stages across, specialists grouped beneath each
- The proud move: the brand's own name sits at the top, so it reads "you run this team," not "the software has a manager"

*▢ Org view: brand-as-orchestrator, branching into Discover / Acquire / Convert / Retain / Grow.*

## The tradeoff I'd redo

I went back and forth on the org view. A lifecycle funnel is a heavy metaphor for something that should feel alive, and I worried it read too literal. I kept it because the comprehension win was real and measured: people understood the model instantly with it, and stumbled without it. I chose what taught users fastest over what I found most elegant. I'd keep the hierarchy and keep refining how it's drawn.

## Then you open an agent, and make it yours

*Click any agent and it expands. This is where a stock agent becomes staff.*

- Inside: who it is, the jobs it runs, its connectors, and its editable `soul.md`
- `soul.md` is a short persona file you name and write. Russ opens his with *"Every statement includes a number."* One line, and he answers differently forever
- From the same panel: chat with the agent, or hand it a job

*▢ Agent panel: name, character, jobs, connectors, the soul.md editor, with Chat and Assign right there.*

## Two doors into one team

*Same engine, two entry points. You brief the way your head already works.*

- **Chat / Cowork**, for goal thinkers: state the outcome, talk to one agent or let the orchestrator recruit the team into one thread
- **Jobs / Kanban**, for task thinkers: work moves *Needs Attention → In Progress → Completed*, tracked in the Tasks tab for bigger pieces

*▢ Cowork + Kanban side by side: two views of one orchestration engine.*

## Then you watch the team think

*Legible Orchestration, made into pixels. Assign a goal and you get a window, not a spinner.*

- Watch one agent pull another into the thread when work demands it
- Reasoning states ("thinking for 8s") show the work happening
- Multi-step Arcs expose the plan as it runs, not just the result
- Every state designed: empty, loading, error, success. A team that fails silently can't be trusted

*▢ Orchestration thread: an Arc in flight, the plan, the current step, and who is working it.*

## What needs you, in 60 seconds instead of six tabs

*Same surface, scrolled down. Above this sits the org view you already met; below it, Mission Control does the one job a tab-crawl never could: tell you what needs a human.*

- **Needs Attention**, pinned and capped at three: each item names the agent, the metric, and one action. Never a vague "performance is down"
- **Activity**: the live feed of what each agent is doing right now, in plain language, the moment they do it

*▢ Needs Attention: pinned, capped at three, agent + metric + action.*
*▢ Activity feed: each agent's current move, in plain language, as it happens.*

---

## What shipped

*Eight agents running real store work today, live with 10+ enterprise brands. Designed end to end, frontend built across the full surface.*

- Onboarding, agent setup, the org view, the agent panels
- Cowork, the multi-agent thread, the Kanban board
- Needs Attention and Activity, every state to near-production fidelity

*▢ Shipped surfaces: onboarding, agent setup, org view, agent panel, Cowork, Kanban, Mission Control.*

## What we're measuring, live and honest about it

*The product is live and already moving real numbers. Here's the proof that exists today, then the bets still being instrumented. No dressed-up data.*

**Real, today**
- **8** agents live with 10+ enterprise brands, running real store work
- **0 → 4** AI engines: in a 15-day GEO pilot for a denim DTC brand, the GEO agent took the brand from cited by *zero* engines to cited by *all four* (ChatGPT, Claude, Perplexity, Gemini). Perplexity citations 7% → 13%, technical health 59% → 65%, 20 articles published. One brand, fifteen days, early and directional, but real and run end to end by an agent

**Still being instrumented**
- 🎯 **Goal:** specialist hours collapse into agent minutes · 📢 **Signal:** brands stop opening six tabs and brief the team instead · 📊 **Metric:** hours run per agent, specialist-hours saved *(pending real data)*
- 🎯 **Goal:** the team feels like a team · 📢 **Signal:** clients name agents unprompted · 📊 **Metric:** client-confirmed lift on the owned function *(pending real data)*

*Client quote pending real confirmation: the line that proves the team feels like a team.*

---

The roster shipped as designed, and runs real stores today. The durable idea underneath it isn't eight agents or one dashboard. It's that an autonomous team only earns trust when a human can watch it think, and that a single surface can carry the whole arc from meeting your team to seeing what needs you. That's the pattern ShopOS now builds everything else on.

Curious how the orchestration thread actually behaves? [Say hello](https://www.sumedhkamble.com/about#contact) and I'll walk you through it.
