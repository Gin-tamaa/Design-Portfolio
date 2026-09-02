"use client";

// Chat empty state: the four agents' pixel heads pop in, settle into a
// slow independent levitation, and the subline fades in beneath them.
// Reduced motion renders everything static.

const FACES = ["creative-head", "ai-tinkerer", "vibe-coder", "funny-side"];

export default function LetsBegin() {
  return (
    <div className="lb-scene">
      <div className="lb-faces">
        {FACES.map((id, i) => (
          <img
            key={id}
            src={`/images/faces/${id}.png`}
            alt=""
            draggable={false}
            className="lb-face"
            style={{ "--lb-pop-delay": `${i * 0.14}s` }}
          />
        ))}
      </div>


      <p className="lb-sub">
        My Agents are here to answer any of your questions. Just shoot em&rsquo;
      </p>

      <style jsx>{`
        .lb-scene {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75em;
          font-size: clamp(26px, 5vw, 56px); /* head size driver */
          width: 100%;
        }
        .lb-faces {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 0.13em;
        }
        .lb-face {
          height: 0.78em;
          width: auto;
          image-rendering: pixelated;
          user-select: none;
          transform-origin: bottom center;
          /* pop in, then hand off to a slow levitation loop */
          animation:
            lb-face-pop 0.42s cubic-bezier(0.3, 1.3, 0.5, 1) both,
            lb-face-float 3.4s ease-in-out infinite;
          animation-delay: var(--lb-pop-delay, 0s), calc(var(--lb-pop-delay, 0s) + 0.42s);
        }
        @keyframes lb-face-pop {
          from { opacity: 0; transform: translateY(0.16em) scale(0.7); }
          to { opacity: 1; transform: none; }
        }
        @keyframes lb-face-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-0.09em); }
        }
        .lb-sub {
          font-family: "Press Start 2P", "Space Mono", monospace;
          font-size: clamp(9px, 1.2vw, 12px);
          line-height: 1.9;
          color: #525252;
          max-width: 36em;
          text-align: center;
          animation: lb-fade 0.5s ease-out both;
          animation-delay: 0.85s;
        }
        @keyframes lb-fade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lb-sub, .lb-face { animation: none; }
          .lb-face { opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
