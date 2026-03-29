"use client";

import Link from "next/link";
import { Send, AlertTriangle } from "lucide-react";
import { siteConfig } from "@/lib/config";
import Logo from "@/components/ui/Logo";

type FooterProps = {
  locale: string;
  translations: {
    siteName: string;
    predictions: string;
    dailyReport: string;
    tickets: string;
    stats: string;
    vip: string;
    footerDisclaimer: string;
    responsibleGambling: string;
    termsOfService: string;
    privacyPolicy: string;
    joinTelegram: string;
    betNow: string;
  };
};

export default function Footer({ locale, translations: t }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Affiliate CTA Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white font-medium text-center sm:text-left">
              {locale === "fr"
                ? "Prets a parier ? Ouvrez votre compte 1xBet et commencez a gagner !"
                : "Ready to bet? Open your 1xBet account and start winning!"}
            </p>
            <a
              href={siteConfig.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-emerald-700 font-bold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              {t.betNow} →
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo size={34} variant="light" />
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              {locale === "fr"
                ? "Pronostics football intelligents alimentes par l'IA. Analyses quotidiennes, codes tickets 1xBet, et bien plus."
                : "Smart football predictions powered by AI. Daily analysis, 1xBet ticket codes, and more."}
            </p>
            {/* Telegram */}
            <a
              href={siteConfig.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              {t.joinTelegram}
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              {locale === "fr" ? "Navigation" : "Navigation"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/predictions`}
                  className="hover:text-white transition-colors"
                >
                  {t.predictions}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/rapport-du-jour`}
                  className="hover:text-white transition-colors"
                >
                  {t.dailyReport}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/tickets`}
                  className="hover:text-white transition-colors"
                >
                  {t.tickets}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/stats`}
                  className="hover:text-white transition-colors"
                >
                  {t.stats}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/vip`}
                  className="hover:text-white transition-colors"
                >
                  {t.vip}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-3">
              {locale === "fr" ? "Legal" : "Legal"}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={`/${locale}/responsible-gambling`}
                  className="hover:text-white transition-colors"
                >
                  {t.responsibleGambling}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="hover:text-white transition-colors"
                >
                  {t.termsOfService}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="hover:text-white transition-colors"
                >
                  {t.privacyPolicy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Responsible Gambling Disclaimer */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex items-start gap-3 bg-gray-800/50 rounded-lg p-4">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-400">
              <p className="font-semibold text-amber-400 mb-1">
                {t.responsibleGambling} | 18+
              </p>
              <p>{t.footerDisclaimer}</p>
              <p className="mt-1">
                {locale === "fr"
                  ? "Si vous avez un probleme de jeu, contactez une ligne d'aide locale. Les resultats passes ne garantissent pas les resultats futurs."
                  : "If you have a gambling problem, please contact a local helpline. Past results do not guarantee future outcomes."}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} {t.siteName}.{" "}
            {locale === "fr"
              ? "Tous droits reserves."
              : "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
