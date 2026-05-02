// Pure CSS flowing gradient — same monochrome orb aesthetic as the hero,
// without the WebGL overhead of NeatGradientBg.
export function SectionGradientBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Film-grain texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "180px",
        }}
      />

      {/* Primary orb — top-left drift */}
      <div
        className="absolute rounded-full"
        style={{
          width: "min(70vw, 820px)",
          height: "min(70vw, 820px)",
          top: "-18%",
          left: "-12%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.072) 0%, rgba(230,230,230,0.035) 45%, transparent 70%)",
          filter: "blur(64px)",
          animation: "sgb-orb-a 22s ease-in-out infinite alternate",
        }}
      />

      {/* Secondary orb — bottom-right drift */}
      <div
        className="absolute rounded-full"
        style={{
          width: "min(55vw, 680px)",
          height: "min(55vw, 680px)",
          bottom: "-22%",
          right: "-14%",
          background:
            "radial-gradient(circle, rgba(200,200,200,0.055) 0%, rgba(255,255,255,0.022) 50%, transparent 70%)",
          filter: "blur(80px)",
          animation: "sgb-orb-b 28s ease-in-out infinite alternate",
        }}
      />

      {/* Accent orb — centre drift */}
      <div
        className="absolute rounded-full"
        style={{
          width: "min(45vw, 580px)",
          height: "min(45vw, 580px)",
          top: "22%",
          left: "28%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.032) 0%, transparent 65%)",
          filter: "blur(90px)",
          animation: "sgb-orb-c 34s ease-in-out infinite alternate",
        }}
      />

      {/* Edge vignette — keeps text readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_50%_50%,transparent_40%,#080808_100%)]" />
    </div>
  );
}
