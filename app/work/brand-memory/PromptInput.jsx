"use client";

// Static prompt-input mock used as the visual placeholder for "The
// problem" section of the Brand Memory case study. Renders the
// before-memory state of the product: a designer typing out the
// whole brand brief manually because the model has no idea who the
// brand is yet.
//
// Visual spec from the user's brief: deep midnight surface
// (rgb(12,14,19)), 20px radius, layered shadow, Inter as the
// sans-serif body (Geist isn't on this site, Inter is the next
// best match in the loaded font set). Plus + ArrowUp icons come
// from lucide-react.

import { Plus, ArrowUp } from "lucide-react";

const SURFACE = "rgb(12, 14, 19)";
const INK = "rgba(235, 238, 242, 0.95)";
const HAIRLINE = "rgba(255, 255, 255, 0.12)";

export default function PromptInput() {
  return (
    <div
      className="w-full"
      style={{
        background: SURFACE,
        borderRadius: 20,
        padding: "16px 16px 12px",
        boxShadow:
          "0 12px 16px rgba(0,0,0,0.2), 0 40px 80px -50px rgba(0,0,0,0.9)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div className="flex flex-col" style={{ gap: 12 }}>
        {/* Prompt text + blinking cursor */}
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
          make a hero shot, cream palette, negative space, logo small
          and bot
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

            {/* Brand memory toggle pill */}
            <div
              className="flex items-center"
              style={{
                height: 32,
                paddingLeft: 8,
                paddingRight: 14,
                borderRadius: 9999,
                border: `1px solid ${HAIRLINE}`,
                gap: 8,
              }}
            >
              {/* Toggle switch, ON state (Brand memory engaged) */}
              <div
                style={{
                  width: 33,
                  height: 18,
                  borderRadius: 9999,
                  background: "rgba(235, 238, 242, 0.95)",
                  position: "relative",
                  flexShrink: 0,
                }}
                role="switch"
                aria-checked="true"
                aria-label="Brand memory"
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: SURFACE,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: INK,
                  lineHeight: 1,
                }}
              >
                Brand memory
              </span>
            </div>
          </div>

          {/* Right, send arrow */}
          <button
            type="button"
            tabIndex={-1}
            aria-label="Send"
            className="flex items-center justify-center"
            style={{
              width: 32,
              height: 32,
              borderRadius: 9999,
              background: "rgb(255, 255, 255)",
              color: SURFACE,
            }}
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
