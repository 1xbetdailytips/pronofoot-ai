"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Fire once per page load
    const track = async () => {
      try {
        await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            page: pathname,
            referrer: document.referrer || "",
            utm_source: searchParams.get("utm_source") || "",
            utm_medium: searchParams.get("utm_medium") || "",
            utm_campaign: searchParams.get("utm_campaign") || "",
          }),
          // Don't block page rendering
          keepalive: true,
        });
      } catch {
        // Silent fail — analytics should never break the site
      }
    };

    // Small delay to not compete with critical page resources
    const timer = setTimeout(track, 1500);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null; // Invisible component
}
