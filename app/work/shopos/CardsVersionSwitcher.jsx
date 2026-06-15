"use client";

// Version 02 - Cards iteration: a 2-frame switcher that flips between
// the Kanban-task-board view (frame 1) and the Meet-the-Agents card
// view (frame 2). The bullet content for this iteration is baked into
// the Figma frames themselves, so the standalone bullet list above is
// intentionally absent (matches the v1 Kanban MVP treatment).
//
// Behaviour:
//   - Auto-switch every 5s while no user interaction has happened.
//   - The two right-side cards in the image are clickable hotspots
//     (transparent buttons positioned absolutely over them) — clicking
//     either swaps to the corresponding frame and cancels auto-switch.
//   - The dot indicator at the bottom is also clickable; same effect.
//   - The visible active-state styling (which card is highlighted,
//     which dot is wider) is baked into each frame export, so the
//     React state only needs to drive the image swap.

import { useEffect, useRef, useState } from "react";

const FRAMES = [
  {
    src: "/images/shopos/cards-v2-frame-1.png",
    alt: "v2 Cards iteration, frame 1: Kanban Task Board view; the 'Each agent a card' callout is highlighted on the right.",
  },
  {
    src: "/images/shopos/cards-v2-frame-2.png",
    alt: "v2 Cards iteration, frame 2: Meet the Agents card grid view; the 'Kanban Task Board lies separately' callout is highlighted on the right.",
  },
];

const AUTO_SWITCH_MS = 5000;

export default function CardsVersionSwitcher() {
  const [active, setActive] = useState(0);
  // userInteracted flips true on any click. Once true, the auto-cycle
  // is permanently cancelled for the rest of the session (the page).
  const [userInteracted, setUserInteracted] = useState(false);
  const intervalRef = useRef(null);

  // Auto-cycle every 5s until the user touches a switcher.
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

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
      {/* Both frames are always in the DOM, the inactive one is faded
          out so the swap is a soft crossfade rather than a hard cut. */}
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

      {/* Clickable hotspot over the TOP right-side callout. The visual
          highlight in the image is what shows the active state; this
          button is intentionally transparent. */}
      <button
        type="button"
        onClick={() => select(0)}
        aria-label="Show the Kanban Task Board frame"
        aria-pressed={active === 0}
        className="absolute right-[2.5%] top-[33%] h-[19%] w-[20%] cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      />
      {/* Clickable hotspot over the BOTTOM right-side callout. */}
      <button
        type="button"
        onClick={() => select(1)}
        aria-label="Show the Meet the Agents card grid frame"
        aria-pressed={active === 1}
        className="absolute right-[2.5%] top-[56%] h-[19%] w-[20%] cursor-pointer rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      />

      {/* Carousel-dot hotspots. The dot indicator is part of the image,
          so the React buttons here are invisible click targets sitting
          on top of the rendered dots. */}
      <div className="absolute bottom-[4%] left-1/2 flex -translate-x-1/2 items-center gap-2">
        {FRAMES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => select(i)}
            aria-label={`Switch to frame ${i + 1}`}
            aria-pressed={i === active}
            className="h-4 w-10 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          />
        ))}
      </div>
    </div>
  );
}
