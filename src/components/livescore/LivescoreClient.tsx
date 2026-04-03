"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { RefreshCw, Clock, Activity, ChevronDown, ChevronRight, Search, X } from "lucide-react";
import LeagueFilterBar from "@/components/filters/LeagueFilterBar";
import { isPopularLeague, getCountryForLeague, getUniqueCountries, POPULAR_LEAGUES } from "@/lib/league-country-map";
import type { Fixture } from "@/lib/types";

const LIVE_STATUSES = ["1H", "2H", "HT", "ET", "BT", "P"];
const FINISHED_STATUSES = ["FT", "AET", "PEN"];
const POLL_INTERVAL = 60_000;

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
    const info = getCountryForLeague(f.league_name, f.league_id);
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

function StatusBadge({ status, elapsed }: { status: string; elapsed?: number | null }) {
  if (LIVE_STATUSES.includes(status)) {
    const minuteDisplay = status === "HT" ? "HT" : elapsed ? `${elapsed}'` : status;
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
        </span>
        {minuteDisplay}
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

function MatchRow({ fixture }: { fixture: Fixture }) {
  const isLive = LIVE_STATUSES.includes(fixture.status);
  return (
    <div className={`grid grid-cols-[50px_1fr_60px_1fr_52px] md:grid-cols-[60px_1fr_80px_1fr_60px] items-center gap-2 px-3 py-2.5 border-b border-gray-50 last:border-b-0 transition-colors ${isLive ? "bg-red-50/40" : "hover:bg-gray-50/50"}`}>
      <div className="text-xs text-gray-400 font-mono">{formatTime(fixture.match_date)}</div>
      <div className="text-sm font-medium text-gray-900 text-right truncate">{fixture.home_team}</div>
      <div className="flex justify-center"><ScoreDisplay fixture={fixture} /></div>
      <div className="text-sm font-medium text-gray-900 truncate">{fixture.away_team}</div>
      <div className="flex justify-end"><StatusBadge status={fixture.status} elapsed={fixture.elapsed} /></div>
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

function LeagueSection({ league, countryFlag }: { league: LeagueBlock; countryFlag: string }) {
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

export default function LivescoreClient({ initialFixtures, locale }: Props) {
  const [fixtures, setFixtures] = useState(initialFixtures);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterMode, setFilterMode] = useState<"popular" | "all" | "custom">("popular");
  const [selectedLeagueNames, setSelectedLeagueNames] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const isFr = locale === "fr";

  // Filter fixtures based on mode
  const activeFixtures = useMemo(() => {
    let filtered = fixtures;

    if (filterMode === "popular") {
      filtered = fixtures.filter((f) => isPopularLeague(f.league_name, f.league_id));
    } else if (filterMode === "custom" && selectedLeagueNames.size > 0) {
      filtered = fixtures.filter((f) => selectedLeagueNames.has(f.league_name));
    }

    // Apply search on top
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.home_team.toLowerCase().includes(q) ||
          f.away_team.toLowerCase().includes(q) ||
          f.league_name.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [fixtures, filterMode, selectedLeagueNames, searchQuery]);

  // Always show live matches regardless of filter
  const allLive = useMemo(
    () => fixtures.filter((f) => LIVE_STATUSES.includes(f.status)),
    [fixtures]
  );

  // Group by country for the accordion
  const { live: filteredLive, upcoming, finished } = useMemo(() => categorize(activeFixtures), [activeFixtures]);
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

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/livescore", { cache: "no-store" });
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
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  if (fixtures.length === 0) {
    return (
      <div className="text-center py-16">
        <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium">
          {isFr ? "Aucun match aujourd'hui" : "No matches today"}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          {isFr ? "Les matchs apparaitront ici dès qu'ils seront programmés." : "Matches will appear here once scheduled."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ── Sticky filter bar ── */}
      <LeagueFilterBar
        fixtures={fixtures}
        locale={locale}
        onFilteredFixtures={handleFilterChange}
      />

      {/* ── Quick search ── */}
      <div className="relative mb-4">
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-100 border border-gray-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isFr ? "Rechercher une équipe ou ligue..." : "Search team or league..."}
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

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
