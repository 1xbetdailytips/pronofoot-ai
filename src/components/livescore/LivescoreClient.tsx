"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { RefreshCw, Clock, Activity } from "lucide-react";
import LeagueFilterBar from "@/components/filters/LeagueFilterBar";
import { isPopularLeague, getCountryForLeague } from "@/lib/league-country-map";
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

type CountryLeagueGroup = {
  key: string;
  country: string;
  flag: string;
  leagueName: string;
  fixtures: Fixture[];
};

function groupByCountryAndLeague(fixtures: Fixture[]): CountryLeagueGroup[] {
  const groups = new Map<string, CountryLeagueGroup>();
  for (const f of fixtures) {
    const info = getCountryForLeague(f.league_name);
    const key = `${info.country}__${f.league_name}`;
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        country: info.country,
        flag: info.flag,
        leagueName: f.league_name,
        fixtures: [],
      });
    }
    groups.get(key)!.fixtures.push(f);
  }
  return Array.from(groups.values()).sort((a, b) => {
    const aInfo = getCountryForLeague(a.leagueName);
    const bInfo = getCountryForLeague(b.leagueName);
    if (aInfo.tier !== bInfo.tier) return aInfo.tier - bInfo.tier;
    return b.fixtures.length - a.fixtures.length;
  });
}

function formatTime(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "--:--";
  }
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
    return (
      <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-600">
      {status || "NS"}
    </span>
  );
}

function ScoreDisplay({ fixture }: { fixture: Fixture }) {
  const isLive = LIVE_STATUSES.includes(fixture.status);
  const isFinished = FINISHED_STATUSES.includes(fixture.status);

  if (isLive || isFinished) {
    return (
      <div
        className={`flex items-center gap-1.5 font-bold text-lg tabular-nums ${
          isLive ? "text-red-600" : "text-gray-900"
        }`}
      >
        <span>{fixture.home_score ?? 0}</span>
        <span className="text-gray-400">-</span>
        <span>{fixture.away_score ?? 0}</span>
      </div>
    );
  }

  return (
    <span className="text-sm font-medium text-gray-400">vs</span>
  );
}

function MatchRow({ fixture }: { fixture: Fixture }) {
  const isLive = LIVE_STATUSES.includes(fixture.status);

  return (
    <div
      className={`grid grid-cols-[50px_1fr_60px_1fr_52px] md:grid-cols-[60px_1fr_80px_1fr_60px] items-center gap-2 px-3 py-2.5 border-b border-gray-50 last:border-b-0 transition-colors ${
        isLive ? "bg-red-50/40" : "hover:bg-gray-50/50"
      }`}
    >
      <div className="text-xs text-gray-400 font-mono">
        {formatTime(fixture.match_date)}
      </div>
      <div className="text-sm font-medium text-gray-900 text-right truncate">
        {fixture.home_team}
      </div>
      <div className="flex justify-center">
        <ScoreDisplay fixture={fixture} />
      </div>
      <div className="text-sm font-medium text-gray-900 truncate">
        {fixture.away_team}
      </div>
      <div className="flex justify-end">
        <StatusBadge status={fixture.status} elapsed={fixture.elapsed} />
      </div>
    </div>
  );
}

function CountryLeagueGroupView({
  group,
}: {
  group: CountryLeagueGroup;
}) {
  return (
    <div className="mb-1">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-t-lg">
        <span className="text-sm">{group.flag}</span>
        {group.country !== group.leagueName && (
          <span className="text-xs text-gray-400">{group.country} &rsaquo;</span>
        )}
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {group.leagueName}
        </span>
        <span className="text-xs text-gray-400 ml-auto">({group.fixtures.length})</span>
      </div>
      <div className="bg-white rounded-b-lg border border-gray-100">
        {group.fixtures.map((f) => (
          <MatchRow key={f.id} fixture={f} />
        ))}
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  accentColor,
  fixtures,
}: {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  fixtures: Fixture[];
}) {
  if (fixtures.length === 0) return null;

  const groups = groupByCountryAndLeague(fixtures);

  return (
    <div className="mb-6">
      <div className={`flex items-center gap-2 mb-3 ${accentColor}`}>
        {icon}
        <h2 className="text-lg font-bold">
          {title}
          <span className="text-sm font-normal text-gray-400 ml-2">
            ({fixtures.length})
          </span>
        </h2>
      </div>
      <div className="space-y-3 transition-all duration-300">
        {groups.map((group) => (
          <CountryLeagueGroupView key={group.key} group={group} />
        ))}
      </div>
    </div>
  );
}

export default function LivescoreClient({ initialFixtures, locale }: Props) {
  const [fixtures, setFixtures] = useState(initialFixtures);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filteredFixtures, setFilteredFixtures] = useState<Fixture[]>([]);
  const [filterMode, setFilterMode] = useState<"popular" | "all" | "custom">("popular");
  const isFr = locale === "fr";

  // Initial popular filter
  const popularFiltered = useMemo(
    () => fixtures.filter((f) => isPopularLeague(f.league_name)),
    [fixtures]
  );

  // Active fixtures based on filter
  const activeFixtures = useMemo(() => {
    if (filterMode === "all") return fixtures;
    if (filterMode === "custom" && filteredFixtures.length > 0) return filteredFixtures;
    // Default: popular
    return popularFiltered;
  }, [fixtures, filteredFixtures, filterMode, popularFiltered]);

  const handleFilterChange = useCallback(
    (filtered: Array<{ league_name: string }>, mode: "popular" | "all" | "custom") => {
      const leagueNames = new Set(filtered.map((f) => f.league_name));
      if (mode === "all") {
        setFilteredFixtures(fixtures);
      } else {
        setFilteredFixtures(fixtures.filter((f) => leagueNames.has(f.league_name)));
      }
      setFilterMode(mode);
    },
    [fixtures]
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

  const { upcoming, finished } = categorize(activeFixtures);

  // Always show live matches even if not in filter
  const allLive = useMemo(
    () => fixtures.filter((f) => LIVE_STATUSES.includes(f.status)),
    [fixtures]
  );

  if (fixtures.length === 0) {
    return (
      <div className="text-center py-16">
        <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium">
          {isFr ? "Aucun match aujourd'hui" : "No matches today"}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          {isFr
            ? "Les matchs apparaitront ici dès qu'ils seront programmés."
            : "Matches will appear here once scheduled."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter bar */}
      <LeagueFilterBar
        fixtures={fixtures}
        locale={locale}
        onFilteredFixtures={handleFilterChange}
      />

      {/* Refresh bar */}
      <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {isFr ? "Dernière maj" : "Last update"}:{" "}
            {lastUpdate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
          <span className="text-gray-300 mx-1">|</span>
          <span className="text-emerald-600 font-medium">
            {activeFixtures.length} / {fixtures.length} {isFr ? "matchs" : "matches"}
          </span>
        </div>
        <button
          onClick={refresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing
            ? isFr
              ? "Chargement..."
              : "Refreshing..."
            : isFr
              ? "Actualiser"
              : "Refresh"}
        </button>
      </div>

      {/* Always show ALL live matches regardless of filter */}
      <Section
        title={isFr ? "En Direct" : "Live"}
        icon={
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
        }
        accentColor="text-red-600"
        fixtures={allLive}
      />

      {/* Filtered: Finished */}
      <Section
        title={isFr ? "Terminés" : "Finished"}
        icon={<span className="w-4 h-4 text-center font-bold text-xs">FT</span>}
        accentColor="text-gray-500"
        fixtures={finished}
      />

      {/* Filtered: Upcoming */}
      <Section
        title={isFr ? "À Venir" : "Upcoming"}
        icon={<Clock className="w-4 h-4" />}
        accentColor="text-gray-700"
        fixtures={upcoming}
      />
    </div>
  );
}
