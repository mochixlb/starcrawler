import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Star Crawler - Create Your Opening Crawl",
  description: "Create your own opening crawl animation",
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

