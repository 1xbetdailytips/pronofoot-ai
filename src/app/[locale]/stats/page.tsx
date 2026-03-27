import type { Metadata } from "next";
import { TrendingUp, Target, CheckCircle, XCircle, Clock, Zap, Shield, Flame } from "lucide-react";
import { getWinRateStats } from "@/lib/data";
import type { WinRateStat } from "@/lib/types";

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isFr = params.locale === "fr";
  return {
    title: isFr
      ? "Performance IA — Taux de Réussite PronoFoot AI"
      : "AI Performance — PronoFoot AI Win Rate Stats",
    description: isFr
      ? "Statistiques complètes de performance de notre IA : taux de réussite global, par confiance, par marché. Transparence totale."
      : "Complete AI performance statistics: overall win rate, by confidence tier, by market. Full transparency.",
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function rateColor(rate: number): string {
  if (rate >= 70) return "text-emerald-600";
  if (rate >= 55) return "text-blue-600";
  if (rate >= 45) return "text-amber-600";
  return "text-red-500";
}

function rateBarColor(rate: number): string {
  if (rate >= 70) return "bg-emerald-500";
  if (rate >= 55) return "bg-blue-500";
  if (rate >= 45) return "bg-amber-500";
  return "bg-red-500";
}

function StatBar({ label, stat, sublabel }: { label: string; stat: WinRateStat; sublabel?: string }) {
  if (!stat || stat.total === 0) {
    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
        <div>
          <p className="text-sm font-medium text-gray-700">{label}</p>
          {sublabel && <p className="text-xs text-gray-400">{sublabel}</p>}
        </div>
        <span className="text-xs text-gray-400">—</span>
      </div>
    );
  }
  return (
    <div className="py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between mb-1.5">
        <div>
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {sublabel && <span className="text-xs text-gray-400 ml-2">{sublabel}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{stat.wins}W / {stat.total - stat.wins}L</span>
          <span className={`font-bold text-sm ${rateColor(stat.rate)}`}>{stat.rate}%</span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${rateBarColor(stat.rate)}`}
          style={{ width: `${stat.rate}%` }}
        />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function StatsPage({ params }: { params: { locale: string } }) {
  const isFr = params.locale === "fr";
  const stats = await getWinRateStats();

  const overallRate = stats.overall.rate;

  // Streak display
  const streakLabel = stats.streak.type === "win"
    ? (isFr ? `🔥 ${stats.streak.count} victoires d'affilée` : `🔥 ${stats.streak.count} wins in a row`)
    : stats.streak.type === "loss"
    ? (isFr ? `${stats.streak.count} défaites d'affilée` : `${stats.streak.count} losses in a row`)
    : (isFr ? "Aucun résultat encore" : "No results yet");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-6 h-6 text-emerald-600" />
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isFr ? "Performance de l'IA" : "AI Performance"}
          </h1>
        </div>
        <p className="text-gray-500">
          {isFr
            ? "Toutes les prédictions, tous les résultats. Mise à jour automatique chaque soir à 23h."
            : "Every prediction, every result. Automatically updated every evening at 11PM."}
        </p>
      </div>

      {/* ── Hero stats row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Big win rate */}
        <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-center text-white">
          <p className="text-emerald-200 text-sm font-medium mb-1">
            {isFr ? "Taux global" : "Overall rate"}
          </p>
          <p className="text-6xl font-extrabold">
            {stats.overall.total > 0 ? `${overallRate}%` : "—"}
          </p>
          <p className="text-emerald-200 text-xs mt-1">
            {stats.overall.wins}W / {stats.overall.total - stats.overall.wins}L
          </p>
        </div>

        {/* 7-day */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
          <p className="text-gray-500 text-xs font-medium mb-1">
            {isFr ? "7 derniers jours" : "Last 7 days"}
          </p>
          <p className={`text-4xl font-extrabold ${stats.last7days.total > 0 ? rateColor(stats.last7days.rate) : "text-gray-300"}`}>
            {stats.last7days.total > 0 ? `${stats.last7days.rate}%` : "—"}
          </p>
          <p className="text-gray-400 text-xs mt-1">{stats.last7days.total} {isFr ? "prédictions" : "predictions"}</p>
        </div>

        {/* 30-day */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center shadow-sm">
          <p className="text-gray-500 text-xs font-medium mb-1">
            {isFr ? "30 derniers jours" : "Last 30 days"}
          </p>
          <p className={`text-4xl font-extrabold ${stats.last30days.total > 0 ? rateColor(stats.last30days.rate) : "text-gray-300"}`}>
            {stats.last30days.total > 0 ? `${stats.last30days.rate}%` : "—"}
          </p>
          <p className="text-gray-400 text-xs mt-1">{stats.last30days.total} {isFr ? "prédictions" : "predictions"}</p>
        </div>

        {/* Counters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <p className="text-gray-500 text-xs font-medium mb-3">
            {isFr ? "Résumé total" : "Total summary"}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-gray-600">{isFr ? "Gagnées" : "Won"}</span>
              </div>
              <span className="font-bold text-emerald-600">{stats.overall.wins}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-gray-600">{isFr ? "Perdues" : "Lost"}</span>
              </div>
              <span className="font-bold text-red-500">{stats.overall.total - stats.overall.wins}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-gray-600">{isFr ? "En attente" : "Pending"}</span>
              </div>
              <span className="font-bold text-amber-500">{stats.pending}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Streak banner ─────────────────────────────────────────────── */}
      {stats.streak.count > 0 && (
        <div className={`rounded-2xl px-6 py-4 mb-8 flex items-center gap-3 ${
          stats.streak.type === "win"
            ? "bg-emerald-50 border border-emerald-200"
            : "bg-red-50 border border-red-200"
        }`}>
          <Zap className={`w-5 h-5 flex-shrink-0 ${stats.streak.type === "win" ? "text-emerald-600" : "text-red-500"}`} />
          <p className={`font-semibold ${stats.streak.type === "win" ? "text-emerald-700" : "text-red-600"}`}>
            {streakLabel}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* ── Confidence tier accuracy ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900">
              {isFr ? "Par niveau de confiance IA" : "By AI confidence level"}
            </h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            {isFr
              ? "Prouve que le score de confiance est significatif — plus la confiance est haute, plus le taux de réussite doit l'être aussi."
              : "Proves the confidence score is meaningful — higher confidence should mean higher win rate."}
          </p>
          <StatBar
            label={isFr ? "Haute confiance (≥70%)" : "High confidence (≥70%)"}
            stat={stats.highConfidence}
            sublabel={`${stats.highConfidence.total} ${isFr ? "picks" : "picks"}`}
          />
          <StatBar
            label={isFr ? "Confiance moyenne (50–69%)" : "Medium confidence (50–69%)"}
            stat={stats.medConfidence}
            sublabel={`${stats.medConfidence.total} ${isFr ? "picks" : "picks"}`}
          />
          <StatBar
            label={isFr ? "Faible confiance (<50%)" : "Low confidence (<50%)"}
            stat={stats.lowConfidence}
            sublabel={`${stats.lowConfidence.total} ${isFr ? "picks" : "picks"}`}
          />
        </div>

        {/* ── Risk level accuracy ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-gray-900">
              {isFr ? "Par niveau de risque" : "By risk level"}
            </h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            {isFr
              ? "Taux de réussite par catégorie de risque. Les picks Faible risque devraient avoir le meilleur taux."
              : "Win rate by risk category. Low risk picks should have the best rate."}
          </p>
          <StatBar
            label={isFr ? "🟢 Risque Faible" : "🟢 Low Risk"}
            stat={stats.faible}
            sublabel={`${stats.faible.total} ${isFr ? "picks" : "picks"}`}
          />
          <StatBar
            label={isFr ? "🟡 Risque Moyen" : "🟡 Medium Risk"}
            stat={stats.moyen}
            sublabel={`${stats.moyen.total} ${isFr ? "picks" : "picks"}`}
          />
          <StatBar
            label={isFr ? "🔴 Risque Élevé" : "🔴 High Risk"}
            stat={stats.eleve}
            sublabel={`${stats.eleve.total} ${isFr ? "picks" : "picks"}`}
          />
        </div>

        {/* ── Market accuracy ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h2 className="font-bold text-gray-900">
              {isFr ? "Précision par marché" : "Accuracy by market"}
            </h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            {isFr
              ? "Taux de réussite calculé sur tous les matchs résolus, par type de pari."
              : "Win rate calculated across all resolved matches, by bet type."}
          </p>
          <StatBar
            label={isFr ? "1X2 (Résultat final)" : "1X2 (Match result)"}
            stat={stats.overall}
            sublabel={`${stats.overall.total} ${isFr ? "matchs" : "matches"}`}
          />
          <StatBar
            label={isFr ? "Over 1.5 buts" : "Over 1.5 goals"}
            stat={stats.over15}
            sublabel={`${stats.over15.total} ${isFr ? "matchs" : "matches"}`}
          />
          <StatBar
            label={isFr ? "Over 2.5 buts" : "Over 2.5 goals"}
            stat={stats.over25}
            sublabel={`${stats.over25.total} ${isFr ? "matchs" : "matches"}`}
          />
          <StatBar
            label={isFr ? "BTTS (Les deux équipes marquent)" : "BTTS (Both teams score)"}
            stat={stats.btts}
            sublabel={`${stats.btts.total} ${isFr ? "matchs" : "matches"}`}
          />
          <StatBar
            label={isFr ? "Meilleur pick IA (best_pick)" : "AI best pick accuracy"}
            stat={stats.bestPick}
            sublabel={`${stats.bestPick.total} ${isFr ? "matchs" : "matches"}`}
          />
        </div>

        {/* ── Methodology note ─────────────────────────────────────────── */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
          <h2 className="font-bold text-gray-900 mb-3">
            {isFr ? "Comment ces stats sont calculées" : "How these stats are calculated"}
          </h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="text-emerald-500 flex-shrink-0">•</span>
              {isFr
                ? "Chaque prédiction est enregistrée au moment de la génération IA (7h du matin)."
                : "Every prediction is recorded at AI generation time (7AM daily)."}
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500 flex-shrink-0">•</span>
              {isFr
                ? "Les résultats sont récupérés automatiquement sur API-Football chaque soir à 23h."
                : "Results are fetched automatically from API-Football every evening at 11PM."}
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500 flex-shrink-0">•</span>
              {isFr
                ? "Over 1.5 / Over 2.5 / BTTS sont calculés sur le score final de chaque match."
                : "Over 1.5 / Over 2.5 / BTTS are computed from each match's final score."}
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500 flex-shrink-0">•</span>
              {isFr
                ? "Aucune donnée n'est retirée ou modifiée. Tout est loggé dans Supabase en temps réel."
                : "No data is removed or edited. Everything is logged in Supabase in real time."}
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500 flex-shrink-0">•</span>
              {isFr
                ? "Les matchs reportés ou annulés restent en statut 'en attente' sans affecter les stats."
                : "Postponed or cancelled matches remain 'pending' without affecting the stats."}
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              {isFr
                ? `Données depuis le début de l'activité • ${stats.overall.total} prédictions résolues au total`
                : `Data since platform launch • ${stats.overall.total} resolved predictions total`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Recent results table ───────────────────────────────────────── */}
      {stats.recentResults.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">
              {isFr ? "20 derniers résultats" : "Last 20 results"}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-4 py-3">{isFr ? "Match" : "Match"}</th>
                  <th className="text-center px-3 py-3">{isFr ? "Préd." : "Pred."}</th>
                  <th className="text-center px-3 py-3">{isFr ? "Score" : "Score"}</th>
                  <th className="text-center px-3 py-3">{isFr ? "Conf." : "Conf."}</th>
                  <th className="text-center px-3 py-3">1X2</th>
                  <th className="text-center px-3 py-3">O1.5</th>
                  <th className="text-center px-3 py-3">O2.5</th>
                  <th className="text-center px-3 py-3">BTTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentResults.map((r) => {
                  const predLabel = r.prediction === "1" ? (isFr ? "Dom." : "Home") : r.prediction === "2" ? (isFr ? "Ext." : "Away") : "Nul";
                  return (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 text-xs">
                          {r.fixtures ? `${r.fixtures.home_team} vs ${r.fixtures.away_team}` : `Match #${r.fixture_id}`}
                        </p>
                        {r.match_date && (
                          <p className="text-gray-400 text-xs">
                            {new Date(r.match_date).toLocaleDateString(isFr ? "fr-FR" : "en-GB", { day: "numeric", month: "short" })}
                          </p>
                        )}
                      </td>
                      <td className="text-center px-3 py-3 text-xs font-medium text-gray-600">{predLabel}</td>
                      <td className="text-center px-3 py-3 text-xs font-bold text-gray-900">
                        {r.home_score ?? "?"}-{r.away_score ?? "?"}
                      </td>
                      <td className="text-center px-3 py-3">
                        {r.confidence !== null ? (
                          <span className={`text-xs font-semibold ${rateColor(r.confidence!)}`}>{r.confidence}%</span>
                        ) : <span className="text-gray-300">—</span>}
                      </td>
                      {/* 1X2 */}
                      <td className="text-center px-3 py-3">
                        {r.is_correct
                          ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                          : <XCircle className="w-4 h-4 text-red-400 mx-auto" />}
                      </td>
                      {/* Over 1.5 */}
                      <td className="text-center px-3 py-3">
                        {r.over15_correct === null ? <span className="text-gray-300 text-xs">—</span>
                          : r.over15_correct
                          ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                          : <XCircle className="w-4 h-4 text-red-400 mx-auto" />}
                      </td>
                      {/* Over 2.5 */}
                      <td className="text-center px-3 py-3">
                        {r.over25_correct === null ? <span className="text-gray-300 text-xs">—</span>
                          : r.over25_correct
                          ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                          : <XCircle className="w-4 h-4 text-red-400 mx-auto" />}
                      </td>
                      {/* BTTS */}
                      <td className="text-center px-3 py-3">
                        {r.btts_correct === null ? <span className="text-gray-300 text-xs">—</span>
                          : r.btts_correct
                          ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" />
                          : <XCircle className="w-4 h-4 text-red-400 mx-auto" />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {stats.recentResults.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">
            {isFr ? "Aucun résultat enregistré pour l'instant." : "No results recorded yet."}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {isFr
              ? "Les résultats sont mis à jour chaque soir à 23h après la fin des matchs."
              : "Results are updated every evening at 11PM after matches finish."}
          </p>
        </div>
      )}

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: isFr ? "Performance IA PronoFoot" : "PronoFoot AI Performance",
            description: isFr
              ? `Taux de réussite global : ${stats.overall.rate}% sur ${stats.overall.total} prédictions`
              : `Overall win rate: ${stats.overall.rate}% across ${stats.overall.total} predictions`,
            url: `https://parifoot.online/${params.locale}/stats`,
          }),
        }}
      />
    </div>
  );
}
