"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { SellerCard } from "@/components/seller/SellerCard";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function FavoritesPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations("favorites");
  const [favorites, setFavorites] = useState<{ seller: unknown }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push(`/${locale}/auth/login`); return; }
    if (status === "authenticated") {
      fetch("/api/favorites").then((r) => r.json()).then(setFavorites).finally(() => setLoading(false));
    }
  }, [status, router, locale]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          {[0,1,2].map((i) => <div key={i} className="h-24 bg-gray-200 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("title")}</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-3">⭐</div>
          <h3 className="font-semibold text-gray-700 mb-2">{t("empty_title")}</h3>
          <p className="text-sm text-gray-400 mb-4">{t("empty_desc")}</p>
          <Link href={`/${locale}/search`} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
            {t("search_btn")}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav, i) => (
            <SellerCard key={i} seller={fav.seller as Parameters<typeof SellerCard>[0]["seller"]} />
          ))}
        </div>
      )}
    </div>
  );
}
