"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://pronofoot-backend-production.up.railway.app";

function getVisitorHash(): string {
  const nav = typeof navigator !== "undefined" ? navigator.userAgent : "ssr";
  const screen =
    typeof window !== "undefined"
      ? `${window.screen.width}x${window.screen.height}`
      : "0x0";
  const time = new Date().toDateString();
  const str = `${nav}-${screen}-${time}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export default function ReferralTracker({ locale }: { locale: string }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (!ref) return;

    // Don't track your own referral
    const stored = localStorage.getItem("pf_spin");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.refCode === ref) return; // user clicked their own link
      } catch {}
    }

    // Check if already tracked this ref today
    const trackedKey = `pf_ref_tracked_${ref}`;
    if (localStorage.getItem(trackedKey)) return;

    // Track the click
    const visitorHash = getVisitorHash();
    fetch(`${BACKEND_URL}/api/spin/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ref_code: ref, visitor_hash: visitorHash }),
    })
      .then((res) => res.json())
      .then(() => {
        localStorage.setItem(trackedKey, "1");
      })
      .catch(() => {});

    // Clean the URL (remove ?ref= without reload)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("ref");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams, locale]);

  // This component renders nothing - it's purely functional
  return null;
}
