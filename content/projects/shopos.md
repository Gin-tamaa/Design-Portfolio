# ShopOS — Brief

ShopOS is an AI-agent operating system where a brand owner directs a team of
named AI agents — an entire marketing and ops department, staffed by agents
instead of hires. Sumedh designed the system and built the frontend in React.

## Role / team / timeline

- Role: Founding Product Designer + Design Engineer (React).
- Team: Founding team · engineers · Sumedh.
- Timeline: Mar 2026 – Present.
- Skills: Multi-agent UX, interaction design, design engineering.

## Context

By early 2026 every DTC brand had access to AI that could write a caption or
generate a product shot. None of it added up to running a store. A founder
still needed someone to own SEO, paid, email, numbers — and most small brands
can't hire one specialist per function, let alone eight. The gap wasn't
*capability*. It was *coordination*. Brands wanted a team that already knew
the store and got on with the work, not another chatbot to prompt.

## The solution

ShopOS lets a brand owner connect their tools once, and a roster of named
agents spins up to cover the whole store:

- **Gavin** — Performance / paid.
- **Monica** — Creative direction.
- **Jian-Yang** — Brand intelligence (reads the market).
- **Russ** — Finance & growth (watches the numbers).
- **Richard** — Shopify store manager (minds the store).
- Plus agents for **GEO & SEO**, **Social & Content**, **Email & CRM**, and
  **Brand Intelligence**.

Eight functions, eight teammates.

You don't prompt a model. You hand work to a team, the way you'd brief a
department. The flow: connect your tools → agents provision themselves → you
give them work → a **lead agent** pulls the right specialists into one thread,
reasons through it, and ships the output.

The home surface is **Mission Control**: the one screen where a founder sees
what their team is doing and what needs them.

## The hard part

The novel problem wasn't single-agent chat. It was one agent recruiting
specialists into a single conversation — reasoning out loud, running
multi-step "Arcs" (like a TOFU A/B test loop), and reporting back without the
user losing the thread.

It gets concrete fast. When **Gavin** (paid) detects a creative fatiguing, he
doesn't just flag it — he briefs **Monica** (creative), who generates
replacements, while **Jian-Yang** (brand intelligence) feeds both. The team
hands work to itself. The design job was to make that legible to a human
watching from the outside — who's leading, who just joined, what they're
doing right now — without drowning them in logs.

That orchestration UX was the real design problem. Everything else served it.

## Designing the agents — three iterations

### 01 — The card stack (first version)

Agents lived as a stack of cards: one card per function, each a tidy summary.

- Pros: Clean, scannable, mapped one-to-one with store functions.
- Cons: Felt like a feature list, not a team. No sense any of them were
  *your* agents.

### 02 — Personalization: name + `soul.md`

Every agent gets a name and a `soul.md` — a short persona file that defines
how it talks, what it prioritizes, the context it always carries.
- **Russ** (finance) opens his with: "Every statement includes a number."
- **Monica** (creative) opens hers with: "You have opinions."

Suddenly the card stack wasn't a catalog. It was *your* team, with your names
and your voices.

Pull quote (Sumedh): "The moment an owner renames an agent and writes its
soul, it stops being software and starts being staff."

### 03 — The bracketed org view (the real tradeoff)

Testing showed people couldn't always tell who reports to whom or which
agents work together on a given job. So a bracketed, org-chart-style view:
the **lead agent** at the top, specialists grouped beneath, work flowing
through the brackets.

- Pros: Comprehension jumped — people finally understood the
  lead-orchestrates-specialists model. The multi-agent thread became
  legible *before* you opened it.
- Cons (Sumedh's honest take): "I'm not sold on the bracketing UI. It reads
  like a flowchart, and brackets are a heavy visual metaphor for something
  that should feel alive. I kept it because the comprehension win was real
  and measured — users understood the org instantly with it and stumbled
  without it. I chose the version that taught users fastest over the version
  I found most elegant. Given another cycle, I'd keep the hierarchy it
  conveys and redesign how it's drawn — less bracket, more living team."

## Giving the team work — two entry points

- **Jobs / Kanban** — for people who think in tasks. Work moves across
  *Needs Attention → In Progress → Completed → Scheduled*.
- **Chat / Cowork** — for people who think in goals. State the outcome; a
  lead agent figures out who to recruit and what steps to run.

Both feed the same orchestration layer.

## Mission Control

A founder's morning used to be six tabs: Meta Ads, Shopify, the agency's
WhatsApp thread, a spreadsheet from last week. Mission Control replaces that
with a single morning check-in. It *reads and surfaces*; it never generates —
generation lives in Cowork. Two design rules held it together:

1. **Needs Attention is pinned at the top, capped at two or three items.**
   Every item names the agent who flagged it, the specific metric, what's
   already been done, and exactly one action — *Open in Cowork*. No vague
   "performance is down." If it can't be made specific and actionable, it
   doesn't surface.
2. **The SKU scatter chart was the standout.** Every product is plotted by
   Meta spend against Shopify revenue and sorted into four quadrants —
   *Scale, Untapped, Drain, Inactive*. The gap between where Meta spends and
   where Shopify makes money is exactly where value is hiding or bleeding.
   It turned a spreadsheet nobody opens into a glance you can't unsee.

Mission Control is the status surface; Cowork is the action surface. One
button bridges them.

## The orchestration thread

When a lead agent recruits specialists and runs a multi-step Arc, a lot
happens the user can't see. Design job: make that legible without burying
them in logs.

- **Reasoning states** ("Thoughts for 8s") that show the system working, not
  stalling.
- **Agents joining the thread** visibly — you watch Gavin pull Monica in,
  so the team assembles around your request in front of you.
- **Arcs** that expose the multi-step plan as it runs, not just the final
  output.
- **Completion notifications** for long-latency work, so hours-long jobs
  don't force users to sit and wait.

Every state — empty, loading, error, success — is designed, because an AI
team that occasionally fails silently isn't trustworthy. Trust was the whole
product.

## The system (in one line)

Goal in → Lead Agent reads it and opens one thread → Specialists join and
contribute → an Arc executes visibly step-by-step → Output lands back in
front of you with a record of how it got there.

## What shipped

ShopOS is live with real enterprise clients — **eight agents** actively
running real store work today. Sumedh designed the system end-to-end and
built the frontend in React: the full surface across onboarding, agent setup
and customization, the Jobs/Kanban board, Mission Control, Cowork, and the
multi-agent conversation, with every empty / loading / error / success state
built out to near-production fidelity.

## Reflection (what Sumedh learned)

1. **The interface problem was an org problem.** The real work was designing
   hierarchy you can see — who manages whom, who's working right now, what
   needs you. The product only clicked once the team felt like a team.
2. **Comprehension can outrank elegance.** The bracketed view taught the
   separation between "the design I'm proudest of" and "the design that
   works." Sometimes the slightly-too-literal solution is the one that lets
   a user understand a brand-new mental model in five seconds.
3. **Designing trust is mostly designing the unhappy path.** With autonomous
   agents running for hours, the empty states, the failures, and the
   "here's what I'm doing right now" moments are where trust is actually won
   or lost.
4. **Building it made me a better designer of it.** Shipping the React
   himself meant every interaction state designed, he also had to make real.

## Proof points (PENDING — DO NOT INVENT NUMBERS)

These four slots have no public data yet. If asked for any of them, say
"that's not public yet" and offer to talk about something else.

- PENDING: Which agents are used most, and how heavily.
- PENDING: One before → after (specialist hours → agent minutes).
- PENDING: One real client quote.
- PENDING: One metric the agents moved.

The only public number is: **8 agents** are live with real enterprise
clients.
