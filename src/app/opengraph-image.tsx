import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const runtime = "edge";
export const alt = "PronoFoot AI - Pronostics Football par IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Fetch logo as base64 for embedding in OG image
  let logoSrc: string | null = null;
  try {
    const logoRes = await fetch(new URL("/images/logo.png", siteConfig.url));
    if (logoRes.ok) {
      const buf = await logoRes.arrayBuffer();
      logoSrc = `data:image/png;base64,${Buffer.from(buf).toString("base64")}`;
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(145deg, #0a2d4d 0%, #071e38 50%, #0c3050 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Background pattern circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            border: "2px solid rgba(30,170,232,0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            border: "2px solid rgba(30,170,232,0.1)",
            display: "flex",
          }}
        />

        {/* Logo */}
        {logoSrc && (
          <img
            src={logoSrc}
            width={180}
            height={180}
            style={{ marginBottom: "20px" }}
          />
        )}

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              fontSize: "56px",
              fontWeight: "800",
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            Prono
          </span>
          <span
            style={{
              fontSize: "56px",
              fontWeight: "800",
              color: "#1eaae8",
              letterSpacing: "-1px",
            }}
          >
            Foot
          </span>
          <span
            style={{
              fontSize: "32px",
              fontWeight: "700",
              color: "#7dd3fc",
              marginLeft: "4px",
            }}
          >
            AI
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          Pronostics Football par Intelligence Artificielle
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "32px",
          }}
        >
          {[
            { label: "Matchs Analysés", value: "500+" },
            { label: "Ligues Couvertes", value: "23" },
            { label: "Mise à jour", value: "Quotidienne" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(30,170,232,0.12)",
                border: "1px solid rgba(30,170,232,0.2)",
                borderRadius: "16px",
                padding: "14px 28px",
              }}
            >
              <span
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  color: "#FBBF24",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.5)",
                  marginTop: "4px",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            fontSize: "15px",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "1px",
          }}
        >
          www.parifoot.online
        </div>
      </div>
    ),
    { ...size }
  );
}
