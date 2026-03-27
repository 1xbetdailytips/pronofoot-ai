import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PronoFoot AI",
  description: "AI-Powered Football Predictions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
