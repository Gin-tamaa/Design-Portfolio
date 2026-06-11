"use client";

// Desktop pet mascot — wanders along the bottom of the viewport doing its
// own thing. Cycles between WALK / IDLE / SIT, swapping persona poses from
// the Figma 164:1279 sprite set so each state shows a different character
// action (walking with boombox, standing, seated chin-on-fist, pointing).
//
// Behavior is autonomous: a plan timer flips state on a random interval
// and walk direction reverses at viewport edges. The cursor is never read.
//
// Click → bump + brief POINT pose + emote burst. Five rapid clicks → DIZZY.
// Drag → user can pick the pet up and drop it anywhere along the bottom;
// it resumes its plan from wherever you let go.
//
// CSS lives in globals.css under the `.site-pet*` namespace. Hidden on
// touch devices and prefers-reduced-motion via CSS overrides.

import { useEffect, useRef, useState } from "react";

// === Phrase data ===========================================================
const PHRASES_HELLO = ["hi there!", "hey :)", "psst"];
const PHRASES_IDLE = ["just hanging out", "scrolling along…", "i'm here"];
const PHRASES_CLICK = ["oops!", "ow!", "yo!", "what's up?", "ok ok"];
const PHRASES_DIZZY = ["whoa", "dizzy…", "easy!"];

// === Pose atlas (Funny Side — sprite poses extracted from Figma 164:1278,
// 164:1332, 165:1219). Each state shows a visually distinct action.
// No coloured circle behind the character — the raw transparent PNG is
// what's drawn on the page.
//
// State→image mapping for the static states is a plain image swap (the
// state change is the animation). MUSIC is the one cycling state: an
// 8-frame loop from Figma 165:1219 ("LISTENING TO MUSIC — LOOPABLE")
// played on click via CSS background-position + steps(8). See
// .site-pet__sprite--music in globals.css.
const POSES = {
  idle:  "/images/agents-poses/funny-side-front.png",       // standing, hands in pockets
  walk:  "/images/agents-poses/funny-side-walk-static.png", // mid-stride with boombox (single frame)
  sit:   "/images/agents-poses/funny-side-pointing.png",    // seated, chin on fist
  point: "/images/agents-poses/funny-side-action.png",      // finger pointed out (unused; kept for future)
};

// === Tuning ================================================================
const PET_HEIGHT = 110;            // px — visible height of the character
const PET_WIDTH = 80;              // px — fixed wrapper width (wider than the
                                   // widest pose so swaps don't shift the
                                   // character horizontally)
const BOTTOM_OFFSET = 16;          // distance above the viewport bottom
const WALK_SPEED_PX_PER_S = 70;
const DIZZY_CLICK_COUNT = 5;
const DIZZY_RESET_MS = 2500;
const POINT_DURATION_MS = 700;
const MUSIC_DURATION_MS = 4500;    // how long the click→music loop plays before resuming normal plan

// Plan timer windows — how long each autonomous state lasts before the
// pet picks a new one.
const PLAN = {
  walkMin: 3500,
  walkMax: 7500,
  idleMin: 1600,
  idleMax: 3800,
  sitMin:  4500,
  sitMax:  8500,
};

const STATE = {
  WALK:  "walk",
  IDLE:  "idle",
  SIT:   "sit",
  POINT: "point",
  MUSIC: "music",   // click → 8-frame listening-to-music loop
  DIZZY: "dizzy",
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => min + Math.random() * (max - min);

export default function SitePet() {
  const petRef = useRef(null);
  const stateRef = useRef(STATE.WALK);
  const xRef = useRef(0);
  const dirRef = useRef(1); // 1 = right, -1 = left
  const draggingRef = useRef(false);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const planTimerRef = useRef(null);
  const pointResetTimerRef = useRef(null);
  const musicResetTimerRef = useRef(null);
  const idleBubbleTimerRef = useRef(null);
  const bubbleTimerRef = useRef(null);
  const dizzyResetTimerRef = useRef(null);
  const dizzyTimerRef = useRef(null);
  const clickCountRef = useRef(0);

  const [state, setState] = useState(STATE.WALK);
  const [flip, setFlip] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [bumping, setBumping] = useState(false);
  const [bubble, setBubble] = useState(null);
  const [emotes, setEmotes] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Skip touch devices (no need for a desktop mascot there). Short delay
  // so we don't fight the homepage intro on first paint.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const t = setTimeout(() => setMounted(true), 200);
    return () => clearTimeout(t);
  }, []);

  const showBubble = (text) => {
    setBubble(text);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => setBubble(null), 2500);
  };

  const goToState = (next) => {
    stateRef.current = next;
    setState(next);
  };

  // === Behavior planner =====================================================
  // The state machine decides what to do next on a self-firing timer.
  // WALK alternates with IDLE / SIT; click and drag are interruptions.
  const schedulePlan = (delay) => {
    clearTimeout(planTimerRef.current);
    planTimerRef.current = setTimeout(decidePlan, delay);
  };

  const decidePlan = () => {
    if (draggingRef.current || stateRef.current === STATE.DIZZY) {
      schedulePlan(800);
      return;
    }
    const cur = stateRef.current;
    if (cur === STATE.WALK) {
      // After a walk, take a breather. 70/30 split between idle and sit.
      if (Math.random() < 0.7) {
        goToState(STATE.IDLE);
        schedulePlan(rand(PLAN.idleMin, PLAN.idleMax));
      } else {
        goToState(STATE.SIT);
        schedulePlan(rand(PLAN.sitMin, PLAN.sitMax));
      }
    } else {
      // From any rest state, walk again. ~40% chance to flip direction.
      if (Math.random() < 0.4) {
        dirRef.current *= -1;
        setFlip(dirRef.current);
      }
      goToState(STATE.WALK);
      schedulePlan(rand(PLAN.walkMin, PLAN.walkMax));
    }
  };

  // === Animation loop =======================================================
  useEffect(() => {
    if (!mounted) return;
    const el = petRef.current;
    if (!el) return;

    // Start tucked into the left side, facing right.
    xRef.current = 32;
    dirRef.current = 1;
    el.style.setProperty("--pet-x", `${xRef.current}px`);

    schedulePlan(rand(PLAN.walkMin, PLAN.walkMax));

    const maxX = () => window.innerWidth - PET_WIDTH - 16;

    const tick = (t) => {
      if (lastTimeRef.current == null) lastTimeRef.current = t;
      const dt = Math.min(0.05, (t - lastTimeRef.current) / 1000); // clamp to avoid huge jumps after tab blur
      lastTimeRef.current = t;

      if (!draggingRef.current && stateRef.current === STATE.WALK) {
        const step = WALK_SPEED_PX_PER_S * dt * dirRef.current;
        xRef.current += step;
        // Bounce off the viewport edges.
        if (xRef.current < 16) {
          xRef.current = 16;
          dirRef.current = 1;
          setFlip(1);
        } else if (xRef.current > maxX()) {
          xRef.current = maxX();
          dirRef.current = -1;
          setFlip(-1);
        }
        el.style.setProperty("--pet-x", `${xRef.current}px`);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // Re-clamp x when the viewport resizes so the pet can't get stuck
    // beyond the right edge.
    const onResize = () => {
      const m = maxX();
      if (xRef.current > m) {
        xRef.current = m;
        el.style.setProperty("--pet-x", `${xRef.current}px`);
      }
    };
    window.addEventListener("resize", onResize);

    // Random idle bubble every 12–25s.
    const scheduleIdleBubble = () => {
      const delay = 12000 + Math.random() * 13000;
      idleBubbleTimerRef.current = setTimeout(() => {
        const pool = Math.random() < 0.5 ? PHRASES_HELLO : PHRASES_IDLE;
        showBubble(pick(pool));
        scheduleIdleBubble();
      }, delay);
    };
    scheduleIdleBubble();

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(planTimerRef.current);
      clearTimeout(pointResetTimerRef.current);
      clearTimeout(musicResetTimerRef.current);
      clearTimeout(idleBubbleTimerRef.current);
      clearTimeout(bubbleTimerRef.current);
      clearTimeout(dizzyResetTimerRef.current);
      clearTimeout(dizzyTimerRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [mounted]);

  // === Click ================================================================
  // Clicking the character makes them sit down with the boombox and play
  // music — an 8-frame loopable animation from Figma 165:1219. The pet
  // grooves for MUSIC_DURATION_MS then resumes its normal walk/idle plan.
  // Clicking again during music just resets the timer (extends listening).
  const handleClick = () => {
    setBumping(true);
    setTimeout(() => setBumping(false), 320);

    goToState(STATE.MUSIC);

    // Pause the autonomous plan while music plays.
    clearTimeout(planTimerRef.current);
    clearTimeout(musicResetTimerRef.current);
    musicResetTimerRef.current = setTimeout(() => {
      if (stateRef.current === STATE.MUSIC) {
        goToState(STATE.IDLE);
        schedulePlan(rand(PLAN.idleMin, PLAN.idleMax));
      }
    }, MUSIC_DURATION_MS);

    showBubble(pick(PHRASES_CLICK));

    // Spawn 4 tiny emotes fanning out from the top.
    const newEmotes = Array.from({ length: 4 }, (_, i) => ({
      id: `em-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      char: ["·", "·", "♥", "✦"][i],
      angle: -45 + i * 30,
    }));
    setEmotes((p) => [...p, ...newEmotes]);
    setTimeout(() => {
      setEmotes((p) => p.filter((e) => !newEmotes.some((ne) => ne.id === e.id)));
    }, 1100);

    // Dizzy after N rapid clicks.
    clickCountRef.current += 1;
    clearTimeout(dizzyResetTimerRef.current);
    dizzyResetTimerRef.current = setTimeout(() => { clickCountRef.current = 0; }, DIZZY_RESET_MS);

    if (clickCountRef.current >= DIZZY_CLICK_COUNT) {
      goToState(STATE.DIZZY);
      showBubble(pick(PHRASES_DIZZY));
      clearTimeout(dizzyTimerRef.current);
      dizzyTimerRef.current = setTimeout(() => {
        goToState(STATE.WALK);
        clickCountRef.current = 0;
      }, 1800);
    }
  };

  // === Drag =================================================================
  // Horizontal-only drag along the bottom strip. Vertical position is fixed
  // by CSS (bottom: var(--pet-bottom)) so the pet always sits on the floor.
  const handlePointerDown = (e) => {
    if (e.button !== 0) return;
    const start = { x: xRef.current };
    const mouse = { x: e.clientX };
    let didDrag = false;

    const maxX = () => window.innerWidth - PET_WIDTH - 16;

    const onMove = (ev) => {
      const dx = ev.clientX - mouse.x;
      if (!didDrag && Math.abs(dx) > 5) {
        didDrag = true;
        draggingRef.current = true;
        setDragging(true);
      }
      if (didDrag) {
        const next = Math.max(16, Math.min(maxX(), start.x + dx));
        xRef.current = next;
        petRef.current?.style.setProperty("--pet-x", `${next}px`);
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

  // Walking direction also picks the source flip — when dirRef is -1 the
  // image scales by -1 horizontally so the character faces the way it's
  // moving. IDLE / SIT keep whichever direction was last walked.
  const poseUrl = POSES[state] || POSES.idle;

  return (
    <div
      ref={petRef}
      className="site-pet"
      data-state={state}
      data-dragging={dragging ? "true" : undefined}
      data-bumping={bumping ? "true" : undefined}
      style={{
        "--pet-height": `${PET_HEIGHT}px`,
        "--pet-width": `${PET_WIDTH}px`,
        "--pet-bottom": `${BOTTOM_OFFSET}px`,
      }}
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
        {/* Inner wrapper carries the bob/dizzy animations so they don't
            overwrite the scaleX flip on the button. MUSIC swaps to a
            background-image sprite to step through the 8-frame loop;
            every other state is a plain image swap. */}
        <span className="site-pet__inner">
          {state === STATE.MUSIC ? (
            <span
              className="site-pet__sprite site-pet__sprite--music"
              aria-hidden="true"
            />
          ) : (
            <img
              src={poseUrl}
              alt=""
              draggable={false}
              className="site-pet__img"
            />
          )}
        </span>
      </button>
    </div>
  );
}
