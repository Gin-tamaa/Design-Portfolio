"use client";

import { useEffect } from "react";

// Lenis-style smooth scroll. Intercepts wheel input, dampens it, and lerps the
// actual scroll position toward the new target each rAF tick. window.scrollY
// stays accurate (we use window.scrollTo), so IntersectionObserver, anchor
// jumps, parallax math, and dev tools all keep working unchanged.
//
// Tuning knobs at the top of useEffect.
//   DAMP  — wheel delta multiplier (lower = heavier scroll, less per tick)
//   LERP  — catch-up speed per frame (lower = smoother + more lag)
//
// Skipped on:
//   • prefers-reduced-motion: reduce      — accessibility
//   • coarse pointers (touch devices)     — native touch is already fluid
//   • ctrl/meta + wheel                   — let the browser pinch-zoom
//   • horizontal wheels (deltaX dominant) — sideways scroll stays native

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const DAMP = 0.78;
    const LERP = 0.1;

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let rafId = null;
    let lastWheelTime = 0;

    const tick = () => {
      const diff = targetY - currentY;
      if (Math.abs(diff) < 0.5) {
        currentY = targetY;
        window.scrollTo(0, currentY);
        rafId = null;
        return;
      }
      currentY += diff * LERP;
      window.scrollTo(0, currentY);
      rafId = requestAnimationFrame(tick);
    };

    const onWheel = (e) => {
      if (e.ctrlKey || e.metaKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // If the page is scroll-locked (a modal or takeover is open and managing
      // its own inner scroll), don't intercept — let the wheel event reach the
      // inner scrollable target natively. Without this, the chat takeover's
      // message list can't be scrolled with the mouse wheel.
      if (document.body.style.overflow === "hidden") return;

      e.preventDefault();
      targetY += e.deltaY * DAMP;

      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight
      );
      if (targetY < 0) targetY = 0;
      if (targetY > maxScroll) targetY = maxScroll;

      lastWheelTime = performance.now();

      if (rafId === null) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      // If scroll wasn't triggered by our wheel handler (anchor click, arrow
      // keys, scrollbar drag, scrollIntoView), adopt the native position.
      const now = performance.now();
      if (now - lastWheelTime > 200 && rafId === null) {
        targetY = window.scrollY;
        currentY = window.scrollY;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}
