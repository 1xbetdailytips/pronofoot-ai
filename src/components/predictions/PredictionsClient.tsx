"use client";

import { useState, useMemo, useCallback } from "react";
import { Trophy, ChevronDown, ChevronRight, Lock, Sparkles } from "lucide-react";
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
    const info = getCountryForLeague(m.league_name);
    const key = `${info.country}__${m.league_name}`;
    if (!groups.has(key)) {
      groups.set(key, { key, country: info.country, flag: info.flag, leagueName: m.league_name, matches: [] });
    }
    groups.get(key)!.matches.push(m);
  }
  return Array.from(groups.values()).sort((a, b) => {
    const aInfo = getCountryForLeague(a.leagueName);
    const bInfo = getCountryForLeague(b.leagueName);
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

// ── VIP Lock Overlay ────────────────────────────────────────────────────────

function VipOverlay({ locale, matchCount }: { locale: string; matchCount: number }) {
  const isFr = locale === "fr";
  return (
    <div className="absolute inset-0 z-10 flex items-start justify-center pt-16">
      <div className="bg-white/95 backdrop-blur-sm border-2 border-amber-400 rounded-2xl px-8 py-6 shadow-2xl text-center max-w-sm mx-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Lock className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {isFr ? "Contenu VIP" : "VIP Content"}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {isFr
            ? `${matchCount}+ pronostics supplémentaires avec recherche avancée par ligue`
            : `${matchCount}+ additional predictions with advanced league search`}
        </p>
        <a
          href={`/${locale}/vip`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          {isFr ? "Débloquer VIP" : "Unlock VIP"}
        </a>
      </div>
    </div>
  );
}

// ── Main PredictionsClient ──────────────────────────────────────────────────

export default function PredictionsClient({ matches, locale }: Props) {
  const isFr = locale === "fr";

  // Top 20 highest confidence picks (free)
  const top20 = useMemo(() => {
    return [...matches]
      .filter((m) => m.tip && m.tip.confidence > 0)
      .sort((a, b) => (b.tip?.confidence ?? 0) - (a.tip?.confidence ?? 0))
      .slice(0, 20);
  }, [matches]);

  const top20Ids = useMemo(() => new Set(top20.map((m) => m.id)), [top20]);

  // Remaining matches (VIP-locked)
  const remainingMatches = useMemo(
    () => matches.filter((m) => !top20Ids.has(m.id)),
    [matches, top20Ids]
  );

  // Filter state for remaining matches
  const [filteredRemaining, setFilteredRemaining] = useState<MatchWithTip[]>([]);
  const [filterMode, setFilterMode] = useState<"popular" | "all" | "custom">("popular");

  const initialFiltered = useMemo(
    () => remainingMatches.filter((m) => isPopularLeague(m.league_name)),
    [remainingMatches]
  );

  const displayedRemaining = filteredRemaining.length > 0 || filterMode !== "popular"
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

      {/* ── REMAINING MATCHES (VIP-LOCKED SEARCH) ── */}
      {remainingMatches.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {isFr ? "Tous les Pronostics" : "All Predictions"}
              </h2>
              <p className="text-xs text-gray-500">
                {isFr
                  ? `${remainingMatches.length} pronostics supplémentaires — recherche VIP`
                  : `${remainingMatches.length} more predictions — VIP search`}
              </p>
            </div>
          </div>

          <LeagueFilterBar
            fixtures={remainingMatches}
            locale={locale}
            searchLocked={true}
            onFilteredFixtures={handleFilterChange}
          />

          <div className="relative min-h-[300px]">
            <VipOverlay locale={locale} matchCount={remainingMatches.length} />

            {/* Blurred preview — only show first few groups */}
            <div className="pointer-events-none select-none blur-[2px] opacity-50 space-y-0">
              {remainingGroups.slice(0, 5).map((group) => (
                <CollapsibleLeagueGroup
                  key={group.key}
                  group={{ ...group, matches: group.matches.slice(0, 3) }}
                  locale={locale}
                  defaultOpen={false}
                  blurred={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
