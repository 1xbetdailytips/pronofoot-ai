import type { Metadata } from "next";
import Link from "next/link";
import { Layers, Shield, Zap, Flame, ArrowRight, ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";
import { getTodaysMatches, matchToCardProps } from "@/lib/data";
import { siteConfig } from "@/lib/config";
import PromoBanner from "@/components/ui/PromoBanner";
import ShareToUnlock from "@/components/viral/ShareToUnlock";

// ISR: revalidate every 2 minutes
export const revalidate = 120;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isFr = params.locale === "fr";
  return {
    title: isFr ? "Générateur de Combos IA — Combinés du Jour" : "AI Combo Builder — Today's Best Combos",
    description: isFr
      ? "Générez des combos intelligents : sûr, équilibré ou risqué. Combinés de paris générés par intelligence artificielle."
      : "Generate smart combos: safe, balanced, or risky. AI-generated bet combinations for today's matches.",
    alternates: {
      canonical: `/${params.locale}/bet-builder`,
      languages: { fr: "/fr/bet-builder", en: "/en/bet-builder", "x-default": "/fr/bet-builder" },
    },
  };
}

type ComboMatch = {
  homeTeam: string;
  awayTeam: string;
  league: string;
  pick: string;
  pickLabel: string;
  odds: number;
  confidence: number;
};

type Combo = {
  type: "safe" | "balanced" | "risky";
  matches: ComboMatch[];
  totalOdds: number;
  avgConfidence: number;
};

function buildCombos(
  tippedMatches: ReturnType<typeof matchToCardProps>[],
  isFr: boolean
): Combo[] {
  // Sort by confidence desc
  const sorted = [...tippedMatches]
    .filter(m => m.confidence !== null && m.confidence > 0)
    .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0));

  if (sorted.length < 3) return [];

  const predLabels: Record<string, Record<string, string>> = {
    home_win: { fr: "1", en: "1" },
    draw: { fr: "X", en: "X" },
    away_win: { fr: "2", en: "2" },
  };

  function toComboMatch(m: typeof sorted[0]): ComboMatch {
    const bestOdds = m.prediction === "home_win"
      ? m.homeOdds
      : m.prediction === "away_win"
        ? m.awayOdds
        : m.drawOdds;

    return {
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      league: m.league,
      pick: m.prediction ?? "home_win",
      pickLabel: predLabels[m.prediction ?? "home_win"]?.[isFr ? "fr" : "en"] ?? "1",
      odds: bestOdds ?? 1.5,
      confidence: m.confidence ?? 50,
    };
  }

  // Safe: top 3-4 highest confidence
  const safePool = sorted.filter(m => (m.confidence ?? 0) >= 65).slice(0, 4);
  const safe: ComboMatch[] = safePool.length >= 3
    ? safePool.slice(0, Math.min(4, safePool.length)).map(toComboMatch)
    : sorted.slice(0, 3).map(toComboMatch);

  // Balanced: mix of mid-high confidence
  const balancedPool = sorted.filter(m => (m.confidence ?? 0) >= 55 && (m.confidence ?? 0) < 80);
  const balanced: ComboMatch[] = balancedPool.length >= 3
    ? balancedPool.slice(0, 4).map(toComboMatch)
    : sorted.slice(1, 5).map(toComboMatch);

  // Risky: higher odds picks
  const riskyPool = sorted
    .filter(m => {
      const bestOdds = m.prediction === "home_win" ? m.homeOdds : m.prediction === "away_win" ? m.awayOdds : m.drawOdds;
      return (bestOdds ?? 1) >= 1.8;
    })
    .slice(0, 5);
  const risky: ComboMatch[] = riskyPool.length >= 3
    ? riskyPool.slice(0, 5).map(toComboMatch)
    : sorted.slice(2, 7).map(toComboMatch);

  function calcCombo(matches: ComboMatch[]): Combo & { type: "safe" | "balanced" | "risky" } {
    const totalOdds = matches.reduce((acc, m) => acc * m.odds, 1);
    const avgConfidence = Math.round(matches.reduce((acc, m) => acc + m.confidence, 0) / matches.length);
    return { type: "safe", matches, totalOdds: parseFloat(totalOdds.toFixed(2)), avgConfidence };
  }

  return [
    { ...calcCombo(safe), type: "safe" },
    { ...calcCombo(balanced), type: "balanced" },
    { ...calcCombo(risky), type: "risky" },
  ];
}

const comboConfig = {
  safe: {
    icon: Shield,
    gradient: "from-emerald-500 to-emerald-600",
    bgLight: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
  },
  balanced: {
    icon: Zap,
    gradient: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700",
  },
  risky: {
    icon: Flame,
    gradient: "from-orange-500 to-red-600",
    bgLight: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
    badge: "bg-orange-100 text-orange-700",
  },
};

export default async function BetBuilderPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const isFr = locale === "fr";

  const matches = await getTodaysMatches();
  const tipped = matches.filter(m => m.tip).map(m => matchToCardProps(m));
  const combos = buildCombos(tipped, isFr);

  const comboLabels = {
    safe: { fr: "Combine Sur", en: "Safe Combo" },
    balanced: { fr: "Combine Equilibre", en: "Balanced Combo" },
    risky: { fr: "Combine Risque", en: "Risky Combo" },
  };

  const comboDescs = {
    safe: {
      fr: "Les paris les plus fiables du jour. Cotes moderees, confiance maximale.",
      en: "Today's most reliable picks. Moderate odds, maximum confidence.",
    },
    balanced: {
      fr: "Bon equilibre entre cotes et securite. Le meilleur rapport risque/gain.",
      en: "Good balance between odds and safety. Best risk/reward ratio.",
    },
    risky: {
      fr: "Hautes cotes pour les audacieux. Gros gains potentiels.",
      en: "High odds for the bold. Big potential returns.",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-40 h-40 border border-indigo-400 rounded-full" />
          <div className="absolute bottom-10 left-10 w-56 h-56 border border-purple-400 rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <Layers className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                {isFr ? "Générateur de Combos IA" : "AI Combo Builder"}
              </h1>
              <p className="text-indigo-300 text-sm mt-1">
                {isFr
                  ? "Combinés intelligents générés par notre intelligence artificielle"
                  : "Smart combos generated by our artificial intelligence"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-white/80">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {tipped.length} {isFr ? "matchs analysés" : "matches analyzed"}
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm text-white/80">
              <Layers className="w-4 h-4 text-indigo-400" />
              {combos.length} {isFr ? "combinés générés" : "combos generated"}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Promo */}
        <div className="mb-8">
          <PromoBanner locale={locale} variant="high-odds" campaign="bet_builder" />
        </div>

        {combos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <AlertTriangle className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {isFr
                ? "Pas assez de prédictions aujourd'hui pour générer des combinés. Revenez plus tard."
                : "Not enough predictions today to generate combos. Check back later."}
            </p>
            <Link
              href={`/${locale}/predictions`}
              className="inline-flex items-center gap-2 text-emerald-600 font-medium mt-4 hover:text-emerald-700"
            >
              {isFr ? "Voir les pronostics" : "View predictions"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {combos.map((combo) => {
              const config = comboConfig[combo.type];
              const Icon = config.icon;
              const isRisky = combo.type === "risky";

              const card = (
                <div
                  key={combo.type}
                  className={`bg-white rounded-2xl border-2 ${config.border} overflow-hidden hover:shadow-lg transition-shadow`}
                >
                  {/* Card header */}
                  <div className={`bg-gradient-to-r ${config.gradient} px-5 py-4`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-white" />
                        <h3 className="text-white font-bold text-lg">
                          {comboLabels[combo.type][isFr ? "fr" : "en"]}
                        </h3>
                      </div>
                      <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {combo.matches.length} {isFr ? "matchs" : "picks"}
                      </span>
                    </div>
                    <p className="text-white/80 text-xs mt-1">
                      {comboDescs[combo.type][isFr ? "fr" : "en"]}
                    </p>
                  </div>

                  {/* Matches */}
                  <div className="divide-y divide-gray-100">
                    {combo.matches.map((m, i) => (
                      <div key={i} className="px-5 py-3 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {m.homeTeam} vs {m.awayTeam}
                          </p>
                          <p className="text-[10px] text-gray-400">{m.league}</p>
                        </div>
                        <div className={`${config.badge} text-xs font-bold px-2.5 py-1 rounded-full`}>
                          {m.pickLabel}
                        </div>
                        <span className="text-sm font-mono font-bold text-gray-700 w-10 text-right">
                          {m.odds.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className={`px-5 py-4 ${config.bgLight} border-t ${config.border}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                          {isFr ? "Cotes Totales" : "Total Odds"}
                        </p>
                        <p className={`text-2xl font-bold font-mono ${config.text}`}>
                          {combo.totalOdds.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                          {isFr ? "Confiance Moy." : "Avg Confidence"}
                        </p>
                        <p className="text-lg font-bold text-gray-700">{combo.avgConfidence}%</p>
                      </div>
                    </div>
                    <a
                      href={`${siteConfig.affiliateLink}${siteConfig.affiliateLink.includes("?") ? "&" : "?"}utm_campaign=combo_${combo.type}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${config.gradient} text-white text-sm font-bold py-3 rounded-xl hover:opacity-90 transition-opacity`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      {isFr ? "Placer ce Combine sur 1xBet" : "Place This Combo on 1xBet"}
                    </a>
                  </div>
                </div>
              );

              // Lock the risky combo behind share
              if (isRisky) {
                return (
                  <ShareToUnlock
                    key={combo.type}
                    contentId={`combo_risky_${new Date().toISOString().slice(0, 10)}`}
                    locale={locale}
                    variant="combo"
                    previewLines={3}
                  >
                    {card}
                  </ShareToUnlock>
                );
              }
              return card;
            })}
          </div>
        )}

        {/* How it works */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {isFr ? "Comment ca fonctionne ?" : "How does it work?"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: isFr ? "Analyse IA" : "AI Analysis",
                desc: isFr
                  ? "Notre IA analyse les probabilités, la forme et les statistiques de chaque match du jour."
                  : "Our AI analyzes probabilities, form, and statistics for every match today.",
              },
              {
                step: "02",
                title: isFr ? "Génération de Combinés" : "Combo Generation",
                desc: isFr
                  ? "Trois combinés sont générés : sûr, équilibré et risqué, selon votre profil de jeu."
                  : "Three combos are generated: safe, balanced, and risky, matching your play style.",
              },
              {
                step: "03",
                title: isFr ? "Placez votre Pari" : "Place Your Bet",
                desc: isFr
                  ? "Cliquez pour placer directement sur 1xBet avec le code promo FLYUP777."
                  : "Click to place directly on 1xBet with promo code FLYUP777.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-700 font-bold text-sm">{item.step}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/predictions`}
            className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700"
          >
            {isFr ? "Voir tous les pronostics" : "View all predictions"} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
