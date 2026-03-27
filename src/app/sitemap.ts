import { createClient } from "@supabase/supabase-js";
import type { MetadataRoute } from "next";

const BASE_URL = "https://parifoot.online";
const LOCALES = ["fr", "en"];

const STATIC_ROUTES = [
  { path: "", priority: 1.0, changeFreq: "daily" },
  { path: "/predictions", priority: 0.9, changeFreq: "daily" },
  { path: "/rapport-du-jour", priority: 0.9, changeFreq: "daily" },
  { path: "/tickets", priority: 0.8, changeFreq: "daily" },
  { path: "/vip", priority: 0.7, changeFreq: "weekly" },
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

  // ── Static pages (both locales) ──────────────────────────────────────────
  for (const locale of LOCALES) {
    for (const route of STATIC_ROUTES) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFreq,
        priority: route.priority,
      });
    }
  }

  // ── Dynamic prediction pages ─────────────────────────────────────────────
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Last 30 days of fixtures
    const cutoff = new Date(Date.now() - 30 * 86400000).toISOString();

    const { data: fixtures } = await supabase
      .from("fixtures")
      .select("home_team, away_team, match_date")
      .gte("match_date", cutoff)
      .order("match_date", { ascending: false })
      .limit(200);

    if (fixtures) {
      for (const f of fixtures) {
        const slug = `${toSlug(f.home_team)}-vs-${toSlug(f.away_team)}`;
        const lastMod = new Date(f.match_date);
        for (const locale of LOCALES) {
          entries.push({
            url: `${BASE_URL}/${locale}/predictions/${slug}`,
            lastModified: lastMod,
            changeFrequency: "daily",
            priority: 0.6,
          });
        }
      }
    }
  } catch {
    // Non-blocking — static pages still included
  }

  return entries;
}
