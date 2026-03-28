import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Ticket, Info, ArrowRight } from "lucide-react";
import TicketCard from "@/components/tickets/TicketCard";
import AffiliateCTA from "@/components/ui/AffiliateCTA";
import { getTodaysTickets } from "@/lib/data";

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const isFr = params.locale === "fr";
  return {
    title: isFr ? "Codes Ticket 1xBet Gratuit" : "Free 1xBet Ticket Codes",
    description: isFr
      ? "Codes de réservation 1xBet prêts à l'emploi. Copiez le code, collez-le dans 1xBet et votre coupon se charge automatiquement."
      : "Ready-to-use 1xBet booking codes. Copy the code, paste it in 1xBet and your bet slip loads automatically.",
    alternates: {
      canonical: `/${params.locale}/tickets`,
      languages: {
        fr: "/fr/tickets",
        en: "/en/tickets",
        "x-default": "/fr/tickets",
      },
    },
  };
}

export default async function TicketsPage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("tickets");
  const tc = await getTranslations("common");
  const locale = params.locale;
  const isFr = locale === "fr";

  const tickets = await getTodaysTickets();
  const freeTicket = tickets.find((t) => t.is_free) ?? null;
  const vipTickets = tickets.filter((t) => !t.is_free);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 rounded-full px-4 py-1.5 mb-4">
          <Ticket className="w-4 h-4" />
          <span className="text-sm font-semibold">
            {new Date().toLocaleDateString(isFr ? "fr-FR" : "en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {t("title")}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>

      {/* How to Use */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-10 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-600" />
          <h2 className="font-bold text-blue-900">{t("howToUse")}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[t("step1"), t("step2"), t("step3"), t("step4")].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-blue-800">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Free Ticket */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
          {t("freeTicket")}
        </h2>
        <div className="max-w-md">
          {freeTicket ? (
            <TicketCard
              name={isFr ? (freeTicket.name_fr ?? freeTicket.name) : freeTicket.name}
              bookingCode={freeTicket.booking_code}
              totalOdds={freeTicket.total_odds}
              riskLevel={freeTicket.risk_level}
              matchCount={freeTicket.match_count ?? 0}
              isFree={true}
              isLocked={false}
              locale={locale}
              translations={{
                copyCode: tc("copyCode"),
                copied: tc("copied"),
                bookingCode: t("bookingCode"),
                totalOdds: t("totalOdds"),
                matches: t("matches"),
                vipOnly: tc("vipOnly"),
                free: tc("free"),
                openSlip: tc("openSlip"),
                getVip: tc("getVip"),
              }}
            />
          ) : (
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
              <p className="text-gray-400">
                {isFr
                  ? "Code gratuit disponible bientot..."
                  : "Free code available soon..."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* VIP Tickets */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full" />
            {t("vipTickets")}
          </h2>
          <a
            href={`/${locale}/vip`}
            className="text-amber-600 text-sm font-medium flex items-center gap-1 hover:text-amber-700"
          >
            {t("unlockAll")} <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {vipTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {vipTickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                name={isFr ? (ticket.name_fr ?? ticket.name) : ticket.name}
                bookingCode={ticket.booking_code}
                totalOdds={ticket.total_odds}
                riskLevel={ticket.risk_level}
                matchCount={ticket.match_count ?? 0}
                isFree={false}
                isLocked={true}
                locale={locale}
                translations={{
                  copyCode: tc("copyCode"),
                  copied: tc("copied"),
                  bookingCode: t("bookingCode"),
                  totalOdds: t("totalOdds"),
                  matches: t("matches"),
                  vipOnly: tc("vipOnly"),
                  free: tc("free"),
                  openSlip: tc("openSlip"),
                  getVip: tc("getVip"),
                }}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["medium", "medium", "high", "extreme"].map((risk, i) => (
              <TicketCard
                key={i}
                name={
                  isFr
                    ? ["Ticket Value", "Ticket Combine", "Ticket Risque", "Ticket Jackpot"][i]
                    : ["Value Ticket", "Combo Ticket", "High Risk", "Jackpot"][i]
                }
                bookingCode="????????"
                totalOdds={0}
                riskLevel={risk}
                matchCount={0}
                isFree={false}
                isLocked={true}
                locale={locale}
                translations={{
                  copyCode: tc("copyCode"),
                  copied: tc("copied"),
                  bookingCode: t("bookingCode"),
                  totalOdds: t("totalOdds"),
                  matches: t("matches"),
                  vipOnly: tc("vipOnly"),
                  free: tc("free"),
                  openSlip: tc("openSlip"),
                  getVip: tc("getVip"),
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="text-center bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-100 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {isFr ? "Pret a placer votre pari ?" : "Ready to place your bet?"}
        </h3>
        <p className="text-gray-500 mb-4">
          {isFr
            ? "Copiez le code ci-dessus et ouvrez 1xBet pour charger votre coupon instantanement."
            : "Copy the code above and open 1xBet to load your slip instantly."}
        </p>
        <AffiliateCTA
          text={tc("betNow")}
          variant="primary"
          campaign="tickets_page"
        />
      </div>

      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: isFr
              ? "Codes Ticket 1xBet - PronoFoot AI"
              : "1xBet Ticket Codes - PronoFoot AI",
            description: isFr
              ? "Codes de reservation 1xBet gratuits et premium"
              : "Free and premium 1xBet booking codes",
            url: `https://parifoot.online/${locale}/tickets`,
          }),
        }}
      />
    </div>
  );
}
