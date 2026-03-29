import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import {
  Zap,
  FileText,
  Ticket,
  ArrowRight,
  Target,
  Send,
} from "lucide-react";
import AffiliateCTA from "@/components/ui/AffiliateCTA";
import MatchCard from "@/components/predictions/MatchCard";
import SpinWheel from "@/components/spin/SpinWheel";
import ReferralTracker from "@/components/spin/ReferralTracker";
import { siteConfig } from "@/lib/config";
import { getTodaysMatches, getTodaysTickets, matchToCardProps, getWinRateStats } from "@/lib/data";

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const locale = params.locale;
  const isFr = locale === "fr";

  const [matches, tickets, winStats] = await Promise.all([
    getTodaysMatches(),
    getTodaysTickets(),
    getWinRateStats(),
  ]);

  const topMatches = matches.slice(0, 4);
  const freeTicket = tickets.find((t) => t.is_free) ?? null;

  return (
    <div>
      {/* ============ HERO SECTION ============ */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-48 h-48 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-white/90 text-sm font-medium">
                {isFr
                  ? "Alimenté par l'Intelligence Artificielle"
                  : "Powered by Artificial Intelligence"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              {t("heroTitle")}
            </h1>

            <p className="text-lg md:text-xl text-emerald-100 mb-8 max-w-2xl">
              {t("heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/predictions`}
                className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors text-lg"
              >
                {t("heroCta")}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <AffiliateCTA
                text={tc("betNow")}
                variant="banner"
                campaign="hero"
                className="justify-center"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-12 max-w-md">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">
                {winStats.overall.total > 0 ? `${winStats.overall.rate}%` : "—"}
              </p>
              <p className="text-emerald-200 text-sm">{t("statsWinRate")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">
                {matches.length > 0 ? `${matches.length}+` : "500+"}
              </p>
              <p className="text-emerald-200 text-sm">{t("statsMatches")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">
                {winStats.overall.total > 0 ? winStats.overall.total : "—"}
              </p>
              <p className="text-emerald-200 text-sm">{t("statsPredictions")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TODAY'S TOP PICKS ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t("featuredTitle")}
            </h2>
            <p className="text-gray-500 mt-1">
              {new Date().toLocaleDateString(isFr ? "fr-FR" : "en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <Link
            href={`/${locale}/predictions`}
            className="text-emerald-600 font-medium flex items-center gap-1 hover:text-emerald-700"
          >
            {tc("viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {topMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topMatches.map((match) => (
              <MatchCard
                key={match.id}
                {...matchToCardProps(match)}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <p className="text-gray-500 text-lg">
              {isFr
                ? "Aucun match disponible pour aujourd'hui. Revenez demain !"
                : "No matches available today. Check back tomorrow!"}
            </p>
          </div>
        )}
      </section>

      {/* ============ FREE TICKET CODE PREVIEW ============ */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-full px-4 py-1.5 mb-4">
              <Ticket className="w-4 h-4" />
              <span className="text-sm font-semibold">{tc("free")}</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("ticketTitle")}
            </h2>
            <p className="text-gray-500 mb-8">{t("ticketDesc")}</p>

            <div className="bg-gradient-to-br from-emerald-50 to-gray-50 rounded-2xl border-2 border-emerald-200 p-6 mb-6">
              {freeTicket ? (
                <>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {isFr ? "Code de Reservation" : "Booking Code"}
                  </p>
                  <p className="text-4xl font-mono font-bold text-gray-900 tracking-widest mb-4">
                    {freeTicket.booking_code}
                  </p>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                    {freeTicket.match_count && (
                      <>
                        <span>
                          {freeTicket.match_count}{" "}
                          {isFr ? "matchs" : "matches"}
                        </span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      </>
                    )}
                    <span>
                      {isFr ? "Cotes" : "Odds"}: {freeTicket.total_odds.toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-gray-400 py-4">
                  {isFr
                    ? "Code disponible bientot..."
                    : "Code available soon..."}
                </p>
              )}
              <AffiliateCTA
                text={tc("openSlip")}
                variant="primary"
                campaign="free_ticket"
              />
            </div>

            <Link
              href={`/${locale}/tickets`}
              className="text-emerald-600 font-medium hover:text-emerald-700"
            >
              {isFr
                ? "Voir tous les tickets du jour →"
                : "View all today's tickets →"}
            </Link>
          </div>
        </div>
      </section>

      {/* ============ SPIN WHEEL ============ */}
      <SpinWheel locale={locale} />

      {/* ============ REFERRAL TRACKER (handles ?ref= param) ============ */}
      <Suspense fallback={null}>
        <ReferralTracker locale={locale} />
      </Suspense>

      {/* ============ FEATURES GRID ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href={`/${locale}/rapport-du-jour`}
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {t("reportTitle")}
            </h3>
            <p className="text-gray-500 text-sm">{t("reportDesc")}</p>
          </Link>

          <Link
            href={`/${locale}/tickets`}
            className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Ticket className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {t("ticketTitle")}
            </h3>
            <p className="text-gray-500 text-sm">{t("ticketDesc")}</p>
          </Link>

          <Link
            href={`/${locale}/vip`}
            className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-6 hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Crown className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {t("vipTitle")}
            </h3>
            <p className="text-gray-500 text-sm">{t("vipDesc")}</p>
          </Link>
        </div>
      </section>

      {/* ============ VIP UPSELL SECTION ============ */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <Crown className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              {isFr ? "Passez au Niveau Supérieur" : "Level Up Your Betting"}
            </h2>
            <p className="text-gray-400 mb-8">
              {isFr
                ? "5 codes tickets premium par jour. Des paris sûrs aux cotes extrêmes. Annulez à tout moment."
                : "5 premium ticket codes daily. From safe bets to extreme odds. Cancel anytime."}
            </p>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-8">
              <div className="text-5xl font-bold text-white mb-2">
                {isFr ? `${siteConfig.vipPrice.classique.weeklyFcfa.toLocaleString()} FCFA` : `$${siteConfig.vipPrice.classique.weeklyUsd}`}
                <span className="text-lg text-gray-400 font-normal">
                  /{isFr ? "semaine" : "week"}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                {isFr ? `~$${siteConfig.vipPrice.classique.weeklyUsd} USD/semaine` : `~${siteConfig.vipPrice.classique.weeklyFcfa.toLocaleString()} FCFA/week`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto mb-8">
              {[
                isFr ? "5 codes tickets quotidiens" : "5 daily ticket codes",
                isFr ? "Vrais codes 1xBet" : "Real 1xBet booking codes",
                isFr ? "Analyse IA complete" : "Full AI analysis",
                isFr ? "Alertes Telegram VIP" : "VIP Telegram alerts",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Target className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/vip`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-8 py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all text-lg shadow-lg shadow-amber-500/25"
            >
              <Crown className="w-5 h-5" />
              {isFr ? "S'abonner VIP" : "Subscribe VIP"}
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TELEGRAM CTA ============ */}
      <section className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-white">
              <Send className="w-6 h-6" />
              <div>
                <p className="font-bold">
                  {isFr
                    ? "Rejoignez notre canal Telegram"
                    : "Join our Telegram channel"}
                </p>
                <p className="text-blue-100 text-sm">
                  {isFr
                    ? "Pronostics gratuits et alertes en temps réel"
                    : "Free predictions and real-time alerts"}
                </p>
              </div>
            </div>
            <a
              href={siteConfig.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-blue-600 font-bold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
            >
              {tc("joinTelegram")} →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function Crown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}
