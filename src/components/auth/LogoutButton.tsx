"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function LogoutButton({ locale }: { locale: string }) {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
    >
      <LogOut className="w-4 h-4" />
      {locale === "fr" ? "Déconnexion" : "Log out"}
    </button>
  );
}
