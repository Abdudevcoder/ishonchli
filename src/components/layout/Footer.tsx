"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">I</span>
            </div>
            <span className="font-semibold text-gray-800">Ishonchli.uz</span>
          </div>
          <p className="text-sm text-gray-500">{t("tagline")}</p>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Ishonchli.uz. {t("rights")}.
          </p>
        </div>
      </div>
    </footer>
  );
}
