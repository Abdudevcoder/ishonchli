"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

const labels: Record<string, string> = {
  uz: "UZ",
  ru: "RU",
  en: "EN",
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: string) {
    // Replace the current locale segment in the pathname
    const segments = pathname.split("/");
    const localeIndex = routing.locales.findIndex((l) => l === segments[1]);
    if (localeIndex !== -1 || segments[1] === "") {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join("/") || `/${newLocale}`);
  }

  return (
    <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-0.5 bg-gray-50">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l)}
          className={`px-2 py-1 rounded text-xs font-semibold transition ${
            l === locale
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700 hover:bg-white"
          }`}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
