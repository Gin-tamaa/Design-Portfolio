"use client";

// Homepage Carousel thumbnail for the Brand Memory case study.
// Mirrors the case-study hero: the NeuralNoise WebGL canvas painting
// soft graphite traces over a white bg, with the "Memory" wordmark
// centered on top. No brackets, no figure (per the user: effect +
// text only). The wordmark fades + drops in once the card scrolls
// into view; reduced motion shows it immediately.

import { useEffect, useRef } from "react";
import NeuralNoise from "../work/brand-memory/NeuralNoise";

export default function MemoryThumbnail() {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      el.classList.add("mt-revealed");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("mt-revealed");
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
      className="memory-thumbnail relative h-full w-full overflow-hidden"
      style={{
        // Slight off-white so the thumbnail reads as a card against
        // the homepage bg instead of blending into it.
        background: "#F3F3F2",
        containerType: "inline-size",
      }}
    >
      {/* Layer 1, WebGL Neural Noise canvas (light-theme tinted). Lower
          resolution than the full-screen hero, and it pauses when the card
          is off-screen, so the homepage feed stays smooth while scrolling. */}
      <NeuralNoise maxDpr={1.25} />

      {/* Layer 2, "Memory" wordmark centered on the canvas */}
      <h2
        className="mt-wordmark absolute left-1/2 top-1/2 m-0 select-none"
        style={{
          transform: "translate(-50%, -50%)",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 500,
          fontSize: "clamp(40px, 9cqw, 120px)",
          lineHeight: 1,
          letterSpacing: "-0.06em",
          color: "#0a0a0a",
          whiteSpace: "nowrap",
        }}
      >
        Memory
      </h2>
    </div>
  );
}
