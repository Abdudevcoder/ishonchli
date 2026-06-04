import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("admin");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalUsers, totalSellers, totalReports, approvedReports, rejectedReports, pendingReports, fraudReports, newToday] = await Promise.all([
    prisma.user.count(),
    prisma.seller.count(),
    prisma.report.count(),
    prisma.report.count({ where: { status: "APPROVED" } }),
    prisma.report.count({ where: { status: "REJECTED" } }),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.report.count({ where: { type: "FRAUD", status: "APPROVED" } }),
    prisma.report.count({ where: { createdAt: { gte: today } } }),
  ]);

  const stats = [
    { label: t("total_users"), value: totalUsers, color: "text-blue-600", bg: "bg-blue-50" },
    { label: t("total_sellers"), value: totalSellers, color: "text-purple-600", bg: "bg-purple-50" },
    { label: t("total_reports"), value: totalReports, color: "text-gray-700", bg: "bg-gray-50" },
    { label: t("approved"), value: approvedReports, color: "text-green-600", bg: "bg-green-50" },
    { label: t("rejected"), value: rejectedReports, color: "text-red-500", bg: "bg-red-50" },
    { label: t("pending"), value: pendingReports, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: t("fraud"), value: fraudReports, color: "text-red-700", bg: "bg-red-50" },
    { label: t("new_today"), value: newToday, color: "text-blue-700", bg: "bg-blue-50" },
  ];

  const recentReports = await prisma.report.findMany({
    take: 8, where: { status: "PENDING" }, orderBy: { createdAt: "desc" },
    include: { seller: { select: { phone: true, telegramUsername: true, marketplaceUsername: true } }, user: { select: { name: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("title")}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.bg}`}>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">{t("pending_reports")}</h2>
            <Link href={`/${locale}/admin/reports`} className="text-sm text-blue-600 hover:underline">{t("view_all")}</Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentReports.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No pending reports.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentReports.map((r) => {
                const sellerName = r.seller.telegramUsername ? `@${r.seller.telegramUsername}` : r.seller.marketplaceUsername ?? r.seller.phone ?? "Unknown";
                return (
                  <div key={r.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50">
                    <div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full mr-2 ${r.type === "FRAUD" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{r.type}</span>
                      <span className="text-sm text-gray-700">{sellerName}</span>
                      <span className="text-xs text-gray-400 ml-2">by {r.user.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                      <Link href={`/${locale}/admin/reports`} className="text-xs text-blue-600 hover:underline">Review</Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
