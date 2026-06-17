"use client";

// Home feed — clean stacked project cards. Figma node 64:444.
//
// Each card: small meta line (project · year) → big Inter Semi-Bold title →
// full-width 480px visual with rounded-8 corners. Placeholder images come
// from the user later; for now a gradient placeholder fills each visual so
// the rhythm + spacing already read correctly.
//
// `.feed-card` is observed by the homepage's IntersectionObserver for the
// scroll-reveal entrance.
//
// Click → open: the card scales up just-enough (~1.06) and dims its
// neighbours before pushing the route. Reads as "this card is opening
// in your face" without committing to a full shared-element transition.

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AgentsThumbnail from "./AgentsThumbnail";
import MemoryThumbnail from "./MemoryThumbnail";

const CARDS = [
  {
    project: "ShopOS",
    year: "2026",
    title: "ShopOS Agents",
    href: "/work/shopos",
    img: null,
    visual: "agents",
    placeholderBg: "linear-gradient(to bottom, #000000, #2e2e2e)",
    alt: "ShopOS Agents — AI workforce for commerce",
  },
  {
    project: "ShopOS",
    year: "2026",
    title: "Brand Memory",
    href: "/work/brand-memory",
    img: null,
    visual: "memory",
    placeholderBg: "linear-gradient(to bottom, #fafafa, #eeeeee)",
    alt: "Brand Memory — identity system",
  },
];

function FeedCardInner({ project, year, title, img, alt, placeholderBg, visual }) {
  // `visual` lets a card swap the default placeholder/<img> for a
  // bespoke composition that mirrors its case-study hero. Falls
  // back to img → placeholderBg.
  const hasVisualComponent = visual === "agents" || visual === "memory";
  return (
    <article className="feed-card">
      <div className="feed-card-meta">
        <span>{project}</span>
        <span className="feed-card-dot" aria-hidden="true" />
        <span>{year}</span>
      </div>
      <h2 className="feed-card-title">{title}</h2>
      <div
        className="feed-card-visual"
        style={img || hasVisualComponent ? undefined : { background: placeholderBg }}
      >
        {visual === "agents" ? (
          <AgentsThumbnail />
        ) : visual === "memory" ? (
          <MemoryThumbnail />
        ) : img ? (
          <img src={img} alt={alt || title} draggable={false} />
        ) : null}
      </div>
    </article>
  );
}

function FeedCard({ openingHref, onOpen, ...props }) {
  const isOpening = !!openingHref;
  const isThisOpening = openingHref === props.href;
  const isDimmed = isOpening && !isThisOpening;

  if (props.href) {
    const handleClick = (e) => {
      // Honor cmd/ctrl/middle-click for "open in new tab"
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
      e.preventDefault();
      onOpen(props.href);
    };
    return (
      <Link
        href={props.href}
        className={`feed-card-link ${isThisOpening ? "is-opening" : ""} ${
          isDimmed ? "is-dimmed" : ""
        }`}
        aria-label={props.title}
        onClick={handleClick}
      >
        <FeedCardInner {...props} />
      </Link>
    );
  }
  return <FeedCardInner {...props} />;
}

// How long the open animation runs before the route actually changes.
// Long enough to read as "the card grew into focus", short enough not
// to feel like a delay. Reduced motion skips it entirely.
const OPEN_DURATION_MS = 360;

export default function Carousel() {
  const router = useRouter();
  const [openingHref, setOpeningHref] = useState(null);

  const handleOpen = (href) => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      router.push(href);
      return;
    }
    setOpeningHref(href);
    window.setTimeout(() => router.push(href), OPEN_DURATION_MS);
  };

  return (
    <section className="feed">
      {CARDS.map((card) => (
        <FeedCard
          key={card.title}
          {...card}
          openingHref={openingHref}
          onOpen={handleOpen}
        />
      ))}
    </section>
  );
}
