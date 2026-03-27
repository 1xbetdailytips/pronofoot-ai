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

export type Fixture = {
  id: number;
  league_id: number;
  league_name: string;
  home_team: string;
  away_team: string;
  home_team_id: number | null;
  away_team_id: number | null;
  match_date: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  home_form: string[] | null;
  away_form: string[] | null;
  h2h_data: H2HData | null;
};

export type Tip = {
  id: number;
  fixture_id: number;
  prediction: "1" | "X" | "2";
  odds: number;
  confidence: number;
  risk_level: string;
  home_prob: number;
  draw_prob: number;
  away_prob: number;
  over25_prob: number | null;
  btts_prob: number | null;
  best_pick: string | null;
  ai_analysis: string | null;
  is_vip: boolean;
  fixtures?: Fixture;
};

export type MatchWithTip = Fixture & {
  tip: Tip | null;
  slug: string;
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
