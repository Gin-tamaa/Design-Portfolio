"use client";

// Version 02 - Cards iteration: a 2-frame switcher between the
// Meet-the-Agents cards-grid view (frame index 0, default) and the
// Kanban-task-board view (frame index 1). The bullet content is baked
// into the frames, so the standalone bullet list above is omitted.
//
// State mapping:
//   active = 0 -> Cards-grid view (default, LEFT dot active).
//                 On the right rail the TOP callout ("Each agent a
//                 card...") reads as white/active; the BOTTOM
//                 callout ("Kanban Task Board lies separately") sits
//                 in the glass/clickable state.
//   active = 1 -> Kanban view (RIGHT dot active). The BOTTOM
//                 callout reads as white/active, the TOP callout
//                 sits in the glass/clickable state.
//
// Hotspots have fixed destinations: clicking the TOP callout always
// navigates to active=0 (the cards-grid view, where it's the active
// surface); clicking the BOTTOM callout always navigates to active=1
// (the kanban view, where it's the active surface). Whichever
// hotspot is currently sitting on top of a glass-style card is the
// only one with a hover lift; the other is already the active
// surface and gets cursor-default.
//
// Auto-cycle:
//   The view auto-cycles every 5s until the user touches any
//   switcher (callout hotspot OR carousel dot). After that, the
//   cycle is permanently cancelled for this session.

import { useEffect, useRef, useState } from "react";

const FRAMES = [
  {
    // index 0 = default, LEFT dot. TOP callout active.
    src: "/images/shopos/cards-v2-frame-2.png",
    alt: "v2 Cards iteration, default frame: Meet the Agents cards grid view; the right-side 'Each agent a card' callout reads as active.",
  },
  {
    // index 1, RIGHT dot. BOTTOM callout active.
    src: "/images/shopos/cards-v2-frame-1.png",
    alt: "v2 Cards iteration, second frame: Kanban Task Board view; the right-side 'Kanban Task Board lies separately' callout reads as active.",
  },
];

const AUTO_SWITCH_MS = 5000;

export default function CardsVersionSwitcher() {
  // Default = Cards-grid (index 0). Left dot active on first paint.
  const [active, setActive] = useState(0);
  // Flips true on any click; permanently cancels the auto-cycle.
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

  // The clickable / glass-style callout is whichever one is NOT the
  // currently-active surface.
  const topIsClickable = active !== 0;     // top is active when cards-grid showing
  const bottomIsClickable = active !== 1;  // bottom is active when kanban showing

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
      {/* Both frames stay mounted; the inactive one fades to 0 so the
          swap is a soft 500ms crossfade. */}
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

      {/* "Select the cards to switch in between them" instruction.
          Source PNGs are the clean Figma exports without the baked
          instruction text, so this React copy is the only one.
          14px Inter (~2px above the original baked 32px-on-3840 spec
          when scaled to typical display widths).
          pointer-events-none so it doesn't intercept hotspot clicks. */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute right-[2.5%] top-[3.5%] text-right text-[14px] font-normal leading-tight text-[#606060]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        Select the cards to switch in between them
      </p>

      {/* TOP right-side callout hotspot. Always navigates to active=0
          (Cards-grid). Position + size measured directly off the
          rendered frame (callout y ~37.9-46.8%, ~9% tall, ~22% wide,
          right edge ~2.5% from container right). */}
      <button
        type="button"
        onClick={() => select(0)}
        aria-label="Show the Meet the Agents cards grid view"
        aria-pressed={active === 0}
        className={`absolute right-[2.5%] top-[37%] h-[10%] w-[22%] rounded-2xl outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/70 ${
          topIsClickable
            ? "cursor-pointer hover:bg-white/10"
            : "cursor-default"
        }`}
      />

      {/* BOTTOM right-side callout hotspot. Always navigates to
          active=1 (Kanban view). Callout y ~50.6-62.1%, ~12% tall. */}
      <button
        type="button"
        onClick={() => select(1)}
        aria-label="Show the Kanban Task Board view"
        aria-pressed={active === 1}
        className={`absolute right-[2.5%] top-[50%] h-[13%] w-[22%] rounded-2xl outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-white/70 ${
          bottomIsClickable
            ? "cursor-pointer hover:bg-white/10"
            : "cursor-default"
        }`}
      />

      {/* Carousel dots. React-only since the source PNGs no longer
          carry the baked indicator. Active dot = wider white pill;
          inactive dot expands + brightens on hover. */}
      <div className="absolute bottom-[3.5%] left-1/2 flex -translate-x-1/2 items-center gap-2.5">
        {FRAMES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => select(i)}
            aria-label={`Switch to frame ${i + 1}`}
            aria-pressed={i === active}
            className={`h-2 cursor-pointer rounded-full outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/70 ${
              i === active
                ? "w-10 bg-white"
                : "w-2 bg-white/55 hover:w-4 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
