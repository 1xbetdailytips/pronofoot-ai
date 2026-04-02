"use client";

import { useState, useEffect } from "react";
import { X, Gift, ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/config";

const POPUP_DELAY_MS = 150_000; // 2.5 minutes
const STORAGE_KEY = "pronofoot_popup_shown";

type AffiliatePopupProps = {
  locale: string;
};

export default function AffiliatePopup({ locale }: AffiliatePopupProps) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const isFr = locale === "fr";

  useEffect(() => {
    // Check if popup was already shown
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // SSR or localStorage unavailable
    }

    const timer = setTimeout(() => {
      setVisible(true);
    }, POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  function handleClose() {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
    }, 300);
  }

  function handleCTA() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (!visible) return null;

  const base = siteConfig.affiliateLink;
  const sep = base.includes("?") ? "&" : "?";
  const link = `${base}${sep}utm_campaign=welcome_popup`;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Popup */}
      <div
        className={`fixed z-[9999] inset-0 flex items-center justify-center p-4 transition-all duration-300 ${
          closing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="relative w-full max-w-sm bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 rounded-2xl shadow-2xl shadow-emerald-900/50 overflow-hidden">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Decorative top sparkles */}
          <div className="absolute top-0 left-0 w-full h-32 overflow-hidden">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl" />
            <div className="absolute -top-4 right-8 w-16 h-16 bg-amber-400/20 rounded-full blur-xl" />
            <div className="absolute top-8 left-1/2 w-20 h-20 bg-emerald-400/15 rounded-full blur-2xl" />
          </div>

          {/* Content */}
          <div className="relative px-6 pt-8 pb-6 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-400 text-emerald-900 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-4">
              <Gift className="w-4 h-4" />
              {isFr ? "Offre de Bienvenue" : "Welcome Offer"}
            </div>

            {/* Brand */}
            <p className="text-white/80 text-sm font-medium mb-1">1xBet</p>

            {/* Main headline */}
            <h2 className="text-white text-3xl font-black leading-tight mb-1">
              BONUS{" "}
              <span className="text-amber-400">200%</span>
            </h2>

            {/* Amount */}
            <div className="mb-2">
              <span className="text-white/70 text-sm">{isFr ? "jusqu'à" : "up to"}</span>
              <p className="text-amber-400 text-4xl font-black tracking-tight leading-none">
                XAF 85,000
              </p>
            </div>

            {/* Promo code */}
            <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 mb-5 inline-block">
              <p className="text-white/60 text-xs mb-0.5">
                {isFr ? "Avec le code promo" : "With promo code"}
              </p>
              <p className="text-amber-400 text-xl font-black tracking-widest">
                FLYUP777
              </p>
            </div>

            {/* Football icon area */}
            <div className="relative w-20 h-20 mx-auto mb-5">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
                <svg
                  viewBox="0 0 32 32"
                  className="w-12 h-12 text-emerald-900"
                  fill="currentColor"
                >
                  <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M16 1 L20 6 L27 8 L30 15 L28 22 L22 28 L15 30 L8 27 L3 21 L2 14 L5 7 L11 3 Z" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                  <circle cx="16" cy="16" r="4" />
                  <path d="M16 12 L18 6 M16 12 L12 7 M16 20 L19 26 M16 20 L12 25 M12 16 L6 14 M20 16 L26 14 M12 16 L7 19 M20 16 L25 20" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                </svg>
              </div>
              {/* Floating coins */}
              <div className="absolute -top-2 -right-3 w-6 h-6 bg-yellow-400 rounded-full shadow-md animate-bounce" style={{ animationDelay: "0.2s" }} />
              <div className="absolute -bottom-1 -left-3 w-5 h-5 bg-amber-500 rounded-full shadow-md animate-bounce" style={{ animationDelay: "0.5s" }} />
              <div className="absolute top-0 -left-5 w-4 h-4 bg-yellow-300 rounded-full shadow-sm animate-bounce" style={{ animationDelay: "0.8s" }} />
            </div>

            {/* CTA Button */}
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCTA}
              className="block w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-900 font-extrabold text-lg py-4 rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2">
                {isFr ? "OBTIENS TON BONUS !" : "GET YOUR BONUS!"}
                <ExternalLink className="w-5 h-5" />
              </span>
            </a>

            {/* Disclaimer */}
            <p className="text-white/40 text-[10px] mt-3 leading-tight">
              {isFr
                ? "18+ | Jeu responsable | Conditions s'appliquent"
                : "18+ | Gamble responsibly | T&Cs apply"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
