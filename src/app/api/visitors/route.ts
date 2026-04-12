import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    // Parallel queries
    const [todayRes, weekRes, monthRes, allRes] = await Promise.all([
      supabase.from("visitors").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
      supabase.from("visitors").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
      supabase.from("visitors").select("id", { count: "exact", head: true }).gte("created_at", monthAgo),
      supabase.from("visitors").select("id", { count: "exact", head: true }),
    ]);

    // Top countries (last 30 days)
    const { data: countryData } = await supabase
      .from("visitors")
      .select("country")
      .gte("created_at", monthAgo)
      .order("created_at", { ascending: false })
      .limit(1000);

    const countryCounts: Record<string, number> = {};
    (countryData || []).forEach((v) => {
      const c = v.country || "Unknown";
      countryCounts[c] = (countryCounts[c] || 0) + 1;
    });
    const topCountries = Object.entries(countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, count]) => ({ country, count }));

    // Top referrers (last 30 days)
    const { data: refData } = await supabase
      .from("visitors")
      .select("referrer")
      .gte("created_at", monthAgo)
      .order("created_at", { ascending: false })
      .limit(1000);

    const refCounts: Record<string, number> = {};
    (refData || []).forEach((v) => {
      const r = v.referrer || "direct";
      refCounts[r] = (refCounts[r] || 0) + 1;
    });
    const topReferrers = Object.entries(refCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([source, count]) => ({ source, count }));

    // Top pages (last 30 days)
    const { data: pageData } = await supabase
      .from("visitors")
      .select("page")
      .gte("created_at", monthAgo)
      .order("created_at", { ascending: false })
      .limit(1000);

    const pageCounts: Record<string, number> = {};
    (pageData || []).forEach((v) => {
      const p = v.page || "/";
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, count]) => ({ page, count }));

    // Device breakdown (last 30 days)
    const { data: deviceData } = await supabase
      .from("visitors")
      .select("device")
      .gte("created_at", monthAgo)
      .order("created_at", { ascending: false })
      .limit(1000);

    const deviceCounts: Record<string, number> = {};
    (deviceData || []).forEach((v) => {
      const d = v.device || "unknown";
      deviceCounts[d] = (deviceCounts[d] || 0) + 1;
    });

    // Recent visitors (last 20)
    const { data: recentVisitors } = await supabase
      .from("visitors")
      .select("ip, country, city, referrer, page, device, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    return NextResponse.json({
      visitors: {
        today: todayRes.count || 0,
        last7days: weekRes.count || 0,
        last30days: monthRes.count || 0,
        allTime: allRes.count || 0,
      },
      topCountries,
      topReferrers,
      topPages,
      devices: deviceCounts,
      recentVisitors: (recentVisitors || []).map((v) => ({
        ...v,
        ip: v.ip.replace(/\.\d+$/, ".***"), // Mask last octet for privacy
      })),
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("[visitors] Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
