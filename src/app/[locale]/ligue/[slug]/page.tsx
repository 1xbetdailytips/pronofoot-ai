import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { COVERED_LEAGUES, siteConfig } from "@/lib/config";
import { supabase } from "@/lib/supabase";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function fixtureSlug(f: { home_team: string; away_team: string; id: string }): string {
  return `${toSlug(f.home_team)}-vs-${toSlug(f.away_team)}-${f.id}`;
}

function findLeague(slug: string) {
  return COVERED_LEAGUES.find((l) => toSlug(l.name) === slug);
}

export function generateStaticParams() {
  return COVERED_LEAGUES.map((l) => ({ slug: toSlug(l.name) }));
}

export function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Metadata {
  const league = findLeague(params.slug);
  if (!league) return { title: "League not found" };

  const isFr = params.locale === "fr";
  return {
    title: isFr
      ? `Pronostics ${league.name} - Prédictions IA`
      : `${league.name} Predictions - AI Football Tips`,
    description: isFr
      ? `Pronostics et analyses IA pour la ${league.name}. Prédictions, statistiques et meilleur pari pour chaque match.`
      : `AI predictions and analysis for ${league.name}. Predictions, stats, and best bets for every match.`,
    alternates: {
      canonical: `/${params.locale}/ligue/${params.slug}`,
      languages: {
        fr: `/fr/ligue/${params.slug}`,
        en: `/en/ligue/${params.slug}`,
        "x-default": `/fr/ligue/${params.slug}`,
      },
    },
  };
}

export default async function LeaguePage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const league = findLeague(params.slug);
  if (!league) notFound();

  const locale = params.locale;
  const isFr = locale === "fr";

  // Get upcoming fixtures for this league
  const today = new Date().toISOString().split("T")[0];
  const { data: fixtures } = await supabase
    .from("fixtures")
    .select("id, home_team, away_team, match_date, status, home_score, away_score, league_name")
    .eq("league_name", league.name)
    .gte("match_date", today + "T00:00:00")
    .order("match_date", { ascending: true })
    .limit(20);

  // Get recent results for this league
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
  const { data: recentFixtures } = await supabase
    .from("fixtures")
    .select("id, home_team, away_team, match_date, status, home_score, away_score")
    .eq("league_name", league.name)
    .lt("match_date", today + "T00:00:00")
    .gte("match_date", weekAgo + "T00:00:00")
    .order("match_date", { ascending: false })
    .limit(10);

  // Get blog articles for this league
  const { data: articles } = await supabase
    .from("seo_articles")
    .select("slug, title_fr, title_en, published_at, article_type")
    .eq("published", true)
    .ilike("target_keyword", `%${league.name}%`)
    .order("published_at", { ascending: false })
    .limit(5);

  // League descriptions
  const descriptions: Record<string, { fr: string; en: string }> = {
    "MTN Elite One": {
      fr: "La MTN Elite One est le championnat de football le plus prestigieux du Cameroun. Suivez nos pronostics IA pour chaque match de la saison.",
      en: "MTN Elite One is Cameroon's premier football championship. Follow our AI predictions for every match of the season.",
    },
    "MTN Elite Two": {
      fr: "La MTN Elite Two est la deuxième division du football camerounais. Nos algorithmes analysent chaque rencontre pour des pronostics fiables.",
      en: "MTN Elite Two is Cameroon's second division. Our algorithms analyze every match for reliable predictions.",
    },
    "Premier League": {
      fr: "La Premier League est le championnat le plus regardé au monde. Nos modèles IA analysent chaque match pour des pronostics de qualité.",
      en: "The Premier League is the world's most watched football league. Our AI models analyze every match for quality predictions.",
    },
    "Champions League": {
      fr: "La Ligue des Champions de l'UEFA est la plus grande compétition de clubs au monde. Analyses IA pour chaque match de la compétition.",
      en: "The UEFA Champions League is the world's greatest club competition. AI analysis for every match.",
    },
    "CAF Champions League": {
      fr: "La Ligue des Champions de la CAF est le sommet du football de clubs africain. Pronostics IA pour chaque rencontre continentale.",
      en: "The CAF Champions League is the pinnacle of African club football. AI predictions for every continental match.",
    },
    "Africa Cup of Nations": {
      fr: "La Coupe d'Afrique des Nations est la plus grande compétition de football du continent. Analyses IA pour chaque match de la CAN.",
      en: "The Africa Cup of Nations is the continent's greatest football competition. AI analysis for every AFCON match.",
    },
  };

  const desc = descriptions[league.name];
  const leagueDesc = desc
    ? (isFr ? desc.fr : desc.en)
    : (isFr
        ? `Pronostics et analyses IA pour tous les matchs de ${league.name}.`
        : `AI predictions and analysis for all ${league.name} matches.`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SportsOrganization",
        name: league.name,
        sport: "Football",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isFr ? "Accueil" : "Home",
            item: `${siteConfig.url}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: league.name,
          },
        ],
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{league.flag}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isFr ? `Pronostics ${league.name}` : `${league.name} Predictions`}
            </h1>
            <p className="text-sm text-gray-500">{league.country}</p>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{leagueDesc}</p>
      </header>

      {/* Upcoming Fixtures */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-600" />
          {isFr ? "Prochains Matchs" : "Upcoming Matches"}
        </h2>
        {(!fixtures || fixtures.length === 0) ? (
          <p className="text-gray-500 text-sm">
            {isFr ? "Aucun match programm\u00e9 pour le moment." : "No upcoming matches scheduled."}
          </p>
        ) : (
          <div className="space-y-2">
            {fixtures.map((f) => {
              const matchDate = new Date(f.match_date).toLocaleDateString(
                isFr ? "fr-FR" : "en-US",
                { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }
              );
              return (
                <Link
                  key={f.id}
                  href={`/${locale}/predictions/${fixtureSlug(f)}`}
                  className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-white text-sm">
                      {f.home_team} vs {f.away_team}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">{matchDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium">
                      {isFr ? "Voir pronostic" : "View prediction"}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent Results */}
      {recentFixtures && recentFixtures.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            {isFr ? "R\u00e9sultats R\u00e9cents" : "Recent Results"}
          </h2>
          <div className="space-y-2">
            {recentFixtures.map((f) => {
              const matchDate = new Date(f.match_date).toLocaleDateString(
                isFr ? "fr-FR" : "en-US",
                { day: "numeric", month: "short" }
              );
              return (
                <div
                  key={f.id}
                  className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3"
                >
                  <span className="text-sm text-gray-900 dark:text-white">
                    {f.home_team} <strong>{f.home_score ?? "?"} - {f.away_score ?? "?"}</strong> {f.away_team}
                  </span>
                  <span className="text-xs text-gray-400">{matchDate}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Articles */}
      {articles && articles.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            {isFr ? "Articles & Analyses" : "Articles & Analysis"}
          </h2>
          <div className="space-y-2">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/${locale}/blog/${a.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:border-emerald-300 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {isFr ? a.title_fr : (a.title_en || a.title_fr)}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  {new Date(a.published_at).toLocaleDateString(isFr ? "fr-FR" : "en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-6 text-center">
        <p className="font-semibold text-gray-900 dark:text-white mb-2">
          {isFr
            ? `Tous nos pronostics ${league.name}`
            : `All our ${league.name} predictions`}
        </p>
        <Link
          href={`/${locale}/predictions`}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium mt-2"
        >
          {isFr ? "Voir tous les pronostics" : "View all predictions"}
        </Link>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
