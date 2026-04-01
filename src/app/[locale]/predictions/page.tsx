import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { TrendingUp, Send, Zap } from "lucide-react";
import MatchCard from "@/components/predictions/MatchCard";
import AffiliateCTA from "@/components/ui/AffiliateCTA";
import { siteConfig } from "@/lib/config";
import { getTodaysMatches, matchToCardProps, groupMatchesByLeague } from "@/lib/data";

// Force dynamic rendering — predictions must be fresh on every request
export const dynamic = "force-dynamic";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const isFr = params.locale === "fr";
  return {
    title: isFr
      ? "Pronostics Football Aujourd'hui - Pr\u00e9dictions IA"
      : "Football Predictions Today - AI Predictions",
    description: isFr
      ? "Pronostics football du jour par intelligence artificielle. Analyses d\u00e9taill\u00e9es, cotes, et scores pr\u00e9vus pour chaque match."
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
  const leagueGroups = groupMatchesByLeague(matches);
  const predictedCount = matches.filter((m) => !!m.tip).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>
            {new Date().toLocaleDateString(isFr ? "fr-FR" : "en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="text-gray-300">|</span>
          <span className="font-medium text-gray-700">{matches.length} {isFr ? "matchs" : "matches"}</span>
          <span className="text-gray-300">|</span>
          <span className="text-emerald-600 font-medium">{predictedCount} {isFr ? "pr\u00e9dits" : "predicted"}</span>
        </div>
      </div>

      {/* Table header (desktop) */}
      <div className="hidden sm:flex items-center px-4 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg text-xs font-medium text-gray-500 uppercase tracking-wider gap-2">
        <div className="w-14 text-center">{isFr ? "Heure" : "Time"}</div>
        <div className="flex-1 text-right">{isFr ? "Domicile" : "Home"}</div>
        <div className="w-16 text-center">Score</div>
        <div className="flex-1 text-left">{isFr ? "Ext\u00e9rieur" : "Away"}</div>
        <div className="w-10 text-center">Tip</div>
        <div className="w-20 text-center">Conf.</div>
        <div className="w-28 text-center">1 / X / 2</div>
        <div className="w-24 text-right">Best Pick</div>
      </div>

      {/* League groups */}
      {leagueGroups.length > 0 ? (
        <div className="bg-white rounded-b-lg border border-t-0 border-gray-200 divide-y divide-gray-100 mb-8">
          {leagueGroups.map((group) => (
            <div key={group.leagueName}>
              {/* League header */}
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50/70 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  {group.leagueName}
                </span>
                <span className="text-xs text-gray-400">{group.matches.length}</span>
              </div>
              {/* Matches */}
              {group.matches.map((match) => (
                <MatchCard
                  key={match.id}
                  {...matchToCardProps(match)}
                  locale={locale}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200 mb-8">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">
            {isFr ? "Aucun match disponible pour aujourd'hui" : "No matches available for today"}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {isFr ? "Les pronostics sont mis \u00e0 jour chaque matin" : "Predictions are updated every morning"}
          </p>
        </div>
      )}

      {/* Affiliate Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-white">
          <p className="font-bold">{isFr ? "Placez vos paris avec les meilleures cotes" : "Place your bets with the best odds"}</p>
          <p className="text-emerald-100 text-sm">{isFr ? "Ouvrez votre compte 1xBet et profitez d'un bonus" : "Open your 1xBet account and enjoy a welcome bonus"}</p>
        </div>
        <AffiliateCTA text={tc("betNow")} variant="banner" campaign="predictions_banner" />
      </div>

      {/* Telegram channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <a href={siteConfig.telegram} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-3 transition-colors">
          <Send className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">{isFr ? "Tips gratuits sur Telegram" : "Free tips on Telegram"}</p>
            <p className="text-blue-200 text-xs">@pronofootai</p>
          </div>
          <span className="ml-auto">&#8594;</span>
        </a>
        <a href={siteConfig.telegramVip} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl px-5 py-3 transition-colors">
          <Zap className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">{isFr ? "Analyses VIP Telegram" : "VIP Analysis on Telegram"}</p>
            <p className="text-amber-100 text-xs">@pronofootaivip</p>
          </div>
          <span className="ml-auto">&#8594;</span>
        </a>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: isFr ? "Pronostics Football du Jour" : "Today's Football Predictions",
          description: isFr ? "Pronostics IA pour les matchs de football d'aujourd'hui" : "AI predictions for today's football matches",
          url: `https://parifoot.online/${locale}/predictions`,
          isPartOf: { "@type": "WebSite", name: "PronoFoot AI", url: "https://parifoot.online" },
        }),
      }} />
    </div>
  );
}
