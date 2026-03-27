import { supabase } from "./supabase";
import type { Fixture, Tip, MatchWithTip, DbTicket } from "./types";

// Map API-Football prediction code to our internal format
export function mapPrediction(p: string): string {
  if (p === "1") return "home_win";
  if (p === "2") return "away_win";
  return "draw";
}

// Map backend risk level (French) to internal keys
export function mapRiskLevel(r: string): string {
  if (r === "FAIBLE") return "safe";
  if (r === "ÉLEVÉ" || r === "ELEVE") return "high";
  if (r === "MOYEN") return "medium";
  return r.toLowerCase();
}

// Generate a slug from fixture data — embed the fixture ID at the end for lookup
export function fixtureToSlug(fixture: Fixture): string {
  const home = fixture.home_team
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const away = fixture.away_team
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${home}-vs-${away}-${fixture.id}`;
}

// Extract fixture ID from slug (last segment after final dash)
export function slugToFixtureId(slug: string): number | null {
  const parts = slug.split("-");
  const last = parts[parts.length - 1];
  const id = parseInt(last, 10);
  return isNaN(id) ? null : id;
}

// Fetch today's fixtures joined with their tips
export async function getTodaysMatches(): Promise<MatchWithTip[]> {
  const today = new Date().toISOString().split("T")[0];

  const { data: fixtures, error: fError } = await supabase
    .from("fixtures")
    .select("*")
    .gte("match_date", today + "T00:00:00")
    .lte("match_date", today + "T23:59:59")
    .order("match_date", { ascending: true });

  if (fError || !fixtures) return [];

  const fixtureIds = fixtures.map((f: Fixture) => f.id);
  const { data: tips } = await supabase
    .from("tips")
    .select("*")
    .in("fixture_id", fixtureIds);

  const tipMap = new Map<number, Tip>();
  (tips || []).forEach((t: Tip) => tipMap.set(t.fixture_id, t));

  return fixtures.map((f: Fixture) => ({
    ...f,
    tip: tipMap.get(f.id) ?? null,
    slug: fixtureToSlug(f),
  }));
}

// Fetch a single fixture + tip by slug
export async function getMatchBySlug(slug: string): Promise<MatchWithTip | null> {
  const id = slugToFixtureId(slug);
  if (!id) return null;

  const { data: fixture, error } = await supabase
    .from("fixtures")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !fixture) return null;

  const { data: tip } = await supabase
    .from("tips")
    .select("*")
    .eq("fixture_id", id)
    .single();

  return {
    ...fixture,
    tip: tip ?? null,
    slug,
  };
}

// Fetch today's tickets from Supabase
export async function getTodaysTickets(): Promise<DbTicket[]> {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("date", today)
    .order("is_free", { ascending: false }); // free ticket first

  if (error || !data) return [];
  return data as DbTicket[];
}

// Build a MatchCard-compatible props object from a MatchWithTip
export function matchToCardProps(m: MatchWithTip) {
  const kickoff = new Date(m.match_date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Douala",
  });

  const prediction = m.tip ? mapPrediction(m.tip.prediction) : "draw";
  const confidence = m.tip ? Math.round(m.tip.confidence) : 50;
  const riskLevel = m.tip ? mapRiskLevel(m.tip.risk_level) : "medium";

  // Estimate 1X2 odds from probabilities (min 1.05)
  const homeOdds = m.tip ? Math.max(1.05, parseFloat((100 / m.tip.home_prob).toFixed(2))) : 2.0;
  const drawOdds = m.tip ? Math.max(1.05, parseFloat((100 / m.tip.draw_prob).toFixed(2))) : 3.4;
  const awayOdds = m.tip ? Math.max(1.05, parseFloat((100 / m.tip.away_prob).toFixed(2))) : 3.2;

  return {
    homeTeam: m.home_team,
    awayTeam: m.away_team,
    league: m.league_name,
    kickoffTime: kickoff,
    prediction,
    confidence,
    riskLevel,
    homeOdds,
    drawOdds,
    awayOdds,
    slug: m.slug,
  };
}
