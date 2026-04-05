"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Lock, MessageCircle } from "lucide-react";
// WhatsApp-only share gate for premium content

type ShareGateProps = {
  children: ReactNode;
  featureId: string; // "ai-lab" | "bet-builder"
  locale: string;
  title?: string;
  description?: string;
};

const STORAGE_KEY = "pf_share_gate";
const SITE_URL = "https://www.parifoot.online";

type GateState = {
  [featureId: string]: string; // date string when unlocked (e.g. "2026-04-05")
};

function getGateState(): GateState {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function isUnlockedToday(featureId: string): boolean {
  const state = getGateState();
  const unlockedDate = state[featureId];
  if (!unlockedDate) return false;
  const today = new Date().toISOString().slice(0, 10);
  return unlockedDate === today;
}

function unlockFeature(featureId: string) {
  const state = getGateState();
  state[featureId] = new Date().toISOString().slice(0, 10);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function ShareGate({
  children,
  featureId,
  locale,
  title,
  description,
}: ShareGateProps) {
  const isFr = locale === "fr";
  const [unlocked, setUnlocked] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    setUnlocked(isUnlockedToday(featureId));
  }, [featureId]);

  // After sharing, unlock with a brief delay for effect
  const handleShare = () => {
    const shareUrl = `${SITE_URL}/${locale}/${featureId}`;
    const shareText = isFr
      ? `Découvre les pronostics IA de PronoFoot AI — analyse avancée gratuite ! 🏆⚽`
      : `Check out PronoFoot AI's predictions — free advanced AI analysis! 🏆⚽`;

    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`, "_blank");

    // Unlock after share action
    setShared(true);
    setTimeout(() => {
      unlockFeature(featureId);
      setUnlocked(true);
    }, 1500);
  };

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred preview */}
      <div className="blur-[6px] pointer-events-none select-none opacity-60 max-h-[400px] overflow-hidden">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent via-white/80 to-white">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 sm:p-8 max-w-sm mx-4 text-center">
          {shared ? (
            // Unlocking animation
            <div className="py-4">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
              <p className="text-emerald-600 font-bold text-lg">
                {isFr ? "Déverrouillage en cours..." : "Unlocking..."}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {isFr ? "Merci pour le partage !" : "Thanks for sharing!"}
              </p>
            </div>
          ) : (
            // Share prompt
            <>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Lock className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {title || (isFr ? "Contenu Premium" : "Premium Content")}
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                {description || (isFr
                  ? "Partagez avec un ami pour débloquer cette fonctionnalité gratuitement pendant 24h"
                  : "Share with a friend to unlock this feature free for 24 hours")}
              </p>

              {/* WhatsApp share button */}
              <button
                onClick={() => handleShare()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-base font-bold transition-colors shadow-md"
              >
                <MessageCircle className="w-5 h-5" />
                {isFr ? "Partager sur WhatsApp" : "Share on WhatsApp"}
              </button>

              <p className="text-[10px] text-gray-400 mt-4">
                {isFr
                  ? "🔓 L'accès se renouvelle chaque jour — revenez partager demain !"
                  : "🔓 Access renews daily — come back and share again tomorrow!"}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
