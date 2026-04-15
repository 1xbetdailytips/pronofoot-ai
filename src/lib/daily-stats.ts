/**
 * Daily Stats Library
 *
 * Pulls visitor analytics from Supabase and returns structured data
 * for the daily email report. Used by /api/cron/daily-stats.
 *
 * Mirrors the logic of scripts/visitor-stats.mjs but typed and reusable.
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface DailyStats {
  generatedAt: string;       // ISO timestamp
  totalAllTime: number;
  todayCount: number;
  yesterdayCount: number;
  last7DayCount: number;
  last30DayCount: number;
  firstVisit?: string;
  mostRecentVisit?: string;
  dailyTrend: Array<{ date: string; count: number }>;
  topCountries: Array<{ name: string; count: number; share: number }>;
  topPages: Array<{ page: string; count: number }>;
  topReferrers: Array<{ referrer: string; count: number }>;
  devices: Array<{ device: string; count: number; share: number }>;
  utmCampaigns: Array<{ source: string; medium: string; campaign: string; count: number }>;
  // Day-over-day deltas
  dayOverDayChange: number;       // yesterday vs day before
  dayOverDayChangePct: number;
}

function startOfDayUtc(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export async function getDailyStats(): Promise<DailyStats> {
  const now = new Date();
  const todayUtc = startOfDayUtc(now);
  const yesterdayUtc = new Date(todayUtc.getTime() - 86400000);
  const dayBeforeUtc = new Date(todayUtc.getTime() - 2 * 86400000);
  const sevenDaysAgo = new Date(todayUtc.getTime() - 7 * 86400000);
  const thirtyDaysAgo = new Date(todayUtc.getTime() - 30 * 86400000);
  const fourteenDaysAgo = new Date(todayUtc.getTime() - 14 * 86400000);

  // --- Counts ---
  const [{ count: totalAllTime }, { count: todayCount }, { count: yesterdayCount }, { count: dayBeforeCount }, { count: last7DayCount }, { count: last30DayCount }] =
    await Promise.all([
      supabase.from("visitors").select("*", { count: "exact", head: true }),
      supabase.from("visitors").select("*", { count: "exact", head: true }).gte("created_at", todayUtc.toISOString()),
      supabase.from("visitors").select("*", { count: "exact", head: true }).gte("created_at", yesterdayUtc.toISOString()).lt("created_at", todayUtc.toISOString()),
      supabase.from("visitors").select("*", { count: "exact", head: true }).gte("created_at", dayBeforeUtc.toISOString()).lt("created_at", yesterdayUtc.toISOString()),
      supabase.from("visitors").select("*", { count: "exact", head: true }).gte("created_at", sevenDaysAgo.toISOString()),
      supabase.from("visitors").select("*", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo.toISOString()),
    ]);

  // --- First/last visit ---
  const [firstRow, lastRow] = await Promise.all([
    supabase.from("visitors").select("created_at").order("created_at", { ascending: true }).limit(1).maybeSingle(),
    supabase.from("visitors").select("created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  // --- Daily trend (last 14 days) ---
  const { data: recent14 } = await supabase
    .from("visitors")
    .select("created_at")
    .gte("created_at", fourteenDaysAgo.toISOString())
    .order("created_at", { ascending: true });

  const byDay: Record<string, number> = {};
  for (const r of recent14 ?? []) {
    const d = new Date(r.created_at).toISOString().slice(0, 10);
    byDay[d] = (byDay[d] ?? 0) + 1;
  }
  const dailyTrend = Object.entries(byDay)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  // --- Top countries ---
  const { data: countryRows } = await supabase.from("visitors").select("country");
  const countryAgg: Record<string, number> = {};
  for (const r of countryRows ?? []) {
    const c = r.country || "(unknown)";
    countryAgg[c] = (countryAgg[c] ?? 0) + 1;
  }
  const totalForCountryShare = Object.values(countryAgg).reduce((a, b) => a + b, 0) || 1;
  const topCountries = Object.entries(countryAgg)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([name, count]) => ({
      name,
      count,
      share: Math.round((count / totalForCountryShare) * 1000) / 10,
    }));

  // --- Top pages ---
  const { data: pageRows } = await supabase.from("visitors").select("page");
  const pageAgg: Record<string, number> = {};
  for (const r of pageRows ?? []) {
    const p = r.page || "(unknown)";
    pageAgg[p] = (pageAgg[p] ?? 0) + 1;
  }
  const topPages = Object.entries(pageAgg)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([page, count]) => ({ page, count }));

  // --- Top referrers ---
  const { data: refRows } = await supabase.from("visitors").select("referrer");
  const refAgg: Record<string, number> = {};
  for (const r of refRows ?? []) {
    let ref = r.referrer || "(direct)";
    try {
      if (ref !== "(direct)") {
        const u = new URL(ref);
        ref = u.hostname;
      }
    } catch {}
    refAgg[ref] = (refAgg[ref] ?? 0) + 1;
  }
  const topReferrers = Object.entries(refAgg)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([referrer, count]) => ({ referrer, count }));

  // --- Devices ---
  const { data: devRows } = await supabase.from("visitors").select("device");
  const devAgg: Record<string, number> = {};
  for (const r of devRows ?? []) {
    const d = r.device || "(unknown)";
    devAgg[d] = (devAgg[d] ?? 0) + 1;
  }
  const totalForDevShare = Object.values(devAgg).reduce((a, b) => a + b, 0) || 1;
  const devices = Object.entries(devAgg)
    .sort((a, b) => b[1] - a[1])
    .map(([device, count]) => ({
      device,
      count,
      share: Math.round((count / totalForDevShare) * 1000) / 10,
    }));

  // --- UTM campaigns ---
  const { data: utmRows } = await supabase
    .from("visitors")
    .select("utm_source, utm_medium, utm_campaign")
    .not("utm_source", "is", null);
  const utmAgg: Record<string, { source: string; medium: string; campaign: string; count: number }> = {};
  for (const r of utmRows ?? []) {
    const k = `${r.utm_source ?? "?"}/${r.utm_medium ?? "?"}/${r.utm_campaign ?? "?"}`;
    if (!utmAgg[k]) {
      utmAgg[k] = {
        source: r.utm_source ?? "?",
        medium: r.utm_medium ?? "?",
        campaign: r.utm_campaign ?? "?",
        count: 0,
      };
    }
    utmAgg[k].count++;
  }
  const utmCampaigns = Object.values(utmAgg)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Day-over-day delta
  const yest = yesterdayCount ?? 0;
  const dayB = dayBeforeCount ?? 0;
  const dayOverDayChange = yest - dayB;
  const dayOverDayChangePct = dayB > 0 ? Math.round(((yest - dayB) / dayB) * 1000) / 10 : 0;

  return {
    generatedAt: now.toISOString(),
    totalAllTime: totalAllTime ?? 0,
    todayCount: todayCount ?? 0,
    yesterdayCount: yest,
    last7DayCount: last7DayCount ?? 0,
    last30DayCount: last30DayCount ?? 0,
    firstVisit: firstRow.data?.created_at,
    mostRecentVisit: lastRow.data?.created_at,
    dailyTrend,
    topCountries,
    topPages,
    topReferrers,
    devices,
    utmCampaigns,
    dayOverDayChange,
    dayOverDayChangePct,
  };
}
