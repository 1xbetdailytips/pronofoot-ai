"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Trophy, ChevronDown, ChevronRight, ChevronLeft, CalendarDays, Filter } from "lucide-react";
import MatchCard from "./MatchCard";
import LeagueFilterBar from "@/components/filters/LeagueFilterBar";
import { isPopularLeague, getCountryForLeague } from "@/lib/league-country-map";
import { matchToCardProps } from "@/lib/data";
import type { MatchWithTip } from "@/lib/types";

type Props = {
  matches: MatchWithTip[];
  locale: string;
};

// ── Country → League grouping ───────────────────────────────────────────────

type LeagueGroup = {
  key: string;
  country: string;
  flag: string;
  leagueName: string;
  matches: MatchWithTip[];
};

function groupByCountryThenLeague(matches: MatchWithTip[]): LeagueGroup[] {
  const groups = new Map<string, LeagueGroup>();
  for (const m of matches) {
    const info = getCountryForLeague(m.league_name, m.league_id, m.league_country);
    const key = `${info.country}__${m.league_name}`;
    if (!groups.has(key)) {
      groups.set(key, { key, country: info.country, flag: info.flag, leagueName: m.league_name, matches: [] });
    }
    groups.get(key)!.matches.push(m);
  }
  return Array.from(groups.values()).sort((a, b) => {
    // Use first match in each group to get accurate tier info
    const aInfo = getCountryForLeague(a.leagueName, a.matches[0]?.league_id, a.matches[0]?.league_country);
    const bInfo = getCountryForLeague(b.leagueName, b.matches[0]?.league_id, b.matches[0]?.league_country);
    if (aInfo.tier !== bInfo.tier) return aInfo.tier - bInfo.tier;
    return b.matches.length - a.matches.length;
  });
}

// ── Collapsible league section ──────────────────────────────────────────────

function CollapsibleLeagueGroup({
  group,
  locale,
  defaultOpen = true,
  blurred = false,
}: {
  group: LeagueGroup;
  locale: string;
  defaultOpen?: boolean;
  blurred?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden mb-2 ${blurred ? "blur-[2px] opacity-50 pointer-events-none select-none" : ""}`}>
      <button
        onClick={() => !blurred && setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2 px-3 py-2.5 transition-colors ${
          isOpen ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {isOpen
          ? <ChevronDown className="w-4 h-4 shrink-0" />
          : <ChevronRight className="w-4 h-4 shrink-0" />}
        <span className="text-base">{group.flag}</span>
        {group.country !== group.leagueName && (
          <span className={`text-xs ${isOpen ? "text-gray-300" : "text-gray-400"}`}>{group.country} &rsaquo;</span>
        )}
        <span className="text-sm font-bold">{group.leagueName}</span>
        <span className={`text-xs ml-auto ${isOpen ? "text-gray-300" : "text-gray-400"}`}>
          {group.matches.length}
        </span>
      </button>

      {isOpen && (
        <div className="bg-white divide-y divide-gray-50">
          {group.matches.map((match) => (
            <MatchCard key={match.id} {...matchToCardProps(match)} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}

// VIP overlay removed — all predictions now free

// ── Date helpers ────────────────────────────────────────────────────────────

function addDays(d: Date, n: number) {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

function formatDateParam(d: Date) {
  return d.toISOString().slice(0, 10);
}

function isToday(d: Date) {
  return d.toDateString() === new Date().toDateString();
}

// ── Market filter types ─────────────────────────────────────────────────────

type MarketFilter = "all" | "1x2" | "over_under" | "btts" | "best_pick";

const MARKET_TABS: { key: MarketFilter; labelFr: string; labelEn: string; accuracyKey: string }[] = [
  { key: "all", labelFr: "Tous", labelEn: "All", accuracyKey: "overall" },
  { key: "1x2", labelFr: "1X2", labelEn: "1X2", accuracyKey: "1x2" },
  { key: "over_under", labelFr: "Over/Under", labelEn: "Over/Under", accuracyKey: "over25" },
  { key: "btts", labelFr: "BTTS", labelEn: "BTTS", accuracyKey: "btts" },
  { key: "best_pick", labelFr: "Best Pick", labelEn: "Best Pick", accuracyKey: "bestPick" },
];

function matchesMarketFilter(m: MatchWithTip, filter: MarketFilter): boolean {
  if (filter === "all") return true;
  if (!m.tip) return false;
  const bp = (m.tip.best_pick || "").toLowerCase();
  switch (filter) {
    case "1x2":
      return ["1", "2", "1X", "X2", "12"].includes(m.tip.prediction);
    case "over_under":
      return bp.includes("over") || bp.includes("under");
    case "btts":
      return bp.includes("btts");
    case "best_pick":
      return !!m.tip.best_pick;
    default:
      return true;
  }
}

// Top league IDs that should ALWAYS appear in free picks
const TOP_LEAGUE_IDS = new Set([
  2, 3, // Champions League, Europa League
  39, // Premier League
  140, // La Liga
  135, // Serie A
  78, // Bundesliga
  61, // Ligue 1
  848, // Conference League
  45, // FA Cup
  143, // Copa del Rey
  137, // Coppa Italia
  81, // DFB Pokal
  66, // Coupe de France
  6, 12, 20, // AFCON, CAF CL, CAF CC
  1, // World Cup
]);

// ── Main PredictionsClient ──────────────────────────────────────────────────

export default function PredictionsClient({ matches: initialMatches, locale }: Props) {
  const isFr = locale === "fr";
  const [matches, setMatches] = useState(initialMatches);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoadingDate, setIsLoadingDate] = useState(false);
  const [marketFilter, setMarketFilter] = useState<MarketFilter>("all");
  const [accuracy, setAccuracy] = useState<Record<string, number>>({});

  // Fetch per-market accuracy stats
  useEffect(() => {
    fetch("/api/accuracy")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setAccuracy(data); })
      .catch(() => {});
  }, []);

  // Date navigation
  const navigateDate = useCallback(async (date: Date) => {
    setSelectedDate(date);
    if (isToday(date)) {
      setMatches(initialMatches);
      return;
    }
    setIsLoadingDate(true);
    try {
      const res = await fetch(`/api/predictions?date=${formatDateParam(date)}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
      }
    } catch (err) {
      console.error("Date nav error:", err);
    } finally {
      setIsLoadingDate(false);
    }
  }, [initialMatches]);

  // Apply market filter
  const filteredMatches = useMemo(
    () => matches.filter((m) => matchesMarketFilter(m, marketFilter)),
    [matches, marketFilter]
  );

  // Top 20 picks: guarantee top leagues + fill with highest confidence
  const top20 = useMemo(() => {
    const withTips = filteredMatches.filter((m) => m.tip && m.tip.confidence > 0);

    // Separate: top league matches vs rest
    const topLeagueMatches = withTips
      .filter((m) => TOP_LEAGUE_IDS.has(m.league_id))
      .sort((a, b) => (b.tip?.confidence ?? 0) - (a.tip?.confidence ?? 0));
    const otherMatches = withTips
      .filter((m) => !TOP_LEAGUE_IDS.has(m.league_id))
      .sort((a, b) => (b.tip?.confidence ?? 0) - (a.tip?.confidence ?? 0));

    // Always include ALL top league matches (up to 20), fill rest by confidence
    const selected: MatchWithTip[] = [...topLeagueMatches];
    const selectedIds = new Set(selected.map((m) => m.id));
    for (const m of otherMatches) {
      if (selected.length >= 20) break;
      if (!selectedIds.has(m.id)) selected.push(m);
    }

    return selected.slice(0, 20);
  }, [filteredMatches]);

  const top20Ids = useMemo(() => new Set(top20.map((m) => m.id)), [top20]);

  // Remaining matches (VIP-locked)
  const remainingMatches = useMemo(
    () => filteredMatches.filter((m) => !top20Ids.has(m.id)),
    [filteredMatches, top20Ids]
  );

  // Filter state for remaining matches — default to ALL so users see everything
  const [filteredRemaining, setFilteredRemaining] = useState<MatchWithTip[]>([]);
  const [filterMode, setFilterMode] = useState<"popular" | "all" | "custom">("all");

  const initialFiltered = useMemo(
    () => remainingMatches.filter((m) => isPopularLeague(m.league_name, m.league_id) || TOP_LEAGUE_IDS.has(m.league_id)),
    [remainingMatches]
  );

  const displayedRemaining = filterMode === "all"
    ? remainingMatches
    : filteredRemaining.length > 0
    ? filteredRemaining
    : initialFiltered;

  const remainingGroups = useMemo(() => groupByCountryThenLeague(displayedRemaining), [displayedRemaining]);

  const handleFilterChange = useCallback(
    (filtered: Array<{ league_name: string }>, mode: "popular" | "all" | "custom") => {
      const leagueNames = new Set(filtered.map((f) => f.league_name));
      if (mode === "all") {
        setFilteredRemaining(remainingMatches);
      } else {
        setFilteredRemaining(remainingMatches.filter((m) => leagueNames.has(m.league_name)));
      }
      setFilterMode(mode);
    },
    [remainingMatches]
  );

  // Group top 20 by country → league
  const top20Groups = useMemo(() => groupByCountryThenLeague(top20), [top20]);

  return (
    <>
      {/* ── Date Navigation ── */}
      <div className="flex items-center justify-center gap-1 mb-4">
        <button
          onClick={() => navigateDate(addDays(selectedDate, -1))}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
          {[-2, -1, 0, 1, 2].map((offset) => {
            const d = addDays(new Date(), offset);
            const isSelected = d.toDateString() === selectedDate.toDateString();
            const dayIsToday = offset === 0;
            return (
              <button
                key={offset}
                onClick={() => navigateDate(d)}
                className={`flex flex-col items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-w-[52px] ${
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
        >
          <ChevronRight className="w-4 h-4" />
        </button>
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

      {/* ── Market Filter Tabs with Accuracy ── */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto scrollbar-hide pb-1">
        <Filter className="w-4 h-4 text-gray-400 shrink-0 mr-1" />
        {MARKET_TABS.map((tab) => {
          const acc = accuracy[tab.accuracyKey];
          return (
          <button
            key={tab.key}
            onClick={() => setMarketFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
              marketFilter === tab.key
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {isFr ? tab.labelFr : tab.labelEn}
            {acc > 0 && (
              <span className={`text-[10px] font-bold px-1 py-0.5 rounded ${
                marketFilter === tab.key
                  ? "bg-white/20 text-white"
                  : acc >= 60 ? "bg-emerald-100 text-emerald-700" : acc >= 45 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"
              }`}>
                {acc}%
              </span>
            )}
          </button>
          );
        })}
      </div>

      {/* Loading indicator for date navigation */}
      {isLoadingDate && (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-400">{isFr ? "Chargement..." : "Loading..."}</p>
        </div>
      )}

      {/* ── TOP 20 PICKS (FREE) ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isFr ? "Top 20 Meilleurs Picks" : "Top 20 Best Picks"}
            </h2>
            <p className="text-xs text-gray-500">
              {isFr
                ? "Les 20 pronostics avec la plus haute confiance IA"
                : "The 20 highest AI confidence predictions"}
            </p>
          </div>
        </div>

        {/* Table header (desktop) */}
        <div className="hidden sm:flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-t-lg text-xs font-medium text-gray-500 uppercase tracking-wider gap-2">
          <div className="w-14 text-center">{isFr ? "Heure" : "Time"}</div>
          <div className="flex-1 text-right">{isFr ? "Domicile" : "Home"}</div>
          <div className="w-16 text-center">Score</div>
          <div className="flex-1 text-left">{isFr ? "Extérieur" : "Away"}</div>
          <div className="w-10 text-center">Tip</div>
          <div className="w-20 text-center">Conf.</div>
          <div className="w-28 text-center">1 / X / 2</div>
          <div className="w-24 text-right">Best Pick</div>
          <div className="w-16 text-right">{isFr ? "Résultat" : "Result"}</div>
        </div>

        {/* Collapsible league sections for top 20 */}
        <div className="space-y-0">
          {top20Groups.map((group) => (
            <CollapsibleLeagueGroup
              key={group.key}
              group={group}
              locale={locale}
              defaultOpen={true}
            />
          ))}
        </div>
      </div>

      {/* ── ALL REMAINING PREDICTIONS ── */}
      {remainingMatches.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shadow-md">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isFr ? "Tous les Pronostics" : "All Predictions"}
              </h2>
              <p className="text-xs text-gray-500">
                {isFr
                  ? `${remainingMatches.length} pronostics supplémentaires`
                  : `${remainingMatches.length} more predictions`}
              </p>
            </div>
          </div>

          <LeagueFilterBar
            fixtures={remainingMatches}
            locale={locale}
            searchLocked={false}
            onFilteredFixtures={handleFilterChange}
          />

          <div className="space-y-0">
            {remainingGroups.map((group) => (
              <CollapsibleLeagueGroup
                key={group.key}
                group={group}
                locale={locale}
                defaultOpen={false}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
