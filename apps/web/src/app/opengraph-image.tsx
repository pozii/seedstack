import { ImageResponse } from "next/og";

export const alt = "Seedstack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: 96,
        backgroundColor: "#09090b",
        color: "#ffffff",
      }}
    >
      <div style={{ fontSize: 96, fontWeight: 700 }}>Seedstack</div>
      <div style={{ fontSize: 36, color: "#a1a1aa" }}>
        Production-ready Next.js SaaS foundation.
      </div>
    </div>,
    { ...size },
  );
}
