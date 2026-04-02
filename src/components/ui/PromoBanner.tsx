"use client";

import { ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/config";

type PromoBannerProps = {
  locale: string;
  variant?: "best-odds" | "welcome-bonus" | "high-odds" | "live-betting" | "slim";
  campaign?: string;
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

  if (variant === "slim") {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative overflow-hidden rounded-xl bg-gradient-to-r from-[#1a3a5c] via-[#1e4d8a] to-[#1a3a5c] border border-blue-500/30"
      >
        {/* Animated shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer" />

        <div className="relative flex items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-white font-black text-lg tracking-tight">
              1<span className="text-[#4ba3f5]">X</span>BET
            </span>
            <span className="hidden sm:inline text-white/60 text-xs">|</span>
            <span className="hidden sm:inline text-white/90 text-sm font-medium">
              {isFr
                ? "Les meilleures cotes du marche"
                : "Best odds on the market"}
            </span>
          </div>
          <span className="flex items-center gap-1.5 bg-[#2dc653] hover:bg-[#25a847] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors group-hover:scale-105 transform duration-200">
            {isFr ? "PARIER" : "BET NOW"}
            <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </a>
    );
  }

  if (variant === "welcome-bonus") {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative overflow-hidden rounded-2xl"
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b2a] via-[#1b2838] to-[#0d2137]" />

        {/* Radial glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#4ba3f5]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl" />

        {/* Animated particles */}
        <div className="absolute top-4 left-[15%] w-2 h-2 bg-amber-400/60 rounded-full animate-float" />
        <div className="absolute top-8 right-[25%] w-1.5 h-1.5 bg-blue-400/50 rounded-full animate-float-delayed" />
        <div className="absolute bottom-6 left-[40%] w-2 h-2 bg-emerald-400/40 rounded-full animate-float" />

        {/* Content */}
        <div className="relative px-6 py-8 sm:py-10 flex flex-col sm:flex-row items-center gap-6">
          {/* Left side */}
          <div className="flex-1 text-center sm:text-left">
            {/* 1XBET Logo */}
            <div className="mb-3">
              <span className="text-white font-black text-3xl sm:text-4xl tracking-tight">
                1<span className="text-[#4ba3f5]">X</span>BET
              </span>
            </div>

            <h3 className="text-white font-extrabold text-xl sm:text-2xl leading-tight mb-2 uppercase">
              {isFr
                ? "Choisissez la Meilleure Cote"
                : "Choose the Best Odds"}
              <br />
              <span className="text-[#2dc653]">
                {isFr ? "et Gagnez Plus Aujourd'hui" : "and Win More Today"}
              </span>
            </h3>

            <p className="text-white/50 text-xs mb-4">
              {isFr
                ? "Code promo: FLYUP777 | Bonus 200% jusqu'a 85,000 XAF"
                : "Promo code: FLYUP777 | 200% Bonus up to 85,000 XAF"}
            </p>

            <span className="inline-flex items-center gap-2 bg-[#2dc653] hover:bg-[#25a847] text-white font-extrabold text-sm sm:text-base px-6 py-3 rounded-xl transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-emerald-500/25 transform">
              {isFr ? "PARIER MAINTENANT!" : "BET NOW!"}
              <ExternalLink className="w-4 h-4" />
            </span>
          </div>

          {/* Right side - visual element */}
          <div className="hidden sm:flex flex-col items-center gap-2">
            {/* Odds display */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3">
              <p className="text-white/60 text-[10px] uppercase tracking-wider mb-1 text-center">
                {isFr ? "Cotes Elevees" : "High Odds"}
              </p>
              <div className="flex items-center gap-2">
                {["x5", "x10", "x15"].map((odd) => (
                  <span
                    key={odd}
                    className="bg-[#4ba3f5]/20 text-[#4ba3f5] text-xs font-bold px-2.5 py-1 rounded"
                  >
                    {odd}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex justify-center">
                <span className="bg-[#2dc653] text-white text-lg font-black px-4 py-1 rounded-lg">
                  x20
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative bg-[#2dc653]/90 px-4 py-2 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <p className="text-white text-xs font-medium">
            {isFr
              ? "Choisissez la meilleure cote et gagnez plus aujourd'hui"
              : "Choose the best odds and win more today"}
          </p>
        </div>
      </a>
    );
  }

  if (variant === "high-odds") {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a0a3e] via-[#2d1b69] to-[#1a0a3e]" />

        {/* Animated rays */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent,#7c3aed_20deg,transparent_40deg)] animate-spin-slow" />
        </div>

        <div className="relative px-6 py-8 text-center">
          <span className="text-white font-black text-2xl tracking-tight">
            1<span className="text-[#4ba3f5]">X</span>BET
          </span>

          <div className="my-4">
            <p className="text-amber-400 text-sm font-bold uppercase tracking-wider mb-1">
              {isFr ? "Bonus de Bienvenue" : "Welcome Bonus"}
            </p>
            <p className="text-white font-black text-5xl sm:text-6xl leading-none">
              200<span className="text-amber-400">%</span>
            </p>
            <p className="text-white/70 text-sm mt-1">
              {isFr ? "jusqu'a" : "up to"}{" "}
              <span className="text-white font-bold">85,000 XAF</span>
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-4 py-2 mb-5">
            <span className="text-white/60 text-xs">
              {isFr ? "Code:" : "Code:"}
            </span>
            <span className="text-amber-400 font-black text-lg tracking-wider">
              FLYUP777
            </span>
          </div>

          <div className="block">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold px-8 py-3.5 rounded-xl transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-amber-500/30 transform text-lg">
              {isFr ? "INSCRIPTION GRATUITE" : "FREE SIGN UP"}
              <ExternalLink className="w-5 h-5" />
            </span>
          </div>

          <p className="text-white/30 text-[10px] mt-4">
            18+ | {isFr ? "Jeu responsable" : "Gamble responsibly"} | T&Cs
          </p>
        </div>
      </a>
    );
  }

  if (variant === "live-betting") {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="group block relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a1628] via-[#162d50] to-[#0a1628] border border-blue-500/20"
      >
        {/* Animated pulse background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-shimmer" />
        </div>

        <div className="relative px-5 py-5 sm:py-6 flex flex-col sm:flex-row items-center gap-4">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/30 rounded-full px-3 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              <span className="text-red-400 text-xs font-bold uppercase">Live</span>
            </div>

            <span className="text-white font-black text-xl tracking-tight">
              1<span className="text-[#4ba3f5]">X</span>BET
            </span>
          </div>

          {/* Center */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-white font-bold text-sm sm:text-base">
              {isFr
                ? "Pariez en Direct sur les Matchs d'Aujourd'hui"
                : "Bet Live on Today's Matches"}
            </p>
            <p className="text-white/50 text-xs">
              {isFr
                ? "Cash-out disponible | Cotes en temps reel"
                : "Cash-out available | Real-time odds"}
            </p>
          </div>

          {/* CTA */}
          <span className="flex items-center gap-1.5 bg-[#4ba3f5] hover:bg-[#3b93e5] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 group-hover:scale-105 transform whitespace-nowrap">
            {isFr ? "PARIS EN DIRECT" : "LIVE BETS"}
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>
    );
  }

  // Default: best-odds variant
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative overflow-hidden rounded-2xl"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#003d99] via-[#0050cc] to-[#003d99]" />

      {/* Animated starburst */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 origin-bottom"
              style={{
                height: "50%",
                transform: `rotate(${i * 30}deg)`,
                background: "linear-gradient(to top, transparent, rgba(255,255,255,0.3))",
              }}
            />
          ))}
        </div>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer" />

      <div className="relative px-6 py-7 sm:py-8 flex flex-col sm:flex-row items-center gap-5">
        {/* Left */}
        <div className="flex-1 text-center sm:text-left">
          <span className="text-white font-black text-3xl tracking-tight mb-2 block">
            1<span className="text-[#4ba3f5]">X</span>BET
          </span>
          <h3 className="text-white font-extrabold text-lg sm:text-xl uppercase leading-tight">
            {isFr
              ? "Choisissez la Meilleure Cote"
              : "Choose the Best Odds"}
            <br />
            <span className="text-amber-300">
              {isFr
                ? "et Gagnez Plus Aujourd'hui"
                : "and Win More Today"}
            </span>
          </h3>
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-2">
          <span className="inline-flex items-center gap-2 bg-[#2dc653] hover:bg-[#25a847] text-white font-extrabold text-base sm:text-lg px-7 py-3.5 rounded-full transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transform border-2 border-[#5fd97a]">
            {isFr ? "PARIER MAINTENANT!" : "BET NOW!"}
            <ExternalLink className="w-4 h-4" />
          </span>
          <span className="text-white/40 text-[10px]">
            18+ | T&Cs
          </span>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="relative h-1 bg-gradient-to-r from-[#2dc653] via-[#4ba3f5] to-[#2dc653]" />
    </a>
  );
}
