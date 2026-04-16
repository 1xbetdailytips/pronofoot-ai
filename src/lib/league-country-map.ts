// Static league_name → country mapping with emoji flags
// Covers top leagues + African leagues. Unknown leagues fallback to "Other"

export type LeagueCountry = {
  country: string;
  flag: string;
  tier: number; // 1=popular, 2=notable, 3=other
};

// ── POPULAR LEAGUES (shown as quick-access buttons in the strip) ─────────────
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
  { name: "UEFA Nations League", shortName: "Nations", flag: "🏆", keywords: ["nations league"] },
  { name: "Euro Qualifiers", shortName: "Euro Q", flag: "🏆", keywords: ["euro qualifiers", "euro qualification"] },
  { name: "WC Qualifiers", shortName: "WC Q", flag: "🌎", keywords: ["wc qualifiers", "world cup qual"] },
  { name: "MLS", shortName: "MLS", flag: "🇺🇸", keywords: ["mls", "major league soccer"] },
  { name: "Saudi Pro League", shortName: "Saudi", flag: "🇸🇦", keywords: ["saudi pro", "roshn"] },
];

// ── GUARANTEED LEAGUE IDS — always shown in "popular" filter ────────────────
// All top European divisions + cups + African majors + international
export const GUARANTEED_LEAGUE_IDS = new Set([
  // England (all divisions + cups)
  39,   // Premier League
  40,   // Championship
  41,   // League One
  42,   // League Two
  45,   // FA Cup
  48,   // EFL Cup
  // Spain
  140,  // La Liga
  141,  // Segunda División
  143,  // Copa del Rey
  // Italy
  135,  // Serie A
  136,  // Serie B
  137,  // Coppa Italia
  138,  // Serie C - Girone A
  942,  // Serie C - Girone B
  943,  // Serie C - Girone C
  // Germany
  78,   // Bundesliga
  79,   // 2. Bundesliga
  80,   // 3. Liga
  81,   // DFB Pokal
  // France
  61,   // Ligue 1
  62,   // Ligue 2
  66,   // Coupe de France
  // Portugal
  94,   // Primeira Liga
  // Netherlands
  88,   // Eredivisie
  // Belgium
  144,  // Jupiler Pro League
  // Scotland
  179,  // Premiership
  // Turkey
  203,  // Süper Lig
  // UEFA competitions
  2,    // Champions League
  3,    // Europa League
  848,  // Conference League
  5,    // UEFA Nations League
  531,  // UEFA Super Cup
  4,    // Euro Championship
  // FIFA / World Cup
  1,    // World Cup
  15,   // Club World Cup
  29,   // WC Qualifiers - Africa
  30,   // WC Qualifiers - Asia
  31,   // WC Qualifiers - Europe
  32,   // WC Qualifiers - N. America
  33,   // WC Qualifiers - Oceania
  34,   // WC Qualifiers - S. America
  // Cameroon
  406,  // MTN Elite One
  407,  // MTN Elite Two
  // CAF / Africa
  12,   // CAF Champions League
  20,   // CAF Confederation Cup
  6,    // AFCON
  233,  // Egyptian Premier League
  200,  // Botola Pro (Morocco)
  332,  // NPFL (Nigeria)
  288,  // DSTV Premiership (South Africa)
  570,  // Ghana Premier League
  202,  // Tunisia Ligue 1
  276,  // Kenya FKF Premier League
  386,  // Ivory Coast Ligue 1
  186,  // Algeria Ligue 1
  567,  // Tanzania Ligi kuu Bara
  // Other major
  253,  // MLS
  307,  // Saudi Pro League
  13,   // Copa Libertadores
]);

// ── BETTABLE ON 1XBET — leagues with active betting markets ────────────────
// Matches in these leagues show a "Bet on 1xBet" badge with affiliate link
export const BETTABLE_LEAGUE_IDS = new Set([
  // England
  39, 40, 41, 42, 45, 48,
  // Spain
  140, 141, 143,
  // Italy
  135, 136, 137, 138, 942, 943, // + Serie C groups
  // Germany
  78, 79, 80, 81, // + 3. Liga
  // France
  61, 62, 66,
  // Portugal
  94, 95, // Primeira Liga + Liga Portugal 2
  // Netherlands
  88, 89, // Eredivisie + Eerste Divisie
  // Belgium
  144,
  // Scotland
  179,
  // Turkey
  203, 204, // Süper Lig + 1. Lig
  // Greece
  197,
  // Switzerland
  207,
  // Austria
  218,
  // Denmark
  120,
  // Sweden
  113,
  // Norway
  103,
  // Poland
  106,
  // Czech Republic
  345,
  // Croatia
  210,
  // Serbia
  286,
  // Romania
  283,
  // Ukraine
  333,
  // Russia
  235, 236,
  // UEFA
  2, 3, 848,
  5,   // Nations League
  531, // UEFA Super Cup
  // Cameroon
  406, 407,
  // Africa
  12, 20, 6, // CAF CL, CAF CC, AFCON
  233, // Egypt
  200, // Morocco
  332, // Nigeria (NPFL)
  288, // South Africa
  570, // Ghana Premier League (CORRECTED: was 271 = Hungary NB I)
  202, // Tunisia Ligue 1 (CORRECTED: was 305 = Qatar Stars League)
  276, // Kenya FKF Premier League
  386, // Ivory Coast Ligue 1
  186, // Algeria Ligue 1
  567, // Tanzania Ligi kuu Bara
  // FIFA
  1, 15, // World Cup, Club WC
  4, // Euro Championship
  29, 30, 31, 32, 33, 34, // WC Qualifiers (all zones)
  // Americas
  253, // MLS
  71, // Brazilian Serie A
  72, // Brazilian Serie B
  128, // Argentine Liga Profesional
  13, // Copa Libertadores
  11, // Copa Sudamericana
  262, // Liga MX
  // Asia
  307, // Saudi Pro League
  169, // Chinese Super League
  98, // J-League
  292, // K-League 1 (South Korea)
  // Australia
  188, // A-League
]);

/** Check if a match is available on 1xBet betting markets */
export function isBettableOn1xBet(leagueId: number): boolean {
  return BETTABLE_LEAGUE_IDS.has(leagueId);
}

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
  "Serie C - Girone A": { country: "Italy", flag: "🇮🇹", tier: 3 },
  "Serie C - Girone B": { country: "Italy", flag: "🇮🇹", tier: 3 },
  "Serie C - Girone C": { country: "Italy", flag: "🇮🇹", tier: 3 },
  "Coppa Italia": { country: "Italy", flag: "🇮🇹", tier: 2 },

  // 🇩🇪 Germany
  "Bundesliga": { country: "Germany", flag: "🇩🇪", tier: 1 },
  "2. Bundesliga": { country: "Germany", flag: "🇩🇪", tier: 2 },
  "3. Liga": { country: "Germany", flag: "🇩🇪", tier: 2 },
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

  // 🏆 Euro
  "Euro Championship": { country: "UEFA", flag: "🏆", tier: 1 },
  "European Championship": { country: "UEFA", flag: "🏆", tier: 1 },
  "Euro Qualifiers": { country: "UEFA", flag: "🏆", tier: 2 },
  "European Championship - Qualification": { country: "UEFA", flag: "🏆", tier: 2 },

  // 🌎 FIFA
  "World Cup": { country: "FIFA", flag: "🌎", tier: 1 },
  "WC 2026": { country: "FIFA", flag: "🌎", tier: 1 },
  "WC 2026 Play-offs": { country: "FIFA", flag: "🌎", tier: 1 },
  "FIFA Club World Cup": { country: "FIFA", flag: "🌎", tier: 2 },
  "World Cup - Qualification Africa": { country: "FIFA", flag: "🌎", tier: 1 },
  "World Cup - Qualification Asia": { country: "FIFA", flag: "🌎", tier: 1 },
  "World Cup - Qualification Europe": { country: "FIFA", flag: "🌎", tier: 1 },
  "World Cup - Qualification North America": { country: "FIFA", flag: "🌎", tier: 1 },
  "World Cup - Qualification Oceania": { country: "FIFA", flag: "🌎", tier: 1 },
  "World Cup - Qualification South America": { country: "FIFA", flag: "🌎", tier: 1 },

  // 🇳🇬 Nigeria
  "NPFL": { country: "Nigeria", flag: "🇳🇬", tier: 2 },
  "Nigeria Professional Football League": { country: "Nigeria", flag: "🇳🇬", tier: 2 },

  // 🇲🇦 Morocco
  "Botola Pro": { country: "Morocco", flag: "🇲🇦", tier: 2 },
  "Botola": { country: "Morocco", flag: "🇲🇦", tier: 2 },

  // 🇪🇬 Egypt
  "Egyptian Premier League": { country: "Egypt", flag: "🇪🇬", tier: 2 },

  // 🇹🇳 Tunisia
  "Ligue 1 (Tunisia)": { country: "Tunisia", flag: "🇹🇳", tier: 2 },
  "Ligue Professionnelle 1": { country: "Tunisia", flag: "🇹🇳", tier: 2 },

  // 🇩🇿 Algeria
  "Ligue 1 (Algeria)": { country: "Algeria", flag: "🇩🇿", tier: 2 },
  "Ligue Professionnelle 1 (Algeria)": { country: "Algeria", flag: "🇩🇿", tier: 2 },

  // 🇨🇮 Ivory Coast
  "Ligue 1 (Ivory Coast)": { country: "Ivory Coast", flag: "🇨🇮", tier: 2 },

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
  // Italy lower
  138: { country: "Italy", flag: "🇮🇹", tier: 3 },  // Serie C - Girone A
  942: { country: "Italy", flag: "🇮🇹", tier: 3 },  // Serie C - Girone B
  943: { country: "Italy", flag: "🇮🇹", tier: 3 },  // Serie C - Girone C
  // Germany lower
  80: { country: "Germany", flag: "🇩🇪", tier: 2 },  // 3. Liga
  // UEFA
  2: { country: "UEFA", flag: "🏆", tier: 1 },    // Champions League
  3: { country: "UEFA", flag: "🏆", tier: 1 },    // Europa League
  848: { country: "UEFA", flag: "🏆", tier: 2 },  // Conference League
  5: { country: "UEFA", flag: "🏆", tier: 1 },    // UEFA Nations League
  531: { country: "UEFA", flag: "🏆", tier: 2 },  // UEFA Super Cup
  4: { country: "UEFA", flag: "🏆", tier: 1 },    // Euro Championship
  // CAF
  12: { country: "CAF", flag: "🌍", tier: 1 },    // CAF Champions League
  20: { country: "CAF", flag: "🌍", tier: 2 },    // CAF Confederation Cup
  6: { country: "CAF", flag: "🌍", tier: 1 },     // AFCON
  // FIFA
  1: { country: "FIFA", flag: "🌎", tier: 1 },    // World Cup
  15: { country: "FIFA", flag: "🌎", tier: 2 },   // Club World Cup
  29: { country: "FIFA", flag: "🌎", tier: 1 },   // WC Qualifiers - Africa
  30: { country: "FIFA", flag: "🌎", tier: 1 },   // WC Qualifiers - Asia
  31: { country: "FIFA", flag: "🌎", tier: 1 },   // WC Qualifiers - Europe
  32: { country: "FIFA", flag: "🌎", tier: 1 },   // WC Qualifiers - N. America
  33: { country: "FIFA", flag: "🌎", tier: 1 },   // WC Qualifiers - Oceania
  34: { country: "FIFA", flag: "🌎", tier: 1 },   // WC Qualifiers - S. America
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
  276: { country: "Kenya", flag: "🇰🇪", tier: 2 },   // FKF Premier League
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
  // Ghana (CORRECTED: was 271 = Hungary NB I)
  570: { country: "Ghana", flag: "🇬🇭", tier: 2 },   // Ghana Premier League
  // Tunisia (CORRECTED: was 305 = Qatar Stars League)
  202: { country: "Tunisia", flag: "🇹🇳", tier: 2 },  // Ligue 1
  // Ivory Coast
  386: { country: "Ivory Coast", flag: "🇨🇮", tier: 2 }, // Ligue 1
  // Algeria
  186: { country: "Algeria", flag: "🇩🇿", tier: 2 },  // Ligue 1
  // Tanzania
  567: { country: "Tanzania", flag: "🇹🇿", tier: 3 },  // Ligi kuu Bara
  // South Korea
  292: { country: "South Korea", flag: "🇰🇷", tier: 2 }, // K League 1
  // CONMEBOL
  13: { country: "CONMEBOL", flag: "🌎", tier: 1 },  // Copa Libertadores
  11: { country: "CONMEBOL", flag: "🌎", tier: 2 },  // Copa Sudamericana
};

// ── COUNTRY → FLAG mapping (for when we have the real country from API-Football) ──
const COUNTRY_FLAGS: Record<string, string> = {
  "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Spain": "🇪🇸", "Italy": "🇮🇹", "Germany": "🇩🇪", "France": "🇫🇷",
  "Portugal": "🇵🇹", "Netherlands": "🇳🇱", "Belgium": "🇧🇪", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Turkey": "🇹🇷",
  "Greece": "🇬🇷", "Russia": "🇷🇺", "Ukraine": "🇺🇦", "Austria": "🇦🇹", "Switzerland": "🇨🇭",
  "Czech-Republic": "🇨🇿", "Poland": "🇵🇱", "Denmark": "🇩🇰", "Sweden": "🇸🇪", "Norway": "🇳🇴",
  "Finland": "🇫🇮", "Hungary": "🇭🇺", "Romania": "🇷🇴", "Bulgaria": "🇧🇬", "Croatia": "🇭🇷",
  "Serbia": "🇷🇸", "Israel": "🇮🇱", "Wales": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "Ireland": "🇮🇪",
  "Cameroon": "🇨🇲", "Nigeria": "🇳🇬", "Morocco": "🇲🇦", "Egypt": "🇪🇬", "Tunisia": "🇹🇳",
  "South-Africa": "🇿🇦", "Ghana": "🇬🇭", "Kenya": "🇰🇪", "Tanzania": "🇹🇿", "Uganda": "🇺🇬",
  "Ethiopia": "🇪🇹", "Zimbabwe": "🇿🇼", "Algeria": "🇩🇿", "Senegal": "🇸🇳", "Ivory-Coast": "🇨🇮",
  "USA": "🇺🇸", "Mexico": "🇲🇽", "Brazil": "🇧🇷", "Argentina": "🇦🇷", "Colombia": "🇨🇴",
  "Chile": "🇨🇱", "Paraguay": "🇵🇾", "Uruguay": "🇺🇾", "Ecuador": "🇪🇨", "Peru": "🇵🇪",
  "Saudi-Arabia": "🇸🇦", "Japan": "🇯🇵", "South-Korea": "🇰🇷", "China": "🇨🇳", "Australia": "🇦🇺",
  "India": "🇮🇳", "Qatar": "🇶🇦", "UAE": "🇦🇪", "World": "🌎",
};

function getFlagForCountry(country: string): string {
  if (COUNTRY_FLAGS[country]) return COUNTRY_FLAGS[country];
  // Try without dashes
  const noDash = country.replace(/-/g, " ");
  for (const [key, flag] of Object.entries(COUNTRY_FLAGS)) {
    if (key.replace(/-/g, " ").toLowerCase() === noDash.toLowerCase()) return flag;
  }
  return "🌐";
}

// ── HELPERS ─────────────────────────────────────────────────────────────────

const DEFAULT_COUNTRY: LeagueCountry = { country: "Other", flag: "🌐", tier: 3 };

export function getCountryForLeague(leagueName: string, leagueId?: number, leagueCountry?: string | null): LeagueCountry {
  // 0. If we have the REAL country from API-Football, use it directly (most reliable)
  if (leagueCountry) {
    const flag = getFlagForCountry(leagueCountry);
    // Determine tier from ID_MAP if available, otherwise from name MAP, otherwise tier 3
    const idInfo = leagueId ? ID_MAP[leagueId] : undefined;
    const nameInfo = MAP[leagueName];
    const tier = idInfo?.tier ?? nameInfo?.tier ?? (GUARANTEED_LEAGUE_IDS.has(leagueId || 0) ? 1 : 3);
    return { country: leagueCountry, flag, tier };
  }

  // 1. Try league_id
  if (leagueId && ID_MAP[leagueId]) return ID_MAP[leagueId];

  // 2. Exact name match
  if (MAP[leagueName]) return MAP[leagueName];

  // 3. Fuzzy match (only if league name contains a known key, 5+ chars)
  const lower = leagueName.toLowerCase();
  for (const [key, value] of Object.entries(MAP)) {
    const keyLower = key.toLowerCase();
    if (keyLower.length >= 5 && lower.includes(keyLower)) {
      return value;
    }
  }

  return DEFAULT_COUNTRY;
}

export function isPopularLeague(leagueName: string, leagueId?: number): boolean {
  // league_id is most reliable — use GUARANTEED_LEAGUE_IDS (all top European + African leagues)
  if (leagueId) return GUARANTEED_LEAGUE_IDS.has(leagueId);

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

export function getUniqueCountries<T extends { league_name: string; league_id?: number; league_country?: string | null }>(fixtures: T[]): CountryGroup[] {
  const countryMap = new Map<string, { flag: string; tier: number; leagues: Map<string, number> }>();

  for (const f of fixtures) {
    const info = getCountryForLeague(f.league_name, f.league_id, f.league_country);
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
