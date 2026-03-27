import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/tickets — Get today's tickets
export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("date", today)
    .order("is_free", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tickets: data });
}

// POST /api/tickets — Create a new ticket (admin only)
export async function POST(request: NextRequest) {
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, nameFr, bookingCode, totalOdds, riskLevel, isFree, matchCount } = body;

  if (!name || !bookingCode || !totalOdds || !riskLevel) {
    return NextResponse.json(
      { error: "Missing required fields: name, bookingCode, totalOdds, riskLevel" },
      { status: 400 }
    );
  }

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase.from("tickets").insert({
    date: today,
    name,
    name_fr: nameFr || name,
    booking_code: bookingCode,
    total_odds: parseFloat(totalOdds),
    risk_level: riskLevel,
    is_free: isFree || false,
    match_count: matchCount || null,
    status: "pending",
  }).select().single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ticket: data }, { status: 201 });
}
