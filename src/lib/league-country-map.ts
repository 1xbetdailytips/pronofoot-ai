// Static league_name → country mapping with emoji flags
// Covers top leagues + African leagues. Unknown leagues fallback to "Other"

export type LeagueCountry = {
  country: string;
  flag: string;
  tier: number; // 1=popular, 2=notable, 3=other
};

// ── POPULAR LEAGUES (shown as quick-access buttons) ─────────────────────────
export const POPULAR_LEAGUES: { name: string; shortName: string; flag: string; keywords: string[] }[] = [
  { name: "UEFA Champions League", shortName: "UCL", flag: "🏆", keywords: ["champions league", "ucl"] },
  { name: "Premier League", shortName: "EPL", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", keywords: ["premier league"] },
  { name: "La Liga", shortName: "La Liga", flag: "🇪🇸", keywords: ["la liga", "laliga"] },
  { name: "Serie A", shortName: "Serie A", flag: "🇮🇹", keywords: ["serie a"] },
  { name: "Bundesliga", shortName: "Bundi", flag: "🇩🇪", keywords: ["bundesliga"] },
  { name: "Ligue 1", shortName: "Ligue 1", flag: "🇫🇷", keywords: ["ligue 1"] },
  { name: "MTN Elite One", shortName: "Elite One", flag: "🇨🇲", keywords: ["elite one", "elite 1"] },
  { name: "AFCON", shortName: "AFCON", flag: "🌍", keywords: ["afcon", "africa cup", "coupe d'afrique"] },
  { name: "CAF Champions League", shortName: "CAF CL", flag: "🌍", keywords: ["caf champions"] },
  { name: "FIFA World Cup", shortName: "World Cup", flag: "🌎", keywords: ["world cup", "wc 2026", "coupe du monde"] },
  { name: "MLS", shortName: "MLS", flag: "🇺🇸", keywords: ["mls", "major league soccer"] },
  { name: "Saudi Pro League", shortName: "Saudi", flag: "🇸🇦", keywords: ["saudi pro", "roshn"] },
];

// ── FULL LEAGUE → COUNTRY MAP ───────────────────────────────────────────────
const MAP: Record<string, LeagueCountry> = {
  // 🇨🇲 Cameroon
  "MTN Elite One": { country: "Cameroon", flag: "🇨🇲", tier: 1 },
  "Elite One": { country: "Cameroon", flag: "🇨🇲", tier: 1 },
  "MTN Elite Two": { country: "Cameroon", flag: "🇨🇲", tier: 2 },
  "Elite Two": { country: "Cameroon", flag: "🇨🇲", tier: 2 },
  "Coupe du Cameroun": { country: "Cameroon", flag: "🇨🇲", tier: 2 },
  "Cameroon Cup": { country: "Cameroon", flag: "🇨🇲", tier: 2 },

  // 🏴󠁧󠁢󠁥󠁮󠁧󠁿 England
  "Premier League": { country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 1 },
  "Championship": { country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 2 },
  "League One": { country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 3 },
  "League Two": { country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 3 },
  "FA Cup": { country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 2 },
  "EFL Cup": { country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 2 },
  "National League": { country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 3 },

  // 🇪🇸 Spain
  "La Liga": { country: "Spain", flag: "🇪🇸", tier: 1 },
  "Segunda División": { country: "Spain", flag: "🇪🇸", tier: 2 },
  "Copa del Rey": { country: "Spain", flag: "🇪🇸", tier: 2 },

  // 🇮🇹 Italy
  "Serie A": { country: "Italy", flag: "🇮🇹", tier: 1 },
  "Serie B": { country: "Italy", flag: "🇮🇹", tier: 2 },
  "Coppa Italia": { country: "Italy", flag: "🇮🇹", tier: 2 },

  // 🇩🇪 Germany
  "Bundesliga": { country: "Germany", flag: "🇩🇪", tier: 1 },
  "2. Bundesliga": { country: "Germany", flag: "🇩🇪", tier: 2 },
  "3. Liga": { country: "Germany", flag: "🇩🇪", tier: 3 },
  "DFB Pokal": { country: "Germany", flag: "🇩🇪", tier: 2 },

  // 🇫🇷 France
  "Ligue 1": { country: "France", flag: "🇫🇷", tier: 1 },
  "Ligue 2": { country: "France", flag: "🇫🇷", tier: 2 },
  "Coupe de France": { country: "France", flag: "🇫🇷", tier: 2 },
  "National": { country: "France", flag: "🇫🇷", tier: 3 },

  // 🇵🇹 Portugal
  "Primeira Liga": { country: "Portugal", flag: "🇵🇹", tier: 2 },
  "Liga Portugal": { country: "Portugal", flag: "🇵🇹", tier: 2 },
  "Liga NOS": { country: "Portugal", flag: "🇵🇹", tier: 2 },

  // 🇳🇱 Netherlands
  "Eredivisie": { country: "Netherlands", flag: "🇳🇱", tier: 2 },
  "Eerste Divisie": { country: "Netherlands", flag: "🇳🇱", tier: 3 },
  "KNVB Beker": { country: "Netherlands", flag: "🇳🇱", tier: 3 },

  // 🇧🇪 Belgium
  "Jupiler Pro League": { country: "Belgium", flag: "🇧🇪", tier: 2 },
  "First Division A": { country: "Belgium", flag: "🇧🇪", tier: 2 },

  // 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland
  "Scottish Premiership": { country: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", tier: 2 },
  "Premiership": { country: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", tier: 2 },

  // 🇹🇷 Turkey
  "Süper Lig": { country: "Turkey", flag: "🇹🇷", tier: 2 },
  "Super Lig": { country: "Turkey", flag: "🇹🇷", tier: 2 },

  // 🇬🇷 Greece
  "Super League 1": { country: "Greece", flag: "🇬🇷", tier: 3 },

  // 🇷🇺 Russia
  "Premier League (Russia)": { country: "Russia", flag: "🇷🇺", tier: 3 },
  "Russian Premier League": { country: "Russia", flag: "🇷🇺", tier: 3 },

  // 🇺🇦 Ukraine
  "Ukrainian Premier League": { country: "Ukraine", flag: "🇺🇦", tier: 3 },

  // 🇦🇹 Austria
  "Austrian Bundesliga": { country: "Austria", flag: "🇦🇹", tier: 3 },

  // 🇨🇭 Switzerland
  "Super League": { country: "Switzerland", flag: "🇨🇭", tier: 3 },

  // 🇨🇿 Czech Republic
  "Czech Liga": { country: "Czech Republic", flag: "🇨🇿", tier: 3 },
  "FNL": { country: "Czech Republic", flag: "🇨🇿", tier: 3 },
  "3. liga - MSFL": { country: "Czech Republic", flag: "🇨🇿", tier: 3 },
  "4. liga - Divizie E": { country: "Czech Republic", flag: "🇨🇿", tier: 3 },

  // 🇵🇱 Poland
  "Ekstraklasa": { country: "Poland", flag: "🇵🇱", tier: 3 },

  // 🇩🇰 Denmark
  "Superliga": { country: "Denmark", flag: "🇩🇰", tier: 3 },

  // 🇸🇪 Sweden
  "Allsvenskan": { country: "Sweden", flag: "🇸🇪", tier: 3 },

  // 🇳🇴 Norway
  "Eliteserien": { country: "Norway", flag: "🇳🇴", tier: 3 },

  // 🇫🇮 Finland
  "Veikkausliiga": { country: "Finland", flag: "🇫🇮", tier: 3 },

  // 🏆 UEFA / International
  "UEFA Champions League": { country: "UEFA", flag: "🏆", tier: 1 },
  "Champions League": { country: "UEFA", flag: "🏆", tier: 1 },
  "UEFA Europa League": { country: "UEFA", flag: "🏆", tier: 1 },
  "Europa League": { country: "UEFA", flag: "🏆", tier: 1 },
  "UEFA Conference League": { country: "UEFA", flag: "🏆", tier: 2 },
  "Conference League": { country: "UEFA", flag: "🏆", tier: 2 },
  "UEFA Super Cup": { country: "UEFA", flag: "🏆", tier: 2 },
  "UEFA Nations League": { country: "UEFA", flag: "🏆", tier: 2 },

  // 🌍 CAF / Africa
  "CAF Champions League": { country: "CAF", flag: "🌍", tier: 1 },
  "CAF Confederation Cup": { country: "CAF", flag: "🌍", tier: 2 },
  "Africa Cup of Nations": { country: "CAF", flag: "🌍", tier: 1 },
  "AFCON": { country: "CAF", flag: "🌍", tier: 1 },
  "AFCON Qualifiers": { country: "CAF", flag: "🌍", tier: 2 },
  "CAF WC Qualifiers": { country: "CAF", flag: "🌍", tier: 2 },

  // 🌎 FIFA
  "World Cup": { country: "FIFA", flag: "🌎", tier: 1 },
  "WC 2026": { country: "FIFA", flag: "🌎", tier: 1 },
  "WC 2026 Play-offs": { country: "FIFA", flag: "🌎", tier: 1 },
  "FIFA Club World Cup": { country: "FIFA", flag: "🌎", tier: 2 },

  // 🇳🇬 Nigeria
  "NPFL": { country: "Nigeria", flag: "🇳🇬", tier: 2 },
  "Nigeria Professional Football League": { country: "Nigeria", flag: "🇳🇬", tier: 2 },

  // 🇲🇦 Morocco
  "Botola Pro": { country: "Morocco", flag: "🇲🇦", tier: 2 },
  "Botola": { country: "Morocco", flag: "🇲🇦", tier: 2 },

  // 🇪🇬 Egypt
  "Egyptian Premier League": { country: "Egypt", flag: "🇪🇬", tier: 2 },

  // 🇹🇳 Tunisia
  "Ligue 1 (Tunisia)": { country: "Tunisia", flag: "🇹🇳", tier: 3 },
  "Ligue Professionnelle 1": { country: "Tunisia", flag: "🇹🇳", tier: 3 },

  // 🇿🇦 South Africa
  "Premier Soccer League": { country: "South Africa", flag: "🇿🇦", tier: 2 },
  "DSTV Premiership": { country: "South Africa", flag: "🇿🇦", tier: 2 },

  // 🇬🇭 Ghana
  "Ghana Premier League": { country: "Ghana", flag: "🇬🇭", tier: 3 },

  // 🇰🇪 Kenya
  "Kenyan Premier League": { country: "Kenya", flag: "🇰🇪", tier: 3 },
  "FKF Premier League": { country: "Kenya", flag: "🇰🇪", tier: 3 },

  // 🇹🇿 Tanzania
  "Ligi kuu Bara": { country: "Tanzania", flag: "🇹🇿", tier: 3 },
  "Tanzania Premier League": { country: "Tanzania", flag: "🇹🇿", tier: 3 },

  // 🇺🇬 Uganda
  "Uganda Premier League": { country: "Uganda", flag: "🇺🇬", tier: 3 },
  "Ugandan Super League": { country: "Uganda", flag: "🇺🇬", tier: 3 },

  // 🇪🇹 Ethiopia
  "Ethiopian Premier League": { country: "Ethiopia", flag: "🇪🇹", tier: 3 },

  // 🇿🇼 Zimbabwe
  "Zimbabwe Premier League": { country: "Zimbabwe", flag: "🇿🇼", tier: 3 },

  // 🇺🇸 United States
  "MLS": { country: "USA", flag: "🇺🇸", tier: 1 },
  "Major League Soccer": { country: "USA", flag: "🇺🇸", tier: 1 },
  "USL Championship": { country: "USA", flag: "🇺🇸", tier: 3 },

  // 🇲🇽 Mexico
  "Liga MX": { country: "Mexico", flag: "🇲🇽", tier: 2 },

  // 🇧🇷 Brazil
  "Serie A (Brazil)": { country: "Brazil", flag: "🇧🇷", tier: 2 },
  "Brasileirão": { country: "Brazil", flag: "🇧🇷", tier: 2 },

  // 🇦🇷 Argentina
  "Primera División": { country: "Argentina", flag: "🇦🇷", tier: 2 },
  "Liga Profesional": { country: "Argentina", flag: "🇦🇷", tier: 2 },

  // 🇸🇦 Saudi Arabia
  "Saudi Pro League": { country: "Saudi Arabia", flag: "🇸🇦", tier: 1 },
  "Roshn Saudi League": { country: "Saudi Arabia", flag: "🇸🇦", tier: 1 },

  // 🇯🇵 Japan
  "J1 League": { country: "Japan", flag: "🇯🇵", tier: 2 },
  "J-League": { country: "Japan", flag: "🇯🇵", tier: 2 },

  // 🇰🇷 South Korea
  "K League 1": { country: "South Korea", flag: "🇰🇷", tier: 3 },

  // 🇨🇳 China
  "Chinese Super League": { country: "China", flag: "🇨🇳", tier: 3 },

  // 🇦🇺 Australia
  "A-League": { country: "Australia", flag: "🇦🇺", tier: 3 },

  // 🇮🇳 India
  "Indian Super League": { country: "India", flag: "🇮🇳", tier: 3 },

  // 🏴󠁧󠁢󠁷󠁬󠁳󠁿 Wales
  "Cymru Premier": { country: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", tier: 3 },
  "Welsh Premier League": { country: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", tier: 3 },

  // 🇮🇪 Ireland
  "League of Ireland Premier": { country: "Ireland", flag: "🇮🇪", tier: 3 },

  // 🇭🇺 Hungary
  "NB I": { country: "Hungary", flag: "🇭🇺", tier: 3 },

  // 🇷🇴 Romania
  "Liga I": { country: "Romania", flag: "🇷🇴", tier: 3 },

  // 🇧🇬 Bulgaria
  "First Professional League": { country: "Bulgaria", flag: "🇧🇬", tier: 3 },

  // 🇭🇷 Croatia
  "HNL": { country: "Croatia", flag: "🇭🇷", tier: 3 },

  // 🇷🇸 Serbia
  "Super Liga": { country: "Serbia", flag: "🇷🇸", tier: 3 },

  // 🇮🇱 Israel
  "Israeli Premier League": { country: "Israel", flag: "🇮🇱", tier: 3 },

  // 🇶🇦 Qatar
  "Qatar Stars League": { country: "Qatar", flag: "🇶🇦", tier: 3 },

  // 🇦🇪 UAE
  "UAE Pro League": { country: "UAE", flag: "🇦🇪", tier: 3 },

  // 🇨🇴 Colombia
  "Liga BetPlay": { country: "Colombia", flag: "🇨🇴", tier: 3 },

  // 🇨🇱 Chile
  "Primera División (Chile)": { country: "Chile", flag: "🇨🇱", tier: 3 },

  // 🇵🇾 Paraguay
  "División de Honor": { country: "Paraguay", flag: "🇵🇾", tier: 3 },

  // 🇺🇾 Uruguay
  "Primera División (Uruguay)": { country: "Uruguay", flag: "🇺🇾", tier: 3 },

  // 🇪🇨 Ecuador
  "Liga Pro": { country: "Ecuador", flag: "🇪🇨", tier: 3 },

  // 🇵🇪 Peru
  "Liga 1": { country: "Peru", flag: "🇵🇪", tier: 3 },

  // 🇧🇴 Bolivia
  "División Profesional": { country: "Bolivia", flag: "🇧🇴", tier: 3 },

  // 🇭🇳 Honduras
  "Liga Nacional": { country: "Honduras", flag: "🇭🇳", tier: 3 },

  // 🇬🇹 Guatemala
  "Liga Nacional (Guatemala)": { country: "Guatemala", flag: "🇬🇹", tier: 3 },

  // 🇨🇷 Costa Rica
  "Primera División (Costa Rica)": { country: "Costa Rica", flag: "🇨🇷", tier: 3 },

  // South America Confederation
  "Copa Libertadores": { country: "CONMEBOL", flag: "🌎", tier: 1 },
  "Copa Sudamericana": { country: "CONMEBOL", flag: "🌎", tier: 2 },
};

// ── HELPERS ─────────────────────────────────────────────────────────────────

const DEFAULT_COUNTRY: LeagueCountry = { country: "Other", flag: "🌐", tier: 3 };

export function getCountryForLeague(leagueName: string): LeagueCountry {
  if (MAP[leagueName]) return MAP[leagueName];

  // Fuzzy match: check if any key is contained in the league name
  const lower = leagueName.toLowerCase();
  for (const [key, value] of Object.entries(MAP)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return value;
    }
  }

  return DEFAULT_COUNTRY;
}

export function isPopularLeague(leagueName: string): boolean {
  const lower = leagueName.toLowerCase();
  return POPULAR_LEAGUES.some(pl =>
    pl.keywords.some(kw => lower.includes(kw)) || lower === pl.name.toLowerCase()
  );
}

export type CountryGroup = {
  country: string;
  flag: string;
  tier: number;
  leagues: { leagueName: string; count: number }[];
};

export function getUniqueCountries<T extends { league_name: string }>(fixtures: T[]): CountryGroup[] {
  const countryMap = new Map<string, { flag: string; tier: number; leagues: Map<string, number> }>();

  for (const f of fixtures) {
    const info = getCountryForLeague(f.league_name);
    if (!countryMap.has(info.country)) {
      countryMap.set(info.country, { flag: info.flag, tier: info.tier, leagues: new Map() });
    }
    const c = countryMap.get(info.country)!;
    c.leagues.set(f.league_name, (c.leagues.get(f.league_name) || 0) + 1);
    if (info.tier < c.tier) c.tier = info.tier;
  }

  return Array.from(countryMap.entries())
    .map(([country, data]) => ({
      country,
      flag: data.flag,
      tier: data.tier,
      leagues: Array.from(data.leagues.entries())
        .map(([leagueName, count]) => ({ leagueName, count }))
        .sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => a.tier - b.tier || a.country.localeCompare(b.country));
}
