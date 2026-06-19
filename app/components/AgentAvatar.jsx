"use client";

// Per-persona avatar: a colored CSS circle with the raw transparent pixel
// portrait positioned on top using the EXACT Figma crop ratios from node
// 162:1223 / 164:1245. Same numbers used everywhere — 18px inline cluster,
// 20px chat header, 24px thinking row, 108px empty state — so framing is
// identical across the site.

import { useEffect, useState } from "react";

// Alignment approach (validated externally — see chat history):
//   - object-fit: cover + object-position: top center → character anchored
//     to the top of the circle so the head stays in frame.
//   - transform: scale(1.8) translateY(12%) → zooms into the top-of-frame
//     portion of the source PNG (which is shot full-body) so what's left
//     visible is a torso-up crop, not legs.
//   - Vibe Coder needs translateY(8%) — its source PNG has the character
//     positioned LOWER in the frame, so the standard 12% over-shifts it
//     down and clips the head. 8% lifts it back to match the others.
// No per-persona width/height/top/left crops anywhere — those caused the
// stretched + left-biased look this avatar atlas was originally built to
// hide. Keep it simple: cover + top-center + scale + a single translateY.
export const AGENT_AVATARS = {
  "creative-head": {
    bg: "#8dbded",
    default: { url: "/images/agents-chat-raw/creative-head.png", translateY: "12%" },
    thinking: { url: "/images/agents-chat-raw/creative-head-thinking.png", translateY: "12%" },
  },
  "ai-tinkerer": {
    bg: "#b08ded",
    default: { url: "/images/agents-chat-raw/ai-tinkerer.png", translateY: "12%" },
    thinking: { url: "/images/agents-chat-raw/ai-tinkerer-thinking.png", translateY: "12%" },
  },
  "vibe-coder": {
    bg: "#edd78d",
    default: { url: "/images/agents-chat-raw/vibe-coder.png", translateY: "8%" },
    thinking: { url: "/images/agents-chat-raw/vibe-coder-thinking.png", translateY: "8%" },
  },
  "funny-side": {
    bg: "#ed8dc2",
    default: { url: "/images/agents-chat-raw/funny-side.png", translateY: "12%" },
    thinking: { url: "/images/agents-chat-raw/funny-side-thinking.png", translateY: "12%" },
  },
};

const AVATAR_SCALE = 1.8;

// Internal — render the persona portrait inside the circle. See the
// "Alignment approach" comment on AGENT_AVATARS for the rationale; this
// component is just the visual carrier of those rules.
function Pose({ url, translateY }) {
  const style = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "top center",
    transform: `scale(${AVATAR_SCALE}) translateY(${translateY})`,
    transformOrigin: "top center",
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
      <Pose url={pose.url} translateY={pose.translateY} />
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
