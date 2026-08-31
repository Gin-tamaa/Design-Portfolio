"use client";

// Tiny autonomous pet perched on the chat launcher pill. Funny Side v1.
//
// Ambient life is a timer-driven state machine (never awaited promises, so
// an interaction can always cancel cleanly and life always resumes):
//   idle → walk to a random spot → maybe sit → idle → …
// Interactions preempt the plan and hand control back when they finish:
//   click        → wave (two-finger salute) + a dry speech bubble
//   double-click → jump (escalates a wave in progress)
//   5 fast clicks→ dizzy wobble ("ok ow.")
//   hover        → review (she watches you) while the pointer stays
//
// Frames are feet-anchored on one shared canvas (pet-pipeline/normalize.js)
// so the body never jitters between frames; the jump arc is code-driven
// translateY per frame. Effects (bubble, wobble) are DOM/CSS, never frames.
// Reduced motion: one static idle frame, no timers.

import { useEffect, useRef, useState } from "react";

const BASE = "/images/pets/funny-side/";
const FRAMES = {
  idle:    { srcs: ["idle-1", "idle-2", "idle-3", "idle-4"], fps: 2.2 },
  waving:  { srcs: ["waving-1", "waving-2", "waving-3", "waving-4"], fps: 5, once: true },
  jumping: { srcs: ["jumping-1", "jumping-2", "jumping-3", "jumping-4"], fps: 6, once: true,
             lift: [0, -14, -20, 0] }, // code-driven arc: feet are pinned in the frames
  review:  { srcs: ["review-1", "review-2", "review-3", "review-4"], fps: 3 },
  sitting: { srcs: ["funny-side-sitting"], fps: 0 },
};
const WALK = { src: BASE + "funny-side-walk-cycle.png", frames: 5, w: 255, h: 325 };

const PET_H = 56;             // on-screen sprite height (px)
const WALK_SPEED = 30;        // px/s along the pill
const BUBBLES = ["psst.", "ask away.", "the brief's right here.", "no numbers yet. still cool.", "he designs. i deflect."];

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

export default function ChatPet() {
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef(null);
  const imgRef = useRef(null);
  const bubbleRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current, img = imgRef.current;
    if (!root || !img) return;

    Object.values(FRAMES).flatMap(f => f.srcs).forEach(s => { const i = new Image(); i.src = BASE + s + ".png"; });

    const walkEl = root.querySelector(".cp-walk");
    const flipEl = root.querySelector(".cp-flip");

    // ---- low-level sprite control -------------------------------------
    let x = 0.78;              // fraction of pill width
    let frameTimer = null, walkRaf = null, planTimer = null;
    let busy = false;          // an interaction owns the sprite
    let hovering = false;
    let alive = true;

    const applyX = (dir) => {
      root.style.left = (x * 100) + "%";
      if (dir) flipEl.style.transform = dir === 1 ? "scaleX(-1)" : "scaleX(1)";
    };
    const stopFrames = () => { clearTimeout(frameTimer); frameTimer = null; flipEl.style.translate = "0 0"; };
    const stopWalk = () => { if (walkRaf) cancelAnimationFrame(walkRaf); walkRaf = null; };
    const stopPlan = () => { clearTimeout(planTimer); planTimer = null; };
    const halt = () => { stopFrames(); stopWalk(); stopPlan(); };

    // Play an img frame set. `done` fires when a `once` set completes.
    const play = (mode, done) => {
      const spec = FRAMES[mode];
      stopFrames();
      walkEl.style.display = "none";
      img.style.display = "block";
      let i = 0;
      img.src = BASE + spec.srcs[0] + ".png";
      if (spec.lift) flipEl.style.translate = "0 0";
      if (spec.srcs.length < 2) { done?.(); return; }
      const tick = () => {
        i++;
        if (spec.once && i >= spec.srcs.length) {
          stopFrames();
          flipEl.style.translate = "0 0";
          done?.();
          return;
        }
        const fi = i % spec.srcs.length;
        img.src = BASE + spec.srcs[fi] + ".png";
        if (spec.lift) flipEl.style.translate = `0 ${spec.lift[fi]}px`;
        frameTimer = setTimeout(tick, 1000 / spec.fps);
      };
      frameTimer = setTimeout(tick, 1000 / spec.fps);
      if (!spec.once) done?.();
    };

    // Walk toward a target x; onDone fires on arrival (not if cancelled).
    const walkTo = (targetX, onDone) => {
      const dir = targetX > x ? 1 : -1;
      stopFrames();
      img.style.display = "none";
      walkEl.style.display = "block";
      const scale = PET_H / WALK.h;
      const stepW = WALK.w * scale;
      let last = performance.now(), acc = 0, wf = 0;
      walkEl.style.backgroundPositionX = "0px";
      const step = (now) => {
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        const w = root.parentElement?.clientWidth || 600;
        x += (dir * WALK_SPEED * dt) / w;
        acc += dt;
        if (acc > 0.11) { acc = 0; wf = (wf + 1) % WALK.frames; walkEl.style.backgroundPositionX = (-wf * stepW) + "px"; }
        applyX(dir);
        if ((dir === 1 && x >= targetX) || (dir === -1 && x <= targetX)) {
          walkRaf = null;
          onDone?.();
          return;
        }
        walkRaf = requestAnimationFrame(step);
      };
      walkRaf = requestAnimationFrame(step);
    };

    // ---- autonomous plan: schedule → act → schedule again --------------
    const schedule = (ms) => {
      stopPlan();
      planTimer = setTimeout(act, ms);
    };
    const act = () => {
      if (!alive || busy || hovering) { schedule(800); return; }
      const roll = Math.random();
      if (roll < 0.5) {
        walkTo(rand(0.08, 0.92), () => { play("idle"); schedule(rand(2500, 6000)); });
      } else if (roll < 0.7) {
        play("sitting");
        schedule(rand(4000, 9000));
      } else {
        play("idle");
        schedule(rand(3000, 7000));
      }
    };
    // Hand control back to the plan after an interaction.
    const resume = (delay = 1200) => {
      busy = false;
      if (hovering) { play("review"); return; }
      play("idle");
      schedule(delay);
    };

    // ---- interactions --------------------------------------------------
    const bubbleTimerRef = { t: null };
    const bubble = (text, ms = 2000) => {
      const b = bubbleRef.current;
      b.textContent = text;
      b.classList.add("cp-bubble-show");
      clearTimeout(bubbleTimerRef.t);
      bubbleTimerRef.t = setTimeout(() => b.classList.remove("cp-bubble-show"), ms);
    };

    let clicks = [];
    const onClick = (e) => {
      e.stopPropagation();
      const now = Date.now();
      clicks = [...clicks.filter(t => now - t < 1600), now];
      if (clicks.length >= 5) {
        clicks = [];
        halt(); busy = true;
        root.classList.add("cp-dizzy");
        bubble("ok ow.");
        play("idle");
        setTimeout(() => { root.classList.remove("cp-dizzy"); resume(); }, 1400);
        return;
      }
      if (busy) return;              // wave/jump already running
      halt(); busy = true;           // react INSTANTLY — no debounce lag
      bubble(pick(BUBBLES));
      play("waving", () => resume());
    };
    const onDbl = (e) => {
      e.stopPropagation();
      halt(); busy = true;           // escalate whatever is playing to a jump
      play("jumping", () => resume());
    };
    const onEnter = () => {
      hovering = true;
      if (busy) return;
      halt();
      play("review");
    };
    const onLeave = () => {
      hovering = false;
      if (!busy) resume(600);
    };

    root.addEventListener("click", onClick);
    root.addEventListener("dblclick", onDbl);
    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("mouseleave", onLeave);

    applyX(-1);
    play("idle");
    schedule(rand(1200, 2600));

    return () => {
      alive = false;
      halt();
      clearTimeout(bubbleTimerRef.t);
      root.removeEventListener("click", onClick);
      root.removeEventListener("dblclick", onDbl);
      root.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  const scale = PET_H / WALK.h;
  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="cp-root"
      style={{
        position: "absolute",
        bottom: "100%",
        left: "78%",
        marginBottom: -2,
        height: PET_H,
        transform: "translateX(-50%)",
        cursor: "pointer",
        zIndex: 1,
        pointerEvents: "auto",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* speech bubble — white card + hairline + tail, matches the site's
          chat aesthetic. DOM-only, never baked into frames. */}
      <span ref={bubbleRef} className="cp-bubble" />

      {/* flip container: art faces left; walking right mirrors it.
          translate on this element carries the jump arc. */}
      <div className="cp-flip" style={{ height: "100%", transformOrigin: "center bottom", transition: "translate 120ms ease-out" }}>
        <img
          ref={imgRef}
          src={BASE + "idle-1.png"}
          alt=""
          draggable={false}
          style={{ height: "100%", width: "auto", imageRendering: "pixelated", display: "block" }}
        />
        <div
          className="cp-walk"
          style={{
            display: "none",
            width: Math.round(WALK.w * scale),
            height: PET_H,
            backgroundImage: `url('${WALK.src}')`,
            backgroundSize: `${Math.round(WALK.frames * WALK.w * scale)}px ${PET_H}px`,
            imageRendering: "pixelated",
          }}
        />
      </div>

      <style jsx>{`
        .cp-bubble {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%) translateY(6px) scale(0.9);
          background: #ffffff;
          color: #0a0a0a;
          border: 1px solid #e5e5e5;
          box-shadow: 0 4px 14px -6px rgba(0, 0, 0, 0.18);
          font: 400 12px/1.4 Inter, sans-serif;
          letter-spacing: 0.01em;
          padding: 5px 11px;
          border-radius: 999px;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 180ms ease, transform 220ms cubic-bezier(0.34, 1.4, 0.64, 1);
          pointer-events: none;
        }
        .cp-bubble::after {
          content: "";
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-55%) rotate(45deg);
          width: 8px;
          height: 8px;
          background: #ffffff;
          border-right: 1px solid #e5e5e5;
          border-bottom: 1px solid #e5e5e5;
        }
        :global(.cp-bubble.cp-bubble-show) {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
        }
        :global(.cp-dizzy) .cp-flip {
          animation: cp-wobble 0.35s ease-in-out infinite;
        }
        @keyframes cp-wobble {
          0%, 100% { rotate: -6deg; }
          50% { rotate: 6deg; }
        }
      `}</style>
    </div>
  );
}
