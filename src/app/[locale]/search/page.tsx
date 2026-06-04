export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";
import { SellerCard } from "@/components/seller/SellerCard";
import { getTranslations, getLocale } from "next-intl/server";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const t = await getTranslations("search");
  const locale = await getLocale();

  const sellers = await safeDb(() => query
    ? prisma.seller.findMany({
        where: {
          OR: [
            { phone: { contains: query, mode: "insensitive" } },
            { telegramUsername: { contains: query, mode: "insensitive" } },
            { marketplaceUsername: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 30,
      })
    : prisma.seller.findMany({ take: 20, orderBy: { createdAt: "desc" } }), []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("title")}</h1>
      <p className="text-sm text-gray-500 mb-6">{t("desc")}</p>

      <form method="get" action={`/${locale}/search`} className="flex gap-3 mb-8">
        <input
          name="q"
          type="text"
          defaultValue={q}
          placeholder={t("placeholder")}
          className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition">
          {t("btn")}
        </button>
      </form>

      {query && (
        <p className="text-sm text-gray-500 mb-4">
          {sellers.length === 0
            ? t("no_results", { query })
            : t("results", { count: sellers.length, query })}
        </p>
      )}

      {sellers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellers.map((s) => <SellerCard key={s.id} seller={s} />)}
        </div>
      ) : query ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-3">🔍</div>
          <p className="text-sm text-gray-400">
            {t("empty_msg")}{" "}
            <a href={`/${locale}/submit-report`} className="text-blue-600 underline">{t("submit_link")}</a>.
          </p>
        </div>
      ) : null}
    </div>
  );
}
