"use client";

// Animated grain-gradient background (paper-design shaders), used as the
// DreamCall thumbnail backdrop the same way MemoryThumbnail layers the
// NeuralNoise canvas. Fills its positioned parent; the wordmark renders
// on top of it.
//
// NOTE on placement: the source snippet targeted a shadcn /components/ui
// folder, but this project is plain JSX + Tailwind (no TypeScript, no
// shadcn), and all components live in app/components/ — so it lives here
// to stay consistent with the codebase.
//
// Palette: purple trio (swapped off the original warm orange/yellow/pink
// per spec) glowing over a black base.

import { GrainGradient } from "@paper-design/shaders-react";

export function GradientBackground() {
  return (
    <div className="absolute inset-0">
      <GrainGradient
        style={{ height: "100%", width: "100%" }}
        colorBack="hsl(0, 0%, 0%)"
        softness={0.76}
        intensity={0.45}
        noise={0}
        shape="corners"
        offsetX={0}
        offsetY={0}
        scale={1}
        rotation={0}
        speed={1}
        colors={["hsl(258, 90%, 62%)", "hsl(276, 85%, 58%)", "hsl(294, 80%, 56%)"]}
      />
    </div>
  );
}
