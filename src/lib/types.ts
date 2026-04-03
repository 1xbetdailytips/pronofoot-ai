export type H2HMatch = {
  date: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
};

export type H2HData = {
  homeWins: number;
  draws: number;
  awayWins: number;
  total: number;
  recent: H2HMatch[];
};

export type MatchEvent = {
  time: string;
  team: string;
  teamId: number;
  player: string;
  assist: string | null;
  type: string;    // "Goal", "Card", "subst", "Var"
  detail: string;  // "Normal Goal", "Yellow Card", "Red Card", "Substitution 1", etc.
};

export type Fixture = {
  id: number;
  league_id: number;
  league_name: string;
  league_country: string | null;
  home_team: string;
  away_team: string;
  home_team_id: number | null;
  away_team_id: number | null;
  home_team_logo: string | null;
  away_team_logo: string | null;
  league_logo: string | null;
  match_date: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  elapsed: number | null;
  home_form: string[] | null;
  away_form: string[] | null;
  h2h_data: H2HData | null;
  match_events: MatchEvent[] | null;
};

export type StandingRow = {
  rank: number;
  teamId: number;
  team: string;
  logo: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  form: string;
};

export type Tip = {
  id: number;
  fixture_id: number;
  prediction: "1" | "X" | "2" | "1X" | "X2" | "12";
  odds: number;
  confidence: number;
  risk_level: string;
  home_prob: number;
  draw_prob: number;
  away_prob: number;
  over25_prob: number | null;
  over15_prob: number | null;
  btts_prob: number | null;
  over05_home_prob: number | null;
  over05_away_prob: number | null;
  best_pick: string | null;
  ai_analysis: string | null;
  is_vip: boolean;
  fixtures?: Fixture;
};

export type MatchWithTip = Fixture & {
  tip: Tip | null;
  slug: string;
};

// ── Win Rate Stats ────────────────────────────────────────────────────────────

export type WinRateStat = {
  wins: number;
  total: number;
  rate: number; // 0–100
};

export type RecentResult = {
  id: number;
  tip_id: number;
  fixture_id: number;
  prediction: string;
  actual_result: string;
  is_correct: boolean;
  home_score: number;
  away_score: number;
  over25_correct: boolean | null;
  over15_correct: boolean | null;
  btts_correct: boolean | null;
  home_to_score_correct: boolean | null;
  away_to_score_correct: boolean | null;
  best_pick: string | null;
  best_pick_correct: boolean | null;
  confidence: number | null;
  risk_level: string | null;
  match_date: string | null;
  logged_at: string | null;
  // joined
  fixtures?: { home_team: string; away_team: string; league_name: string } | null;
};

export type WinRateStats = {
  overall: WinRateStat;
  last7days: WinRateStat;
  last30days: WinRateStat;
  over25: WinRateStat;
  over15: WinRateStat;
  btts: WinRateStat;
  homeToScore: WinRateStat;
  awayToScore: WinRateStat;
  bestPick: WinRateStat;
  highConfidence: WinRateStat;
  medConfidence: WinRateStat;
  lowConfidence: WinRateStat;
  faible: WinRateStat;
  moyen: WinRateStat;
  eleve: WinRateStat;
  streak: { count: number; type: 'win' | 'loss' | null };
  recentResults: RecentResult[];
  pending: number;
};

export type DbTicket = {
  id: string;
  date: string;
  name: string;
  name_fr: string | null;
  booking_code: string;
  total_odds: number;
  risk_level: string;
  is_free: boolean;
  match_count: number | null;
  status: string;
  created_at: string;
};
