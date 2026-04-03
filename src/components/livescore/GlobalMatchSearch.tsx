"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Check, XCircle, Clock } from "lucide-react";
import Image from "next/image";

type SearchResult = {
  id: number;
  home_team: string;
  away_team: string;
  home_team_logo: string | null;
  away_team_logo: string | null;
  league_name: string;
  league_country: string | null;
  match_date: string;
  status: string;
  home_score: number | null;
  away_score: number | null;
  tip: { prediction: string; confidence: number; best_pick: string | null } | null;
  result: { is_correct: boolean; prediction: string; actual_result: string } | null;
};

export default function GlobalMatchSearch({ locale }: { locale: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const isFr = locale === "fr";

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setOpen(true);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(isFr ? "fr-FR" : "en-GB", { weekday: "short", day: "numeric", month: "short" });
  };

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch { return "--:--"; }
  };

  return (
    <div ref={ref} className="relative mb-4">
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gray-100 border border-gray-200 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
        <Search className="w-4 h-4 text-gray-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={isFr ? "Rechercher un match (7 derniers jours)..." : "Search any match (last 7 days)..."}
          className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
        />
        {loading && <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />}
        {query && !loading && (
          <button onClick={() => { setQuery(""); setResults([]); setOpen(false); }} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[400px] overflow-y-auto">
          <div className="px-3 py-2 text-[10px] text-gray-400 uppercase font-bold border-b border-gray-100">
            {results.length} {isFr ? "résultats" : "results"}
          </div>
          {results.map((match) => {
            const isFinished = ["FT", "AET", "PEN"].includes(match.status);
            const isLive = ["1H", "2H", "HT", "ET", "BT", "P"].includes(match.status);
            return (
              <div
                key={match.id}
                className="px-3 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
              >
                {/* Date + League */}
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-gray-400 font-medium">
                    {formatDate(match.match_date)} · {match.league_country || ""} · {match.league_name}
                  </span>
                  {match.result && (
                    <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold ${match.result.is_correct ? "text-emerald-600" : "text-red-500"}`}>
                      {match.result.is_correct ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {match.result.is_correct ? (isFr ? "Gagné" : "Won") : (isFr ? "Perdu" : "Lost")}
                    </span>
                  )}
                  {!match.result && isLive && (
                    <span className="text-[10px] font-bold text-red-500 animate-pulse">LIVE</span>
                  )}
                  {!match.result && !isLive && !isFinished && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-gray-400">
                      <Clock className="w-3 h-3" />
                      {formatTime(match.match_date)}
                    </span>
                  )}
                </div>
                {/* Teams + Score */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center justify-end gap-1.5">
                    <span className="text-sm font-medium text-gray-900 truncate">{match.home_team}</span>
                    {match.home_team_logo && (
                      <Image src={match.home_team_logo} alt="" width={16} height={16} className="w-4 h-4 object-contain" unoptimized />
                    )}
                  </div>
                  <div className="w-14 text-center">
                    {isFinished || isLive ? (
                      <span className={`text-sm font-bold tabular-nums ${isLive ? "text-red-600" : "text-gray-900"}`}>
                        {match.home_score ?? 0} - {match.away_score ?? 0}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">vs</span>
                    )}
                  </div>
                  <div className="flex-1 flex items-center gap-1.5">
                    {match.away_team_logo && (
                      <Image src={match.away_team_logo} alt="" width={16} height={16} className="w-4 h-4 object-contain" unoptimized />
                    )}
                    <span className="text-sm font-medium text-gray-900 truncate">{match.away_team}</span>
                  </div>
                </div>
                {/* Prediction info */}
                {match.tip && (
                  <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold">
                      {match.tip.prediction}
                    </span>
                    <span className="text-gray-400">{match.tip.confidence}% conf.</span>
                    {match.tip.best_pick && (
                      <span className="text-emerald-600 font-medium">{match.tip.best_pick}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4 text-center text-sm text-gray-400">
          {isFr ? "Aucun match trouvé" : "No matches found"}
        </div>
      )}
    </div>
  );
}
