import createMiddleware from "next-intl/middleware";
import { siteConfig } from "@/lib/config";

// Handle locale routing: /fr/... and /en/...
export default createMiddleware({
  locales: siteConfig.locales,
  defaultLocale: siteConfig.defaultLocale,
  localePrefix: "always",
});

export const config = {
  // Match all paths except API routes, static files, etc.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
