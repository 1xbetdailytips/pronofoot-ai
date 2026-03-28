import type { Metadata } from "next";
import Link from "next/link";
import { Lock } from "lucide-react";
import { siteConfig } from "@/lib/config";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isFr = params.locale === "fr";
  return {
    title: isFr ? "Politique de Confidentialité" : "Privacy Policy",
    description: isFr
      ? "Politique de confidentialité de PronoFoot AI. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles."
      : "PronoFoot AI privacy policy. Learn how we collect, use and protect your personal data.",
    alternates: {
      canonical: `/${params.locale}/privacy`,
      languages: {
        fr: "/fr/privacy",
        en: "/en/privacy",
        "x-default": "/fr/privacy",
      },
    },
  };
}

export default function PrivacyPage({
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
        <span className="text-gray-900">{isFr ? "Confidentialité" : "Privacy"}</span>
      </nav>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          <Lock className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">
          {isFr ? "Politique de Confidentialité" : "Privacy Policy"}
        </h1>
      </div>
      <p className="text-gray-500 text-sm mb-8">
        {isFr ? `Dernière mise à jour : ${lastUpdated}` : `Last updated: March 28, 2026`}
      </p>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2>{isFr ? "1. Données que Nous Collectons" : "1. Data We Collect"}</h2>
          <p>
            {isFr
              ? "PronoFoot AI collecte les données suivantes :"
              : "PronoFoot AI collects the following data:"}
          </p>

          <h3>{isFr ? "Données de compte" : "Account Data"}</h3>
          <ul>
            {(isFr
              ? [
                  "Adresse email (lors de l'inscription ou connexion Google)",
                  "Nom complet (optionnel, lors de l'inscription)",
                  "Identifiant Google (si connexion via Google OAuth)",
                ]
              : [
                  "Email address (during registration or Google sign-in)",
                  "Full name (optional, during registration)",
                  "Google identifier (if signing in via Google OAuth)",
                ]
            ).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h3>{isFr ? "Données VIP" : "VIP Data"}</h3>
          <ul>
            {(isFr
              ? [
                  "Numéro de téléphone (pour les paiements Mobile Money)",
                  "Historique des paiements et références de transaction",
                  "Plan d'abonnement et date d'expiration",
                ]
              : [
                  "Phone number (for Mobile Money payments)",
                  "Payment history and transaction references",
                  "Subscription plan and expiration date",
                ]
            ).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h3>{isFr ? "Données techniques" : "Technical Data"}</h3>
          <ul>
            {(isFr
              ? [
                  "Adresse IP et données de navigation (via Vercel Analytics)",
                  "Type de navigateur et appareil",
                  "Pages visitées et durée des sessions",
                ]
              : [
                  "IP address and browsing data (via Vercel Analytics)",
                  "Browser type and device",
                  "Pages visited and session duration",
                ]
            ).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{isFr ? "2. Comment Nous Utilisons Vos Données" : "2. How We Use Your Data"}</h2>
          <ul>
            {(isFr
              ? [
                  "Fournir et améliorer nos services de pronostics",
                  "Gérer votre compte et votre abonnement VIP",
                  "Envoyer les codes tickets via Telegram et WhatsApp",
                  "Traiter les paiements via Campay (MTN/Orange Money)",
                  "Analyser l'utilisation du site pour améliorer l'expérience utilisateur",
                  "Communiquer des mises à jour importantes du service",
                ]
              : [
                  "Provide and improve our prediction services",
                  "Manage your account and VIP subscription",
                  "Send ticket codes via Telegram and WhatsApp",
                  "Process payments via Campay (MTN/Orange Money)",
                  "Analyze site usage to improve user experience",
                  "Communicate important service updates",
                ]
            ).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{isFr ? "3. Stockage et Sécurité" : "3. Storage and Security"}</h2>
          <p>
            {isFr
              ? "Vos données sont stockées de manière sécurisée sur Supabase (hébergé sur AWS). L'authentification est gérée par Supabase Auth avec chiffrement des mots de passe. Les données de paiement sont traitées par Campay et ne sont pas stockées sur nos serveurs."
              : "Your data is securely stored on Supabase (hosted on AWS). Authentication is managed by Supabase Auth with password encryption. Payment data is processed by Campay and is not stored on our servers."}
          </p>
        </section>

        <section>
          <h2>{isFr ? "4. Partage de Données" : "4. Data Sharing"}</h2>
          <p>
            {isFr
              ? "Nous ne vendons jamais vos données personnelles. Nous partageons vos données uniquement avec :"
              : "We never sell your personal data. We share your data only with:"}
          </p>
          <ul>
            {(isFr
              ? [
                  "Supabase — hébergement de base de données et authentification",
                  "Campay — traitement des paiements Mobile Money",
                  "Vercel — hébergement du site web",
                  "Telegram/WhatsApp — livraison des codes tickets VIP",
                  "Google — authentification OAuth (si vous choisissez la connexion Google)",
                ]
              : [
                  "Supabase — database hosting and authentication",
                  "Campay — Mobile Money payment processing",
                  "Vercel — website hosting",
                  "Telegram/WhatsApp — VIP ticket code delivery",
                  "Google — OAuth authentication (if you choose Google sign-in)",
                ]
            ).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2>{isFr ? "5. Vos Droits" : "5. Your Rights"}</h2>
          <p>
            {isFr ? "Vous avez le droit de :" : "You have the right to:"}
          </p>
          <ul>
            {(isFr
              ? [
                  "Accéder à vos données personnelles",
                  "Rectifier vos informations incorrectes",
                  "Demander la suppression de votre compte et de vos données",
                  "Retirer votre consentement à tout moment",
                  "Exporter vos données dans un format portable",
                ]
              : [
                  "Access your personal data",
                  "Rectify incorrect information",
                  "Request deletion of your account and data",
                  "Withdraw your consent at any time",
                  "Export your data in a portable format",
                ]
            ).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>
            {isFr
              ? "Pour exercer ces droits, contactez @pronofootadmin sur Telegram."
              : "To exercise these rights, contact @pronofootadmin on Telegram."}
          </p>
        </section>

        <section>
          <h2>{isFr ? "6. Cookies" : "6. Cookies"}</h2>
          <p>
            {isFr
              ? "PronoFoot AI utilise des cookies essentiels pour le fonctionnement du site (session d'authentification). Nous n'utilisons pas de cookies publicitaires ou de suivi tiers."
              : "PronoFoot AI uses essential cookies for site operation (authentication session). We do not use advertising or third-party tracking cookies."}
          </p>
        </section>

        <section>
          <h2>{isFr ? "7. Contact" : "7. Contact"}</h2>
          <p>
            {isFr
              ? "Pour toute question relative à la confidentialité, contactez-nous via Telegram : @pronofootadmin"
              : "For any privacy-related questions, contact us via Telegram: @pronofootadmin"}
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
                { "@type": "ListItem", position: 2, name: isFr ? "Confidentialité" : "Privacy", item: `${siteConfig.url}/${params.locale}/privacy` },
              ],
            }),
          }}
        />
      </div>
    </div>
  );
}
