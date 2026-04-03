import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

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
    <Image src={src} alt={alt} width={18} height={18} className="w-[18px] h-[18px] object-contain shrink-0" unoptimized />
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
            "w-1.5 h-1.5 rounded-full",
            r === "W" ? "bg-emerald-500" : r === "D" ? "bg-gray-400" : "bg-red-500"
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
    return { label: status === "HT" ? "HT" : "LIVE", isLive: true, score: `${homeScore ?? 0} - ${awayScore ?? 0}` };
  }
  if (finishedStatuses.includes(status)) {
    return { label: "FT", isLive: false, score: `${homeScore ?? 0} - ${awayScore ?? 0}` };
  }
  return null;
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
}: MatchCardProps) {
  const statusInfo = getStatusDisplay(status, homeScore, awayScore);
  const predLabel = getPredLabel(prediction, locale);

  const confColor = confidence !== null
    ? confidence >= 70 ? "text-emerald-600" : confidence >= 50 ? "text-amber-600" : "text-orange-600"
    : "text-gray-400";

  const confBg = confidence !== null
    ? confidence >= 70 ? "bg-emerald-500" : confidence >= 50 ? "bg-amber-500" : "bg-orange-500"
    : "bg-gray-300";

  const isDoubleChance = prediction === "dc_1x" || prediction === "dc_x2" || prediction === "dc_12";
  const predBg = !hasTip
    ? "bg-gray-100 text-gray-400"
    : isDoubleChance
      ? "bg-purple-100 text-purple-700"
      : prediction === "home_win"
        ? "bg-emerald-100 text-emerald-700"
        : prediction === "away_win"
          ? "bg-blue-100 text-blue-700"
          : "bg-amber-100 text-amber-700";

  return (
    <Link
      href={`/${locale}/predictions/${slug}`}
      className={cn(
        "block border-b border-gray-100 hover:bg-gray-50 transition-colors",
        !hasTip && "opacity-70"
      )}
    >
      {/* Desktop row */}
      <div className="hidden sm:flex items-center px-4 py-2.5 gap-2">
        {/* Time / Status */}
        <div className="w-14 text-center shrink-0">
          {statusInfo?.isLive ? (
            <span className="text-xs font-bold text-red-500 animate-pulse">{statusInfo.label}</span>
          ) : statusInfo ? (
            <span className="text-xs font-medium text-gray-400">{statusInfo.label}</span>
          ) : (
            <span className="text-xs font-medium text-gray-500">{kickoffTime}</span>
          )}
        </div>

        {/* Home team */}
        <div className="flex-1 flex items-center justify-end gap-1.5">
          <FormDots form={homeForm} />
          <span className={cn("text-sm truncate", (prediction === "home_win" || prediction === "dc_1x" || prediction === "dc_12") && hasTip ? "font-bold text-gray-900" : "text-gray-700")}>
            {homeTeam}
          </span>
          <TeamLogo src={homeTeamLogo} alt={homeTeam} />
        </div>

        {/* Score or VS + H2H */}
        <div className="w-16 text-center shrink-0">
          {statusInfo?.score ? (
            <span className={cn("text-sm font-bold", statusInfo.isLive ? "text-red-600" : "text-gray-900")}>
              {statusInfo.score}
            </span>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-300">vs</span>
              {h2hSummary && (
                <span className="text-[9px] text-gray-400 leading-tight" title="H2H record">{h2hSummary}</span>
              )}
            </div>
          )}
        </div>

        {/* Away team */}
        <div className="flex-1 flex items-center gap-1.5">
          <TeamLogo src={awayTeamLogo} alt={awayTeam} />
          <span className={cn("text-sm truncate", (prediction === "away_win" || prediction === "dc_x2" || prediction === "dc_12") && hasTip ? "font-bold text-gray-900" : "text-gray-700")}>
            {awayTeam}
          </span>
          <FormDots form={awayForm} />
        </div>

        {/* Prediction badge */}
        <div className="w-10 text-center shrink-0">
          <span className={cn("inline-block text-xs font-bold px-2 py-0.5 rounded", predBg)}>
            {predLabel}
          </span>
        </div>

        {/* Confidence */}
        <div className="w-20 shrink-0 flex items-center gap-1.5">
          {confidence !== null ? (
            <>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full", confBg)} style={{ width: `${confidence}%` }} />
              </div>
              <span className={cn("text-xs font-bold w-8 text-right", confColor)}>{confidence}%</span>
            </>
          ) : (
            <span className="text-xs text-gray-300 w-full text-center">--</span>
          )}
        </div>

        {/* Odds */}
        <div className="w-28 shrink-0 flex gap-1 text-center">
          {homeOdds && drawOdds && awayOdds ? (
            <>
              <span className={cn("flex-1 text-xs py-0.5 rounded", (prediction === "home_win" || prediction === "dc_1x" || prediction === "dc_12") ? "bg-emerald-100 text-emerald-700 font-bold" : "text-gray-500")}>
                {homeOdds.toFixed(2)}
              </span>
              <span className={cn("flex-1 text-xs py-0.5 rounded", (prediction === "draw" || prediction === "dc_1x" || prediction === "dc_x2") ? "bg-amber-100 text-amber-700 font-bold" : "text-gray-500")}>
                {drawOdds.toFixed(2)}
              </span>
              <span className={cn("flex-1 text-xs py-0.5 rounded", (prediction === "away_win" || prediction === "dc_x2" || prediction === "dc_12") ? "bg-blue-100 text-blue-700 font-bold" : "text-gray-500")}>
                {awayOdds.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="flex-1 text-xs text-gray-300">--</span>
          )}
        </div>

        {/* Best pick */}
        <div className="w-24 text-right shrink-0">
          {bestPick ? (
            <span className="text-xs text-emerald-600 font-medium truncate">{bestPick}</span>
          ) : (
            <span className="text-xs text-gray-300">--</span>
          )}
        </div>
      </div>

      {/* Mobile card */}
      <div className="sm:hidden px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {statusInfo?.isLive ? (
              <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded animate-pulse">{statusInfo.label}</span>
            ) : statusInfo ? (
              <span className="text-xs text-gray-400">{statusInfo.label}</span>
            ) : (
              <span className="text-xs text-gray-500">{kickoffTime}</span>
            )}
          </div>
          {hasTip && confidence !== null && (
            <span className={cn("text-xs font-bold", confColor)}>{confidence}%</span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5">
              <TeamLogo src={homeTeamLogo} alt={homeTeam} />
              <p className={cn("text-sm truncate", (prediction === "home_win" || prediction === "dc_1x" || prediction === "dc_12") && hasTip ? "font-bold" : "")}>{homeTeam}</p>
              <FormDots form={homeForm} />
            </div>
            <div className="flex items-center gap-1.5">
              <TeamLogo src={awayTeamLogo} alt={awayTeam} />
              <p className={cn("text-sm truncate", (prediction === "away_win" || prediction === "dc_x2" || prediction === "dc_12") && hasTip ? "font-bold" : "")}>{awayTeam}</p>
              <FormDots form={awayForm} />
            </div>
          </div>
          <div className="text-center px-3">
            {statusInfo?.score ? (
              <span className={cn("text-sm font-bold", statusInfo.isLive ? "text-red-600" : "")}>{statusInfo.score}</span>
            ) : (
              <span className={cn("text-xs font-bold px-2 py-1 rounded", predBg)}>{predLabel}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
