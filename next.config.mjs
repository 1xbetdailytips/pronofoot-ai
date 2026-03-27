import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static generation for SEO
  output: "standalone",
};

export default withNextIntl(nextConfig);
