// ============================================
// PRONOFOOT AI - Site Configuration
// ============================================

export const siteConfig = {
  name: "PronoFoot AI",
  domain: "parifoot.online",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.parifoot.online").trim().replace(/\/+$/, ""),
  description: {
    en: "AI-powered football predictions, daily betting tips, and ready-to-use 1xBet ticket codes. Smart analysis for smarter bets.",
    fr: "Pronostics football par IA, tips quotidiens et analyses intelligentes. Plus de 500 stats analysées par match pour des paris plus intelligents.",
  },
  affiliateLink: process.env.NEXT_PUBLIC_AFFILIATE_LINK || "https://reffpa.com/L?tag=d_2524729m_1599c_&site=2524729&ad=1599",
  locales: ["fr", "en"] as const,
  defaultLocale: "fr" as const, // French first for Cameroon
  // SEO
  ogImage: "/images/og-default.png",
  twitterHandle: "@pronofootai",
  // Social
  telegram: "https://t.me/pronofootai",          // free tips channel
  telegramVip: "https://t.me/pronofootaivip",     // VIP tips channel
  // VIP Tiers
  vipPrice: {
    classique: {
      weeklyFcfa: 2500,
      monthlyFcfa: 8000,
      weeklyUsd: 4,
      monthlyUsd: 13,
    },
    elite: {
      weeklyFcfa: 5000,
      monthlyFcfa: 15000,
      weeklyUsd: 8,
      monthlyUsd: 25,
    },
    jackpot: {
      oneTimeFcfa: 500,
      oneTimeUsd: 1,
    },
  },
};

// Leagues we cover — comprehensive worldwide coverage
export const COVERED_LEAGUES = [
  // Cameroon
  { id: "MTN_ELITE_ONE", name: "MTN Elite One", country: "Cameroon", flag: "🇨🇲" },
  { id: "MTN_ELITE_TWO", name: "MTN Elite Two", country: "Cameroon", flag: "🇨🇲" },
  // Top 5 European + lower divisions + cups
  { id: "PREMIER_LEAGUE", name: "Premier League", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "CHAMPIONSHIP", name: "Championship", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "LA_LIGA", name: "La Liga", country: "Spain", flag: "🇪🇸" },
  { id: "SERIE_A", name: "Serie A", country: "Italy", flag: "🇮🇹" },
  { id: "BUNDESLIGA", name: "Bundesliga", country: "Germany", flag: "🇩🇪" },
  { id: "LIGUE_1", name: "Ligue 1", country: "France", flag: "🇫🇷" },
  // UEFA competitions
  { id: "CHAMPIONS_LEAGUE", name: "Champions League", country: "Europe", flag: "🏆" },
  { id: "EUROPA_LEAGUE", name: "Europa League", country: "Europe", flag: "🏆" },
  { id: "CONFERENCE_LEAGUE", name: "Conference League", country: "Europe", flag: "🏆" },
  { id: "NATIONS_LEAGUE", name: "UEFA Nations League", country: "Europe", flag: "🏆" },
  // African leagues
  { id: "AFCON", name: "Africa Cup of Nations", country: "Africa", flag: "🌍" },
  { id: "CAF_CL", name: "CAF Champions League", country: "Africa", flag: "🌍" },
  { id: "EGYPT", name: "Egyptian Premier League", country: "Egypt", flag: "🇪🇬" },
  { id: "MOROCCO", name: "Botola Pro", country: "Morocco", flag: "🇲🇦" },
  { id: "NIGERIA", name: "NPFL", country: "Nigeria", flag: "🇳🇬" },
  { id: "GHANA", name: "Ghana Premier League", country: "Ghana", flag: "🇬🇭" },
  { id: "TUNISIA", name: "Ligue 1", country: "Tunisia", flag: "🇹🇳" },
  { id: "ALGERIA", name: "Ligue 1", country: "Algeria", flag: "🇩🇿" },
  { id: "IVORY_COAST", name: "Ligue 1", country: "Ivory Coast", flag: "🇨🇮" },
  { id: "KENYA", name: "FKF Premier League", country: "Kenya", flag: "🇰🇪" },
  // FIFA
  { id: "WORLD_CUP", name: "World Cup", country: "FIFA", flag: "🌎" },
  { id: "WC_QUALIFIERS", name: "World Cup Qualifiers", country: "FIFA", flag: "🌎" },
  // Americas & Asia
  { id: "MLS", name: "MLS", country: "USA", flag: "🇺🇸" },
  { id: "SAUDI", name: "Saudi Pro League", country: "Saudi Arabia", flag: "🇸🇦" },
  { id: "LIBERTADORES", name: "Copa Libertadores", country: "CONMEBOL", flag: "🌎" },
];
