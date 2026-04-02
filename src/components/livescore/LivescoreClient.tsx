"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Clock, Activity } from "lucide-react";
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

function groupByLeague(fixtures: Fixture[]): Record<string, Fixture[]> {
  const groups: Record<string, Fixture[]> = {};
  for (const f of fixtures) {
    const key = f.league_name || "Other";
    if (!groups[key]) groups[key] = [];
    groups[key].push(f);
  }
  return groups;
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

function StatusBadge({ status }: { status: string }) {
  if (LIVE_STATUSES.includes(status)) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
        </span>
        {status}
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
      {/* Time */}
      <div className="text-xs text-gray-400 font-mono">
        {formatTime(fixture.match_date)}
      </div>

      {/* Home team */}
      <div className="text-sm font-medium text-gray-900 text-right truncate">
        {fixture.home_team}
      </div>

      {/* Score */}
      <div className="flex justify-center">
        <ScoreDisplay fixture={fixture} />
      </div>

      {/* Away team */}
      <div className="text-sm font-medium text-gray-900 truncate">
        {fixture.away_team}
      </div>

      {/* Status */}
      <div className="flex justify-end">
        <StatusBadge status={fixture.status} />
      </div>
    </div>
  );
}

function LeagueGroup({
  leagueName,
  fixtures,
}: {
  leagueName: string;
  fixtures: Fixture[];
}) {
  return (
    <div className="mb-1">
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-t-lg">
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {leagueName}
        </span>
        <span className="text-xs text-gray-400">({fixtures.length})</span>
      </div>
      <div className="bg-white rounded-b-lg border border-gray-100">
        {fixtures.map((f) => (
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
  emptyText,
}: {
  title: string;
  icon: React.ReactNode;
  accentColor: string;
  fixtures: Fixture[];
  emptyText: string;
}) {
  if (fixtures.length === 0) return null;

  const leagues = groupByLeague(fixtures);

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
      <div className="space-y-3">
        {Object.entries(leagues).map(([name, matches]) => (
          <LeagueGroup key={name} leagueName={name} fixtures={matches} />
        ))}
      </div>
    </div>
  );
}

export default function LivescoreClient({ initialFixtures, locale }: Props) {
  const [fixtures, setFixtures] = useState(initialFixtures);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFr = locale === "fr";

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

  const { live, upcoming, finished } = categorize(fixtures);

  if (fixtures.length === 0) {
    return (
      <div className="text-center py-16">
        <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium">
          {isFr ? "Aucun match aujourd'hui" : "No matches today"}
        </p>
        <p className="text-gray-400 text-sm mt-1">
          {isFr
            ? "Les matchs apparaitront ici des qu'ils seront programmes."
            : "Matches will appear here once scheduled."}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Refresh bar */}
      <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {isFr ? "Derniere maj" : "Last update"}:{" "}
            {lastUpdate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
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

      {/* LIVE */}
      <Section
        title={isFr ? "En Direct" : "Live"}
        icon={
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
        }
        accentColor="text-red-600"
        fixtures={live}
        emptyText={isFr ? "Aucun match en direct" : "No live matches"}
      />

      {/* UPCOMING */}
      <Section
        title={isFr ? "A Venir" : "Upcoming"}
        icon={<Clock className="w-4 h-4" />}
        accentColor="text-gray-700"
        fixtures={upcoming}
        emptyText={isFr ? "Aucun match a venir" : "No upcoming matches"}
      />

      {/* FINISHED */}
      <Section
        title={isFr ? "Termines" : "Finished"}
        icon={<span className="w-4 h-4 text-center font-bold text-xs">FT</span>}
        accentColor="text-gray-400"
        fixtures={finished}
        emptyText={isFr ? "Aucun match termine" : "No finished matches"}
      />
    </div>
  );
}

