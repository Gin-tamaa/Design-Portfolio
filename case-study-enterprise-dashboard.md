*Enterprise Dashboard · ShopOS · Product Design + Design Engineering · 2026*

# From a two-week WhatsApp loop to an eight-day review inside the product

How enterprise brands stopped rejecting 500 images to redo one, and started approving the 499 that were fine.

## TL;DR

| | |
|---|---|
| **Challenge** | Enterprise brands ran batches of 100 to 500 SKUs, but every approval and every "this one's wrong" happened over WhatsApp, and rejecting a single SKU sent the whole batch back to redo. |
| **Approach** | Fold the standalone enterprise dashboard into ShopOS, so brand context could make batches *better*, not just let people review them *faster*. |
| **Solution** | Per-SKU approval, in-product input vs output review with pinpoint annotations, batch creation inside the tool, and Brand Memory set up at onboarding. |
| **Impact** | Batch close time 14 days → 8 to 9. Roughly 20 to 25 fewer SKU rejections per 100. 2 of 10 enterprise clients now buy credits to self-serve. |

**My role:** Owned product design and the React frontend, end to end. Co-created the strategy with PM, engineering, and the account managers.  ·  **Timeline:** 2026  ·  **Team:** ShopOS founding team · PM · engineers · account managers · me

## The batch lived in a WhatsApp thread

An enterprise brand wants a summer collection: a batch of 100 to 500 product images, each SKU placed against a generated background. They brief the request to their account manager over WhatsApp. ShopOS generates the batch. Then the real work starts, and it also happens over WhatsApp: the client scrolls the outputs, flags the ones they don't like, types out what's wrong, waits, and the production team turns it around.

The old enterprise dashboard sat next to all of this. It could track batches and show you what got generated. What it couldn't do was let you act on any of it. There was no way to compare a generated image against the garment it came from. No way to leave feedback where the work actually lived. And one rule made everything else worse: approval was all or nothing.

Reject a single SKU and the entire batch went back to redo. Out of 500 images you could love 499 and lose all of them over one. For batches that already took two weeks to close, that was the most expensive button in the product.

## The dashboard wasn't broken. It was alone.

The easy read was "redesign the dashboard." The more useful read was that the dashboard's biggest problem lived outside of it. As a standalone tool, it could only ever make *review* faster. It could never make a batch *better*, because it had no access to the one thing that would: the brand's own context.

So the decision wasn't to redesign the dashboard. It was to fold it into ShopOS. Once an enterprise account lives inside the product, its Brand Memory — voice, palette, rules, past decisions — gets set up at onboarding and compounds with every batch. I called this **Compounding Context**: in a standalone tool, every batch starts from zero; integrated, each one starts smarter than the last. Better inputs make better outputs, and better outputs mean there is less to reject in the first place.

Integration also unlocked things a separate dashboard structurally never could. Brands could create a batch inside the product instead of texting an AM. They could reach past the single lifestyle style the old dashboard allowed into the full range of Spaces, with far more batch types and variations. And they could spend enterprise credits on work of their own. The review fix was the visible part. The integration was the leverage.

## A batch isn't one decision. It's hundreds.

All-or-nothing approval treated a 500-SKU batch as a single object: approve it, or send the whole thing back. But a brand doesn't experience a batch that way. They experience 500 individual calls.

So I decoupled the SKU from the batch. Approve the ones that work and download them now; only the rejected SKUs go back to refine. The batch stops being atomic. One bad image costs you one regeneration, not 499.

This sounds small and it reshaped the entire state model. Every SKU now carries its own status — ready, approved, rejected, refining — the batch becomes the sum of them, and the interface had to make that legible at a glance without drowning the operator in states. The variant rail tracks each SKU with a green or red dot; the batch view rolls them up.

## Moving the feedback out of WhatsApp

The other thing trapped in chat was the feedback itself. "The print is off and the color isn't right" used to be a typed message with no image attached to it. I brought it into the product as two things.

First, a side-by-side. **View Input** puts the original garment image next to the generated output, so a reviewer judges the work against its source instead of from memory. The old dashboard never showed the input at all.

Second, **pinpoint annotations**. Drop a numbered pin on the exact spot of the image and say what's wrong there, with multiple pins per image, each one specific. The vague WhatsApp paragraph becomes structured, located feedback the production team can act on without a single follow-up question. Whole-batch rejections follow the same logic with required reasons — poor quality, incorrect background, incorrect masking, wrong output format — so "redo it" is never the entire instruction.

## What shipped

A redesigned enterprise home that replaced the old jargon-heavy stats with a clean status read (in progress, ready for review, approved, rejected). A batch view tabbed by SKU state with both bulk and per-SKU actions. A full-screen review surface with zoom, the input vs output comparison, the annotation layer, and per-SKU approve and reject. Partial download of the approved SKUs as well as the full batch. Batch creation inside the tool. All of it built in React and fit into the existing ShopOS ecosystem, so it reads as one product rather than a bolted-on dashboard.

## What happened

The numbers below are estimated from structured debriefs with the account managers who own these clients, not from instrumented analytics. I went to the people closest to the work for the most honest read available.

- **Batch close time: 14 days → 8 to 9 days.** A batch that averaged two weeks to finalize now closes in a little over one. Less back-and-forth, faster decisions, and outputs that needed less fixing on the production side.
- **Roughly 20 to 25 fewer SKU rejections per 100.** Because Brand Memory was set up at onboarding, outputs came back on-brand from the first batch, so there was simply less to send back. Compounding Context, showing up as a lower reject rate.
- **2 of 10 enterprise clients now buy credits** to generate on their own, for edits and one-off work beyond their batches. A new revenue motion the standalone dashboard could never have created, because there was nothing else to spend credits on.

## What I'd do differently

I designed for a flywheel: credits pull enterprise clients into Spaces and Cowork, more surfaces mean more batches, more batches mean more credits. Two of ten clients have actually entered that loop. The motion is real — those two are spending beyond their batches — but I designed it as a system and it's behaving like an early signal. I still don't know whether the other eight haven't converted because of pricing, discovery, or simply timing, and the standalone-to-integrated move didn't ship with the instrumentation to tell me. If I did it again, I'd ship the analytics alongside the feature, not behind it, so the flywheel could be read instead of estimated.

The enterprise dashboard used to be a window the brand looked through. Now it's a room the brand works inside, and because it shares walls with the rest of ShopOS, every batch they run makes the next one easier.
