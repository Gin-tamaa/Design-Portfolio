"use client";

// Solution section — Figma node 134:1031. Full-bleed visual break: same
// near-white radial bg as TooManyTasks, badge + headline + lede pinned
// near the top, agents composite hero in the centre, and four rotated
// platform-tool tiles floating in the corners. Bottom paragraph below
// the characters explains the roster. The section spans the full viewport
// width (no Container max-w) so it reads as a distinct chapter break in
// the case study.

const TOOL_TILES = [
  // Each tile: where it sits in the frame (% from top-left), rotation
  // angle, and an inline SVG mark. Hidden on small screens — they'd
  // collide with the centred text.
  { left: "8%",   top: "10%", rotate: -14, kind: "googleAds" },
  { left: "10%",  top: "38%", rotate: -14, kind: "shopify"   },
  { right: "8%",  top: "10%", rotate:  15, kind: "metaOrange"},
  { right: "10%", top: "38%", rotate:  15, kind: "metaBlue"  },
];

function ToolMark({ kind }) {
  // Simple inline SVGs — colored marks on a soft white rounded tile.
  if (kind === "googleAds") {
    return (
      <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
        <path d="M16 4 L4 24 L12 28 L24 8 Z" fill="#4285F4" />
        <path d="M28 8 L40 28 L32 32 L20 12 Z" fill="#FBBC04" />
        <circle cx="14" cy="32" r="5" fill="#34A853" />
      </svg>
    );
  }
  if (kind === "shopify") {
    return (
      <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
        <path d="M30 12c-.5-2.4-2-4-4.5-4.2-.5-1.4-1.6-2.4-3-2.4-2 0-3.4 1.7-4 4.2-1.2.4-2 .6-2.2.7-1.2.4-1.3.4-1.4 1.6-.1.9-3.3 25-3.3 25l16 3 4-26.9zM24 9.5c-.4 0-.7.1-.9.2 0-1.7-.6-3.1-1.6-3.7 1.3.3 2.3 1.7 2.5 3.5zm-3.4-3.3c.8.4 1.4 1.5 1.5 3.5l-3.3 1c.4-2.5 1.4-4 1.8-4.5zm-.6 7.1-3.2 1c.1-1.6.7-3.1 1.5-4l1.7 3z" fill="#95BF47" />
        <path d="M30 12 28 38.9l-12-2.5L18.5 11s.7-.2 1.7-.6c0 0 0 0 .1 0 1.2-.3 2.3-.7 2.3-.7 0-.5.2-1 .4-1.4l.3.1c.3-.7.7-1.2 1.1-1.6 1.1.1 2 .8 2.6 1.8 1.3-.4 2.3.1 3 1.4z" fill="#5E8E3E" />
      </svg>
    );
  }
  if (kind === "metaBlue") {
    return (
      <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
        <path
          d="M6 30c0-7 4-13 9-13s7 3 10 9c3 6 6 9 9 9 3 0 4-2 4-5s-2-6-5-9-5-4-7-4"
          fill="none"
          stroke="#1877F2"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  // metaOrange — orange/yellow ads-pulse mark
  return (
    <svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
      <rect x="6"  y="22" width="6" height="16" rx="1.5" fill="#FFB300" />
      <rect x="16" y="14" width="6" height="24" rx="1.5" fill="#FF9100" />
      <rect x="26" y="6"  width="6" height="32" rx="1.5" fill="#FF5C00" />
    </svg>
  );
}

function ToolTile({ left, right, top, rotate, kind }) {
  return (
    <div
      className="pointer-events-none absolute hidden md:block"
      style={{ left, right, top, transform: `rotate(${rotate}deg)` }}
    >
      <div
        className="flex h-[88px] w-[88px] items-center justify-center rounded-[20px] bg-[#fafafa] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_28px_-12px_rgba(0,0,0,0.10)]"
      >
        <ToolMark kind={kind} />
      </div>
    </div>
  );
}

export default function SolutionSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 50%, #ffffff 0%, #fafbfd 70%, #f4f5f9 100%)",
      }}
    >
      {/* Floating tool tiles in the four corners (md+ only) */}
      {TOOL_TILES.map((t) => (
        <ToolTile key={`${t.left || t.right}-${t.top}`} {...t} />
      ))}

      <div className="relative mx-auto flex w-full max-w-[1280px] flex-col items-center px-6 py-24 md:px-10 md:py-32">
        {/* Badge */}
        <div
          className="inline-flex h-9 items-center rounded-full border border-[#d4d4d4] bg-[#fafafa] px-3 text-[14px] font-medium leading-[20px] text-[#262626]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          The solution
        </div>

        {/* Headline */}
        <h2
          className="mt-5 max-w-[18ch] text-center font-medium tracking-tight text-[#0a0a0a]"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(2rem, 1.5rem + 2.5vw, 3rem)",
            lineHeight: 1.08,
          }}
        >
          Your brand doesn&rsquo;t work alone
        </h2>

        {/* Lede */}
        <p
          className="mt-5 max-w-[600px] text-center text-[16px] leading-[1.5] text-[#262626]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Eight functions, eight teammates. You don&rsquo;t prompt a model.
          You hand work to a team, the way you&rsquo;d brief a department.
        </p>

        {/* Agents composite — sits below the text block, centred */}
        <div className="relative mt-14 flex w-full justify-center md:mt-20">
          <img
            src="/images/agents-hero.png"
            alt="The ShopOS agents lined up — Erlich, the engineer with a laptop, Aria, Gavin, and Richard"
            className="h-auto w-full max-w-[1080px] select-none"
            draggable={false}
          />
        </div>

        {/* Footer paragraph naming the roster */}
        <p
          className="mt-10 max-w-[920px] text-center text-[16px] leading-[1.5] text-[#262626] md:mt-14"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          ShopOS lets a brand owner connect their tools once, and a roster of
          named agents spins up to cover the whole store: Gavin on paid,
          Monica on creative, Jian-Yang reading the market, Russ watching the
          numbers, Richard minding the store &mdash; plus agents for GEO,
          social, email, and brand intelligence.
        </p>
      </div>
    </section>
  );
}
