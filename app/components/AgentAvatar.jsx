"use client";

// Per-persona avatar: a colored CSS circle with the raw transparent pixel
// portrait positioned on top using the EXACT Figma crop ratios from node
// 162:1223 / 164:1245. Same numbers used everywhere — 18px inline cluster,
// 20px chat header, 24px thinking row, 108px empty state — so framing is
// identical across the site.

import { useEffect, useState } from "react";

// Each persona has a bg color + per-pose URL + per-pose crop. The `left`
// values below are computed from the actual character centroid measured
// in each source PNG (alpha-bbox center, not image center) so the
// CHARACTER — not the empty padding around it — sits at the circle's
// horizontal center. Figma's stock crops centered the image, which left
// characters with off-center bodies (e.g. Creative Head body at 46.83%
// of source) visibly shifted left in the circle.
//
// Formula:  left = 50% - cx% × width%/100%
// where cx% is the measured opaque-bbox center as % of source width.
//
// Numeric crops are { top, left, width, height } as % of container.
export const AGENT_AVATARS = {
  "creative-head": {
    bg: "#8dbded",
    default: {
      // cx 46.83% — shifted noticeably left of image center, recentered.
      url: "/images/agents-chat-raw/creative-head.png",
      crop: { top: -0.19, left: -7.3, width: 122.35, height: 183.53 },
    },
    thinking: {
      // cx 55.18% — slightly right of image center, recentered.
      url: "/images/agents-chat-raw/creative-head-thinking.png",
      crop: { top: -2, left: -5.18, width: 100, height: 100 },
    },
  },
  "ai-tinkerer": {
    bg: "#b08ded",
    default: {
      // cx 48.58%
      url: "/images/agents-chat-raw/ai-tinkerer.png",
      crop: { top: -0.91, left: -9.57, width: 122.63, height: 184.25 },
    },
    thinking: {
      // cx 50.59%, source aspect 2:3 → keep height 150.29
      url: "/images/agents-chat-raw/ai-tinkerer-thinking.png",
      crop: { top: -6.7, left: -0.59, width: 100, height: 150.29 },
    },
  },
  "vibe-coder": {
    bg: "#edd78d",
    default: {
      // cx 50.22% — already very close to centered.
      url: "/images/agents-chat-raw/vibe-coder.png",
      crop: { top: -10.61, left: -10.89, width: 121.24, height: 224.33 },
    },
    thinking: {
      // cx 51.14%, source aspect 0.54 → height 185 keeps no-distortion
      url: "/images/agents-chat-raw/vibe-coder-thinking.png",
      crop: { top: 0, left: -1.14, width: 100, height: 185 },
    },
  },
  "funny-side": {
    bg: "#ed8dc2",
    default: {
      // cx 46.26% — biggest left-bias of the four (boombox eats left
      // side of frame, character body sits left of source center).
      url: "/images/agents-chat-raw/funny-side.png",
      crop: { top: -0.37, left: -18.01, width: 147.02, height: 183.71 },
    },
    thinking: {
      // cx 50.05% — essentially centered already.
      url: "/images/agents-chat-raw/funny-side-thinking.png",
      crop: { top: -11.11, left: -3.98, width: 107.85, height: 134.81 },
    },
  },
};

// Internal — render a single positioned pose.
function Pose({ crop, url }) {
  const style = crop.cover
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center top",
      }
    : {
        position: "absolute",
        top: `${crop.top}%`,
        left: `${crop.left}%`,
        width: `${crop.width}%`,
        height: `${crop.height}%`,
      };
  return <img src={url} alt="" aria-hidden="true" draggable={false} style={style} />;
}

// Static avatar — colored bg circle + portrait inside.
//   persona   kebab-case id (matches API)
//   state     "default" | "thinking"
//   size      px
//   ring      "white" | none — adds a 1px white outline. Used by the
//             Figma 164:1245 inline cluster so overlapping circles
//             stay readable as separate avatars.
export default function AgentAvatar({
  persona,
  state = "default",
  size = 24,
  ring = "none",
  className = "",
}) {
  const data = AGENT_AVATARS[persona];
  if (!data) {
    return (
      <span
        className={`block rounded-full bg-[#E5E5E5] ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }
  const pose = state === "thinking" && data.thinking ? data.thinking : data.default;
  // White ring goes on the OUTSIDE via outline (overflow:hidden inside the
  // circle would clip an inset shadow). Doesn't add to layout box size.
  const ringStyle =
    ring === "white"
      ? { outline: "1px solid #ffffff", outlineOffset: "-1px" }
      : null;
  return (
    <span
      className={`relative inline-block overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size, background: data.bg, ...ringStyle }}
    >
      <Pose crop={pose.crop} url={pose.url} />
    </span>
  );
}

// Cycling avatar — swaps default ↔ thinking on a short loop so the agent
// reads as alive while it's thinking. `offset` lets a row stagger so they
// don't twitch in lockstep.
const FRAME_INTERVAL = 460;
export function CyclingAgentAvatar({
  persona,
  size = 24,
  ring = "none",
  className = "",
  offset = 0,
  reducedMotion = false,
}) {
  const [showThinking, setShowThinking] = useState(false);
  useEffect(() => {
    if (reducedMotion) return;
    let interval = null;
    const startDelay = setTimeout(() => {
      setShowThinking(true);
      interval = setInterval(() => setShowThinking((v) => !v), FRAME_INTERVAL);
    }, offset);
    return () => {
      clearTimeout(startDelay);
      if (interval) clearInterval(interval);
    };
  }, [reducedMotion, offset]);
  return (
    <AgentAvatar
      persona={persona}
      state={showThinking ? "thinking" : "default"}
      size={size}
      ring={ring}
      className={className}
    />
  );
}
