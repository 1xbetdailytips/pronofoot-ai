import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { siteConfig } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isFr = params.locale === "fr";
  return {
    title: isFr ? "Conditions d'Utilisation" : "Terms of Service",
    description: isFr
      ? "Conditions d'utilisation de PronoFoot AI. Lisez nos règles d'utilisation, politique d'abonnement VIP et limitations de responsabilité."
      : "PronoFoot AI terms of service. Read our usage rules, VIP subscription policy and liability limitations.",
    alternates: {
      canonical: `/${params.locale}/terms`,
      languages: {
        fr: "/fr/terms",
        en: "/en/terms",
        "x-default": "/fr/terms",
      },
    },
  };
}

export default function TermsPage({
  params,
}: {
  params: { locale: string };
}) {
  const isFr = params.locale === "fr";
  const lastUpdated = "28 mars 2026";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link href={`/${params.locale}`} className="hover:text-emerald-600">
          {isFr ? "Accueil" : "Home"}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{isFr ? "Conditions d'Utilisation" : "Terms of Service"}</span>
      </nav>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
          <FileText className="w-6 h-6 text-gray-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          {isFr ? "Conditions d'Utilisation" : "Terms of Service"}
        </h1>
      </div>
      <p className="text-gray-500 text-sm mb-8">
        {isFr ? `Dernière mise à jour : ${lastUpdated}` : `Last updated: March 28, 2026`}
      </p>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2>{isFr ? "1. Acceptation des Conditions" : "1. Acceptance of Terms"}</h2>
          <p>
            {isFr
              ? "En accédant à PronoFoot AI (www.parifoot.online), vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service."
              : "By accessing PronoFoot AI (www.parifoot.online), you agree to be bound by these terms of service. If you do not accept these terms, please do not use our service."}
          </p>
        </section>

        <section>
          <h2>{isFr ? "2. Description du Service" : "2. Service Description"}</h2>
          <p>
            {isFr
              ? "PronoFoot AI est une plateforme d'analyse de matchs de football utilisant l'intelligence artificielle. Nous fournissons des pronostics, des analyses statistiques et des codes tickets pour des plateformes de paris tierces. Nos services comprennent :"
              : "PronoFoot AI is a football match analysis platform using artificial intelligence. We provide predictions, statistical analyses and ticket codes for third-party betting platforms. Our services include:"}
          </p>
          <ul>
            {(isFr
              ? [
                  "Pronostics football quotidiens générés par IA",
                  "Rapports d'analyse de matchs",
                  "Codes tickets de réservation pour 1xBet",
                  "Statistiques de performance de l'IA",
                  "Abonnements VIP (Classique et Elite)",
                ]
              : [
                  "Daily AI-generated football predictions",
                  "Match analysis reports",
                  "Booking ticket codes for 1xBet",
                  "AI performance statistics",
                  "VIP subscriptions (Classic and Elite)",
                ]
            ).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{isFr ? "3. Limitation de Responsabilité" : "3. Limitation of Liability"}</h2>
          <p className="font-semibold">
            {isFr
              ? "IMPORTANT : PronoFoot AI est un service de divertissement. Nos pronostics ne constituent en aucun cas des conseils financiers."
              : "IMPORTANT: PronoFoot AI is an entertainment service. Our predictions do not constitute financial advice in any way."}
          </p>
          <ul>
            {(isFr
              ? [
                  "Les pronostics sont basés sur des analyses statistiques et ne garantissent aucun résultat",
                  "Les résultats passés ne préjugent pas des résultats futurs",
                  "PronoFoot AI n'est pas responsable des pertes financières résultant de l'utilisation de nos pronostics",
                  "Vous êtes seul responsable de vos décisions de paris",
                  "Nous ne garantissons pas la disponibilité continue du service",
                ]
              : [
                  "Predictions are based on statistical analysis and do not guarantee any results",
                  "Past results do not predict future outcomes",
                  "PronoFoot AI is not liable for financial losses resulting from the use of our predictions",
                  "You are solely responsible for your betting decisions",
                  "We do not guarantee continuous service availability",
                ]
            ).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{isFr ? "4. Abonnements VIP" : "4. VIP Subscriptions"}</h2>
          <p>
            {isFr
              ? "Les abonnements VIP sont des services payants avec les conditions suivantes :"
              : "VIP subscriptions are paid services with the following terms:"}
          </p>
          <ul>
            {(isFr
              ? [
                  `VIP Classique : ${siteConfig.vipPrice.classique.weeklyFcfa} FCFA/semaine ou ${siteConfig.vipPrice.classique.monthlyFcfa} FCFA/mois`,
                  `VIP Elite : ${siteConfig.vipPrice.elite.weeklyFcfa} FCFA/semaine ou ${siteConfig.vipPrice.elite.monthlyFcfa} FCFA/mois`,
                  "Les paiements sont effectués via MTN Mobile Money ou Orange Money",
                  "L'abonnement donne accès aux codes tickets VIP via Telegram",
                  "Aucun remboursement n'est possible après activation de l'abonnement",
                  "L'abonnement expire automatiquement à la fin de la période payée",
                  "Protection 3 pertes consécutives : 2 jours offerts (VIP Elite uniquement)",
                ]
              : [
                  `VIP Classic: ${siteConfig.vipPrice.classique.weeklyFcfa} FCFA/week or ${siteConfig.vipPrice.classique.monthlyFcfa} FCFA/month`,
                  `VIP Elite: ${siteConfig.vipPrice.elite.weeklyFcfa} FCFA/week or ${siteConfig.vipPrice.elite.monthlyFcfa} FCFA/month`,
                  "Payments are made via MTN Mobile Money or Orange Money",
                  "Subscription provides access to VIP ticket codes via Telegram",
                  "No refunds are possible after subscription activation",
                  "Subscription expires automatically at the end of the paid period",
                  "3 consecutive losses protection: 2 free days (VIP Elite only)",
                ]
            ).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{isFr ? "5. Restriction d'Âge" : "5. Age Restriction"}</h2>
          <p>
            {isFr
              ? "Vous devez avoir au moins 18 ans pour utiliser PronoFoot AI. En utilisant notre service, vous confirmez que vous avez l'âge légal pour parier dans votre juridiction."
              : "You must be at least 18 years old to use PronoFoot AI. By using our service, you confirm that you are of legal age to bet in your jurisdiction."}
          </p>
        </section>

        <section>
          <h2>{isFr ? "6. Propriété Intellectuelle" : "6. Intellectual Property"}</h2>
          <p>
            {isFr
              ? "Tout le contenu de PronoFoot AI, y compris les analyses, les algorithmes, le design et les textes, est protégé par le droit d'auteur. Toute reproduction non autorisée est interdite."
              : "All content on PronoFoot AI, including analyses, algorithms, design and text, is protected by copyright. Any unauthorized reproduction is prohibited."}
          </p>
        </section>

        <section>
          <h2>{isFr ? "7. Divulgation d'Affiliation" : "7. Affiliate Disclosure"}</h2>
          <p>
            {isFr
              ? "PronoFoot AI est un partenaire affilié de 1xBet. Nous pouvons recevoir une commission lorsque vous créez un compte ou effectuez un dépôt via nos liens. Cette relation commerciale n'affecte pas l'objectivité de nos analyses IA."
              : "PronoFoot AI is an affiliate partner of 1xBet. We may receive a commission when you create an account or make a deposit through our links. This commercial relationship does not affect the objectivity of our AI analyses."}
          </p>
        </section>

        <section>
          <h2>{isFr ? "8. Contact" : "8. Contact"}</h2>
          <p>
            {isFr
              ? "Pour toute question concernant ces conditions, contactez-nous via Telegram : @pronofootadmin"
              : "For any questions about these terms, contact us via Telegram: @pronofootadmin"}
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
                { "@type": "ListItem", position: 2, name: isFr ? "Conditions d'Utilisation" : "Terms of Service", item: `${siteConfig.url}/${params.locale}/terms` },
              ],
            }),
          }}
        />
      </div>
    </div>
  );
}
