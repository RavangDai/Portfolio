"use client";

import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type CardLabel = { title: string; subtitle?: string; badge?: ReactNode };

type OrbitalGalleryProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  getImage: (item: T) => { src: string; alt: string };
  /** Short always-on label rendered over/under each orbiting card. */
  getLabel: (item: T) => CardLabel;
  /** Center content shown when nothing is active (the big title block). */
  center: ReactNode;
  /** Center content shown when an item is hovered / focused / centered. */
  renderDetail: (item: T, index: number) => ReactNode;
  /** Card frame look — projects use a dark screenshot tile, certs a white-backed card. */
  cardVariant?: "screenshot" | "paper";
  /** Distance of cards from centre, as a % of the stage half-width. */
  radiusPct?: number;
  /** Card width as a % of the stage. */
  cardPct?: number;
  /** Total sweep of the open arc, in degrees (the gap = 360 − arcDeg sits at the bottom). */
  arcDeg?: number;
  className?: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

// Deterministic per-index jitter so the arc feels hand-placed / "crumbled" but is
// stable across renders (no hydration mismatch).
function jitter(seed: number, spread: number) {
  const n = Math.sin(seed * 12.9898) * 43758.5453;
  return (n - Math.floor(n) - 0.5) * 2 * spread;
}

// ─── Card frame ───────────────────────────────────────────────────────────────

function CardFrame({
  src,
  alt,
  variant,
  active,
  label,
}: {
  src: string;
  alt: string;
  variant: "screenshot" | "paper";
  active: boolean;
  label: CardLabel;
}) {
  if (variant === "paper") {
    return (
      <div
        className={cn(
          "orbit-frame relative flex h-full w-full flex-col overflow-hidden bg-[#0b0906]",
          "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          active ? "orbit-frame--active scale-[1.06]" : "scale-100"
        )}
      >
        <div className="relative min-h-0 flex-1 bg-white p-1.5">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className={cn(
              "h-full w-full rounded-md object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              active && "scale-[1.03]"
            )}
          />
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-[0.74rem] font-bold tracking-tight text-[#f3ead6]">
              {label.title}
            </p>
            {label.subtitle && (
              <p className="mt-0.5 truncate text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-[#c9a24b]">
                {label.subtitle}
              </p>
            )}
          </div>
          {label.badge}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "orbit-frame relative h-full w-full overflow-hidden",
        "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        active ? "orbit-frame--active scale-[1.07]" : "scale-100"
      )}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cn(
          "absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          active && "scale-[1.05]"
        )}
      />
      <div className="orbit-card-scrim pointer-events-none absolute inset-0" />
      {/* warm hover sheen */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br from-[#ffe6ab]/[0.10] via-transparent to-transparent transition-opacity duration-500",
          active ? "opacity-100" : "opacity-0"
        )}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5">
        <div className="min-w-0">
          <p className="truncate text-[0.95rem] font-bold tracking-tight text-white">
            {label.title}
          </p>
          {label.subtitle && (
            <p className="mt-0.5 truncate text-[0.55rem] font-semibold uppercase tracking-[0.18em] text-[#f0e3c6]/75">
              {label.subtitle}
            </p>
          )}
        </div>
        {label.badge}
      </div>
    </div>
  );
}

// ─── Desktop arc ────────────────────────────────────────────────────────────────

function OrbitArc<T>({
  items,
  getKey,
  getImage,
  getLabel,
  center,
  renderDetail,
  cardVariant,
  radiusPct,
  cardPct,
  arcDeg,
}: Required<
  Pick<
    OrbitalGalleryProps<T>,
    | "items"
    | "getKey"
    | "getImage"
    | "getLabel"
    | "center"
    | "renderDetail"
    | "cardVariant"
    | "radiusPct"
    | "cardPct"
    | "arcDeg"
  >
>) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered;
  const n = items.length;

  // Spread cards across an arc centred on the top (−90°), leaving an open gap at
  // the bottom — a horseshoe, not a closed ring.
  const startDeg = -90 - arcDeg / 2;
  const stepDeg = n > 1 ? arcDeg / (n - 1) : 0;

  return (
    <div
      className="relative mx-auto hidden aspect-square w-full max-w-[min(86vh,54rem)] md:block"
      onMouseLeave={() => setHovered(null)}
    >
      {/* Gold bloom behind the arc */}
      <div className="orbit-bloom pointer-events-none absolute inset-[8%] rounded-full blur-2xl" />

      {items.map((item, index) => {
        const { src, alt } = getImage(item);
        const deg = startDeg + index * stepDeg + jitter(index + 1, 3);
        const rad = (deg * Math.PI) / 180;
        const r = radiusPct + jitter(index + 7, 2.5);
        const left = 50 + Math.cos(rad) * r;
        const top = 50 + Math.sin(rad) * r;
        const isActive = active === index;

        const cardStyle = {
          left: `${left}%`,
          top: `${top}%`,
          width: `${cardPct}%`,
          aspectRatio: cardVariant === "paper" ? "1.42 / 1" : "1.5 / 1",
          // Base transform keeps the card centred when the float animation is
          // disabled (reduced motion); the keyframes carry it otherwise.
          transform: "translate(-50%, -50%)",
          "--orbit-delay": `${(index * 0.6).toFixed(2)}s`,
          "--orbit-dur": `${(5.6 + (index % 3) * 0.7).toFixed(2)}s`,
        } as CSSProperties;

        return (
          <button
            key={getKey(item)}
            type="button"
            aria-label={alt}
            onMouseEnter={() => setHovered(index)}
            onFocus={() => setHovered(index)}
            onClick={() => setHovered(index)}
            className={cn(
              "orbit-card group absolute block cursor-pointer rounded-[1.15rem] outline-none",
              "focus-visible:ring-2 focus-visible:ring-[#ffd98a]/70",
              isActive ? "z-30" : "z-10"
            )}
            style={cardStyle}
          >
            <CardFrame
              src={src}
              alt={alt}
              variant={cardVariant}
              active={isActive}
              label={getLabel(item)}
            />
          </button>
        );
      })}

      {/* Center slot: title ⇄ detail crossfade. Sits above the cards (incl. the
          active one at z-30) so the detail panel is never clipped by a card. */}
      <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center p-[17%]">
        <AnimatePresence mode="wait">
          {active === null ? (
            <motion.div
              key="title"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: EASE }}
              className="pointer-events-auto text-center"
            >
              {center}
            </motion.div>
          ) : (
            <motion.div
              key={getKey(items[active])}
              initial={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
              transition={{ duration: 0.32, ease: EASE }}
              className="pointer-events-auto w-full max-w-md"
            >
              {renderDetail(items[active], active)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Mobile arc carousel ─────────────────────────────────────────────────────────

function ArcCarousel<T>({
  items,
  getKey,
  getImage,
  getLabel,
  renderDetail,
  cardVariant,
}: Pick<
  OrbitalGalleryProps<T>,
  "items" | "getKey" | "getImage" | "getLabel" | "renderDetail" | "cardVariant"
>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const frame = useRef(0);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const track = trackRef.current;
      if (!track) return;
      const center = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      Array.from(track.children).forEach((child, i) => {
        const el = child as HTMLElement;
        const c = el.offsetLeft + el.offsetWidth / 2;
        const d = Math.abs(c - center);
        if (d < best) {
          best = d;
          nearest = i;
        }
      });
      setActive((prev) => (prev === nearest ? prev : nearest));
    });
  }, []);

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    const el = track?.children[i] as HTMLElement | undefined;
    if (track && el) {
      track.scrollTo({
        left: el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="md:hidden">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-[16vw] pb-2 pt-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => {
          const { src, alt } = getImage(item);
          const offset = index - active;
          const isActive = offset === 0;
          return (
            <button
              key={getKey(item)}
              type="button"
              aria-label={alt}
              onClick={() => scrollTo(index)}
              className="relative shrink-0 snap-center rounded-[1.15rem] outline-none focus-visible:ring-2 focus-visible:ring-[#ffd98a]/70"
              style={{
                width: "68vw",
                aspectRatio: cardVariant === "paper" ? "1.42 / 1" : "1.5 / 1",
                transform: `scale(${isActive ? 1 : 0.86}) translateY(${isActive ? 0 : 10}px)`,
                transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                zIndex: isActive ? 20 : 10,
              }}
            >
              <CardFrame
                src={src}
                alt={alt}
                variant={cardVariant ?? "screenshot"}
                active={isActive}
                label={getLabel(item)}
              />
            </button>
          );
        })}
      </div>

      {/* Dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={getKey(item)}
            type="button"
            aria-label={`Go to item ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active ? "w-5 bg-[#f3ead6]/80" : "w-1.5 bg-white/25"
            )}
          />
        ))}
      </div>

      {/* Active detail */}
      <div className="mx-auto mt-6 w-full max-w-md px-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={getKey(items[active])}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {renderDetail(items[active], active)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

export function OrbitalGallery<T>({
  items,
  getKey,
  getImage,
  getLabel,
  center,
  renderDetail,
  cardVariant = "screenshot",
  radiusPct = 41,
  cardPct = 31,
  arcDeg = 286,
  className,
}: OrbitalGalleryProps<T>) {
  return (
    <div className={cn("relative w-full", className)}>
      <OrbitArc
        items={items}
        getKey={getKey}
        getImage={getImage}
        getLabel={getLabel}
        center={center}
        renderDetail={renderDetail}
        cardVariant={cardVariant}
        radiusPct={radiusPct}
        cardPct={cardPct}
        arcDeg={arcDeg}
      />
      <ArcCarousel
        items={items}
        getKey={getKey}
        getImage={getImage}
        getLabel={getLabel}
        renderDetail={renderDetail}
        cardVariant={cardVariant}
      />
    </div>
  );
}
