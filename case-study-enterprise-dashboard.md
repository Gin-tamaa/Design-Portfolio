*Enterprise Dashboard · ShopOS · Product Design + Design Engineering · 2026*

# From a two-week WhatsApp loop to an eight-day review inside the product

How enterprise brands stopped rejecting 500 images to redo one, and started approving the 499 that were fine.

## TL;DR

| | |
|---|---|
| **Challenge** | Enterprise brands ran batches of 100 to 500 SKUs, but every approval and every "this one's wrong" happened over WhatsApp, and rejecting a single SKU sent the whole batch back to redo. |
| **Approach** | Fold the standalone enterprise dashboard into ShopOS, so brand context could make batches *better*, not just let people review them *faster*. |
| **Solution** | Per-SKU approval, in-product input vs output review with pinpoint annotations, batch creation inside the tool, and Brand Memory set up at onboarding. |
| **Impact** | Batch close 14 days → 8 to 9. ~20 to 25 fewer SKU rejections per 100. 2 of 10 clients now buy credits to self-serve. |

**My role:** Owned product design and the React frontend, end to end. Co-created the strategy with PM, engineering, and the account managers.  ·  **Timeline:** 2026  ·  **Team:** ShopOS founding team · PM · engineers · account managers · me

---

## The batch lived in a WhatsApp thread

An enterprise brand wants a summer collection: 100 to 500 product images, each SKU placed against a generated background. They brief the request to their account manager over WhatsApp. ShopOS generates the batch. Then the real work starts, and it also happens over WhatsApp: the client scrolls the outputs, flags the ones they dislike, types out what's wrong, waits.

The old enterprise dashboard sat next to all of this. It could *track* batches and *show* you what got generated. It couldn't let you act on any of it.

**Three holes made the work slow:**

- **No input to compare against.** You judged a generated image from memory of the garment, never side by side with it.
- **No feedback where the work lived.** "The print is off" was a typed WhatsApp message with no image attached to it.
- **All-or-nothing approval.** Reject one SKU and the *entire* batch went back to redo.

> Out of 500 images you could love 499 and lose all of them over one. For batches that already took two weeks to close, that was the most expensive button in the product.

---

## The dashboard wasn't broken. It was alone.

The easy read was "redesign the dashboard." The more useful read was that its biggest problem lived *outside* of it.

As a standalone tool, the dashboard could only ever make **review** faster. It could never make a batch **better**, because it had no access to the one thing that would: the brand's own context. So the decision wasn't to redesign it. It was to fold it into ShopOS.

**Compounding Context** — the core bet:

| | |
|---|---|
| **Standalone** | Every batch starts from zero. |
| **Integrated** | The brand's Brand Memory (voice, palette, rules, past decisions) is set up at onboarding and compounds with every batch, so each one starts smarter than the last. |

Better inputs make better outputs. Better outputs mean less to reject in the first place. The review fix was the visible part. The integration was the leverage.

---

## A batch isn't one decision. It's hundreds.

*The decision I'd defend hardest.*

All-or-nothing approval treated a 500-SKU batch as a single object. But a brand doesn't experience a batch that way. They experience 500 individual calls. So I decoupled the SKU from the batch.

| | |
|---|---|
| **Before** | Reject one SKU → the whole batch (up to 500) goes back to redo. |
| **After** | Approve and download the SKUs that work *now*. Only the rejected ones go to refine. |

One bad image costs one regeneration, not 499.

It sounds small and it reshaped the entire state model: every SKU now carries its own status (ready / approved / rejected / refining), the batch becomes the *sum* of them, and the interface had to make that legible at a glance. The variant rail tracks each SKU with a green or red dot; the batch view rolls them up.

*Addresses: the all-or-nothing rejection that wasted whole batches.*

---

## The feedback was trapped in chat. I built it into the image.

The old "redo it" was a vague paragraph in WhatsApp. I replaced it with three things that live on the work itself:

- **View Input.** The original garment image, side by side with the generated output, so a reviewer judges the work against its source instead of from memory. The old dashboard never showed the input at all.
- **Pinpoint annotations.** Drop a numbered pin on the exact spot and say what's wrong *there*. Multiple pins per image, each one specific. The vague paragraph becomes located, structured feedback the production team can act on without a follow-up question.
- **Structured batch rejection.** Whole-batch rejections require a reason (poor quality / incorrect background / incorrect masking / wrong output format) plus written detail, so "redo it" is never the entire instruction.

*Addresses: feedback that lived in chat, detached from the image it described.*

---

## What shipped

- A redesigned enterprise home: the old jargon stats replaced with a clean status read — *in progress / ready for review / approved / rejected*.
- A batch view tabbed by SKU state, with both bulk and per-SKU actions.
- A full-screen review surface: zoom, input vs output comparison, the annotation layer, per-SKU approve and reject.
- Partial download of approved SKUs, plus full-batch download.
- Batch creation inside the tool, instead of texting an AM.

All built in React and fit into the existing ShopOS ecosystem, so it reads as one product, not a bolted-on dashboard.

---

## What happened

*The numbers below are estimated from structured debriefs with the account managers who own these clients, not from instrumented analytics. I went to the people closest to the work for the most honest read available.*

- **Batch close time: 14 days → 8 to 9 days.** A batch that averaged two weeks to finalize now closes in a little over one. Less back-and-forth, faster decisions, outputs that needed less fixing.
- **~20 to 25 fewer SKU rejections per 100.** Brand Memory set up at onboarding meant outputs came back on-brand from the first batch, so there was less to send back. Compounding Context, showing up as a lower reject rate.
- **2 of 10 enterprise clients now buy credits** to generate on their own, for edits and one-off work beyond batches. A new revenue motion the standalone dashboard could never have created, because there was nothing else to spend credits on.

---

## What I'd do differently

I designed for a flywheel: credits pull enterprise clients into Spaces and Cowork, more surfaces mean more batches, more batches mean more credits. Two of ten clients have actually entered that loop. The motion is real, those two are spending beyond their batches, but I designed it as a system and it's behaving like an early signal. I still don't know whether the other eight haven't converted because of pricing, discovery, or simply timing, and the move from standalone to integrated didn't ship with the instrumentation to tell me. If I did it again, I'd ship the analytics alongside the feature, not behind it, so the flywheel could be read instead of estimated.

The enterprise dashboard used to be a window the brand looked through. Now it's a room the brand works inside, and because it shares walls with the rest of ShopOS, every batch they run makes the next one easier.
