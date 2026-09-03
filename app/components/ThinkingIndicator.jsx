"use client";

// Two-phase thinking indicator, restructured to Figma 164:1245.
//
// Single inline row: a small cluster of overlapping persona avatars (each
// with a white ring) followed by the cycling phrase text. There is no
// separate trail icon — the cluster IS the visual.
//
// Phase 1 ("team")     — all 4 avatars overlapping, cycling team-assemble
//                         phrases. Each face quietly swaps default↔thinking
//                         via CyclingAgentAvatar (staggered offsets).
// Phase 1→2 ("handoff") — the 3 non-chosen avatars fade + collapse their
//                         width to 0; the chosen one lifts into lead
//                         position. Phrases swap to a brief HANDOFF line.
// Phase 2 ("single")   — only the chosen avatar remains, with persona-
//                         flavored phrases ("Creative Head is sketching
//                         the idea…") + shimmer tint matching its color.
//
// All timing constants live up top. The PARENT owns the global
// MIN_THINKING + reveal decision (CaseStudyChat.send) — this component
// renders state, nothing else.
//
// Reduced motion: ignore cycle intervals and crossfades, render one
// static phase.

import { useEffect, useMemo, useRef, useState } from "react";
import { CyclingAgentAvatar } from "./AgentAvatar";
import { ShiningText } from "./ShiningText";

/* ============================================================================
   Data
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

const PERSONA_LABELS = {
  creativeHead: "Creative Head",
  vibeCoder: "Vibe Coder",
  aiTinkerer: "AI Tinkerer",
  funnySide: "Funny Side",
};

const ALL_PERSONAS = ["creativeHead", "vibeCoder", "aiTinkerer", "funnySide"];

// API returns kebab-case persona ids; data above is keyed camelCase.
const KEBAB_TO_CAMEL = {
  "creative-head": "creativeHead",
  "vibe-coder": "vibeCoder",
  "ai-tinkerer": "aiTinkerer",
  "funny-side": "funnySide",
};
const CAMEL_TO_KEBAB = {
  creativeHead: "creative-head",
  vibeCoder: "vibe-coder",
  aiTinkerer: "ai-tinkerer",
  funnySide: "funny-side",
};

// Timing
const PHASE1_FLOOR = 800;     // ms — min team-assemble visible
const PHRASE_INTERVAL = 1700; // ms — phrase cycle
const CROSSFADE = 250;        // ms — phrase fade transition
const HANDOFF_DURATION = 500; // ms — 4→1 avatar collapse

// Layout (Figma 164:1245)
const AVATAR_SIZE = 18;       // px — matches Figma frame size
const AVATAR_OVERLAP = 4;     // px — mr-[-4px] overlap between siblings

/* ============================================================================
   Helpers
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
   CyclingText — phrase cycles every PHRASE_INTERVAL with CROSSFADE,
   masked through the shimmer gradient (optionally tinted by persona).
============================================================================ */

function CyclingText({ phrases, color, reducedMotion }) {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

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
      void t;
    }, PHRASE_INTERVAL);
    return () => clearInterval(interval);
  }, [phrases, reducedMotion]);

  const inlineStyle = {
    opacity: fading ? 0 : 1,
    transition: `opacity ${CROSSFADE}ms ease`,
  };

  const phrase = phrases?.[idx] || "";

  // Reduced motion → render the phrase as static text in the chosen
  // persona accent (or ink), no gradient sweep.
  if (reducedMotion) {
    return (
      <span style={{ color: color || "#0d0d0d", ...inlineStyle }}>
        {phrase}
      </span>
    );
  }

  return (
    <span style={inlineStyle}>
      <ShiningText text={phrase} className="text-base font-medium" />
    </span>
  );
}

/* ============================================================================
   AvatarCluster — Figma 164:1245 structure. Always 4 avatars in DOM so
   the chosen one keeps its identity through the handoff. Non-chosen ones
   shrink to width:0 + opacity:0 in handoff/single phase; flex layout
   collapses the row down to a single visible avatar without snapping.
============================================================================ */

function AvatarCluster({ phase, chosenPersonaKey, reducedMotion }) {
  return (
    <div className="inline-flex items-center">
      {ALL_PERSONAS.map((key, i) => {
        const isChosen = key === chosenPersonaKey;
        // Collapse non-chosen the moment we leave Phase 1.
        const collapsed = phase !== "team" && !isChosen;

        // mr-[-4px] overlap on all but the last avatar — Figma uses gap-4
        // (4px) but with mr-[-4px] siblings, which is the overlap step.
        const baseMargin = i < ALL_PERSONAS.length - 1 ? -AVATAR_OVERLAP : 0;

        const wrapStyle = {
          width: collapsed ? 0 : AVATAR_SIZE,
          marginRight: collapsed ? 0 : baseMargin,
          opacity: collapsed ? 0 : 1,
          transform: collapsed ? "scale(0.5)" : "scale(1)",
          transition: reducedMotion
            ? "none"
            : `width ${HANDOFF_DURATION}ms cubic-bezier(0.22, 0.61, 0.36, 1),` +
              ` margin ${HANDOFF_DURATION}ms cubic-bezier(0.22, 0.61, 0.36, 1),` +
              ` opacity ${HANDOFF_DURATION}ms ease,` +
              ` transform ${HANDOFF_DURATION}ms cubic-bezier(0.22, 0.61, 0.36, 1)`,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          flex: "0 0 auto",
        };

        return (
          <span key={key} style={wrapStyle}>
            <CyclingAgentAvatar
              persona={CAMEL_TO_KEBAB[key]}
              size={AVATAR_SIZE}
              ring="white"
              offset={i * 110}
              reducedMotion={reducedMotion}
            />
          </span>
        );
      })}
    </div>
  );
}

/* ============================================================================
   ThinkingIndicator — phase state machine + render
============================================================================ */

export default function ThinkingIndicator({ persona }) {
  const reducedMotion = useReducedMotion();
  const personaKey = persona ? KEBAB_TO_CAMEL[persona] || "creativeHead" : null;

  const [phase, setPhase] = useState("team");

  // Lock the start time so PHASE1_FLOOR is measured from send, not render.
  const startRef = useRef(null);
  if (startRef.current === null) startRef.current = Date.now();

  // team → handoff → single once persona is known AND PHASE1_FLOOR elapsed.
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

  // Shuffle Phase 2 phrases ONCE so order varies between questions.
  const singlePhrases = useMemo(() => {
    if (phase !== "single" || !personaKey) return null;
    const raw = THINKING_PHRASES[personaKey] || THINKING_PHRASES.creativeHead;
    const label = PERSONA_LABELS[personaKey];
    return shuffleArray(raw).map((p) => `${label} is ${lowerFirst(p)}…`);
  }, [phase, personaKey]);

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

  return (
    <div
      className="csc-bubble-in inline-flex items-center"
      style={{ gap: "8px", fontFamily: "Inter, sans-serif" }}
    >
      <AvatarCluster
        phase={phase}
        chosenPersonaKey={personaKey}
        reducedMotion={reducedMotion}
      />
      <span
        className="text-[14px] leading-[20px] font-medium"
        style={{ color: "#262626" }}
      >
        <CyclingText
          phrases={phrases}
          color={accentColor}
          reducedMotion={reducedMotion}
        />
      </span>
    </div>
  );
}
