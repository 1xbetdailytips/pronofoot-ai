"use client";

import { useState } from "react";
import {
  Copy,
  Check,
  Lock,
  Shield,
  Flame,
  Zap,
  AlertTriangle,
} from "lucide-react";
import AffiliateCTA from "@/components/ui/AffiliateCTA";
import { cn, getRiskColor } from "@/lib/utils";

type TicketCardProps = {
  name: string;
  bookingCode: string;
  totalOdds: number;
  riskLevel: string;
  matchCount: number;
  isFree: boolean;
  isLocked: boolean;
  locale: string;
  translations: {
    copyCode: string;
    copied: string;
    bookingCode: string;
    totalOdds: string;
    matches: string;
    vipOnly: string;
    free: string;
    openSlip: string;
    getVip: string;
  };
};

const riskIcons = {
  safe: Shield,
  medium: Zap,
  high: Flame,
  extreme: AlertTriangle,
};

export default function TicketCard({
  name,
  bookingCode,
  totalOdds,
  riskLevel,
  matchCount,
  isFree,
  isLocked,
  locale,
  translations: t,
}: TicketCardProps) {
  const [copied, setCopied] = useState(false);
  const RiskIcon = riskIcons[riskLevel as keyof typeof riskIcons] || Shield;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg",
        getRiskColor(riskLevel),
        isLocked && "opacity-90"
      )}
    >
      {/* Badge */}
      <div className="flex items-center justify-between px-5 py-3 border-b">
        <div className="flex items-center gap-2">
          <RiskIcon className="w-5 h-5" />
          <span className="font-bold">{name}</span>
        </div>
        {isFree ? (
          <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {t.free}
          </span>
        ) : (
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Crown className="w-3 h-3" />
            VIP
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Stats row */}
        <div className="flex justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">{t.matches}</p>
            <p className="text-lg font-bold text-gray-900">{matchCount}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase">{t.totalOdds}</p>
            <p className="text-lg font-bold text-gray-900">
              {totalOdds.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Booking Code */}
        {isLocked ? (
          <div className="relative">
            {/* Blurred fake code */}
            <div className="bg-gray-100 rounded-xl p-4 text-center filter blur-sm select-none">
              <p className="text-xs text-gray-500 mb-1">{t.bookingCode}</p>
              <p className="text-2xl font-mono font-bold tracking-wider text-gray-800">
                AB12CD34
              </p>
            </div>
            {/* Lock overlay */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-2">
              <Lock className="w-6 h-6 text-amber-500" />
              <p className="text-sm font-semibold text-gray-700">
                {t.vipOnly}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-500 mb-1">{t.bookingCode}</p>
            <p className="text-2xl font-mono font-bold tracking-wider text-gray-900 mb-3">
              {bookingCode}
            </p>
            <button
              onClick={handleCopy}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                copied
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" /> {t.copied}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> {t.copyCode}
                </>
              )}
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="mt-4 text-center">
          {isLocked ? (
            <a
              href={`/${locale}/vip`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold px-6 py-2.5 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              <Crown className="w-4 h-4" />
              {t.getVip}
            </a>
          ) : (
            <AffiliateCTA
              text={t.openSlip}
              variant="primary"
              campaign="ticket_code"
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Crown icon for the VIP badge
function Crown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  );
}
