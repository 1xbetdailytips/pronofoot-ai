import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Phone, ExternalLink, AlertTriangle, Heart } from "lucide-react";
import { siteConfig } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isFr = params.locale === "fr";
  return {
    title: isFr ? "Jeu Responsable" : "Responsible Gambling",
    description: isFr
      ? "PronoFoot AI s'engage pour le jeu responsable. Ressources, conseils et aide pour les joueurs."
      : "PronoFoot AI is committed to responsible gambling. Resources, advice and help for players.",
    alternates: {
      canonical: `/${params.locale}/responsible-gambling`,
      languages: {
        fr: "/fr/responsible-gambling",
        en: "/en/responsible-gambling",
        "x-default": "/fr/responsible-gambling",
      },
    },
  };
}

export default function ResponsibleGamblingPage({
  params,
}: {
  params: { locale: string };
}) {
  const isFr = params.locale === "fr";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link href={`/${params.locale}`} className="hover:text-emerald-600">
          {isFr ? "Accueil" : "Home"}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{isFr ? "Jeu Responsable" : "Responsible Gambling"}</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          {isFr ? "Jeu Responsable" : "Responsible Gambling"}
        </h1>
      </div>

      <div className="prose prose-gray max-w-none space-y-8">
        {/* Intro */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
          <p className="text-emerald-800 font-medium text-lg">
            {isFr
              ? "Chez PronoFoot AI, nous croyons que les paris sportifs doivent rester un divertissement. Si le jeu devient un problème, nous sommes là pour vous orienter vers l'aide appropriée."
              : "At PronoFoot AI, we believe sports betting should remain entertainment. If gambling becomes a problem, we're here to guide you to appropriate help."}
          </p>
        </div>

        {/* Age Restriction */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-gray-900 m-0">
              {isFr ? "Restriction d'Âge" : "Age Restriction"}
            </h2>
          </div>
          <p className="text-gray-600">
            {isFr
              ? "Vous devez avoir au moins 18 ans pour utiliser nos services et pour parier. Les paris sportifs sont strictement interdits aux mineurs. Si vous êtes mineur, veuillez quitter ce site immédiatement."
              : "You must be at least 18 years old to use our services and to bet. Sports betting is strictly prohibited for minors. If you are underage, please leave this site immediately."}
          </p>
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 font-bold px-4 py-2 rounded-xl mt-2">
            <span className="text-2xl">18+</span>
            <span>{isFr ? "Accès interdit aux mineurs" : "No access for minors"}</span>
          </div>
        </section>

        {/* Signs of Problem Gambling */}
        <section>
          <h2 className="text-xl font-bold text-gray-900">
            {isFr ? "Signes d'un Problème de Jeu" : "Signs of Problem Gambling"}
          </h2>
          <p className="text-gray-600">
            {isFr ? "Demandez-vous si vous :" : "Ask yourself if you:"}
          </p>
          <ul className="space-y-2 text-gray-600">
            {(isFr
              ? [
                  "Pariez plus que ce que vous pouvez vous permettre de perdre",
                  "Empruntez de l'argent pour parier",
                  "Vous sentez agité ou irritable quand vous essayez d'arrêter",
                  "Pariez pour récupérer vos pertes",
                  "Mentez à vos proches sur vos habitudes de jeu",
                  "Négligez votre travail ou votre famille à cause des paris",
                  "Ressentez de l'anxiété ou de la dépression liée aux paris",
                ]
              : [
                  "Bet more than you can afford to lose",
                  "Borrow money to gamble",
                  "Feel restless or irritable when trying to stop",
                  "Chase your losses by betting more",
                  "Lie to family about your gambling habits",
                  "Neglect work or family because of betting",
                  "Experience anxiety or depression related to gambling",
                ]
            ).map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">&#9679;</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-600 font-medium mt-4">
            {isFr
              ? "Si vous avez répondu oui à une ou plusieurs de ces questions, vous devriez envisager de demander de l'aide."
              : "If you answered yes to one or more of these questions, you should consider seeking help."}
          </p>
        </section>

        {/* Our Principles */}
        <section>
          <h2 className="text-xl font-bold text-gray-900">
            {isFr ? "Nos Engagements" : "Our Commitments"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(isFr
              ? [
                  { title: "Information transparente", desc: "Nos pronostics sont des analyses statistiques, jamais des garanties. Les résultats passés ne prédisent pas les résultats futurs." },
                  { title: "Pas de pression", desc: "Nous ne vous poussons jamais à parier. Nos services sont informatifs et à visée de divertissement uniquement." },
                  { title: "Limites personnelles", desc: "Nous encourageons chaque utilisateur à définir un budget de paris et à ne jamais le dépasser." },
                  { title: "Accès à l'aide", desc: "Nous fournissons des liens vers des organisations d'aide pour les personnes en difficulté avec le jeu." },
                ]
              : [
                  { title: "Transparent information", desc: "Our predictions are statistical analyses, never guarantees. Past results do not predict future outcomes." },
                  { title: "No pressure", desc: "We never push you to bet. Our services are informational and for entertainment purposes only." },
                  { title: "Personal limits", desc: "We encourage every user to set a betting budget and never exceed it." },
                  { title: "Access to help", desc: "We provide links to help organizations for people struggling with gambling." },
                ]
            ).map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Help Resources */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900 m-0">
              {isFr ? "Obtenir de l'Aide" : "Get Help"}
            </h2>
          </div>
          <p className="text-gray-600 mb-4">
            {isFr
              ? "Si vous ou un proche avez un problème de jeu, contactez l'une de ces organisations :"
              : "If you or a loved one have a gambling problem, contact one of these organizations:"}
          </p>
          <div className="space-y-3">
            {[
              {
                name: "SOS Joueurs",
                desc: isFr ? "Aide aux joueurs en difficulté (France & Afrique francophone)" : "Help for problem gamblers (France & Francophone Africa)",
                url: "https://www.sosjoueurs.org",
                phone: "09 69 39 55 12",
              },
              {
                name: "Joueurs Info Service",
                desc: isFr ? "Information et aide sur le jeu excessif" : "Information and help on excessive gambling",
                url: "https://www.joueurs-info-service.fr",
                phone: "09 74 75 13 13",
              },
              {
                name: "GamCare",
                desc: isFr ? "Support et conseils (anglophone)" : "Support and counselling (English-speaking)",
                url: "https://www.gamcare.org.uk",
                phone: "+44 808 8020 133",
              },
              {
                name: "Gamblers Anonymous",
                desc: isFr ? "Programme d'entraide international" : "International fellowship program",
                url: "https://www.gamblersanonymous.org",
                phone: null,
              },
            ].map((org) => (
              <div key={org.name} className="flex items-start gap-3 bg-blue-50 rounded-xl p-4 border border-blue-100">
                <Phone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <a
                    href={org.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-blue-700 hover:underline flex items-center gap-1"
                  >
                    {org.name} <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-gray-600 text-sm">{org.desc}</p>
                  {org.phone && (
                    <p className="text-blue-700 font-mono text-sm mt-1">{org.phone}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tips for Responsible Gambling */}
        <section>
          <h2 className="text-xl font-bold text-gray-900">
            {isFr ? "Conseils pour Parier Responsablement" : "Tips for Responsible Betting"}
          </h2>
          <ol className="space-y-3 text-gray-600">
            {(isFr
              ? [
                  "Fixez un budget hebdomadaire et ne le dépassez jamais",
                  "Ne pariez jamais avec de l'argent dont vous avez besoin pour vos dépenses essentielles",
                  "Ne poursuivez jamais vos pertes — acceptez-les et passez à autre chose",
                  "Faites des pauses régulières dans les paris",
                  "Ne pariez pas sous l'influence de l'alcool ou du stress",
                  "Considérez les paris comme un divertissement, pas comme une source de revenus",
                ]
              : [
                  "Set a weekly budget and never exceed it",
                  "Never bet with money you need for essential expenses",
                  "Never chase your losses — accept them and move on",
                  "Take regular breaks from betting",
                  "Don't bet under the influence of alcohol or stress",
                  "Treat betting as entertainment, not as a source of income",
                ]
            ).map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ol>
        </section>

        {/* Affiliate Disclosure */}
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mt-0">
            {isFr ? "Divulgation d'Affiliation" : "Affiliate Disclosure"}
          </h2>
          <p className="text-gray-600">
            {isFr
              ? "PronoFoot AI contient des liens d'affiliation vers 1xBet. Cela signifie que nous pouvons recevoir une commission si vous créez un compte via nos liens. Cela n'affecte pas nos pronostics ni la qualité de notre service. Nos analyses IA sont objectives et indépendantes de toute relation commerciale."
              : "PronoFoot AI contains affiliate links to 1xBet. This means we may receive a commission if you create an account through our links. This does not affect our predictions or the quality of our service. Our AI analyses are objective and independent of any commercial relationship."}
          </p>
        </section>

        {/* JSON-LD BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: isFr ? "Accueil" : "Home", item: `${siteConfig.url}/${params.locale}` },
                { "@type": "ListItem", position: 2, name: isFr ? "Jeu Responsable" : "Responsible Gambling", item: `${siteConfig.url}/${params.locale}/responsible-gambling` },
              ],
            }),
          }}
        />
      </div>
    </div>
  );
}
