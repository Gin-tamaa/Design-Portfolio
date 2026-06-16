"use client";

// Brand Memory, "The problem" visual. Light-theme prompt-input mock
// that cycles between two states to dramatize the difference Brand
// Memory makes:
//
//   off  : the pre-memory state, the brief had to spell the brand
//          out every time
//   on   : Brand Memory engaged, shorter prompt, the system fills
//          in the rest from context
//
// Each cycle the toggle flips, the accent shifts from neutral to
// green, and the prompt text retypes character by character.
//
// Reduced motion → snap straight to the ON state, no typing loop.

import { useEffect, useRef, useState } from "react";
import { Plus, ArrowUp } from "lucide-react";

const STATES = [
  {
    name: "off",
    text:
      "make a hero shot, cream palette, negative space, logo small and bottom right, slate background, soft top-down light, no people",
    pillBorder: "rgba(0, 0, 0, 0.10)",
    trackBg: "rgba(0, 0, 0, 0.18)",
    thumbAlign: "left",
    labelInk: "rgba(20, 22, 27, 0.55)",
  },
  {
    name: "on",
    text: "make a hero shot, warm and minimal, cinematic lighting",
    pillBorder: "rgba(91, 214, 160, 0.55)",
    trackBg: "rgb(91, 214, 160)",
    thumbAlign: "right",
    labelInk: "rgb(53, 161, 117)",
  },
];

const SURFACE = "#ffffff";
const INK = "rgb(20, 22, 27)";
const HAIRLINE = "rgba(0, 0, 0, 0.08)";
const TYPE_MS = 28; // ms per character while typing
const HOLD_MS = 2200; // ms to hold a state once fully typed

export default function PromptInput() {
  const [stateIdx, setStateIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const typingDoneRef = useRef(false);

  // Type the current state's prompt out one character at a time. When
  // it finishes, hold for HOLD_MS then flip to the next state.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      // Reduced motion: park on the ON state with full text, no loop.
      setStateIdx(1);
      setTyped(STATES[1].text);
      return;
    }

    const target = STATES[stateIdx].text;
    setTyped("");
    typingDoneRef.current = false;

    let i = 0;
    const tick = setInterval(() => {
      i += 1;
      setTyped(target.slice(0, i));
      if (i >= target.length) {
        clearInterval(tick);
        typingDoneRef.current = true;
      }
    }, TYPE_MS);

    // Once typing finishes, hold and advance. Polling is cheaper than
    // wiring another effect, and the interval clears either way.
    const advance = setInterval(() => {
      if (!typingDoneRef.current) return;
      clearInterval(advance);
      const hold = setTimeout(() => {
        setStateIdx((s) => (s + 1) % STATES.length);
      }, HOLD_MS);
      // Carry the hold timer's cleanup back to the outer effect.
      cleanups.push(() => clearTimeout(hold));
    }, 60);

    const cleanups = [() => clearInterval(tick), () => clearInterval(advance)];
    return () => cleanups.forEach((fn) => fn());
  }, [stateIdx]);

  const state = STATES[stateIdx];

  return (
    <div
      className="w-full"
      style={{
        background: SURFACE,
        borderRadius: 20,
        padding: "16px 16px 12px",
        border: `1px solid ${HAIRLINE}`,
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.04), 0 14px 38px -10px rgba(0,0,0,0.12)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div className="flex flex-col" style={{ gap: 12 }}>
        {/* Prompt text, retypes each cycle. Cursor blinks via
            .prompt-cursor in globals.css. */}
        <div
          aria-label="Prompt input mock"
          style={{
            minHeight: 54,
            fontSize: 15,
            lineHeight: 1.5,
            color: INK,
            fontWeight: 400,
          }}
        >
          {typed}
          <span className="prompt-cursor" aria-hidden="true">
            |
          </span>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between">
          {/* Left, plus + Brand memory toggle */}
          <div className="flex items-center" style={{ gap: 8 }}>
            {/* Plus button */}
            <button
              type="button"
              tabIndex={-1}
              aria-label="Attach"
              className="flex items-center justify-center"
              style={{
                width: 32,
                height: 32,
                borderRadius: 9999,
                border: `1px solid ${HAIRLINE}`,
                background: "transparent",
                color: INK,
              }}
            >
              <Plus size={16} strokeWidth={2} />
            </button>

            {/* Brand memory toggle pill. Border + label flip accent
                with the state, track + thumb position animate. */}
            <div
              className="flex items-center"
              style={{
                height: 32,
                paddingLeft: 8,
                paddingRight: 14,
                borderRadius: 9999,
                border: `1px solid ${state.pillBorder}`,
                gap: 8,
                transition:
                  "border-color 300ms ease, background-color 300ms ease",
              }}
            >
              {/* Track */}
              <div
                role="switch"
                aria-checked={state.name === "on"}
                aria-label="Brand memory"
                style={{
                  width: 33,
                  height: 18,
                  borderRadius: 9999,
                  background: state.trackBg,
                  position: "relative",
                  flexShrink: 0,
                  transition: "background-color 300ms ease",
                }}
              >
                {/* Thumb */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 2,
                    left: state.thumbAlign === "right" ? 17 : 2,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: "#ffffff",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.18)",
                    transition: "left 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: state.labelInk,
                  lineHeight: 1,
                  transition: "color 300ms ease",
                }}
              >
                Brand memory
              </span>
            </div>
          </div>

          {/* Right, send arrow, dark button on light surface */}
          <button
            type="button"
            tabIndex={-1}
            aria-label="Send"
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 9999,
              background: INK,
              color: "#ffffff",
            }}
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
