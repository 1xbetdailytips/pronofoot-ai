"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { isBettableOn1xBet } from "@/lib/league-country-map";
import { siteConfig } from "@/lib/config";

type MatchCardProps = {
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo?: string | null;
  awayTeamLogo?: string | null;
  homeForm?: string[] | null;
  awayForm?: string[] | null;
  h2hSummary?: string | null;
  league: string;
  leagueId?: number;
  kickoffTime: string;
  status?: string;
  homeScore?: number | null;
  awayScore?: number | null;
  hasTip?: boolean;
  prediction: string | null;
  confidence: number | null;
  bestPick?: string | null;
  homeOdds?: number | null;
  drawOdds?: number | null;
  awayOdds?: number | null;
  slug: string;
  locale: string;
  riskLevel?: string | null;
};

function TeamLogo({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) return null;
  return (
    <Image src={src} alt={alt} width={20} height={20} className="w-5 h-5 object-contain shrink-0" unoptimized />
  );
}

function FormDots({ form }: { form?: string[] | null }) {
  if (!form || form.length === 0) return null;
  return (
    <div className="flex gap-0.5">
      {form.slice(-5).map((r, i) => (
        <span
          key={i}
          className={cn(
            "w-[6px] h-[6px] rounded-full",
            r === "W" ? "bg-emerald-500" : r === "D" ? "bg-gray-300 dark:bg-gray-600" : "bg-red-500"
          )}
          title={r === "W" ? "Win" : r === "D" ? "Draw" : "Loss"}
        />
      ))}
    </div>
  );
}

function getPredLabel(prediction: string | null, locale: string) {
  if (!prediction) return locale === "fr" ? "En attente" : "Pending";
  const labels: Record<string, Record<string, string>> = {
    home_win: { en: "1", fr: "1" },
    draw: { en: "X", fr: "X" },
    away_win: { en: "2", fr: "2" },
    dc_1x: { en: "1X", fr: "1X" },
    dc_x2: { en: "X2", fr: "X2" },
    dc_12: { en: "12", fr: "12" },
  };
  return labels[prediction]?.[locale] || prediction;
}

function getStatusDisplay(status: string | undefined, homeScore: number | null | undefined, awayScore: number | null | undefined) {
  if (!status) return null;
  const liveStatuses = ["1H", "2H", "HT", "ET", "BT", "P"];
  const finishedStatuses = ["FT", "AET", "PEN"];
  if (liveStatuses.includes(status)) {
    return { label: status === "HT" ? "HT" : "LIVE", isLive: true, isFinished: false, score: `${homeScore ?? 0} - ${awayScore ?? 0}` };
  }
  if (finishedStatuses.includes(status)) {
    return { label: "FT", isLive: false, isFinished: true, score: `${homeScore ?? 0} - ${awayScore ?? 0}` };
  }
  return null;
}

// Instant WIN/LOST calculation (same logic as livescore)
function computeResult(prediction: string | null, homeScore: number | null | undefined, awayScore: number | null | undefined): boolean | null {
  if (!prediction || homeScore == null || awayScore == null) return null;
  const h = homeScore;
  const a = awayScore;
  const actualResult = h > a ? "1" : h < a ? "2" : "X";
  // Map prediction keys to simple format
  const predMap: Record<string, string> = {
    home_win: "1", away_win: "2", draw: "X",
    dc_1x: "1X", dc_x2: "X2", dc_12: "12",
    "1": "1", "2": "2", "X": "X",
    "1X": "1X", "X2": "X2", "12": "12",
  };
  const pred = predMap[prediction] || prediction.toUpperCase();
  if (pred === "1X") return actualResult === "1" || actualResult === "X";
  if (pred === "X2") return actualResult === "X" || actualResult === "2";
  if (pred === "12") return actualResult === "1" || actualResult === "2";
  return actualResult === pred;
}

export default function MatchCard({
  homeTeam,
  awayTeam,
  homeTeamLogo,
  awayTeamLogo,
  homeForm,
  awayForm,
  h2hSummary,
  kickoffTime,
  status,
  homeScore,
  awayScore,
  hasTip = false,
  prediction,
  confidence,
  bestPick,
  homeOdds,
  drawOdds,
  awayOdds,
  slug,
  locale,
  leagueId,
}: MatchCardProps) {
  const bettable = leagueId ? isBettableOn1xBet(leagueId) : false;
  const statusInfo = getStatusDisplay(status, homeScore, awayScore);
  const predLabel = getPredLabel(prediction, locale);
  const resultStatus = statusInfo?.isFinished ? computeResult(prediction, homeScore, awayScore) : null;

  const confColor = confidence !== null
    ? confidence >= 70 ? "text-emerald-600 dark:text-emerald-400" : confidence >= 50 ? "text-amber-600 dark:text-amber-400" : "text-orange-600 dark:text-orange-400"
    : "text-gray-400";

  const confBg = confidence !== null
    ? confidence >= 70 ? "bg-emerald-500" : confidence >= 50 ? "bg-amber-500" : "bg-orange-500"
    : "bg-gray-300 dark:bg-gray-600";

  const isDoubleChance = prediction === "dc_1x" || prediction === "dc_x2" || prediction === "dc_12";
  const predBg = !hasTip
    ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
    : isDoubleChance
      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
      : prediction === "home_win"
        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
        : prediction === "away_win"
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
          : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";

  return (
    <Link
      href={`/${locale}/predictions/${slug}`}
      className={cn(
        "block border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-all duration-200",
        !hasTip && "opacity-60"
      )}
    >
      {/* Desktop row */}
      <div className="hidden sm:flex items-center px-4 py-3 gap-2">
        {/* Time / Status */}
        <div className="w-14 text-center shrink-0">
          {statusInfo?.isLive ? (
            <span className="text-xs font-bold text-red-500 animate-pulse">{statusInfo.label}</span>
          ) : statusInfo ? (
            <span className="text-xs font-medium text-gray-400">{statusInfo.label}</span>
          ) : (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 tabular-nums">{kickoffTime}</span>
          )}
        </div>

        {/* Home team */}
        <div className="flex-1 flex items-center justify-end gap-2">
          <FormDots form={homeForm} />
          <span className={cn("text-sm truncate", (prediction === "home_win" || prediction === "dc_1x" || prediction === "dc_12") && hasTip ? "font-bold text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300")}>
            {homeTeam}
          </span>
          <TeamLogo src={homeTeamLogo} alt={homeTeam} />
        </div>

        {/* Score or VS + H2H */}
        <div className="w-16 text-center shrink-0">
          {statusInfo?.score ? (
            <span className={cn("text-sm font-extrabold tabular-nums", statusInfo.isLive ? "text-red-600" : "text-gray-900 dark:text-white")}>
              {statusInfo.score}
            </span>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-300 dark:text-gray-600">vs</span>
              {h2hSummary && (
                <span className="text-[9px] text-gray-400 dark:text-gray-500 leading-tight" title="H2H record">{h2hSummary}</span>
              )}
            </div>
          )}
        </div>

        {/* Away team */}
        <div className="flex-1 flex items-center gap-2">
          <TeamLogo src={awayTeamLogo} alt={awayTeam} />
          <span className={cn("text-sm truncate", (prediction === "away_win" || prediction === "dc_x2" || prediction === "dc_12") && hasTip ? "font-bold text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300")}>
            {awayTeam}
          </span>
          <FormDots form={awayForm} />
        </div>

        {/* Prediction badge */}
        <div className="w-11 text-center shrink-0">
          <span className={cn("inline-block text-xs font-bold px-2 py-0.5 rounded-md", predBg)}>
            {predLabel}
          </span>
        </div>

        {/* Confidence */}
        <div className="w-20 shrink-0 flex items-center gap-1.5">
          {confidence !== null ? (
            <>
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", confBg)} style={{ width: `${confidence}%` }} />
              </div>
              <span className={cn("text-xs font-bold w-8 text-right tabular-nums", confColor)}>{confidence}%</span>
            </>
          ) : (
            <span className="text-xs text-gray-300 dark:text-gray-600 w-full text-center">--</span>
          )}
        </div>

        {/* Odds */}
        <div className="w-28 shrink-0 flex gap-1 text-center">
          {homeOdds && drawOdds && awayOdds ? (
            <>
              <span className={cn("flex-1 text-xs py-0.5 rounded-md tabular-nums", (prediction === "home_win" || prediction === "dc_1x" || prediction === "dc_12") ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold" : "text-gray-500 dark:text-gray-400")}>
                {homeOdds.toFixed(2)}
              </span>
              <span className={cn("flex-1 text-xs py-0.5 rounded-md tabular-nums", (prediction === "draw" || prediction === "dc_1x" || prediction === "dc_x2") ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 font-bold" : "text-gray-500 dark:text-gray-400")}>
                {drawOdds.toFixed(2)}
              </span>
              <span className={cn("flex-1 text-xs py-0.5 rounded-md tabular-nums", (prediction === "away_win" || prediction === "dc_x2" || prediction === "dc_12") ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-bold" : "text-gray-500 dark:text-gray-400")}>
                {awayOdds.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="flex-1 text-xs text-gray-300 dark:text-gray-600">--</span>
          )}
        </div>

        {/* Best pick */}
        <div className="w-24 text-right shrink-0">
          {bestPick ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold truncate">{bestPick}</span>
          ) : (
            <span className="text-xs text-gray-300 dark:text-gray-600">--</span>
          )}
        </div>

        {/* WIN/LOST badge + 1xBet */}
        <div className="w-16 text-right shrink-0">
          {resultStatus === true && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">WIN ✓</span>
          )}
          {resultStatus === false && (
            <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-md">LOST ✗</span>
          )}
          {statusInfo?.isLive && hasTip && (
            <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-md animate-pulse">LIVE</span>
          )}
          {bettable && !statusInfo?.isFinished && !statusInfo?.isLive && (
            <a
              href={`${siteConfig.affiliateLink}?utm_campaign=predictions_match`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[10px] font-bold text-white bg-[#1a5276] hover:bg-[#1a3a5c] px-2 py-0.5 rounded-md transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              1xBet
            </a>
          )}
        </div>
      </div>

      {/* Mobile card */}
      <div className="sm:hidden px-4 py-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            {statusInfo?.isLive ? (
              <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-md animate-pulse">{statusInfo.label}</span>
            ) : statusInfo ? (
              <span className="text-xs text-gray-400">{statusInfo.label}</span>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">{kickoffTime}</span>
            )}
          </div>
          {hasTip && confidence !== null && (
            <span className={cn("text-xs font-bold tabular-nums", confColor)}>{confidence}%</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <TeamLogo src={homeTeamLogo} alt={homeTeam} />
              <p className={cn("text-sm truncate", (prediction === "home_win" || prediction === "dc_1x" || prediction === "dc_12") && hasTip ? "font-bold" : "")}>{homeTeam}</p>
              <FormDots form={homeForm} />
            </div>
            <div className="flex items-center gap-2">
              <TeamLogo src={awayTeamLogo} alt={awayTeam} />
              <p className={cn("text-sm truncate", (prediction === "away_win" || prediction === "dc_x2" || prediction === "dc_12") && hasTip ? "font-bold" : "")}>{awayTeam}</p>
              <FormDots form={awayForm} />
            </div>
          </div>
          <div className="text-center px-3">
            {statusInfo?.score ? (
              <div className="flex flex-col items-center gap-1">
                <span className={cn("text-base font-extrabold tabular-nums", statusInfo.isLive ? "text-red-600" : "")}>{statusInfo.score}</span>
                {resultStatus === true && (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-md">WIN ✓</span>
                )}
                {resultStatus === false && (
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded-md">LOST ✗</span>
                )}
              </div>
            ) : (
              <span className={cn("text-xs font-bold px-2.5 py-1 rounded-md", predBg)}>{predLabel}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
