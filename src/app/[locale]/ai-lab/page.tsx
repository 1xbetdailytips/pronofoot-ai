import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Brain, TrendingUp, Shield, Zap, AlertTriangle, BarChart3, Target, Activity } from "lucide-react";
import Link from "next/link";
import { getTodaysMatches, matchToCardProps } from "@/lib/data";
import ShareToUnlock from "@/components/viral/ShareToUnlock";
import CrowdBacking from "@/components/social/CrowdBacking";
import PromoBanner from "@/components/ui/PromoBanner";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isFr = params.locale === "fr";
  return {
    title: isFr ? "Labo IA Football - Analyse Avancee" : "AI Football Lab - Advanced Analysis",
    description: isFr
      ? "Analyses avancees par intelligence artificielle: detecteur de tendances, generateur de paris intelligents, et analyse de patterns."
      : "Advanced AI analysis: trend detector, smart bet generator, and pattern analysis.",
    alternates: {
      canonical: `/${params.locale}/ai-lab`,
      languages: { fr: "/fr/ai-lab", en: "/en/ai-lab", "x-default": "/fr/ai-lab" },
    },
  };
}

// Helper: Analyze form patterns
function analyzeForm(form: string[] | null): { streak: string; trend: string; score: number } {
  if (!form || form.length === 0) return { streak: "-", trend: "unknown", score: 50 };

  const last5 = form.slice(0, 5);
  const wins = last5.filter(r => r === "W").length;
  const draws = last5.filter(r => r === "D").length;
  const losses = last5.filter(r => r === "L").length;

  let streak = "";
  let count = 0;
  for (const r of last5) {
    if (count === 0 || r === last5[0]) { streak = r; count++; }
    else break;
  }

  const score = Math.round((wins * 3 + draws * 1) / (last5.length * 3) * 100);
  const trend = wins >= 3 ? "hot" : losses >= 3 ? "cold" : wins > losses ? "warming" : "cooling";

  return { streak: `${streak}${count}`, trend, score };
}

// Helper: Calculate suspicion score (unusual odds patterns)
function getSuspicionScore(homeProb: number, drawProb: number, awayProb: number, confidence: number): number {
  // High suspicion if: very even odds + low confidence, or extreme imbalance
  const spread = Math.max(homeProb, drawProb, awayProb) - Math.min(homeProb, drawProb, awayProb);
  const evenness = 100 - spread; // Higher = more even
  const lowConf = Math.max(0, 50 - confidence);

  let score = Math.round(evenness * 0.3 + lowConf * 0.7);
  score = Math.min(85, Math.max(5, score)); // Clamp between 5-85

  return score;
}

export default async function AILabPage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const isFr = locale === "fr";
  const matches = await getTodaysMatches();
  const tippedMatches = matches.filter(m => m.tip);

  // Pattern analysis data
  const patterns = tippedMatches.slice(0, 12).map(m => {
    const homeForm = analyzeForm(m.home_form);
    const awayForm = analyzeForm(m.away_form);
    const props = matchToCardProps(m);

    return {
      id: m.id,
      homeTeam: m.home_team,
      awayTeam: m.away_team,
      league: m.league_name,
      homeForm,
      awayForm,
      confidence: m.tip?.confidence ?? 0,
      prediction: m.tip?.prediction ?? "-",
      homeProb: m.tip?.home_prob ?? 33,
      drawProb: m.tip?.draw_prob ?? 34,
      awayProb: m.tip?.away_prob ?? 33,
      bestPick: m.tip?.best_pick ?? null,
      over25: m.tip?.over25_prob ?? 50,
      btts: m.tip?.btts_prob ?? 50,
      suspicion: m.tip ? getSuspicionScore(m.tip.home_prob, m.tip.draw_prob, m.tip.away_prob, m.tip.confidence) : 10,
      slug: m.slug,
    };
  });

  // Smart bet combos
  const safePicks = tippedMatches
    .filter(m => m.tip && m.tip.confidence >= 65)
    .sort((a, b) => (b.tip?.confidence ?? 0) - (a.tip?.confidence ?? 0))
    .slice(0, 3);

  const mediumPicks = tippedMatches
    .filter(m => m.tip && m.tip.confidence >= 50 && m.tip.confidence < 65 && m.tip.odds >= 1.5)
    .sort((a, b) => (b.tip?.odds ?? 0) - (a.tip?.odds ?? 0))
    .slice(0, 3);

  const riskyPicks = tippedMatches
    .filter(m => m.tip && m.tip.odds >= 2.5)
    .sort((a, b) => (b.tip?.odds ?? 0) - (a.tip?.odds ?? 0))
    .slice(0, 3);

  const safeTotalOdds = safePicks.reduce((acc, m) => acc * (m.tip?.odds ?? 1), 1);
  const mediumTotalOdds = mediumPicks.reduce((acc, m) => acc * (m.tip?.odds ?? 1), 1);
  const riskyTotalOdds = riskyPicks.reduce((acc, m) => acc * (m.tip?.odds ?? 1), 1);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 border border-indigo-400 rounded-full" />
          <div className="absolute bottom-10 left-10 w-40 h-40 border border-purple-400 rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
              <Brain className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                {isFr ? "Labo IA Football" : "AI Football Lab"}
              </h1>
              <p className="text-indigo-300 text-sm">
                {isFr ? "Analyses avancees par intelligence artificielle" : "Advanced artificial intelligence analysis"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 max-w-md">
            <div className="text-center bg-white/5 rounded-lg px-3 py-2">
              <p className="text-xl font-bold text-white">{tippedMatches.length}</p>
              <p className="text-indigo-300 text-[10px]">{isFr ? "Matchs analyses" : "Matches analyzed"}</p>
            </div>
            <div className="text-center bg-white/5 rounded-lg px-3 py-2">
              <p className="text-xl font-bold text-white">{patterns.filter(p => p.suspicion < 30).length}</p>
              <p className="text-indigo-300 text-[10px]">{isFr ? "Matchs propres" : "Clean matches"}</p>
            </div>
            <div className="text-center bg-white/5 rounded-lg px-3 py-2">
              <p className="text-xl font-bold text-white">3</p>
              <p className="text-indigo-300 text-[10px]">{isFr ? "Combos generes" : "Combos generated"}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ─── PATTERN ANALYZER ──────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-bold text-gray-900">
              {isFr ? "Analyseur de Tendances" : "Pattern Analyzer"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patterns.slice(0, 6).map((p) => (
              <Link
                key={p.id}
                href={`/${locale}/predictions/${p.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">{p.league}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                    p.confidence >= 70 ? "bg-emerald-50 text-emerald-700" :
                    p.confidence >= 50 ? "bg-amber-50 text-amber-700" :
                    "bg-red-50 text-red-700"
                  }`}>
                    {p.confidence}%
                  </span>
                </div>

                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {p.homeTeam} vs {p.awayTeam}
                </p>

                {/* Form trends */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-lg px-2 py-1.5">
                    <p className="text-[10px] text-gray-400">{p.homeTeam.split(" ")[0]}</p>
                    <div className="flex items-center gap-1">
                      <FormBadge trend={p.homeForm.trend} />
                      <span className="text-xs font-semibold text-gray-700">{p.homeForm.score}%</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-2 py-1.5">
                    <p className="text-[10px] text-gray-400">{p.awayTeam.split(" ")[0]}</p>
                    <div className="flex items-center gap-1">
                      <FormBadge trend={p.awayForm.trend} />
                      <span className="text-xs font-semibold text-gray-700">{p.awayForm.score}%</span>
                    </div>
                  </div>
                </div>

                {/* Insight line */}
                <div className="flex items-center gap-2 text-[10px]">
                  {p.bestPick && (
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                      {p.bestPick}
                    </span>
                  )}
                  <span className="text-gray-400">
                    O2.5: {p.over25}% | BTTS: {p.btts}%
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {patterns.length > 6 && (
            <ShareToUnlock contentId="lab-patterns-full" locale={locale} variant="analysis" previewLines={3}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {patterns.slice(6).map((p) => (
                  <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-sm font-semibold text-gray-900">{p.homeTeam} vs {p.awayTeam}</p>
                    <p className="text-xs text-gray-500">{p.league} | {p.confidence}% | {p.bestPick}</p>
                  </div>
                ))}
              </div>
            </ShareToUnlock>
          )}
        </section>

        {/* ─── SMART BET GENERATOR ──────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-gray-900">
              {isFr ? "Generateur de Paris Intelligents" : "Smart Bet Generator"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Safe combo */}
            <ComboCard
              title={isFr ? "Combo Sur" : "Safe Combo"}
              icon={<Shield className="w-5 h-5 text-emerald-600" />}
              color="emerald"
              picks={safePicks.map(m => ({
                match: `${m.home_team} vs ${m.away_team}`,
                pick: m.tip?.best_pick || (m.tip?.prediction === "1" ? "Home" : m.tip?.prediction === "2" ? "Away" : "Draw"),
                odds: m.tip?.odds ?? 1,
                confidence: m.tip?.confidence ?? 0,
              }))}
              totalOdds={safeTotalOdds}
              locale={locale}
            />

            {/* Medium combo */}
            <ComboCard
              title={isFr ? "Combo Equilibre" : "Balanced Combo"}
              icon={<Target className="w-5 h-5 text-amber-600" />}
              color="amber"
              picks={mediumPicks.map(m => ({
                match: `${m.home_team} vs ${m.away_team}`,
                pick: m.tip?.best_pick || (m.tip?.prediction === "1" ? "Home" : m.tip?.prediction === "2" ? "Away" : "Draw"),
                odds: m.tip?.odds ?? 1,
                confidence: m.tip?.confidence ?? 0,
              }))}
              totalOdds={mediumTotalOdds}
              locale={locale}
            />

            {/* Risky combo - LOCKED */}
            <ShareToUnlock contentId="lab-risky-combo" locale={locale} variant="combo" previewLines={4}>
              <ComboCard
                title={isFr ? "Combo Risque" : "Risky Combo"}
                icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
                color="red"
                picks={riskyPicks.map(m => ({
                  match: `${m.home_team} vs ${m.away_team}`,
                  pick: m.tip?.best_pick || (m.tip?.prediction === "1" ? "Home" : m.tip?.prediction === "2" ? "Away" : "Draw"),
                  odds: m.tip?.odds ?? 1,
                  confidence: m.tip?.confidence ?? 0,
                }))}
                totalOdds={riskyTotalOdds}
                locale={locale}
              />
            </ShareToUnlock>
          </div>
        </section>

        {/* ─── SUSPICION DETECTOR ───────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-bold text-gray-900">
              {isFr ? "Detecteur de Matchs Suspects" : "Suspicious Match Detector"}
            </h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            {isFr
              ? "Score de suspicion base sur les ecarts de cotes et les patterns inhabituels. Plus le score est eleve, plus le match est imprevisible."
              : "Suspicion score based on odds spreads and unusual patterns. Higher score = more unpredictable match."}
          </p>
          <ShareToUnlock contentId="lab-suspicion" locale={locale} variant="analysis" previewLines={3}>
            <div className="space-y-2">
              {patterns
                .sort((a, b) => b.suspicion - a.suspicion)
                .slice(0, 8)
                .map((p) => (
                  <div key={p.id} className="flex items-center gap-3 bg-white rounded-lg border border-gray-100 px-4 py-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      p.suspicion >= 60 ? "bg-red-100 text-red-700" :
                      p.suspicion >= 40 ? "bg-amber-100 text-amber-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>
                      {p.suspicion}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.homeTeam} vs {p.awayTeam}</p>
                      <p className="text-[10px] text-gray-400">{p.league}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      p.suspicion >= 60 ? "bg-red-50 text-red-600" :
                      p.suspicion >= 40 ? "bg-amber-50 text-amber-600" :
                      "bg-emerald-50 text-emerald-600"
                    }`}>
                      {p.suspicion >= 60 ? (isFr ? "Suspect" : "Suspicious") :
                       p.suspicion >= 40 ? (isFr ? "A surveiller" : "Watch") :
                       (isFr ? "Normal" : "Normal")}
                    </span>
                  </div>
                ))}
            </div>
          </ShareToUnlock>
        </section>

        {/* ─── CROWD DATA ──────────────────────────────────── */}
        {patterns.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-gray-900">
                {isFr ? "Donnees de la Communaute" : "Community Data"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patterns.slice(0, 4).map((p) => (
                <CrowdBacking
                  key={p.id}
                  homeProb={p.homeProb}
                  drawProb={p.drawProb}
                  awayProb={p.awayProb}
                  homeTeam={p.homeTeam}
                  awayTeam={p.awayTeam}
                  locale={locale}
                />
              ))}
            </div>
          </section>
        )}

        {/* Promo banner */}
        <PromoBanner locale={locale} variant="welcome-bonus" campaign="ai_lab" />

        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: isFr ? "Labo IA Football" : "AI Football Lab",
            description: isFr ? "Analyses avancees par IA" : "Advanced AI analysis",
            url: `https://parifoot.online/${locale}/ai-lab`,
            isPartOf: { "@type": "WebSite", name: "PronoFoot AI", url: "https://parifoot.online" },
          }),
        }} />
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────

function FormBadge({ trend }: { trend: string }) {
  const styles: Record<string, string> = {
    hot: "bg-emerald-500",
    warming: "bg-emerald-300",
    cooling: "bg-amber-400",
    cold: "bg-red-500",
    unknown: "bg-gray-300",
  };

  return (
    <div className={`w-2 h-2 rounded-full ${styles[trend] || styles.unknown}`} />
  );
}

function ComboCard({
  title,
  icon,
  color,
  picks,
  totalOdds,
  locale,
}: {
  title: string;
  icon: React.ReactNode;
  color: "emerald" | "amber" | "red";
  picks: Array<{ match: string; pick: string; odds: number; confidence: number }>;
  totalOdds: number;
  locale: string;
}) {
  const isFr = locale === "fr";
  const borderColors = { emerald: "border-emerald-200", amber: "border-amber-200", red: "border-red-200" };
  const bgColors = { emerald: "bg-emerald-50", amber: "bg-amber-50", red: "bg-red-50" };

  return (
    <div className={`bg-white rounded-xl border ${borderColors[color]} p-4`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2 mb-3">
        {picks.length > 0 ? picks.map((p, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-gray-600 truncate flex-1 mr-2">{p.match}</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`${bgColors[color]} px-1.5 py-0.5 rounded text-[10px] font-semibold`}>
                {p.pick}
              </span>
              <span className="text-gray-400 w-10 text-right">{p.odds.toFixed(2)}</span>
            </div>
          </div>
        )) : (
          <p className="text-xs text-gray-400 italic">
            {isFr ? "Pas assez de matchs" : "Not enough matches"}
          </p>
        )}
      </div>
      {picks.length > 0 && (
        <div className={`${bgColors[color]} rounded-lg px-3 py-2 text-center`}>
          <span className="text-[10px] text-gray-500">
            {isFr ? "Cotes totales" : "Total odds"}
          </span>
          <p className="text-lg font-bold text-gray-900">{totalOdds.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}
