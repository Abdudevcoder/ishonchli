export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";
import { SellerCard } from "@/components/seller/SellerCard";
import { ReportCard } from "@/components/report/ReportCard";
import { getTranslations, getLocale } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("home");
  const locale = await getLocale();

  const [recentSellers, recentReports, stats] = await Promise.all([
    safeDb(() => prisma.seller.findMany({ take: 4, orderBy: { createdAt: "desc" } }), []),
    safeDb(() => prisma.report.findMany({
      where: { status: "APPROVED" },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        seller: { select: { id: true, phone: true, telegramUsername: true, marketplaceUsername: true } },
        user: { select: { id: true, name: true } },
        _count: { select: { comments: true, votes: true } },
      },
    }), []),
    safeDb(() => Promise.all([
      prisma.seller.count(),
      prisma.report.count({ where: { type: "FRAUD", status: "APPROVED" } }),
      prisma.user.count(),
    ]), [0, 0, 0]),
  ]);

  const [sellerCount, fraudCount, userCount] = stats;

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("hero_title")}</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{t("hero_desc")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/${locale}/search`} className="px-8 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition">
              {t("search_btn")}
            </Link>
            <Link href={`/${locale}/submit-report`} className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-xl border border-blue-400 hover:bg-blue-400 transition">
              {t("report_btn")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: t("stats_sellers"), value: sellerCount, color: "text-blue-600" },
            { label: t("stats_fraud"), value: fraudCount, color: "text-red-500" },
            { label: t("stats_users"), value: userCount, color: "text-green-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Search */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <form action={`/${locale}/search`} method="get" className="flex gap-3">
          <input
            name="q"
            type="text"
            placeholder={t("search_placeholder")}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          />
          <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-sm">
            {t("search_action")}
          </button>
        </form>
      </section>

      {/* Recent Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{t("recent_sellers")}</h2>
          <Link href={`/${locale}/search`} className="text-sm text-blue-600 hover:underline">{t("view_all")}</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentSellers.map((seller) => <SellerCard key={seller.id} seller={seller} />)}
        </div>
      </section>

      {/* Recent Reports */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{t("recent_reports")}</h2>
          <Link href={`/${locale}/reports`} className="text-sm text-blue-600 hover:underline">{t("view_all")}</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentReports.map((report) => <ReportCard key={report.id} report={report} />)}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-t border-gray-200 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">{t("how_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", title: t("step1_title"), desc: t("step1_desc") },
              { step: "2", title: t("step2_title"), desc: t("step2_desc") },
              { step: "3", title: t("step3_title"), desc: t("step3_desc") },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
