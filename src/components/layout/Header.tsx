"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import AuthButton from "@/components/auth/AuthButton";
import Logo from "@/components/ui/Logo";

type HeaderProps = {
  locale: string;
  translations: {
    home: string;
    livescore: string;
    predictions: string;
    dailyReport: string;
    tickets: string;
    stats: string;
    blog: string;
    vip: string;
    language: string;
    siteName: string;
  };
};

/* ─── Custom colored SVG icons ─── */

function LivescoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="#ef4444" strokeWidth="1.8" fill="#fef2f2" />
      <circle cx="12" cy="12" r="3.5" fill="#ef4444" opacity="0.2" />
      <circle cx="12" cy="12" r="1.5" fill="#ef4444" />
      <path d="M7 8v8M17 8v8M2 12h20" stroke="#ef4444" strokeWidth="1.2" opacity="0.5" />
      <circle cx="19" cy="6" r="2.5" fill="#ef4444">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function PredictionsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#f59e0b" opacity="0.15" stroke="#f59e0b" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 7v5l3 3" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ReportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="2" width="18" height="20" rx="2.5" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
      <path d="M7 7h10M7 11h7M7 15h10" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="18" cy="17" r="3.5" fill="#3b82f6" opacity="0.2" />
      <path d="M16.5 17l1 1 2-2" stroke="#3b82f6" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TicketsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 9a3 3 0 013-3h14a3 3 0 013 3v0a3 3 0 00-3 3 3 3 0 003 3v0a3 3 0 01-3 3H5a3 3 0 01-3-3v0a3 3 0 003-3 3 3 0 00-3-3z" fill="#f0fdf4" stroke="#10b981" strokeWidth="1.5" />
      <path d="M9 6v2M9 16v2M9 10v4" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 2" />
      <path d="M13 10h4M13 14h3" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function StatsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="12" width="4" height="8" rx="1" fill="#8b5cf6" opacity="0.3" />
      <rect x="10" y="6" width="4" height="14" rx="1" fill="#8b5cf6" opacity="0.5" />
      <rect x="17" y="2" width="4" height="18" rx="1" fill="#8b5cf6" opacity="0.7" />
      <path d="M3 20h18" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 12L11 7l4 3 5-6" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BlogIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4a2 2 0 012-2h8l6 6v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
      <path d="M14 2v6h6" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 13h8M8 17h5" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="9" r="1.5" fill="#d97706" opacity="0.4" />
    </svg>
  );
}

function VipIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 8l3 10h14l3-10-6 6-4-6-4 6-6-6z" fill="url(#vipGrad)" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M5 20h14" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="14" r="1.5" fill="#fbbf24" />
      <defs>
        <linearGradient id="vipGrad" x1="2" y1="8" x2="22" y2="18" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Navigation item color mapping ─── */
type NavColor = {
  bg: string;
  bgActive: string;
  text: string;
  textActive: string;
  border: string;
  hoverBg: string;
};

const navColors: Record<string, NavColor> = {
  livescore: {
    bg: "bg-red-50/80",
    bgActive: "bg-red-100",
    text: "text-red-700",
    textActive: "text-red-800",
    border: "border-red-200",
    hoverBg: "hover:bg-red-50",
  },
  predictions: {
    bg: "bg-amber-50/80",
    bgActive: "bg-amber-100",
    text: "text-amber-700",
    textActive: "text-amber-800",
    border: "border-amber-200",
    hoverBg: "hover:bg-amber-50",
  },
  dailyReport: {
    bg: "bg-blue-50/80",
    bgActive: "bg-blue-100",
    text: "text-blue-700",
    textActive: "text-blue-800",
    border: "border-blue-200",
    hoverBg: "hover:bg-blue-50",
  },
  tickets: {
    bg: "bg-emerald-50/80",
    bgActive: "bg-emerald-100",
    text: "text-emerald-700",
    textActive: "text-emerald-800",
    border: "border-emerald-200",
    hoverBg: "hover:bg-emerald-50",
  },
  stats: {
    bg: "bg-purple-50/80",
    bgActive: "bg-purple-100",
    text: "text-purple-700",
    textActive: "text-purple-800",
    border: "border-purple-200",
    hoverBg: "hover:bg-purple-50",
  },
  blog: {
    bg: "bg-orange-50/80",
    bgActive: "bg-orange-100",
    text: "text-orange-700",
    textActive: "text-orange-800",
    border: "border-orange-200",
    hoverBg: "hover:bg-orange-50",
  },
};

export default function Header({ locale, translations: t }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: t.livescore, href: `/${locale}/livescore`, icon: LivescoreIcon, colorKey: "livescore" },
    { name: t.predictions, href: `/${locale}/predictions`, icon: PredictionsIcon, colorKey: "predictions" },
    { name: t.dailyReport, href: `/${locale}/rapport-du-jour`, icon: ReportIcon, colorKey: "dailyReport" },
    { name: t.tickets, href: `/${locale}/tickets`, icon: TicketsIcon, colorKey: "tickets" },
    { name: t.stats, href: `/${locale}/stats`, icon: StatsIcon, colorKey: "stats" },
    { name: t.blog, href: `/${locale}/blog`, icon: BlogIcon, colorKey: "blog" },
  ];

  const otherLocale = locale === "fr" ? "en" : "fr";
  const localeSwitchPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            <Logo size={34} variant="dark" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const colors = navColors[item.colorKey];
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                    isActive
                      ? `${colors.bgActive} ${colors.textActive} ${colors.border} shadow-sm`
                      : `border-transparent ${colors.hoverBg} text-gray-600 hover:text-gray-900 hover:border-gray-200 hover:shadow-sm`
                  }`}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  {item.name}
                </Link>
              );
            })}

            {/* VIP — always stands out */}
            <Link
              href={`/${locale}/vip`}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 border ${
                pathname.startsWith(`/${locale}/vip`)
                  ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white border-amber-500 shadow-md shadow-amber-200"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-600 hover:from-amber-400 hover:to-orange-400 shadow-sm hover:shadow-md hover:shadow-amber-200"
              }`}
            >
              <VipIcon className="w-[18px] h-[18px]" />
              {t.vip}
            </Link>

            {/* Language Switcher */}
            <Link
              href={localeSwitchPath}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors border border-transparent hover:border-gray-200"
            >
              <Globe className="w-4 h-4" />
              {otherLocale.toUpperCase()}
            </Link>

            {/* Auth */}
            <AuthButton locale={locale} />
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-100 animate-in">
            <nav className="flex flex-col gap-1 pt-3">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const colors = navColors[item.colorKey];
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      isActive
                        ? `${colors.bgActive} ${colors.textActive} ${colors.border}`
                        : `border-transparent text-gray-600 hover:bg-gray-50 active:bg-gray-100`
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive ? colors.bgActive : colors.bg}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    {item.name}
                  </Link>
                );
              })}

              {/* VIP mobile */}
              <Link
                href={`/${locale}/vip`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white border border-amber-600 shadow-sm"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/20">
                  <VipIcon className="w-5 h-5" />
                </div>
                {t.vip}
              </Link>

              <Link
                href={localeSwitchPath}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100">
                  <Globe className="w-5 h-5 text-gray-500" />
                </div>
                {locale === "fr" ? "Switch to English" : "Passer au Francais"}
              </Link>
              <div className="px-1 pt-2 border-t border-gray-100 mt-1">
                <AuthButton locale={locale} />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
