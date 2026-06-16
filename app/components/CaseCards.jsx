import Link from "next/link";

const cards = [
  {
    client: "ShopOS, Founding Design",
    tags: "AI, Commerce, OS",
    href: "/work/shopos",
    img: "/images/card-shopos.png",
  },
  {
    client: "Brand Memory",
    tags: "Identity, Design Systems",
    href: "/work/brand-memory",
    img: "/images/card-project2.png",
  },
  {
    client: "HEYY, Studio Reel",
    tags: "Motion, Characters",
    href: "/work",
    video: "/videos/intro.mp4",
  },
];

export default function CaseCards() {
  return (
    <section className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {cards.map((c) => (
            <Link
              key={c.client}
              href={c.href}
              className="sticky-stack-item group relative block bg-[#f1f1ef] rounded-[20px] overflow-hidden"
            >
              <div className="aspect-[4/3] overflow-hidden">
                {c.video ? (
                  <video
                    src={c.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <img
                    src={c.img}
                    alt={c.client}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                )}
              </div>

              {/* Hover pills — slide up from the bottom-left */}
              <div className="pointer-events-none absolute left-4 bottom-4 flex flex-wrap items-center gap-2 opacity-0 translate-y-3 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                <span className="px-3 py-1.5 rounded-full bg-white text-[12px] leading-none font-medium text-black shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
                  {c.client}
                </span>
                <span className="px-3 py-1.5 rounded-full bg-white text-[12px] leading-none font-medium text-black shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
                  {c.tags}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
