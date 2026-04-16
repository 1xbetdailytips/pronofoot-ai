"use client";

import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";

type Props = {
  fixtureId: number;
  locale: string;
};

type StatItem = {
  type: string;
  home: string | number | null;
  away: string | number | null;
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://pronofoot-backend-production.up.railway.app";

// Labels for stat types — FR / EN
const STAT_LABELS: Record<string, { fr: string; en: string }> = {
  "Ball Possession": { fr: "Possession", en: "Possession" },
  "Total Shots": { fr: "Tirs Totaux", en: "Total Shots" },
  "Shots on Goal": { fr: "Tirs Cadrés", en: "Shots on Goal" },
  "Shots off Goal": { fr: "Tirs Non Cadrés", en: "Shots off Goal" },
  "Corner Kicks": { fr: "Corners", en: "Corners" },
  Fouls: { fr: "Fautes", en: "Fouls" },
  Offsides: { fr: "Hors-jeu", en: "Offsides" },
  "Yellow Cards": { fr: "Cartons Jaunes", en: "Yellow Cards" },
  "Red Cards": { fr: "Cartons Rouges", en: "Red Cards" },
  "Goalkeeper Saves": { fr: "Arrêts", en: "Saves" },
  "Blocked Shots": { fr: "Tirs Bloqués", en: "Blocked Shots" },
  "Total passes": { fr: "Passes Totales", en: "Total Passes" },
  "Passes accurate": { fr: "Passes Réussies", en: "Passes Accurate" },
  "expected_goals": { fr: "xG", en: "xG" },
};

// Which stats to show and in what order
const DISPLAY_ORDER = [
  "Ball Possession",
  "Total Shots",
  "Shots on Goal",
  "Corner Kicks",
  "Fouls",
  "Offsides",
  "Yellow Cards",
  "Red Cards",
  "Goalkeeper Saves",
];

function parseNum(val: string | number | null): number {
  if (val == null) return 0;
  const s = String(val).replace("%", "").trim();
  return parseFloat(s) || 0;
}

function PossessionBar({ home, away }: { home: number; away: number }) {
  return (
    <div className="flex rounded-full overflow-hidden h-5">
      <div
        style={{ width: `${home}%` }}
        className="bg-emerald-500 flex items-center justify-center text-white text-[11px] font-bold transition-all duration-700"
      >
        {home > 15 ? `${home}%` : ""}
      </div>
      <div
        style={{ width: `${away}%` }}
        className="bg-blue-500 flex items-center justify-center text-white text-[11px] font-bold transition-all duration-700"
      >
        {away > 15 ? `${away}%` : ""}
      </div>
    </div>
  );
}

function StatBar({
  label,
  home,
  away,
}: {
  label: string;
  home: number;
  away: number;
}) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;
  const awayPct = (away / total) * 100;

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="font-semibold text-gray-800 dark:text-gray-200 w-8 text-left tabular-nums">
          {home}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 flex-1 text-center">
          {label}
        </span>
        <span className="font-semibold text-gray-800 dark:text-gray-200 w-8 text-right tabular-nums">
          {away}
        </span>
      </div>
      <div className="flex gap-1 h-2">
        {/* Home bar — grows right-to-left */}
        <div className="flex-1 flex justify-end">
          <div
            className="bg-emerald-500 rounded-l-full transition-all duration-700"
            style={{ width: `${homePct}%`, minWidth: home > 0 ? "4px" : "0" }}
          />
        </div>
        {/* Away bar — grows left-to-right */}
        <div className="flex-1">
          <div
            className="bg-blue-500 rounded-r-full transition-all duration-700"
            style={{ width: `${awayPct}%`, minWidth: away > 0 ? "4px" : "0" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function MatchStats({ fixtureId, locale }: Props) {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isFr = locale === "fr";

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/fixtures/${fixtureId}/statistics`
        );
        if (res.ok) {
          const data = await res.json();
          setStats(data.statistics || []);
        }
      } catch {
        // Silently fail — stats are optional
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [fixtureId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-gray-900 dark:text-white">
            {isFr ? "Statistiques du Match" : "Match Statistics"}
          </h3>
        </div>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full" />
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stats.length === 0) return null;

  // Build a map for fast lookup
  const statMap = new Map<string, { home: number; away: number }>();
  for (const s of stats) {
    statMap.set(s.type, { home: parseNum(s.home), away: parseNum(s.away) });
  }

  // Possession special case
  const possession = statMap.get("Ball Possession");

  // Filtered display stats (excluding possession which gets its own bar)
  const displayStats = DISPLAY_ORDER.filter(
    (key) => key !== "Ball Possession" && statMap.has(key)
  );

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-emerald-600" />
        <h3 className="font-bold text-gray-900 dark:text-white">
          {isFr ? "Statistiques du Match" : "Match Statistics"}
        </h3>
      </div>

      <div className="p-6">
        {/* Possession bar — special centered split */}
        {possession && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                {possession.home}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {isFr ? "Possession" : "Possession"}
              </span>
              <span className="font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                {possession.away}%
              </span>
            </div>
            <PossessionBar home={possession.home} away={possession.away} />
          </div>
        )}

        {/* Other stats */}
        {displayStats.map((key) => {
          const val = statMap.get(key)!;
          const label =
            STAT_LABELS[key]?.[isFr ? "fr" : "en"] ?? key;
          return (
            <StatBar
              key={key}
              label={label}
              home={val.home}
              away={val.away}
            />
          );
        })}
      </div>
    </div>
  );
}
