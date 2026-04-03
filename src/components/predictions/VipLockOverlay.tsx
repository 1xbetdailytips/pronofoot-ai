"use client";

import { Lock, Zap } from "lucide-react";
import Link from "next/link";

type Props = {
  locale: string;
  matchCount: number;
};

export default function VipLockOverlay({ locale, matchCount }: Props) {
  const isFr = locale === "fr";

  return (
    <div className="relative">
      {/* Blur mask */}
      <div className="absolute inset-0 z-10 backdrop-blur-[6px] bg-white/60 rounded-xl" />

      {/* Lock CTA */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
        <div className="bg-white/95 backdrop-blur-sm border border-amber-200 rounded-2xl p-6 sm:p-8 text-center max-w-sm shadow-xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {isFr
              ? `${matchCount}+ pronostics supplémentaires`
              : `${matchCount}+ more predictions`}
          </h3>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            {isFr
              ? "Débloquez la recherche avancée et tous les pronostics avec l'accès VIP."
              : "Unlock advanced search and all predictions with VIP access."}
          </p>
          <Link
            href={`/${locale}/vip`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Zap className="w-4 h-4" />
            {isFr ? "Devenir VIP" : "Go VIP"}
          </Link>
        </div>
      </div>

      {/* Blurred content placeholder (3 fake rows) */}
      <div className="pointer-events-none select-none opacity-40">
        {Array.from({ length: Math.min(matchCount, 6) }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 border-b border-gray-100"
          >
            <div className="w-12 h-3 bg-gray-200 rounded" />
            <div className="flex-1 h-3 bg-gray-200 rounded" />
            <div className="w-8 h-3 bg-gray-200 rounded" />
            <div className="flex-1 h-3 bg-gray-200 rounded" />
            <div className="w-16 h-3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
