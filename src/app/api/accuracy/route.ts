import { NextResponse } from "next/server";
import { getWinRateStats } from "@/lib/data";

// Cache for 5 minutes — accuracy doesn't change rapidly
export const revalidate = 300;

export async function GET() {
  try {
    const stats = await getWinRateStats();
    return NextResponse.json({
      overall: stats.overall.rate,
      "1x2": stats.overall.rate,
      over25: stats.over25.rate,
      over15: stats.over15.rate,
      btts: stats.btts.rate,
      homeToScore: stats.homeToScore.rate,
      awayToScore: stats.awayToScore.rate,
      bestPick: stats.bestPick.rate,
      totalResolved: stats.overall.total,
    });
  } catch (err) {
    console.error("Accuracy API error:", err);
    return NextResponse.json({ error: "Failed to fetch accuracy" }, { status: 500 });
  }
}
