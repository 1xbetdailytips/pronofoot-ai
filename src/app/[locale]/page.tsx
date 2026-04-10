import { Suspense } from "react";
import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";

// ISR: revalidate every 2 minutes (was force-dynamic — every request hit DB)
export const revalidate = 120;

import {
  Zap,
  FileText,
  Ticket,
  ArrowRight,
  Target,
  Send,
  TrendingUp,
  Shield,
  BarChart3,
} from "lucide-react";
import AffiliateCTA from "@/components/ui/AffiliateCTA";
import PromoBanner from "@/components/ui/PromoBanner";
import MatchCard from "@/components/predictions/MatchCard";
import { MostPopularBet } from "@/components/social/CrowdBacking";
import ReferralTracker from "@/components/spin/ReferralTracker";
import { siteConfig } from "@/lib/config";
import { getTodaysMatches, matchToCardProps, getWinRateStats } from "@/lib/data";

// Dynamic imports — below-the-fold heavy components (saves ~20KB initial JS)
const SpinWheel = dynamic(() => import("@/components/spin/SpinWheel"), { ssr: false });

// Homepage-specific metadata (was inheriting generic layout metadata)
export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isFr = params.locale === "fr";
  return {
    title: isFr
      ? "PronoFoot AI — Pronostics Football IA Gratuits Aujourd'hui"
      : "PronoFoot AI — Free AI Football Predictions Today",
    description: isFr
      ? "Pronostics football gratuits par intelligence artificielle. Analyses de plus de 500 stats par match, taux de reussite verifie, 7 marches couverts. Predictions quotidiennes pour tous les grands championnats."
      : "Free AI football predictions powered by 500+ stats per match. Verified win rate, 7 markets covered. Daily predictions for all major leagues.",
    alternates: {
      canonical: `/${params.locale}`,
      languages: {
        fr: "/fr",
        en: "/en",
        "x-default": "/fr",
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const locale = params.locale;
  const isFr = locale === "fr";

  const [matches, winStats] = await Promise.all([
    getTodaysMatches(),
    getWinRateStats(),
  ]);

  // Major leagues for homepage — only show the most important
  const majorLeagues = new Set([
    "Premier League", "La Liga", "Bundesliga", "Serie A", "Ligue 1",
    "Champions League", "CAF Champions League", "Europa League",
    "Elite One", "MTN Elite One", "Copa Libertadores",
    "MLS", "Liga MX", "Saudi Pro League", "Botola Pro",
    "FKF Premier League", "Premier Soccer League",
  ]);
  const majorMatches = matches.filter(m => majorLeagues.has(m.league_name) && m.tip);
  const topMatches = majorMatches.length > 0 ? majorMatches.slice(0, 6) : matches.filter(m => m.tip).slice(0, 6);

  // Homepage FAQ data (visible on page + structured data)
  const homeFaqs = isFr ? [
    { q: "Comment fonctionne PronoFoot AI ?", a: "Notre intelligence artificielle analyse plus de 500 statistiques par match (forme des equipes, historique des confrontations, performances domicile/exterieur, buts marques et encaisses) pour generer des pronostics quotidiens sur 7 marches : 1X2, Over 2.5, Over 1.5, BTTS, Home to Score, Away to Score et Best Pick." },
    { q: "Les pronostics sont-ils gratuits ?", a: "Oui, tous les pronostics de base sont gratuits et mis a jour chaque matin a 7h (heure de Douala). Les abonnes VIP recoivent des analyses approfondies et des marches exclusifs." },
    { q: "Quel est le taux de reussite de l'IA ?", a: `Notre taux de reussite global est de ${winStats.overall.rate}% sur ${winStats.overall.total} pronostics verifies. Tous les resultats sont suivis automatiquement et affiches en toute transparence sur notre page Statistiques.` },
    { q: "Quels championnats sont couverts ?", a: "Nous couvrons les championnats camerounais (MTN Elite One et Two), les grandes ligues europeennes (Premier League, La Liga, Ligue 1, Serie A, Bundesliga), la Ligue des Champions, l'Europa League, la Ligue des Champions de la CAF et la CAN." },
    { q: "Comment sont calcules les niveaux de confiance ?", a: "Chaque pronostic recoit un score de confiance (0-100%) base sur la force des preuves statistiques. Un score eleve signifie que plusieurs indicateurs convergent vers le meme resultat. Le niveau de risque (Faible/Moyen/Eleve) reflete la volatilite du match." },
  ] : [
    { q: "How does PronoFoot AI work?", a: "Our artificial intelligence analyzes 500+ statistics per match (team form, head-to-head history, home/away performance, goals scored and conceded) to generate daily predictions across 7 markets: 1X2, Over 2.5, Over 1.5, BTTS, Home to Score, Away to Score, and Best Pick." },
    { q: "Are the predictions free?", a: "Yes, all basic predictions are free and updated every morning at 7am (Douala time). VIP subscribers receive deeper analysis and exclusive markets." },
    { q: "What is the AI win rate?", a: `Our overall win rate is ${winStats.overall.rate}% across ${winStats.overall.total} verified predictions. All results are automatically tracked and displayed transparently on our Stats page.` },
    { q: "Which leagues are covered?", a: "We cover Cameroonian leagues (MTN Elite One and Two), top European leagues (Premier League, La Liga, Ligue 1, Serie A, Bundesliga), Champions League, Europa League, CAF Champions League, and AFCON." },
    { q: "How are confidence levels calculated?", a: "Each prediction receives a confidence score (0-100%) based on statistical evidence strength. A high score means multiple indicators point to the same result. The risk level (Low/Medium/High) reflects match volatility." },
  ];

  // Homepage JSON-LD: WebPage + BreadcrumbList + FAQPage
  const homepageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/${locale}/#webpage`,
        url: `${siteConfig.url}/${locale}`,
        name: isFr ? "PronoFoot AI — Pronostics Football IA Gratuits" : "PronoFoot AI — Free AI Football Predictions",
        description: isFr
          ? `Pronostics football gratuits par IA. Taux de reussite de ${winStats.overall.rate}% sur ${winStats.overall.total} predictions verifiees.`
          : `Free AI football predictions. ${winStats.overall.rate}% win rate across ${winStats.overall.total} verified predictions.`,
        isPartOf: { "@id": `${siteConfig.url}/#website` },
        about: { "@id": `${siteConfig.url}/#organization` },
        inLanguage: locale === "fr" ? "fr-FR" : "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: isFr ? "Accueil" : "Home", item: `${siteConfig.url}/${locale}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: homeFaqs.map(faq => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <div>
      {/* Homepage structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }} />

      {/* ============ HERO SECTION ============ */}
      <section className="relative overflow-hidden">
        {/* Gradient background with mesh pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900" />
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-10 left-[10%] w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-10 right-[10%] w-56 h-56 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-20 right-[30%] w-24 h-24 border border-white rounded-full" />
        </div>
        {/* Bottom fade to page bg */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl stagger-children">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-white/90 text-sm font-medium">
                {isFr
                  ? "Alimenté par l'Intelligence Artificielle"
                  : "Powered by Artificial Intelligence"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 text-balance">
              {t("heroTitle")}
            </h1>

            <p className="text-lg md:text-xl text-emerald-100/90 mb-10 max-w-2xl leading-relaxed">
              {t("heroSubtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`/${locale}/predictions`}
                className="inline-flex items-center justify-center gap-2 bg-white text-emerald-700 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors text-lg btn-press shadow-lg shadow-emerald-900/20"
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

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-6 mt-14 max-w-lg stagger-children">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {winStats.overall.total > 0 ? `${winStats.overall.rate}%` : "—"}
              </p>
              <p className="text-emerald-200/80 text-sm mt-1">{t("statsWinRate")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {matches.length > 0 ? `${matches.length}+` : "500+"}
              </p>
              <p className="text-emerald-200/80 text-sm mt-1">{t("statsMatches")}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                {winStats.overall.total > 0 ? winStats.overall.total : "—"}
              </p>
              <p className="text-emerald-200/80 text-sm mt-1">{t("statsPredictions")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 1XBET PROMO BANNER ============ */}
      <ScrollReveal direction="up" delay={100}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <PromoBanner locale={locale} variant="best-odds" campaign="home_top" />
        </section>
      </ScrollReveal>

      {/* ============ MOST POPULAR BET ============ */}
      {topMatches.length > 0 && (
        <ScrollReveal direction="up" delay={0}>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
            <MostPopularBet
              matches={topMatches.filter(m => m.tip).map(m => ({
                homeTeam: m.home_team,
                awayTeam: m.away_team,
                homeProb: m.tip!.home_prob,
                drawProb: m.tip!.draw_prob,
                awayProb: m.tip!.away_prob,
                confidence: m.tip!.confidence,
                league: m.league_name,
              }))}
              locale={locale}
            />
          </section>
        </ScrollReveal>
      )}

      {/* ============ TODAY'S TOP PICKS ============ */}
      <ScrollReveal direction="up" delay={0}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                {t("featuredTitle")}
              </h2>
              <p className="text-gray-500 mt-1.5 text-sm">
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
              className="text-emerald-600 font-semibold flex items-center gap-1.5 hover:text-emerald-700 text-sm"
            >
              {tc("viewAll")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {topMatches.length > 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
              {/* Table header (desktop) */}
              <div className="hidden sm:flex items-center px-4 py-2.5 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider gap-2">
                <div className="w-14 text-center">{isFr ? "Heure" : "Time"}</div>
                <div className="flex-1 text-right">{isFr ? "Domicile" : "Home"}</div>
                <div className="w-16 text-center">Score</div>
                <div className="flex-1 text-left">{isFr ? "Ext" : "Away"}</div>
                <div className="w-10 text-center">Tip</div>
                <div className="w-20 text-center">Conf.</div>
                <div className="w-28 text-center">1 / X / 2</div>
                <div className="w-24 text-right">Best Pick</div>
              </div>
              {topMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  {...matchToCardProps(match)}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-gray-500 text-lg">
                {isFr
                  ? "Aucun match disponible pour aujourd'hui. Revenez demain !"
                  : "No matches available today. Check back tomorrow!"}
              </p>
            </div>
          )}
        </section>
      </ScrollReveal>

      {/* ============ TICKET CODES COMING SOON ============ */}
      <ScrollReveal direction="up" delay={100}>
        <section className="bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 rounded-full px-4 py-1.5 mb-4">
                <Ticket className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {isFr ? "Bientot Disponible" : "Coming Soon"}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {t("ticketTitle")}
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                {isFr
                  ? "Des codes de reservation 1xBet generes par IA, prets a copier-coller. Lancez votre coupon en un clic."
                  : "AI-generated 1xBet booking codes, ready to copy-paste. Load your bet slip in one click."}
              </p>

              {/* Blurred preview */}
              <div className="relative max-w-xs mx-auto mb-8">
                <div className="blur-sm select-none pointer-events-none bg-gradient-to-br from-emerald-50 to-gray-50 rounded-2xl border-2 border-emerald-200 p-6">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Booking Code</p>
                  <p className="text-3xl font-mono font-bold text-gray-800 tracking-widest mt-1">K7X2M9P4</p>
                  <p className="text-sm text-gray-500 mt-2">5 matchs | Odds: 8.74</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/80 rounded-2xl flex items-center justify-center">
                  <span className="bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-amber-500/30">
                    {isFr ? "Lancement imminent" : "Launching soon"}
                  </span>
                </div>
              </div>

              <Link
                href={`/${locale}/tickets`}
                className="text-emerald-600 font-semibold hover:text-emerald-700 text-sm"
              >
                {isFr ? "En savoir plus →" : "Learn more →"}
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ============ 1XBET WELCOME BONUS BANNER ============ */}
      <ScrollReveal direction="up" delay={0}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PromoBanner locale={locale} variant="welcome-bonus" campaign="home_mid" />
        </section>
      </ScrollReveal>

      {/* ============ SPIN WHEEL ============ */}
      <SpinWheel locale={locale} />

      {/* ============ REFERRAL TRACKER (handles ?ref= param) ============ */}
      <Suspense fallback={null}>
        <ReferralTracker locale={locale} />
      </Suspense>

      {/* ============ FEATURES GRID ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ScrollReveal direction="up" delay={0}>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {isFr ? "Tout Pour Gagner" : "Everything You Need to Win"}
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">
              {isFr
                ? "Des outils IA puissants pour maximiser vos gains"
                : "Powerful AI tools to maximize your returns"}
            </p>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScrollReveal direction="up" delay={0}>
            <Link
              href={`/${locale}/rapport-du-jour`}
              className="block bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all group card-hover"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t("reportTitle")}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t("reportDesc")}</p>
            </Link>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={100}>
            <Link
              href={`/${locale}/tickets`}
              className="block bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all group relative overflow-hidden card-hover"
            >
              <div className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {isFr ? "Bientot" : "Soon"}
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Ticket className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t("ticketTitle")}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {isFr
                  ? "Codes de reservation 1xBet generes par IA. Copiez, collez, pariez."
                  : "AI-generated 1xBet booking codes. Copy, paste, bet."}
              </p>
            </Link>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={200}>
            <Link
              href={`/${locale}/vip`}
              className="block bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 p-6 hover:shadow-lg transition-all group card-hover"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Crown className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t("vipTitle")}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{t("vipDesc")}</p>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <ScrollReveal direction="up" delay={0}>
        <section className="bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
              {isFr ? "Comment Fonctionne PronoFoot AI" : "How PronoFoot AI Works"}
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-gray-600 leading-relaxed mb-8 text-center">
                {isFr
                  ? `Notre IA analyse plus de 500 statistiques par match pour generer des predictions sur 7 marches de paris. Taux de reussite actuel : ${winStats.overall.rate}% sur ${winStats.overall.total} predictions verifiees.`
                  : `Our AI analyzes 500+ statistics per match to generate predictions across 7 betting markets. Current win rate: ${winStats.overall.rate}% across ${winStats.overall.total} verified predictions.`}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { step: "1", icon: BarChart3, title: isFr ? "Donnees" : "Data", desc: isFr ? "500+ stats par match via API-Football Pro chaque matin a 6h" : "500+ stats per match via API-Football Pro every morning at 6am", color: "emerald" },
                  { step: "2", icon: TrendingUp, title: isFr ? "Analyse IA" : "AI Analysis", desc: isFr ? "Claude AI (Anthropic) analyse et genere 7 predictions par match a 7h" : "Claude AI (Anthropic) analyzes and generates 7 predictions per match at 7am", color: "blue" },
                  { step: "3", icon: Shield, title: isFr ? "Verification" : "Verification", desc: isFr ? "Resultats verifies automatiquement a 23h. Tout est public sur la page Stats" : "Results auto-verified at 11pm. Everything is public on the Stats page", color: "amber" },
                ].map((s) => (
                  <div key={s.step} className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                      s.color === "emerald" ? "bg-emerald-100" : s.color === "blue" ? "bg-blue-100" : "bg-amber-100"
                    }`}>
                      <s.icon className={`w-5 h-5 ${
                        s.color === "emerald" ? "text-emerald-600" : s.color === "blue" ? "text-blue-600" : "text-amber-600"
                      }`} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1.5">{s.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-center mt-6">
                <Link href={`/${locale}/about`} className="text-emerald-600 font-semibold text-sm hover:text-emerald-700">
                  {isFr ? "En savoir plus sur notre methodologie →" : "Learn more about our methodology →"}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ============ HOMEPAGE FAQ ============ */}
      <ScrollReveal direction="up" delay={0}>
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            {isFr ? "Questions Frequentes" : "Frequently Asked Questions"}
          </h2>
          <div className="space-y-3">
            {homeFaqs.map((faq, i) => (
              <details key={i} className="bg-white rounded-xl border border-gray-200 group shadow-sm">
                <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-gray-800 hover:text-emerald-600 transition-colors list-none flex items-center gap-3">
                  <span className="text-emerald-500 group-open:rotate-90 transition-transform duration-200 flex-shrink-0 text-xs">&#9654;</span>
                  {faq.q}
                </summary>
                <p className="text-sm text-gray-600 px-5 pb-5 ml-7 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* ============ 1XBET LIVE BETTING BANNER ============ */}
      <ScrollReveal direction="up" delay={0}>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <PromoBanner locale={locale} variant="live-betting" campaign="home_live" />
        </section>
      </ScrollReveal>

      {/* ============ VIP UPSELL SECTION ============ */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-20 w-32 h-32 border border-amber-400 rounded-full" />
          <div className="absolute bottom-10 left-20 w-48 h-48 border border-amber-400 rounded-full" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <Crown className="w-12 h-12 text-amber-400 mx-auto mb-5" />
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 text-balance">
              {isFr ? "Passez au Niveau Supérieur" : "Level Up Your Betting"}
            </h2>
            <p className="text-gray-400 mb-10 text-lg leading-relaxed">
              {isFr
                ? "5 codes tickets premium par jour. Des paris sûrs aux cotes extrêmes. Annulez à tout moment."
                : "5 premium ticket codes daily. From safe bets to extreme odds. Cancel anytime."}
            </p>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 mb-10 border border-white/10">
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-2 tracking-tight">
                {isFr ? `${siteConfig.vipPrice.classique.weeklyFcfa.toLocaleString()} FCFA` : `$${siteConfig.vipPrice.classique.weeklyUsd}`}
                <span className="text-lg text-gray-400 font-normal ml-1">
                  /{isFr ? "semaine" : "week"}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                {isFr ? `~$${siteConfig.vipPrice.classique.weeklyUsd} USD/semaine` : `~${siteConfig.vipPrice.classique.weeklyFcfa.toLocaleString()} FCFA/week`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto mb-10">
              {[
                isFr ? "Pronostics premium exclusifs" : "Exclusive premium predictions",
                isFr ? "Combines IA quotidiens" : "Daily AI combos",
                isFr ? "Analyse IA complete" : "Full AI analysis",
                isFr ? "Alertes Telegram VIP" : "VIP Telegram alerts",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Target className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/vip`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-10 py-4 rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all text-lg shadow-lg shadow-amber-500/25 btn-press"
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
              className="bg-white text-blue-600 font-bold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors btn-press"
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
