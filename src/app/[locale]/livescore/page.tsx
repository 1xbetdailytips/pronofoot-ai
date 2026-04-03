import type { Metadata } from "next";
import { Activity } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { siteConfig } from "@/lib/config";
import LivescoreClient from "@/components/livescore/LivescoreClient";
import PromoBanner from "@/components/ui/PromoBanner";
import type { Fixture } from "@/lib/types";

export const dynamic = "force-dynamic";

const LIVE_STATUSES = ["1H", "2H", "HT", "ET", "BT", "P"];
const FINISHED_STATUSES = ["FT", "AET", "PEN"];

function categorizeFixtures(fixtures: Fixture[]) {
  const live: Fixture[] = [];
  const upcoming: Fixture[] = [];
  const finished: Fixture[] = [];

  for (const f of fixtures) {
    if (LIVE_STATUSES.includes(f.status)) {
      live.push(f);
    } else if (FINISHED_STATUSES.includes(f.status)) {
      finished.push(f);
    } else {
      upcoming.push(f);
    }
  }

  return { live, upcoming, finished };
}



async function getTodayFixtures(): Promise<Fixture[]> {
  const today = new Date().toISOString().slice(0, 10);

  // Only show fixtures that have AI predictions (tips)
  const { data: tips } = await supabase
    .from("tips")
    .select("fixture_id");

  const predictedIds = new Set((tips || []).map((t: { fixture_id: number }) => t.fixture_id));

  const { data, error } = await supabase
    .from("fixtures")
    .select("*")
    .gte("match_date", `${today}T00:00:00`)
    .lte("match_date", `${today}T23:59:59`)
    .order("match_date", { ascending: true });

  if (error) {
    console.error("Livescore fetch error:", error);
    return [];
  }

  // Filter to only predicted matches
  return ((data as Fixture[]) || []).filter(f => predictedIds.has(f.id));
}

export function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Metadata {
  const isFr = params.locale === "fr";
  const title = isFr
    ? "Livescore - Scores en Direct Aujourd'hui"
    : "Livescore - Live Scores Today";
  const description = isFr
    ? "Suivez tous les scores en direct, les matchs en cours et les resultats du jour. Mise a jour automatique toutes les 60 secondes."
    : "Follow all live scores, ongoing matches and today's results. Auto-updated every 60 seconds.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${params.locale}/livescore`,
      languages: {
        fr: "/fr/livescore",
        en: "/en/livescore",
        "x-default": "/fr/livescore",
      },
    },
  };
}

export default async function LivescorePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;
  const isFr = locale === "fr";
  const fixtures = await getTodayFixtures();
  const { live, upcoming, finished } = categorizeFixtures(fixtures);

  const dateStr = new Date().toLocaleDateString(isFr ? "fr-FR" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: isFr ? "Scores en Direct - PronoFoot AI" : "Live Scores - PronoFoot AI",
    url: `${siteConfig.url}/${locale}/livescore`,
    description: isFr
      ? "Scores en direct et resultats football"
      : "Live football scores and results",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-900">Livescore</h1>
          </div>
          <p className="text-sm text-gray-500 capitalize">{dateStr}</p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            {live.length > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                <span className="font-medium text-red-600">
                  {live.length} {isFr ? "en direct" : "live"}
                </span>
              </span>
            )}
            <span className="text-gray-500">
              {upcoming.length} {isFr ? "a venir" : "upcoming"}
            </span>
            <span className="text-gray-400">
              {finished.length} {isFr ? "termines" : "finished"}
            </span>
          </div>
        </div>

        {/* 1xBet Live Betting Banner */}
        <div className="mb-4">
          <PromoBanner locale={locale} variant="live-betting" campaign="livescore_live" />
        </div>

        {/* Client wrapper for auto-refresh */}
        <LivescoreClient
          initialFixtures={fixtures}
          locale={locale}
        />

        {/* 1xBet Slim Banner */}
        <div className="mt-6">
          <PromoBanner locale={locale} variant="slim" campaign="livescore_bottom" />
        </div>
      </div>
    </>
  );
}
