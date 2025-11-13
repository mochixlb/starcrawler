import type { Metadata, Viewport } from "next";
import "./globals.css";
import {
  siteConfig,
  createMetadata,
  getWebApplicationStructuredData,
} from "@/lib/seo";

const baseMetadata = createMetadata({
  title: "Star Crawler - Create Your Opening Crawl",
  description: siteConfig.description,
  path: "/",
  structuredData: getWebApplicationStructuredData(),
});

export const metadata: Metadata = {
  ...baseMetadata,
  metadataBase: new URL(siteConfig.url),
  keywords: [
    "opening crawl",
    "animation",
    "crawl generator",
    "crawl creator",
    "cinematic crawl",
  ],
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover", // For iOS devices with notch
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  );
}

