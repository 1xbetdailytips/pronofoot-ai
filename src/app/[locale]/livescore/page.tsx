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

  // Step 1: Fetch ALL fixtures for today (increase limit to catch everything)
  const { data: fixtures, error: fError } = await supabase
    .from("fixtures")
    .select("*")
    .gte("match_date", `${today}T00:00:00`)
    .lte("match_date", `${today}T23:59:59`)
    .order("match_date", { ascending: true })
    .limit(2000);

  if (fError || !fixtures) {
    console.error("Livescore fetch error:", fError);
    return [];
  }

  // Step 2: Get fixture IDs, then fetch tips + results ONLY for these fixtures
  const fixtureIds = fixtures.map((f: Fixture) => f.id);
  if (fixtureIds.length === 0) return [];

  const [tipsRes, resultsRes] = await Promise.all([
    supabase
      .from("tips")
      .select("fixture_id, prediction, confidence, best_pick")
      .in("fixture_id", fixtureIds),
    supabase
      .from("results_log")
      .select("fixture_id, is_correct")
      .in("fixture_id", fixtureIds),
  ]);

  // Build lookup maps
  type TipSlim = { fixture_id: number; prediction: string; confidence: number; best_pick: string | null };
  const tipMap = new Map<number, TipSlim>();
  (tipsRes.data || []).forEach((t: TipSlim) => tipMap.set(t.fixture_id, t));

  const resultMap = new Map<number, boolean>();
  (resultsRes.data || []).forEach((r: { fixture_id: number; is_correct: boolean }) => resultMap.set(r.fixture_id, r.is_correct));

  // Filter to only predicted matches + enrich with tip/result data
  return ((fixtures as Fixture[]) || [])
    .filter(f => tipMap.has(f.id))
    .map(f => {
      const tip = tipMap.get(f.id);
      return {
        ...f,
        tip_prediction: tip?.prediction ?? null,
        tip_confidence: tip?.confidence ?? null,
        tip_best_pick: tip?.best_pick ?? null,
        result_correct: resultMap.get(f.id) ?? null,
      };
    });
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
        {/* Premium header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Livescore</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{dateStr}</p>
            </div>
          </div>
          {/* Stats pills */}
          <div className="flex items-center gap-3 mt-3">
            {live.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                </span>
                <span className="text-sm font-bold text-red-600 dark:text-red-400 tabular-nums">
                  {live.length} {isFr ? "en direct" : "live"}
                </span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30">
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {upcoming.length} {isFr ? "a venir" : "upcoming"}
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/30">
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 tabular-nums">
                {finished.length} {isFr ? "termines" : "finished"}
              </span>
            </span>
          </div>
        </div>

        {/* 1xBet Live Betting Banner */}
        <div className="mb-5">
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
