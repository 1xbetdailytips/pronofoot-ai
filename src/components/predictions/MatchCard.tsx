"use client";

import Link from "next/link";
import { Clock, TrendingUp, ChevronRight } from "lucide-react";
import AffiliateCTA from "@/components/ui/AffiliateCTA";
import { cn } from "@/lib/utils";

type MatchCardProps = {
  homeTeam: string;
  awayTeam: string;
  league: string;
  kickoffTime: string;
  prediction: string;
  confidence: number;
  homeOdds?: number;
  drawOdds?: number;
  awayOdds?: number;
  slug: string;
  locale: string;
};

export default function MatchCard({
  homeTeam,
  awayTeam,
  league,
  kickoffTime,
  prediction,
  confidence,
  homeOdds,
  drawOdds,
  awayOdds,
  slug,
  locale,
}: MatchCardProps) {
  // Get prediction label
  const predictionLabels: Record<string, Record<string, string>> = {
    home_win: { en: "Home Win", fr: "Victoire Domicile" },
    draw: { en: "Draw", fr: "Match Nul" },
    away_win: { en: "Away Win", fr: "Victoire Exterieur" },
    over_2_5: { en: "Over 2.5", fr: "Plus de 2.5" },
    under_2_5: { en: "Under 2.5", fr: "Moins de 2.5" },
    btts_yes: { en: "BTTS Yes", fr: "Les 2 Marquent" },
  };

  const predLabel =
    predictionLabels[prediction]?.[locale] || prediction;

  // Confidence bar color
  const confidenceColor =
    confidence >= 70
      ? "bg-emerald-500"
      : confidence >= 50
        ? "bg-yellow-500"
        : "bg-orange-500";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
      {/* League header */}
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {league}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          {kickoffTime}
        </span>
      </div>

      {/* Teams */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <p className="font-bold text-gray-900 text-lg">{homeTeam}</p>
            <p className="text-gray-400 text-sm">vs</p>
            <p className="font-bold text-gray-900 text-lg">{awayTeam}</p>
          </div>

          {/* Odds column */}
          {homeOdds && drawOdds && awayOdds && (
            <div className="flex gap-2 text-center">
              <div
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-mono",
                  prediction === "home_win"
                    ? "bg-emerald-100 text-emerald-700 font-bold"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                <div className="text-[10px] text-gray-400">1</div>
                {homeOdds.toFixed(2)}
              </div>
              <div
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-mono",
                  prediction === "draw"
                    ? "bg-emerald-100 text-emerald-700 font-bold"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                <div className="text-[10px] text-gray-400">X</div>
                {drawOdds.toFixed(2)}
              </div>
              <div
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-mono",
                  prediction === "away_win"
                    ? "bg-emerald-100 text-emerald-700 font-bold"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                <div className="text-[10px] text-gray-400">2</div>
                {awayOdds.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Prediction & Confidence */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              {predLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${confidenceColor}`}
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="text-xs font-bold text-gray-600">
              {confidence}%
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Link
            href={`/${locale}/predictions/${slug}`}
            className="text-sm text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1 group-hover:gap-2 transition-all"
          >
            {locale === "fr" ? "Voir l'analyse" : "View Analysis"}
            <ChevronRight className="w-4 h-4" />
          </Link>
          <AffiliateCTA
            text={locale === "fr" ? "Parier" : "Bet Now"}
            variant="secondary"
            campaign="match_card"
            className="text-xs px-3 py-1.5"
          />
        </div>
      </div>
    </div>
  );
}
