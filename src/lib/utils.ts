import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Combine Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date for display
export function formatDate(date: Date | string, locale: string = "en"): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Generate SEO-friendly slug from team names
export function generateMatchSlug(
  homeTeam: string,
  awayTeam: string,
  date: Date
): string {
  const dateStr = new Date(date).toISOString().split("T")[0];
  const slug = `${homeTeam}-vs-${awayTeam}-prediction-${dateStr}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return slug;
}

// Get risk level color
export function getRiskColor(risk: string): string {
  switch (risk) {
    case "safe":
      return "text-green-600 bg-green-50 border-green-200";
    case "medium":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "high":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "extreme":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

// Get confidence level label
export function getConfidenceLabel(
  confidence: number,
  locale: string = "en"
): string {
  if (locale === "fr") {
    if (confidence >= 80) return "Tres Haute Confiance";
    if (confidence >= 60) return "Haute Confiance";
    if (confidence >= 40) return "Confiance Moyenne";
    return "Faible Confiance";
  }
  if (confidence >= 80) return "Very High Confidence";
  if (confidence >= 60) return "High Confidence";
  if (confidence >= 40) return "Medium Confidence";
  return "Low Confidence";
}

// Affiliate link helper
export function getAffiliateLink(campaign?: string): string {
  const base =
    process.env.NEXT_PUBLIC_AFFILIATE_LINK || "https://1xbet.com";
  if (campaign) {
    return `${base}&utm_campaign=${campaign}`;
  }
  return base;
}
