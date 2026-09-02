"use client";

// Persistent launcher docked at the bottom of every case study + the white
// wipe-up takeover overlay it triggers. Behavior in code; appearance is pulled
// from Figma nodes 102:1064 (chat box) and 102:1111 (helper line) inside
// 102:1127, which is positioned bottom: 4px / centered on the case-study hero.
//
// Open : white wipe-up from bottom (520ms, cubic-bezier(.2,.8,.2,1));
//        chat content fades in starting at ~180ms so it lands without a flash.
// Close: white wipes back down + chat fades out, same curve reversed.
// Esc closes. Body scroll is locked while open.
// Reduced-motion: overlay just appears, no wipe.

import { useCallback, useEffect, useRef, useState } from "react";
import CaseStudyChat from "./CaseStudyChat";
import ChatBox from "./ChatBox";
import ChatPet from "./ChatPet";
import VibeCoderPet from "./VibeCoderPet";

// Matches the clip-path duration in globals.css (.csc-takeover)
const WIPE_MS = 620;

export default function ChatLauncher({ project }) {
  const [mounted, setMounted] = useState(false); // overlay DOM present
  const [open, setOpen] = useState(false);       // wipe-up triggered
  const [atFooter, setAtFooter] = useState(false); // hide near page bottom
  const closeTimerRef = useRef(null);

  // Hide the launcher (and its fade backdrop) when the user is within
  // ~280px of the page bottom — that's where the case-study footer lives
  // (py-24 = ~250px). Without this, the fixed launcher overlaps the
  // "Back to Work" / "Next" links. Reappears when user scrolls back up.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const FOOTER_THRESHOLD = 280;
    const onScroll = () => {
      const distFromBottom =
        document.documentElement.scrollHeight -
        (window.scrollY + window.innerHeight);
      setAtFooter(distFromBottom < FOOTER_THRESHOLD);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openOverlay = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setMounted(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
  }, []);

  const closeOverlay = useCallback(() => {
    setOpen(false);
    closeTimerRef.current = setTimeout(() => setMounted(false), WIPE_MS + 40);
  }, []);

  // Esc to close
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeOverlay();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mounted, closeOverlay]);

  // Body scroll lock while mounted
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  const scrollDown = useCallback(() => {
    if (typeof window === "undefined") return;
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Fade backdrop — gradual white blur behind the launcher so the
          case-study text dissolves smoothly behind the chat box. Height
          is tuned to end roughly at the TOP edge of the chat box (chip
          box ~56px tall + helper ~16px + gap 8px + bottom offset 24px ≈
          110px, with a small soft-fade margin above). Hidden while the
          takeover is open OR when near the footer. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-[120px] bg-gradient-to-b from-transparent to-white"
        style={{
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
          opacity: mounted || atFooter ? 0 : 1,
          transition: "opacity 300ms ease",
        }}
      />

      {/* Launcher block — Figma node 102:1127. Uses the SAME ChatBox
          component as the takeover composer so size, radius, border, and
          shadow stay in lockstep. Vertical offset matches the takeover
          dock's pb-6 (24px) so the chat box sits at the SAME viewport-Y
          in both surfaces — no jump across the open/close transition. */}
      <div
        className="pointer-events-none fixed inset-x-0 z-30 px-4 md:px-6 lg:px-16"
        style={{
          bottom: 24,
          opacity: atFooter ? 0 : 1,
          transition: "opacity 300ms ease",
        }}
        aria-hidden={mounted || atFooter}
      >
        <div
          className="relative mx-auto w-full max-w-[48rem]"
          style={{
            pointerEvents: mounted || atFooter ? "none" : "auto",
          }}
        >
          {/* Funny Side wanders the left/middle of the pill; Vibe Coder is
              parked coding at the right corner. Click/double-click/5-click
              each for different reactions. */}
          {!mounted ? <ChatPet /> : null}
          {!mounted ? <VibeCoderPet /> : null}
          <ChatBox mode="display" onClick={openOverlay} />

          {/* Helper line — same 12px / #525252 as the takeover. mt-2 is
              the SOLE gap source (no parent flex gap) so the spacing
              math matches the takeover's thread-bottom-container exactly
              (which is a plain `relative` block, not a flex parent). */}
          <div
            className="mt-2 flex items-center justify-center gap-2 text-[12px] leading-[16px] text-[#525252]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <span>Chat with our agents to know more or</span>
            <button
              type="button"
              onClick={scrollDown}
              className="inline-flex items-center gap-1 transition-opacity hover:opacity-70"
            >
              <span
                aria-hidden="true"
                style={{ transform: "rotate(90deg)", display: "inline-block" }}
              >
                →
              </span>
              Scroll Down to read
            </button>
          </div>
        </div>
      </div>

      {/* Takeover overlay — z-70 so the global nav is covered (the takeover
          renders its own back-button affordance) */}
      {mounted ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Chat with my team"
          className={`csc-takeover fixed inset-0 z-[70] ${open ? "is-open" : ""}`}
        >
          {/* Chat scenery: the ShopOS hero sky full-bleed behind a floating
              white card, with cloud clusters popping from the bottom
              corners after the wipe. */}
          <div className="csc-scenery" aria-hidden="true" />
          <div className={`csc-content csc-card flex flex-col ${open ? "is-visible" : ""}`}>
            <CaseStudyChat project={project} onClose={closeOverlay} />
          </div>
          <div className="csc-fg" aria-hidden="true">
            <img src="/images/scenes/cloud-left.png" alt="" className="csc-cloud-l" draggable={false} />
            <img src="/images/scenes/cloud-right.png" alt="" className="csc-cloud-r" draggable={false} />
          </div>
        </div>
      ) : null}
    </>
  );
}
