/**
 * Daily Stats Email Renderer
 *
 * Builds a clean HTML email from a DailyStats object, brand-styled to match
 * parifoot.online (dark background, red accents, Inter font).
 */

import type { DailyStats } from "./daily-stats";

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

function pct(n: number): string {
  if (n === 0) return "—";
  const sign = n > 0 ? "▲" : "▼";
  const color = n > 0 ? "#22c55e" : "#ef4444";
  return `<span style="color:${color}">${sign} ${Math.abs(n)}%</span>`;
}

function bar(n: number, max: number, width = 24): string {
  const filled = Math.round((n / Math.max(max, 1)) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

const flagFor: Record<string, string> = {
  Cameroon: "🇨🇲",
  "Ivory Coast": "🇨🇮",
  Benin: "🇧🇯",
  Ghana: "🇬🇭",
  Qatar: "🇶🇦",
  "North Macedonia": "🇲🇰",
  "Congo Republic": "🇨🇬",
  "Burkina Faso": "🇧🇫",
  Kenya: "🇰🇪",
  "United States": "🇺🇸",
  "Republic of the Congo": "🇨🇬",
  France: "🇫🇷",
  Singapore: "🇸🇬",
  Tunisia: "🇹🇳",
  Poland: "🇵🇱",
  Nigeria: "🇳🇬",
  Senegal: "🇸🇳",
  Morocco: "🇲🇦",
  Algeria: "🇩🇿",
  Mali: "🇲🇱",
};

export function renderDailyStatsEmail(stats: DailyStats): {
  subject: string;
  html: string;
  text: string;
} {
  const dateLabel = new Date(stats.generatedAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subject = `📊 Parifoot Daily — ${stats.yesterdayCount} visits yesterday (${stats.totalAllTime} total)`;

  // Daily trend bars
  const maxDaily = Math.max(...stats.dailyTrend.map((d) => d.count), 1);
  const trendRows = stats.dailyTrend
    .map((d) => {
      return `<tr>
        <td style="padding:4px 10px;font-family:'Courier New',monospace;color:#a1a1aa;font-size:13px">${d.date}</td>
        <td style="padding:4px 10px;font-family:'Courier New',monospace;color:#ffffff;font-size:13px;text-align:right">${fmt(d.count)}</td>
        <td style="padding:4px 10px;font-family:'Courier New',monospace;color:#ef4444;font-size:13px">${bar(d.count, maxDaily, 22)}</td>
      </tr>`;
    })
    .join("");

  // Country rows
  const maxCountry = stats.topCountries[0]?.count ?? 1;
  const countryRows = stats.topCountries
    .map((c) => {
      const flag = flagFor[c.name] ?? "🌐";
      return `<tr>
        <td style="padding:5px 10px;color:#e4e4e7;font-size:14px">${flag} ${c.name}</td>
        <td style="padding:5px 10px;color:#ffffff;font-weight:700;text-align:right;font-size:14px">${fmt(c.count)}</td>
        <td style="padding:5px 10px;color:#a1a1aa;text-align:right;font-size:13px">${c.share}%</td>
        <td style="padding:5px 10px;color:#ef4444;font-family:'Courier New',monospace;font-size:12px">${bar(c.count, maxCountry, 18)}</td>
      </tr>`;
    })
    .join("");

  // Top pages
  const maxPage = stats.topPages[0]?.count ?? 1;
  const pageRows = stats.topPages
    .map((p) => {
      const display = p.page.length > 42 ? p.page.slice(0, 39) + "..." : p.page;
      return `<tr>
        <td style="padding:5px 10px;color:#e4e4e7;font-size:13px;font-family:'Courier New',monospace">${display}</td>
        <td style="padding:5px 10px;color:#ffffff;font-weight:700;text-align:right;font-size:14px">${fmt(p.count)}</td>
        <td style="padding:5px 10px;color:#3b82f6;font-family:'Courier New',monospace;font-size:12px">${bar(p.count, maxPage, 16)}</td>
      </tr>`;
    })
    .join("");

  // Referrers
  const maxRef = stats.topReferrers[0]?.count ?? 1;
  const refRows = stats.topReferrers
    .map((r) => {
      return `<tr>
        <td style="padding:5px 10px;color:#e4e4e7;font-size:14px">${r.referrer}</td>
        <td style="padding:5px 10px;color:#ffffff;font-weight:700;text-align:right;font-size:14px">${fmt(r.count)}</td>
        <td style="padding:5px 10px;color:#f59e0b;font-family:'Courier New',monospace;font-size:12px">${bar(r.count, maxRef, 16)}</td>
      </tr>`;
    })
    .join("");

  // Devices
  const deviceRows = stats.devices
    .map((d) => {
      return `<tr>
        <td style="padding:6px 10px;color:#e4e4e7;font-size:14px">${d.device}</td>
        <td style="padding:6px 10px;color:#ffffff;font-weight:700;text-align:right;font-size:14px">${fmt(d.count)}</td>
        <td style="padding:6px 10px;color:#a1a1aa;text-align:right;font-size:13px">${d.share}%</td>
      </tr>`;
    })
    .join("");

  // UTM campaigns
  const utmRows = stats.utmCampaigns.length
    ? stats.utmCampaigns
        .map((u) => {
          return `<tr>
            <td style="padding:5px 10px;color:#e4e4e7;font-size:13px">${u.source}/${u.medium}/${u.campaign}</td>
            <td style="padding:5px 10px;color:#ffffff;font-weight:700;text-align:right;font-size:14px">${fmt(u.count)}</td>
          </tr>`;
        })
        .join("")
    : `<tr><td colspan="2" style="padding:10px;color:#71717a;font-size:13px;font-style:italic">No UTM-tagged visits yet — add UTMs to your social shares to track campaigns.</td></tr>`;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:'Inter','Segoe UI','Helvetica Neue',Arial,sans-serif">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0a0a0f">
    <tr>
      <td align="center" style="padding:30px 15px">

        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#13131c;border-radius:16px;overflow:hidden;border:1px solid #27272a">

          <!-- Header -->
          <tr>
            <td style="padding:30px 32px 18px;background:linear-gradient(180deg,#1a1a2a 0%,#13131c 100%);border-bottom:2px solid #ef4444">
              <div style="font-size:13px;color:#a1a1aa;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:6px">Parifoot Daily Report</div>
              <h1 style="font-size:24px;color:#ffffff;font-weight:900;margin:0">📊 ${dateLabel}</h1>
              <div style="font-size:13px;color:#71717a;margin-top:8px">Generated ${new Date(stats.generatedAt).toUTCString()}</div>
            </td>
          </tr>

          <!-- Headline KPIs -->
          <tr>
            <td style="padding:24px 32px">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="width:50%;padding:14px;background:#1a1a2a;border:1px solid #27272a;border-radius:12px" valign="top">
                    <div style="font-size:11px;color:#a1a1aa;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px">Yesterday</div>
                    <div style="font-size:34px;color:#ffffff;font-weight:900;line-height:1">${fmt(stats.yesterdayCount)}</div>
                    <div style="font-size:13px;color:#a1a1aa;margin-top:6px">${pct(stats.dayOverDayChangePct)} vs day before</div>
                  </td>
                  <td style="width:8px"></td>
                  <td style="width:50%;padding:14px;background:#1a1a2a;border:1px solid #27272a;border-radius:12px" valign="top">
                    <div style="font-size:11px;color:#a1a1aa;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px">All-Time</div>
                    <div style="font-size:34px;color:#ef4444;font-weight:900;line-height:1">${fmt(stats.totalAllTime)}</div>
                    <div style="font-size:13px;color:#a1a1aa;margin-top:6px">since ${stats.firstVisit?.slice(0, 10) ?? "?"}</div>
                  </td>
                </tr>
                <tr><td colspan="3" style="height:10px"></td></tr>
                <tr>
                  <td style="padding:14px;background:#1a1a2a;border:1px solid #27272a;border-radius:12px" valign="top">
                    <div style="font-size:11px;color:#a1a1aa;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px">Last 7d</div>
                    <div style="font-size:24px;color:#ffffff;font-weight:900;line-height:1">${fmt(stats.last7DayCount)}</div>
                  </td>
                  <td style="width:8px"></td>
                  <td style="padding:14px;background:#1a1a2a;border:1px solid #27272a;border-radius:12px" valign="top">
                    <div style="font-size:11px;color:#a1a1aa;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px">Last 30d</div>
                    <div style="font-size:24px;color:#ffffff;font-weight:900;line-height:1">${fmt(stats.last30DayCount)}</div>
                  </td>
                </tr>
                <tr><td colspan="3" style="height:10px"></td></tr>
                <tr>
                  <td colspan="3" style="padding:14px;background:#1a1a2a;border:1px solid #27272a;border-radius:12px">
                    <div style="font-size:11px;color:#a1a1aa;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:6px">Today So Far</div>
                    <div style="font-size:20px;color:#3b82f6;font-weight:900">${fmt(stats.todayCount)} visits</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Daily Trend -->
          <tr>
            <td style="padding:8px 32px 24px">
              <h2 style="font-size:14px;color:#ef4444;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 12px;font-weight:800">📅 Daily Trend (last 14 days)</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#1a1a2a;border:1px solid #27272a;border-radius:12px;padding:8px 4px">
                ${trendRows}
              </table>
            </td>
          </tr>

          <!-- Top Countries -->
          <tr>
            <td style="padding:8px 32px 24px">
              <h2 style="font-size:14px;color:#ef4444;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 12px;font-weight:800">🌍 Top Countries</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#1a1a2a;border:1px solid #27272a;border-radius:12px;padding:8px 4px">
                ${countryRows}
              </table>
            </td>
          </tr>

          <!-- Top Pages -->
          <tr>
            <td style="padding:8px 32px 24px">
              <h2 style="font-size:14px;color:#ef4444;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 12px;font-weight:800">📄 Top Pages</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#1a1a2a;border:1px solid #27272a;border-radius:12px;padding:8px 4px">
                ${pageRows}
              </table>
            </td>
          </tr>

          <!-- Referrers -->
          <tr>
            <td style="padding:8px 32px 24px">
              <h2 style="font-size:14px;color:#ef4444;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 12px;font-weight:800">🔗 Top Referrers</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#1a1a2a;border:1px solid #27272a;border-radius:12px;padding:8px 4px">
                ${refRows}
              </table>
            </td>
          </tr>

          <!-- Devices -->
          <tr>
            <td style="padding:8px 32px 24px">
              <h2 style="font-size:14px;color:#ef4444;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 12px;font-weight:800">📱 Devices</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#1a1a2a;border:1px solid #27272a;border-radius:12px;padding:8px 4px">
                ${deviceRows}
              </table>
            </td>
          </tr>

          <!-- UTM Campaigns -->
          <tr>
            <td style="padding:8px 32px 24px">
              <h2 style="font-size:14px;color:#ef4444;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 12px;font-weight:800">🎯 UTM Campaigns</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#1a1a2a;border:1px solid #27272a;border-radius:12px;padding:8px 4px">
                ${utmRows}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 32px 32px;background:#0a0a0f;border-top:1px solid #27272a;text-align:center">
              <div style="font-size:18px;font-weight:900;color:#ffffff;margin-bottom:6px">
                <span style="color:#ffffff">PARI</span><span style="color:#ef4444">FOOT</span>
              </div>
              <a href="https://www.parifoot.online" style="color:#3b82f6;text-decoration:none;font-size:13px">www.parifoot.online</a>
              <div style="font-size:11px;color:#71717a;margin-top:14px">
                Daily report sent every morning at 8:00 AM Cameroon time<br>
                Reply to this email to stop receiving these reports
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // Plain-text fallback
  const text = `Parifoot Daily Report — ${dateLabel}

YESTERDAY:        ${fmt(stats.yesterdayCount)} visits (${stats.dayOverDayChangePct >= 0 ? "+" : ""}${stats.dayOverDayChangePct}% vs day before)
TODAY SO FAR:     ${fmt(stats.todayCount)} visits
LAST 7 DAYS:      ${fmt(stats.last7DayCount)} visits
LAST 30 DAYS:     ${fmt(stats.last30DayCount)} visits
ALL TIME:         ${fmt(stats.totalAllTime)} visits

DAILY TREND (last 14 days):
${stats.dailyTrend.map((d) => `  ${d.date}  ${fmt(d.count).padStart(5)}  ${bar(d.count, maxDaily, 20)}`).join("\n")}

TOP COUNTRIES:
${stats.topCountries.map((c, i) => `  ${(i + 1).toString().padStart(2)}. ${c.name.padEnd(28)} ${fmt(c.count).padStart(5)}  ${c.share}%`).join("\n")}

TOP PAGES:
${stats.topPages.map((p, i) => `  ${(i + 1).toString().padStart(2)}. ${p.page.padEnd(42)} ${fmt(p.count).padStart(5)}`).join("\n")}

TOP REFERRERS:
${stats.topReferrers.map((r) => `  ${r.referrer.padEnd(28)} ${fmt(r.count).padStart(5)}`).join("\n")}

DEVICES:
${stats.devices.map((d) => `  ${d.device.padEnd(20)} ${fmt(d.count).padStart(5)}  ${d.share}%`).join("\n")}

—
Parifoot.online | https://www.parifoot.online
Daily report sent every morning at 8:00 AM Cameroon time
`;

  return { subject, html, text };
}
