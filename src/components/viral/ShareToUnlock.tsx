"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Lock, Share2, Send, MessageCircle, Copy, Check, ExternalLink, Unlock } from "lucide-react";
import { siteConfig } from "@/lib/config";

type ShareToUnlockProps = {
  children: ReactNode;
  contentId: string; // Unique ID for this locked content
  locale: string;
  previewLines?: number; // How many lines to show before blur
  title?: string;
  variant?: "analysis" | "prediction" | "combo";
};

const STORAGE_KEY = "pf_unlocked";
const SITE_URL = "https://www.parifoot.online";

function getUnlockedSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveUnlocked(id: string) {
  const set = getUnlockedSet();
  set.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
}

export default function ShareToUnlock({
  children,
  contentId,
  locale,
  previewLines = 2,
  title,
  variant = "analysis",
}: ShareToUnlockProps) {
  const isFr = locale === "fr";
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsUnlocked(getUnlockedSet().has(contentId));
  }, [contentId]);

  const handleUnlock = (method: string) => {
    setIsUnlocking(true);

    const shareText = isFr
      ? "Je viens de trouver des pronostics football gratuits par IA sur PronoFoot AI! Regarde ca:"
      : "I just found free AI football predictions on PronoFoot AI! Check this out:";
    const shareUrl = `${SITE_URL}/${locale}/predictions?ref=share_${contentId}`;

    switch (method) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank");
        break;
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
        break;
      case "copy":
        navigator.clipboard?.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
      case "affiliate": {
        const base = siteConfig.affiliateLink;
        const sep = base.includes("?") ? "&" : "?";
        window.open(`${base}${sep}utm_campaign=unlock_${contentId}`, "_blank");
        break;
      }
    }

    // Unlock after a brief delay (simulating verification)
    setTimeout(() => {
      saveUnlocked(contentId);
      setIsUnlocked(true);
      setIsUnlocking(false);
    }, 1500);
  };

  // Already unlocked — show content normally
  if (isUnlocked) {
    return <div className="relative">{children}</div>;
  }

  // Unlocking animation
  if (isUnlocking) {
    return (
      <div className="relative rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 flex flex-col items-center justify-center min-h-[120px]">
        <div className="animate-bounce mb-2">
          <Unlock className="w-8 h-8 text-emerald-500" />
        </div>
        <p className="text-emerald-700 font-semibold text-sm animate-pulse">
          {isFr ? "Contenu en cours de deblocage..." : "Unlocking content..."}
        </p>
      </div>
    );
  }

  // Labels
  const variantLabels = {
    analysis: isFr ? "Analyse IA Complete" : "Full AI Analysis",
    prediction: isFr ? "Prediction Premium" : "Premium Prediction",
    combo: isFr ? "Combine Premium" : "Premium Combo",
  };

  const variantColors = {
    analysis: "from-blue-600 to-indigo-700",
    prediction: "from-emerald-600 to-teal-700",
    combo: "from-amber-600 to-orange-700",
  };

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200">
      {/* Blurred preview */}
      <div className="relative">
        <div
          className="p-4 blur-sm select-none pointer-events-none"
          style={{
            maxHeight: `${previewLines * 24 + 32}px`,
            overflow: "hidden",
          }}
        >
          {children}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/70 to-white" />
      </div>

      {/* Unlock overlay */}
      <div className="p-5 bg-white border-t border-gray-100">
        {/* Lock badge */}
        <div className="flex items-center justify-center mb-4">
          <div className={`flex items-center gap-2 bg-gradient-to-r ${variantColors[variant]} text-white text-xs font-bold px-4 py-1.5 rounded-full`}>
            <Lock className="w-3.5 h-3.5" />
            {title || variantLabels[variant]}
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mb-4">
          {isFr
            ? "Partagez pour debloquer ce contenu premium gratuitement"
            : "Share to unlock this premium content for free"}
        </p>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => handleUnlock("whatsapp")}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
          <button
            onClick={() => handleUnlock("telegram")}
            className="flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b3] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
            Telegram
          </button>
          <button
            onClick={() => handleUnlock("twitter")}
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Twitter / X
          </button>
          <button
            onClick={() => handleUnlock("copy")}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2.5 rounded-lg transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            {copied ? (isFr ? "Copie !" : "Copied!") : (isFr ? "Copier Lien" : "Copy Link")}
          </button>
        </div>

        {/* OR divider */}
        <div className="flex items-center gap-3 my-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[10px] text-gray-400 uppercase font-medium">
            {isFr ? "ou" : "or"}
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Affiliate unlock */}
        <button
          onClick={() => handleUnlock("affiliate")}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold py-2.5 rounded-lg transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {isFr ? "Debloquer via 1xBet" : "Unlock via 1xBet"}
        </button>

        <p className="text-center text-[10px] text-gray-400 mt-2">
          {isFr
            ? "Le contenu reste debloque sur cet appareil"
            : "Content stays unlocked on this device"}
        </p>
      </div>
    </div>
  );
}
