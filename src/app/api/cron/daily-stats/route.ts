/**
 * GET /api/cron/daily-stats
 *
 * Daily cron endpoint — generates the visitor analytics report and sends it
 * to DAILY_REPORT_TO via Resend.
 *
 * Triggered by Vercel Cron once a day at 08:00 Cameroon time (07:00 UTC).
 * See vercel.json for the cron schedule.
 *
 * Security:
 *   - Vercel cron requests carry an `Authorization: Bearer <CRON_SECRET>` header
 *     when CRON_SECRET is set in env. We verify it.
 *   - Manual testing: pass `?key=<CRON_SECRET>` as a query param OR call without
 *     auth in development.
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getDailyStats } from "@/lib/daily-stats";
import { renderDailyStatsEmail } from "@/lib/daily-stats-email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // No secret configured — allow in dev, deny in prod
    return process.env.NODE_ENV !== "production";
  }
  // Vercel cron sends the Authorization header
  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;
  // Manual testing via query param
  const key = req.nextUrl.searchParams.get("key");
  if (key === secret) return true;
  return false;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.DAILY_REPORT_TO;
  const from = process.env.DAILY_REPORT_FROM ?? "Parifoot Reports <onboarding@resend.dev>";

  if (!apiKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY not set in environment" },
      { status: 500 }
    );
  }
  if (!to) {
    return NextResponse.json(
      { error: "DAILY_REPORT_TO not set in environment" },
      { status: 500 }
    );
  }

  try {
    const stats = await getDailyStats();
    const { subject, html, text } = renderDailyStatsEmail(stats);

    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
    });

    if (result.error) {
      return NextResponse.json(
        { error: "Resend send failed", details: result.error },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      sent_to: to,
      from,
      subject,
      stats_summary: {
        totalAllTime: stats.totalAllTime,
        yesterday: stats.yesterdayCount,
        last7d: stats.last7DayCount,
        topCountry: stats.topCountries[0]?.name ?? null,
      },
      resend_id: result.data?.id,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
    return NextResponse.json(
      { error: "Failed to generate or send report", details: message },
      { status: 500 }
    );
  }
}
