"use client";

// Per-persona avatar: a colored CSS circle with the raw pixel-art portrait
// positioned on top, cropped to mirror the Figma 162:1223 design exactly.
//
// Why this instead of pre-composited PNGs: the Figma source portraits are
// 1024+px transparent assets, so they scale crisp at 24px (chat header)
// and 108px (empty state) without the chunky "image-rendering: pixelated"
// look that 18×18 atlas screenshots produced.
//
// AGENT_AVATARS is keyed by the kebab-case persona id the API returns,
// so it drops in everywhere we already have PERSONAS[persona] semantics.

import { useEffect, useState } from "react";

// Each persona has a bg color, a default pose, and a thinking pose.
// Each pose carries its Figma crop (top/left/width/height as % of the
// circle's box; cover=true means object-fit:cover at 100×100% instead).
export const AGENT_AVATARS = {
  "creative-head": {
    bg: "#8dbded",
    default: {
      url: "/images/agents-chat-raw/creative-head.png",
      crop: { top: -0.19, left: -11.18, width: 122.35, height: 183.53 },
    },
    thinking: {
      url: "/images/agents-chat-raw/creative-head-thinking.png",
      crop: { top: 0, left: 0, width: 100, height: 100, cover: true },
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
      crop: { top: 0, left: 0, width: 100, height: 100, cover: true },
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

// Internal — render a single static pose at a given size.
function Pose({ crop, url, alt = "" }) {
  const style = crop.cover
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }
    : {
        position: "absolute",
        top: `${crop.top}%`,
        left: `${crop.left}%`,
        width: `${crop.width}%`,
        height: `${crop.height}%`,
      };
  return (
    <img
      src={url}
      alt={alt}
      aria-hidden={alt ? undefined : "true"}
      draggable={false}
      style={style}
    />
  );
}

// Static avatar — bg circle + one pose. Used by the chat message header
// and the empty state. `persona` is the kebab-case id the API returns.
export default function AgentAvatar({ persona, state = "default", size = 24, className = "" }) {
  const data = AGENT_AVATARS[persona];
  if (!data) {
    // Fallback: render a plain neutral circle if the persona isn't in the
    // atlas. Keeps the layout intact instead of bursting.
    return (
      <span
        className={`block rounded-full bg-[#E5E5E5] ${className}`}
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
    );
  }
  const pose = state === "thinking" && data.thinking ? data.thinking : data.default;
  return (
    <span
      className={`relative inline-block overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size, background: data.bg }}
    >
      <Pose crop={pose.crop} url={pose.url} />
    </span>
  );
}

// Cycling avatar — swaps default ↔ thinking on a short loop so the agent
// reads as alive while it's thinking. `offset` lets a row of 4 stagger
// their cycle so they don't twitch in lockstep.
const FRAME_INTERVAL = 460;

export function CyclingAgentAvatar({
  persona,
  size = 24,
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
      interval = setInterval(
        () => setShowThinking((v) => !v),
        FRAME_INTERVAL
      );
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
      className={className}
    />
  );
}
