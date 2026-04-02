import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Bell, ArrowRight, Sparkles, Send } from "lucide-react";
import AffiliateCTA from "@/components/ui/AffiliateCTA";
import PromoBanner from "@/components/ui/PromoBanner";
import { siteConfig } from "@/lib/config";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const isFr = params.locale === "fr";
  return {
    title: isFr ? "Codes Ticket 1xBet - Bientot Disponible" : "1xBet Ticket Codes - Coming Soon",
    description: isFr
      ? "Les codes de reservation 1xBet arrivent bientot. Rejoignez notre Telegram pour etre notifie du lancement."
      : "1xBet booking codes are coming soon. Join our Telegram to be notified at launch.",
    alternates: {
      canonical: `/${params.locale}/tickets`,
      languages: {
        fr: "/fr/tickets",
        en: "/en/tickets",
        "x-default": "/fr/tickets",
      },
    },
  };
}

export default function TicketsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;
  const isFr = locale === "fr";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-700 via-emerald-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-40 h-40 border border-emerald-300 rounded-full" />
          <div className="absolute bottom-10 left-10 w-56 h-56 border border-emerald-400 rounded-full" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center relative">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 rounded-full px-4 py-1.5 mb-6">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {isFr ? "Bientot Disponible" : "Coming Soon"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            {isFr ? "Codes Ticket 1xBet" : "1xBet Ticket Codes"}
          </h1>

          <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
            {isFr
              ? "Des codes de reservation 1xBet prets a l'emploi, generes quotidiennement par notre IA. Copiez, collez, et votre coupon se charge instantanement."
              : "Ready-to-use 1xBet booking codes, generated daily by our AI. Copy, paste, and your bet slip loads instantly."}
          </p>

          {/* Feature preview cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
            {[
              {
                icon: "🎟️",
                title: isFr ? "Code Gratuit Quotidien" : "Free Daily Code",
                desc: isFr ? "1 code de reservation gratuit chaque jour" : "1 free booking code every day",
              },
              {
                icon: "⭐",
                title: isFr ? "5 Codes VIP" : "5 VIP Codes",
                desc: isFr ? "Du plus sur au plus risque" : "From safest to highest risk",
              },
              {
                icon: "📋",
                title: isFr ? "Copier & Coller" : "Copy & Paste",
                desc: isFr ? "Chargez votre coupon en 1 clic" : "Load your slip in 1 click",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="text-white font-bold text-sm mb-1">{item.title}</p>
                <p className="text-emerald-200 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Blurred preview of fake ticket codes */}
          <div className="relative max-w-md mx-auto mb-8">
            <div className="blur-sm select-none pointer-events-none">
              <div className="bg-white rounded-xl p-4 mb-2">
                <p className="text-[10px] text-gray-400 uppercase">Booking Code</p>
                <p className="text-2xl font-mono font-bold text-gray-800 tracking-widest">A7X9K2M4</p>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>5 matches</span>
                  <span>Odds: 12.45</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <p className="text-[10px] text-gray-400 uppercase">Booking Code</p>
                <p className="text-2xl font-mono font-bold text-gray-800 tracking-widest">P3R8N5W1</p>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>3 matches</span>
                  <span>Odds: 3.87</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-800/60 to-emerald-800 flex items-end justify-center pb-4">
              <div className="flex items-center gap-2 bg-amber-500 text-white text-sm font-bold px-5 py-2.5 rounded-full">
                <Sparkles className="w-4 h-4" />
                {isFr ? "Lancement imminent..." : "Launching soon..."}
              </div>
            </div>
          </div>

          {/* Telegram CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={siteConfig.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              <Send className="w-5 h-5" />
              {isFr ? "Rejoindre Telegram pour etre notifie" : "Join Telegram to get notified"}
            </a>
            <Link
              href={`/${locale}/predictions`}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-xl transition-colors border border-white/20"
            >
              {isFr ? "Voir les Pronostics" : "View Predictions"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it will work */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
          {isFr ? "Comment ca va fonctionner ?" : "How will it work?"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: isFr ? "L'IA Analyse" : "AI Analyzes",
              desc: isFr
                ? "Notre IA selectionne les meilleurs matchs et genere des combines optimises."
                : "Our AI selects the best matches and generates optimized combos.",
              color: "bg-emerald-100 text-emerald-700",
            },
            {
              step: "02",
              title: isFr ? "Code Genere" : "Code Generated",
              desc: isFr
                ? "Un code de reservation 1xBet unique est cree pour chaque combine."
                : "A unique 1xBet booking code is created for each combo.",
              color: "bg-blue-100 text-blue-700",
            },
            {
              step: "03",
              title: isFr ? "Copiez le Code" : "Copy the Code",
              desc: isFr
                ? "Copiez le code en un clic directement depuis notre site."
                : "Copy the code in one click directly from our site.",
              color: "bg-amber-100 text-amber-700",
            },
            {
              step: "04",
              title: isFr ? "Collez sur 1xBet" : "Paste on 1xBet",
              desc: isFr
                ? "Collez dans 'Charger par code' et votre coupon se remplit automatiquement."
                : "Paste in 'Load by code' and your slip fills automatically.",
              color: "bg-purple-100 text-purple-700",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center mx-auto mb-3`}>
                <span className="font-bold text-sm">{item.step}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-sm">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <PromoBanner locale={locale} variant="welcome-bonus" campaign="tickets_coming_soon" />
      </section>

      {/* Meanwhile CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <Bell className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {isFr ? "En attendant..." : "In the meantime..."}
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {isFr
              ? "Utilisez nos pronostics IA et le generateur de combines pour creer vos propres paris sur 1xBet."
              : "Use our AI predictions and combo builder to create your own bets on 1xBet."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/${locale}/bet-builder`}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {isFr ? "Generateur de Combines" : "Combo Builder"}
            </Link>
            <AffiliateCTA
              text={isFr ? "Ouvrir 1xBet" : "Open 1xBet"}
              variant="primary"
              campaign="tickets_coming_soon"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
