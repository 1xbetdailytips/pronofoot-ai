import type { Metadata } from "next";
import Link from "next/link";
import { Brain, BarChart3, Zap, Target, CheckCircle, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { getWinRateStats } from "@/lib/data";

// ISR: revalidate every 10 minutes
export const revalidate = 600;

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isFr = params.locale === "fr";
  return {
    title: isFr
      ? "Comment Fonctionne Notre IA — PronoFoot AI"
      : "How Our AI Works — PronoFoot AI",
    description: isFr
      ? "Decouvrez comment PronoFoot AI analyse plus de 500 statistiques par match pour generer des pronostics football fiables. Methodologie, transparence et resultats verifies."
      : "Discover how PronoFoot AI analyzes 500+ statistics per match to generate reliable football predictions. Methodology, transparency, and verified results.",
    alternates: {
      canonical: `/${params.locale}/about`,
      languages: {
        fr: "/fr/about",
        en: "/en/about",
        "x-default": "/fr/about",
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;
  const isFr = locale === "fr";
  const stats = await getWinRateStats();

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        url: `${siteConfig.url}/${locale}/about`,
        name: isFr ? "Comment Fonctionne PronoFoot AI" : "How PronoFoot AI Works",
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": `${siteConfig.url}/#organization` },
        inLanguage: isFr ? "fr-FR" : "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: isFr ? "Accueil" : "Home", item: `${siteConfig.url}/${locale}` },
          { "@type": "ListItem", position: 2, name: isFr ? "A Propos" : "About", item: `${siteConfig.url}/${locale}/about` },
        ],
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }} />

      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
          <Brain className="w-4 h-4" />
          {isFr ? "Notre Methodologie" : "Our Methodology"}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          {isFr
            ? "Comment PronoFoot AI Analyse le Football"
            : "How PronoFoot AI Analyzes Football"}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {isFr
            ? "Pas de feeling. Pas de pari a l'aveugle. Juste 500+ statistiques par match, analysees par intelligence artificielle, chaque matin."
            : "No gut feeling. No blind betting. Just 500+ stats per match, analyzed by artificial intelligence, every morning."}
        </p>
      </div>

      {/* Live Stats Banner */}
      {stats.overall.total > 0 && (
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 mb-12 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">{stats.overall.rate}%</p>
              <p className="text-emerald-200 text-sm">{isFr ? "Taux de reussite" : "Win Rate"}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.overall.total}</p>
              <p className="text-emerald-200 text-sm">{isFr ? "Predictions verifiees" : "Verified Predictions"}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">7</p>
              <p className="text-emerald-200 text-sm">{isFr ? "Marches couverts" : "Markets Covered"}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-emerald-200 text-sm">{isFr ? "Stats par match" : "Stats per Match"}</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Link href={`/${locale}/stats`} className="text-sm text-emerald-200 hover:text-white underline">
              {isFr ? "Voir toutes les statistiques de performance" : "View all performance statistics"} &rarr;
            </Link>
          </div>
        </div>
      )}

      {/* The Story */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isFr ? "L'Histoire" : "The Story"}
        </h2>
        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-4">
          <p>
            {isFr
              ? "PronoFoot AI est ne d'une observation simple : la plupart des parieurs africains parient sur l'instinct. Ils suivent leur equipe de coeur, ecoutent le tipster du quartier, ou copient le code ticket d'un ami. Certains gagnent. La plupart perdent. Et personne ne suit vraiment les resultats."
              : "PronoFoot AI was born from a simple observation: most African bettors bet on instinct. They follow their favorite team, listen to the neighborhood tipster, or copy a friend's ticket code. Some win. Most lose. And nobody actually tracks the results."}
          </p>
          <p>
            {isFr
              ? "Nous avons decide de changer ca. Pas avec des promesses, mais avec des donnees. Notre systeme analyse chaque match avec la rigueur d'un statisticien et la vitesse d'une machine. Chaque pronostic est suivi, chaque resultat est enregistre, et tout est public."
              : "We decided to change that. Not with promises, but with data. Our system analyzes every match with the rigor of a statistician and the speed of a machine. Every prediction is tracked, every result is recorded, and everything is public."}
          </p>
          <p>
            {isFr
              ? "Construit au Cameroun, pour le Cameroun et toute l'Afrique francophone. Parce que les parieurs de Douala meritent les memes outils que ceux de Londres."
              : "Built in Cameroon, for Cameroon and all of French-speaking Africa. Because bettors in Douala deserve the same tools as those in London."}
          </p>
        </div>
      </section>

      {/* How It Works — 4 Steps */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {isFr ? "Comment Ca Marche" : "How It Works"}
        </h2>
        <div className="space-y-6">
          {[
            {
              icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
              time: "06:00",
              title: isFr ? "Collecte des Donnees" : "Data Collection",
              desc: isFr
                ? "Chaque matin a 6h, notre systeme recupere automatiquement toutes les rencontres du jour via API-Football Pro : forme des equipes sur les 5-10 derniers matchs, historique des confrontations directes, performances domicile/exterieur, buts marques et encaisses, classements et dynamique de momentum."
                : "Every morning at 6am, our system automatically fetches all fixtures via API-Football Pro: team form over the last 5-10 matches, head-to-head history, home/away performance, goals scored and conceded, standings, and momentum trends.",
            },
            {
              icon: <Brain className="w-6 h-6 text-purple-600" />,
              time: "07:00",
              title: isFr ? "Analyse par l'IA" : "AI Analysis",
              desc: isFr
                ? "A 7h, Claude (le modele d'IA d'Anthropic) analyse chaque match en croisant plus de 500 points de donnees. L'IA evalue les probabilites pour chaque resultat possible, calcule un score de confiance (0-100%) et determine un niveau de risque (Faible/Moyen/Eleve). Aucune intervention humaine dans les predictions."
                : "At 7am, Claude (Anthropic's AI model) analyzes each match by cross-referencing 500+ data points. The AI evaluates probabilities for each possible outcome, calculates a confidence score (0-100%), and determines a risk level (Low/Medium/High). No human intervention in predictions.",
            },
            {
              icon: <Target className="w-6 h-6 text-emerald-600" />,
              time: "07:00",
              title: isFr ? "7 Marches par Match" : "7 Markets per Match",
              desc: isFr
                ? "Pour chaque match, l'IA genere des predictions sur 7 marches : 1X2 (resultat du match), Over 2.5 buts, Over 1.5 buts, BTTS (les deux equipes marquent), Home to Score (domicile marque), Away to Score (exterieur marque), et le Best Pick (meilleur rapport qualite-prix)."
                : "For each match, the AI generates predictions across 7 markets: 1X2 (match result), Over 2.5 goals, Over 1.5 goals, BTTS (both teams to score), Home to Score, Away to Score, and Best Pick (highest value prediction).",
            },
            {
              icon: <CheckCircle className="w-6 h-6 text-amber-600" />,
              time: "23:00",
              title: isFr ? "Verification Automatique" : "Automatic Verification",
              desc: isFr
                ? "A 23h, le systeme verifie automatiquement les scores finaux via API-Football. Chaque pronostic est marque WIN ou LOSS, et les resultats sont enregistres dans la base de donnees pour les 7 marches. Rien n'est cache, rien n'est modifie apres coup. La page Stats affiche tout en temps reel."
                : "At 11pm, the system automatically checks final scores via API-Football. Every prediction is marked WIN or LOSS, and results are logged to the database across all 7 markets. Nothing is hidden, nothing is modified after the fact. The Stats page shows everything in real-time.",
            },
          ].map((step, i) => (
            <div key={i} className="flex gap-4 bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex-shrink-0 mt-1">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{step.time}</span>
                  <h3 className="font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Transparency Philosophy */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isFr ? "Transparence Totale" : "Total Transparency"}
        </h2>
        <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed space-y-4">
          <p>
            {isFr
              ? "Dans un monde de tipsters autoproclammes qui montrent leurs gains et cachent leurs pertes, nous avons fait un choix radical : tout montrer. Chaque prediction est suivie. Chaque resultat est public. Nos taux de reussite ne sont pas des slogans marketing — ce sont des chiffres verifies automatiquement par notre systeme."
              : "In a world of self-proclaimed tipsters who show their wins and hide their losses, we made a radical choice: show everything. Every prediction is tracked. Every result is public. Our win rates aren't marketing slogans — they're numbers automatically verified by our system."}
          </p>
          <p>
            {isFr
              ? "Visitez notre page Stats n'importe quand. Vous verrez le taux de reussite global, par marche, par niveau de confiance, par niveau de risque, et les 20 derniers resultats detailles. Si l'IA se trompe, ca se voit. Si elle est en serie de victoires, ca se voit aussi."
              : "Visit our Stats page anytime. You'll see the overall win rate, by market, by confidence tier, by risk level, and the last 20 detailed results. If the AI is wrong, you'll see it. If it's on a winning streak, you'll see that too."}
          </p>
        </div>
        <div className="mt-4 flex gap-3">
          <Link href={`/${locale}/stats`} className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors">
            <BarChart3 className="w-4 h-4" />
            {isFr ? "Voir les Stats" : "View Stats"}
          </Link>
          <Link href={`/${locale}/predictions`} className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
            {isFr ? "Pronostics du Jour" : "Today's Predictions"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Tech Stack — For E-E-A-T */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isFr ? "Notre Stack Technique" : "Our Tech Stack"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: isFr ? "Modele IA" : "AI Model", value: "Claude (Anthropic)", desc: isFr ? "Analyse des matchs et generation des pronostics" : "Match analysis and prediction generation" },
            { label: isFr ? "Source de Donnees" : "Data Source", value: "API-Football Pro", desc: isFr ? "7 500 requetes/jour, donnees en temps reel" : "7,500 requests/day, real-time data" },
            { label: isFr ? "Base de Donnees" : "Database", value: "PostgreSQL (Supabase)", desc: isFr ? "Stockage securise de tous les pronostics et resultats" : "Secure storage of all predictions and results" },
            { label: isFr ? "Hebergement" : "Hosting", value: "Vercel + Railway", desc: isFr ? "Infrastructure fiable, deploiement automatique" : "Reliable infrastructure, automatic deployment" },
          ].map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{item.label}</p>
              <p className="font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leagues Covered */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {isFr ? "Championnats Couverts" : "Leagues Covered"}
        </h2>
        <p className="text-gray-600 mb-4">
          {isFr
            ? "Notre IA couvre les championnats camerounais, les grandes ligues europeennes et les competitions continentales africaines :"
            : "Our AI covers Cameroonian leagues, top European leagues, and African continental competitions:"}
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "MTN Elite One", "MTN Elite Two", "Premier League", "La Liga", "Ligue 1",
            "Serie A", "Bundesliga", "Champions League", "Europa League",
            "CAF Champions League", "Coupe d'Afrique des Nations",
          ].map((league) => (
            <span key={league} className="bg-white border border-gray-200 rounded-full px-3 py-1.5 text-sm text-gray-700 font-medium">
              {league}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 text-center border border-emerald-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isFr ? "Pret a Parier Plus Intelligemment ?" : "Ready to Bet Smarter?"}
        </h2>
        <p className="text-gray-600 mb-6">
          {isFr
            ? "Consultez les pronostics du jour et voyez l'IA en action."
            : "Check today's predictions and see the AI in action."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={`/${locale}/predictions`} className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
            {isFr ? "Voir les Pronostics" : "View Predictions"}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href={`/${locale}/vip`} className="inline-flex items-center justify-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors">
            <Zap className="w-4 h-4" />
            {isFr ? "Passer VIP" : "Go VIP"}
          </Link>
        </div>
      </section>
    </div>
  );
}
