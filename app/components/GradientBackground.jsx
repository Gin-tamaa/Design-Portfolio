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

// `speed` is passed through so the caller can pause the drift (speed 0)
// when the tile is off-screen; the gradient stays drawn, it just stops
// advancing, which keeps it from animating while scrolled away.
//
// `maxPixelCount` caps the shader's render resolution (width × height ×
// dpr²). Without it the canvas renders at full device pixel ratio — on a
// 2× display that's ~4× the pixels per frame, which made scrolling onto
// the DreamCall card stutter. The card visual is at most ~1080×480, so we
// cap near that (≈1× DPR). The gradient is heavily softened, so the lower
// resolution is invisible. Mirrors MemoryThumbnail's maxDpr={1.25} intent.
const MAX_PIXEL_COUNT = 1080 * 480;

export function GradientBackground({ speed = 1 }) {
  return (
    <div className="absolute inset-0">
      <GrainGradient
        style={{ height: "100%", width: "100%" }}
        maxPixelCount={MAX_PIXEL_COUNT}
        colorBack="hsl(0, 0%, 0%)"
        softness={0.76}
        intensity={0.45}
        noise={0}
        shape="corners"
        offsetX={0}
        offsetY={0}
        scale={1}
        rotation={0}
        speed={speed}
        colors={["hsl(258, 90%, 62%)", "hsl(276, 85%, 58%)", "hsl(294, 80%, 56%)"]}
      />
    </div>
  );
}
