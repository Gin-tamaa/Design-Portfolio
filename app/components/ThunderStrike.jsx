"use client";

// Lightning strike that punctuates the handoff — the beat where thinking
// resolves and the routed agent steps up. The bolt is rotated to travel
// HORIZONTALLY: it streaks in from the left, growing 1→8 as it crosses,
// flashes at full length, then fades — and the agent is revealed in its
// wake. Purely decorative: absolutely positioned, pointer-events none.
//
// Reduced motion: renders nothing and reports done immediately.

import { useEffect, useRef, useState } from "react";

const FRAMES = 8;
const FRAME_MS = 42;   // grow: ~340ms total
const HOLD_MS = 150;   // full bolt lingers
const FADE_MS = 260;

export default function ThunderStrike({ onDone }) {
  const [frame, setFrame] = useState(1);
  const [fading, setFading] = useState(false);
  const [reduced, setReduced] = useState(false);
  // The parent re-renders ~60x/sec while the answer streams. Holding onDone
  // in a ref (and running the effect ONCE) keeps those re-renders from
  // restarting the sequence — otherwise the timer never survives to fire
  // and the bolt freezes on frame 1.
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      doneRef.current?.();
      return;
    }
    let i = 1, t;
    const step = () => {
      i++;
      if (i > FRAMES) {
        t = setTimeout(() => {
          setFading(true);
          t = setTimeout(() => doneRef.current?.(), FADE_MS);
        }, HOLD_MS);
        return;
      }
      setFrame(i);
      t = setTimeout(step, FRAME_MS);
    };
    t = setTimeout(step, FRAME_MS);
    return () => clearTimeout(t);
  }, []);

  if (reduced) return null;

  // travel: frame 1 enters at the far left, frame 8 lands on the avatar
  const progress = (frame - 1) / (FRAMES - 1);

  return (
    <span className={`ts-wrap ${fading ? "ts-fade" : ""}`} aria-hidden="true">
      <img
        src={`/images/thunder/bolt-${frame}.png`}
        alt=""
        className="ts-bolt"
        draggable={false}
        style={{ transform: `translateX(${(progress - 1) * 26}px) rotate(90deg)` }}
      />
      <style jsx>{`
        .ts-wrap {
          position: absolute;
          left: 10px;
          top: 50%;
          translate: -50% -50%;
          pointer-events: none;
          z-index: 5;
          transition: opacity ${FADE_MS}ms ease-out;
          opacity: 1;
        }
        .ts-fade { opacity: 0; }
        .ts-bolt {
          display: block;
          height: 54px;
          width: auto;
          image-rendering: pixelated;
          transform-origin: center;
        }
      `}</style>
    </span>
  );
}
