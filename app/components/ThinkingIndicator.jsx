"use client";

// Two-phase, persona-flavored thinking state for the chat.
//
// Phase 1 ("team")     — row of 4 avatars + cycling team-assembly phrases.
//                         Trailing icon cycles through all 4 faces.
// Phase 1→2 ("handoff") — 3 non-chosen avatars fade away, the chosen one
//                         lifts to lead position. One handoff phrase plays.
// Phase 2 ("single")   — only the chosen persona, gentle bob + opacity
//                         loop, phrases shuffled from THINKING_PHRASES[p].
//
// All timing comes from the constants at the top so it's tunable in one
// spot. The component handles its own visual phase transitions (driven
// by PHASE1_FLOOR + HANDOFF_DURATION). The PARENT owns the global
// MIN_THINKING + reveal decision — this component only renders.
//
// Reduced motion: ignore intervals, render a single static phase that
// matches whichever lane the persona resolved to (or team if it hasn't
// resolved yet).

import { useEffect, useMemo, useRef, useState } from "react";

/* ============================================================================
   Data — phrases, persona maps, timing
============================================================================ */

const TEAM_PHRASES = [
  "Assembling the team",
  "Rounding up the crew",
  "The team huddles up",
  "Gathering the agents",
  "Crew syncing up",
  "Pulling everyone in",
  "The squad assembles",
  "Quick team huddle",
];

const HANDOFF_PHRASES = [
  "Tagging in the right one",
  "Handing it to a specialist",
  "One agent steps up",
];

const THINKING_PHRASES = {
  creativeHead: [
    "Sketching the idea",
    "Framing the problem",
    "Finding the through-line",
    "Weighing the tradeoffs",
    "Looking for a cleaner cut",
    "Pinning down the why",
    "Shaping the story",
    "Pushing past the obvious",
  ],
  vibeCoder: [
    "Wiring it up",
    "Compiling the thought",
    "Reading the source",
    "Checking the build",
    "Tracing the logic",
    "Refactoring the answer",
    "Hot-reloading",
    "Shipping it",
  ],
  aiTinkerer: [
    "Spinning up the agents",
    "Tuning the prompt",
    "Recruiting specialists",
    "Running the arc",
    "Routing the question",
    "Warming up the model",
    "Reading the brief",
    "Orchestrating a reply",
  ],
  funnySide: [
    "Cracking knuckles",
    "Thinking of a comeback",
    "Stalling for effect",
    "Sipping coffee",
    "Cooking something up",
    "Consulting the vibes",
    "Rolling up sleeves",
    "Buying time dramatically",
  ],
};

const PERSONA_COLORS = {
  creativeHead: "#7C5CFF",
  vibeCoder: "#3D6BE5",
  aiTinkerer: "#0E9FB8",
  funnySide: "#E0A93B",
};

// Two-state 8-bit avatar atlas (Figma 162:1223). `default` = idle pose,
// `thinking` = alternate pose. We swap between the two on a short loop
// while the agent is thinking, so the portrait reads as alive rather
// than a frozen still.
const PERSONA_AVATARS = {
  creativeHead: {
    default:  "/images/agents-chat/creative-head.png",
    thinking: "/images/agents-chat/creative-head-thinking.png",
  },
  vibeCoder: {
    default:  "/images/agents-chat/vibe-coder.png",
    thinking: "/images/agents-chat/vibe-coder-thinking.png",
  },
  aiTinkerer: {
    default:  "/images/agents-chat/ai-tinkerer.png",
    thinking: "/images/agents-chat/ai-tinkerer-thinking.png",
  },
  funnySide: {
    default:  "/images/agents-chat/funny-side.png",
    thinking: "/images/agents-chat/funny-side-thinking.png",
  },
};

const PERSONA_LABELS = {
  creativeHead: "Creative Head",
  vibeCoder: "Vibe Coder",
  aiTinkerer: "AI Tinkerer",
  funnySide: "Funny Side",
};

const ALL_PERSONAS = ["creativeHead", "vibeCoder", "aiTinkerer", "funnySide"];

// API returns kebab-case persona ids ("creative-head"); the data above
// keys by camelCase. Map between them once.
const KEBAB_TO_CAMEL = {
  "creative-head": "creativeHead",
  "vibe-coder": "vibeCoder",
  "ai-tinkerer": "aiTinkerer",
  "funny-side": "funnySide",
};

// Timing — tune at will.
const PHASE1_FLOOR = 800;     // ms — min team-assemble visible
const PHRASE_INTERVAL = 1700; // ms — phrase cycle interval
const CROSSFADE = 250;        // ms — phrase fade transition
const TRAIL_INTERVAL = 600;   // ms — trail icon swap interval (Phase 1)
const HANDOFF_DURATION = 500; // ms — 4→1 avatar transition
const FRAME_INTERVAL = 460;   // ms — default↔thinking swap on each avatar

/* ============================================================================
   Small helpers
============================================================================ */

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function lowerFirst(s) {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

/* ============================================================================
   CyclingText — phrase cycles every PHRASE_INTERVAL with CROSSFADE
============================================================================ */

function CyclingText({ phrases, color, reducedMotion }) {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  // Reset to first phrase when the phrases array changes (phase change).
  useEffect(() => {
    setIdx(0);
    setFading(false);
  }, [phrases]);

  useEffect(() => {
    if (reducedMotion) return;
    if (!phrases || phrases.length < 2) return;
    const interval = setInterval(() => {
      setFading(true);
      const t = setTimeout(() => {
        setIdx((i) => (i + 1) % phrases.length);
        setFading(false);
      }, CROSSFADE);
      // (cleanup via outer interval clearing — these inner timeouts are
      // tiny and self-completing)
      void t;
    }, PHRASE_INTERVAL);
    return () => clearInterval(interval);
  }, [phrases, reducedMotion]);

  const inlineStyle = {
    opacity: fading ? 0 : 1,
    transition: `opacity ${CROSSFADE}ms ease`,
    ...(color ? { "--shimmer-accent": color } : {}),
  };

  return (
    <span className="shimmer-thinking" style={inlineStyle}>
      {phrases?.[idx] || ""}
    </span>
  );
}

/* ============================================================================
   CyclingAvatar — swaps between an agent's `default` and `thinking` pose
   every FRAME_INTERVAL so the portrait reads as alive. Each instance can
   pass an `offset` to phase its cycle (so a row of 4 doesn't all swap on
   the same frame). With reduced motion: just shows the default still.
============================================================================ */

function CyclingAvatar({
  defaultSrc,
  thinkingSrc,
  size = 24,
  className = "",
  offset = 0,
  reducedMotion,
  innerStyle = {},
}) {
  const [showThinking, setShowThinking] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    // Stagger the cycle start using offset so 4 avatars don't twitch in
    // lockstep — feels more like a team, less like a slideshow.
    let interval = null;
    const startDelay = setTimeout(() => {
      setShowThinking(true);
      interval = setInterval(() => {
        setShowThinking((v) => !v);
      }, FRAME_INTERVAL);
    }, offset);
    return () => {
      clearTimeout(startDelay);
      if (interval) clearInterval(interval);
    };
  }, [reducedMotion, offset]);

  const src = showThinking && thinkingSrc ? thinkingSrc : defaultSrc;

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      style={{
        width: size,
        height: size,
        ...innerStyle,
      }}
    />
  );
}

/* ============================================================================
   AvatarRow — Phase 1 row of 4 → Phase 2 single lead. Each face cycles
   between default / thinking via CyclingAvatar, staggered per index.
============================================================================ */

const AVATAR_SIZE = 24; // smaller than the previous 36 — matches the
                        // assistant message header avatar size, per user
                        // feedback that 36 felt oversized.

function AvatarRow({ phase, chosenPersona, reducedMotion }) {
  return (
    <div className="flex items-center gap-3">
      {ALL_PERSONAS.map((key, i) => {
        const isChosen = key === chosenPersona;
        const isCollapsed = phase !== "team" && !isChosen;
        const isLead = phase !== "team" && isChosen;

        // Outer wrapper handles entrance / handoff / lead-scale.
        // Inner img handles the idle bob so the two animations compose.
        const outerStyle = {
          opacity: isCollapsed ? 0 : 1,
          transform: isCollapsed
            ? "translateY(-6px)"
            : isLead
            ? "scale(1.2)"
            : "scale(1)",
          transition: reducedMotion
            ? "none"
            : `opacity ${HANDOFF_DURATION}ms ease, transform ${HANDOFF_DURATION}ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
          // staggered entrance during Phase 1
          transitionDelay:
            phase === "team" && !reducedMotion ? `${i * 80}ms` : "0ms",
          pointerEvents: isCollapsed ? "none" : "auto",
        };

        const bobStyle = {
          animation: reducedMotion
            ? "none"
            : "thinkingBob 1.8s ease-in-out infinite",
          animationDelay: `${i * 120}ms`,
        };

        return (
          <div key={key} style={outerStyle}>
            <CyclingAvatar
              defaultSrc={PERSONA_AVATARS[key].default}
              thinkingSrc={PERSONA_AVATARS[key].thinking}
              size={AVATAR_SIZE}
              offset={i * 110}
              reducedMotion={reducedMotion}
              innerStyle={bobStyle}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================================
   ThinkingIndicator — phase machine + render
============================================================================ */

export default function ThinkingIndicator({ persona }) {
  const reducedMotion = useReducedMotion();
  const personaKey = persona ? KEBAB_TO_CAMEL[persona] || "creativeHead" : null;

  // "team" → "handoff" → "single"
  const [phase, setPhase] = useState("team");

  // Lock in the start time so PHASE1_FLOOR is from-send, not from re-render.
  const startRef = useRef(null);
  if (startRef.current === null) startRef.current = Date.now();

  // Drive team → handoff → single once persona is known AND PHASE1_FLOOR has
  // elapsed. Both timeouts cleaned up on unmount or re-trigger.
  useEffect(() => {
    if (!personaKey) return;
    if (phase !== "team") return;

    const elapsed = Date.now() - startRef.current;
    const remaining = Math.max(0, PHASE1_FLOOR - elapsed);

    let inner = null;
    const outer = setTimeout(() => {
      setPhase("handoff");
      inner = setTimeout(() => setPhase("single"), HANDOFF_DURATION);
    }, remaining);

    return () => {
      clearTimeout(outer);
      if (inner) clearTimeout(inner);
    };
  }, [personaKey, phase]);

  // Trail icon cycling — Phase 1 only, swaps every TRAIL_INTERVAL.
  const [trailIdx, setTrailIdx] = useState(0);
  useEffect(() => {
    if (phase !== "team") return;
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setTrailIdx((i) => (i + 1) % ALL_PERSONAS.length);
    }, TRAIL_INTERVAL);
    return () => clearInterval(interval);
  }, [phase, reducedMotion]);

  // Shuffle Phase 2 phrases ONCE per persona entry so the order varies
  // between questions; useMemo cache key matches the trigger.
  const singlePhrases = useMemo(() => {
    if (phase !== "single" || !personaKey) return null;
    const raw = THINKING_PHRASES[personaKey] || THINKING_PHRASES.creativeHead;
    const label = PERSONA_LABELS[personaKey];
    return shuffleArray(raw).map((p) => `${label} is ${lowerFirst(p)}…`);
  }, [phase, personaKey]);

  // Pick phrase set + accent color per phase. Trail icon is rendered
  // separately so it can keep cycling default↔thinking when locked to
  // a single persona (Phase 2).
  let phrases;
  let accentColor = null;
  let trailDefault;
  let trailThinking;

  if (phase === "team") {
    phrases = TEAM_PHRASES;
    // Phase 1: trail icon rotates through the 4 personas (default pose)
    // every TRAIL_INTERVAL. No internal default↔thinking cycle here —
    // the rotation itself provides the motion.
    const rotKey = ALL_PERSONAS[trailIdx];
    trailDefault = PERSONA_AVATARS[rotKey].default;
    trailThinking = null;
  } else if (phase === "handoff") {
    phrases = HANDOFF_PHRASES;
    accentColor = PERSONA_COLORS[personaKey];
    trailDefault = PERSONA_AVATARS[personaKey].default;
    trailThinking = PERSONA_AVATARS[personaKey].thinking;
  } else {
    phrases = singlePhrases;
    accentColor = PERSONA_COLORS[personaKey];
    trailDefault = PERSONA_AVATARS[personaKey].default;
    trailThinking = PERSONA_AVATARS[personaKey].thinking;
  }

  return (
    <div className="csc-bubble-in flex flex-col items-start gap-3">
      <AvatarRow
        phase={phase}
        chosenPersona={personaKey}
        reducedMotion={reducedMotion}
      />

      <div
        className="flex items-center text-[15px] leading-[24px]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <CyclingText
          phrases={phrases}
          color={accentColor}
          reducedMotion={reducedMotion}
        />
        {trailDefault ? (
          phase === "team" ? (
            // Phase 1: hard-rotate through personas; reset element each
            // tick so the trailPulse animation replays on swap.
            <img
              key={`trail-team-${trailIdx}`}
              src={trailDefault}
              alt=""
              aria-hidden="true"
              draggable={false}
              className="trail-icon"
            />
          ) : (
            // Phase 2 / handoff: same persona, swapping default↔thinking
            // on its own loop so it reads as alive next to the shimmer.
            <span className="trail-icon-wrap" style={{ marginLeft: 8, display: "inline-flex", verticalAlign: "middle" }}>
              <CyclingAvatar
                defaultSrc={trailDefault}
                thinkingSrc={trailThinking}
                size={18}
                offset={120}
                reducedMotion={reducedMotion}
                innerStyle={{
                  animation: reducedMotion
                    ? "none"
                    : "trailPulse 1s ease-in-out infinite",
                }}
              />
            </span>
          )
        ) : null}
      </div>
    </div>
  );
}
