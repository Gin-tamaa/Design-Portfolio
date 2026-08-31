"use client";

// Vibe Coder — the parked pet. Sits cross-legged at the RIGHT corner of the
// chat pill with his sticker-covered laptop and codes, forever. The
// anti-Funny-Side: she wanders, he does not move. Everything routes through
// the laptop.
//
// Ambient plan (timer FSM, same cancel-safe shape as ChatPet):
//   coding → sometimes FLOW (hood up, hunched) → sometimes lean-back review
//   → rare HOTWIRE (crawls behind the laptop, sparks) → rare spontaneous
//   combustion (smoke → slam → head-desk, then back to coding like nothing
//   happened).
// Interactions:
//   click        → doesn't look up; dry dev one-liner bubble + brief lean-back
//   double-click → SHIP IT (leaps with laptop overhead, code-driven arc)
//   5 fast clicks→ rage: keyboard slam frames + shake ("who touched prod.")
//   hover        → review (lean back, arms crossed, judging you)
// Reduced motion: one static coding frame, no timers.

import { useEffect, useRef, useState } from "react";

const BASE = "/images/pets/vibe-coder/";
const FRAMES = {
  coding:  { srcs: ["idle-1", "idle-2", "idle-3", "idle-4"], fps: 2.4 },
  flow:    { srcs: ["running-1", "running-2", "running-3"], fps: 4 },
  broke:   { srcs: ["failed-1", "failed-2", "failed-3", "failed-4"], fps: 3, once: true },
  shipit:  { srcs: ["jumping-1", "jumping-2", "jumping-3", "jumping-4"], fps: 5, once: true,
             lift: [0, -10, -18, 0] },
  hotwire: { srcs: ["hotwire-1", "hotwire-2", "hotwire-3", "hotwire-4"], fps: 2.2, once: true },
  review:  { srcs: ["review-1", "review-2", "review-4"], fps: 2.5 },
  slam:    { srcs: ["failed-2", "failed-3", "failed-2", "failed-3"], fps: 6, once: true },
};

const PET_H = 46; // seated sprite height (px) — reads smaller than a stander
const BUBBLES = ["it compiles. barely.", "works on my machine.", "shipping.", "don't touch prod.", "one more dependency."];

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

export default function VibeCoderPet() {
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

    const holdEl = root.querySelector(".vcp-hold");
    let frameTimer = null, planTimer = null;
    let busy = false, hovering = false, alive = true;

    const stopFrames = () => { clearTimeout(frameTimer); frameTimer = null; holdEl.style.translate = "0 0"; };
    const stopPlan = () => { clearTimeout(planTimer); planTimer = null; };
    const halt = () => { stopFrames(); stopPlan(); };

    const play = (mode, done) => {
      const spec = FRAMES[mode];
      stopFrames();
      let i = 0;
      img.src = BASE + spec.srcs[0] + ".png";
      if (spec.srcs.length < 2) { done?.(); return; }
      const tick = () => {
        i++;
        if (spec.once && i >= spec.srcs.length) {
          stopFrames();
          done?.();
          return;
        }
        const fi = i % spec.srcs.length;
        img.src = BASE + spec.srcs[fi] + ".png";
        if (spec.lift) holdEl.style.translate = `0 ${spec.lift[fi]}px`;
        frameTimer = setTimeout(tick, 1000 / spec.fps);
      };
      frameTimer = setTimeout(tick, 1000 / spec.fps);
      if (!spec.once) done?.();
    };

    // ---- autonomous plan ----------------------------------------------
    const schedule = (ms) => { stopPlan(); planTimer = setTimeout(act, ms); };
    const act = () => {
      if (!alive || busy || hovering) { schedule(800); return; }
      const roll = Math.random();
      if (roll < 0.45) {                    // keep coding
        play("coding");
        schedule(rand(5000, 11000));
      } else if (roll < 0.72) {             // lock in
        play("flow");
        schedule(rand(3500, 7000));
      } else if (roll < 0.84) {             // lean back, judge own code
        play("review");
        schedule(rand(3000, 5500));
      } else if (roll < 0.93) {             // crawl behind the machine
        play("hotwire", () => { play("coding"); schedule(rand(4000, 8000)); });
      } else {                              // spontaneous combustion
        bubble("npm install went wrong.");
        play("broke", () => { play("coding"); schedule(rand(4000, 8000)); });
      }
    };
    const resume = (delay = 1500) => {
      busy = false;
      if (hovering) { play("review"); return; }
      play("coding");
      schedule(delay);
    };

    // ---- interactions --------------------------------------------------
    const bubbleTimerRef = { t: null };
    const bubble = (text, ms = 2200) => {
      const b = bubbleRef.current;
      b.textContent = text;
      b.classList.add("vcp-bubble-show");
      clearTimeout(bubbleTimerRef.t);
      bubbleTimerRef.t = setTimeout(() => b.classList.remove("vcp-bubble-show"), ms);
    };

    let clicks = [];
    const onClick = (e) => {
      e.stopPropagation();
      const now = Date.now();
      clicks = [...clicks.filter(t => now - t < 1600), now];
      if (clicks.length >= 5) {
        clicks = [];
        halt(); busy = true;
        root.classList.add("vcp-rage");
        bubble("who touched prod.");
        play("slam", () => {
          root.classList.remove("vcp-rage");
          resume();
        });
        return;
      }
      if (busy) return;
      halt(); busy = true;
      bubble(pick(BUBBLES));               // he does not look up for you
      play("review", () => {});
      setTimeout(() => resume(), 1400);
    };
    const onDbl = (e) => {
      e.stopPropagation();
      halt(); busy = true;
      play("shipit", () => resume());
    };
    const onEnter = () => { hovering = true; if (!busy) { halt(); play("review"); } };
    const onLeave = () => { hovering = false; if (!busy) resume(600); };

    root.addEventListener("click", onClick);
    root.addEventListener("dblclick", onDbl);
    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("mouseleave", onLeave);

    play("coding");
    schedule(rand(3000, 6000));

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

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="vcp-root"
      style={{
        position: "absolute",
        bottom: "100%",
        left: "94%",
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
      <span ref={bubbleRef} className="vcp-bubble" />

      <div className="vcp-hold" style={{ height: "100%", transformOrigin: "center bottom", transition: "translate 110ms ease-out" }}>
        <img
          ref={imgRef}
          src={BASE + "idle-1.png"}
          alt=""
          draggable={false}
          style={{ height: "100%", width: "auto", imageRendering: "pixelated", display: "block" }}
        />
      </div>

      <style jsx>{`
        .vcp-bubble {
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
        .vcp-bubble::after {
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
        :global(.vcp-bubble.vcp-bubble-show) {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
        }
        :global(.vcp-rage) .vcp-hold {
          animation: vcp-shake 0.16s linear infinite;
        }
        @keyframes vcp-shake {
          0%, 100% { margin-left: 0; }
          25% { margin-left: -2px; }
          75% { margin-left: 2px; }
        }
      `}</style>
    </div>
  );
}
