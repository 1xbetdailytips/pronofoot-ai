import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Fixture } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const { data, error } = await supabase
      .from("fixtures")
      .select("*")
      .gte("match_date", `${today}T00:00:00`)
      .lte("match_date", `${today}T23:59:59`)
      .order("match_date", { ascending: true });

    if (error) {
      console.error("Livescore API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch fixtures" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      fixtures: (data as Fixture[]) || [],
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
