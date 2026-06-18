# Enterprise Dashboard — project brief (chat agent source of truth)

This file is the ONLY source of facts about the Enterprise Dashboard project. If a question can't be answered from this file, say so plainly rather than inventing detail.

## One-liner

A redesign and platform integration: ShopOS's standalone enterprise dashboard was folded into the main product, turning a two-week WhatsApp review loop into an eight-day in-product review with per-SKU approval, in-product feedback, and brand context that compounds.

## Who it's for

Enterprise / large DTC brands running bulk image batches of 100 to 500 SKUs through ShopOS, each SKU placed against a generated background. The people who feel it: the brand's reviewers, ShopOS account managers (AMs), and the production / QA team that fixes outputs.

## The problem (before)

- Bulk batch requests were briefed to an AM over WhatsApp.
- ShopOS generated the batch, then the entire review loop also happened over WhatsApp: client flagged what they disliked, typed feedback, waited, production turned it around.
- The OLD enterprise dashboard could only track batches and view generated images. It had:
  - No way to compare a generated image against its input (the garment / source image).
  - No way to leave feedback in-product (feedback lived in WhatsApp).
  - All-or-nothing approval: rejecting ONE SKU sent the entire batch back to redo. Loving 499 of 500 and losing all of them over 1 was a real, expensive failure mode.
- Batches averaged ~14 days (two weeks) to close.

## The thesis / reframe

The dashboard's biggest problem lived OUTSIDE the dashboard. As a standalone tool it could only make review faster; it could never make a batch better, because it had no access to brand context. So the decision was to integrate it into ShopOS rather than redesign it in isolation.

**Coined concept: "Compounding Context."** In a standalone tool every batch starts from zero. Integrated, the brand's Brand Memory (voice, palette, rules, past decisions) is set up at onboarding and compounds with every batch, so each one starts smarter than the last. Better inputs → better outputs → less to reject.

## Key design decisions

1. **Per-SKU approval (the headline judgment beat).** Decoupled the SKU from the batch. Approve the ones that work and download them immediately; only rejected SKUs go to refine. A batch stops being atomic. Reshaped the whole state model: every SKU carries its own status (ready / approved / rejected / refining); the batch is the sum of them. A variant rail tracks each SKU with a green/red status dot.
2. **In-product review, replacing the WhatsApp feedback loop:**
   - **View Input** — side-by-side of the original garment/input image vs the generated output. The old dashboard never showed the input at all.
   - **Pinpoint annotations** — drop numbered pins on the exact spot of an image and say what's wrong there; multiple pins per image, each specific.
   - **Structured batch rejection** — whole-batch rejection requires a reason (poor quality / incorrect background / incorrect masking / wrong output format) plus written detail, so "redo it" is never the whole instruction.
3. **Brand Memory at onboarding** — set up when a client is onboarded, so outputs are on-brand from the first batch. This is the mechanism behind the lower rejection rate.
4. **Batch creation in-product** — create a batch inside the tool instead of texting an AM.
5. **Ecosystem fit** — integration gives enterprise clients credits and access to the full range of Spaces (many more batch types and variations than the single lifestyle style the old dashboard allowed) and Cowork. Built to read as one product, not a bolted-on tool.

## What shipped

Redesigned enterprise home with a clean status read (in progress / ready for review / approved / rejected), replacing the old jargon stats. Batch view tabbed by SKU state with bulk + per-SKU actions. Full-screen review surface: zoom, input vs output comparison, annotation layer, per-SKU approve/reject. Partial download of approved SKUs plus full-batch download. Batch creation in-product. Built in React, fit into the existing ShopOS ecosystem.

## Impact (IMPORTANT: these are AM-estimated, not instrumented)

All three numbers are estimated from structured debriefs with the account managers who own these clients — qualitative validation from the people closest to the work, NOT analytics-instrumented metrics. Always present them this way. Never imply they came from a dashboard or A/B test.

- Batch close time: **14 days → 8 to 9 days**.
- **~20 to 25 fewer SKU rejections per 100**, attributed to Brand Memory being set up at onboarding (outputs on-brand from the start).
- **2 of 10 enterprise clients now buy credits** to self-serve beyond batches (edits, one-off work) — a new revenue motion.

## Honest residue / open question

Designed a flywheel (credits → Spaces/Cowork → more batches → more credits). Only 2 of 10 clients have entered it so far. The motion is real but behaving like an early signal, not a proven system. Unknown whether the other 8 haven't converted due to pricing, discovery, or timing — the integration didn't ship with the instrumentation to tell. Lesson: ship analytics alongside the feature, not behind it.

## Role

Owned product design AND the React frontend, end to end (design + design engineering, so it ships faster — same dual lens as the Mission Control case study). Co-created the integration strategy with PM, engineering, and the AMs.

## Hard constraints for the agent

- **Never name the real enterprise brands.** If a brand must be referenced, use "an apparel client," "a footwear client," etc. Do not confirm or guess brand names even if asked.
- **Never present the impact numbers as instrumented metrics.** Always frame as AM-estimated from debriefs.
- **Keep agents out of this story** unless the user explicitly asks. This case is about the dashboard integration, not the agent roster.
- This is a SEPARATE project from Mission Control (the agents dashboard). They are different surfaces in the same product.
