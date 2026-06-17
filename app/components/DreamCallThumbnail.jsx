"use client";

// Homepage Carousel thumbnail for DreamCall. Same design as
// MemoryThumbnail (full-bleed animated background + centered wordmark
// that fades/drops in on scroll), with two swaps: the background is the
// paper-design GrainGradient (purple) instead of the NeuralNoise canvas,
// and the wordmark reads "DreamCall". Reuses the .memory-thumbnail /
// .mt-wordmark reveal classes so the entrance is identical.
//
// The gradient draws on black, so the wordmark is white here (Memory's
// is black on its light canvas).

import { useEffect, useRef } from "react";
import { GradientBackground } from "./GradientBackground";

export default function DreamCallThumbnail() {
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
        background: "#000000",
        containerType: "inline-size",
      }}
    >
      {/* Layer 1, animated grain gradient (purple over black) */}
      <GradientBackground />

      {/* Layer 2, "DreamCall" wordmark centered on the gradient */}
      <h2
        className="mt-wordmark absolute left-1/2 top-1/2 m-0 select-none"
        style={{
          transform: "translate(-50%, -50%)",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 500,
          fontSize: "clamp(40px, 9cqw, 120px)",
          lineHeight: 1,
          letterSpacing: "-0.06em",
          color: "#ffffff",
          whiteSpace: "nowrap",
        }}
      >
        DreamCall
      </h2>
    </div>
  );
}
