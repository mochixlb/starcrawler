import type { Metadata } from "next";
import Link from "next/link";
import { LegalLayout } from "@/components/legal/legal-layout";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://starcrawler.vercel.app";

export const metadata: Metadata = {
  title: "Terms of Service - Star Crawler",
  description: "Terms of Service for Star Crawler - Read our terms and conditions",
  openGraph: {
    title: "Terms of Service - Star Crawler",
    description: "Terms of Service for Star Crawler - Read our terms and conditions",
    url: `${baseUrl}/terms`,
  },
  twitter: {
    card: "summary",
    title: "Terms of Service - Star Crawler",
    description: "Terms of Service for Star Crawler - Read our terms and conditions",
  },
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p className="text-gray-300">
        <strong>Last Updated:</strong> {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <h2>What Star Crawler Is</h2>
      <p>
        Star Crawler is a free, open-source personal project licensed under the MIT License that lets you create and share opening crawl animations. It's provided "as is"—we don't make any promises about it working perfectly all the time.
      </p>

      <h2>Using Star Crawler</h2>
      <p>
        By using Star Crawler, you agree to these terms. If you don't agree, don't use it.
      </p>

      <h2>What You Can't Do</h2>
      <p>
        Please don't:
      </p>
      <ul>
        <li>Create content that's illegal, harmful, or harassing</li>
        <li>Create content that violates someone else's rights</li>
        <li>Pretend to be someone else or claim affiliation with Star Wars</li>
        <li>Try to break or hack the service</li>
        <li>Use automated tools to overload our servers</li>
      </ul>

      <h2>Your Content</h2>
      <p>
        <strong>You own what you create.</strong> When you make a crawl, it's yours. We just provide the tool.
      </p>
      <p>
        You're responsible for your content. Make sure:
      </p>
      <ul>
        <li>You have the right to create and share it</li>
        <li>It doesn't break any laws</li>
        <li>It doesn't violate anyone else's rights</li>
        <li>It follows these terms</li>
      </ul>
      <p>
        We can remove content that violates these terms, but we're not obligated to monitor everything.
      </p>

      <h2>Who Owns What</h2>
      <p>
        Star Crawler (the tool itself) belongs to us. The content you create belongs to you.
      </p>
      <p>
        <strong>Important:</strong> Star Crawler is not affiliated with Star Wars, Lucasfilm, or Disney. This is just a personal fan project. Star Wars is a trademark of Lucasfilm Ltd.
      </p>

      <h2>No Guarantees</h2>
      <p>
        Star Crawler might not always work perfectly. The service could go down, have bugs, or change. We're not responsible if something goes wrong or you lose your content.
      </p>
      <p>
        Since your content only exists in URLs, if you lose the link, the content is gone. We can't recover it because we don't store it.
      </p>

      <h2>Links to Other Sites</h2>
      <p>
        When you share crawls on social media, you're using other websites. We're not responsible for those sites or their policies.
      </p>

      <h2>If Something Goes Wrong</h2>
      <p>
        We're not liable for any problems that come from using Star Crawler. Use it at your own risk.
      </p>
      <p>
        If you do something that causes problems for us or others, you're responsible—not us.
      </p>

      <h2>We Can Stop Providing the Service</h2>
      <p>
        We can stop offering Star Crawler or block access at any time, for any reason. We'll try to give notice if it's something we're doing intentionally, but we're not required to.
      </p>

      <h2>Governing Law</h2>
      <p>
        These Terms of Service are governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from or relating to these terms or your use of Star Crawler shall be resolved in accordance with applicable United States law.
      </p>

      <h2>Dispute Resolution</h2>
      <p>
        Star Crawler is provided as a free personal project. If you have concerns about the service, please review these terms and our other legal pages. Given the nature of this project, we encourage resolving any issues through understanding how the service works rather than formal dispute resolution.
      </p>

      <h2>Severability</h2>
      <p>
        If any provision of these terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these terms will otherwise remain in full force and effect.
      </p>

      <h2>Entire Agreement</h2>
      <p>
        These Terms of Service, together with our Privacy Policy and Disclaimer, constitute the entire agreement between you and Star Crawler regarding your use of the service.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We might update these terms occasionally. If we make big changes, we'll try to let you know. The date at the top shows when we last updated them. Your continued use of Star Crawler after changes are posted constitutes your acceptance of the new terms.
      </p>

      <h2>Questions About These Terms</h2>
      <p>
        These terms are designed to be straightforward and reflect how Star Crawler works as a free personal project. If you have questions about how the service operates, you can review the <Link href="/" className="text-crawl-yellow hover:underline">homepage</Link> for more information.
      </p>
    </LegalLayout>
  );
}
