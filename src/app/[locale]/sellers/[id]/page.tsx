export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";
import { TrustScore } from "@/components/ui/TrustScore";
import { Badge } from "@/components/ui/Badge";
import { ReportCard } from "@/components/report/ReportCard";
import { FavoriteButton } from "./FavoriteButton";
import { getTranslations, getLocale } from "next-intl/server";

interface SellerPageProps {
  params: Promise<{ id: string }>;
}

export default async function SellerPage({ params }: SellerPageProps) {
  const { id } = await params;
  const t = await getTranslations("seller");
  const tTrust = await getTranslations("trust");
  const locale = await getLocale();

  const seller = await safeDb(() => prisma.seller.findUnique({
    where: { id },
    include: {
      reports: {
        where: { status: "APPROVED" },
        include: {
          user: { select: { id: true, name: true } },
          _count: { select: { comments: true, votes: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  }), null);

  if (!seller) notFound();

  const sellerRef = {
    id: seller.id,
    phone: seller.phone,
    telegramUsername: seller.telegramUsername,
    marketplaceUsername: seller.marketplaceUsername,
  };
  const reportsWithSeller = seller.reports.map((r) => ({ ...r, seller: sellerRef }));
  const fraudReports = reportsWithSeller.filter((r) => r.type === "FRAUD");
  const positiveReports = reportsWithSeller.filter((r) => r.type === "POSITIVE");

  void tTrust;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">
                  {seller.telegramUsername ? `@${seller.telegramUsername}` : seller.marketplaceUsername ?? seller.phone ?? "Unknown"}
                </h1>
                <p className="text-xs text-gray-400">
                  {t("joined")} {new Date(seller.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              {seller.phone && <div className="flex items-center gap-2">📞 {seller.phone}</div>}
              {seller.telegramUsername && <div className="flex items-center gap-2">✈ @{seller.telegramUsername}</div>}
              {seller.marketplaceUsername && <div className="flex items-center gap-2">🛒 {seller.marketplaceUsername}</div>}
            </div>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {seller.suspiciousFlag && <Badge variant="danger">⚠ {t("suspicious")}</Badge>}
              {seller.potentialFraudster && <Badge variant="danger">🚨 {t("potential_fraudster")}</Badge>}
            </div>

            <div className="mt-4">
              <FavoriteButton sellerId={seller.id} />
            </div>
          </div>

          <TrustScore score={seller.trustScore} riskLevel={seller.riskLevel} size="lg" />

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">{t("report_summary")}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{fraudReports.length}</div>
                <div className="text-xs text-gray-500">{t("fraud_reports")}</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{positiveReports.length}</div>
                <div className="text-xs text-gray-500">{t("positive_reviews")}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {fraudReports.length > 0 && (
            <div>
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                {t("fraud_reports")} ({fraudReports.length})
              </h2>
              <div className="space-y-3">
                {fraudReports.map((r) => <ReportCard key={r.id} report={r} />)}
              </div>
            </div>
          )}

          {positiveReports.length > 0 && (
            <div>
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                {t("positive_reviews")} ({positiveReports.length})
              </h2>
              <div className="space-y-3">
                {positiveReports.map((r) => <ReportCard key={r.id} report={r} />)}
              </div>
            </div>
          )}

          {reportsWithSeller.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="font-semibold text-gray-700 mb-1">{t("no_reports")}</h3>
              <p className="text-sm text-gray-400">{t("no_reports_desc")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
