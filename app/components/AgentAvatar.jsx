"use client";

// Per-persona avatar: a colored CSS circle with the raw transparent pixel
// portrait positioned on top using the EXACT Figma crop ratios from node
// 162:1223 / 164:1245. Same numbers used everywhere — 18px inline cluster,
// 20px chat header, 24px thinking row, 108px empty state — so framing is
// identical across the site.

import { useEffect, useState } from "react";

// Each persona has a bg color + per-pose URL + per-pose Figma crop.
// `crop.cover` means object-fit:cover at 100% (used for poses Figma
// composited that way). Numeric crops are { top, left, width, height }
// as % of the container, exactly as the Figma frames specify.
export const AGENT_AVATARS = {
  "creative-head": {
    bg: "#8dbded",
    default: {
      url: "/images/agents-chat-raw/creative-head.png",
      crop: { top: -0.19, left: -11.18, width: 122.35, height: 183.53 },
    },
    thinking: {
      url: "/images/agents-chat-raw/creative-head-thinking.png",
      crop: { cover: true },
    },
  },
  "ai-tinkerer": {
    bg: "#b08ded",
    default: {
      url: "/images/agents-chat-raw/ai-tinkerer.png",
      crop: { top: -0.91, left: -11.32, width: 122.63, height: 184.25 },
    },
    thinking: {
      url: "/images/agents-chat-raw/ai-tinkerer-thinking.png",
      crop: { top: -6.7, left: 0, width: 100, height: 150.29 },
    },
  },
  "vibe-coder": {
    bg: "#edd78d",
    default: {
      url: "/images/agents-chat-raw/vibe-coder.png",
      crop: { top: -10.61, left: -10.62, width: 121.24, height: 224.33 },
    },
    thinking: {
      url: "/images/agents-chat-raw/vibe-coder-thinking.png",
      crop: { cover: true },
    },
  },
  "funny-side": {
    bg: "#ed8dc2",
    default: {
      url: "/images/agents-chat-raw/funny-side.png",
      crop: { top: -0.37, left: -23.51, width: 147.02, height: 183.71 },
    },
    thinking: {
      url: "/images/agents-chat-raw/funny-side-thinking.png",
      crop: { top: -11.11, left: -3.92, width: 107.85, height: 134.81 },
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
