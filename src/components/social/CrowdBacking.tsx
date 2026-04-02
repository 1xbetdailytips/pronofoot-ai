import { Users, TrendingUp, Flame } from "lucide-react";

type CrowdBackingProps = {
  homeProb: number;
  drawProb: number;
  awayProb: number;
  homeTeam: string;
  awayTeam: string;
  locale: string;
  compact?: boolean;
};

// Derive "crowd backing" from AI probabilities with natural-feeling variance
function deriveCrowdData(homeProb: number, drawProb: number, awayProb: number) {
  // Add slight randomization to make it feel like real user data (seeded by probs)
  const seed = Math.round(homeProb * 7 + drawProb * 3 + awayProb * 11) % 10;
  const jitter = [-3, 2, -1, 4, -2, 1, 3, -4, 2, -1][seed];

  let homeBacking = Math.round(homeProb + jitter);
  let drawBacking = Math.round(drawProb - jitter / 2);
  let awayBacking = 100 - homeBacking - drawBacking;

  // Clamp
  homeBacking = Math.max(5, Math.min(85, homeBacking));
  awayBacking = Math.max(5, Math.min(85, awayBacking));
  drawBacking = 100 - homeBacking - awayBacking;
  drawBacking = Math.max(5, drawBacking);

  // Normalize to 100
  const total = homeBacking + drawBacking + awayBacking;
  homeBacking = Math.round((homeBacking / total) * 100);
  drawBacking = Math.round((drawBacking / total) * 100);
  awayBacking = 100 - homeBacking - drawBacking;

  // Total "users" (simulated, seeded)
  const totalUsers = 120 + seed * 37 + Math.round(homeProb * 5);

  return { homeBacking, drawBacking, awayBacking, totalUsers };
}

export default function CrowdBacking({
  homeProb,
  drawProb,
  awayProb,
  homeTeam,
  awayTeam,
  locale,
  compact = false,
}: CrowdBackingProps) {
  const isFr = locale === "fr";
  const crowd = deriveCrowdData(homeProb, drawProb, awayProb);

  const maxBacking = Math.max(crowd.homeBacking, crowd.drawBacking, crowd.awayBacking);
  const popular = crowd.homeBacking === maxBacking ? homeTeam : crowd.awayBacking === maxBacking ? awayTeam : (isFr ? "Nul" : "Draw");

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-[10px] text-gray-500">
        <Users className="w-3 h-3" />
        <span>{crowd.totalUsers} {isFr ? "parieurs" : "bettors"}</span>
        <span className="text-gray-300">|</span>
        <span className="font-semibold text-gray-700">{maxBacking}%</span>
        <span>{isFr ? "soutiennent" : "back"} {popular}</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Users className="w-3.5 h-3.5 text-blue-500" />
          <span className="font-medium">
            {crowd.totalUsers} {isFr ? "parieurs" : "bettors"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
          <Flame className="w-3 h-3" />
          <span className="font-semibold">
            {isFr ? "Pari populaire:" : "Popular bet:"} {popular}
          </span>
        </div>
      </div>

      {/* Backing bars */}
      <div className="space-y-2">
        <BackingBar
          label={homeTeam}
          percentage={crowd.homeBacking}
          isMax={crowd.homeBacking === maxBacking}
          color="emerald"
        />
        <BackingBar
          label={isFr ? "Nul" : "Draw"}
          percentage={crowd.drawBacking}
          isMax={crowd.drawBacking === maxBacking}
          color="gray"
        />
        <BackingBar
          label={awayTeam}
          percentage={crowd.awayBacking}
          isMax={crowd.awayBacking === maxBacking}
          color="blue"
        />
      </div>

      {/* Trending indicator */}
      {maxBacking >= 60 && (
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-600">
          <TrendingUp className="w-3 h-3" />
          <span>
            {isFr
              ? `Tendance forte: ${maxBacking}% soutiennent ${popular}`
              : `Strong trend: ${maxBacking}% backing ${popular}`}
          </span>
        </div>
      )}
    </div>
  );
}

function BackingBar({
  label,
  percentage,
  isMax,
  color,
}: {
  label: string;
  percentage: number;
  isMax: boolean;
  color: "emerald" | "gray" | "blue";
}) {
  const colors = {
    emerald: isMax ? "bg-emerald-500" : "bg-emerald-200",
    gray: isMax ? "bg-gray-500" : "bg-gray-200",
    blue: isMax ? "bg-blue-500" : "bg-blue-200",
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-[11px] w-24 truncate ${isMax ? "font-bold text-gray-900" : "text-gray-500"}`}>
        {label}
      </span>
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className={`text-[11px] w-8 text-right ${isMax ? "font-bold text-gray-900" : "text-gray-400"}`}>
        {percentage}%
      </span>
    </div>
  );
}

// Compact version for the homepage "Most Popular Bet Today"
export function MostPopularBet({
  matches,
  locale,
}: {
  matches: Array<{
    homeTeam: string;
    awayTeam: string;
    homeProb: number;
    drawProb: number;
    awayProb: number;
    confidence: number;
    league: string;
  }>;
  locale: string;
}) {
  const isFr = locale === "fr";

  // Find the match with the strongest crowd consensus
  const best = (() => {
    if (!matches.length) return null;
    let maxConsensus = 0;
    let bestMatch = matches[0];

    for (const m of matches) {
      const max = Math.max(m.homeProb, m.drawProb, m.awayProb);
      if (max > maxConsensus) {
        maxConsensus = max;
        bestMatch = m;
      }
    }

    const crowd = deriveCrowdData(bestMatch.homeProb, bestMatch.drawProb, bestMatch.awayProb);
    const maxBacking = Math.max(crowd.homeBacking, crowd.drawBacking, crowd.awayBacking);
    const popular = crowd.homeBacking === maxBacking
      ? bestMatch.homeTeam
      : crowd.awayBacking === maxBacking
        ? bestMatch.awayTeam
        : (isFr ? "Nul" : "Draw");

    return { ...bestMatch, crowd, maxBacking, popular };
  })();

  if (!best) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
      <div className="flex items-center gap-1.5 bg-amber-100 rounded-full px-2.5 py-1">
        <Flame className="w-3.5 h-3.5 text-amber-600" />
        <span className="text-[10px] font-bold text-amber-700 uppercase">
          {isFr ? "Pari du Jour" : "Bet of the Day"}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-900 truncate">
          {best.homeTeam} vs {best.awayTeam}
        </p>
        <p className="text-[10px] text-gray-500">{best.league}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-amber-700">{best.maxBacking}%</p>
        <p className="text-[10px] text-gray-500">
          {isFr ? "soutiennent" : "back"} {best.popular}
        </p>
      </div>
    </div>
  );
}
