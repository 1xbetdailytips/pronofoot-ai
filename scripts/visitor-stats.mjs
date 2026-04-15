// Quick visitor analytics dump for parifoot.online
// Usage: node scripts/visitor-stats.mjs

import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function fmt(n) {
  return Number(n).toLocaleString();
}

async function main() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const sevenDaysAgo = new Date(today.getTime() - 7 * 86400000);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 86400000);

  // Total visitors all-time
  const { count: total, error: e1 } = await supabase
    .from("visitors")
    .select("*", { count: "exact", head: true });
  if (e1) {
    console.error("Error querying visitors:", e1);
    process.exit(1);
  }

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  PARIFOOT.ONLINE — VISITOR ANALYTICS");
  console.log("═══════════════════════════════════════════════════\n");

  console.log(`  Total visits (all-time): ${fmt(total)}`);

  // Today
  const { count: todayCount } = await supabase
    .from("visitors")
    .select("*", { count: "exact", head: true })
    .gte("created_at", today.toISOString());
  console.log(`  Today                  : ${fmt(todayCount ?? 0)}`);

  // Yesterday
  const { count: yesterdayCount } = await supabase
    .from("visitors")
    .select("*", { count: "exact", head: true })
    .gte("created_at", yesterday.toISOString())
    .lt("created_at", today.toISOString());
  console.log(`  Yesterday              : ${fmt(yesterdayCount ?? 0)}`);

  // Last 7 days
  const { count: sevenDayCount } = await supabase
    .from("visitors")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString());
  console.log(`  Last 7 days            : ${fmt(sevenDayCount ?? 0)}`);

  // Last 30 days
  const { count: thirtyDayCount } = await supabase
    .from("visitors")
    .select("*", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo.toISOString());
  console.log(`  Last 30 days           : ${fmt(thirtyDayCount ?? 0)}\n`);

  // First-ever visit
  const { data: firstRow } = await supabase
    .from("visitors")
    .select("created_at")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();
  if (firstRow) {
    console.log(`  First visit            : ${new Date(firstRow.created_at).toISOString().slice(0, 10)}`);
  }

  // Most recent visit
  const { data: lastRow } = await supabase
    .from("visitors")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (lastRow) {
    console.log(`  Most recent visit      : ${new Date(lastRow.created_at).toISOString().slice(0, 19).replace("T", " ")} UTC\n`);
  }

  // Daily breakdown last 14 days
  console.log("───────────────────────────────────────────────────");
  console.log("  DAILY VISITS (last 14 days)");
  console.log("───────────────────────────────────────────────────");
  const { data: recent } = await supabase
    .from("visitors")
    .select("created_at")
    .gte("created_at", new Date(today.getTime() - 14 * 86400000).toISOString())
    .order("created_at", { ascending: true });

  if (recent && recent.length) {
    const byDay = {};
    for (const r of recent) {
      const d = new Date(r.created_at).toISOString().slice(0, 10);
      byDay[d] = (byDay[d] ?? 0) + 1;
    }
    const days = Object.keys(byDay).sort();
    const max = Math.max(...Object.values(byDay));
    for (const d of days) {
      const n = byDay[d];
      const bar = "█".repeat(Math.round((n / max) * 30));
      console.log(`  ${d}  ${String(n).padStart(5)}  ${bar}`);
    }
  } else {
    console.log("  (no visits in last 14 days)");
  }

  // Top countries
  console.log("\n───────────────────────────────────────────────────");
  console.log("  TOP COUNTRIES");
  console.log("───────────────────────────────────────────────────");
  const { data: countryRows } = await supabase
    .from("visitors")
    .select("country");
  if (countryRows && countryRows.length) {
    const byCountry = {};
    for (const r of countryRows) {
      const c = r.country || "(unknown)";
      byCountry[c] = (byCountry[c] ?? 0) + 1;
    }
    const sorted = Object.entries(byCountry).sort((a, b) => b[1] - a[1]).slice(0, 15);
    const max = sorted[0][1];
    for (const [c, n] of sorted) {
      const bar = "█".repeat(Math.round((n / max) * 25));
      console.log(`  ${String(c).padEnd(28)} ${String(n).padStart(5)}  ${bar}`);
    }
  }

  // Top pages
  console.log("\n───────────────────────────────────────────────────");
  console.log("  TOP PAGES");
  console.log("───────────────────────────────────────────────────");
  const { data: pageRows } = await supabase
    .from("visitors")
    .select("page");
  if (pageRows && pageRows.length) {
    const byPage = {};
    for (const r of pageRows) {
      const p = r.page || "(unknown)";
      byPage[p] = (byPage[p] ?? 0) + 1;
    }
    const sorted = Object.entries(byPage).sort((a, b) => b[1] - a[1]).slice(0, 15);
    const max = sorted[0][1];
    for (const [p, n] of sorted) {
      const bar = "█".repeat(Math.round((n / max) * 20));
      const pageDisplay = p.length > 38 ? p.slice(0, 35) + "..." : p;
      console.log(`  ${pageDisplay.padEnd(38)} ${String(n).padStart(5)}  ${bar}`);
    }
  }

  // Top referrers
  console.log("\n───────────────────────────────────────────────────");
  console.log("  TOP REFERRERS");
  console.log("───────────────────────────────────────────────────");
  const { data: refRows } = await supabase
    .from("visitors")
    .select("referrer");
  if (refRows && refRows.length) {
    const byRef = {};
    for (const r of refRows) {
      let ref = r.referrer || "(direct)";
      // Normalize: just keep hostname
      try {
        if (ref !== "(direct)") {
          const u = new URL(ref);
          ref = u.hostname;
        }
      } catch {}
      byRef[ref] = (byRef[ref] ?? 0) + 1;
    }
    const sorted = Object.entries(byRef).sort((a, b) => b[1] - a[1]).slice(0, 12);
    const max = sorted[0][1];
    for (const [r, n] of sorted) {
      const bar = "█".repeat(Math.round((n / max) * 22));
      console.log(`  ${String(r).padEnd(34)} ${String(n).padStart(5)}  ${bar}`);
    }
  }

  // Devices
  console.log("\n───────────────────────────────────────────────────");
  console.log("  DEVICES");
  console.log("───────────────────────────────────────────────────");
  const { data: devRows } = await supabase
    .from("visitors")
    .select("device");
  if (devRows && devRows.length) {
    const byDev = {};
    for (const r of devRows) {
      const d = r.device || "(unknown)";
      byDev[d] = (byDev[d] ?? 0) + 1;
    }
    const sorted = Object.entries(byDev).sort((a, b) => b[1] - a[1]);
    const total = sorted.reduce((a, [, n]) => a + n, 0);
    for (const [d, n] of sorted) {
      const pct = ((n / total) * 100).toFixed(1);
      console.log(`  ${String(d).padEnd(28)} ${String(n).padStart(5)}  ${pct}%`);
    }
  }

  // UTM campaigns
  console.log("\n───────────────────────────────────────────────────");
  console.log("  UTM CAMPAIGNS (top 10)");
  console.log("───────────────────────────────────────────────────");
  const { data: utmRows } = await supabase
    .from("visitors")
    .select("utm_source, utm_medium, utm_campaign")
    .not("utm_source", "is", null);
  if (utmRows && utmRows.length) {
    const byUtm = {};
    for (const r of utmRows) {
      const k = `${r.utm_source ?? "?"}/${r.utm_medium ?? "?"}/${r.utm_campaign ?? "?"}`;
      byUtm[k] = (byUtm[k] ?? 0) + 1;
    }
    const sorted = Object.entries(byUtm).sort((a, b) => b[1] - a[1]).slice(0, 10);
    for (const [k, n] of sorted) {
      console.log(`  ${k.padEnd(48)} ${String(n).padStart(5)}`);
    }
  } else {
    console.log("  (no UTM-tagged visits yet)");
  }

  console.log("\n═══════════════════════════════════════════════════\n");
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
