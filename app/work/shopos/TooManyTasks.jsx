"use client";

// "Too many tasks" thumbnail — Apple App-actions-style cluster of floating
// chips that bloom in from the centre when the frame is ≥80% in view,
// and collapse back when it leaves. Mirrors the interaction rhythm of
// AgentsFanOut so the case study has a consistent scroll language.

import { useEffect, useRef, useState } from "react";

// Each task has a fixed scatter position in the frame, expressed as a
// percentage from the centre. Hand-tuned for visual rhythm — chips of
// different widths feather around the centred wordmark without colliding.
const TASKS = [
  { emoji: "✉️", iconBg: "#00bbff", text: "Write a launch email",       x: -34, y: -32 },
  { emoji: "📸", iconBg: "#ff7a59", text: "Generate a product shot",    x:  28, y: -36 },
  { emoji: "✍️", iconBg: "#9c6cff", text: "Write a product caption",    x: -40, y:  -4 },
  { emoji: "📊", iconBg: "#0eaf6b", text: "Pull yesterday's ROAS",      x:  34, y:  -2 },
  { emoji: "📄", iconBg: "#f5a623", text: "Draft a video script",       x: -28, y:  24 },
  { emoji: "🎯", iconBg: "#e85d75", text: "Run a paid campaign",        x:  30, y:  26 },
  { emoji: "📈", iconBg: "#5b8def", text: "Check store analytics",      x:  -2, y: -42 },
  { emoji: "💬", iconBg: "#34c759", text: "Reply to customers",         x:  -4, y:  40 },
  { emoji: "🔍", iconBg: "#a06bff", text: "SEO audit",                  x: -45, y:  38 },
  { emoji: "📱", iconBg: "#f0506e", text: "Post to social",             x:  42, y:  38 },
];

export default function TooManyTasks() {
  const ref = useRef(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Same trigger as AgentsFanOut: ≥80% in view to expand, <80% to collapse.
    const io = new IntersectionObserver(
      ([entry]) => {
        setExpanded(entry.isIntersecting && entry.intersectionRatio >= 0.8);
      },
      { threshold: [0, 0.5, 0.8, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden rounded-3xl"
      style={{
        aspectRatio: "16 / 9",
        background:
          "radial-gradient(120% 80% at 50% 50%, #ffffff 0%, #f4f5f8 65%, #ebedf2 100%)",
      }}
    >
      {/* Centred wordmark with the Apple-style multi-stop gradient text. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h3
          className="select-none font-bold tracking-tight"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(2rem, 4.2vw, 4rem)",
            backgroundImage:
              "linear-gradient(90deg, #1a2452 0%, #c25b3a 22%, #d29a48 42%, #aabf68 58%, #5b9bb8 78%, #2a3e7a 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          too many tasks
        </h3>
      </div>

      {/* Floating chips. Each is absolutely positioned at frame centre and
          translated to its target via percentage offsets. Bloom-in: at rest
          the chip is centred + scaled 0.6 + opacity 0; when expanded it
          slides to its target at scale 1 / opacity 1. Staggered delay gives
          a soft cascade — alternating sign of x for a left/right ripple. */}
      <div className="pointer-events-none absolute inset-0">
        {TASKS.map((task, i) => {
          // Stagger by distance from centre so closer chips appear first.
          const dist = Math.hypot(task.x, task.y);
          const delay = Math.round(dist * 4);
          return (
            <div
              key={task.text}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: expanded
                  ? `translate(calc(-50% + ${task.x * 6}px), calc(-50% + ${task.y * 4}px)) scale(1)`
                  : "translate(-50%, -50%) scale(0.55)",
                opacity: expanded ? 1 : 0,
                transition: `transform 820ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, opacity 540ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
                willChange: "transform, opacity",
              }}
            >
              <Chip emoji={task.emoji} iconBg={task.iconBg} text={task.text} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Chip — matches Figma node 124:4685: white pill, 24×24 rounded icon tile
// with a colored bg, Inter Regular text on the right. Slight drop shadow
// to lift it off the gradient surface.
function Chip({ emoji, iconBg, text }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full bg-white"
      style={{
        padding: "8px 14px 8px 8px",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px -6px rgba(0,0,0,0.10)",
      }}
    >
      <span
        className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[14px] leading-none"
        style={{ background: iconBg }}
      >
        {emoji}
      </span>
      <span
        className="whitespace-nowrap text-[15px] leading-[22px]"
        style={{ fontFamily: "Inter, sans-serif", color: "#34322d" }}
      >
        {text}
      </span>
    </div>
  );
}
