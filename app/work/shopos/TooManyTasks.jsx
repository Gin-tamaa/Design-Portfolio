"use client";

// "Too many tasks" thumbnail — Apple App-actions-style cluster of floating
// chips that bloom in from the centre when the frame is ≥80% in view,
// and collapse back when it leaves. Mirrors the interaction rhythm of
// AgentsFanOut so the case study has a consistent scroll language.

import { useEffect, useRef, useState } from "react";

// Each task is scattered around the centre wordmark at a fixed (x, y)
// percentage offset. Size/opacity vary per chip — a few big foreground
// ones, more small background ones, like Apple's App-actions reference.
//   size: 1.0 = foreground/full-presence, 0.72 = mid, 0.6 = ghosted bg
//   opacity: 1 / 0.78 / 0.55
const TASKS = [
  // Foreground — big & opaque
  { emoji: "✉️", iconBg: "#00bbff", text: "Write a launch email",     x: -26, y: -18, size: 1.00, opacity: 1.00 },
  { emoji: "📸", iconBg: "#ff7a59", text: "Generate a product shot",  x:  22, y: -28, size: 1.00, opacity: 1.00 },
  { emoji: "🎯", iconBg: "#e85d75", text: "Run a paid campaign",      x:  26, y:  24, size: 1.00, opacity: 1.00 },
  { emoji: "📊", iconBg: "#0eaf6b", text: "Pull yesterday's ROAS",    x: -28, y:  22, size: 1.00, opacity: 1.00 },

  // Mid — medium scale
  { emoji: "✍️", iconBg: "#9c6cff", text: "Write a product caption", x: -44, y:  -2, size: 0.78, opacity: 0.85 },
  { emoji: "📈", iconBg: "#5b8def", text: "Check store analytics",   x:  46, y:  -4, size: 0.78, opacity: 0.85 },
  { emoji: "💬", iconBg: "#34c759", text: "Reply to customers",      x:   2, y:  38, size: 0.80, opacity: 0.90 },

  // Background — small & ghosted
  { emoji: "📄", iconBg: "#f5a623", text: "Draft a video script",    x: -42, y: -32, size: 0.62, opacity: 0.55 },
  { emoji: "🔍", iconBg: "#a06bff", text: "SEO audit",               x:  44, y: -38, size: 0.62, opacity: 0.55 },
  { emoji: "📱", iconBg: "#f0506e", text: "Post to social",          x:  40, y:  38, size: 0.62, opacity: 0.55 },
  { emoji: "🛍️", iconBg: "#ff8c4a", text: "Restock alerts",          x: -40, y:  36, size: 0.62, opacity: 0.55 },
  { emoji: "💌", iconBg: "#7c5cff", text: "Send newsletter",         x:  -4, y: -42, size: 0.65, opacity: 0.60 },
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
        // Very soft near-white wash — preserves the radial vignette so the
        // chips' shadows still anchor, but lifts the overall surface.
        background:
          "radial-gradient(120% 80% at 50% 50%, #ffffff 0%, #fafbfd 70%, #f4f5f9 100%)",
      }}
    >
      {/* Centred wordmark — the static BASE layer (z-0). The chips fall in
          on top of it. Solid black for stronger anchor against the busy
          chip layer above. */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <h3
          className="select-none font-bold tracking-tight text-[#0a0a0a]"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(2rem, 4.2vw, 4rem)",
          }}
        >
          too many tasks
        </h3>
      </div>

      {/* Floating chips — z-10, ABOVE the wordmark. "Thrown from front":
          each chip starts at its target X/Y but scaled up (1.5) and
          transparent — reads as sitting closer to the viewer, in front of
          the text. On expand it scales DOWN to its target size and fades
          in, like the chip is being pushed back into the frame onto the
          headline. Same target X/Y for both states = no lateral motion,
          just depth + opacity. Subtle stagger by distance for cohesion. */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {TASKS.map((task) => {
          const dist = Math.hypot(task.x, task.y);
          const delay = Math.round(dist * 3);
          const targetX = task.x * 8;
          const targetY = task.y * 5.5;
          return (
            <div
              key={task.text}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(calc(-50% + ${targetX}px), calc(-50% + ${targetY}px)) scale(${expanded ? task.size : 1.5})`,
                opacity: expanded ? task.opacity : 0,
                transition: `transform 640ms cubic-bezier(0.22, 0.61, 0.36, 1) ${delay}ms, opacity 480ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
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

// Chip — white pill matching Figma node 124:4685. Softer drop shadow so
// the chips feel like they're gently floating instead of stamped. Text
// in muted grey so it doesn't outshout the black headline behind them.
function Chip({ emoji, iconBg, text }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full bg-white"
      style={{
        padding: "14px 22px 14px 14px",
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.025), 0 6px 18px -8px rgba(0,0,0,0.07)",
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
        style={{ fontFamily: "Inter, sans-serif", color: "#6b6b6b" }}
      >
        {text}
      </span>
    </div>
  );
}
