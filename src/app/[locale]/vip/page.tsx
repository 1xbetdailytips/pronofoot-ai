import type { Metadata } from "next";
import {
  Check,
  X,
  Shield,
  Zap,
  Flame,
  AlertTriangle,
  Send,
  Star,
  TrendingUp,
  Bell,
  Target,
  BarChart2,
  MessageCircle,
  Lock,
} from "lucide-react";
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
      ? "VIP PronoFoot AI — Classique & Elite | Codes 1xBet Quotidiens"
      : "PronoFoot AI VIP — Classique & Elite | Daily 1xBet Codes",
    description: isFr
      ? "Deux formules VIP pour tous les budgets. Codes 1xBet prêts chaque matin, analyses IA, picks Over 1.5, alertes live. À partir de 2 500 FCFA/semaine."
      : "Two VIP plans for every budget. Ready 1xBet codes every morning, AI analysis, Over 1.5 picks, live alerts. From 2,500 FCFA/week.",
  };
}

function Crown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}

function Diamond({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2L2 8l10 14L22 8l-4-6H6zm1.5 2h9l2.5 4H5L6.5 4zM12 18.5L5.5 9h13L12 18.5z" />
    </svg>
  );
}

export default async function VIPPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;
  const isFr = locale === "fr";

  // ── Classique features ──────────────────────────────────────────────────
  const classiqueFeatures = isFr
    ? [
        "3 codes tickets 1xBet par jour",
        "Ticket Sûr + Value + Combiné",
        "Analyse IA complète par pick",
        "Proba Over 2.5 & BTTS incluses",
        "Livraison Telegram à 8h00",
        "Rapport de performance mensuel",
        "Support WhatsApp bot",
        "Accès Weekend Jackpot",
      ]
    : [
        "3 1xBet booking codes per day",
        "Safe + Value + Combo tickets",
        "Full AI analysis per pick",
        "Over 2.5 & BTTS probabilities",
        "Telegram delivery at 8:00 AM",
        "Monthly performance report",
        "WhatsApp bot support",
        "Weekend Jackpot access",
      ];

  // ── Elite features ───────────────────────────────────────────────────────
  const eliteFeatures = isFr
    ? [
        "Tout Classique inclus",
        "5 codes tickets 1xBet par jour",
        "Ticket Risque + Jackpot en plus",
        "Livraison prioritaire à 7h00 (1h avant)",
        "Picks Over 1.5 — Top 3 matchs du jour",
        "Picks Over 0.5 Domicile / Extérieur",
        "Alertes live mi-temps (grands matchs)",
        "Mega Accumulateur hebdomadaire (lundi)",
        "Plan gestion de bankroll personnalisé",
        "Protection 3 pertes → 2 jours offerts",
        "Support WhatsApp prioritaire (direct)",
        "Codes spéciaux Champions League / AFCON",
      ]
    : [
        "Everything in Classique",
        "5 1xBet booking codes per day",
        "High Risk + Jackpot tickets added",
        "Priority delivery at 7:00 AM (1hr early)",
        "Over 1.5 Picks — Top 3 matches of the day",
        "Over 0.5 Home / Away to Score Picks",
        "Live halftime alerts (major match days)",
        "Weekly Mega Accumulator (Monday)",
        "Personalised bankroll management plan",
        "3-loss protection → 2 days free",
        "Priority WhatsApp support (direct)",
        "Special Champions League / AFCON codes",
      ];

  const tickets = [
    {
      name: isFr ? "Ticket Sûr" : "Safe Ticket",
      icon: Shield,
      color: "emerald",
      tier: "classique",
      desc: isFr ? "2-3 matchs • cotes basses • haut taux de réussite" : "2-3 matches • low odds • high win rate",
    },
    {
      name: isFr ? "Ticket Value" : "Value Ticket",
      icon: TrendingUp,
      color: "blue",
      tier: "classique",
      desc: isFr ? "3-4 matchs • cotes moyennes • bon ratio risque/gain" : "3-4 matches • medium odds • good risk/reward",
    },
    {
      name: isFr ? "Ticket Combiné" : "Combo Ticket",
      icon: Zap,
      color: "purple",
      tier: "classique",
      desc: isFr ? "4-5 matchs • bonnes cotes • analyse approfondie IA" : "4-5 matches • good odds • deep AI analysis",
    },
    {
      name: isFr ? "Ticket Risque" : "High Risk Ticket",
      icon: Flame,
      color: "orange",
      tier: "elite",
      desc: isFr ? "5-6 matchs • hautes cotes • gros gains potentiels" : "5-6 matches • high odds • big potential wins",
    },
    {
      name: isFr ? "Ticket Jackpot" : "Jackpot Ticket",
      icon: AlertTriangle,
      color: "red",
      tier: "elite",
      desc: isFr ? "7+ matchs • cotes extrêmes • pour les audacieux" : "7+ matches • extreme odds • for the bold",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 border border-amber-400 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-96 h-96 border border-amber-400 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-amber-400/30 rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 mb-6">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-amber-300 text-sm font-medium">
              {isFr ? "Intelligence Artificielle • Pronostics Premium" : "Artificial Intelligence • Premium Predictions"}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            {isFr
              ? <>Pas un tipster.<br /><span className="text-amber-400">Une IA qui analyse 500 stats</span><br />pour toi chaque matin.</>
              : <>Not a tipster.<br /><span className="text-amber-400">An AI that analyses 500+ stats</span><br />for you every morning.</>
            }
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4">
            {isFr
              ? "Copie le code. Colle dans 1xBet. Le coupon se charge automatiquement. Zéro effort."
              : "Copy the code. Paste in 1xBet. The slip loads instantly. Zero effort."}
          </p>

          <p className="text-sm text-gray-500 mb-10">
            {isFr
              ? "Livraison chaque matin • Telegram + WhatsApp • Codes prêts à jouer"
              : "Delivered every morning • Telegram + WhatsApp • Ready-to-play codes"}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#plans"
              className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-amber-500/30"
            >
              {isFr ? "Voir les formules →" : "See plans →"}
            </a>
            <a
              href={siteConfig.telegramVip}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all"
            >
              {isFr ? "Rejoindre le canal VIP" : "Join VIP Channel"}
            </a>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
      <section className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          {[
            { icon: "🤖", text: isFr ? "IA Claude (Anthropic)" : "Claude AI (Anthropic)" },
            { icon: "⚽", text: isFr ? "500+ stats par match" : "500+ stats per match" },
            { icon: "⏰", text: isFr ? "Livraison 7h–8h chaque matin" : "Delivered 7–8 AM daily" },
            { icon: "🇨🇲", text: isFr ? "Paiement MTN MoMo" : "MTN MoMo payment" },
            { icon: "📊", text: isFr ? "Taux de réussite suivi en direct" : "Win rate tracked live" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING CARDS ────────────────────────────────────────────────── */}
      <section id="plans" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
            {isFr ? "Choisissez votre formule" : "Choose your plan"}
          </h2>
          <p className="text-gray-500 text-lg">
            {isFr
              ? "Deux niveaux. Un seul objectif : vous faire gagner plus."
              : "Two levels. One goal: make you win more."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          {/* ── CLASSIQUE ── */}
          <div className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-8 py-6">
              <div className="flex items-center gap-3 mb-1">
                <Crown className="w-6 h-6 text-gray-300" />
                <span className="text-white font-bold text-xl">VIP Classique</span>
              </div>
              <p className="text-gray-400 text-sm">
                {isFr ? "L'essentiel pour parier mieux" : "The essentials to bet better"}
              </p>
            </div>

            <div className="px-8 py-6 border-b border-gray-100">
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-extrabold text-gray-900">2 500</span>
                <div className="pb-2">
                  <div className="text-gray-500 text-sm font-medium">FCFA</div>
                  <div className="text-gray-400 text-xs">{isFr ? "/ semaine" : "/ week"}</div>
                </div>
              </div>
              <div className="text-gray-400 text-sm">
                {isFr ? "ou 8 000 FCFA / mois (~$13)" : "or 8,000 FCFA / month (~$13)"}
              </div>
            </div>

            <div className="px-8 py-6">
              <ul className="space-y-3 mb-8">
                {classiqueFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-600" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all text-base">
                {isFr ? "S'abonner Classique" : "Subscribe Classique"}
              </button>
              <p className="text-gray-400 text-xs text-center mt-3">
                {isFr ? "Résiliable à tout moment" : "Cancel anytime"}
              </p>
            </div>
          </div>

          {/* ── ELITE ── */}
          <div className="bg-gray-900 rounded-3xl border-2 border-amber-500 overflow-hidden shadow-xl shadow-amber-500/10 relative">
            <div className="absolute top-0 right-0 bg-amber-500 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-bl-2xl">
              {isFr ? "⭐ MEILLEURE OFFRE" : "⭐ BEST VALUE"}
            </div>

            <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-6">
              <div className="flex items-center gap-3 mb-1">
                <Diamond className="w-6 h-6 text-white" />
                <span className="text-white font-bold text-xl">VIP Elite</span>
              </div>
              <p className="text-amber-100 text-sm">
                {isFr ? "L'arme complète du parieur sérieux" : "The complete arsenal for serious bettors"}
              </p>
            </div>

            <div className="px-8 py-6 border-b border-gray-700">
              <div className="flex items-end gap-2 mb-1">
                <span className="text-5xl font-extrabold text-white">5 000</span>
                <div className="pb-2">
                  <div className="text-gray-300 text-sm font-medium">FCFA</div>
                  <div className="text-gray-400 text-xs">{isFr ? "/ semaine" : "/ week"}</div>
                </div>
              </div>
              <div className="text-gray-400 text-sm">
                {isFr ? "ou 15 000 FCFA / mois (~$25)" : "or 15,000 FCFA / month (~$25)"}
              </div>
            </div>

            <div className="px-8 py-6">
              <ul className="space-y-3 mb-8">
                {eliteFeatures.map((f, i) => (
                  <li key={f} className={`flex items-start gap-3 text-sm ${i === 0 ? "text-amber-400 font-semibold" : "text-gray-300"}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${i === 0 ? "bg-amber-500/30" : "bg-amber-500/20"}`}>
                      <Check className={`w-3 h-3 ${i === 0 ? "text-amber-400" : "text-amber-400"}`} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-900 font-bold py-4 rounded-xl transition-all text-base shadow-lg shadow-amber-500/30">
                {isFr ? "S'abonner Elite 💎" : "Subscribe Elite 💎"}
              </button>
              <p className="text-gray-500 text-xs text-center mt-3">
                {isFr ? "Résiliable à tout moment • Protection 3 pertes incluse" : "Cancel anytime • 3-loss protection included"}
              </p>
            </div>
          </div>
        </div>

        {/* Weekend Jackpot strip */}
        <div className="mt-8 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl border border-purple-700 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-5 h-5 text-purple-400" />
              <span className="text-white font-bold text-lg">
                {isFr ? "Weekend Jackpot — 500 FCFA" : "Weekend Jackpot — 500 FCFA"}
              </span>
            </div>
            <p className="text-purple-300 text-sm">
              {isFr
                ? "Un code accumulateur haute cote chaque vendredi soir. Pour tout le monde, sans abonnement."
                : "One high-odds accumulator code every Friday evening. For everyone, no subscription needed."}
            </p>
          </div>
          <a
            href={siteConfig.telegramVip}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl transition-all whitespace-nowrap"
          >
            {isFr ? "Recevoir le Jackpot →" : "Get the Jackpot →"}
          </a>
        </div>
      </section>

      {/* ── ELITE EXCLUSIVE: Over 1.5 & Over 0.5 ────────────────────────── */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-1.5 mb-4">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400 text-sm font-semibold">
                {isFr ? "Exclusif VIP Elite" : "VIP Elite Exclusive"}
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-3">
              {isFr ? "Les picks que personne d'autre ne donne" : "The picks nobody else provides"}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {isFr
                ? "En plus des codes 1xBet, l'IA identifie chaque matin les matchs avec les plus fortes probabilités de buts — le marché le plus régulier du football."
                : "Beyond 1xBet codes, the AI identifies every morning the matches with the highest goal probability — football's most consistent market."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">
                    {isFr ? "Top 3 Over 1.5 Buts" : "Top 3 Over 1.5 Goals"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {isFr ? "Matches les + probables à marquer 2+ buts" : "Matches most likely to see 2+ goals"}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {isFr
                  ? "L'IA calcule la probabilité Over 1.5 pour chaque match du jour et te livre les 3 meilleures opportunités avec le pourcentage exact. Marché idéal pour les combinés à risque modéré."
                  : "The AI calculates the Over 1.5 probability for every match of the day and delivers the top 3 opportunities with the exact percentage. Ideal market for moderate-risk combinations."}
              </p>
              <div className="mt-4 bg-emerald-500/10 rounded-xl p-3 flex items-center justify-between">
                <span className="text-emerald-400 text-sm font-medium">
                  {isFr ? "Exemple: PSG vs Lyon → Over 1.5" : "Example: PSG vs Lyon → Over 1.5"}
                </span>
                <span className="text-emerald-300 font-bold text-sm">87%</span>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <BarChart2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">
                    {isFr ? "Over 0.5 Dom. / Ext." : "Over 0.5 Home / Away"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {isFr ? "Probabilité de marquer par équipe" : "Goal probability per team"}
                  </p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {isFr
                  ? "Probabilité que l'équipe domicile ou extérieure marque au moins 1 but. L'IA identifie les équipes en forme offensive et les défenses poreuses pour maximiser tes chances."
                  : "Probability that the home or away team scores at least 1 goal. The AI spots in-form attacks and leaky defences to maximise your chances."}
              </p>
              <div className="mt-4 bg-blue-500/10 rounded-xl p-3 flex items-center justify-between">
                <span className="text-blue-400 text-sm font-medium">
                  {isFr ? "Exemple: Man City dom. marque" : "Example: Man City home to score"}
                </span>
                <span className="text-blue-300 font-bold text-sm">93%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKET TYPES ─────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-3">
          {isFr ? "5 types de tickets 1xBet par jour" : "5 types of 1xBet tickets per day"}
        </h2>
        <p className="text-gray-500 text-center text-sm mb-10">
          {isFr
            ? "Classique reçoit les 3 premiers. Elite reçoit les 5."
            : "Classique gets the first 3. Elite gets all 5."}
        </p>
        <div className="space-y-3">
          {tickets.map(({ name, icon: Icon, color, tier, desc }) => (
            <div
              key={name}
              className={`flex items-center gap-4 rounded-xl border p-4 transition-all ${
                tier === "elite"
                  ? "bg-amber-50 border-amber-200"
                  : "bg-white border-gray-100 hover:shadow-sm"
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-6 h-6 text-${color}-600`} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">{name}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                tier === "elite"
                  ? "bg-amber-200 text-amber-800"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {tier === "elite" ? "Elite" : "Classique+"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-12">
            {isFr ? "Comment ça marche ?" : "How does it work?"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                icon: MessageCircle,
                title: isFr ? "Abonnez-vous" : "Subscribe",
                desc: isFr ? "Choisissez Classique ou Elite et payez via MTN MoMo" : "Pick Classique or Elite and pay via MTN MoMo",
              },
              {
                step: "2",
                icon: Bell,
                title: isFr ? "Alerte Telegram" : "Telegram Alert",
                desc: isFr ? "Notification à 7h (Elite) ou 8h (Classique) avec vos codes" : "Notification at 7AM (Elite) or 8AM (Classique) with your codes",
              },
              {
                step: "3",
                icon: Zap,
                title: isFr ? "Copier-coller" : "Copy & Paste",
                desc: isFr ? "Copiez le code, collez-le dans 1xBet → le coupon se charge" : "Copy the code, paste in 1xBet → slip loads instantly",
              },
              {
                step: "4",
                icon: TrendingUp,
                title: isFr ? "Pariez & Gagnez" : "Bet & Win",
                desc: isFr ? "Confirmez le pari. Suivez les résultats en direct sur le site" : "Confirm the bet. Track live results on the website",
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-extrabold text-2xl mx-auto mb-4 relative">
                  {step}
                  <Icon className="absolute -bottom-1 -right-1 w-5 h-5 text-emerald-500 bg-white rounded-full p-0.5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ─────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-10">
          {isFr ? "Comparaison des formules" : "Plan comparison"}
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-4 text-gray-500 font-medium w-1/2">
                  {isFr ? "Fonctionnalité" : "Feature"}
                </th>
                <th className="text-center px-4 py-4 text-gray-700 font-bold">Classique</th>
                <th className="text-center px-4 py-4 text-amber-600 font-bold bg-amber-50">Elite 💎</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(isFr ? [
                ["Codes 1xBet quotidiens", "3", "5"],
                ["Livraison Telegram", "8h00", "7h00 ⚡"],
                ["Analyse IA par pick", "✓", "✓"],
                ["Proba Over 2.5 & BTTS", "✓", "✓"],
                ["Top 3 Over 1.5 Goals", "—", "✓"],
                ["Over 0.5 Dom. / Ext.", "—", "✓"],
                ["Alertes live mi-temps", "—", "✓"],
                ["Mega Accumulateur hebdo", "—", "✓"],
                ["Plan gestion bankroll", "—", "✓"],
                ["Protection 3 pertes", "—", "✓"],
                ["Support WhatsApp", "Bot", "Direct 🔥"],
                ["Codes Champions League", "—", "✓"],
                ["Weekend Jackpot", "✓", "✓"],
              ] : [
                ["Daily 1xBet codes", "3", "5"],
                ["Telegram delivery", "8:00 AM", "7:00 AM ⚡"],
                ["AI analysis per pick", "✓", "✓"],
                ["Over 2.5 & BTTS probs", "✓", "✓"],
                ["Top 3 Over 1.5 Goals", "—", "✓"],
                ["Over 0.5 Home / Away", "—", "✓"],
                ["Live halftime alerts", "—", "✓"],
                ["Weekly Mega Accumulator", "—", "✓"],
                ["Bankroll management plan", "—", "✓"],
                ["3-loss protection", "—", "✓"],
                ["WhatsApp support", "Bot", "Direct 🔥"],
                ["Champions League codes", "—", "✓"],
                ["Weekend Jackpot", "✓", "✓"],
              ]).map(([feature, classique, elite]) => (
                <tr key={feature} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-gray-700">{feature}</td>
                  <td className="text-center px-4 py-3 text-gray-500">
                    {classique === "✓" ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> :
                     classique === "—" ? <X className="w-4 h-4 text-gray-300 mx-auto" /> :
                     <span className="font-medium text-gray-700">{classique}</span>}
                  </td>
                  <td className="text-center px-4 py-3 bg-amber-50">
                    {elite === "✓" ? <Check className="w-4 h-4 text-amber-500 mx-auto" /> :
                     elite === "—" ? <X className="w-4 h-4 text-gray-300 mx-auto" /> :
                     <span className="font-semibold text-amber-700">{elite}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── TELEGRAM CTAs ────────────────────────────────────────────────── */}
      <section className="py-10 px-4 bg-gray-900">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={siteConfig.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-5 transition-colors group"
          >
            <Send className="w-7 h-7 shrink-0" />
            <div>
              <p className="font-bold text-base">
                {isFr ? "Canal Gratuit" : "Free Channel"}
              </p>
              <p className="text-blue-100 text-sm">
                @pronofootai · {isFr ? "Tips gratuits quotidiens" : "Daily free tips"}
              </p>
            </div>
            <span className="ml-auto text-xl group-hover:translate-x-1 transition-transform">→</span>
          </a>
          <a
            href={siteConfig.telegramVip}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl px-6 py-5 transition-colors group"
          >
            <Zap className="w-7 h-7 shrink-0" />
            <div>
              <p className="font-bold text-base">
                {isFr ? "Canal VIP 💎" : "VIP Channel 💎"}
              </p>
              <p className="text-amber-100 text-sm">
                @pronofootaivip · {isFr ? "Codes & analyses premium" : "Premium codes & analysis"}
              </p>
            </div>
            <span className="ml-auto text-xl group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </section>

      {/* ── AFFILIATE CTA ────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8">
          <h3 className="text-2xl font-extrabold text-white mb-2">
            {isFr ? "Pas encore de compte 1xBet ?" : "Don't have a 1xBet account yet?"}
          </h3>
          <p className="text-emerald-100 mb-6">
            {isFr
              ? "Ouvre-le maintenant avec notre lien — bonus de bienvenue inclus. Gratuit, sans engagement."
              : "Open it now with our link — welcome bonus included. Free, no commitment."}
          </p>
          <AffiliateCTA
            text={isFr ? "Créer mon compte 1xBet gratuit →" : "Create my free 1xBet account →"}
            variant="primary"
            campaign="vip_page_bottom"
          />
          <p className="text-emerald-200 text-xs mt-3">
            {isFr
              ? "Même sans abonnement VIP, un compte 1xBet te permet d'utiliser nos codes Weekend Jackpot"
              : "Even without a VIP subscription, a 1xBet account lets you use our Weekend Jackpot codes"}
          </p>
        </div>
      </section>

      {/* ── JSON-LD ──────────────────────────────────────────────────────── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "PronoFoot AI VIP",
            description: isFr
              ? "Codes tickets 1xBet quotidiens générés par IA, analyses Over 1.5, picks Over 0.5, alertes live"
              : "Daily AI-generated 1xBet ticket codes, Over 1.5 analysis, Over 0.5 picks, live alerts",
            brand: { "@type": "Brand", name: "PronoFoot AI" },
            offers: [
              {
                "@type": "Offer",
                name: "VIP Classique",
                price: "8000",
                priceCurrency: "XAF",
                priceValidUntil: "2026-12-31",
                availability: "https://schema.org/InStock",
              },
              {
                "@type": "Offer",
                name: "VIP Elite",
                price: "15000",
                priceCurrency: "XAF",
                priceValidUntil: "2026-12-31",
                availability: "https://schema.org/InStock",
              },
            ],
          }),
        }}
      />
    </div>
  );
}
