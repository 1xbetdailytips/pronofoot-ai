import { createClient } from "@supabase/supabase-js";
import type { MetadataRoute } from "next";
import { siteConfig, COVERED_LEAGUES } from "@/lib/config";

const BASE_URL = siteConfig.url;
const LOCALES = ["fr", "en"];

const STATIC_ROUTES = [
  { path: "" },
  { path: "/predictions" },
  { path: "/rapport-du-jour" },
  { path: "/tickets" },
  { path: "/stats" },
  { path: "/livescore" },
  { path: "/ai-lab" },
  { path: "/bet-builder" },
  { path: "/vip" },
  { path: "/blog" },
  { path: "/about" },
  { path: "/responsible-gambling" },
  { path: "/terms" },
  { path: "/privacy" },
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

  // -- Static pages (both locales) with hreflang alternates ----------------
  for (const route of STATIC_ROUTES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: now,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr${route.path}`,
            en: `${BASE_URL}/en${route.path}`,
            "x-default": `${BASE_URL}/fr${route.path}`,
          },
        },
      });
    }
  }

  // -- League landing pages ------------------------------------------------
  for (const league of COVERED_LEAGUES) {
    const leagueSlug = toSlug(league.name);
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}/ligue/${leagueSlug}`,
        lastModified: now,
        alternates: {
          languages: {
            fr: `${BASE_URL}/fr/ligue/${leagueSlug}`,
            en: `${BASE_URL}/en/ligue/${leagueSlug}`,
            "x-default": `${BASE_URL}/fr/ligue/${leagueSlug}`,
          },
        },
      });
    }
  }

  // -- Dynamic prediction pages --------------------------------------------
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Last 90 days of fixtures (extended from 30 for better coverage)
    const cutoff = new Date(Date.now() - 90 * 86400000).toISOString();

    const { data: fixtures } = await supabase
      .from("fixtures")
      .select("id, home_team, away_team, match_date")
      .gte("match_date", cutoff)
      .order("match_date", { ascending: false })
      .limit(500);

    if (fixtures) {
      for (const f of fixtures) {
        const slug = `${toSlug(f.home_team)}-vs-${toSlug(f.away_team)}-${f.id}`;
        const lastMod = new Date(f.match_date);
        for (const locale of LOCALES) {
          entries.push({
            url: `${BASE_URL}/${locale}/predictions/${slug}`,
            lastModified: lastMod,
            alternates: {
              languages: {
                fr: `${BASE_URL}/fr/predictions/${slug}`,
                en: `${BASE_URL}/en/predictions/${slug}`,
                "x-default": `${BASE_URL}/fr/predictions/${slug}`,
              },
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("[sitemap] Failed to fetch fixtures:", error);
  }

  // -- Blog articles -------------------------------------------------------
  try {
    const supabaseBlog = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: articles, error } = await supabaseBlog
      .from("seo_articles")
      .select("slug, published_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("[sitemap] Blog query error:", error.message);
    }

    if (articles) {
      for (const a of articles) {
        const lastMod = new Date(a.published_at);
        for (const locale of LOCALES) {
          entries.push({
            url: `${BASE_URL}/${locale}/blog/${a.slug}`,
            lastModified: lastMod,
            alternates: {
              languages: {
                fr: `${BASE_URL}/fr/blog/${a.slug}`,
                en: `${BASE_URL}/en/blog/${a.slug}`,
                "x-default": `${BASE_URL}/fr/blog/${a.slug}`,
              },
            },
          });
        }
      }
    }
  } catch (error) {
    console.error("[sitemap] Failed to fetch blog articles:", error);
  }

  return entries;
}
