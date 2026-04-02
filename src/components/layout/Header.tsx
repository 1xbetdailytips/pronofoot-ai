"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
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

function LabIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3h6v5l4 8a2 2 0 01-1.8 2.9H6.8A2 2 0 015 16L9 8V3z" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 3h6" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="15" r="1" fill="#7c3aed" />
      <circle cx="14" cy="13" r="1.5" fill="#7c3aed" opacity="0.5" />
    </svg>
  );
}

function ComboIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#dcfce7" stroke="#22c55e" strokeWidth="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#fce7f3" stroke="#ec4899" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.5" fill="#6366f1" />
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

/* ─── Navigation color mapping ─── */
type NavColor = {
  bg: string;
  bgActive: string;
  text: string;
  textActive: string;
  border: string;
  borderActive: string;
  hoverBg: string;
};

const navColors: Record<string, NavColor> = {
  livescore: {
    bg: "bg-white",
    bgActive: "bg-red-50",
    text: "text-gray-700",
    textActive: "text-red-700",
    border: "border-gray-200",
    borderActive: "border-red-400",
    hoverBg: "hover:bg-red-50/60 hover:border-red-200",
  },
  predictions: {
    bg: "bg-white",
    bgActive: "bg-amber-50",
    text: "text-gray-700",
    textActive: "text-amber-700",
    border: "border-gray-200",
    borderActive: "border-amber-400",
    hoverBg: "hover:bg-amber-50/60 hover:border-amber-200",
  },
  tickets: {
    bg: "bg-white",
    bgActive: "bg-emerald-50",
    text: "text-gray-700",
    textActive: "text-emerald-700",
    border: "border-gray-200",
    borderActive: "border-emerald-400",
    hoverBg: "hover:bg-emerald-50/60 hover:border-emerald-200",
  },
  tools: {
    bg: "bg-white",
    bgActive: "bg-indigo-50",
    text: "text-gray-700",
    textActive: "text-indigo-700",
    border: "border-gray-200",
    borderActive: "border-indigo-400",
    hoverBg: "hover:bg-indigo-50/60 hover:border-indigo-200",
  },
  more: {
    bg: "bg-white",
    bgActive: "bg-purple-50",
    text: "text-gray-700",
    textActive: "text-purple-700",
    border: "border-gray-200",
    borderActive: "border-purple-400",
    hoverBg: "hover:bg-purple-50/60 hover:border-purple-200",
  },
};

/* ─── Dropdown Hook ─── */
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return { open, setOpen, ref };
}

export default function Header({ locale, translations: t }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toolsDropdown = useDropdown();
  const moreDropdown = useDropdown();

  // Primary nav items (always visible as buttons)
  const primaryNav = [
    { name: t.livescore, href: `/${locale}/livescore`, icon: LivescoreIcon, colorKey: "livescore" },
    { name: t.predictions, href: `/${locale}/predictions`, icon: PredictionsIcon, colorKey: "predictions" },
    { name: t.tickets, href: `/${locale}/tickets`, icon: TicketsIcon, colorKey: "tickets" },
  ];

  // Tools dropdown items
  const isFr = locale === "fr";
  const toolsItems = [
    { name: isFr ? "Labo IA" : "AI Lab", href: `/${locale}/ai-lab`, icon: LabIcon },
    { name: isFr ? "Generateur Combis" : "Combo Builder", href: `/${locale}/bet-builder`, icon: ComboIcon },
    { name: t.dailyReport, href: `/${locale}/rapport-du-jour`, icon: ReportIcon },
  ];

  // More dropdown items
  const moreItems = [
    { name: t.stats, href: `/${locale}/stats`, icon: StatsIcon },
    { name: t.blog, href: `/${locale}/blog`, icon: BlogIcon },
  ];

  const isToolsActive = toolsItems.some(item => pathname.startsWith(item.href));
  const isMoreActive = moreItems.some(item => pathname.startsWith(item.href));

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
            {/* Primary buttons */}
            {primaryNav.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const colors = navColors[item.colorKey];
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border-2 ${
                    isActive
                      ? `${colors.bgActive} ${colors.textActive} ${colors.borderActive} shadow-sm`
                      : `${colors.bg} ${colors.text} ${colors.border} ${colors.hoverBg}`
                  }`}
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  {item.name}
                </Link>
              );
            })}

            {/* Tools dropdown */}
            <div ref={toolsDropdown.ref} className="relative">
              <button
                onClick={() => { toolsDropdown.setOpen(!toolsDropdown.open); moreDropdown.setOpen(false); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border-2 ${
                  isToolsActive
                    ? `${navColors.tools.bgActive} ${navColors.tools.textActive} ${navColors.tools.borderActive} shadow-sm`
                    : `${navColors.tools.bg} ${navColors.tools.text} ${navColors.tools.border} ${navColors.tools.hoverBg}`
                }`}
              >
                <LabIcon className="w-[18px] h-[18px]" />
                {isFr ? "Outils IA" : "AI Tools"}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsDropdown.open ? "rotate-180" : ""}`} />
              </button>

              {toolsDropdown.open && (
                <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-xl border-2 border-indigo-100 shadow-lg shadow-indigo-100/50 overflow-hidden z-50">
                  {toolsItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => toolsDropdown.setOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-3 text-sm transition-colors ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700 font-semibold"
                            : "text-gray-700 hover:bg-indigo-50/50 hover:text-indigo-700"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* More dropdown */}
            <div ref={moreDropdown.ref} className="relative">
              <button
                onClick={() => { moreDropdown.setOpen(!moreDropdown.open); toolsDropdown.setOpen(false); }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border-2 ${
                  isMoreActive
                    ? `${navColors.more.bgActive} ${navColors.more.textActive} ${navColors.more.borderActive} shadow-sm`
                    : `${navColors.more.bg} ${navColors.more.text} ${navColors.more.border} ${navColors.more.hoverBg}`
                }`}
              >
                <StatsIcon className="w-[18px] h-[18px]" />
                {isFr ? "Plus" : "More"}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdown.open ? "rotate-180" : ""}`} />
              </button>

              {moreDropdown.open && (
                <div className="absolute top-full left-0 mt-1.5 w-48 bg-white rounded-xl border-2 border-purple-100 shadow-lg shadow-purple-100/50 overflow-hidden z-50">
                  {moreItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => moreDropdown.setOpen(false)}
                        className={`flex items-center gap-2.5 px-4 py-3 text-sm transition-colors ${
                          isActive
                            ? "bg-purple-50 text-purple-700 font-semibold"
                            : "text-gray-700 hover:bg-purple-50/50 hover:text-purple-700"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* VIP — always stands out */}
            <Link
              href={`/${locale}/vip`}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border-2 ${
                pathname.startsWith(`/${locale}/vip`)
                  ? "bg-gradient-to-r from-amber-400 to-orange-400 text-white border-amber-500 shadow-md shadow-amber-200/50"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-600 hover:from-amber-400 hover:to-orange-400 shadow-sm hover:shadow-md hover:shadow-amber-200/50"
              }`}
            >
              <VipIcon className="w-[18px] h-[18px]" />
              {t.vip}
            </Link>

            {/* Language Switcher */}
            <Link
              href={localeSwitchPath}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors border-2 border-transparent hover:border-gray-200"
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
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-100 animate-in">
            <nav className="flex flex-col gap-1 pt-3">
              {/* Section: Main */}
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 pt-2 pb-1">
                {isFr ? "Principal" : "Main"}
              </p>
              {primaryNav.map((item) => {
                const isActive = pathname.startsWith(item.href);
                const colors = navColors[item.colorKey];
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 mx-2 ${
                      isActive
                        ? `${colors.bgActive} ${colors.textActive} ${colors.borderActive}`
                        : `border-transparent text-gray-600 hover:bg-gray-50 active:bg-gray-100`
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive ? colors.bgActive : "bg-gray-100"}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    {item.name}
                  </Link>
                );
              })}

              {/* Section: AI Tools */}
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-1">
                {isFr ? "Outils IA" : "AI Tools"}
              </p>
              {toolsItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 mx-2 ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 border-indigo-300"
                        : "border-transparent text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive ? "bg-indigo-100" : "bg-gray-100"}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    {item.name}
                  </Link>
                );
              })}

              {/* Section: More */}
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 pt-4 pb-1">
                {isFr ? "Plus" : "More"}
              </p>
              {moreItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 mx-2 ${
                      isActive
                        ? "bg-purple-50 text-purple-700 border-purple-300"
                        : "border-transparent text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive ? "bg-purple-100" : "bg-gray-100"}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    {item.name}
                  </Link>
                );
              })}

              {/* VIP mobile */}
              <div className="mx-2 mt-2">
                <Link
                  href={`/${locale}/vip`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white border-2 border-amber-600 shadow-sm"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/20">
                    <VipIcon className="w-5 h-5" />
                  </div>
                  {t.vip}
                </Link>
              </div>

              <Link
                href={localeSwitchPath}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 mx-2 mt-1"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-100">
                  <Globe className="w-5 h-5 text-gray-500" />
                </div>
                {locale === "fr" ? "Switch to English" : "Passer au Francais"}
              </Link>
              <div className="px-3 pt-2 border-t border-gray-100 mt-1">
                <AuthButton locale={locale} />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
