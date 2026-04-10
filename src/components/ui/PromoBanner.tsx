import { ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/config";

type PromoBannerProps = {
  locale: string;
  variant?: "best-odds" | "welcome-bonus" | "high-odds" | "live-betting" | "slim";
  campaign?: string;
};

// Official 1xBet partner materials with real players
const BANNER_MAP = {
  "best-odds": "/images/banners/banner-sports.gif",
  "welcome-bonus": "/images/banners/banner-welcome.gif",
  "high-odds": "/images/banners/banner-fire.gif",
  "live-betting": "/images/banners/banner-barca-wide.gif",
  "slim": "/images/banners/banner-barca-slim.gif",
};

export default function PromoBanner({
  locale,
  variant = "best-odds",
  campaign = "promo_banner",
}: PromoBannerProps) {
  const isFr = locale === "fr";
  const base = siteConfig.affiliateLink;
  const sep = base.includes("?") ? "&" : "?";
  const link = `${base}${sep}utm_campaign=${campaign}`;
  const bannerSrc = BANNER_MAP[variant] || BANNER_MAP["best-odds"];

  if (variant === "slim") {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative overflow-hidden rounded-xl border border-gray-200/30 dark:border-gray-700/30"
      >
        {/* Banner image as background */}
        <div className="relative">
          <img
            src={bannerSrc}
            alt="1xBet - Global Partner of FC Barcelona"
            className="w-full h-auto object-cover"
            loading="lazy"
          />
          {/* FLYUP777 + CTA overlay */}
          <div className="absolute inset-0 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <span className="bg-black/60 backdrop-blur-sm text-amber-400 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-md border border-amber-500/30 tracking-wider">
                FLYUP777
              </span>
              <span className="hidden sm:inline text-white/90 text-xs font-medium drop-shadow-lg">
                {isFr ? "Les meilleures cotes du marche" : "Best odds on the market"}
              </span>
            </div>
            <span className="flex items-center gap-1.5 bg-[#2dc653] hover:bg-[#25a847] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors group-hover:scale-105 transform duration-200 shadow-lg">
              {isFr ? "PARIER" : "BET NOW"}
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </div>
      </a>
    );
  }

  // All other variants use the same layout: banner image + overlay with FLYUP777
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative overflow-hidden rounded-2xl border border-gray-200/30 dark:border-gray-700/30 shadow-md"
    >
      {/* Banner image */}
      <div className="relative">
        <img
          src={bannerSrc}
          alt="1xBet - Official Partner"
          className="w-full h-auto object-cover"
          loading={variant === "welcome-bonus" || variant === "best-odds" ? undefined : "lazy"}
        />

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center px-5 sm:px-8">
          <div className="flex-1">
            {/* Variant-specific headline */}
            {variant === "welcome-bonus" && (
              <div>
                <p className="text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider mb-0.5 drop-shadow-lg">
                  {isFr ? "Bonus de Bienvenue" : "Welcome Bonus"}
                </p>
                <p className="text-white font-black text-3xl sm:text-5xl leading-none drop-shadow-xl">
                  200<span className="text-amber-400">%</span>
                </p>
                <p className="text-white/70 text-xs sm:text-sm mt-1 drop-shadow-lg">
                  {isFr ? "jusqu'à" : "up to"}{" "}
                  <span className="text-white font-bold">$200 (125,000 XAF)</span>
                </p>
                <p className="text-amber-300 text-[10px] sm:text-xs mt-0.5 font-bold drop-shadow-lg">
                  {isFr ? "Code promo:" : "Promo code:"} FLYUP777
                </p>
              </div>
            )}

            {variant === "live-betting" && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 rounded-full px-3 py-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  <span className="text-red-400 text-xs font-bold uppercase">LIVE</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm sm:text-lg drop-shadow-lg">
                    {isFr ? "Pariez en Direct" : "Bet Live on Today's Matches"}
                  </p>
                  <p className="text-white/60 text-[10px] sm:text-xs drop-shadow-lg">
                    {isFr ? "Cash-out disponible | Cotes en temps reel" : "Cash-out available | Real-time odds"}
                  </p>
                </div>
              </div>
            )}

            {variant === "high-odds" && (
              <div>
                <p className="text-white font-black text-lg sm:text-2xl uppercase drop-shadow-xl">
                  {isFr ? "Cotes Elevees" : "High Odds"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {["x5", "x10", "x20"].map((odd) => (
                    <span key={odd} className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded border border-white/20">
                      {odd}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {variant === "best-odds" && (
              <div>
                <p className="text-white font-extrabold text-sm sm:text-xl uppercase drop-shadow-xl leading-tight">
                  {isFr ? "Choisissez la Meilleure Cote" : "Choose the Best Odds"}
                </p>
                <p className="text-amber-300 font-bold text-xs sm:text-base drop-shadow-lg">
                  {isFr ? "et Gagnez Plus Aujourd'hui" : "and Win More Today"}
                </p>
              </div>
            )}
          </div>

          {/* Right side: FLYUP777 badge + CTA */}
          <div className="flex flex-col items-end gap-2">
            <span className="bg-black/60 backdrop-blur-sm text-amber-400 text-xs sm:text-sm font-black px-3 py-1.5 rounded-lg border border-amber-500/30 tracking-wider shadow-lg">
              FLYUP777
            </span>
            <span className="flex items-center gap-1.5 bg-[#2dc653] hover:bg-[#25a847] text-white font-extrabold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl transition-all duration-200 group-hover:scale-105 transform shadow-lg whitespace-nowrap">
              {isFr ? "PARIER" : "BET NOW"}
              <ExternalLink className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
