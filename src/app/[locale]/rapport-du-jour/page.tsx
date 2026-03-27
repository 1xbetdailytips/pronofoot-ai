import { getTranslations } from "next-intl/server";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import {
  FileText,
  Target,
  Shield,
  TrendingUp,
  Layers,
  Flame,
  Clock,
  AlertCircle,
  Zap,
  Send,
} from "lucide-react";
import AffiliateCTA from "@/components/ui/AffiliateCTA";
import type { Tip, Fixture } from "@/lib/types";

// ─── Types ───────────────────────────────────────────────────────────────────
type TipWithFixture = Tip & { fixtures: Fixture };

type ReportData = {
  bestValue: TipWithFixture;
  safest: TipWithFixture;
  underdog: TipWithFixture;
  highOdds: TipWithFixture;
  accumulator: {
    picks: TipWithFixture[];
    totalOdds: number;
    confidence: number;
  };
  totalTips: number;
} | null;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getBestPickLabel(pick: string | null, isFr: boolean): string {
  if (!pick) return "";
  const labels: Record<string, { fr: string; en: string }> = {
    "1": { fr: "Victoire Domicile (1)", en: "Home Win (1)" },
    X: { fr: "Match Nul (X)", en: "Draw (X)" },
    "2": { fr: "Victoire Extérieur (2)", en: "Away Win (2)" },
    over_2_5: { fr: "Plus de 2.5 Buts", en: "Over 2.5 Goals" },
    under_2_5: { fr: "Moins de 2.5 Buts", en: "Under 2.5 Goals" },
    btts: { fr: "Les 2 Équipes Marquent", en: "Both Teams Score" },
    no_btts: { fr: "Clean Sheet Attendu", en: "Clean Sheet Expected" },
  };
  return labels[pick]?.[isFr ? "fr" : "en"] ?? pick;
}

function getPickFromTip(tip: TipWithFixture, isFr: boolean): string {
  // Prefer best_pick if set, otherwise fall back to prediction
  if (tip.best_pick) return getBestPickLabel(tip.best_pick, isFr);
  const map: Record<string, { fr: string; en: string }> = {
    "1": { fr: "Victoire Domicile (1)", en: "Home Win (1)" },
    X: { fr: "Match Nul (X)", en: "Draw (X)" },
    "2": { fr: "Victoire Extérieur (2)", en: "Away Win (2)" },
  };
  return map[tip.prediction]?.[isFr ? "fr" : "en"] ?? tip.prediction;
}

function getMatchLabel(tip: TipWithFixture): string {
  return `${tip.fixtures.home_team} vs ${tip.fixtures.away_team}`;
}

// ─── Data Fetching ────────────────────────────────────────────────────────────
async function getReportData(): Promise<ReportData> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("tips")
      .select(`*, fixtures!inner(*)`)
      .eq("is_vip", false)
      .gte("fixtures.match_date", today)
      .lt("fixtures.match_date", tomorrow)
      .order("confidence", { ascending: false });

    if (error || !data || data.length === 0) return null;

    const tips = data as TipWithFixture[];

    // Safest: highest confidence
    const safest = tips[0];

    // Best value: highest (odds × confidence) score
    const byValue = [...tips].sort(
      (a, b) => b.odds * b.confidence - a.odds * a.confidence
    );
    const bestValue = byValue[0];

    // Underdog: highest odds (preferably confidence < 55)
    const underdogs = tips
      .filter((t) => t.confidence < 55)
      .sort((a, b) => b.odds - a.odds);
    const byOdds = [...tips].sort((a, b) => b.odds - a.odds);
    const underdog = underdogs[0] ?? byOdds[0];

    // High odds: different from underdog, highest odds
    const highOddsCandidate = byOdds.find((t) => t.id !== underdog.id);
    const highOdds = highOddsCandidate ?? byOdds[0];

    // Accumulator: top 4 by confidence
    const accuPicks = tips.slice(0, Math.min(4, tips.length));
    const totalOdds = accuPicks.reduce((acc, t) => acc * t.odds, 1);
    const accuConfidence = Math.round(
      accuPicks.reduce((acc, t) => acc * (t.confidence / 100), 1) * 100
    );

    return {
      safest,
      bestValue,
      underdog,
      highOdds,
      accumulator: { picks: accuPicks, totalOdds, confidence: accuConfidence },
      totalTips: tips.length,
    };
  } catch {
    return null;
  }
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const isFr = params.locale === "fr";
  const today = new Date().toLocaleDateString(isFr ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return {
    title: isFr
      ? `Rapport IA Paris Sportifs — ${today}`
      : `AI Betting Report — ${today}`,
    description: isFr
      ? "Rapport quotidien de paris sportifs par IA. Meilleur pari value, pari le plus sûr, meilleur outsider et combiné du jour."
      : "Daily AI betting report. Best value bet, safest bet, best underdog and accumulator of the day.",
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function DailyReportPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("report");
  const tc = await getTranslations("common");
  const locale = params.locale;
  const isFr = locale === "fr";

  const today = new Date().toLocaleDateString(isFr ? "fr-FR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const report = await getReportData();

  // ── Empty state ──────────────────────────────────────────────────────────
  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 mb-6">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-semibold">{today}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t("title")}</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 inline-block">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <p className="text-amber-800 font-semibold text-lg mb-1">
            {isFr ? "Rapport en cours de génération" : "Report being generated"}
          </p>
          <p className="text-amber-600 text-sm">
            {isFr
              ? "Notre IA analyse les matchs du jour. Revenez après 08h00."
              : "Our AI is analysing today's matches. Check back after 08:00."}
          </p>
        </div>
      </div>
    );
  }

  // ── Pick sections ─────────────────────────────────────────────────────────
  const sections = [
    {
      icon: Target,
      title: t("bestValue"),
      color: "emerald",
      tip: report.bestValue,
    },
    {
      icon: Shield,
      title: t("safest"),
      color: "blue",
      tip: report.safest,
    },
    {
      icon: TrendingUp,
      title: t("underdog"),
      color: "purple",
      tip: report.underdog,
    },
    {
      icon: Flame,
      title: t("highOdds"),
      color: "orange",
      tip: report.highOdds,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 mb-4">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-semibold">{today}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {t("title")}
        </h1>
        <p className="text-gray-500">{t("subtitle")}</p>
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {t("lastUpdated")}: 08:00{" "}
            {isFr ? "heure de Douala" : "Douala time"}
          </div>
          <span className="text-xs text-gray-300">•</span>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <Zap className="w-3 h-3" />
            {report.totalTips}{" "}
            {isFr ? "matchs analysés aujourd'hui" : "matches analysed today"}
          </div>
        </div>
      </div>

      {/* Individual Picks */}
      <div className="space-y-6 mb-10">
        {sections.map(({ icon: Icon, title, color, tip }) => (
          <div
            key={title}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all"
          >
            <div
              className={`px-5 py-3 border-b flex items-center gap-2 bg-${color}-50`}
            >
              <Icon className={`w-5 h-5 text-${color}-600`} />
              <h2 className={`font-bold text-${color}-900`}>{title}</h2>
            </div>
            <div className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold text-gray-900 text-lg">
                    {getMatchLabel(tip)}
                  </p>
                  <p className="text-xs text-gray-400 mb-0.5">
                    {tip.fixtures.league_name}
                  </p>
                  <p className="text-emerald-600 font-semibold">
                    {getPickFromTip(tip, isFr)}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-gray-500">
                    {isFr ? "Cote" : "Odds"}:{" "}
                    <strong className="text-gray-900">
                      {tip.odds.toFixed(2)}
                    </strong>
                  </span>
                  <span
                    className={`text-sm font-bold px-2.5 py-1 rounded-full ${
                      tip.confidence >= 70
                        ? "bg-emerald-100 text-emerald-700"
                        : tip.confidence >= 50
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {tip.confidence}%
                  </span>
                </div>
              </div>

              {/* AI Analysis */}
              {tip.ai_analysis ? (
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {tip.ai_analysis}
                </p>
              ) : (
                <p className="text-gray-500 text-sm mb-4 italic">
                  {isFr
                    ? `Probabilités: Dom. ${tip.home_prob}% — Nul ${tip.draw_prob}% — Ext. ${tip.away_prob}%`
                    : `Probabilities: Home ${tip.home_prob}% — Draw ${tip.draw_prob}% — Away ${tip.away_prob}%`}
                </p>
              )}

              {/* Over/BTTS pills */}
              {(tip.over25_prob !== null || tip.btts_prob !== null) && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tip.over25_prob !== null && (
                    <span className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium">
                      Over 2.5: {tip.over25_prob}%
                    </span>
                  )}
                  {tip.btts_prob !== null && (
                    <span className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full font-medium">
                      BTTS: {tip.btts_prob}%
                    </span>
                  )}
                </div>
              )}

              <AffiliateCTA
                text={tc("placeBet")}
                variant="secondary"
                campaign={`report_${title.toLowerCase().replace(/\s/g, "_")}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Accumulator of the Day */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-6 mb-10 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-6 h-6 text-emerald-200" />
          <h2 className="text-xl font-bold">{t("accumulator")}</h2>
          <span className="ml-auto text-xs bg-white/15 text-emerald-100 px-2 py-0.5 rounded-full">
            {isFr ? "Confiance" : "Confidence"}: {report.accumulator.confidence}%
          </span>
        </div>
        <div className="space-y-2 mb-4">
          {report.accumulator.picks.map((tip, i) => (
            <div
              key={tip.id}
              className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2"
            >
              <span className="w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <span className="text-sm truncate block">
                  {getMatchLabel(tip)}
                </span>
                <span className="text-xs text-emerald-200">
                  {getPickFromTip(tip, isFr)}
                </span>
              </div>
              <span className="text-xs text-emerald-200 shrink-0">
                @{tip.odds.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div>
            <p className="text-emerald-200 text-sm">{t("totalOdds")}</p>
            <p className="text-3xl font-bold">
              {report.accumulator.totalOdds.toFixed(2)}
            </p>
          </div>
          <AffiliateCTA
            text={tc("openSlip")}
            variant="banner"
            campaign="report_accumulator"
          />
        </div>
      </div>

      {/* Telegram channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <a
          href="https://t.me/pronofootai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-3.5 transition-colors"
        >
          <Send className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">
              {isFr ? "Tips gratuits quotidiens" : "Daily free tips"}
            </p>
            <p className="text-blue-200 text-xs">@pronofootai</p>
          </div>
          <span className="ml-auto">→</span>
        </a>
        <a
          href="https://t.me/pronofootaivip"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl px-5 py-3.5 transition-colors"
        >
          <Zap className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">
              {isFr ? "Analyses VIP complètes" : "Full VIP analysis"}
            </p>
            <p className="text-amber-100 text-xs">@pronofootaivip</p>
          </div>
          <span className="ml-auto">→</span>
        </a>
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <p className="text-gray-500 text-sm mb-4">
          {isFr
            ? "Tous les pronostics sont générés par notre IA et analysés chaque matin à 8h."
            : "All predictions are generated by our AI and analysed every morning at 8AM."}
        </p>
        <AffiliateCTA
          text={tc("betNow")}
          variant="primary"
          campaign="report_bottom"
        />
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: isFr
              ? `Rapport IA Paris Sportifs — ${today}`
              : `AI Betting Report — ${today}`,
            datePublished: new Date().toISOString(),
            dateModified: new Date().toISOString(),
            author: { "@type": "Organization", name: "PronoFoot AI" },
            publisher: {
              "@type": "Organization",
              name: "PronoFoot AI",
              url: "https://parifoot.online",
            },
          }),
        }}
      />
    </div>
  );
}
