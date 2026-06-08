"use client";

import { useState } from "react";

// Renders a real <video> if /videos/shopos-intro.mp4 (or whatever src) actually
// decodes. Until the first frame is available the video stays invisible and
// the clean placeholder behind it shows through. If the file never loads —
// 404, decode failure, network blocked — `onLoadedData` never fires, so the
// placeholder remains as-is. No black UA-default rectangle.

export default function VideoBlock({ src, name, description, poster }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-3xl border border-[#E5E5E5] bg-white">
      {/* Placeholder content sits behind the video */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex flex-col items-center justify-center px-10 text-center"
      >
        <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#525252]">
          {`▢  ${name}`}
        </div>
        {description ? (
          <p className="mt-4 max-w-md text-[15px] leading-[1.65] text-[#525252]">
            {description}
          </p>
        ) : null}
      </div>
      <video
        src={src}
        poster={poster}
        muted
        playsInline
        loop
        controls
        preload="metadata"
        onLoadedData={() => setLoaded(true)}
        style={{
          opacity: loaded ? 1 : 0,
          background: "transparent",
        }}
        className="relative z-10 h-full w-full object-cover transition-opacity duration-300"
      />
    </div>
  );
}
