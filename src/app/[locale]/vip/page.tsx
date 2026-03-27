import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Check, Shield, Zap, Flame, AlertTriangle, Send } from "lucide-react";
import AffiliateCTA from "@/components/ui/AffiliateCTA";
import { siteConfig } from "@/lib/config";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const isFr = params.locale === "fr";
  return {
    title: isFr
      ? "VIP Master Tickets - Codes 1xBet Premium"
      : "VIP Master Tickets - Premium 1xBet Codes",
    description: isFr
      ? "Abonnez-vous au VIP PronoFoot AI. 5 codes tickets 1xBet premium par jour, analyses IA completes, alertes Telegram."
      : "Subscribe to PronoFoot AI VIP. 5 premium 1xBet ticket codes daily, full AI analysis, Telegram alerts.",
  };
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

export default async function VIPPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("vip");
  const tc = await getTranslations("common");
  const locale = params.locale;
  const isFr = locale === "fr";

  const features = [
    t("feature1"),
    t("feature2"),
    t("feature3"),
    t("feature4"),
    t("feature5"),
    t("feature6"),
  ];

  const ticketTypes = [
    {
      name: isFr ? "Ticket Sur" : "Safe Ticket",
      icon: Shield,
      desc: isFr
        ? "2-3 matchs, cotes basses, taux de reussite eleve"
        : "2-3 matches, low odds, high win rate",
      color: "emerald",
    },
    {
      name: isFr ? "Ticket Value" : "Value Ticket",
      icon: Zap,
      desc: isFr
        ? "3-4 matchs, cotes moyennes, bon equilibre risque/gain"
        : "3-4 matches, medium odds, good risk/reward balance",
      color: "blue",
    },
    {
      name: isFr ? "Ticket Combine" : "Combo Ticket",
      icon: Zap,
      desc: isFr
        ? "4-5 matchs, bonnes cotes, analyse approfondie"
        : "4-5 matches, good odds, deep analysis",
      color: "purple",
    },
    {
      name: isFr ? "Ticket Risque" : "High Risk Ticket",
      icon: Flame,
      desc: isFr
        ? "5-6 matchs, hautes cotes, gros gains potentiels"
        : "5-6 matches, high odds, big potential wins",
      color: "orange",
    },
    {
      name: isFr ? "Ticket Jackpot" : "Jackpot Ticket",
      icon: AlertTriangle,
      desc: isFr
        ? "7+ matchs, cotes extremes, pour les audacieux"
        : "7+ matches, extreme odds, for the bold",
      color: "red",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-40 h-40 border border-amber-400 rounded-full" />
          <div className="absolute bottom-10 left-10 w-60 h-60 border border-amber-400 rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center relative">
          <Crown className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>

          {/* Price Card */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 max-w-sm mx-auto mb-8">
            <div className="text-6xl font-bold text-white mb-1">
              {isFr ? "1 800" : "$3"}
            </div>
            <div className="text-gray-400 mb-1">
              {isFr ? "FCFA / semaine" : "USD / week"}
            </div>
            <div className="text-sm text-gray-500 mb-6">
              ({isFr ? t("priceFcfa") : "~1,800 FCFA/week"})
            </div>

            {/* Features */}
            <ul className="space-y-3 text-left mb-8">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all text-lg shadow-lg shadow-amber-500/25">
              {t("subscribe")}
            </button>
            <p className="text-gray-500 text-xs mt-3">{t("guarantee")}</p>
          </div>
        </div>
      </section>

      {/* Ticket Types Explained */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
          {isFr
            ? "5 Tickets Chaque Jour"
            : "5 Tickets Every Day"}
        </h2>
        <div className="space-y-4">
          {ticketTypes.map(({ name, icon: Icon, desc, color }) => (
            <div
              key={name}
              className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-${color}-50 flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`w-6 h-6 text-${color}-600`} />
              </div>
              <div>
                <p className="font-bold text-gray-900">{name}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            {isFr ? "Comment Ca Marche" : "How It Works"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: isFr ? "Abonnez-vous" : "Subscribe",
                desc: isFr
                  ? "Choisissez votre plan et payez en toute securite"
                  : "Choose your plan and pay securely",
              },
              {
                step: "2",
                title: isFr ? "Recevez vos codes" : "Get Your Codes",
                desc: isFr
                  ? "5 codes tickets 1xBet livres chaque matin a 8h"
                  : "5 1xBet ticket codes delivered every morning at 8AM",
              },
              {
                step: "3",
                title: isFr ? "Pariez et gagnez" : "Bet & Win",
                desc: isFr
                  ? "Copiez le code dans 1xBet et votre coupon se charge"
                  : "Paste the code in 1xBet and your slip loads up",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Telegram CTA */}
      <section className="bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <Send className="w-8 h-8 text-white mx-auto mb-3" />
          <p className="text-white font-bold text-lg mb-2">
            {isFr
              ? "Des questions ? Contactez-nous sur Telegram"
              : "Questions? Contact us on Telegram"}
          </p>
          <a
            href={siteConfig.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors"
          >
            {tc("joinTelegram")} →
          </a>
        </div>
      </section>

      {/* Affiliate CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-500 mb-4">
          {isFr
            ? "Pas encore de compte 1xBet ? Inscrivez-vous maintenant !"
            : "Don't have a 1xBet account yet? Sign up now!"}
        </p>
        <AffiliateCTA
          text={
            isFr
              ? "Creer un Compte 1xBet"
              : "Create 1xBet Account"
          }
          variant="primary"
          campaign="vip_page"
        />
      </section>
    </div>
  );
}
