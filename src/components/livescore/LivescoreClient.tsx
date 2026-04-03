"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { RefreshCw, Clock, Activity, ChevronDown, ChevronRight, ChevronLeft, CalendarDays } from "lucide-react";
import Image from "next/image";
import LeagueFilterBar from "@/components/filters/LeagueFilterBar";
import GlobalMatchSearch from "@/components/livescore/GlobalMatchSearch";
import { isPopularLeague, getCountryForLeague } from "@/lib/league-country-map";
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

  useEffect(() => {
    if (status === "HT" || !LIVE_STATUSES.includes(status)) return;
    const interval = setInterval(() => setTick(t => t + 1), 60_000);
    return () => clearInterval(interval);
  }, [status]);

  if (status === "HT") return "HT";

  // If elapsed is available, use it + client ticks
  if (elapsed) {
    const displayMinute = elapsed + tick;
    const maxMinute = ["ET", "BT"].includes(status) ? 120 : 90;
    return `${Math.min(displayMinute, maxMinute)}'`;
  }

  // Estimate minute from match start time if elapsed not available
  if (matchDate) {
    const kickoff = new Date(matchDate).getTime();
    const now = Date.now();
    const elapsedMs = now - kickoff;
    if (elapsedMs > 0) {
      let estimatedMin = Math.floor(elapsedMs / 60000);
      // 2H starts at ~45 min + 15 min break
      if (status === "2H") estimatedMin = Math.max(46, estimatedMin - 15);
      const maxMinute = ["ET", "BT"].includes(status) ? 120 : status === "2H" ? 90 : 45;
      return `${Math.min(estimatedMin, maxMinute)}'`;
    }
  }

  return status;
}

function StatusBadge({ status, elapsed, matchDate }: { status: string; elapsed?: number | null; matchDate?: string }) {
  if (LIVE_STATUSES.includes(status)) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
        </span>
        <LiveMinuteTicker status={status} elapsed={elapsed} matchDate={matchDate} />
      </span>
    );
  }
  if (FINISHED_STATUSES.includes(status)) {
    return <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">{status}</span>;
  }
  return <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-600">{status || "NS"}</span>;
}

function ScoreDisplay({ fixture }: { fixture: Fixture }) {
  const isLive = LIVE_STATUSES.includes(fixture.status);
  const isFinished = FINISHED_STATUSES.includes(fixture.status);
  if (isLive || isFinished) {
    return (
      <div className={`flex items-center gap-1.5 font-bold text-lg tabular-nums ${isLive ? "text-red-600" : "text-gray-900"}`}>
        <span>{fixture.home_score ?? 0}</span>
        <span className="text-gray-400">-</span>
        <span>{fixture.away_score ?? 0}</span>
      </div>
    );
  }
  return <span className="text-sm font-medium text-gray-400">vs</span>;
}

function TeamLogo({ src, alt }: { src: string | null; alt: string }) {
  if (!src) return <span className="w-5 h-5 rounded-full bg-gray-200 shrink-0" />;
  return (
    <Image
      src={src}
      alt={alt}
      width={20}
      height={20}
      className="w-5 h-5 object-contain shrink-0"
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
    <div className="flex items-center gap-1 flex-wrap">
      {goals.map((g, i) => (
        <span key={`g${i}`} className="text-[10px] text-gray-500">
          <span className="text-gray-900 font-medium">{g.player?.split(" ").pop()}</span>
          <span className="text-gray-400 ml-0.5">{g.time}&apos;</span>
        </span>
      ))}
      {reds.map((_, i) => (
        <span key={`r${i}`} className="inline-block w-2.5 h-3 bg-red-600 rounded-[1px]" title="Red card" />
      ))}
      {yellows.map((_, i) => (
        <span key={`y${i}`} className="inline-block w-2.5 h-3 bg-yellow-400 rounded-[1px]" title="Yellow card" />
      ))}
    </div>
  );
}

function MatchRow({ fixture }: { fixture: Fixture }) {
  const isLive = LIVE_STATUSES.includes(fixture.status);
  const isFinished = FINISHED_STATUSES.includes(fixture.status);
  const hasEvents = fixture.match_events && fixture.match_events.length > 0;
  // Cast to LiveFixture to access tip/result enrichments (may be undefined for legacy data)
  const lf = fixture as LiveFixture;
  return (
    <div className={`border-b border-gray-50 last:border-b-0 transition-colors ${isLive ? "bg-red-50/40" : "hover:bg-gray-50/50"}`}>
      <div className="grid grid-cols-[44px_1fr_56px_1fr_48px] md:grid-cols-[56px_1fr_80px_1fr_56px] items-center gap-1.5 md:gap-2 px-2 md:px-3 py-2.5">
        <div className="text-xs text-gray-400 font-mono">{formatTime(fixture.match_date)}</div>
        <div className="flex items-center justify-end gap-1.5 min-w-0">
          <span className="text-sm font-medium text-gray-900 truncate">{fixture.home_team}</span>
          <TeamLogo src={fixture.home_team_logo} alt={fixture.home_team} />
        </div>
        <div className="flex justify-center"><ScoreDisplay fixture={fixture} /></div>
        <div className="flex items-center gap-1.5 min-w-0">
          <TeamLogo src={fixture.away_team_logo} alt={fixture.away_team} />
          <span className="text-sm font-medium text-gray-900 truncate">{fixture.away_team}</span>
        </div>
        <div className="flex justify-end"><StatusBadge status={fixture.status} elapsed={fixture.elapsed} matchDate={fixture.match_date} /></div>
      </div>
      {/* Prediction + Result row */}
      {lf.tip_prediction && (
        <div className="flex items-center gap-2 px-2 md:px-3 pb-2 -mt-0.5">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
            {lf.tip_prediction}
          </span>
          <span className="text-[10px] text-gray-400">{lf.tip_confidence}%</span>
          {lf.tip_best_pick && (
            <span className="text-[10px] text-emerald-600 font-medium">{lf.tip_best_pick}</span>
          )}
          {lf.result_correct === true && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded ml-auto">WIN</span>
          )}
          {lf.result_correct === false && (
            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded ml-auto">LOST</span>
          )}
        </div>
      )}
      {/* Goal scorers + cards row */}
      {hasEvents && (isLive || isFinished) && (
        <div className="grid grid-cols-[44px_1fr_56px_1fr_48px] md:grid-cols-[56px_1fr_80px_1fr_56px] gap-1.5 md:gap-2 px-2 md:px-3 pb-2 -mt-1">
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
    <div className="rounded-lg overflow-hidden mb-2 shadow-sm border border-gray-200/80">
      {/* Country header — clickable to expand/collapse */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2 px-3 py-2 transition-all duration-200 ${
          isOpen
            ? "bg-gradient-to-r from-gray-800 to-gray-700 text-white"
            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
        }`}
      >
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`} />
        <span className="text-base leading-none">{block.flag}</span>
        <span className="text-sm font-bold">{block.country}</span>
        {block.hasLive && (
          <span className="relative flex h-2 w-2 ml-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
        )}
        <span className={`text-xs font-medium ml-auto tabular-nums ${isOpen ? "text-gray-400" : "text-gray-400"}`}>
          {block.totalMatches} {block.totalMatches === 1 ? "match" : "matches"}
        </span>
      </button>

      {/* Leagues within the country */}
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="divide-y divide-gray-100">
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
        className="w-full flex items-center gap-2 px-4 py-2 bg-gray-50/80 hover:bg-gray-100 transition-all duration-150 border-b border-gray-100"
      >
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 ${isOpen ? "" : "-rotate-90"}`} />
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {league.leagueName}
        </span>
        {hasLive && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white animate-pulse">
            LIVE
          </span>
        )}
        <span className="text-xs text-gray-400 ml-auto tabular-nums">{league.fixtures.length}</span>
      </button>

      {/* Matches */}
      <div
        className={`transition-all duration-150 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white">
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
  const [filterMode, setFilterMode] = useState<"popular" | "all" | "custom">("popular");
  const [selectedLeagueNames, setSelectedLeagueNames] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const isFr = locale === "fr";

  // Filter fixtures based on mode
  const activeFixtures = useMemo(() => {
    let filtered = fixtures;

    if (filterMode === "popular") {
      filtered = fixtures.filter((f) => isPopularLeague(f.league_name, f.league_id));
    } else if (filterMode === "custom" && selectedLeagueNames.size > 0) {
      filtered = fixtures.filter((f) => selectedLeagueNames.has(f.league_name));
    }

    return filtered;
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
    <div className="flex items-center justify-center gap-1 mb-4">
      {/* Previous 3 days + today + next 3 days */}
      <button
        onClick={() => navigateDate(addDays(selectedDate, -1))}
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
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
              className={`flex flex-col items-center px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all min-w-[52px] ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-sm"
                  : dayIsToday
                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                  : "text-gray-500 hover:bg-gray-100"
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
        className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        aria-label="Next day"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Today quick button */}
      {!isToday(selectedDate) && (
        <button
          onClick={() => navigateDate(new Date())}
          className="ml-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
        >
          <CalendarDays className="w-3.5 h-3.5 inline mr-1" />
          {isFr ? "Auj." : "Today"}
        </button>
      )}
    </div>
  );

  if (fixtures.length === 0) {
    return (
      <div>
        {dateNav}
        <div className="text-center py-16">
          <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            {isFr ? "Aucun match ce jour" : "No matches on this day"}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {isFr ? "Essayez une autre date." : "Try a different date."}
          </p>
        </div>
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
      <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {isFr ? "Dernière maj" : "Last update"}:{" "}
            {lastUpdate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
          <span className="text-gray-300 ml-2">|</span>
          <span className="ml-2 font-medium text-gray-500">{activeFixtures.length} {isFr ? "matchs" : "matches"}</span>
        </div>
        <button
          onClick={refresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? (isFr ? "Chargement..." : "Refreshing...") : (isFr ? "Actualiser" : "Refresh")}
        </button>
      </div>

      {/* ── LIVE matches — always shown, not filtered ── */}
      {allLive.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-red-600">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <h2 className="text-lg font-bold">
              {isFr ? "En Direct" : "Live"}
              <span className="text-sm font-normal text-gray-400 ml-2">({allLive.length})</span>
            </h2>
          </div>
          <div className="space-y-2">
            {liveCountryGroups.map((block) => (
              <CountrySection key={block.country} block={block} defaultOpen={true} />
            ))}
          </div>
        </div>
      )}

      {/* ── FINISHED — 1xBet-style collapsible by country ── */}
      {finished.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-gray-500">
            <span className="w-4 h-4 text-center font-bold text-xs">FT</span>
            <h2 className="text-lg font-bold">
              {isFr ? "Terminés" : "Finished"}
              <span className="text-sm font-normal text-gray-400 ml-2">({finished.length})</span>
            </h2>
          </div>
          <div className="space-y-2">
            {finishedCountryGroups.map((block) => (
              <CountrySection key={block.country} block={block} defaultOpen={finishedCountryGroups.length <= 5} />
            ))}
          </div>
        </div>
      )}

      {/* ── UPCOMING — 1xBet-style collapsible by country ── */}
      {upcoming.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-gray-700">
            <Clock className="w-4 h-4" />
            <h2 className="text-lg font-bold">
              {isFr ? "À Venir" : "Upcoming"}
              <span className="text-sm font-normal text-gray-400 ml-2">({upcoming.length})</span>
            </h2>
          </div>
          <div className="space-y-2">
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
