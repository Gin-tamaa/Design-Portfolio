// Home feed — clean stacked project cards. Figma node 64:444.
//
// Each card: small meta line (project · year) → big Inter Semi-Bold title →
// full-width 480px visual with rounded-8 corners. Placeholder images come
// from the user later; for now a gradient placeholder fills each visual so
// the rhythm + spacing already read correctly.
//
// `.feed-card` is observed by the homepage's IntersectionObserver for the
// scroll-reveal entrance.

import Link from "next/link";

const CARDS = [
  {
    project: "ShopOS",
    year: "2026",
    title: "ShopOS Agents",
    href: "/work/shopos",
    img: null,
    placeholderBg: "linear-gradient(to bottom, #000000, #2e2e2e)",
    alt: "ShopOS Agents — AI workforce for commerce",
  },
  {
    project: "ShopOS",
    year: "2026",
    title: "Brand Memory",
    href: null,
    img: null,
    placeholderBg: "linear-gradient(to bottom, #fafafa, #eeeeee)",
    alt: "Brand Memory — identity system",
  },
];

function FeedCardInner({ project, year, title, img, alt, placeholderBg }) {
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
        style={img ? undefined : { background: placeholderBg }}
      >
        {img ? <img src={img} alt={alt || title} draggable={false} /> : null}
      </div>
    </article>
  );
}

function FeedCard(props) {
  if (props.href) {
    return (
      <Link href={props.href} className="feed-card-link" aria-label={props.title}>
        <FeedCardInner {...props} />
      </Link>
    );
  }
  return <FeedCardInner {...props} />;
}

export default function Carousel() {
  return (
    <section className="feed">
      {CARDS.map((card) => (
        <FeedCard key={card.title} {...card} />
      ))}
    </section>
  );
}
