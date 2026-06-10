"use client";

// Homepage — Hano-style fade-dissolve.
//
// The hero is `position: fixed` at the back of the stacking context (z-0).
// Above it (z-10) the carousel scrolls UP over the pinned hero. A transparent
// 100vh spacer at the top of the cards container lets the hero be visible at
// scroll 0 and gives the document its first viewport-height of scroll travel.
//
// As scroll progress runs 0 → 1 over the first ~85% of the viewport height,
// the hero fades opacity 1 → 0 and scales 1 → 1.05 (subtle settle). Once
// fully faded its pointer-events flip off so it never blocks clicks.
//
// Reduced motion: skip the fade, hero stays at opacity 1, IO reveals disabled.
//
// The typographic intro (and /work/shopos) are not touched by this change.

import { useEffect, useRef, useState } from "react";
import Intro from "./components/Intro";
import Carousel from "./components/Carousel";

export default function Home() {
  const [revealed, setRevealed] = useState(false);
  const [scrollFadeOn, setScrollFadeOn] = useState(false);
  const heroRef = useRef(null);

  // Phase 1 — reveal animation when the intro hands off (replaces the old
  // framer-motion path). A short CSS transition fades the hero in, then we
  // clear the transition so the rAF scroll fade can drive style cleanly.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      hero.style.opacity = "1";
      hero.style.transform = "none";
      return;
    }

    if (!revealed) {
      hero.style.transition = "";
      hero.style.opacity = "0";
      hero.style.transform = "scale(1.06)";
      return;
    }

    hero.style.transition =
      "opacity 0.55s ease-out, transform 1s cubic-bezier(0.2, 0.7, 0.2, 1)";
    hero.style.opacity = "1";
    hero.style.transform = "scale(1)";

    const t = window.setTimeout(() => {
      hero.style.transition = "";
      setScrollFadeOn(true);
    }, 1100);
    return () => window.clearTimeout(t);
  }, [revealed]);

  // Phase 2 — scroll-driven fade-dissolve. Active only after the reveal lands.
  useEffect(() => {
    if (!scrollFadeOn) return;
    const hero = heroRef.current;
    if (!hero) return;

    let rafId = null;
    const update = () => {
      const y = window.scrollY;
      const h = window.innerHeight;
      const p = Math.min(1, Math.max(0, y / (h * 0.85)));
      hero.style.opacity = String(1 - p);
      hero.style.transform = `scale(${1 + 0.05 * p})`;
      hero.style.pointerEvents = p >= 1 ? "none" : "auto";
      rafId = null;
    };
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [scrollFadeOn]);

  // Cards rise into view as they enter the viewport (IntersectionObserver).
  useEffect(() => {
    if (!revealed) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const cards = Array.from(document.querySelectorAll(".feed-card"));
    if (cards.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      cards.forEach((c) => c.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [revealed]);

  return (
    <>
      <Intro onFinish={() => setRevealed(true)} />

      {/* Fixed hero — pinned to the viewport behind the cards (z-0). */}
      <section
        ref={heroRef}
        aria-label="Hero"
        className="fixed inset-0 z-0 flex items-center justify-center"
        style={{
          opacity: 0,
          transform: "scale(1.06)",
          transformOrigin: "center center",
          willChange: "opacity, transform",
        }}
      >
        <div
          className="flex w-[540px] max-w-[92vw] flex-col"
          style={{ gap: 24 }}
        >
          <div className="flex flex-col" style={{ gap: 8 }}>
            <h1
              className="m-0 text-[56px] italic leading-none text-[#0a0a0a]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 400,
                letterSpacing: "-0.005em",
              }}
            >
              Here&rsquo;s Sumedh
            </h1>
            <div className="flex items-center" style={{ gap: 8 }}>
              {["Design", "Front End Dev", "AI Agents", "AI Workflows"].map(
                (label, i, arr) => (
                  <span
                    key={label}
                    className="flex items-center"
                    style={{ gap: 8 }}
                  >
                    <span
                      className="text-[14px] text-[#525252]"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </span>
                    {i < arr.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="inline-block bg-[#d9d9d9]"
                        style={{ width: 4, height: 4 }}
                      />
                    )}
                  </span>
                )
              )}
            </div>
          </div>
          <p
            className="m-0 text-[12px] leading-normal text-[#525252]"
            style={{
              fontFamily: "'League Spartan', sans-serif",
              fontWeight: 400,
            }}
          >
            brings 6 years of design experience, builds front-ends, ships AI
            workflows, and understands AI agents
          </p>
        </div>
      </section>

      {/* Cards rise over the fixed hero. Wrapper is z-10 to sit above it;
          the spacer is transparent + pointer-events:none so the hero stays
          visible AND clickable at scroll 0. */}
      <div className="relative z-10">
        <div
          aria-hidden="true"
          className="h-screen pointer-events-none"
        />
        <div className="bg-white">
          <Carousel />
        </div>
      </div>
    </>
  );
}
