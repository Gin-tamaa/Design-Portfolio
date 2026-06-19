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
// SitePet temporarily parked — uncomment the import + render below to bring
// the bottom-of-viewport mascot back. Component file stays at
// app/components/SitePet.jsx so this is a one-line revert.
// import SitePet from "./components/SitePet";

export default function Home() {
  const [revealed, setRevealed] = useState(false);
  const [scrollFadeOn, setScrollFadeOn] = useState(false);
  // Scroll cue is shown at the top, hidden once the user starts scrolling
  // (so it doesn't linger over the feed). Only flips state on threshold
  // crossing to avoid re-rendering on every scroll frame.
  const [showCue, setShowCue] = useState(true);
  const heroRef = useRef(null);

  useEffect(() => {
    let shown = true;
    const onScroll = () => {
      const next = window.scrollY < 80;
      if (next !== shown) {
        shown = next;
        setShowCue(next);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        {/* Left-aligned to the cards' content rail: an outer 20px gutter
            (matches .feed padding) wrapping a centered max-w-[1080px] box
            (matches .feed-card), so the hero's left edge lines up with the
            cards below. Uses only the existing fonts (League Spartan +
            Playfair Display italic). */}
        <div className="w-full px-5">
          {/* pl-3 (12px) gives the italic A's left overhang room so it
              isn't clipped; every line shifts together, keeping one left
              edge. */}
          <div className="mx-auto flex max-w-[1080px] flex-col items-start gap-8 pl-3 text-left">
            {/* Greeting, League Spartan */}
            <p
              className="m-0 leading-normal text-[#525252]"
              style={{
                fontFamily: "'League Spartan', sans-serif",
                fontWeight: 300,
                fontSize: "clamp(1.15rem, 2vw, 1.6rem)",
              }}
            >
              Here&rsquo;s Sumedh,
            </p>

            {/* Headline, same editorial voice (Playfair Display italic),
                just larger and heavier: 700 not 400, clamp-scaled.
                overflow-visible so the italic glyph overhang is never
                clipped by the headline's own box. */}
            <h1
              className="m-0 italic text-[#0a0a0a] overflow-visible"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: "clamp(2.25rem, 7vw, 5.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.005em",
              }}
            >
              designer, builder,
              <br />
              {/* Gradient + drift live in the .hero-grad class (globals.css),
                  gated behind prefers-reduced-motion. The left-clip fix is on
                  the hero block (pl-3) and the h1 (overflow-visible), not here. */}
              <span className="hero-grad">AI tinkerer</span>
              ,
              <br />
              &amp; off the clock, a menace.
            </h1>

            {/* Bio, League Spartan */}
            <p
              className="m-0 leading-normal text-[#525252]"
              style={{
                fontFamily: "'League Spartan', sans-serif",
                fontWeight: 300,
                fontSize: "clamp(1.15rem, 2vw, 1.6rem)",
              }}
            >
              I design AI products and build the front-end myself, so they
              ship.
            </p>
          </div>
        </div>

        {/* Scroll cue, anchored bottom-center. Nudges users to the work
            feed under the fixed hero; clicking smooth-scrolls down a
            viewport. Fades out once you start scrolling. */}
        <button
          type="button"
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
          aria-label="Scroll to work"
          className="scroll-cue absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
          style={{
            opacity: showCue ? 1 : 0,
            pointerEvents: showCue ? "auto" : "none",
            transition: "opacity 0.4s ease",
          }}
        >
          <span
            className="text-[11px] uppercase tracking-[0.22em] text-[#aaaaaa]"
            style={{ fontFamily: "'League Spartan', sans-serif" }}
          >
            Scroll
          </span>
          <svg
            className="scroll-cue__arrow"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            style={{ color: "#525252" }}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
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

      {/* SitePet parked — see import note above. Restore by re-enabling
          the import and uncommenting <SitePet /> here. */}
      {/* <SitePet /> */}
    </>
  );
}
