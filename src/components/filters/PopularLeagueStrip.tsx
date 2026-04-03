"use client";

import { useRef, useEffect } from "react";
import { POPULAR_LEAGUES } from "@/lib/league-country-map";

type Props = {
  activeLeagues: Set<string>;
  onToggle: (leagueKeywords: string[]) => void;
  locale: string;
};

export default function PopularLeagueStrip({ activeLeagues, onToggle, locale }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isFr = locale === "fr";

  // Auto-scroll to first active on mount
  useEffect(() => {
    const active = scrollRef.current?.querySelector("[data-active=true]");
    if (active) active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* "All" button */}
        <button
          onClick={() => onToggle([])}
          data-active={activeLeagues.size === 0}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
            activeLeagues.size === 0
              ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          {isFr ? "Populaires" : "Popular"}
        </button>

        {POPULAR_LEAGUES.map((league) => {
          const isActive = league.keywords.some((kw) => activeLeagues.has(kw));
          return (
            <button
              key={league.name}
              onClick={() => onToggle(league.keywords)}
              data-active={isActive}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border whitespace-nowrap ${
                isActive
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm scale-[1.02]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
              }`}
            >
              <span className="text-sm">{league.flag}</span>
              {league.shortName}
            </button>
          );
        })}

        {/* Show All button */}
        <button
          onClick={() => onToggle(["__ALL__"])}
          data-active={activeLeagues.has("__ALL__")}
          className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
            activeLeagues.has("__ALL__")
              ? "bg-gray-800 text-white border-gray-800 shadow-sm"
              : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          {isFr ? "Tout voir" : "Show All"}
        </button>
      </div>
      {/* Fade edges on mobile */}
      <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden" />
    </div>
  );
}
