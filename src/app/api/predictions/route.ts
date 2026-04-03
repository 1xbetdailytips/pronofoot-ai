import { NextResponse } from "next/server";
import { getTodaysMatches } from "@/lib/data";
import { matchToCardProps } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const date = dateParam && dateRegex.test(dateParam) ? dateParam : undefined;

    const matches = await getTodaysMatches(date);

    return NextResponse.json({
      matches: matches.map((m) => ({
        ...m,
        cardProps: matchToCardProps(m),
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Predictions API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
