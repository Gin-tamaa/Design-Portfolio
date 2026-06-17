"use client";

// Animated shimmering text — a white highlight sweeps across the
// phrase from right to left on a 2s linear loop, drawing the eye to
// whatever "thinking…" state the chat is in.
//
// Imported `motion` from framer-motion (already a project dep). The
// reference snippet used `motion/react`, which is the same renamed
// package; the API is identical.

import { motion } from "framer-motion";

export function ShiningText({ text, className = "" }) {
  return (
    <motion.span
      className={`bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-transparent ${className}`}
      initial={{ backgroundPosition: "200% 0" }}
      animate={{ backgroundPosition: "-200% 0" }}
      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      style={{
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {text}
    </motion.span>
  );
}
