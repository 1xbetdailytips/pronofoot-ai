"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  Activity,
  TrendingUp,
  FileText,
  Ticket,
  Crown,
  BarChart3,
  BookOpen,
  Globe,
} from "lucide-react";
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

export default function Header({ locale, translations: t }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: t.livescore, href: `/${locale}/livescore`, icon: Activity },
    { name: t.predictions, href: `/${locale}/predictions`, icon: TrendingUp },
    { name: t.dailyReport, href: `/${locale}/rapport-du-jour`, icon: FileText },
    { name: t.tickets, href: `/${locale}/tickets`, icon: Ticket },
    { name: t.stats, href: `/${locale}/stats`, icon: BarChart3 },
    { name: t.blog, href: `/${locale}/blog`, icon: BookOpen },
    { name: t.vip, href: `/${locale}/vip`, icon: Crown },
  ];

  const otherLocale = locale === "fr" ? "en" : "fr";
  // Build the path for the other locale
  const localeSwitchPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={`/${locale}`}>
            <Logo size={34} variant="dark" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } ${item.name === t.vip ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 hover:text-white" : ""}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}

            {/* Language Switcher */}
            <Link
              href={localeSwitchPath}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <Globe className="w-4 h-4" />
              {otherLocale.toUpperCase()}
            </Link>

            {/* Auth */}
            <AuthButton locale={locale} />
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50"
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
          <div className="md:hidden pb-4 border-t border-gray-100">
            <nav className="flex flex-col gap-1 pt-3">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-gray-600 hover:bg-gray-50"
                    } ${item.name === t.vip ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white" : ""}`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
              <Link
                href={localeSwitchPath}
                className="flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <Globe className="w-5 h-5" />
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
