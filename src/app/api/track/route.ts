import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Detect device type from user-agent
function getDevice(ua: string): string {
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
}

// Clean referrer to readable source
function parseReferrer(ref: string): string {
  if (!ref) return "direct";
  try {
    const url = new URL(ref);
    const host = url.hostname.replace("www.", "");
    if (host.includes("google")) return "google";
    if (host.includes("bing")) return "bing";
    if (host.includes("facebook") || host.includes("fb.")) return "facebook";
    if (host.includes("twitter") || host.includes("t.co") || host.includes("x.com")) return "twitter/x";
    if (host.includes("instagram")) return "instagram";
    if (host.includes("tiktok")) return "tiktok";
    if (host.includes("telegram") || host.includes("t.me")) return "telegram";
    if (host.includes("whatsapp")) return "whatsapp";
    if (host.includes("youtube")) return "youtube";
    if (host.includes("reddit")) return "reddit";
    if (host.includes("parifoot") || host.includes("pronofoot")) return "internal";
    return host;
  } catch {
    return ref.slice(0, 100);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, referrer, utm_source, utm_medium, utm_campaign } = body;

    // Get IP from headers (Vercel sets these)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = request.headers.get("user-agent") || "";
    const device = getDevice(userAgent);
    const cleanReferrer = parseReferrer(referrer || "");

    // Skip internal navigation and bots
    if (cleanReferrer === "internal") {
      return NextResponse.json({ ok: true, skipped: "internal" });
    }
    if (/bot|crawl|spider|slurp|facebookexternalhit/i.test(userAgent)) {
      return NextResponse.json({ ok: true, skipped: "bot" });
    }

    // Get geolocation from free API
    let country = "Unknown";
    let city = "Unknown";
    if (ip !== "unknown" && ip !== "127.0.0.1" && ip !== "::1") {
      try {
        const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`, {
          signal: AbortSignal.timeout(3000),
        });
        if (geoRes.ok) {
          const geo = await geoRes.json();
          country = geo.country || "Unknown";
          city = geo.city || "Unknown";
        }
      } catch {
        // Geo lookup failed — continue without it
      }
    }

    // Upsert: unique IP per day (update page if same visitor returns)
    const { error } = await supabase.from("visitors").upsert(
      {
        ip,
        country,
        city,
        referrer: cleanReferrer,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        page: page || "/",
        user_agent: userAgent.slice(0, 500),
        device,
        created_at: new Date().toISOString(),
      },
      {
        onConflict: "ip,created_at::date",
        ignoreDuplicates: true,
      }
    );

    // If upsert with onConflict fails (Supabase doesn't support expression-based conflict),
    // fall back to simple insert that silently fails on duplicate
    if (error) {
      // Try plain insert — if IP already exists today, it'll fail silently
      await supabase.from("visitors").insert({
        ip,
        country,
        city,
        referrer: cleanReferrer,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
        page: page || "/",
        user_agent: userAgent.slice(0, 500),
        device,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("[track] Error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
