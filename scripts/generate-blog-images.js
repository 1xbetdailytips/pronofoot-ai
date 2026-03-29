/**
 * Generate professional blog hero images and infographics using Sharp
 * Run: node scripts/generate-blog-images.js
 */
const sharp = require("sharp");
const path = require("path");

const OUT = path.join(__dirname, "..", "public", "images", "blog");

// ── Helper: Create an SVG with rich design ─────────────────────────────────
function heroSvg({ title, subtitle, emoji, gradientFrom, gradientTo, accentColor, pattern }) {
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${gradientFrom}"/>
      <stop offset="100%" stop-color="${gradientTo}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accentColor}"/>
      <stop offset="100%" stop-color="${accentColor}88"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#00000044"/>
    </filter>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    </pattern>
    <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="1.5" fill="rgba(255,255,255,0.06)"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#${pattern || 'dots'})"/>

  <!-- Decorative circles -->
  <circle cx="1050" cy="100" r="180" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
  <circle cx="1050" cy="100" r="120" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="2"/>
  <circle cx="150" cy="530" r="140" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="2"/>

  <!-- Accent bar -->
  <rect x="80" y="190" width="6" height="120" rx="3" fill="url(#accent)"/>

  <!-- Emoji / Icon -->
  <text x="110" y="170" font-size="80" font-family="serif">${emoji}</text>

  <!-- Title -->
  <text x="110" y="250" font-family="Inter, system-ui, Arial, Helvetica, sans-serif" font-size="48" font-weight="800" fill="white" filter="url(#shadow)">
    ${wrapText(title, 38).map((line, i) => `<tspan x="110" dy="${i === 0 ? 0 : 58}">${escXml(line)}</tspan>`).join("")}
  </text>

  <!-- Subtitle -->
  <text x="110" y="${250 + wrapText(title, 38).length * 58 + 30}" font-family="Inter, system-ui, Arial, sans-serif" font-size="22" fill="rgba(255,255,255,0.7)">
    ${wrapText(subtitle, 60).map((line, i) => `<tspan x="110" dy="${i === 0 ? 0 : 28}">${escXml(line)}</tspan>`).join("")}
  </text>

  <!-- Bottom brand bar -->
  <rect x="0" y="580" width="1200" height="50" fill="rgba(0,0,0,0.3)"/>
  <text x="80" y="612" font-family="Inter, system-ui, Arial, sans-serif" font-size="18" font-weight="700" fill="white">PronoFoot AI</text>
  <text x="230" y="612" font-family="Inter, system-ui, Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.5)">www.parifoot.online</text>

  <!-- Logo mark -->
  <rect x="1060" y="590" width="60" height="24" rx="4" fill="${accentColor}"/>
  <text x="1090" y="607" text-anchor="middle" font-family="Inter, system-ui, Arial, sans-serif" font-size="12" font-weight="800" fill="white">GUIDE</text>
</svg>`;
}

function infographicSvg({ title, items, gradientFrom, gradientTo, accentColor }) {
  const itemsSvg = items.map((item, i) => {
    const y = 160 + i * 95;
    return `
      <rect x="80" y="${y}" width="1040" height="78" rx="12" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <circle cx="130" cy="${y + 39}" r="22" fill="${accentColor}22" stroke="${accentColor}" stroke-width="2"/>
      <text x="130" y="${y + 45}" text-anchor="middle" font-family="Inter, system-ui, Arial, sans-serif" font-size="16" font-weight="800" fill="${accentColor}">${i + 1}</text>
      <text x="170" y="${y + 32}" font-family="Inter, system-ui, Arial, sans-serif" font-size="20" font-weight="700" fill="white">${escXml(item.title)}</text>
      <text x="170" y="${y + 56}" font-family="Inter, system-ui, Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.6)">${escXml(item.desc)}</text>
    `;
  }).join("");

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="${gradientFrom}"/>
      <stop offset="100%" stop-color="${gradientTo}"/>
    </linearGradient>
    <pattern id="dots2" width="24" height="24" patternUnits="userSpaceOnUse">
      <circle cx="12" cy="12" r="1" fill="rgba(255,255,255,0.04)"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg2)"/>
  <rect width="1200" height="630" fill="url(#dots2)"/>

  <!-- Title bar -->
  <rect x="60" y="30" width="1080" height="100" rx="16" fill="rgba(255,255,255,0.06)"/>
  <text x="600" y="92" text-anchor="middle" font-family="Inter, system-ui, Arial, sans-serif" font-size="32" font-weight="800" fill="white">${escXml(title)}</text>

  ${itemsSvg}

  <!-- Footer -->
  <text x="600" y="610" text-anchor="middle" font-family="Inter, system-ui, Arial, sans-serif" font-size="14" fill="rgba(255,255,255,0.35)">PronoFoot AI — www.parifoot.online</text>
</svg>`;
}

function statsSvg({ title, stats, gradientFrom, gradientTo, accentColor }) {
  const statsSvg = stats.map((s, i) => {
    const x = 100 + i * 260;
    return `
      <rect x="${x}" y="200" width="220" height="220" rx="20" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <text x="${x + 110}" y="260" text-anchor="middle" font-size="48">${s.emoji}</text>
      <text x="${x + 110}" y="320" text-anchor="middle" font-family="Inter, system-ui, Arial, sans-serif" font-size="42" font-weight="800" fill="${accentColor}">${escXml(s.value)}</text>
      <text x="${x + 110}" y="360" text-anchor="middle" font-family="Inter, system-ui, Arial, sans-serif" font-size="15" fill="rgba(255,255,255,0.6)">${escXml(s.label)}</text>
      <text x="${x + 110}" y="395" text-anchor="middle" font-family="Inter, system-ui, Arial, sans-serif" font-size="12" fill="rgba(255,255,255,0.35)">${escXml(s.sub || '')}</text>
    `;
  }).join("");

  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${gradientFrom}"/>
      <stop offset="100%" stop-color="${gradientTo}"/>
    </linearGradient>
    <pattern id="grid3" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg3)"/>
  <rect width="1200" height="630" fill="url(#grid3)"/>
  <text x="600" y="120" text-anchor="middle" font-family="Inter, system-ui, Arial, sans-serif" font-size="36" font-weight="800" fill="white">${escXml(title)}</text>
  <rect x="540" y="140" width="120" height="4" rx="2" fill="${accentColor}"/>
  ${statsSvg}
  <text x="600" y="510" text-anchor="middle" font-family="Inter, system-ui, Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.5)">Source: PronoFoot AI Analytics</text>
  <text x="600" y="600" text-anchor="middle" font-family="Inter, system-ui, Arial, sans-serif" font-size="13" fill="rgba(255,255,255,0.25)">www.parifoot.online</text>
</svg>`;
}

// Helpers
function wrapText(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars) {
      lines.push(current.trim());
      current = word;
    } else {
      current += " " + word;
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines;
}

function escXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── Generate all images ─────────────────────────────────────────────────────
async function main() {
  // ═══════ ARTICLE 1: Guide Parier Football Afrique ═══════
  // Hero
  await sharp(Buffer.from(heroSvg({
    title: "Comment Parier sur le Football en Afrique : Le Guide Ultime",
    subtitle: "Stratégies, plateformes, et conseils pour les parieurs africains en 2026",
    emoji: "🌍",
    gradientFrom: "#064e3b",
    gradientTo: "#0f172a",
    accentColor: "#10B981",
    pattern: "dots",
  }))).png({ quality: 90 }).toFile(path.join(OUT, "guide-parier-afrique-hero.png"));
  console.log("✓ Article 1 hero");

  // Infographic: 5 steps
  await sharp(Buffer.from(infographicSvg({
    title: "5 Étapes Pour Bien Parier en Afrique",
    items: [
      { title: "Choisir une plateforme fiable", desc: "1xBet, Bet365, ou une plateforme locale avec licence valide" },
      { title: "Définir un budget strict", desc: "Ne jamais parier plus de 5% de votre capital sur un seul match" },
      { title: "Analyser les statistiques", desc: "Forme récente, confrontations directes, blessures et suspensions" },
      { title: "Commencer par des paris simples", desc: "1X2, Over/Under 2.5 — maîtrisez les bases avant les combinés" },
      { title: "Utiliser des outils IA", desc: "PronoFoot AI analyse 500+ matchs par jour avec 23 ligues couvertes" },
    ],
    gradientFrom: "#1e3a5f",
    gradientTo: "#0a1628",
    accentColor: "#FBBF24",
  }))).png({ quality: 90 }).toFile(path.join(OUT, "guide-parier-afrique-steps.png"));
  console.log("✓ Article 1 infographic");

  // Stats
  await sharp(Buffer.from(statsSvg({
    title: "Le Marché des Paris Sportifs en Afrique",
    stats: [
      { emoji: "📱", value: "75%", label: "Paris via Mobile", sub: "En Afrique subsaharienne" },
      { emoji: "⚽", value: "#1", label: "Sport le Plus Parié", sub: "Le football domine à 85%" },
      { emoji: "📈", value: "$3B+", label: "Marché Annuel", sub: "Croissance de 15%/an" },
      { emoji: "🌍", value: "23", label: "Ligues Couvertes", sub: "Par PronoFoot AI" },
    ],
    gradientFrom: "#0f2027",
    gradientTo: "#203a43",
    accentColor: "#34D399",
  }))).png({ quality: 90 }).toFile(path.join(OUT, "guide-parier-afrique-stats.png"));
  console.log("✓ Article 1 stats");

  // ═══════ ARTICLE 2: Football Betting Tips Beginners ═══════
  await sharp(Buffer.from(heroSvg({
    title: "Football Betting Tips for Beginners: The Ultimate 2026 Guide",
    subtitle: "From your first bet to consistent profits — everything you need to know",
    emoji: "🎯",
    gradientFrom: "#1e1b4b",
    gradientTo: "#312e81",
    accentColor: "#818CF8",
    pattern: "grid",
  }))).png({ quality: 90 }).toFile(path.join(OUT, "betting-tips-beginners-hero.png"));
  console.log("✓ Article 2 hero");

  await sharp(Buffer.from(infographicSvg({
    title: "7 Golden Rules of Smart Football Betting",
    items: [
      { title: "Never Bet With Emotion", desc: "Your favourite team losing isn't a reason to double down" },
      { title: "Bankroll Management is Everything", desc: "The 1-5% rule: never risk more than 5% of your total bankroll" },
      { title: "Understand Value Betting", desc: "A 60% likely outcome at 2.0 odds = positive expected value" },
      { title: "Start With Single Bets", desc: "Accumulators are tempting but singles build consistent profit" },
      { title: "Track Every Bet You Make", desc: "A spreadsheet is your best friend — measure what matters" },
    ],
    gradientFrom: "#1e1b4b",
    gradientTo: "#0f0a2e",
    accentColor: "#A78BFA",
  }))).png({ quality: 90 }).toFile(path.join(OUT, "betting-tips-beginners-rules.png"));
  console.log("✓ Article 2 infographic");

  await sharp(Buffer.from(statsSvg({
    title: "Why Most Bettors Lose — And How to Be Different",
    stats: [
      { emoji: "💸", value: "95%", label: "Lose Long-Term", sub: "Without a strategy" },
      { emoji: "📊", value: "3-5%", label: "Ideal Stake Size", sub: "Per single bet" },
      { emoji: "🧠", value: "2.5x", label: "AI vs Human", sub: "Prediction accuracy edge" },
      { emoji: "🏆", value: "58%", label: "Win Rate Target", sub: "For profitable betting" },
    ],
    gradientFrom: "#1a0533",
    gradientTo: "#0f172a",
    accentColor: "#C084FC",
  }))).png({ quality: 90 }).toFile(path.join(OUT, "betting-tips-beginners-stats.png"));
  console.log("✓ Article 2 stats");

  // ═══════ ARTICLE 3: IA et Paris Sportifs ═══════
  await sharp(Buffer.from(heroSvg({
    title: "L'IA dans les Paris Sportifs : Comment les Algorithmes Prédisent les Matchs",
    subtitle: "Machine learning, données en temps réel, et l'avenir de la prédiction football",
    emoji: "🤖",
    gradientFrom: "#0c4a6e",
    gradientTo: "#0f172a",
    accentColor: "#38BDF8",
    pattern: "grid",
  }))).png({ quality: 90 }).toFile(path.join(OUT, "ia-paris-sportifs-hero.png"));
  console.log("✓ Article 3 hero");

  await sharp(Buffer.from(infographicSvg({
    title: "Comment l'IA Analyse un Match de Football",
    items: [
      { title: "Collecte de données massives", desc: "Stats joueurs, forme d'équipe, météo, historique des confrontations" },
      { title: "Modèles de machine learning", desc: "Réseaux de neurones entraînés sur des millions de matchs passés" },
      { title: "Analyse en temps réel", desc: "Cotes du marché, compositions d'équipe, blessures de dernière minute" },
      { title: "Calcul de probabilités", desc: "Chaque issue reçoit un score de confiance entre 0% et 100%" },
      { title: "Recommandation optimale", desc: "L'IA identifie les value bets et les paris les plus sûrs" },
    ],
    gradientFrom: "#0c4a6e",
    gradientTo: "#020617",
    accentColor: "#38BDF8",
  }))).png({ quality: 90 }).toFile(path.join(OUT, "ia-paris-sportifs-process.png"));
  console.log("✓ Article 3 infographic");

  await sharp(Buffer.from(statsSvg({
    title: "IA vs Experts Humains : La Comparaison",
    stats: [
      { emoji: "🤖", value: "67%", label: "Précision IA", sub: "Sur 10 000+ matchs" },
      { emoji: "👤", value: "52%", label: "Précision Humaine", sub: "Experts professionnels" },
      { emoji: "⚡", value: "500+", label: "Matchs/Jour", sub: "Analysés par l'IA" },
      { emoji: "🎯", value: "15%", label: "Avantage IA", sub: "En précision nette" },
    ],
    gradientFrom: "#0c4a6e",
    gradientTo: "#0f172a",
    accentColor: "#7DD3FC",
  }))).png({ quality: 90 }).toFile(path.join(OUT, "ia-paris-sportifs-comparison.png"));
  console.log("✓ Article 3 stats");

  console.log("\n🎉 All 9 blog images generated in public/images/blog/");
}

main().catch(console.error);
