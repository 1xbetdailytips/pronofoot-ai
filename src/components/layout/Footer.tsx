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
  const isFr = locale === "fr";

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="mb-4">
              <Logo size={34} variant="light" />
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed mb-5">
              {isFr
                ? "Pronostics football intelligents alimentes par l'IA. Analyses quotidiennes, combines et bien plus."
                : "Smart football predictions powered by AI. Daily analysis, combos, and more."}
            </p>
            <a
              href={siteConfig.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
            >
              <Send className="w-4 h-4" />
              {t.joinTelegram}
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {isFr ? "Navigation" : "Navigation"}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href={`/${locale}/predictions`} className="text-gray-400 hover:text-white transition-colors">
                  {t.predictions}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/livescore`} className="text-gray-400 hover:text-white transition-colors">
                  Livescore
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/rapport-du-jour`} className="text-gray-400 hover:text-white transition-colors">
                  {t.dailyReport}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/tickets`} className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5">
                  {t.tickets}
                  <span className="bg-amber-500/20 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {isFr ? "Bientot" : "Soon"}
                  </span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/stats`} className="text-gray-400 hover:text-white transition-colors">
                  {t.stats}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/vip`} className="text-gray-400 hover:text-white transition-colors">
                  {t.vip}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/blog`} className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              {isFr ? "Legal" : "Legal"}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href={`/${locale}/about`} className="text-gray-400 hover:text-white transition-colors">
                  {isFr ? "Comment ca marche" : "How it works"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/responsible-gambling`} className="text-gray-400 hover:text-white transition-colors">
                  {t.responsibleGambling}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-gray-400 hover:text-white transition-colors">
                  {t.termsOfService}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-gray-400 hover:text-white transition-colors">
                  {t.privacyPolicy}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Responsible Gambling Disclaimer */}
        <div className="mt-10 pt-8 border-t border-gray-800">
          <div className="flex items-start gap-3 bg-gray-800/60 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-gray-400">
              <p className="font-semibold text-amber-400 mb-1">
                {t.responsibleGambling} | 18+
              </p>
              <p className="leading-relaxed">{t.footerDisclaimer}</p>
              <p className="mt-1.5 leading-relaxed">
                {isFr
                  ? "Si vous avez un probleme de jeu, contactez une ligne d'aide locale. Les resultats passes ne garantissent pas les resultats futurs."
                  : "If you have a gambling problem, please contact a local helpline. Past results do not guarantee future outcomes."}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} {t.siteName}.{" "}
            {isFr ? "Tous droits reserves." : "All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  );
}
