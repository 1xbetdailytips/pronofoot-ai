"use client";

import { useState, useEffect } from "react";
import { Users, ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  fixtureId: number;
  locale: string;
};

type Player = {
  id: number;
  name: string;
  number: number;
  pos: string | null;
  grid: string | null;
};

type TeamLineup = {
  team: {
    id: number;
    name: string;
    logo: string | null;
  };
  coach: {
    id: number | null;
    name: string | null;
    photo: string | null;
  } | null;
  formation: string | null;
  startXI: Player[];
  substitutes: Player[];
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://pronofoot-backend-production.up.railway.app";

// Position badge colors
const POS_STYLES: Record<string, string> = {
  G: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  D: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  M: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
  F: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const POS_LABELS: Record<string, { fr: string; en: string }> = {
  G: { fr: "GB", en: "GK" },
  D: { fr: "DEF", en: "DEF" },
  M: { fr: "MIL", en: "MID" },
  F: { fr: "ATT", en: "FWD" },
};

function PosBadge({ pos, isFr }: { pos: string | null; isFr: boolean }) {
  if (!pos) return null;
  const key = pos.charAt(0).toUpperCase();
  const style = POS_STYLES[key] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  const label = POS_LABELS[key]?.[isFr ? "fr" : "en"] || pos;
  return (
    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${style}`}>
      {label}
    </span>
  );
}

function PlayerRow({ player, isFr }: { player: Player; isFr: boolean }) {
  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <span className="text-xs font-mono text-gray-400 dark:text-gray-500 w-6 text-right">
        {player.number || "-"}
      </span>
      <span className="text-sm text-gray-800 dark:text-gray-200 flex-1 truncate">
        {player.name}
      </span>
      <PosBadge pos={player.pos} isFr={isFr} />
    </div>
  );
}

function TeamColumn({
  lineup,
  isFr,
  side,
}: {
  lineup: TeamLineup;
  isFr: boolean;
  side: "home" | "away";
}) {
  const [subsOpen, setSubsOpen] = useState(false);

  return (
    <div className="flex-1 min-w-0">
      {/* Formation badge */}
      {lineup.formation && (
        <div className="flex justify-center mb-3">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${
              side === "home"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400"
            }`}
          >
            {lineup.formation}
          </span>
        </div>
      )}

      {/* Coach */}
      {lineup.coach?.name && (
        <div className="text-center mb-3">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            {isFr ? "Entraîneur" : "Coach"}
          </p>
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
            {lineup.coach.name}
          </p>
        </div>
      )}

      {/* Starting XI */}
      <div className="mb-2">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold px-2 mb-1">
          {isFr ? "Titulaires" : "Starting XI"}
        </p>
        <div className="space-y-0.5">
          {lineup.startXI.map((p) => (
            <PlayerRow key={p.id || p.name} player={p} isFr={isFr} />
          ))}
        </div>
      </div>

      {/* Substitutes — collapsible */}
      {lineup.substitutes.length > 0 && (
        <div className="mt-2 border-t border-gray-100 dark:border-gray-800 pt-2">
          <button
            onClick={() => setSubsOpen(!subsOpen)}
            className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold px-2 mb-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors w-full"
          >
            {isFr ? "Remplaçants" : "Substitutes"} ({lineup.substitutes.length})
            {subsOpen ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
          {subsOpen && (
            <div className="space-y-0.5 animate-in slide-in-from-top-1 duration-200">
              {lineup.substitutes.map((p) => (
                <PlayerRow key={p.id || p.name} player={p} isFr={isFr} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MatchLineups({ fixtureId, locale }: Props) {
  const [lineups, setLineups] = useState<TeamLineup[]>([]);
  const [loading, setLoading] = useState(true);
  const isFr = locale === "fr";

  useEffect(() => {
    async function fetchLineups() {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/fixtures/${fixtureId}/lineups`
        );
        if (res.ok) {
          const data = await res.json();
          setLineups(data.lineups || []);
        }
      } catch {
        // Silently fail — lineups are optional
      } finally {
        setLoading(false);
      }
    }
    fetchLineups();
  }, [fixtureId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900 dark:text-white">
            {isFr ? "Compositions" : "Lineups"}
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[0, 1].map((col) => (
            <div key={col} className="animate-pulse space-y-2">
              <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-16 mx-auto" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-5 bg-gray-100 dark:bg-gray-800 rounded" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (lineups.length < 2) return null;

  const home = lineups[0];
  const away = lineups[1];

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-gray-900 dark:text-white">
          {isFr ? "Compositions" : "Lineups"}
        </h3>
      </div>

      <div className="p-4 sm:p-6">
        {/* Team names header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 truncate flex-1">
            {home.team.name}
          </p>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-3" />
          <p className="text-sm font-bold text-blue-700 dark:text-blue-400 truncate flex-1 text-right">
            {away.team.name}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-3 sm:gap-6">
          <TeamColumn lineup={home} isFr={isFr} side="home" />
          <div className="w-px bg-gray-100 dark:bg-gray-800 flex-shrink-0" />
          <TeamColumn lineup={away} isFr={isFr} side="away" />
        </div>
      </div>
    </div>
  );
}
