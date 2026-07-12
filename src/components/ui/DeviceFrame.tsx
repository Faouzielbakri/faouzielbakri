import Image from "next/image";

type DeviceFrameProps = {
  src?: string;
  alt: string;
  accent: string;
  kind?: "desktop" | "mobile";
  monogram?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Browser/phone-style frame around a project screenshot. Renders an
 * accent-tinted monogram placeholder when the capture doesn't exist yet.
 */
export function DeviceFrame({
  src,
  alt,
  accent,
  kind = "desktop",
  monogram,
  priority,
  sizes,
}: DeviceFrameProps) {
  const isDesktop = kind === "desktop";
  // Mobile matches the 390×844 capture viewport (~iPhone screen ratio) so
  // the frame keeps real phone proportions and never crops the shot.
  const aspect = isDesktop ? "aspect-[16/10]" : "aspect-[390/844]";
  const radius = isDesktop ? "rounded-xl" : "rounded-[1.25rem]";

  return (
    <figure
      className={`relative overflow-hidden border border-line bg-surface shadow-[0_24px_60px_-24px_rgba(20,18,16,0.25)] ${radius}`}
    >
      {isDesktop && (
        <div className="flex items-center gap-1.5 border-b border-line bg-bg px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
        </div>
      )}
      <div className={`relative ${aspect}`}>
        {!isDesktop && (
          <span
            aria-hidden
            className="absolute left-1/2 top-[2.1%] z-10 h-[2.6%] w-[30%] -translate-x-1/2 rounded-full bg-black/90"
          />
        )}
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes ?? (isDesktop ? "(min-width: 1024px) 55vw, 90vw" : "20vw")}
            priority={priority}
            className="object-cover object-top"
          />
        ) : (
          <div
            role="img"
            aria-label={alt}
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${accent}14 0%, ${accent}33 100%)`,
            }}
          >
            <span
              className="font-display text-6xl font-bold opacity-40"
              style={{ color: accent }}
            >
              {monogram ?? alt.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    </figure>
  );
}
