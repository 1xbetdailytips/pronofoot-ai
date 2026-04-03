"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import type { MatchEvent } from "@/lib/types";

type Props = {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamId: number | null;
  locale: string;
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://pronofoot-backend-production.up.railway.app";

function EventIcon({ type, detail }: { type: string; detail: string }) {
  if (type === "Goal") {
    if (detail === "Own Goal") return <span className="text-xs" title="Own Goal">OG</span>;
    if (detail?.includes("Penalty")) return <span className="text-xs" title="Penalty">P</span>;
    return <span className="text-sm">&#9917;</span>;
  }
  if (type === "Card") {
    if (detail?.includes("Red")) return <span className="inline-block w-3 h-4 bg-red-600 rounded-[1px]" />;
    return <span className="inline-block w-3 h-4 bg-yellow-400 rounded-[1px]" />;
  }
  if (type === "subst") return <span className="text-emerald-500 text-xs font-bold">&#8645;</span>;
  if (type === "Var") return <span className="text-xs font-bold text-blue-500">VAR</span>;
  return null;
}

export default function MatchTimeline({ fixtureId, homeTeam, awayTeam, homeTeamId, locale }: Props) {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const isFr = locale === "fr";

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`${BACKEND_URL}/api/fixtures/${fixtureId}/events`);
        if (res.ok) {
          const data = await res.json();
          setEvents(data.events || []);
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [fixtureId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-orange-500" />
          <h3 className="font-bold text-gray-900">{isFr ? "Chronologie" : "Match Timeline"}</h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-6 bg-gray-100 rounded" />)}
        </div>
      </div>
    );
  }

  if (events.length === 0) return null;

  // Split events into home and away
  const keyEvents = events.filter(e => e.type === "Goal" || e.type === "Card");

  if (keyEvents.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <Clock className="w-5 h-5 text-orange-500" />
        <h3 className="font-bold text-gray-900">{isFr ? "Chronologie du Match" : "Match Timeline"}</h3>
      </div>
      <div className="p-4">
        {/* Team headers */}
        <div className="flex justify-between text-xs font-bold text-gray-500 mb-3 px-2">
          <span>{homeTeam}</span>
          <span>{awayTeam}</span>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200" />

          <div className="space-y-2">
            {keyEvents.map((event, i) => {
              const isHome = event.teamId === homeTeamId;
              return (
                <div key={i} className={`flex items-center gap-2 ${isHome ? "flex-row" : "flex-row-reverse"}`}>
                  <div className={`flex-1 flex items-center gap-1.5 ${isHome ? "justify-end text-right" : "justify-start text-left"}`}>
                    <span className="text-xs text-gray-700 font-medium truncate max-w-[120px]">
                      {event.player?.split(" ").pop()}
                    </span>
                    <EventIcon type={event.type} detail={event.detail} />
                  </div>
                  <div className="w-10 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600 z-10 shrink-0">
                    {event.time}&apos;
                  </div>
                  <div className="flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
