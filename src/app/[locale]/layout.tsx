import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { siteConfig } from "@/lib/config";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

// Only allow our supported locales
export function generateStaticParams() {
  return siteConfig.locales.map((locale) => ({ locale }));
}

// Dynamic metadata based on locale
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as "fr" | "en";
  const desc = siteConfig.description[locale] || siteConfig.description.fr;

  return {
    title: {
      default: `${siteConfig.name} | ${locale === "fr" ? "Pronostics Football IA" : "AI Football Predictions"}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: desc,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        en: "/en",
      },
    },
    openGraph: {
      title: siteConfig.name,
      description: desc,
      url: siteConfig.url,
      siteName: siteConfig.name,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: desc,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;

  // Validate locale
  if (!siteConfig.locales.includes(locale as "fr" | "en")) {
    notFound();
  }

  // Load translations
  const messages = await getMessages();

  // Extract header/footer translations
  const common = (messages as Record<string, Record<string, string>>).common;

  return (
    <html lang={locale}>
      <head>
        {/* JSON-LD Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              description: siteConfig.description[locale as "fr" | "en"],
              sameAs: [siteConfig.telegram],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} bg-gray-50 min-h-screen flex flex-col`}>
        <NextIntlClientProvider messages={messages}>
          <Header
            locale={locale}
            translations={{
              home: common.home,
              predictions: common.predictions,
              dailyReport: common.dailyReport,
              tickets: common.tickets,
              vip: common.vip,
              language: common.language,
              siteName: common.siteName,
            }}
          />
          <main className="flex-1">{children}</main>
          <Footer
            locale={locale}
            translations={{
              siteName: common.siteName,
              predictions: common.predictions,
              dailyReport: common.dailyReport,
              tickets: common.tickets,
              vip: common.vip,
              footerDisclaimer: common.footerDisclaimer,
              responsibleGambling: common.responsibleGambling,
              termsOfService: common.termsOfService,
              privacyPolicy: common.privacyPolicy,
              joinTelegram: common.joinTelegram,
              betNow: common.betNow,
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
