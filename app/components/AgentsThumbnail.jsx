"use client";

// Homepage Carousel thumbnail for the ShopOS Agents case study.
// Sky background + a single "Agents" wordmark centred on top —
// the figures and the corner brackets that lived here previously
// have been pulled per the user request, leaving the cleanest
// possible composition.
//
// IntersectionObserver triggers the wordmark fade-in once the
// card enters the viewport. Reduced motion → wordmark visible
// immediately.

import { useEffect, useRef } from "react";

const SKY_SRC = "/images/shopos-hero-sky.png";

// `word` is the centred wordmark; defaults to "Agents" (ShopOS card) but
// the Enterprise Dashboard card reuses this thumbnail with word="Dashboard".
export default function AgentsThumbnail({ word = "Agents" }) {
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

      {/* Layer 2, "Agents" wordmark centered on the sky. Sized by
          card width via clamp so it scales with the card, not the
          viewport (vw was making it overflow narrow cards). */}
      <h2
        className="at-wordmark absolute left-1/2 top-1/2 m-0 select-none"
        style={{
          transform: "translate(-50%, -50%)",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 500,
          fontSize: "clamp(48px, 11cqw, 150px)",
          lineHeight: 1,
          letterSpacing: "-0.06em",
          color: "#ffffff",
          whiteSpace: "nowrap",
          textShadow: "0 2px 18px rgba(0,0,0,0.18)",
        }}
      >
        {word}
      </h2>
    </div>
  );
}
