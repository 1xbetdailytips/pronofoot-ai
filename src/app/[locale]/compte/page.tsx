import { redirect } from "next/navigation";
import { Send, Crown, Zap, TrendingUp, Calendar, Mail, Shield, Check, Star, Flame } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase-server";
import { supabase as supabaseData } from "@/lib/supabase";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function AccountPage({ params }: { params: { locale: string } }) {
  const isFr = params.locale === "fr";
  const supabase = createSupabaseServer();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${params.locale}/login`);
  }

  // Check VIP status by email
  const { data: vipMember } = await supabaseData
    .from("vip_members")
    .select("*")
    .eq("phone", user.email)
    .single();

  const isVip = vipMember?.active && new Date(vipMember.expires_at) > new Date();
  const vipPlan = vipMember?.plan || null;

  const planLabels: Record<string, string> = {
    weekly: "Classique (Semaine)",
    monthly: "Classique (Mois)",
    weekly_elite: "Elite (Semaine)",
    monthly_elite: "Elite (Mois)",
    jackpot: "Weekend Jackpot",
  };

  const expiryDate = vipMember?.expires_at
    ? new Date(vipMember.expires_at).toLocaleDateString(isFr ? "fr-FR" : "en-GB", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {isFr ? "Mon Compte" : "My Account"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isFr ? "Gère ton profil et ton abonnement VIP" : "Manage your profile and VIP subscription"}
          </p>
        </div>
        <LogoutButton locale={params.locale} />
      </div>

      <div className="space-y-6">

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <Mail className="w-7 h-7 text-emerald-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">
                {user.user_metadata?.full_name || user.email?.split("@")[0] || "User"}
              </h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-500 text-xs font-medium mb-1">
                {isFr ? "Membre depuis" : "Member since"}
              </p>
              <p className="font-semibold text-gray-900">
                {new Date(user.created_at).toLocaleDateString(isFr ? "fr-FR" : "en-GB", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-500 text-xs font-medium mb-1">
                {isFr ? "Statut" : "Status"}
              </p>
              <div className="flex items-center gap-2">
                {isVip ? (
                  <>
                    <Crown className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold text-amber-600">VIP</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-emerald-500" />
                    <span className="font-semibold text-gray-700">
                      {isFr ? "Gratuit" : "Free"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* VIP Status Card */}
        {isVip && (
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-7 h-7" />
              <h2 className="font-bold text-xl">
                {isFr ? "Abonnement VIP Actif" : "Active VIP Subscription"}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/20 rounded-xl p-4">
                <p className="text-amber-100 text-xs font-medium mb-1">
                  {isFr ? "Formule" : "Plan"}
                </p>
                <p className="font-bold text-lg">{planLabels[vipPlan!] || vipPlan}</p>
              </div>
              <div className="bg-white/20 rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-100" />
                  <p className="text-amber-100 text-xs font-medium">
                    {isFr ? "Expire le" : "Expires on"}
                  </p>
                </div>
                <p className="font-bold text-lg">{expiryDate}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <a
                href="https://t.me/pronofootaivip"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                {isFr ? "Canal VIP Telegram" : "VIP Telegram Channel"}
              </a>
            </div>
          </div>
        )}

        {/* VIP Plans Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Star className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-gray-900 text-lg">
              {isVip
                ? (isFr ? "Toutes les formules VIP" : "All VIP Plans")
                : (isFr ? "Passe au VIP" : "Upgrade to VIP")}
            </h2>
          </div>
          {!isVip && (
            <p className="text-gray-500 text-sm mb-5">
              {isFr
                ? "Reçois des codes tickets 1xBet chaque matin avec analyses IA complètes."
                : "Get 1xBet ticket codes every morning with full AI analysis."}
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Classique Plan */}
            <div className={`rounded-2xl border-2 p-5 ${vipPlan === "weekly" || vipPlan === "monthly" ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-white"}`}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">VIP Classique</h3>
                  {(vipPlan === "weekly" || vipPlan === "monthly") && (
                    <span className="text-xs font-medium text-amber-600">
                      {isFr ? "Votre formule actuelle" : "Your current plan"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-extrabold text-gray-900">2 500</span>
                <span className="text-sm text-gray-500">FCFA/{isFr ? "sem" : "wk"}</span>
                <span className="text-gray-400 mx-1">|</span>
                <span className="text-lg font-bold text-gray-700">8 000</span>
                <span className="text-sm text-gray-500">FCFA/{isFr ? "mois" : "mo"}</span>
              </div>

              <ul className="space-y-2 mb-4">
                {[
                  isFr ? "3 codes tickets 1xBet/jour" : "3 1xBet codes/day",
                  isFr ? "Analyse IA complète" : "Full AI analysis",
                  isFr ? "Over 2.5 & BTTS inclus" : "Over 2.5 & BTTS included",
                  isFr ? "Livraison Telegram 8h00" : "Telegram delivery 8:00 AM",
                  isFr ? "Accès Weekend Jackpot" : "Weekend Jackpot access",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {!(vipPlan === "weekly" || vipPlan === "monthly") && (
                <a
                  href="https://t.me/pronofootadmin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors w-full"
                >
                  <Send className="w-4 h-4" />
                  {isFr ? "S'abonner" : "Subscribe"}
                </a>
              )}
            </div>

            {/* Elite Plan */}
            <div className={`rounded-2xl border-2 p-5 relative ${vipPlan === "weekly_elite" || vipPlan === "monthly_elite" ? "border-amber-400 bg-amber-50" : "border-amber-300 bg-gradient-to-b from-amber-50 to-white"}`}>
              {!(vipPlan === "weekly_elite" || vipPlan === "monthly_elite") && (
                <div className="absolute -top-3 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {isFr ? "POPULAIRE" : "POPULAR"}
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">VIP Elite</h3>
                  {(vipPlan === "weekly_elite" || vipPlan === "monthly_elite") && (
                    <span className="text-xs font-medium text-amber-600">
                      {isFr ? "Votre formule actuelle" : "Your current plan"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-extrabold text-gray-900">5 000</span>
                <span className="text-sm text-gray-500">FCFA/{isFr ? "sem" : "wk"}</span>
                <span className="text-gray-400 mx-1">|</span>
                <span className="text-lg font-bold text-gray-700">15 000</span>
                <span className="text-sm text-gray-500">FCFA/{isFr ? "mois" : "mo"}</span>
              </div>

              <ul className="space-y-2 mb-4">
                {[
                  isFr ? "5 codes tickets 1xBet/jour" : "5 1xBet codes/day",
                  isFr ? "Tout Classique + Risque + Jackpot" : "All Classique + Risk + Jackpot",
                  isFr ? "Livraison prioritaire 7h00" : "Priority delivery 7:00 AM",
                  isFr ? "Picks Over 1.5 — Top 3 matchs" : "Over 1.5 Picks — Top 3 matches",
                  isFr ? "Alertes live mi-temps" : "Live halftime alerts",
                  isFr ? "Protection 3 pertes → 2j offerts" : "3-loss protection → 2 days free",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                    <Check className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {!(vipPlan === "weekly_elite" || vipPlan === "monthly_elite") && (
                <a
                  href="https://t.me/pronofootadmin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold py-2.5 rounded-xl text-sm transition-colors w-full"
                >
                  <Send className="w-4 h-4" />
                  {isFr ? "S'abonner Elite" : "Subscribe Elite"}
                </a>
              )}
            </div>
          </div>

          {/* Weekend Jackpot mini card */}
          <div className={`mt-4 rounded-2xl border p-4 flex items-center justify-between ${vipPlan === "jackpot" ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-white"}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Weekend Jackpot</h3>
                <p className="text-xs text-gray-500">
                  {isFr ? "1 accumulateur haute cote chaque vendredi soir" : "1 high-odds accumulator every Friday evening"}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <p className="font-extrabold text-gray-900">500 <span className="text-xs font-medium text-gray-500">FCFA</span></p>
              <p className="text-xs text-gray-400">{isFr ? "one-shot" : "one-time"}</p>
            </div>
          </div>

          {/* Payment info */}
          <div className="mt-4 bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">
              {isFr
                ? "Paiement par MTN MoMo ou Orange Money via"
                : "Pay via MTN MoMo or Orange Money through"}{" "}
              <a href="https://t.me/pronofootadmin" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-semibold hover:underline">
                @pronofootadmin
              </a>{" "}
              {isFr ? "sur Telegram" : "on Telegram"}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href={`/${params.locale}/predictions`}
            className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-300 hover:shadow-sm transition-all group"
          >
            <TrendingUp className="w-5 h-5 text-emerald-600 mb-2" />
            <p className="font-semibold text-gray-900 text-sm">
              {isFr ? "Pronostics du jour" : "Today's predictions"}
            </p>
          </a>
          <a
            href={`/${params.locale}/stats`}
            className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-300 hover:shadow-sm transition-all group"
          >
            <Zap className="w-5 h-5 text-emerald-600 mb-2" />
            <p className="font-semibold text-gray-900 text-sm">
              {isFr ? "Performance IA" : "AI Win Rate"}
            </p>
          </a>
          <a
            href="https://t.me/pronofootai"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-emerald-300 hover:shadow-sm transition-all group"
          >
            <Send className="w-5 h-5 text-blue-500 mb-2" />
            <p className="font-semibold text-gray-900 text-sm">
              {isFr ? "Canal Telegram" : "Telegram Channel"}
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
