import { ExternalLink } from "lucide-react";
import { siteConfig } from "@/lib/config";

type AffiliateCTAProps = {
  text: string;
  variant?: "primary" | "secondary" | "banner" | "inline";
  campaign?: string;
  className?: string;
};

// Reusable 1xBet affiliate CTA button — appears throughout the platform
export default function AffiliateCTA({
  text,
  variant = "primary",
  campaign = "general",
  className = "",
}: AffiliateCTAProps) {
  const link = `${siteConfig.affiliateLink}&utm_campaign=${campaign}`;

  const baseStyles = "inline-flex items-center gap-2 font-bold transition-all duration-200";

  const variants = {
    primary:
      "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40",
    secondary:
      "bg-white text-emerald-700 border-2 border-emerald-500 px-5 py-2.5 rounded-xl hover:bg-emerald-50",
    banner:
      "bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg text-lg",
    inline:
      "text-emerald-600 hover:text-emerald-700 underline decoration-2 underline-offset-2 px-0 py-0",
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {text}
      {variant !== "inline" && <ExternalLink className="w-4 h-4" />}
    </a>
  );
}
