"use client";

// Desktop pet mascot — uses the Funny Side agent transparent PNG, follows
// the cursor with lerp, idles with a soft bob, "walks" while chasing,
// pops a speech bubble on click, sprays a few tiny emotes, gets dizzy
// from too many rapid clicks, and is draggable. Hidden on touch devices
// (no cursor to follow) and prefers-reduced-motion (per CSS overrides).
//
// CSS lives in globals.css under the `.site-pet*` namespace.
// Mounted on the homepage only (app/page.jsx), so the case study /
// nested routes aren't littered with a wandering character.

import { useEffect, useRef, useState } from "react";

// === Phrase data ===========================================================
const PHRASES_HELLO = ["hi there!", "hey :)", "psst"];
const PHRASES_IDLE = ["ready to work", "i'm here", "scrolling along..."];
const PHRASES_CLICK = ["oops!", "ow!", "yo!", "what's up?", "ok ok"];
const PHRASES_DIZZY = ["whoa", "dizzy…", "easy!"];

// === Agent atlas (Funny Side — bubblegum/boombox pose) =====================
const AGENT_PNG = "/images/agents-chat-raw/funny-side.png";
const AGENT_BG = "#ed8dc2";

// === Tuning ================================================================
const TARGET_OFFSET_X = 38;   // where the pet sits relative to cursor
const TARGET_OFFSET_Y = 38;
const LERP = 0.085;           // smoothness of cursor follow
const WALK_THRESHOLD = 0.6;   // velocity to flip into "walking" state
const PET_SIZE = 60;          // px (display size of the avatar circle)
const DIZZY_CLICK_COUNT = 5;
const DIZZY_RESET_MS = 2500;

export default function SitePet() {
  const petRef = useRef(null);
  const posRef = useRef({ x: 80, y: 80 });
  const targetRef = useRef({ x: 80, y: 80 });
  const flipRef = useRef(1);
  const draggingRef = useRef(false);
  const clickCountRef = useRef(0);
  const dizzyResetTimerRef = useRef(null);
  const rafRef = useRef(null);
  const idleBubbleTimerRef = useRef(null);

  const [walking, setWalking] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [bumping, setBumping] = useState(false);
  const [dizzy, setDizzy] = useState(false);
  const [bubble, setBubble] = useState(null);
  const [emotes, setEmotes] = useState([]);
  const [flip, setFlip] = useState(1);
  const [mounted, setMounted] = useState(false);

  // Mount gating — skip touch devices entirely (no cursor to chase) and
  // wait a tick so we don't fight the homepage intro's first paint.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Helper — show a bubble for ~2.5s, replacing whatever's there.
  const bubbleTimerRef = useRef(null);
  const showBubble = (text) => {
    setBubble(text);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => setBubble(null), 2500);
  };

  // === Cursor tracking + lerp animation loop ===============================
  useEffect(() => {
    if (!mounted) return;
    const el = petRef.current;
    if (!el) return;

    // Initial position: tucked into the bottom-right so the pet doesn't
    // appear on top of the hero on first paint.
    posRef.current = {
      x: window.innerWidth - PET_SIZE - 32,
      y: window.innerHeight - PET_SIZE - 48,
    };
    targetRef.current = { ...posRef.current };

    const clampTarget = (x, y) => {
      const maxX = window.innerWidth - PET_SIZE - 8;
      const maxY = window.innerHeight - PET_SIZE - 8;
      return {
        x: Math.max(8, Math.min(maxX, x)),
        y: Math.max(8, Math.min(maxY, y)),
      };
    };

    const onPointerMove = (e) => {
      if (draggingRef.current) return;
      const t = clampTarget(
        e.clientX + TARGET_OFFSET_X,
        e.clientY + TARGET_OFFSET_Y
      );
      targetRef.current.x = t.x;
      targetRef.current.y = t.y;
    };

    window.addEventListener("pointermove", onPointerMove);

    const tick = () => {
      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (!draggingRef.current && dist > 0.5) {
        posRef.current.x += dx * LERP;
        posRef.current.y += dy * LERP;
      }

      // Flip direction follows horizontal velocity, with a small deadzone.
      if (Math.abs(dx) > 1.5) {
        const newFlip = dx > 0 ? 1 : -1;
        if (newFlip !== flipRef.current) {
          flipRef.current = newFlip;
          setFlip(newFlip);
        }
      }

      // Walking state: any noticeable per-frame velocity, not while dragging.
      const velocity = Math.abs(dx) + Math.abs(dy);
      const shouldWalk = velocity > WALK_THRESHOLD && !draggingRef.current;
      setWalking((prev) => (prev !== shouldWalk ? shouldWalk : prev));

      // Write the CSS variables directly — keeps the high-frequency
      // position updates off the React render path.
      el.style.setProperty("--pet-x", `${posRef.current.x}px`);
      el.style.setProperty("--pet-y", `${posRef.current.y}px`);

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // Random idle bubble every 12–25s
    const scheduleIdleBubble = () => {
      const delay = 12000 + Math.random() * 13000;
      idleBubbleTimerRef.current = setTimeout(() => {
        const pool = Math.random() < 0.5 ? PHRASES_HELLO : PHRASES_IDLE;
        showBubble(pool[Math.floor(Math.random() * pool.length)]);
        scheduleIdleBubble();
      }, delay);
    };
    scheduleIdleBubble();

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(idleBubbleTimerRef.current);
      clearTimeout(bubbleTimerRef.current);
      clearTimeout(dizzyResetTimerRef.current);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [mounted]);

  // === Click / pet =========================================================
  const handleClick = () => {
    // Bump animation — short tilt + lift
    setBumping(true);
    setTimeout(() => setBumping(false), 320);

    // Random click phrase
    const phrase = PHRASES_CLICK[Math.floor(Math.random() * PHRASES_CLICK.length)];
    showBubble(phrase);

    // Spawn 4 tiny emotes, fanning out from the top of the avatar
    const newEmotes = Array.from({ length: 4 }, (_, i) => ({
      id: `em-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      char: ["·", "·", "♥", "✦"][i],
      angle: -45 + i * 30, // -45 / -15 / 15 / 45deg
    }));
    setEmotes((prev) => [...prev, ...newEmotes]);
    setTimeout(() => {
      setEmotes((prev) =>
        prev.filter((em) => !newEmotes.some((ne) => ne.id === em.id))
      );
    }, 1100);

    // Dizzy after 5 rapid clicks within DIZZY_RESET_MS
    clickCountRef.current += 1;
    clearTimeout(dizzyResetTimerRef.current);
    dizzyResetTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, DIZZY_RESET_MS);

    if (clickCountRef.current >= DIZZY_CLICK_COUNT) {
      setDizzy(true);
      showBubble(PHRASES_DIZZY[Math.floor(Math.random() * PHRASES_DIZZY.length)]);
      setTimeout(() => {
        setDizzy(false);
        clickCountRef.current = 0;
      }, 1800);
    }
  };

  // === Drag ================================================================
  const handlePointerDown = (e) => {
    if (e.button !== 0) return; // primary button only

    const start = { x: posRef.current.x, y: posRef.current.y };
    const mouse = { x: e.clientX, y: e.clientY };
    let didDrag = false;

    const onMove = (ev) => {
      const dx = ev.clientX - mouse.x;
      const dy = ev.clientY - mouse.y;
      if (!didDrag && Math.hypot(dx, dy) > 5) {
        didDrag = true;
        draggingRef.current = true;
        setDragging(true);
      }
      if (didDrag) {
        posRef.current.x = start.x + dx;
        posRef.current.y = start.y + dy;
        // Also push target so the pet doesn't snap back to cursor on release
        targetRef.current.x = posRef.current.x;
        targetRef.current.y = posRef.current.y;
      }
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (didDrag) {
        draggingRef.current = false;
        setDragging(false);
      }
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  if (!mounted) return null;

  return (
    <div
      ref={petRef}
      className="site-pet"
      data-walking={walking ? "true" : undefined}
      data-dragging={dragging ? "true" : undefined}
      data-bumping={bumping ? "true" : undefined}
      data-dizzy={dizzy ? "true" : undefined}
      style={{ "--pet-size": `${PET_SIZE}px` }}
      aria-hidden="true"
    >
      {bubble ? <div className="site-pet__bubble">{bubble}</div> : null}

      <div className="site-pet__emotes">
        {emotes.map((emote) => (
          <span
            key={emote.id}
            className="site-pet__emote"
            style={{ "--emote-angle": `${emote.angle}deg` }}
          >
            {emote.char}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="site-pet__hit"
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        style={{ "--pet-flip": flip }}
        aria-label="Friendly site mascot — click to pet"
      >
        <span
          className="site-pet__avatar"
          style={{ background: AGENT_BG }}
        >
          <img src={AGENT_PNG} alt="" draggable={false} />
        </span>
      </button>
    </div>
  );
}
