import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/ui/footer";
import { Starfield } from "@/components/crawl/starfield";

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function LegalLayout({ children, title }: LegalLayoutProps) {
  return (
    <main className="relative min-h-screen bg-crawl-black">
      <div className="hidden md:block">
        <Starfield />
      </div>
      
      <div className="relative z-20 min-h-screen">
        {/* Header */}
        <div className="border-b border-crawl-yellow/10 bg-black/40 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 sm:px-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-crawl-yellow/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crawl-yellow/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{ letterSpacing: "0.05em", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" }}
            >
              <ArrowLeft className="size-4" />
              Back to Star Crawler
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:py-12">
          <div className="mx-auto max-w-3xl">
            <h1
              className="mb-8 text-3xl font-bold uppercase tracking-wider text-crawl-yellow sm:text-4xl md:text-5xl"
              style={{ letterSpacing: "0.15em", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" }}
            >
              {title}
            </h1>
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:text-crawl-yellow [&_h2]:sm:text-2xl [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-base [&_h3]:font-bold [&_h3]:uppercase [&_h3]:tracking-wider [&_h3]:text-crawl-yellow/90 [&_h3]:sm:text-lg [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-sm [&_p]:sm:text-base [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_li]:leading-relaxed [&_li]:text-sm [&_li]:sm:text-base [&_strong]:font-semibold [&_strong]:text-gray-200" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" }}>
                {children}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}

