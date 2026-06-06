// 3-column static masonry stack. Each image card has a small chip in the
// top-left that reveals on hover (project name only, white bg, 6px radius).
//
// Item shape:
//   { img, title, href?, alt? }     → image card (chip reveals on hover)
//   { height, bg }                  → structural spacer (no chip)
// Add `href` to make the card a Link.

import Link from "next/link";

const COL_1 = [
  {
    img: "/images/card-shopos.png",
    title: "ShopOS",
    href: "/work/shopos",
    alt: "ShopOS — AI workforce for commerce",
  },
  { height: 250, bg: "#eeeeee" },
  {
    img: "/images/creative-head.png",
    title: "HEYY",
    alt: "HEYY — character & motion system",
  },
];

const COL_2 = [
  { height: 317, bg: "#dddddd" },
  {
    img: "/images/card-project2.png",
    title: "Brand Memory",
    alt: "Brand Memory — identity system",
  },
  { height: 400, bg: "#dddddd" },
];

const COL_3 = [
  {
    img: "/images/vibe-coder.png",
    title: "Vibe Coder",
    alt: "Vibe Coder — agent persona",
  },
  { height: 364, bg: "#cccccc" },
  {
    img: "/images/ai-tinkerer.png",
    title: "AI Tinkerer",
    alt: "AI Tinkerer — agent persona",
  },
];

function Item({ img, height, bg, href, title, alt = "" }) {
  const style = height
    ? { height: `${height}px`, background: bg || "#f0f0f0" }
    : undefined;

  const content = (
    <>
      {img ? <img src={img} alt={alt} draggable={false} /> : null}
      {title ? (
        <span className="masonry-chip" aria-hidden="true">
          {title}
        </span>
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="masonry-item"
        style={style}
        aria-label={title}
      >
        {content}
      </Link>
    );
  }
  return (
    <div className="masonry-item" style={style}>
      {content}
    </div>
  );
}

function Column({ items }) {
  return (
    <div className="masonry-column">
      {items.map((item, i) => (
        <Item key={i} {...item} />
      ))}
    </div>
  );
}

export default function Carousel() {
  return (
    <section className="masonry">
      <div className="masonry-track">
        <Column items={COL_1} />
        <Column items={COL_2} />
        <Column items={COL_3} />
      </div>
    </section>
  );
}
