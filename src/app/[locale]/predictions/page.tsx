import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { TrendingUp, Send, Zap } from "lucide-react";
import MatchCard from "@/components/predictions/MatchCard";
import PromoBanner from "@/components/ui/PromoBanner";
import { siteConfig } from "@/lib/config";
import { getTodaysMatches, matchToCardProps, groupMatchesByLeague } from "@/lib/data";

// ISR: revalidate every 2 minutes (predictions don't change every second)
export const revalidate = 120;

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
  const locale = params.locale;
  const isFr = locale === "fr";

  const matches = await getTodaysMatches();
  const leagueGroups = groupMatchesByLeague(matches);
  const predictedCount = matches.filter((m) => !!m.tip).length;

  // Predictions FAQ (visible + schema)
  const predFaqs = isFr ? [
    { q: "Comment l'IA genere-t-elle les pronostics ?", a: "Notre IA analyse plus de 500 statistiques par match : forme recente des equipes, confrontations directes, performances domicile et exterieur, buts marques et encaisses, position au classement et dynamique de momentum. Elle genere ensuite des predictions sur 7 marches avec un score de confiance." },
    { q: "A quelle heure les pronostics sont-ils disponibles ?", a: "Les pronostics sont generes chaque matin a 7h00 (heure de Douala, UTC+1). Les matchs sans prediction affichent 'En attente' jusqu'a ce que l'analyse soit terminee." },
    { q: "Que signifie le score de confiance ?", a: "Le score de confiance (0-100%) indique la force de la convergence statistique vers un resultat. Un score superieur a 70% signifie que plusieurs indicateurs pointent dans la meme direction. Le niveau de risque (Faible/Moyen/Eleve) reflete la volatilite du match." },
    { q: "Quels marches de paris sont couverts ?", a: "Nous couvrons 7 marches par match : 1X2 (resultat du match), Over 2.5 buts, Over 1.5 buts, BTTS (les deux equipes marquent), Home to Score, Away to Score et Best Pick (le pronostic avec le meilleur rapport qualite-prix)." },
  ] : [
    { q: "How does the AI generate predictions?", a: "Our AI analyzes 500+ statistics per match: recent team form, head-to-head history, home and away performance, goals scored and conceded, league position, and momentum trends. It then generates predictions across 7 markets with a confidence score." },
    { q: "What time are predictions available?", a: "Predictions are generated every morning at 7:00 AM (Douala time, UTC+1). Matches without predictions show 'Pending' until analysis is complete." },
    { q: "What does the confidence score mean?", a: "The confidence score (0-100%) indicates how strongly statistics converge toward a result. Above 70% means multiple indicators point the same way. The risk level (Low/Medium/High) reflects match volatility." },
    { q: "Which betting markets are covered?", a: "We cover 7 markets per match: 1X2 (match result), Over 2.5 goals, Over 1.5 goals, BTTS (both teams to score), Home to Score, Away to Score, and Best Pick (highest value prediction)." },
  ];

  // Predictions page JSON-LD
  const predictionsJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: isFr ? "Pronostics Football du Jour" : "Today's Football Predictions",
        description: isFr
          ? `${predictedCount} pronostics IA pour les matchs de football d'aujourd'hui sur ${matches.length} matchs.`
          : `${predictedCount} AI predictions for today's football matches out of ${matches.length} fixtures.`,
        url: `${siteConfig.url}/${locale}/predictions`,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        inLanguage: locale === "fr" ? "fr-FR" : "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: isFr ? "Accueil" : "Home", item: `${siteConfig.url}/${locale}` },
          { "@type": "ListItem", position: 2, name: isFr ? "Pronostics" : "Predictions", item: `${siteConfig.url}/${locale}/predictions` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: predFaqs.map(faq => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(predictionsJsonLd) }} />

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

      {/* 1xBet Slim Banner */}
      <div className="mb-4">
        <PromoBanner locale={locale} variant="slim" campaign="predictions_top" />
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
                <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  {group.leagueName}
                </h2>
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

      {/* 1xBet Promotional Banner */}
      <div className="mb-6">
        <PromoBanner locale={locale} variant="high-odds" campaign="predictions_bonus" />
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

      {/* FAQ Section — visible on page for users + indexed by search */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{isFr ? "Questions Frequentes" : "Frequently Asked Questions"}</h2>
        <div className="space-y-4">
          {predFaqs.map((faq, i) => (
            <details key={i} className="group">
              <summary className="cursor-pointer text-sm font-semibold text-gray-800 hover:text-emerald-600 transition-colors list-none flex items-center gap-2">
                <span className="text-emerald-500 group-open:rotate-90 transition-transform">&#9654;</span>
                {faq.q}
              </summary>
              <p className="text-sm text-gray-600 mt-2 ml-5 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
