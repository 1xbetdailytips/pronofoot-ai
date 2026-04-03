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

    // Only show fixtures that have AI predictions
    const { data: tips } = await supabase
      .from("tips")
      .select("fixture_id");
    const predictedIds = new Set((tips || []).map((t: { fixture_id: number }) => t.fixture_id));

    const { data, error } = await supabase
      .from("fixtures")
      .select("*")
      .gte("match_date", `${date}T00:00:00`)
      .lte("match_date", `${date}T23:59:59`)
      .order("match_date", { ascending: true });

    if (error) {
      console.error("Livescore API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch fixtures" },
        { status: 500 }
      );
    }

    const predicted = ((data as Fixture[]) || []).filter(f => predictedIds.has(f.id));

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
