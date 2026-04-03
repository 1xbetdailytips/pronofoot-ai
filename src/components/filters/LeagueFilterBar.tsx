"use client";

import { useState, useMemo, useCallback } from "react";
import PopularLeagueStrip from "./PopularLeagueStrip";
import SearchableLeagueDropdown from "./SearchableLeagueDropdown";
import { X } from "lucide-react";
import {
  isPopularLeague,
  getUniqueCountries,
  getCountryForLeague,
  POPULAR_LEAGUES,
} from "@/lib/league-country-map";

type FilterMode = "popular" | "all" | "custom";

type Props = {
  fixtures: Array<{ league_name: string }>;
  locale: string;
  searchLocked?: boolean;
  onFilteredFixtures: (filtered: Array<{ league_name: string }>, mode: FilterMode) => void;
  children?: React.ReactNode;
};

export default function LeagueFilterBar({
  fixtures,
  locale,
  searchLocked = false,
  onFilteredFixtures,
  children,
}: Props) {
  const isFr = locale === "fr";

  // State
  const [activePopularKeywords, setActivePopularKeywords] = useState<Set<string>>(new Set());
  const [selectedLeagues, setSelectedLeagues] = useState<Set<string>>(new Set());
  const [filterMode, setFilterMode] = useState<FilterMode>("popular");

  // Computed
  const countries = useMemo(() => getUniqueCountries(fixtures), [fixtures]);

  // Filter logic
  const applyFilter = useCallback(
    (mode: FilterMode, popKw: Set<string>, selLeagues: Set<string>) => {
      let filtered: Array<{ league_name: string }>;

      if (mode === "all") {
        filtered = fixtures;
      } else if (mode === "popular" && popKw.size === 0) {
        // Default: show popular leagues only
        filtered = fixtures.filter((f) => isPopularLeague(f.league_name));
      } else if (mode === "custom" && selLeagues.size > 0) {
        // Dropdown selection
        filtered = fixtures.filter((f) => selLeagues.has(f.league_name));
      } else if (popKw.size > 0) {
        // Specific popular league selected
        filtered = fixtures.filter((f) => {
          const lower = f.league_name.toLowerCase();
          return Array.from(popKw).some((kw) => lower.includes(kw));
        });
      } else {
        filtered = fixtures.filter((f) => isPopularLeague(f.league_name));
      }

      onFilteredFixtures(filtered, mode);
    },
    [fixtures, onFilteredFixtures]
  );

  // Handlers
  const handlePopularToggle = useCallback(
    (keywords: string[]) => {
      if (keywords.length === 0) {
        // "Popular" button clicked — reset to default
        setActivePopularKeywords(new Set());
        setSelectedLeagues(new Set());
        setFilterMode("popular");
        applyFilter("popular", new Set(), new Set());
        return;
      }

      if (keywords[0] === "__ALL__") {
        // "Show All" clicked
        setActivePopularKeywords(new Set(["__ALL__"]));
        setSelectedLeagues(new Set());
        setFilterMode("all");
        applyFilter("all", new Set(), new Set());
        return;
      }

      // Toggle specific popular league
      setFilterMode("custom");
      setSelectedLeagues(new Set());
      setActivePopularKeywords((prev) => {
        const next = new Set(prev);
        next.delete("__ALL__");
        const isActive = keywords.some((kw) => next.has(kw));
        if (isActive) {
          keywords.forEach((kw) => next.delete(kw));
        } else {
          keywords.forEach((kw) => next.add(kw));
        }
        // If nothing selected, go back to popular
        if (next.size === 0) {
          setFilterMode("popular");
          applyFilter("popular", new Set(), new Set());
          return new Set();
        }
        applyFilter("custom", next, new Set());
        return next;
      });
    },
    [applyFilter]
  );

  const handleLeagueSelect = useCallback(
    (leagueName: string) => {
      setFilterMode("custom");
      setActivePopularKeywords(new Set());
      setSelectedLeagues((prev) => {
        const next = new Set(prev);
        if (next.has(leagueName)) {
          next.delete(leagueName);
        } else {
          next.add(leagueName);
        }
        if (next.size === 0) {
          setFilterMode("popular");
          applyFilter("popular", new Set(), new Set());
          return new Set();
        }
        applyFilter("custom", new Set(), next);
        return next;
      });
    },
    [applyFilter]
  );

  const handleCountrySelect = useCallback(
    (country: string) => {
      const countryLeagues = countries
        .find((c) => c.country === country)
        ?.leagues.map((l) => l.leagueName) || [];

      setFilterMode("custom");
      setActivePopularKeywords(new Set());
      setSelectedLeagues((prev) => {
        // If all country leagues are already selected, deselect them
        const allSelected = countryLeagues.every((ln) => prev.has(ln));
        const next = new Set(prev);
        if (allSelected) {
          countryLeagues.forEach((ln) => next.delete(ln));
        } else {
          countryLeagues.forEach((ln) => next.add(ln));
        }
        if (next.size === 0) {
          setFilterMode("popular");
          applyFilter("popular", new Set(), new Set());
          return new Set();
        }
        applyFilter("custom", new Set(), next);
        return next;
      });
    },
    [countries, applyFilter]
  );

  const handleClear = useCallback(() => {
    setSelectedLeagues(new Set());
    setActivePopularKeywords(new Set());
    setFilterMode("popular");
    applyFilter("popular", new Set(), new Set());
  }, [applyFilter]);

  // Active filters display
  const activeFilters = useMemo(() => {
    if (filterMode === "all") return [{ label: isFr ? "Tous les matchs" : "All matches", key: "__all__" }];
    if (filterMode === "popular" && activePopularKeywords.size === 0) return [];

    const filters: { label: string; key: string }[] = [];

    // From popular keywords
    activePopularKeywords.forEach((kw) => {
      if (kw === "__ALL__") return;
      const league = POPULAR_LEAGUES.find((pl) => pl.keywords.includes(kw));
      if (league && !filters.some((f) => f.key === league.name)) {
        filters.push({ label: `${league.flag} ${league.shortName}`, key: league.name });
      }
    });

    // From dropdown selection
    selectedLeagues.forEach((ln) => {
      const info = getCountryForLeague(ln);
      filters.push({ label: `${info.flag} ${ln}`, key: ln });
    });

    return filters;
  }, [filterMode, activePopularKeywords, selectedLeagues, isFr]);

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-4 space-y-2">
      {/* Row 1: Popular strips + Search dropdown */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <PopularLeagueStrip
            activeLeagues={activePopularKeywords}
            onToggle={handlePopularToggle}
            locale={locale}
          />
        </div>
        <div className="shrink-0">
          <SearchableLeagueDropdown
            countries={countries}
            selectedLeagues={selectedLeagues}
            onSelectLeague={handleLeagueSelect}
            onSelectCountry={handleCountrySelect}
            onClear={handleClear}
            locale={locale}
            locked={searchLocked}
          />
        </div>
      </div>

      {/* Row 2: Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-gray-400 mr-1">
            {isFr ? "Filtres:" : "Filters:"}
          </span>
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium"
            >
              {f.label}
              <button
                onClick={() => {
                  if (f.key === "__all__") handleClear();
                  else if (selectedLeagues.has(f.key)) handleLeagueSelect(f.key);
                  else {
                    const league = POPULAR_LEAGUES.find((pl) => pl.name === f.key);
                    if (league) handlePopularToggle(league.keywords);
                  }
                }}
                className="hover:text-emerald-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            onClick={handleClear}
            className="text-xs text-gray-400 hover:text-red-500 ml-2 transition-colors"
          >
            {isFr ? "Effacer tout" : "Clear all"}
          </button>
        </div>
      )}

      {children}
    </div>
  );
}
