import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // AI search bots — explicitly welcome for search/citation
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/*/login", "/*/compte"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
      // Block training-only crawlers (no attribution benefit)
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
      {
        userAgent: "cohere-ai",
        disallow: "/",
      },
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
      // Default: allow all traditional search engines
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/*/login", "/*/compte"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
