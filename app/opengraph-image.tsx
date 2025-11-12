import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/seo";

export const alt = siteConfig.name;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const crawlYellow = "#E5B13A";
  const crawlBlack = "#000000";
  const gray300 = "#d1d5db";

  return new ImageResponse(
    (
      <div
        style={{
          background: crawlBlack,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "80px",
        }}
      >
        {/* Starfield background using SVG pattern */}
        <svg
          width="1200"
          height="630"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {/* Small stars - distributed across canvas */}
          <circle cx="95" cy="45" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="220" cy="75" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="380" cy="35" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="520" cy="85" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="680" cy="55" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="840" cy="95" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="1000" cy="65" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="1150" cy="105" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="150" cy="145" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="310" cy="175" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="470" cy="135" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="630" cy="185" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="790" cy="155" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="950" cy="195" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="1100" cy="165" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="80" cy="245" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="240" cy="275" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="400" cy="235" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="560" cy="285" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="720" cy="255" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="880" cy="295" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="1040" cy="265" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="120" cy="345" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="280" cy="375" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="440" cy="335" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="600" cy="385" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="760" cy="355" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="920" cy="395" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="1080" cy="365" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="200" cy="445" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="360" cy="475" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="520" cy="435" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="680" cy="485" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="840" cy="455" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="1000" cy="495" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="160" cy="545" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="320" cy="575" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="480" cy="535" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="640" cy="585" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="800" cy="555" r="1" fill="#ffffff" opacity="0.9" />
          <circle cx="960" cy="595" r="1" fill="#ffffff" opacity="0.9" />
          {/* Medium stars */}
          <circle cx="180" cy="120" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="450" cy="50" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="720" cy="130" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="990" cy="80" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="270" cy="220" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="540" cy="180" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="810" cy="250" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="1080" cy="200" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="90" cy="300" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="360" cy="340" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="630" cy="280" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="900" cy="320" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="180" cy="400" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="450" cy="440" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="720" cy="380" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="990" cy="420" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="270" cy="500" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="540" cy="540" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="810" cy="480" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="1080" cy="520" r="2" fill="#ffffff" opacity="0.7" />
          {/* Large stars */}
          <circle cx="300" cy="25" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="600" cy="15" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="900" cy="35" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="150" cy="160" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="450" cy="140" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="750" cy="170" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="1050" cy="150" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="240" cy="260" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="540" cy="240" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="840" cy="270" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="1140" cy="250" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="180" cy="360" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="480" cy="380" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="780" cy="350" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="1080" cy="370" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="330" cy="460" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="630" cy="480" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="930" cy="450" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="210" cy="560" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="510" cy="580" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="810" cy="550" r="3" fill="#ffffff" opacity="0.5" />
          <circle cx="1110" cy="570" r="3" fill="#ffffff" opacity="0.5" />
        </svg>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 10,
            textAlign: "center",
          }}
        >
          {/* Logo/Title */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: "900",
              marginBottom: "32px",
              color: crawlYellow,
              letterSpacing: "0.15em",
              fontFamily:
                '"Arial Black", Impact, "Franklin Gothic Heavy", sans-serif',
              textTransform: "uppercase",
              textShadow: `0 0 20px ${crawlYellow}40`,
            }}
          >
            STAR CRAWLER
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "28px",
              color: gray300,
              fontWeight: "400",
              letterSpacing: "0.05em",
              lineHeight: "1.5",
              maxWidth: "800px",
            }}
          >
            {siteConfig.description}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
