"use client";

import { useState, useMemo, useCallback } from "react";
import MatchCard from "./MatchCard";
import VipLockOverlay from "./VipLockOverlay";
import LeagueFilterBar from "@/components/filters/LeagueFilterBar";
import { Trophy } from "lucide-react";
import { isPopularLeague, getCountryForLeague } from "@/lib/league-country-map";
import { matchToCardProps } from "@/lib/data";
import type { MatchWithTip } from "@/lib/types";

type Props = {
  matches: MatchWithTip[];
  locale: string;
};

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

  // Remaining matches (VIP-locked search)
  const remainingMatches = useMemo(
    () => matches.filter((m) => !top20Ids.has(m.id)),
    [matches, top20Ids]
  );

  // Filter state for remaining matches
  const [filteredRemaining, setFilteredRemaining] = useState<MatchWithTip[]>([]);
  const [filterMode, setFilterMode] = useState<"popular" | "all" | "custom">("popular");

  // Initial filter: popular leagues from remaining
  const initialFiltered = useMemo(
    () => remainingMatches.filter((m) => isPopularLeague(m.league_name)),
    [remainingMatches]
  );

  const displayedRemaining = filteredRemaining.length > 0 || filterMode !== "popular"
    ? filteredRemaining
    : initialFiltered;

  const remainingGroups = useMemo(
    () => groupByCountryThenLeague(displayedRemaining),
    [displayedRemaining]
  );

  const handleFilterChange = useCallback(
    (filtered: Array<{ league_name: string }>, mode: "popular" | "all" | "custom") => {
      // Map back to MatchWithTip
      const leagueNames = new Set(filtered.map((f) => f.league_name));
      if (mode === "all") {
        setFilteredRemaining(remainingMatches);
      } else {
        setFilteredRemaining(
          remainingMatches.filter((m) => leagueNames.has(m.league_name))
        );
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
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-sm">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isFr ? "Top 20 Meilleurs Picks" : "Top 20 Best Picks"}
            </h2>
            <p className="text-xs text-gray-500">
              {isFr
                ? "Les 20 pronostics avec la plus haute confiance"
                : "The 20 highest confidence predictions"}
            </p>
          </div>
        </div>

        {/* Table header (desktop) */}
        <div className="hidden sm:flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg text-xs font-medium text-gray-500 uppercase tracking-wider gap-2">
          <div className="w-14 text-center">{isFr ? "Heure" : "Time"}</div>
          <div className="flex-1 text-right">{isFr ? "Domicile" : "Home"}</div>
          <div className="w-16 text-center">Score</div>
          <div className="flex-1 text-left">{isFr ? "Extérieur" : "Away"}</div>
          <div className="w-10 text-center">Tip</div>
          <div className="w-20 text-center">Conf.</div>
          <div className="w-28 text-center">1 / X / 2</div>
          <div className="w-24 text-right">Best Pick</div>
        </div>

        <div className="bg-white rounded-b-lg border border-t-0 border-gray-200 divide-y divide-gray-100">
          {top20Groups.map((group) => (
            <div key={group.key}>
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50/70 border-b border-gray-100">
                <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                  <span>{group.flag}</span>
                  {group.country !== group.leagueName && (
                    <span className="text-gray-400">{group.country} &rsaquo;</span>
                  )}
                  <span>{group.leagueName}</span>
                </h3>
                <span className="text-xs text-gray-400">{group.matches.length}</span>
              </div>
              {group.matches.map((match) => (
                <MatchCard key={match.id} {...matchToCardProps(match)} locale={locale} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── REMAINING MATCHES (VIP-LOCKED SEARCH) ── */}
      {remainingMatches.length > 0 && (
        <div className="mb-8">
          <LeagueFilterBar
            fixtures={remainingMatches}
            locale={locale}
            searchLocked={true}
            onFilteredFixtures={handleFilterChange}
          />

          <div className="relative">
            <VipLockOverlay locale={locale} matchCount={remainingMatches.length} />

            {/* Blurred preview of matches */}
            <div className="pointer-events-none select-none blur-[2px] opacity-50">
              <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
                {remainingGroups.slice(0, 4).map((group) => (
                  <div key={group.key}>
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50/70 border-b border-gray-100">
                      <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
                        <span>{group.flag}</span>
                        <span>{group.leagueName}</span>
                      </h3>
                      <span className="text-xs text-gray-400">{group.matches.length}</span>
                    </div>
                    {group.matches.slice(0, 3).map((match) => (
                      <MatchCard key={match.id} {...matchToCardProps(match)} locale={locale} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Helper: group matches by country → league ───────────────────────────────

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
      groups.set(key, {
        key,
        country: info.country,
        flag: info.flag,
        leagueName: m.league_name,
        matches: [],
      });
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
