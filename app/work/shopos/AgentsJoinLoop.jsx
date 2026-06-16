"use client";

// Watching, card 1: cycles through the four "Adding agents..." states
// exported from Figma 210:9504. Each state PNG holds the same baseline
// (sparkle + agent avatars on white circles), so we stack them and
// crossfade between them every 1.3s.
//
// States, in order:
//   1 — sparkle alone
//   2 — sparkle + 1 agent (Richard) sliding behind
//   3 — three agents lined up + sparkle on the right
//   4 — same lineup with a different avatar mix (visual variety)
//
// Reduced motion → freezes on state 3 (the most "full" frame), no
// timer, no crossfade.

import { useEffect, useState } from "react";

const STATES = [1, 2, 3, 4];
const CYCLE_MS = 1300;

export default function AgentsJoinLoop() {
  const [active, setActive] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setReduced(true);
      setActive(2);
      return;
    }
    const id = setInterval(() => {
      setActive((i) => (i + 1) % STATES.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-3">
      {/* Fixed-size stage so the "Adding agents..." text doesn't
          shift when the wider states cycle in. Width is sized for
          the widest state (3-4 avatars + sparkle = ~220x90 source). */}
      <div
        className="relative flex-shrink-0"
        style={{ width: 132, height: 54 }}
        aria-label="Animation of agents joining the thread"
        role="img"
      >
        {STATES.map((n, i) => (
          <img
            key={n}
            src={`/images/shopos/agents-state-${n}.png`}
            alt=""
            aria-hidden="true"
            className="absolute left-0 top-0 block h-full w-auto select-none"
            style={{
              opacity: i === active ? 1 : 0,
              transition: reduced ? "none" : "opacity 280ms ease",
            }}
            draggable={false}
          />
        ))}
      </div>
      <span className="text-[15px] italic text-white/90 md:text-[16px]">
        Adding agents
        <span className="inline-flex">
          <span className="ml-[2px]">.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </span>
    </div>
  );
}
