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
import AgentAvatar, { CyclingAgentAvatar } from "./AgentAvatar";

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

// Avatar atlas lives in AgentAvatar.jsx now (colored bg in CSS + raw
// high-res portrait PNG composited on top, so it doesn't pixelate).
// We just need the camel→kebab mapping to feed AgentAvatar the
// kebab-case persona id it expects.
const CAMEL_TO_KEBAB = {
  creativeHead: "creative-head",
  vibeCoder: "vibe-coder",
  aiTinkerer: "ai-tinkerer",
  funnySide: "funny-side",
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
   AvatarRow — Phase 1 row of 4 → Phase 2 single lead. Each face cycles
   default ↔ thinking via the shared CyclingAgentAvatar, staggered per
   index so the row doesn't twitch in lockstep.
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

        // Outer wrapper handles entrance / handoff / lead-scale + the
        // gentle idle bob. The avatar itself is the new composited
        // (CSS bg + raw portrait) AgentAvatar, so transforms here
        // don't fight with image rendering.
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
          transitionDelay:
            phase === "team" && !reducedMotion ? `${i * 80}ms` : "0ms",
          pointerEvents: isCollapsed ? "none" : "auto",
          // bob the wrapper, not the inner avatar — keeps the bg+portrait
          // composite stable while only the row position shifts.
          animation: reducedMotion
            ? "none"
            : "thinkingBob 1.8s ease-in-out infinite",
          animationDelay: `${i * 120}ms`,
        };

        return (
          <div key={key} style={outerStyle}>
            <CyclingAgentAvatar
              persona={CAMEL_TO_KEBAB[key]}
              size={AVATAR_SIZE}
              offset={i * 110}
              reducedMotion={reducedMotion}
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

  // Phrase set + accent color per phase. The trail icon is rendered
  // separately below so each phase can pick the right avatar treatment.
  let phrases;
  let accentColor = null;

  if (phase === "team") {
    phrases = TEAM_PHRASES;
  } else if (phase === "handoff") {
    phrases = HANDOFF_PHRASES;
    accentColor = PERSONA_COLORS[personaKey];
  } else {
    phrases = singlePhrases;
    accentColor = PERSONA_COLORS[personaKey];
  }

  // Phase 1 trail icon rotates through the 4 personas every TRAIL_INTERVAL.
  // Phase 2 trail icon cycles default↔thinking on the chosen persona.
  const trailPersonaKebab =
    phase === "team"
      ? CAMEL_TO_KEBAB[ALL_PERSONAS[trailIdx]]
      : CAMEL_TO_KEBAB[personaKey];

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
        {trailPersonaKebab ? (
          <span
            className="trail-icon-wrap"
            style={{
              marginLeft: 8,
              display: "inline-flex",
              verticalAlign: "middle",
              animation: reducedMotion
                ? "none"
                : "trailPulse 1s ease-in-out infinite",
            }}
          >
            {phase === "team" ? (
              // Hard-rotate: re-mount via key so the pulse replays on swap.
              <AgentAvatar
                key={`trail-team-${trailIdx}`}
                persona={trailPersonaKebab}
                size={18}
              />
            ) : (
              <CyclingAgentAvatar
                persona={trailPersonaKebab}
                size={18}
                offset={120}
                reducedMotion={reducedMotion}
              />
            )}
          </span>
        ) : null}
      </div>
    </div>
  );
}
