"use client";

import { useState, useEffect, useRef } from "react";
import { Globe } from "lucide-react";

const TIMEZONES = [
  { value: "Africa/Douala", label: "Douala (UTC+1)", short: "CMR" },
  { value: "Africa/Lagos", label: "Lagos (UTC+1)", short: "NGA" },
  { value: "Africa/Nairobi", label: "Nairobi (UTC+3)", short: "KEN" },
  { value: "Europe/Paris", label: "Paris (UTC+1/+2)", short: "FRA" },
  { value: "Europe/London", label: "London (UTC+0/+1)", short: "GBR" },
  { value: "UTC", label: "UTC", short: "UTC" },
];

const STORAGE_KEY = "pf_timezone";

export function getTimezone(): string {
  if (typeof window === "undefined") return "Africa/Douala";
  return localStorage.getItem(STORAGE_KEY) || Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Douala";
}

export default function TimezoneSelector() {
  const [tz, setTz] = useState("Africa/Douala");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setTz(getTimezone());
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const select = (value: string) => {
    setTz(value);
    localStorage.setItem(STORAGE_KEY, value);
    setOpen(false);
    // Trigger re-render of time displays by dispatching custom event
    window.dispatchEvent(new CustomEvent("tz-change", { detail: value }));
  };

  if (!mounted) return null;

  const current = TIMEZONES.find(t => t.value === tz) || TIMEZONES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="Timezone"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{current.short}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-[180px]">
          {TIMEZONES.map((t) => (
            <button
              key={t.value}
              onClick={() => select(t.value)}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                t.value === tz ? "text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/20" : "text-gray-700 dark:text-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
