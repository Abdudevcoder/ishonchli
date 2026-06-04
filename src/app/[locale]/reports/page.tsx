export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ReportCard } from "@/components/report/ReportCard";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";

interface ReportsPageProps {
  searchParams: Promise<{ type?: string; page?: string }>;
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const { type, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1"));
  const limit = 12;
  const skip = (page - 1) * limit;
  const t = await getTranslations("report");
  const locale = await getLocale();

  const where = {
    status: "APPROVED" as const,
    ...(type === "fraud" ? { type: "FRAUD" as const } : {}),
    ...(type === "positive" ? { type: "POSITIVE" as const } : {}),
  };

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        seller: { select: { id: true, phone: true, telegramUsername: true, marketplaceUsername: true } },
        user: { select: { id: true, name: true } },
        _count: { select: { comments: true, votes: true } },
      },
    }),
    prisma.report.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t("fraud_reports")}</h1>
        <Link href={`/${locale}/submit-report`} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">
          {t("submit")}
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { label: t("all"), value: undefined },
          { label: t("fraud_reports"), value: "fraud" },
          { label: t("positive_reviews"), value: "positive" },
        ].map((tab) => (
          <a
            key={tab.label}
            href={tab.value ? `/${locale}/reports?type=${tab.value}` : `/${locale}/reports`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              type === tab.value || (!type && !tab.value)
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-3">📋</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {reports.map((r) => <ReportCard key={r.id} report={r} />)}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              {page > 1 && (
                <a href={`/${locale}/reports?${type ? `type=${type}&` : ""}page=${page - 1}`} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Previous</a>
              )}
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              {page < totalPages && (
                <a href={`/${locale}/reports?${type ? `type=${type}&` : ""}page=${page + 1}`} className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Next</a>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
