"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X, Lock } from "lucide-react";
import type { CountryGroup } from "@/lib/league-country-map";

type Props = {
  countries: CountryGroup[];
  selectedLeagues: Set<string>;
  onSelectLeague: (leagueName: string) => void;
  onSelectCountry: (country: string) => void;
  onClear: () => void;
  locale: string;
  locked?: boolean;
};

export default function SearchableLeagueDropdown({
  countries,
  selectedLeagues,
  onSelectLeague,
  onSelectCountry,
  onClear,
  locale,
  locked = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFr = locale === "fr";

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Focus input on open
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const filtered = search.trim()
    ? countries
        .map((c) => ({
          ...c,
          leagues: c.leagues.filter(
            (l) =>
              l.leagueName.toLowerCase().includes(search.toLowerCase()) ||
              c.country.toLowerCase().includes(search.toLowerCase())
          ),
        }))
        .filter((c) => c.leagues.length > 0)
    : countries;

  const selectedCount = selectedLeagues.size;

  if (locked) {
    return (
      <div className="relative">
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-300 bg-amber-50 text-amber-700 text-xs font-medium cursor-not-allowed"
          title={isFr ? "Recherche VIP uniquement" : "VIP search only"}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{isFr ? "Recherche VIP" : "VIP Search"}</span>
        </button>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
          open
            ? "border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-200"
            : selectedCount > 0
            ? "border-emerald-400 bg-emerald-50 text-emerald-700"
            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
        }`}
      >
        <Search className="w-3.5 h-3.5" />
        <span>
          {selectedCount > 0
            ? `${selectedCount} ${isFr ? "sélectionné(s)" : "selected"}`
            : isFr
            ? "Chercher pays / ligue..."
            : "Search country / league..."}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Clear button */}
      {selectedCount > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 w-72 sm:w-80 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isFr ? "Tapez pour chercher..." : "Type to search..."}
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="max-h-64 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                {isFr ? "Aucun résultat" : "No results"}
              </div>
            ) : (
              filtered.map((country) => (
                <div key={country.country}>
                  {/* Country header */}
                  <button
                    onClick={() => onSelectCountry(country.country)}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 transition-colors sticky top-0"
                  >
                    <span className="text-sm">{country.flag}</span>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      {country.country}
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {country.leagues.reduce((s, l) => s + l.count, 0)}
                    </span>
                  </button>
                  {/* Leagues */}
                  {country.leagues.map((league) => {
                    const isSelected = selectedLeagues.has(league.leagueName);
                    return (
                      <button
                        key={league.leagueName}
                        onClick={() => onSelectLeague(league.leagueName)}
                        className={`w-full flex items-center gap-2 px-4 pl-8 py-2 text-left transition-colors ${
                          isSelected
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? "bg-emerald-500" : "bg-gray-300"}`} />
                        <span className="text-xs font-medium truncate flex-1">
                          {league.leagueName}
                        </span>
                        <span className="text-xs text-gray-400">{league.count}</span>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
