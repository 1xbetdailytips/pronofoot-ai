import { redirect } from "next/navigation";
import { Send, Crown, Zap, TrendingUp, Calendar, Mail, Shield } from "lucide-react";
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
        {isVip ? (
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
        ) : (
          <div className="bg-gray-900 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-gray-400" />
              <h2 className="font-bold text-white text-lg">
                {isFr ? "Passe au VIP" : "Upgrade to VIP"}
              </h2>
            </div>
            <p className="text-gray-400 text-sm mb-5">
              {isFr
                ? "Reçois 3 à 5 codes tickets 1xBet chaque matin avec analyses IA complètes."
                : "Get 3 to 5 1xBet ticket codes every morning with full AI analysis."}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://t.me/pronofootadmin"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                {isFr ? "S'abonner via @pronofootadmin" : "Subscribe via @pronofootadmin"}
              </a>
              <a
                href={`/${params.locale}/vip`}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                {isFr ? "Voir les formules" : "See plans"}
              </a>
            </div>
          </div>
        )}

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
