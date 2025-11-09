import type { Metadata, Viewport } from "next";
import "./globals.css";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://starcrawler.vercel.app";

export const metadata: Metadata = {
  title: "Star Crawler - Create Your Opening Crawl",
  description: "Create and share your own cinematic opening crawl animation. Free, open-source, and privacy-focused.",
  keywords: ["opening crawl", "animation", "crawl generator", "crawl creator", "cinematic crawl"],
  metadataBase: new URL(baseUrl),
  openGraph: {
    title: "Star Crawler - Create Your Opening Crawl",
    description: "Create and share your own cinematic opening crawl animation. Free, open-source, and privacy-focused.",
    url: baseUrl,
    siteName: "Star Crawler",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Star Crawler - Create Your Opening Crawl",
    description: "Create and share your own cinematic opening crawl animation.",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
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

