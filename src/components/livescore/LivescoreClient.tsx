"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { RefreshCw, Clock, Activity, ChevronDown, ChevronRight, ChevronLeft, CalendarDays } from "lucide-react";
import Image from "next/image";
import LeagueFilterBar from "@/components/filters/LeagueFilterBar";
import GlobalMatchSearch from "@/components/livescore/GlobalMatchSearch";
import { isPopularLeague, getCountryForLeague, isBettableOn1xBet } from "@/lib/league-country-map";
import { siteConfig } from "@/lib/config";
import type { Fixture, LiveFixture } from "@/lib/types";

const LIVE_STATUSES = ["1H", "2H", "HT", "ET", "BT", "P"];
const FINISHED_STATUSES = ["FT", "AET", "PEN"];
const POLL_INTERVAL_DEFAULT = 60_000;
const POLL_INTERVAL_LIVE = 30_000; // faster refresh when live matches exist

type Props = {
  initialFixtures: Fixture[];
  locale: string;
};

function categorize(fixtures: Fixture[]) {
  const live: Fixture[] = [];
  const upcoming: Fixture[] = [];
  const finished: Fixture[] = [];
  for (const f of fixtures) {
    if (LIVE_STATUSES.includes(f.status)) live.push(f);
    else if (FINISHED_STATUSES.includes(f.status)) finished.push(f);
    else upcoming.push(f);
  }
  return { live, upcoming, finished };
}

// Top league IDs for priority sorting
const TOP_LEAGUE_IDS = new Set([
  2, 3, 848, 5, 531, 4, // UCL, UEL, UECL, Nations League, Super Cup, Euro
  39, 40, 41, 42, 45, 48, // England: PL, Championship, League One, League Two, FA Cup, EFL Cup
  140, 141, 143, // Spain: La Liga, Segunda, Copa del Rey
  135, 136, 137, 138, 942, 943, // Italy: Serie A, Serie B, Serie C groups, Coppa Italia
  78, 79, 80, 81, // Germany: Bundesliga, 2.Bundesliga, 3.Liga, DFB Pokal
  61, 62, 66, // France: Ligue 1, Ligue 2, Coupe de France
  94, 88, 144, 179, 203, // Portugal, Netherlands, Belgium, Scotland, Turkey
  406, 407, // Cameroon
  6, 12, 20, // AFCON, CAF CL, CAF CC
  233, 200, 332, 288, 570, 202, 276, 386, 186, 567, // Africa: Egypt, Morocco, Nigeria, SA, Ghana, Tunisia, Kenya, Ivory Coast, Algeria, Tanzania
  1, 15, 29, 30, 31, 32, 33, 34, // World Cup, Club WC, WC Qualifiers (all zones)
  253, 307, 13, 292, // MLS, Saudi, Copa Libertadores, K-League
]);

// ── 1xBet-style Country → League grouping ───────────────────────────────────

type LeagueBlock = {
  leagueName: string;
  fixtures: Fixture[];
};

type CountryBlock = {
  country: string;
  flag: string;
  tier: number;
  leagues: LeagueBlock[];
  totalMatches: number;
  hasLive: boolean;
};

function groupByCountry(fixtures: Fixture[]): CountryBlock[] {
  const map = new Map<string, { flag: string; tier: number; leagues: Map<string, Fixture[]> }>();

  for (const f of fixtures) {
    const info = getCountryForLeague(f.league_name, f.league_id, f.league_country);
    if (!map.has(info.country)) {
      map.set(info.country, { flag: info.flag, tier: info.tier, leagues: new Map() });
    }
    const c = map.get(info.country)!;
    if (!c.leagues.has(f.league_name)) c.leagues.set(f.league_name, []);
    c.leagues.get(f.league_name)!.push(f);
    if (info.tier < c.tier) c.tier = info.tier;
  }

  return Array.from(map.entries())
    .map(([country, data]) => {
      const leagues = Array.from(data.leagues.entries())
        .map(([leagueName, fixtures]) => ({ leagueName, fixtures }))
        .sort((a, b) => b.fixtures.length - a.fixtures.length);
      const totalMatches = leagues.reduce((s, l) => s + l.fixtures.length, 0);
      const hasLive = leagues.some(l => l.fixtures.some(f => LIVE_STATUSES.includes(f.status)));
      return { country, flag: data.flag, tier: data.tier, leagues, totalMatches, hasLive };
    })
    .sort((a, b) => {
      // Live first, then by tier, then by match count
      if (a.hasLive !== b.hasLive) return a.hasLive ? -1 : 1;
      if (a.tier !== b.tier) return a.tier - b.tier;
      return b.totalMatches - a.totalMatches;
    });
}

// ── Sub-components ──────────────────────────────────────────────────────────

function formatTime(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch { return "--:--"; }
}

function LiveMinuteTicker({ status, elapsed, matchDate }: { status: string; elapsed?: number | null; matchDate?: string }) {
  const [tick, setTick] = useState(0);
  const [lastElapsed, setLastElapsed] = useState(elapsed);

  // Reset tick counter whenever elapsed changes from server (new poll arrived)
  useEffect(() => {
    if (elapsed != null && elapsed !== lastElapsed) {
      setTick(0);
      setLastElapsed(elapsed);
    }
  }, [elapsed, lastElapsed]);

  useEffect(() => {
    if (status === "HT" || !LIVE_STATUSES.includes(status)) return;
    const interval = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(interval);
  }, [status]);

  if (status === "HT") return "HT";

  // If elapsed is available from DB, use it as anchor + client ticks since last poll
  if (elapsed != null && elapsed > 0) {
    const displayMinute = elapsed + tick;
    // Stoppage time display: "45+X'" or "90+X'"
    if (status === "1H" && displayMinute > 45) {
      return `45+${displayMinute - 45}'`;
    }
    if (status === "2H" && displayMinute > 90) {
      return `90+${displayMinute - 90}'`;
    }
    if (["ET", "BT"].includes(status) && displayMinute > 120) {
      return `120+${displayMinute - 120}'`;
    }
    return `${displayMinute}'`;
  }

  // Fallback: estimate minute from match start time if elapsed not available
  if (matchDate) {
    const kickoff = new Date(matchDate).getTime();
    const now = Date.now();
    const elapsedMs = now - kickoff;
    if (elapsedMs > 0) {
      let estimatedMin = Math.floor(elapsedMs / 60000);
      // 2H starts at ~45 min + 15 min break
      if (status === "2H") estimatedMin = Math.max(46, estimatedMin - 15);
      // Stoppage time display for fallback too
      if (status === "1H" && estimatedMin > 45) return `45+${estimatedMin - 45}'`;
      if (status === "2H" && estimatedMin > 90) return `90+${estimatedMin - 90}'`;
      const maxMinute = ["ET", "BT"].includes(status) ? 120 : status === "2H" ? 90 : 45;
      return `${Math.min(estimatedMin, maxMinute)}'`;
    }
  }

  return status;
}

function StatusBadge({ status, elapsed, matchDate }: { status: string; elapsed?: number | null; matchDate?: string }) {
  if (LIVE_STATUSES.includes(status)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/10 text-red-600 border border-red-500/20">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <LiveMinuteTicker status={status} elapsed={elapsed} matchDate={matchDate} />
      </span>
    );
  }
  if (FINISHED_STATUSES.includes(status)) {
    return <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">{status}</span>;
  }
  return <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">{status || "NS"}</span>;
}

function ScoreDisplay({ fixture }: { fixture: Fixture }) {
  const isLive = LIVE_STATUSES.includes(fixture.status);
  const isFinished = FINISHED_STATUSES.includes(fixture.status);
  if (isLive || isFinished) {
    return (
      <div className={`flex items-center gap-2 font-extrabold text-xl tabular-nums ${isLive ? "text-red-600" : "text-gray-900 dark:text-white"}`}>
        <span className="w-7 text-right">{fixture.home_score ?? 0}</span>
        <span className="text-gray-300 dark:text-gray-600 text-sm">-</span>
        <span className="w-7 text-left">{fixture.away_score ?? 0}</span>
      </div>
    );
  }
  return <span className="text-sm font-medium text-gray-300 dark:text-gray-600">vs</span>;
}

function TeamLogo({ src, alt }: { src: string | null; alt: string }) {
  if (!src) return <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />;
  return (
    <Image
      src={src}
      alt={alt}
      width={24}
      height={24}
      className="w-6 h-6 object-contain shrink-0"
      unoptimized
    />
  );
}

function EventIcons({ events, teamId }: { events: Fixture["match_events"]; teamId: number | null }) {
  if (!events || !teamId) return null;
  const teamEvents = events.filter(e => e.teamId === teamId);
  const goals = teamEvents.filter(e => e.type === "Goal");
  const reds = teamEvents.filter(e => e.type === "Card" && e.detail?.includes("Red"));
  const yellows = teamEvents.filter(e => e.type === "Card" && e.detail === "Yellow Card");
  if (goals.length === 0 && reds.length === 0 && yellows.length === 0) return null;
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {goals.map((g, i) => (
        <span key={`g${i}`} className="text-[10px] text-gray-500 dark:text-gray-400">
          <span className="text-gray-800 dark:text-gray-200 font-medium">{g.player?.split(" ").pop()}</span>
          <span className="text-gray-400 dark:text-gray-500 ml-0.5">{g.time}&apos;</span>
        </span>
      ))}
      {reds.map((_, i) => (
        <span key={`r${i}`} className="inline-block w-2.5 h-3.5 bg-red-600 rounded-[1px]" title="Red card" />
      ))}
      {yellows.map((_, i) => (
        <span key={`y${i}`} className="inline-block w-2.5 h-3.5 bg-yellow-400 rounded-[1px]" title="Yellow card" />
      ))}
    </div>
  );
}

// ── Instant WIN/LOST calculation (client-side, no waiting for 23:00 cron) ──
function computeResultInstantly(prediction: string, homeScore: number | null, awayScore: number | null): boolean | null {
  if (homeScore === null || awayScore === null) return null;
  const h = homeScore;
  const a = awayScore;
  const actualResult = h > a ? "1" : h < a ? "2" : "X";
  const pred = prediction.toUpperCase();
  if (pred === "1X") return actualResult === "1" || actualResult === "X";
  if (pred === "X2") return actualResult === "X" || actualResult === "2";
  if (pred === "12") return actualResult === "1" || actualResult === "2";
  return actualResult === pred;
}

function MatchRow({ fixture }: { fixture: Fixture }) {
  const isLive = LIVE_STATUSES.includes(fixture.status);
  const isFinished = FINISHED_STATUSES.includes(fixture.status);
  const hasEvents = fixture.match_events && fixture.match_events.length > 0;
  const lf = fixture as LiveFixture;

  // Instant WIN/LOST: if match is finished and has a prediction, calculate NOW
  let resultStatus: boolean | null = lf.result_correct ?? null;
  if (resultStatus === null && isFinished && lf.tip_prediction) {
    resultStatus = computeResultInstantly(lf.tip_prediction, fixture.home_score, fixture.away_score);
  }

  return (
    <div className={`border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors ${
      isLive ? "bg-red-50/50 dark:bg-red-950/20" : "hover:bg-gray-50/80 dark:hover:bg-gray-800/30"
    }`}>
      {/* Main match row */}
      <div className="grid grid-cols-[48px_1fr_72px_1fr_auto] md:grid-cols-[60px_1fr_90px_1fr_auto] items-center gap-2 md:gap-3 px-3 md:px-4 py-3">
        {/* Time */}
        <div className="text-xs text-gray-400 dark:text-gray-500 font-mono tabular-nums">
          {formatTime(fixture.match_date)}
        </div>
        {/* Home team */}
        <div className="flex items-center justify-end gap-2 min-w-0">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{fixture.home_team}</span>
          <TeamLogo src={fixture.home_team_logo} alt={fixture.home_team} />
        </div>
        {/* Score */}
        <div className="flex justify-center"><ScoreDisplay fixture={fixture} /></div>
        {/* Away team */}
        <div className="flex items-center gap-2 min-w-0">
          <TeamLogo src={fixture.away_team_logo} alt={fixture.away_team} />
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{fixture.away_team}</span>
        </div>
        {/* Status badge */}
        <div className="flex justify-end">
          <StatusBadge status={fixture.status} elapsed={fixture.elapsed} matchDate={fixture.match_date} />
        </div>
      </div>

      {/* Prediction + Instant Result row */}
      {lf.tip_prediction && (
        <div className="flex items-center gap-2.5 px-3 md:px-4 pb-2.5 -mt-0.5">
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            {lf.tip_prediction}
          </span>
          <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">{lf.tip_confidence}%</span>
          {lf.tip_best_pick && (
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{lf.tip_best_pick}</span>
          )}
          {resultStatus === true && (
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md ml-auto">WIN ✓</span>
          )}
          {resultStatus === false && (
            <span className="text-[11px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-md ml-auto">LOST ✗</span>
          )}
          {isLive && lf.tip_prediction && resultStatus === null && (
            <span className="text-[11px] font-medium text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-md ml-auto animate-pulse">LIVE</span>
          )}
          {isBettableOn1xBet(fixture.league_id) && !isLive && resultStatus === null && (
            <a
              href={`${siteConfig.affiliateLink}?utm_campaign=livescore_match`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold text-white bg-[#1a5276] hover:bg-[#1a3a5c] px-2.5 py-0.5 rounded-md ml-auto transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              1xBet
            </a>
          )}
        </div>
      )}
      {/* Goal scorers + cards row */}
      {hasEvents && (isLive || isFinished) && (
        <div className="grid grid-cols-[48px_1fr_72px_1fr_auto] md:grid-cols-[60px_1fr_90px_1fr_auto] gap-2 md:gap-3 px-3 md:px-4 pb-2.5 -mt-1">
          <div />
          <div className="flex justify-end"><EventIcons events={fixture.match_events} teamId={fixture.home_team_id} /></div>
          <div />
          <div><EventIcons events={fixture.match_events} teamId={fixture.away_team_id} /></div>
          <div />
        </div>
      )}
    </div>
  );
}

// ── FlashScore-style collapsible country section ────────────────────────────

function CountrySection({ block, defaultOpen }: { block: CountryBlock; defaultOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-xl overflow-hidden mb-2.5 border border-gray-200/80 dark:border-gray-700/60 shadow-sm">
      {/* Country header — clickable to expand/collapse */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2.5 px-4 py-2.5 transition-all duration-200 ${
          isOpen
            ? "bg-gradient-to-r from-gray-800 to-gray-700 dark:from-gray-700 dark:to-gray-600 text-white"
            : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`} />
        <span className="text-base leading-none">{block.flag}</span>
        <span className="text-sm font-bold">{block.country}</span>
        {block.hasLive && (
          <span className="relative flex h-2.5 w-2.5 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
        )}
        <span className={`text-xs font-medium ml-auto tabular-nums ${isOpen ? "text-gray-400" : "text-gray-400 dark:text-gray-500"}`}>
          {block.totalMatches}
        </span>
      </button>

      {/* Leagues within the country */}
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {block.leagues.map((league) => (
            <LeagueSection key={league.leagueName} league={league} countryFlag={block.flag} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LeagueSection({ league }: { league: LeagueBlock; countryFlag?: string }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasLive = league.fixtures.some(f => LIVE_STATUSES.includes(f.status));

  return (
    <div>
      {/* League sub-header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50/80 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-150 border-b border-gray-100 dark:border-gray-800"
      >
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${isOpen ? "" : "-rotate-90"}`} />
        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {league.leagueName}
        </span>
        {hasLive && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">
            LIVE
          </span>
        )}
        <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto tabular-nums">{league.fixtures.length}</span>
      </button>

      {/* Matches */}
      <div
        className={`transition-all duration-150 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white dark:bg-gray-900">
          {league.fixtures.map((f) => <MatchRow key={f.id} fixture={f} />)}
        </div>
      </div>
    </div>
  );
}

// ── Main LivescoreClient ────────────────────────────────────────────────────

// ── Date helpers ────────────────────────────────────────────────────────────

function formatDateParam(d: Date) {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number) {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

function isToday(d: Date) {
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

// ── Main LivescoreClient ────────────────────────────────────────────────────

export default function LivescoreClient({ initialFixtures, locale }: Props) {
  const [fixtures, setFixtures] = useState(initialFixtures);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterMode, setFilterMode] = useState<"popular" | "all" | "custom">("all");
  const [selectedLeagueNames, setSelectedLeagueNames] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const isFr = locale === "fr";

  // Filter fixtures based on mode — always include top leagues + league_id check
  const activeFixtures = useMemo(() => {
    if (filterMode === "all") return fixtures;

    if (filterMode === "popular") {
      return fixtures.filter((f) =>
        isPopularLeague(f.league_name, f.league_id) || TOP_LEAGUE_IDS.has(f.league_id)
      );
    }

    if (filterMode === "custom" && selectedLeagueNames.size > 0) {
      return fixtures.filter((f) => selectedLeagueNames.has(f.league_name));
    }

    return fixtures;
  }, [fixtures, filterMode, selectedLeagueNames]);

  // Always show live matches regardless of filter
  const allLive = useMemo(
    () => fixtures.filter((f) => LIVE_STATUSES.includes(f.status)),
    [fixtures]
  );

  // Group by country for the accordion
  const { upcoming, finished } = useMemo(() => categorize(activeFixtures), [activeFixtures]);
  const liveCountryGroups = useMemo(() => groupByCountry(allLive), [allLive]);
  const finishedCountryGroups = useMemo(() => groupByCountry(finished), [finished]);
  const upcomingCountryGroups = useMemo(() => groupByCountry(upcoming), [upcoming]);

  const handleFilterChange = useCallback(
    (filtered: Array<{ league_name: string }>, mode: "popular" | "all" | "custom") => {
      const leagueNames = new Set(filtered.map((f) => f.league_name));
      setSelectedLeagueNames(leagueNames);
      setFilterMode(mode);
    },
    []
  );

  // Date navigation
  const navigateDate = useCallback(async (date: Date) => {
    setSelectedDate(date);
    setIsRefreshing(true);
    try {
      const dateStr = formatDateParam(date);
      const res = await fetch(`/api/livescore?date=${dateStr}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setFixtures(data.fixtures || []);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("Date navigation error:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const dateStr = formatDateParam(selectedDate);
      const res = await fetch(`/api/livescore?date=${dateStr}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setFixtures(data.fixtures || []);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error("Livescore refresh error:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedDate]);

  // Adaptive polling: 30s when live matches, 60s otherwise. Only auto-refresh today.
  useEffect(() => {
    if (!isToday(selectedDate)) return; // don't auto-refresh past/future dates
    const interval = setInterval(refresh, allLive.length > 0 ? POLL_INTERVAL_LIVE : POLL_INTERVAL_DEFAULT);
    return () => clearInterval(interval);
  }, [refresh, allLive.length, selectedDate]);

  // Date navigation bar (shared between empty and content views)
  const dateNav = (
    <div className="flex items-center justify-center gap-1 mb-5">
      <button
        onClick={() => navigateDate(addDays(selectedDate, -1))}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        aria-label="Previous day"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
        {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
          const d = addDays(new Date(), offset);
          const isSelected = d.toDateString() === selectedDate.toDateString();
          const dayIsToday = offset === 0;
          return (
            <button
              key={offset}
              onClick={() => navigateDate(d)}
              className={`flex flex-col items-center px-3 py-2 rounded-xl text-xs font-medium transition-all min-w-[56px] ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                  : dayIsToday
                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span className="text-[10px] uppercase">
                {d.toLocaleDateString(isFr ? "fr-FR" : "en-GB", { weekday: "short" })}
              </span>
              <span className="text-sm font-bold tabular-nums">{d.getDate()}</span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => navigateDate(addDays(selectedDate, 1))}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
        aria-label="Next day"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Today quick button */}
      {!isToday(selectedDate) && (
        <button
          onClick={() => navigateDate(new Date())}
          className="ml-1 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-colors"
        >
          <CalendarDays className="w-3.5 h-3.5 inline mr-1" />
          {isFr ? "Auj." : "Today"}
        </button>
      )}
    </div>
  );

  // Auto-retry when no fixtures (today's cron may not have run yet)
  useEffect(() => {
    if (fixtures.length === 0 && isToday(selectedDate)) {
      const retryInterval = setInterval(async () => {
        try {
          const res = await fetch(`/api/livescore?date=${formatDateParam(selectedDate)}`, { cache: "no-store" });
          if (res.ok) {
            const data = await res.json();
            if (data.fixtures && data.fixtures.length > 0) {
              setFixtures(data.fixtures);
              setLastUpdate(new Date());
            }
          }
        } catch {}
      }, 60_000); // retry every 60 seconds
      return () => clearInterval(retryInterval);
    }
  }, [fixtures.length, selectedDate]);

  if (fixtures.length === 0) {
    const isPastDate = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));
    return (
      <div>
        {dateNav}
        {isToday(selectedDate) ? (
          // Today but cron hasn't run — show premium preparing state
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-5 relative">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-7 h-7 text-emerald-500" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-200 mb-2">
              {isFr ? "Préparation des matchs du jour..." : "Preparing today's matches..."}
            </h3>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-4">
              {isFr
                ? "Notre IA analyse les matchs et génère les pronostics. Les prédictions seront disponibles sous peu."
                : "Our AI is analyzing today's matches and generating predictions. They'll be available shortly."}
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isFr ? "Analyse en cours" : "Analysis in progress"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{isFr ? "Mise à jour auto chaque minute" : "Auto-refreshing every minute"}</span>
              </div>
            </div>
          </div>
        ) : isPastDate ? (
          <div className="text-center py-16">
            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">
              {isFr ? "Aucune donnée pour cette date" : "No data for this date"}
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <CalendarDays className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">
              {isFr ? "Les matchs seront disponibles bientôt" : "Matches will be available soon"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isFr ? "Les pronostics sont générés chaque matin." : "Predictions are generated every morning."}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* ── Date navigation ── */}
      {dateNav}

      {/* ── Sticky filter bar ── */}
      <LeagueFilterBar
        fixtures={fixtures}
        locale={locale}
        onFilteredFixtures={handleFilterChange}
      />

      {/* ── Global search (across all dates) ── */}
      <GlobalMatchSearch locale={locale} />

      {/* ── Refresh bar ── */}
      <div className="flex items-center justify-between mb-5 text-xs text-gray-400 dark:text-gray-500">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {isFr ? "Dernière maj" : "Last update"}:{" "}
            {lastUpdate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
          <span className="text-gray-200 dark:text-gray-700 ml-2">|</span>
          <span className="ml-2 font-semibold text-gray-600 dark:text-gray-300">{activeFixtures.length} {isFr ? "matchs" : "matches"}</span>
        </div>
        <button
          onClick={refresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? (isFr ? "..." : "...") : (isFr ? "Actualiser" : "Refresh")}
        </button>
      </div>

      {/* ── LIVE matches — always shown, not filtered ── */}
      {allLive.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <h2 className="text-lg font-bold text-red-600 dark:text-red-400">
              {isFr ? "En Direct" : "Live"}
            </h2>
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500">({allLive.length})</span>
          </div>
          <div className="space-y-2.5">
            {liveCountryGroups.map((block) => (
              <CountrySection key={block.country} block={block} defaultOpen={true} />
            ))}
          </div>
        </div>
      )}

      {/* ── FINISHED — 1xBet-style collapsible by country ── */}
      {finished.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="w-5 h-5 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-500">FT</span>
            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">
              {isFr ? "Terminés" : "Finished"}
            </h2>
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500">({finished.length})</span>
          </div>
          <div className="space-y-2.5">
            {finishedCountryGroups.map((block) => (
              <CountrySection key={block.country} block={block} defaultOpen={finishedCountryGroups.length <= 5} />
            ))}
          </div>
        </div>
      )}

      {/* ── UPCOMING — 1xBet-style collapsible by country ── */}
      {upcoming.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2.5 mb-4">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">
              {isFr ? "À Venir" : "Upcoming"}
            </h2>
            <span className="text-sm font-medium text-gray-400 dark:text-gray-500">({upcoming.length})</span>
          </div>
          <div className="space-y-2.5">
            {upcomingCountryGroups.map((block) => (
              <CountrySection
                key={block.country}
                block={block}
                defaultOpen={block.tier <= 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
