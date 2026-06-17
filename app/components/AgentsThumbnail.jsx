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
        // Enable container queries so the wordmark + figures can
        // scale by card width (cqw), not viewport (vw).
        containerType: "inline-size",
      }}
    >
      {/* Layer 1, sky bg, always visible */}
      <img
        src={SKY_SRC}
        alt=""
        aria-hidden="true"
        className="at-sky absolute inset-0"
        draggable={false}
      />

      {/* Layer 2, "Agents" wordmark, drops from top. Sized by card
          width via clamp so it scales with the card, not the
          viewport (vw was making it overflow narrow cards). */}
      <h2
        className="at-wordmark absolute left-1/2 m-0 select-none"
        style={{
          top: "16%",
          transform: "translateX(-50%)",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 500,
          fontSize: "clamp(40px, 8.5cqw, 110px)",
          lineHeight: 1,
          letterSpacing: "-0.06em",
          color: "#ffffff",
          whiteSpace: "nowrap",
          textShadow: "0 2px 18px rgba(0,0,0,0.18)",
        }}
      >
        Agents
      </h2>

      {/* Layer 3, brackets, follow the wordmark, frame the agents */}
      <div
        aria-hidden="true"
        className="at-brackets pointer-events-none absolute inset-0 text-white"
      >
        <Bracket pos="tl" className="top-[14%] left-[20%]" />
        <Bracket pos="tr" className="top-[14%] right-[20%]" />
        <Bracket pos="bl" className="top-[78%] left-[20%]" />
        <Bracket pos="br" className="top-[78%] right-[20%]" />
      </div>

      {/* Layer 4, agents PNG, rises from below. Sizing + positioning
          live in globals.css under .agents-thumbnail .at-agents so
          the .feed-card-visual img global rule can be overridden
          with the right specificity. Anchored top: 44% to mirror
          the hero's 332/760 ratio. */}
      <img
        src={AGENTS_SRC}
        alt="ShopOS Agents, AI workforce for commerce"
        className="at-agents pointer-events-none"
        style={{ top: "44%" }}
        draggable={false}
      />
    </div>
  );
}
