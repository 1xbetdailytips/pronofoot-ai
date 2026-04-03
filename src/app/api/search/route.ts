import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ results: [], message: "Query too short" });
    }

    // Search fixtures by team name or league name (case-insensitive, last 7 days + today + tomorrow)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: fixtures, error } = await supabase
      .from("fixtures")
      .select("*")
      .gte("match_date", sevenDaysAgo.toISOString().slice(0, 10) + "T00:00:00")
      .lte("match_date", tomorrow.toISOString().slice(0, 10) + "T23:59:59")
      .or(`home_team.ilike.%${q}%,away_team.ilike.%${q}%,league_name.ilike.%${q}%`)
      .order("match_date", { ascending: false })
      .limit(30);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch tips for these fixtures
    const ids = (fixtures || []).map((f: { id: number }) => f.id);
    const { data: tips } = ids.length > 0
      ? await supabase.from("tips").select("*").in("fixture_id", ids)
      : { data: [] };

    const tipMap = new Map<number, Record<string, unknown>>();
    (tips || []).forEach((t: { fixture_id: number }) => tipMap.set(t.fixture_id, t));

    // Fetch results for resolved matches
    const { data: results } = ids.length > 0
      ? await supabase.from("results_log").select("fixture_id, is_correct, prediction, actual_result").in("fixture_id", ids)
      : { data: [] };

    const resultMap = new Map<number, { is_correct: boolean; prediction: string; actual_result: string }>();
    (results || []).forEach((r: { fixture_id: number; is_correct: boolean; prediction: string; actual_result: string }) =>
      resultMap.set(r.fixture_id, r)
    );

    const enriched = (fixtures || []).map((f: { id: number }) => ({
      ...f,
      tip: tipMap.get(f.id) || null,
      result: resultMap.get(f.id) || null,
    }));

    return NextResponse.json({ results: enriched, count: enriched.length });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
