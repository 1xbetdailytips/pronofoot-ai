"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function AuthButton({ locale }: { locale: string }) {
  const supabase = createSupabaseBrowser();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (!user) {
    return (
      <Link
        href={`/${locale}/login`}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
      >
        <User className="w-4 h-4" />
        {locale === "fr" ? "Connexion" : "Log in"}
      </Link>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{initial}</span>
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:inline max-w-[100px] truncate">
          {displayName}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-200 shadow-lg z-50 py-1">
            <Link
              href={`/${locale}/compte`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <User className="w-4 h-4" />
              {locale === "fr" ? "Mon Compte" : "My Account"}
            </Link>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setOpen(false);
                setUser(null);
                window.location.href = `/${locale}`;
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left"
            >
              <LogOut className="w-4 h-4" />
              {locale === "fr" ? "Déconnexion" : "Log out"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
