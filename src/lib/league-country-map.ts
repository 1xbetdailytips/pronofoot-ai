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

// ── LEAGUE ID → COUNTRY MAP (resolves ambiguous names like "Premier League") ──
const ID_MAP: Record<number, LeagueCountry> = {
  // England
  39: { country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 1 },  // Premier League
  40: { country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 2 },  // Championship
  41: { country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 3 },  // League One
  42: { country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 3 },  // League Two
  45: { country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 2 },  // FA Cup
  48: { country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", tier: 2 },  // EFL Cup
  // Spain
  140: { country: "Spain", flag: "🇪🇸", tier: 1 },  // La Liga
  141: { country: "Spain", flag: "🇪🇸", tier: 2 },  // Segunda División
  143: { country: "Spain", flag: "🇪🇸", tier: 2 },  // Copa del Rey
  // Italy
  135: { country: "Italy", flag: "🇮🇹", tier: 1 },  // Serie A
  136: { country: "Italy", flag: "🇮🇹", tier: 2 },  // Serie B
  137: { country: "Italy", flag: "🇮🇹", tier: 2 },  // Coppa Italia
  // Germany
  78: { country: "Germany", flag: "🇩🇪", tier: 1 },   // Bundesliga
  79: { country: "Germany", flag: "🇩🇪", tier: 2 },   // 2. Bundesliga
  81: { country: "Germany", flag: "🇩🇪", tier: 2 },   // DFB Pokal
  // France
  61: { country: "France", flag: "🇫🇷", tier: 1 },   // Ligue 1
  62: { country: "France", flag: "🇫🇷", tier: 2 },   // Ligue 2
  66: { country: "France", flag: "🇫🇷", tier: 2 },   // Coupe de France
  // Cameroon
  406: { country: "Cameroon", flag: "🇨🇲", tier: 1 }, // MTN Elite One
  407: { country: "Cameroon", flag: "🇨🇲", tier: 2 }, // MTN Elite Two
  // UEFA
  2: { country: "UEFA", flag: "🏆", tier: 1 },    // Champions League
  3: { country: "UEFA", flag: "🏆", tier: 1 },    // Europa League
  848: { country: "UEFA", flag: "🏆", tier: 2 },  // Conference League
  // CAF
  12: { country: "CAF", flag: "🌍", tier: 1 },    // CAF Champions League
  20: { country: "CAF", flag: "🌍", tier: 2 },    // CAF Confederation Cup
  6: { country: "CAF", flag: "🌍", tier: 1 },     // AFCON
  // FIFA
  1: { country: "FIFA", flag: "🌎", tier: 1 },    // World Cup
  15: { country: "FIFA", flag: "🌎", tier: 2 },   // Club World Cup
  // Portugal
  94: { country: "Portugal", flag: "🇵🇹", tier: 2 },  // Primeira Liga
  // Netherlands
  88: { country: "Netherlands", flag: "🇳🇱", tier: 2 }, // Eredivisie
  // Belgium
  144: { country: "Belgium", flag: "🇧🇪", tier: 2 }, // Jupiler Pro League
  // Scotland
  179: { country: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", tier: 2 }, // Premiership
  // Turkey
  203: { country: "Turkey", flag: "🇹🇷", tier: 2 },  // Süper Lig
  // USA
  253: { country: "USA", flag: "🇺🇸", tier: 1 },     // MLS
  // Saudi Arabia
  307: { country: "Saudi Arabia", flag: "🇸🇦", tier: 1 }, // Saudi Pro League
  // South Africa
  288: { country: "South Africa", flag: "🇿🇦", tier: 2 }, // DSTV Premiership
  // Kenya
  276: { country: "Kenya", flag: "🇰🇪", tier: 3 },   // FKF Premier League
  // Uganda
  280: { country: "Uganda", flag: "🇺🇬", tier: 3 },   // Uganda Premier League
  // Nigeria
  332: { country: "Nigeria", flag: "🇳🇬", tier: 2 },   // NPFL
  // Egypt
  233: { country: "Egypt", flag: "🇪🇬", tier: 2 },    // Egyptian Premier League
  // Morocco
  200: { country: "Morocco", flag: "🇲🇦", tier: 2 },   // Botola Pro
  // Brazil
  71: { country: "Brazil", flag: "🇧🇷", tier: 2 },    // Serie A (Brazil)
  // Argentina
  128: { country: "Argentina", flag: "🇦🇷", tier: 2 }, // Liga Profesional
  // Mexico
  262: { country: "Mexico", flag: "🇲🇽", tier: 2 },   // Liga MX
  // Japan
  98: { country: "Japan", flag: "🇯🇵", tier: 2 },     // J1 League
  // CONMEBOL
  13: { country: "CONMEBOL", flag: "🌎", tier: 1 },  // Copa Libertadores
  11: { country: "CONMEBOL", flag: "🌎", tier: 2 },  // Copa Sudamericana
};

// ── HELPERS ─────────────────────────────────────────────────────────────────

const DEFAULT_COUNTRY: LeagueCountry = { country: "Other", flag: "🌐", tier: 3 };

// Names shared by multiple countries — skip name-based match when league_id is present but unknown
const AMBIGUOUS_NAMES = new Set([
  "premier league", "serie a", "ligue 1", "primera división", "super league",
  "national league", "liga 1", "pro league", "first division a", "premiership",
  "super liga", "division de honor", "liga nacional",
]);

export function getCountryForLeague(leagueName: string, leagueId?: number): LeagueCountry {
  // 1. Try league_id first (most accurate — resolves "Premier League" ambiguity)
  if (leagueId && ID_MAP[leagueId]) return ID_MAP[leagueId];

  // 2. Exact name match — BUT skip if name is ambiguous AND we have an unknown league_id
  //    (prevents Zimbabwe's "Premier League" from mapping to England)
  const isAmbiguous = AMBIGUOUS_NAMES.has(leagueName.toLowerCase());
  if (MAP[leagueName] && !(isAmbiguous && leagueId)) {
    return MAP[leagueName];
  }

  // 3. Careful fuzzy match — only match if the league name CONTAINS a known key
  //    (not the reverse, which caused "Premier League" to match everything)
  const lower = leagueName.toLowerCase();
  for (const [key, value] of Object.entries(MAP)) {
    const keyLower = key.toLowerCase();
    // Only match if the incoming name contains the full key name
    // AND the key is at least 5 chars (avoid short key false positives like "NB I")
    if (keyLower.length >= 5 && lower.includes(keyLower)) {
      return value;
    }
  }

  return DEFAULT_COUNTRY;
}

// API-Football league IDs for popular leagues
const POPULAR_LEAGUE_IDS = new Set([
  39,   // Premier League (England)
  140,  // La Liga
  135,  // Serie A
  78,   // Bundesliga
  61,   // Ligue 1
  406,  // MTN Elite One
  6,    // AFCON
  12,   // CAF Champions League
  1,    // FIFA World Cup
  253,  // MLS
  307,  // Saudi Pro League
  2,    // UEFA Champions League
]);

export function isPopularLeague(leagueName: string, leagueId?: number): boolean {
  // league_id is most reliable — prevents "Premier League" (Uganda) matching EPL
  if (leagueId) return POPULAR_LEAGUE_IDS.has(leagueId);

  // Fallback to name match only when league_id is unavailable
  const lower = leagueName.toLowerCase().trim();
  return POPULAR_LEAGUES.some(pl =>
    // Exact match on name
    lower === pl.name.toLowerCase() ||
    // Exact keyword match (not includes — prevents "Premier League 2" matching "Premier League")
    pl.keywords.some(kw => lower === kw || lower === kw + " ")
  );
}

// Broader check: is this league from a "covered" country (tier 1 or 2)?
export function isNotableleague(leagueName: string): boolean {
  const info = getCountryForLeague(leagueName);
  return info.tier <= 2;
}

export type CountryGroup = {
  country: string;
  flag: string;
  tier: number;
  leagues: { leagueName: string; count: number }[];
};

export function getUniqueCountries<T extends { league_name: string; league_id?: number }>(fixtures: T[]): CountryGroup[] {
  const countryMap = new Map<string, { flag: string; tier: number; leagues: Map<string, number> }>();

  for (const f of fixtures) {
    const info = getCountryForLeague(f.league_name, f.league_id);
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
