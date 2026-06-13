import { ImageResponse } from "next/og";

export const alt = "Bibek Pathak · Full-Stack Engineer / AI & ML Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Dynamically generated social share card. Matches the site's dark, monochrome aesthetic.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#080808",
          backgroundImage:
            "radial-gradient(ellipse 80% 70% at 70% 40%, rgba(255,255,255,0.10), transparent 60%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top: availability badge */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 22px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.8)",
              fontSize: "20px",
              fontWeight: 600,
              letterSpacing: "4px",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "999px",
                background: "#ffffff",
              }}
            />
            AVAILABLE FOR WORK
          </div>
        </div>

        {/* Middle: name + role */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: "128px",
              fontWeight: 800,
              letterSpacing: "-4px",
              lineHeight: 1,
              color: "#ffffff",
            }}
          >
            BIBEK PATHAK
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "28px",
              fontSize: "34px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Full-Stack Engineer&nbsp;
            <span style={{ color: "rgba(255,255,255,0.3)" }}>/</span>
            &nbsp;AI &amp; ML Developer
          </div>
        </div>

        {/* Bottom: brand + stack */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "32px",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "26px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.5px",
            }}
          >
            BIBEK.TECH
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "22px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "1px",
            }}
          >
            React · Next.js · Python · AI/ML
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
