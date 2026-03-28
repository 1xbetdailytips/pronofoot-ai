import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PronoFoot AI - Pronostics Football par IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #059669 0%, #064e3b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px",
            }}
          >
            ⚡
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: "800",
              color: "white",
            }}
          >
            PronoFoot AI
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.9)",
            marginBottom: "40px",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          Pronostics Football par Intelligence Artificielle
        </div>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: "48px",
          }}
        >
          {[
            { label: "Matchs Analysés", value: "500+" },
            { label: "Ligues Couvertes", value: "11" },
            { label: "Mise à jour", value: "Quotidienne" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "16px 32px",
              }}
            >
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  color: "white",
                }}
              >
                {stat.value}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.7)",
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
            bottom: "24px",
            fontSize: "16px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          www.parifoot.online
        </div>
      </div>
    ),
    { ...size }
  );
}
