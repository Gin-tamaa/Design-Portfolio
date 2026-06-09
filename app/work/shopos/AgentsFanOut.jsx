"use client";

// Thumbnail block: 8 agent portraits stacked at center on a warm gradient.
// As soon as the thumbnail is on screen the agents fan out horizontally
// from the center, staggered, on a smooth Apple-ish ease. Bidirectional —
// when the thumbnail leaves the viewport the agents collapse back to the
// stacked single-agent state, ready to fan out again on the next scroll
// pass. Reduced motion: collapses to the static expanded state, no transit.

import { useEffect, useRef, useState } from "react";

const AGENTS = [
  { src: "/images/agents-fan/agent-1-yellow.png",    bg: "#e5cd77", alt: "Agent 1" },
  { src: "/images/agents-fan/agent-2-pink.png",      bg: "#fbafdc", alt: "Agent 2" },
  { src: "/images/agents-fan/agent-3-green.png",     bg: "#1d9e75", alt: "Agent 3" },
  { src: "/images/agents-fan/agent-4-blue.png",      bg: "#8dbded", alt: "Agent 4" },
  { src: "/images/agents-fan/agent-5-purple.png",    bg: "#b993cd", alt: "Agent 5" },
  { src: "/images/agents-fan/agent-6-lightblue.png", bg: "#c0ebfb", alt: "Agent 6" },
  { src: "/images/agents-fan/agent-7-redblue.png",   bg: "#5971c9", alt: "Agent 7" },
  { src: "/images/agents-fan/agent-8-red.png",       bg: "#f56d6d", alt: "Agent 8" },
];

// Agent size at full fanned-out width. Scales down on smaller screens via
// the clamp() on the .agent class in CSS-in-JS (style attribute below).
const SIZE = 100;
// Step between adjacent agents when fanned out (≈ 25% overlap per Figma).
const STEP = 75;
const CENTER_INDEX = (AGENTS.length - 1) / 2;

export default function AgentsFanOut() {
  const ref = useRef(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Bidirectional. We use rootMargin to define a centered "trigger zone"
    // (middle ~60% of the viewport) — the frame has to actually sit in
    // that zone before the fan-out fires, so the animation doesn't burn
    // off-screen at the very moment the frame's top edge slides in.
    // Collapses back to stacked when it leaves the zone.
    const io = new IntersectionObserver(
      ([entry]) => {
        setExpanded(entry.isIntersecting && entry.intersectionRatio >= 0.65);
      },
      {
        threshold: [0, 0.35, 0.65, 1],
        rootMargin: "-15% 0px -15% 0px",
      }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-3xl"
      style={{ aspectRatio: "16 / 9" }}
    >
      {/* Warm gradient background (Figma node 119:4629 bg) */}
      <img
        src="/images/agents-fan/bg.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Agent row — absolutely positioned, centered, fans out via transform.
          Transform-based animation is GPU-accelerated; staggered delay gives
          a soft cascade as they spread from the center outward. */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ height: "100%" }}
      >
        <div className="relative" style={{ width: SIZE, height: SIZE }}>
          {AGENTS.map((agent, i) => {
            const offset = expanded ? (i - CENTER_INDEX) * STEP : 0;
            // Stagger from the center outward — middle agents move first
            // visually because they have the smallest distance to cover.
            const delay = Math.abs(i - CENTER_INDEX) * 45;
            return (
              <div
                key={agent.src}
                className="absolute top-0 left-0 overflow-hidden rounded-full border-[6px] border-white shadow-[0_4px_16px_-8px_rgba(0,0,0,0.25)]"
                style={{
                  width: SIZE,
                  height: SIZE,
                  background: agent.bg,
                  transform: `translateX(${offset}px)`,
                  transition: `transform 900ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms`,
                  zIndex: i + 1, // last agent on top in stacked state (matches Figma)
                  willChange: "transform",
                }}
              >
                <img
                  src={agent.src}
                  alt={agent.alt}
                  draggable={false}
                  className="pointer-events-none h-full w-full object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
