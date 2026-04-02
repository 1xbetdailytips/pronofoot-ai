import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  BarChart3,
  Users,
  Target,
  ChevronRight,
  Zap,
} from "lucide-react";
import AffiliateCTA from "@/components/ui/AffiliateCTA";
import CrowdBacking from "@/components/social/CrowdBacking";
import { siteConfig } from "@/lib/config";
import { getMatchBySlug, mapPrediction, mapRiskLevel } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const match = await getMatchBySlug(params.slug);
  if (!match) return { title: "Match Not Found" };

  const isFr = params.locale === "fr";
  const title = isFr
    ? `${match.home_team} vs ${match.away_team} Pronostic - ${match.league_name}`
    : `${match.home_team} vs ${match.away_team} Prediction - ${match.league_name}`;
  const confidence = match.tip ? `${Math.round(match.tip.confidence)}%` : "";
  const desc = isFr
    ? `Pronostic IA pour ${match.home_team} vs ${match.away_team}. Confiance: ${confidence}. Analyse complete et cotes.`
    : `AI prediction for ${match.home_team} vs ${match.away_team}. Confidence: ${confidence}. Full analysis and odds.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `/${params.locale}/predictions/${params.slug}`,
      languages: {
        fr: `/fr/predictions/${params.slug}`,
        en: `/en/predictions/${params.slug}`,
        "x-default": `/fr/predictions/${params.slug}`,
      },
    },
    openGraph: {
      title,
      description: desc,
      type: "article",
      url: `${siteConfig.url}/${params.locale}/predictions/${params.slug}`,
    },
  };
}

// Map best_pick string to localised display label
function getBestPickLabel(bestPick: string | null, isFr: boolean): string {
  if (!bestPick) return "-";
  const labels: Record<string, { fr: string; en: string }> = {
    "Home Win":   { fr: "Victoire Domicile", en: "Home Win" },
    "Draw":       { fr: "Match Nul",          en: "Draw" },
    "Away Win":   { fr: "Victoire Exterieur", en: "Away Win" },
    "Over 2.5":   { fr: "Plus de 2.5 Buts",  en: "Over 2.5 Goals" },
    "Under 2.5":  { fr: "Moins de 2.5 Buts", en: "Under 2.5 Goals" },
    "BTTS Yes":   { fr: "Les 2 Equipes Marquent", en: "Both Teams Score" },
  };
  return labels[bestPick]?.[isFr ? "fr" : "en"] ?? bestPick;
}

// Probability bar component (inline to avoid extra file)
function ProbBar({ label, prob, color }: { label: string; prob: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span className="font-semibold text-gray-700">{prob}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${Math.min(prob, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default async function MatchDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const match = await getMatchBySlug(params.slug);
  if (!match) notFound();

  const locale = params.locale;
  const isFr = locale === "fr";
  const tip = match.tip;

  const kickoff = new Date(match.match_date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Douala",
  });
  const matchDateStr = new Date(match.match_date).toLocaleDateString(
    isFr ? "fr-FR" : "en-GB",
    { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Douala" }
  );

  const prediction = tip ? mapPrediction(tip.prediction) : null;
  const riskLevel  = tip ? mapRiskLevel(tip.risk_level) : null;
  const bestPickLabel = getBestPickLabel(tip?.best_pick ?? null, isFr);

  const predictionLabels: Record<string, Record<string, string>> = {
    home_win: { en: "Home Win", fr: "Victoire Domicile" },
    draw:     { en: "Draw",     fr: "Match Nul" },
    away_win: { en: "Away Win", fr: "Victoire Exterieur" },
  };
  const predLabel = prediction
    ? predictionLabels[prediction]?.[locale] ?? prediction
    : "-";

  // Odds from probabilities
  const homeOdds = tip ? Math.max(1.05, 100 / tip.home_prob).toFixed(2) : "-";
  const drawOdds = tip ? Math.max(1.05, 100 / tip.draw_prob).toFixed(2) : "-";
  const awayOdds = tip ? Math.max(1.05, 100 / tip.away_prob).toFixed(2) : "-";

  const homeForm = Array.isArray(match.home_form) ? match.home_form : [];
  const awayForm = Array.isArray(match.away_form) ? match.away_form : [];
  const h2h = match.h2h_data ?? null;

  const riskColors: Record<string, string> = {
    safe:    "bg-green-50 text-green-700",
    medium:  "bg-yellow-50 text-yellow-700",
    high:    "bg-orange-50 text-orange-700",
    extreme: "bg-red-50 text-red-700",
  };
  const riskLabels: Record<string, Record<string, string>> = {
    safe:    { fr: "Faible",   en: "Low" },
    medium:  { fr: "Moyen",    en: "Medium" },
    high:    { fr: "Eleve",    en: "High" },
    extreme: { fr: "Extreme",  en: "Extreme" },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link
          href={`/${locale}/predictions`}
          className="flex items-center gap-1 hover:text-emerald-600"
        >
          <ArrowLeft className="w-4 h-4" />
          {isFr ? "Pronostics" : "Predictions"}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-medium">
          {match.home_team} vs {match.away_team}
        </span>
      </div>

      {/* SEO H1 — visually integrated but semantic */}
      <h1 className="sr-only">{match.home_team} vs {match.away_team} — {isFr ? "Pronostic" : "Prediction"} {match.league_name}</h1>

      {/* Match Header */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3">
          <div className="flex items-center justify-between text-white">
            <span className="text-sm font-medium">{match.league_name}</span>
            <span className="flex items-center gap-1 text-sm">
              <Clock className="w-4 h-4" />
              {matchDateStr} | {kickoff}
            </span>
          </div>
        </div>

        <div className="px-6 py-8">
          {/* Teams */}
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-gray-400">
                {match.home_team.charAt(0)}
              </div>
              <p className="text-xl font-bold text-gray-900">{match.home_team}</p>
              <p className="text-sm text-gray-500">{isFr ? "Domicile" : "Home"}</p>
            </div>

            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-600">VS</p>
              <p className="text-sm text-gray-400 mt-1">{kickoff}</p>
            </div>

            <div className="text-center flex-1">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-gray-400">
                {match.away_team.charAt(0)}
              </div>
              <p className="text-xl font-bold text-gray-900">{match.away_team}</p>
              <p className="text-sm text-gray-500">{isFr ? "Exterieur" : "Away"}</p>
            </div>
          </div>

          {/* Odds Row */}
          {tip && (
            <div className="flex justify-center gap-4 mb-6">
              {[
                { label: "1", odds: homeOdds, active: prediction === "home_win" },
                { label: "X", odds: drawOdds, active: prediction === "draw" },
                { label: "2", odds: awayOdds, active: prediction === "away_win" },
              ].map(({ label, odds, active }) => (
                <div
                  key={label}
                  className={`px-6 py-3 rounded-xl text-center ${
                    active
                      ? "bg-emerald-100 border-2 border-emerald-500"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className={`text-lg font-bold font-mono ${active ? "text-emerald-700" : "text-gray-700"}`}>
                    {odds}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <AffiliateCTA
              text={isFr ? "Parier ce Match sur 1xBet" : "Bet This Match on 1xBet"}
              variant="primary"
              campaign="match_detail"
            />
          </div>
        </div>
      </div>

      {/* AI Prediction Card */}
      {tip && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900">
              {isFr ? "Pronostic IA" : "AI Prediction"}
            </h3>
          </div>
          <div className="p-6">
            {/* Best pick highlight */}
            {tip.best_pick && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
                <Zap className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">
                    {isFr ? "Meilleur Pari" : "Best Pick"}
                  </p>
                  <p className="text-lg font-bold text-emerald-800">{bestPickLabel}</p>
                </div>
                <span className="ml-auto text-sm font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  {tip.confidence}%
                </span>
              </div>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">{isFr ? "Pronostic 1X2" : "1X2 Prediction"}</p>
                <p className="text-lg font-bold text-gray-900">{predLabel}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">{isFr ? "Confiance" : "Confidence"}</p>
                <p className="text-lg font-bold text-blue-700">{Math.round(tip.confidence)}%</p>
              </div>
              <div className={`rounded-xl p-4 text-center ${riskColors[riskLevel ?? "medium"]}`}>
                <p className="text-xs text-gray-500 mb-1">{isFr ? "Risque" : "Risk"}</p>
                <p className="text-lg font-bold">{riskLabels[riskLevel ?? "medium"]?.[locale] ?? riskLevel}</p>
              </div>
            </div>

            {/* 1X2 Probability Bar */}
            <div className="mb-5">
              <p className="text-xs text-gray-500 mb-2">
                {isFr ? "Probabilités 1X2" : "1X2 Probabilities"}
              </p>
              <div className="flex rounded-full overflow-hidden h-4">
                <div
                  style={{ width: `${tip.home_prob}%` }}
                  className="bg-emerald-500 flex items-center justify-center text-white text-xs font-bold"
                >
                  {tip.home_prob > 15 ? `${Math.round(tip.home_prob)}%` : ""}
                </div>
                <div
                  style={{ width: `${tip.draw_prob}%` }}
                  className="bg-gray-400 flex items-center justify-center text-white text-xs font-bold"
                >
                  {tip.draw_prob > 15 ? `${Math.round(tip.draw_prob)}%` : ""}
                </div>
                <div
                  style={{ width: `${tip.away_prob}%` }}
                  className="bg-blue-500 flex items-center justify-center text-white text-xs font-bold"
                >
                  {tip.away_prob > 15 ? `${Math.round(tip.away_prob)}%` : ""}
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{match.home_team}</span>
                <span>{isFr ? "Nul" : "Draw"}</span>
                <span>{match.away_team}</span>
              </div>
            </div>

            {/* Over 2.5 and BTTS bars */}
            {(tip.over25_prob != null || tip.btts_prob != null) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                {tip.over25_prob != null && (
                  <ProbBar
                    label={isFr ? "Plus de 2.5 Buts" : "Over 2.5 Goals"}
                    prob={tip.over25_prob}
                    color="bg-purple-400"
                  />
                )}
                {tip.btts_prob != null && (
                  <ProbBar
                    label={isFr ? "Les 2 Equipes Marquent" : "Both Teams Score"}
                    prob={tip.btts_prob}
                    color="bg-orange-400"
                  />
                )}
              </div>
            )}

            {/* Home to Score / Away to Score */}
            {(tip.over05_home_prob != null || tip.over05_away_prob != null) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-4">
                {tip.over05_home_prob != null && (
                  <ProbBar
                    label={isFr ? `${match.home_team} marque` : `${match.home_team} to Score`}
                    prob={tip.over05_home_prob}
                    color="bg-emerald-400"
                  />
                )}
                {tip.over05_away_prob != null && (
                  <ProbBar
                    label={isFr ? `${match.away_team} marque` : `${match.away_team} to Score`}
                    prob={tip.over05_away_prob}
                    color="bg-blue-400"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Analysis */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-gray-900">
            {isFr ? "Analyse IA" : "AI Analysis"}
          </h3>
        </div>
        <div className="p-6">
          {tip?.ai_analysis ? (
            <p className="text-gray-700 leading-relaxed">{tip.ai_analysis}</p>
          ) : tip ? (
            <p className="text-gray-700 leading-relaxed">
              {isFr
                ? `Notre modèle analyse les 5 derniers matchs. ${match.home_team} affiche une forme de ${homeForm.join(" ")} et ${match.away_team} de ${awayForm.join(" ")}. Confiance: ${Math.round(tip.confidence)}% → ${predLabel}.`
                : `Our model analyzes the last 5 matches. ${match.home_team} shows form ${homeForm.join(" ")} and ${match.away_team} ${awayForm.join(" ")}. Confidence: ${Math.round(tip.confidence)}% → ${predLabel}.`}
            </p>
          ) : (
            <p className="text-gray-400">{isFr ? "Analyse en cours..." : "Analysis loading..."}</p>
          )}
        </div>
      </div>

      {/* Recent Form */}
      {(homeForm.length > 0 || awayForm.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { team: match.home_team, form: homeForm },
            { team: match.away_team, form: awayForm },
          ].map(({ team, form }) => (
            <div key={team} className="bg-white rounded-2xl border border-gray-100 p-5">
              <h4 className="font-bold text-gray-900 mb-3">
                {team} — {isFr ? "Forme Recente" : "Recent Form"}
              </h4>
              <div className="flex gap-2">
                {form.map((result, i) => (
                  <span
                    key={i}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                      result === "W" ? "bg-emerald-500" : result === "D" ? "bg-yellow-500" : "bg-red-500"
                    }`}
                  >
                    {result}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Head to Head */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-gray-900">
            {isFr ? "Confrontations Directes" : "Head to Head"}
          </h3>
        </div>

        {h2h ? (
          <div className="p-6">
            {/* Summary bar */}
            <div className="flex items-center justify-between mb-4 text-sm font-semibold">
              <span className="text-emerald-700">{match.home_team}</span>
              <span className="text-gray-500">{isFr ? `${h2h.total} matchs` : `${h2h.total} matches`}</span>
              <span className="text-blue-700">{match.away_team}</span>
            </div>
            <div className="flex rounded-full overflow-hidden h-6 mb-2">
              <div
                style={{ width: `${Math.round((h2h.homeWins / h2h.total) * 100)}%` }}
                className="bg-emerald-500 flex items-center justify-center text-white text-xs font-bold"
              >
                {h2h.homeWins > 0 ? h2h.homeWins : ""}
              </div>
              <div
                style={{ width: `${Math.round((h2h.draws / h2h.total) * 100)}%` }}
                className="bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-bold"
              >
                {h2h.draws > 0 ? h2h.draws : ""}
              </div>
              <div
                style={{ width: `${Math.round((h2h.awayWins / h2h.total) * 100)}%` }}
                className="bg-blue-500 flex items-center justify-center text-white text-xs font-bold"
              >
                {h2h.awayWins > 0 ? h2h.awayWins : ""}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mb-5">
              <span>{isFr ? "Victoires Dom." : "Home Wins"}</span>
              <span>{isFr ? "Nuls" : "Draws"}</span>
              <span>{isFr ? "Victoires Ext." : "Away Wins"}</span>
            </div>

            {/* Recent H2H matches */}
            {h2h.recent.length > 0 && (
              <div className="space-y-2">
                {h2h.recent.map((m, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-gray-50 rounded-lg px-4 py-2">
                    <span className="text-gray-600 w-24 truncate">{m.home}</span>
                    <span className="font-bold text-gray-900 tabular-nums">
                      {m.homeScore} - {m.awayScore}
                    </span>
                    <span className="text-gray-600 w-24 truncate text-right">{m.away}</span>
                    <span className="text-xs text-gray-400 ml-2">{m.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="px-6 py-8 text-center text-gray-400">
            <p className="text-sm">
              {isFr ? "Historique H2H disponible prochainement" : "H2H history coming soon"}
            </p>
          </div>
        )}
      </div>

      {/* Community Backing */}
      {tip && (
        <div className="mb-6">
          <div className="px-1 mb-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <h3 className="font-bold text-gray-900 text-sm">
              {isFr ? "Tendance Communauté" : "Community Trend"}
            </h3>
          </div>
          <CrowdBacking
            homeProb={tip.home_prob}
            drawProb={tip.draw_prob}
            awayProb={tip.away_prob}
            homeTeam={match.home_team}
            awayTeam={match.away_team}
            locale={locale}
          />
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-center mb-6">
        <p className="text-white font-bold text-lg mb-2">
          {isFr
            ? `Pariez sur ${match.home_team} vs ${match.away_team} maintenant !`
            : `Bet on ${match.home_team} vs ${match.away_team} now!`}
        </p>
        <p className="text-emerald-100 text-sm mb-4">
          {isFr
            ? "Ouvrez votre compte 1xBet et profitez des meilleures cotes"
            : "Open your 1xBet account and enjoy the best odds"}
        </p>
        <AffiliateCTA
          text={isFr ? "Parier sur 1xBet" : "Bet on 1xBet"}
          variant="banner"
          campaign="match_detail_bottom"
        />
      </div>

      {/* Internal links — SEO cross-linking */}
      <nav className="pt-4 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
          {isFr ? "Explorer aussi" : "Also explore"}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href={`/${locale}/predictions`} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors font-medium">
            {isFr ? "Tous les Pronostics" : "All Predictions"}
          </Link>
          <Link href={`/${locale}/stats`} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors font-medium">
            {isFr ? "Performance IA" : "AI Stats"}
          </Link>
          <Link href={`/${locale}/rapport-du-jour`} className="text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors font-medium">
            {isFr ? "Rapport du Jour" : "Daily Report"}
          </Link>
          <Link href={`/${locale}/blog`} className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors font-medium">
            Blog
          </Link>
          <Link href={`/${locale}/about`} className="text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors font-medium">
            {isFr ? "Comment ca marche" : "How it works"}
          </Link>
        </div>
      </nav>

      {/* JSON-LD: SportsEvent + BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SportsEvent",
                name: `${match.home_team} vs ${match.away_team}`,
                startDate: match.match_date,
                homeTeam: { "@type": "SportsTeam", name: match.home_team },
                awayTeam: { "@type": "SportsTeam", name: match.away_team },
                organizer: { "@type": "SportsOrganization", name: match.league_name },
                description: tip?.ai_analysis || `${isFr ? "Pronostic IA pour" : "AI prediction for"} ${match.home_team} vs ${match.away_team}`,
                eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: isFr ? "Accueil" : "Home", item: `${siteConfig.url}/${locale}` },
                  { "@type": "ListItem", position: 2, name: isFr ? "Pronostics" : "Predictions", item: `${siteConfig.url}/${locale}/predictions` },
                  { "@type": "ListItem", position: 3, name: `${match.home_team} vs ${match.away_team}` },
                ],
              },
            ],
          }),
        }}
      />
    </div>
  );
}
