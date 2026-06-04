"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations("nav");
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  function href(path: string) {
    return `/${locale}${path}`;
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={href("")} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">I</span>
            </div>
            <span className="font-bold text-lg text-gray-900">Ishonchli.uz</span>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <Link href={href("/search")} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              {t("search")}
            </Link>
            <Link href={href("/reports")} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              {t("reports")}
            </Link>
            {session?.user && (
              <>
                <Link href={href("/submit-report")} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  {t("submitReport")}
                </Link>
                <Link href={href("/favorites")} className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  {t("favorites")}
                </Link>
                {session.user.role === "ADMIN" && (
                  <Link href={href("/admin")} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    {t("admin")}
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            {session?.user ? (
              <div className="flex items-center gap-3">
                <Link href={href("/profile")} className="text-sm text-gray-700 hover:text-blue-600">
                  {session.user.name}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <>
                <Link href={href("/auth/login")} className="text-sm text-gray-600 hover:text-blue-600">
                  {t("login")}
                </Link>
                <Link
                  href={href("/auth/register")}
                  className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  {t("register")}
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1 border-t border-gray-100">
            <div className="px-3 py-2">
              <LanguageSwitcher />
            </div>
            <Link href={href("/search")} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">{t("search")}</Link>
            <Link href={href("/reports")} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">{t("reports")}</Link>
            {session?.user ? (
              <>
                <Link href={href("/submit-report")} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">{t("submitReport")}</Link>
                <Link href={href("/favorites")} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">{t("favorites")}</Link>
                <Link href={href("/profile")} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">{t("profile")}</Link>
                {session.user.role === "ADMIN" && (
                  <Link href={href("/admin")} className="block px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">{t("admin")}</Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <>
                <Link href={href("/auth/login")} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">{t("login")}</Link>
                <Link href={href("/auth/register")} className="block px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">{t("register")}</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
