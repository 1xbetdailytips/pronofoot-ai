import { createClient } from "@supabase/supabase-js";
import type { MetadataRoute } from "next";
import { siteConfig, COVERED_LEAGUES } from "@/lib/config";

const BASE_URL = siteConfig.url;
const LOCALES = ["fr", "en"];

const STATIC_ROUTES = [
  { path: "", priority: 1.0, changeFreq: "daily" },
  { path: "/predictions", priority: 0.9, changeFreq: "daily" },
  { path: "/rapport-du-jour", priority: 0.9, changeFreq: "daily" },
  { path: "/tickets", priority: 0.8, changeFreq: "daily" },
  { path: "/stats", priority: 0.8, changeFreq: "daily" },
  { path: "/vip", priority: 0.7, changeFreq: "weekly" },
  { path: "/blog", priority: 0.8, changeFreq: "daily" },
  { path: "/responsible-gambling", priority: 0.3, changeFreq: "monthly" },
  { path: "/terms", priority: 0.3, changeFreq: "monthly" },
  { path: "/privacy", priority: 0.3, changeFreq: "monthly" },
] as const;

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // ── Static pages (both locales) with hreflang alternates ──────────────
  for (const route of STATIC_ROUTES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFreq,
        priority: route.priority,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr${route.path}`,
            en: `${BASE_URL}/en${route.path}`,
          },
        },
      });
    }
  }

  // ── League landing pages ────────────────────────────────────────────
  for (const league of COVERED_LEAGUES) {
    const leagueSlug = toSlug(league.name);
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/ligue/${leagueSlug}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.7,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr/ligue/${leagueSlug}`,
            en: `${BASE_URL}/en/ligue/${leagueSlug}`,
          },
        },
      });
    }
  }

  // ── Dynamic prediction pages ─────────────────────────────────────────
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Last 30 days of fixtures
    const cutoff = new Date(Date.now() - 30 * 86400000).toISOString();

    const { data: fixtures } = await supabase
      .from("fixtures")
      .select("id, home_team, away_team, match_date")
      .gte("match_date", cutoff)
      .order("match_date", { ascending: false })
      .limit(200);

    if (fixtures) {
      for (const f of fixtures) {
        const slug = `${toSlug(f.home_team)}-vs-${toSlug(f.away_team)}-${f.id}`;
        const lastMod = new Date(f.match_date);
        for (const locale of LOCALES) {
          entries.push({
            url: `${BASE_URL}/${locale}/predictions/${slug}`,
            lastModified: lastMod,
            changeFrequency: "daily",
            priority: 0.6,
            alternates: {
              languages: {
                fr: `${BASE_URL}/fr/predictions/${slug}`,
                en: `${BASE_URL}/en/predictions/${slug}`,
              },
            },
          });
        }
      }
    }
  } catch {
    // Non-blocking — static pages still included
  }

  // ── Blog articles ──────────────────────────────────────────────────
  try {
    const supabaseBlog = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: articles } = await supabaseBlog
      .from("seo_articles")
      .select("slug, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(200);

    if (articles) {
      for (const a of articles) {
        const lastMod = new Date(a.published_at);
        for (const locale of LOCALES) {
          entries.push({
            url: `${BASE_URL}/${locale}/blog/${a.slug}`,
            lastModified: lastMod,
            changeFrequency: "weekly",
            priority: 0.7,
            alternates: {
              languages: {
                fr: `${BASE_URL}/fr/blog/${a.slug}`,
                en: `${BASE_URL}/en/blog/${a.slug}`,
              },
            },
          });
        }
      }
    }
  } catch {
    // Non-blocking
  }

  return entries;
}
