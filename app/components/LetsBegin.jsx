"use client";

// "LETS BEGIN" — the chat empty state. 8-bit letter blocks with a quick
// staggered settle (fade + tiny drop into place), subline underneath.
// No cutscene, no characters. Reduced motion renders everything static.

const WORDS = [
  ["L", "E", "T", "S"],
  ["B", "E", "G", "I", "N"],
];

export default function LetsBegin() {
  return (
    <div className="lb-scene">
      <div className="lb-stage">
        {WORDS.map((word, wi) => (
          <div className="lb-word" key={wi}>
            {word.map((ch, i) => (
              <img
                key={ch + i}
                src={`/images/letters/${ch}.png`}
                alt={ch}
                draggable={false}
                className="lb-letter"
                style={{ animationDelay: `${(wi * 4 + i) * 0.06}s` }}
              />
            ))}
          </div>
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
          font-size: clamp(26px, 5vw, 56px); /* letter height driver */
          width: 100%;
        }
        .lb-stage {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: center;
          gap: 0.42em;
        }
        .lb-word {
          display: flex;
          align-items: flex-end;
          gap: 0.14em;
        }
        .lb-letter {
          height: 1em;
          width: auto;
          image-rendering: pixelated;
          user-select: none;
          transform-origin: bottom center;
          animation: lb-settle 0.34s cubic-bezier(0.2, 0.9, 0.3, 1.2) both;
        }
        .lb-sub {
          font-family: "Press Start 2P", "Space Mono", monospace;
          font-size: clamp(9px, 1.2vw, 12px);
          line-height: 1.9;
          color: #525252;
          max-width: 36em;
          text-align: center;
          animation: lb-fade 0.5s ease-out both;
          animation-delay: 0.7s;
        }
        @keyframes lb-settle {
          0% { opacity: 0; transform: translateY(-0.18em) scaleY(1.04); }
          70% { opacity: 1; transform: translateY(0.02em) scaleY(0.96); }
          100% { opacity: 1; transform: translateY(0) scaleY(1); }
        }
        @keyframes lb-fade {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lb-letter, .lb-sub { animation: none; }
        }
      `}</style>
    </div>
  );
}
