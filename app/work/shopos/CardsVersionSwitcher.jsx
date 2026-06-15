"use client";

// Version 02 - Cards iteration: a 2-frame switcher that flips between
// the Kanban-task-board view (frame 1) and the Meet-the-Agents cards
// view (frame 2). The bullet content is baked into the frames, so the
// standalone bullet list above is intentionally absent.
//
// State mapping:
//   active = 0 -> Frame 1 (Kanban view). On the right rail the
//                 BOTTOM callout reads as white/active (it describes
//                 the Kanban tab), and the TOP callout sits in the
//                 glass/inactive state.
//   active = 1 -> Frame 2 (Cards-grid view). The TOP callout reads
//                 as white/active (it describes the cards grid), and
//                 the BOTTOM callout is the glass/inactive one.
//
// So the hotspots have fixed destinations: clicking the TOP callout
// always goes to Frame 2; clicking the BOTTOM callout always goes to
// Frame 1. Whichever hotspot is currently sitting on top of a
// glass-style card is the only one with a hover lift; the other is
// already the active surface and gets cursor-default.
//
// Auto-cycle:
//   The view auto-cycles between frames every 5s until the user
//   touches any switcher (a callout hotspot OR a carousel dot).
//   After that, the cycle is permanently cancelled for this session.

import { useEffect, useRef, useState } from "react";

const FRAMES = [
  {
    src: "/images/shopos/cards-v2-frame-1.png",
    alt: "v2 Cards iteration, frame 1: Kanban Task Board view; the right-side 'Kanban Task Board lies separately' callout reads as active.",
  },
  {
    src: "/images/shopos/cards-v2-frame-2.png",
    alt: "v2 Cards iteration, frame 2: Meet the Agents cards grid view; the right-side 'Each agent a card' callout reads as active.",
  },
];

const AUTO_SWITCH_MS = 5000;

export default function CardsVersionSwitcher() {
  // Default to Frame 2 (Meet the Agents / cards grid) per design spec.
  const [active, setActive] = useState(1);
  // userInteracted flips true on any click. Once true, the auto-cycle
  // is permanently cancelled for the rest of the session.
  const [userInteracted, setUserInteracted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (userInteracted) return;
    intervalRef.current = setInterval(() => {
      setActive((i) => (i + 1) % FRAMES.length);
    }, AUTO_SWITCH_MS);
    return () => clearInterval(intervalRef.current);
  }, [userInteracted]);

  const select = (i) => {
    setActive(i);
    setUserInteracted(true);
  };

  // Which side is currently the clickable / glass-style one.
  const topIsClickable = active !== 1;     // top callout sits in glass state when frame 1 is showing
  const bottomIsClickable = active !== 0;  // bottom callout sits in glass state when frame 2 is showing

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
      {/* Both frames stay mounted; the inactive one fades to 0 so the
          swap is a soft 500ms crossfade rather than a hard cut. */}
      {FRAMES.map((f, i) => (
        <img
          key={f.src}
          src={f.src}
          alt={f.alt}
          width={3840}
          height={2160}
          className={`absolute inset-0 block h-full w-full object-cover transition-opacity duration-500 ${
            i === active ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      ))}

      {/* Top right-side callout hotspot. Always navigates to Frame 2
          (where the top callout reads as the active white card). When
          the user is already on Frame 2 this hotspot is the active
          one, so no hover lift; on Frame 1 it's the glass/clickable
          one and we soft-light it on hover so it reads as tappable. */}
      <button
        type="button"
        onClick={() => select(1)}
        aria-label="Show the Meet the Agents cards grid view"
        aria-pressed={active === 1}
        className={`absolute right-[2.5%] top-[33%] h-[19%] w-[20%] rounded-2xl outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/70 ${
          topIsClickable
            ? "cursor-pointer hover:bg-white/10"
            : "cursor-default"
        }`}
      />

      {/* Bottom right-side callout hotspot. Always navigates to Frame 1. */}
      <button
        type="button"
        onClick={() => select(0)}
        aria-label="Show the Kanban Task Board view"
        aria-pressed={active === 0}
        className={`absolute right-[2.5%] top-[56%] h-[19%] w-[20%] rounded-2xl outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/70 ${
          bottomIsClickable
            ? "cursor-pointer hover:bg-white/10"
            : "cursor-default"
        }`}
      />

      {/* Invisible click hotspots over the baked-in carousel indicator.
          The dots themselves stay rendered in the source image so we
          don't end up with two visible carousels. These transparent
          buttons just sit on top of where the dots are drawn and
          handle clicks (the active-state visual swap happens via the
          underlying image change). */}
      <div className="pointer-events-none absolute bottom-[2%] left-1/2 flex -translate-x-1/2 items-center gap-3">
        {FRAMES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => select(i)}
            aria-label={`Switch to frame ${i + 1}`}
            aria-pressed={i === active}
            className="pointer-events-auto h-6 w-14 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          />
        ))}
      </div>
    </div>
  );
}
