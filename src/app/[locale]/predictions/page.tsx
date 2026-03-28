import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { TrendingUp, Send, Zap } from "lucide-react";
import MatchCard from "@/components/predictions/MatchCard";
import AffiliateCTA from "@/components/ui/AffiliateCTA";
import { COVERED_LEAGUES, siteConfig } from "@/lib/config";
import { getTodaysMatches, matchToCardProps } from "@/lib/data";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const isFr = params.locale === "fr";
  return {
    title: isFr
      ? "Pronostics Football Aujourd'hui - Prédictions IA"
      : "Football Predictions Today - AI Predictions",
    description: isFr
      ? "Pronostics football du jour par intelligence artificielle. Analyses détaillées, cotes, et scores prévus pour chaque match."
      : "Today's AI football predictions. Detailed analysis, odds, and predicted scores for every match.",
    alternates: {
      canonical: `/${params.locale}/predictions`,
      languages: {
        fr: "/fr/predictions",
        en: "/en/predictions",
        "x-default": "/fr/predictions",
      },
    },
  };
}

export default async function PredictionsPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("predictions");
  const tc = await getTranslations("common");
  const locale = params.locale;
  const isFr = locale === "fr";

  const matches = await getTodaysMatches();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-6 h-6 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
        </div>
        <p className="text-gray-500">{t("subtitle")}</p>
        <p className="text-sm text-gray-400 mt-1">
          {new Date().toLocaleDateString(isFr ? "fr-FR" : "en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* League Filter Tags — static for now, will be interactive in Phase 2 */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button className="px-3 py-1.5 rounded-full bg-emerald-600 text-white text-sm font-medium">
          {isFr ? "Tous" : "All"} ({matches.length})
        </button>
        {COVERED_LEAGUES.slice(0, 6).map((league) => {
          const count = matches.filter(
            (m) => m.league_name === league.name
          ).length;
          if (count === 0) return null;
          return (
            <button
              key={league.id}
              className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50"
            >
              {league.flag} {league.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Mid-page Affiliate Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-white">
          <p className="font-bold text-lg">
            {isFr
              ? "Placez vos paris avec les meilleures cotes"
              : "Place your bets with the best odds"}
          </p>
          <p className="text-emerald-100 text-sm">
            {isFr
              ? "Ouvrez votre compte 1xBet et profitez d'un bonus de bienvenue"
              : "Open your 1xBet account and enjoy a welcome bonus"}
          </p>
        </div>
        <AffiliateCTA
          text={tc("betNow")}
          variant="banner"
          campaign="predictions_banner"
        />
      </div>

      {/* Match Grid */}
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              {...matchToCardProps(match)}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl mb-10">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            {isFr
              ? "Aucun match disponible pour aujourd'hui"
              : "No matches available for today"}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {isFr
              ? "Les pronostics sont mis a jour chaque matin"
              : "Predictions are updated every morning"}
          </p>
        </div>
      )}

      {/* Telegram channels strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        <a
          href={siteConfig.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-3.5 transition-colors"
        >
          <Send className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">
              {isFr ? "Tips gratuits sur Telegram" : "Free tips on Telegram"}
            </p>
            <p className="text-blue-200 text-xs">@pronofootai</p>
          </div>
          <span className="ml-auto">→</span>
        </a>
        <a
          href={siteConfig.telegramVip}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl px-5 py-3.5 transition-colors"
        >
          <Zap className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">
              {isFr ? "Analyses VIP Telegram" : "VIP Analysis on Telegram"}
            </p>
            <p className="text-amber-100 text-xs">@pronofootaivip</p>
          </div>
          <span className="ml-auto">→</span>
        </a>
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <AffiliateCTA
          text={
            isFr
              ? "Parier ces pronostics sur 1xBet"
              : "Bet these predictions on 1xBet"
          }
          variant="primary"
          campaign="predictions_bottom"
        />
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: isFr
              ? "Pronostics Football du Jour"
              : "Today's Football Predictions",
            description: isFr
              ? "Pronostics IA pour les matchs de football d'aujourd'hui"
              : "AI predictions for today's football matches",
            url: `https://parifoot.online/${locale}/predictions`,
            isPartOf: {
              "@type": "WebSite",
              name: "PronoFoot AI",
              url: "https://parifoot.online",
            },
          }),
        }}
      />
    </div>
  );
}
