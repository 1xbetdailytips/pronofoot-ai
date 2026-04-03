import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Fixture } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    // Validate date format (YYYY-MM-DD) or default to today
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const date = dateParam && dateRegex.test(dateParam) ? dateParam : new Date().toISOString().slice(0, 10);

    // Fetch fixtures + tips + results in parallel
    const [fixturesRes, tipsRes, resultsRes] = await Promise.all([
      supabase.from("fixtures").select("*")
        .gte("match_date", `${date}T00:00:00`)
        .lte("match_date", `${date}T23:59:59`)
        .order("match_date", { ascending: true }),
      supabase.from("tips").select("fixture_id, prediction, confidence, best_pick"),
      supabase.from("results_log").select("fixture_id, is_correct"),
    ]);

    if (fixturesRes.error) {
      console.error("Livescore API error:", fixturesRes.error);
      return NextResponse.json({ error: "Failed to fetch fixtures" }, { status: 500 });
    }

    const tipMap = new Map<number, { prediction: string; confidence: number; best_pick: string | null }>();
    (tipsRes.data || []).forEach((t: { fixture_id: number; prediction: string; confidence: number; best_pick: string | null }) =>
      tipMap.set(t.fixture_id, t)
    );

    const resultMap = new Map<number, boolean>();
    (resultsRes.data || []).forEach((r: { fixture_id: number; is_correct: boolean }) =>
      resultMap.set(r.fixture_id, r.is_correct)
    );

    const predicted = ((fixturesRes.data as Fixture[]) || [])
      .filter(f => tipMap.has(f.id))
      .map(f => {
        const tip = tipMap.get(f.id);
        return {
          ...f,
          tip_prediction: tip?.prediction ?? null,
          tip_confidence: tip?.confidence ?? null,
          tip_best_pick: tip?.best_pick ?? null,
          result_correct: resultMap.get(f.id) ?? null,
        };
      });

    return NextResponse.json({
      fixtures: predicted,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Livescore API unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
