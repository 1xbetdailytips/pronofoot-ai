// ============================================
// PRONOFOOT AI - Site Configuration
// ============================================

export const siteConfig = {
  name: "PronoFoot AI",
  domain: "parifoot.online",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://parifoot.online",
  description: {
    en: "AI-powered football predictions, daily betting tips, and ready-to-use 1xBet ticket codes. Smart analysis for smarter bets.",
    fr: "Pronostics football par IA, tips quotidiens et codes tickets 1xBet prets a l'emploi. Des analyses intelligentes pour des paris plus intelligents.",
  },
  affiliateLink: process.env.NEXT_PUBLIC_AFFILIATE_LINK || "https://1xbet.com",
  locales: ["fr", "en"] as const,
  defaultLocale: "fr" as const, // French first for Cameroon
  // SEO
  ogImage: "/images/og-default.png",
  twitterHandle: "@pronofootai",
  // Social
  telegram: "https://t.me/pronofootai",
  // VIP
  vipPrice: {
    weekly: 3, // USD
    weeklyFcfa: 1800, // CFA Francs
  },
};

// Leagues we cover (popular in Cameroon + top European leagues)
export const COVERED_LEAGUES = [
  { id: "MTN_ELITE_ONE", name: "MTN Elite One", country: "Cameroon", flag: "🇨🇲" },
  { id: "MTN_ELITE_TWO", name: "MTN Elite Two", country: "Cameroon", flag: "🇨🇲" },
  { id: "PREMIER_LEAGUE", name: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "LA_LIGA", name: "La Liga", country: "Spain", flag: "🇪🇸" },
  { id: "LIGUE_1", name: "Ligue 1", country: "France", flag: "🇫🇷" },
  { id: "SERIE_A", name: "Serie A", country: "Italy", flag: "🇮🇹" },
  { id: "BUNDESLIGA", name: "Bundesliga", country: "Germany", flag: "🇩🇪" },
  { id: "CHAMPIONS_LEAGUE", name: "Champions League", country: "Europe", flag: "🇪🇺" },
  { id: "EUROPA_LEAGUE", name: "Europa League", country: "Europe", flag: "🇪🇺" },
  { id: "AFCON", name: "Africa Cup of Nations", country: "Africa", flag: "🌍" },
  { id: "CAF_CL", name: "CAF Champions League", country: "Africa", flag: "🌍" },
];
