"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trophy } from "lucide-react";
import type { StandingRow } from "@/lib/types";

type Props = {
  leagueId: number;
  homeTeamId: number | null;
  awayTeamId: number | null;
  locale: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://pronofoot-backend-production.up.railway.app";

export default function LeagueStandings({ leagueId, homeTeamId, awayTeamId, locale }: Props) {
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const isFr = locale === "fr";

  useEffect(() => {
    async function fetchStandings() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/standings/${leagueId}`);
        if (res.ok) {
          const data = await res.json();
          setStandings(data.standings || []);
        }
      } catch {
        // Silently fail — standings are optional
      } finally {
        setLoading(false);
      }
    }
    fetchStandings();
  }, [leagueId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="font-bold text-gray-900">{isFr ? "Classement" : "Standings"}</h3>
        </div>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-8 bg-gray-100 rounded" />)}
        </div>
      </div>
    );
  }

  if (standings.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="font-bold text-gray-900">{isFr ? "Classement" : "Standings"}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 text-gray-500 uppercase tracking-wider">
              <th className="px-3 py-2 text-left w-8">#</th>
              <th className="px-3 py-2 text-left">{isFr ? "Équipe" : "Team"}</th>
              <th className="px-3 py-2 text-center w-8">J</th>
              <th className="px-3 py-2 text-center w-8">V</th>
              <th className="px-3 py-2 text-center w-8">N</th>
              <th className="px-3 py-2 text-center w-8">D</th>
              <th className="px-3 py-2 text-center w-10">+/-</th>
              <th className="px-3 py-2 text-center w-10 font-bold">Pts</th>
              <th className="px-3 py-2 text-center w-16">{isFr ? "Forme" : "Form"}</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => {
              const isHighlighted = row.teamId === homeTeamId || row.teamId === awayTeamId;
              return (
                <tr
                  key={row.rank}
                  className={`border-b border-gray-50 ${
                    isHighlighted ? "bg-emerald-50 font-semibold" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-3 py-2 text-gray-500">{row.rank}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      {row.logo && (
                        <Image src={row.logo} alt={row.team} width={16} height={16} className="w-4 h-4 object-contain" unoptimized />
                      )}
                      <span className={`truncate max-w-[120px] ${isHighlighted ? "text-emerald-800" : "text-gray-900"}`}>
                        {row.team}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center text-gray-500">{row.played}</td>
                  <td className="px-3 py-2 text-center text-gray-500">{row.won}</td>
                  <td className="px-3 py-2 text-center text-gray-500">{row.drawn}</td>
                  <td className="px-3 py-2 text-center text-gray-500">{row.lost}</td>
                  <td className="px-3 py-2 text-center text-gray-500">{row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}</td>
                  <td className="px-3 py-2 text-center font-bold text-gray-900">{row.points}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-0.5 justify-center">
                      {(row.form || "").split("").slice(-5).map((r, i) => (
                        <span
                          key={i}
                          className={`w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-bold text-white ${
                            r === "W" ? "bg-emerald-500" : r === "D" ? "bg-gray-400" : "bg-red-500"
                          }`}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
