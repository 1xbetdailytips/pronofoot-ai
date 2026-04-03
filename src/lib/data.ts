import { supabase } from "./supabase";
import type { Fixture, Tip, MatchWithTip, DbTicket, WinRateStats, WinRateStat, RecentResult } from "./types";

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

// ── Win Rate Stats ─────────────────────────────────────────────────────────

function calcRate(items: RecentResult[], field: keyof RecentResult = "is_correct"): WinRateStat {
  const valid = items.filter(r => r[field] !== null && r[field] !== undefined);
  if (!valid.length) return { wins: 0, total: 0, rate: 0 };
  const wins = valid.filter(r => r[field] === true).length;
  return { wins, total: valid.length, rate: Math.round((wins / valid.length) * 100) };
}

export async function getWinRateStats(): Promise<WinRateStats> {
  // Fetch all resolved results with fixture join
  const { data: results } = await supabase
    .from("results_log")
    .select(`
      id, tip_id, fixture_id, prediction, actual_result, is_correct,
      home_score, away_score,
      over25_correct, over15_correct, btts_correct,
      home_to_score_correct, away_to_score_correct,
      best_pick, best_pick_correct,
      confidence, risk_level, match_date, logged_at,
      fixtures(home_team, away_team, league_name)
    `)
    .order("logged_at", { ascending: false });

  // Supabase FK joins return related row(s) as array — flatten to single object
  const all: RecentResult[] = (results || []).map((r: Record<string, unknown>) => ({
    ...r,
    fixtures: Array.isArray(r.fixtures) ? r.fixtures[0] ?? null : r.fixtures ?? null,
  })) as RecentResult[];

  // Count pending tips (no result yet)
  const { count: pendingCount } = await supabase
    .from("tips")
    .select("id", { count: "exact", head: true })
    .is("result", null);

  // Time windows
  const now = Date.now();
  const last7  = all.filter(r => r.logged_at && (now - new Date(r.logged_at).getTime()) < 7  * 86400000);
  const last30 = all.filter(r => r.logged_at && (now - new Date(r.logged_at).getTime()) < 30 * 86400000);

  // Confidence tiers
  const highConf = all.filter(r => r.confidence !== null && r.confidence! >= 70);
  const medConf  = all.filter(r => r.confidence !== null && r.confidence! >= 50 && r.confidence! < 70);
  const lowConf  = all.filter(r => r.confidence !== null && r.confidence! < 50);

  // Risk levels
  const faible = all.filter(r => r.risk_level === "FAIBLE");
  const moyen  = all.filter(r => r.risk_level === "MOYEN");
  const eleve  = all.filter(r => r.risk_level === "ÉLEVÉ" || r.risk_level === "ELEVE");

  // Current streak
  let streakCount = 0;
  let streakType: boolean | null = null;
  for (const r of all) {
    if (r.is_correct === null || r.is_correct === undefined) continue;
    if (streakType === null) streakType = r.is_correct;
    if (r.is_correct === streakType) streakCount++;
    else break;
  }

  return {
    overall:        calcRate(all),
    last7days:      calcRate(last7),
    last30days:     calcRate(last30),
    over25:         calcRate(all, "over25_correct"),
    over15:         calcRate(all, "over15_correct"),
    btts:           calcRate(all, "btts_correct"),
    homeToScore:    calcRate(all, "home_to_score_correct"),
    awayToScore:    calcRate(all, "away_to_score_correct"),
    bestPick:       calcRate(all, "best_pick_correct"),
    highConfidence: calcRate(highConf),
    medConfidence:  calcRate(medConf),
    lowConfidence:  calcRate(lowConf),
    faible:         calcRate(faible),
    moyen:          calcRate(moyen),
    eleve:          calcRate(eleve),
    streak:         { count: streakCount, type: streakType === true ? "win" : streakType === false ? "loss" : null },
    recentResults:  all.slice(0, 20),
    pending:        pendingCount ?? 0,
  };
}

// Build a MatchCard-compatible props object from a MatchWithTip
export function matchToCardProps(m: MatchWithTip) {
  const kickoff = new Date(m.match_date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Douala",
  });

  const hasTip = !!m.tip;
  const prediction = m.tip ? mapPrediction(m.tip.prediction) : null;
  const confidence = m.tip ? Math.round(m.tip.confidence) : null;
  const riskLevel = m.tip ? mapRiskLevel(m.tip.risk_level) : null;
  const bestPick = m.tip?.best_pick ?? null;

  // Estimate 1X2 odds from probabilities (min 1.05)
  const homeOdds = m.tip ? Math.max(1.05, parseFloat((100 / m.tip.home_prob).toFixed(2))) : null;
  const drawOdds = m.tip ? Math.max(1.05, parseFloat((100 / m.tip.draw_prob).toFixed(2))) : null;
  const awayOdds = m.tip ? Math.max(1.05, parseFloat((100 / m.tip.away_prob).toFixed(2))) : null;

  return {
    homeTeam: m.home_team,
    awayTeam: m.away_team,
    league: m.league_name,
    leagueId: m.league_id,
    kickoffTime: kickoff,
    status: m.status,
    homeScore: m.home_score,
    awayScore: m.away_score,
    hasTip,
    prediction,
    confidence,
    riskLevel,
    bestPick,
    homeOdds,
    drawOdds,
    awayOdds,
    slug: m.slug,
  };
}

// Group matches by league for Forebet-style display
export function groupMatchesByLeague(matches: MatchWithTip[]) {
  const groups: Record<string, { leagueName: string; leagueId: number; matches: MatchWithTip[] }> = {};
  for (const m of matches) {
    const key = m.league_name;
    if (!groups[key]) {
      groups[key] = { leagueName: m.league_name, leagueId: m.league_id, matches: [] };
    }
    groups[key].matches.push(m);
  }
  // Sort: leagues with more matches first, then alphabetical
  return Object.values(groups).sort((a, b) => b.matches.length - a.matches.length || a.leagueName.localeCompare(b.leagueName));
}
