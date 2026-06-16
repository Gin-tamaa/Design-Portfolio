"use client";

// Watching, card 1: cycles through the four "Adding agents..."
// states from Figma 224:6051. Each avatar is an individual PNG pulled
// from a 210:9504 sub-node; stack + cycling are JSX, not a composite.
//
// Per-state visible agents (matches Figma 1:1):
//   state 0 — sparkle only
//   state 1 — sparkle + Richard (brown beard)
//   state 2 — sparkle + curly-brown (Richard leaves, curly joins)
//   state 3 — sparkle + curly + green-hair
//
// Each avatar is absolutely positioned in a slot; entering/leaving
// avatars cross-fade in place. Sparkle is always at the top of the
// z-stack so joining agents read as tucked behind it.
//
// Sizing is intentionally compact so the "Adding agents…" phrase
// next to the stack stays on a single line at every breakpoint —
// avatars 44px on small screens, 56px on md+.
//
// Reduced motion → snaps to state 3 (fullest frame); shimmer also
// collapses to a static white (see globals.css .shimmer-adding).

import { useEffect, useState } from "react";

const SPARKLE = { src: "/images/shopos/agent-sparkle.png", alt: "" };
const RICHARD = {
  src: "/images/shopos/agent-other.png",
  alt: "Richard avatar joining the thread",
};
const CURLY = {
  src: "/images/shopos/agent-richard.png",
  alt: "Curly-brown agent avatar joining the thread",
};
const GREEN = {
  src: "/images/shopos/agent-8bit.png",
  alt: "Green-hair agent avatar joining the thread",
};

const STATES = [
  { sparkle: 0, richard: null, curly: null, green: null }, // 0
  { sparkle: 0, richard: 1,    curly: null, green: null }, // 1
  { sparkle: 0, richard: null, curly: 1,    green: null }, // 2
  { sparkle: 0, richard: null, curly: 1,    green: 2    }, // 3
];

const CYCLE_MS = 1300;
const SIZE_MOBILE = 44;
const SIZE_DESKTOP = 56;
const OVERLAP_MOBILE = 14;
const OVERLAP_DESKTOP = 18;

const Z = { sparkle: 40, richard: 30, curly: 20, green: 10 };

function Avatar({ avatar, slot, zIndex, size, overlap }) {
  const visible = slot !== null;
  const left = slot !== null ? slot * (size - overlap) : 0;
  return (
    <div
      aria-hidden={!visible || avatar === SPARKLE}
      className="absolute top-0"
      style={{
        left,
        width: size,
        height: size,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(8px)",
        transition:
          "opacity 350ms ease, transform 350ms ease, left 350ms ease",
        zIndex,
      }}
    >
      <img
        src={avatar.src}
        alt={visible ? avatar.alt : ""}
        className="block h-full w-full select-none rounded-full"
        draggable={false}
      />
    </div>
  );
}

export default function AgentsJoinLoop() {
  const [active, setActive] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mqMotion.matches) {
      setActive(STATES.length - 1);
    }

    const mqDesktop = window.matchMedia("(min-width: 768px)");
    const syncBreakpoint = () => setIsDesktop(mqDesktop.matches);
    syncBreakpoint();
    mqDesktop.addEventListener("change", syncBreakpoint);

    let id = null;
    if (!mqMotion.matches) {
      id = setInterval(() => {
        setActive((s) => (s + 1) % STATES.length);
      }, CYCLE_MS);
    }
    return () => {
      mqDesktop.removeEventListener("change", syncBreakpoint);
      if (id) clearInterval(id);
    };
  }, []);

  const state = STATES[active];
  const size = isDesktop ? SIZE_DESKTOP : SIZE_MOBILE;
  const overlap = isDesktop ? OVERLAP_DESKTOP : OVERLAP_MOBILE;
  const stackWidth = 2 * (size - overlap) + size;

  // Park the text past the rightmost possible avatar slot so it never
  // shifts when an agent joins — even in state 0 the phrase sits where
  // it will eventually live in state 3.
  const textOffset = stackWidth + (isDesktop ? 36 : 24);

  return (
    <div className="flex items-center">
      <div
        className="relative flex-shrink-0"
        style={{ width: textOffset, height: size }}
        aria-label="Avatars of agents joining the thread"
        role="img"
      >
        <Avatar avatar={SPARKLE} slot={state.sparkle} zIndex={Z.sparkle} size={size} overlap={overlap} />
        <Avatar avatar={RICHARD} slot={state.richard} zIndex={Z.richard} size={size} overlap={overlap} />
        <Avatar avatar={CURLY}   slot={state.curly}   zIndex={Z.curly}   size={size} overlap={overlap} />
        <Avatar avatar={GREEN}   slot={state.green}   zIndex={Z.green}   size={size} overlap={overlap} />
      </div>
      <span
        className="shimmer-adding whitespace-nowrap leading-none"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          fontStyle: "normal",
          // Fluid size so the phrase always fits in the card next to
          // the avatar stack — never wraps to a second line at any
          // breakpoint.
          fontSize: "clamp(18px, 2.6vw, 30px)",
        }}
      >
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
