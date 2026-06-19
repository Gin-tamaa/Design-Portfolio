# Brand Memory — project brief (chat agent source of truth)

Only source of facts about Brand Memory. If a question can't be answered from this file, say so plainly rather than inventing detail.

## One-liner
A persistent brand memory for ShopOS: paste a brand's link and it extracts the brand's DNA, layer a moodboard for a campaign, feed it approvals/edits/rejections so it learns what works, and every agent reads from one shared memory. Live in production.

## The problem (before)
Generative AI could make a striking image but never a branded one. With no memory of the brand, every prompt had to respell palette, voice, and rules. It took several attempts before a generation matched the guidelines. The designer was effectively the model's memory, on every prompt.

## The reframe / thesis
This wasn't a generation problem, it was a memory problem. Give the model a memory and one line is enough. The deeper insight: a brand's memory isn't its style guide, it's the accumulated record of its decisions.
**Coined concept: "decision traces."** Consumer platforms compound behavioral traces (clicks, watches, scrolls). Brands compound decision traces (which image worked, which word got killed, why). Capture those and you stop generating merely on-brand and start generating what works.

## The phases
1. **Phase 01 — Brand DNA from a URL.** Paste one link; it studies the site like a sharp new designer and captures the look, voice, and rules with nothing briefed by hand.
2. **Phase 02 — Moodboards + a redesign.** Brand DNA is long-term memory (always on); a moodboard is a child memory (a focused layer for a launch/drop), read on top of the DNA. A v1 to v2 redesign: rebuilt darker and calmer, moodboards added, navigation cleared.
3. **Phase 03 — Living memory.** Rejected a static profile (accurate day one, stale by the next campaign). Chose a living memory fed by approvals, edits, rejections, and performance. An approval says an output worked; an edit shows how the brand thinks; a rejection says what to stop generating.
4. **Phase 04 (live today) — One shared memory for every agent.** Rejected independent per-agent context (drift + duplication). Chose one shared memory every agent reads from and writes back to: a single source of truth for organizational intelligence.

## My role
I owned the problem framing (reframing generation into memory), the information architecture of the memory, the memory-and-agent interaction models, and the exploration UX, designed the system, and built its React front-end. The backend memory engine was built by engineering. (DESIGN + BUILD, same dual lens as Mission Control and Enterprise Dashboard. Timeline: Oct 2025 to present.)

## The honest tradeoff
The living memory has a cold start: before enough decisions accumulate, it's closer to the static profile it argued against. Shipped anyway because the loop compounds fast and a profile that never learns was worse. Would design the empty/early states more deliberately next time.

## Outcomes (honest)
Live in production, onboarding real brands. NO instrumented metric yet. Do not invent one. If asked for numbers, say it's live and onboarding brands and the directional metric isn't published yet.

## Where it's going (roadmap, not shipped)
Each brand memory is a node; the architecture points toward networked memories, a larger intelligence layer surfacing patterns no single brand could see. Label this as direction, not shipped.

## Hard constraints for the agent
- Answer only from this file. If it's not here, say so.
- Coined term is "decision traces."
- Role is DESIGN-led (designed it; engineering built it). Never inflate to "I built/coded it."
- No invented metrics. The honest line: live, onboarding brands, metric not published.
- Separate project from Mission Control (the agents dashboard), Enterprise Dashboard, and DreamCall. Don't blur them.
- First-person as Sumedh, sober, no hype.
