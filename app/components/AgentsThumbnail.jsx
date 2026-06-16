"use client";

// Homepage Carousel thumbnail for the ShopOS Agents case study.
// Replicates the hero composition on /work/shopos (sky bg, four
// corner brackets, "Agents" wordmark, agents transparent PNG) but
// drives a staged on-enter reveal:
//
//   1. Sky background is already there when the card mounts
//   2. "Agents" wordmark drops in from the top
//   3. Brackets follow a beat later, also from the top
//   4. Agents PNG rises in from the bottom
//
// IntersectionObserver triggers the reveal once the card enters
// the viewport. Reduced motion → all layers visible immediately.

import { useEffect, useRef } from "react";

const SKY_SRC = "/images/shopos-hero-sky.png";
const AGENTS_SRC = "/images/agents-hero.png";

function Bracket({ pos, className = "" }) {
  const rot = { tl: 90, tr: 180, br: -90, bl: 0 }[pos] ?? 0;
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-5 w-5 ${className}`}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M0 0 L0 23 L24 23"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
      </svg>
    </span>
  );
}

export default function AgentsThumbnail() {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      el.classList.add("at-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("at-revealed");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="agents-thumbnail relative h-full w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #2aa3a8 0%, #66bdc1 28%, #b8dbdc 60%, #ffffff 100%)",
      }}
    >
      {/* Layer 1, sky bg, always visible */}
      <img
        src={SKY_SRC}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Layer 2, "Agents" wordmark, drops from top */}
      <h2
        className="at-wordmark absolute left-1/2 m-0 select-none"
        style={{
          top: "18%",
          transform: "translateX(-50%)",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 500,
          fontSize: "clamp(48px, 13vw, 140px)",
          lineHeight: 1.08,
          letterSpacing: "-0.06em",
          color: "#ffffff",
          whiteSpace: "nowrap",
        }}
      >
        Agents
      </h2>

      {/* Layer 3, brackets, follow the wordmark */}
      <div
        aria-hidden="true"
        className="at-brackets pointer-events-none absolute inset-0 text-white"
      >
        <Bracket pos="tl" className="top-[17%] left-[22%]" />
        <Bracket pos="tr" className="top-[17%] right-[22%]" />
        <Bracket pos="bl" className="top-[55%] left-[22%]" />
        <Bracket pos="br" className="top-[55%] right-[22%]" />
      </div>

      {/* Layer 4, agents PNG, rises from below */}
      <img
        src={AGENTS_SRC}
        alt="ShopOS Agents, AI workforce for commerce"
        className="at-agents pointer-events-none absolute inset-x-0 mx-auto block w-[78%] max-w-[820px]"
        style={{ bottom: "0%" }}
        draggable={false}
      />
    </div>
  );
}
