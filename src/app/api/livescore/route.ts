import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Fixture } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const date =
      dateParam && dateRegex.test(dateParam)
        ? dateParam
        : new Date().toISOString().slice(0, 10);

    // Fetch ALL fixtures for the date (increase limit to get all matches)
    const { data: fixtures, error: fError } = await supabase
      .from("fixtures")
      .select("*")
      .gte("match_date", `${date}T00:00:00`)
      .lte("match_date", `${date}T23:59:59`)
      .order("match_date", { ascending: true })
      .limit(2000);

    if (fError || !fixtures) {
      console.error("Livescore API error:", fError);
      return NextResponse.json(
        { error: "Failed to fetch fixtures" },
        { status: 500 }
      );
    }

    // Get fixture IDs for targeted tip query
    const fixtureIds = fixtures.map((f: Fixture) => f.id);

    // Fetch tips + results only for today's fixtures (not ALL tips)
    const [tipsRes, resultsRes] = await Promise.all([
      fixtureIds.length > 0
        ? supabase
            .from("tips")
            .select("fixture_id, prediction, confidence, best_pick")
            .in("fixture_id", fixtureIds)
        : Promise.resolve({ data: [] }),
      fixtureIds.length > 0
        ? supabase
            .from("results_log")
            .select("fixture_id, is_correct")
            .in("fixture_id", fixtureIds)
        : Promise.resolve({ data: [] }),
    ]);

    const tipMap = new Map<
      number,
      { prediction: string; confidence: number; best_pick: string | null }
    >();
    ((tipsRes as { data: { fixture_id: number; prediction: string; confidence: number; best_pick: string | null }[] | null }).data || []).forEach((t) =>
      tipMap.set(t.fixture_id, t)
    );

    const resultMap = new Map<number, boolean>();
    ((resultsRes as { data: { fixture_id: number; is_correct: boolean }[] | null }).data || []).forEach((r) =>
      resultMap.set(r.fixture_id, r.is_correct)
    );

    // Return ALL fixtures that have predictions (tips)
    const predicted = (fixtures as Fixture[])
      .filter((f) => tipMap.has(f.id))
      .map((f) => {
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
