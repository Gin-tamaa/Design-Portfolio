"use client";

// Watching, card 1: cycles through four "Adding agents..." states
// from Figma 224:6051. Each agent and the sparkle are individual
// avatar PNGs (pulled from 210:9504 sub-nodes) — the stack and
// the cycling are pure JSX, not a baked composite.
//
// Stack layout (left → right): sparkle, then up to 3 agents joining
// behind it with a slight overlap. Sparkle sits on top via z-index
// so each new agent slides in from the right and reads as "joining".
//
// State 0: just sparkle
// State 1: sparkle + Richard (brown beard)
// State 2: + curly-brown agent
// State 3: + green-hair agent
//
// The "Adding agents…" phrase next to the stack uses .shimmer-adding
// (faded → bright white sweep, defined in globals.css).
//
// Reduced motion → freezes on state 3 (the fullest frame), shimmer
// also collapses to a static white (see globals.css).

import { useEffect, useState } from "react";

// avatars[0] is the sparkle (always visible). Indices 1..3 are
// added cumulatively as the state advances.
const AVATARS = [
  { src: "/images/shopos/agent-sparkle.png", alt: "Sparkle indicator" },
  { src: "/images/shopos/agent-other.png",   alt: "Richard avatar" },
  { src: "/images/shopos/agent-richard.png", alt: "Curly-brown agent avatar" },
  { src: "/images/shopos/agent-8bit.png",    alt: "Green-hair agent avatar" },
];

const CYCLE_MS = 1300;
const TOTAL_STATES = 4; // 0..3

export default function AgentsJoinLoop() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setActive(TOTAL_STATES - 1);
      return;
    }
    const id = setInterval(() => {
      setActive((s) => (s + 1) % TOTAL_STATES);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-4">
      {/* Avatar stack. Each circle is 56px on mobile, 64px on desktop.
          Sparkle sits at z=4 so it always reads "in front" of the
          joining agents. Subsequent agents fade + slide in from the
          right when active. */}
      <div className="flex items-center">
        {AVATARS.map((a, i) => {
          const visible = i <= active;
          const isSparkle = i === 0;
          return (
            <div
              key={a.src}
              className={[
                "relative h-14 w-14 md:h-16 md:w-16",
                i > 0 ? "-ml-4 md:-ml-5" : "",
              ].join(" ")}
              style={{
                zIndex: AVATARS.length - i, // sparkle highest
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(10px)",
                transition: "opacity 350ms ease, transform 350ms ease",
              }}
              aria-hidden={isSparkle ? "true" : !visible}
            >
              <img
                src={a.src}
                alt={visible && !isSparkle ? a.alt : ""}
                className="block h-full w-full select-none rounded-full"
                draggable={false}
              />
            </div>
          );
        })}
      </div>
      <span className="shimmer-adding text-[28px] font-light italic leading-none md:text-[36px]">
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
