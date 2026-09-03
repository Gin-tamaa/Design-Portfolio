"use client";

// TWO avatar treatments, deliberately different:
//
//   AgentAvatar (default export) — the new head portraits from
//     public/images/faces, no circle and no backdrop. Used on the message
//     header, matching the chat empty state so the two read as one system.
//
//   CyclingAgentAvatar — the ORIGINAL circular pose avatars (colored disc +
//     full-body crop, default↔thinking swap). The thinking cluster relies
//     on those coloured discs overlapping with white rings to read as a
//     crowd; flat cut-out heads lose that, so the loader keeps the old art.

import { useEffect, useState } from "react";

// The shared canvas has a little transparent margin around each head, so
// the portrait is scaled slightly past its box to fill the avatar footprint
// instead of floating small inside it. The `thinking` variant reuses the
// same art — the ThinkingIndicator conveys activity through motion and copy.
export const AGENT_AVATARS = {
  "creative-head": { url: "/images/faces/creative-head.png" },
  "ai-tinkerer":   { url: "/images/faces/ai-tinkerer.png" },
  "vibe-coder":    { url: "/images/faces/vibe-coder.png" },
  "funny-side":    { url: "/images/faces/funny-side.png" },
};

// portraits carry transparent padding — scale past the box so the head
// actually fills the avatar's footprint
const FILL_SCALE = 1.28;

// Legacy circular avatars — kept for the thinking cluster only.
const LEGACY_AVATARS = {
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
const LEGACY_SCALE = 1.8;

// Legacy circle avatar: coloured disc, full-body pose zoomed to a torso-up
// crop, optional white ring so overlapping avatars stay separable.
function LegacyAvatar({ persona, state = "default", size = 24, ring = "none", className = "" }) {
  const data = LEGACY_AVATARS[persona];
  if (!data) {
    return (
      <span className={`block rounded-full bg-[#E5E5E5] ${className}`}
        style={{ width: size, height: size }} aria-hidden="true" />
    );
  }
  const pose = state === "thinking" && data.thinking ? data.thinking : data.default;
  const ringStyle =
    ring === "white" ? { outline: "1px solid #ffffff", outlineOffset: "-1px" } : null;
  return (
    <span
      className={`relative inline-block overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size, background: data.bg, ...ringStyle }}
    >
      <img
        src={pose.url}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "top center",
          transform: `scale(${LEGACY_SCALE}) translateY(${pose.translateY})`,
          transformOrigin: "top center",
        }}
      />
    </span>
  );
}

// Internal — the portrait inside the circle. Sits slightly proud of the
// bottom edge so the head fills the circle rather than floating in it.
function Pose({ url }) {
  const style = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "center",
    transform: `scale(${FILL_SCALE})`,
    imageRendering: "pixelated",
  };
  return <img src={url} alt="" aria-hidden="true" draggable={false} style={style} />;
}

// Static avatar — colored bg circle + portrait inside.
//   persona   kebab-case id (matches API)
//   state     "default" | "thinking"
//   size      px
//   ring      accepted but a no-op now that avatars have no disc to ring;
//             kept so existing callers (the thinking cluster) still work.
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
        className={`block ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }
  return (
    <span
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <Pose url={data.url} />
    </span>
  );
}

// Cycling avatar — the thinking cluster's circular avatar, swapping
// default ↔ thinking on a short loop so the agent reads as alive.
// `offset` lets a row stagger so they don't twitch in lockstep.
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
    <LegacyAvatar
      persona={persona}
      state={showThinking ? "thinking" : "default"}
      size={size}
      ring={ring}
      className={className}
    />
  );
}
