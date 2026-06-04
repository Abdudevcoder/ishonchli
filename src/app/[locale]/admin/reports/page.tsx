export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { ReportModerationTable } from "./ReportModerationTable";

interface AdminReportsPageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminReportsPage({ searchParams }: AdminReportsPageProps) {
  const { status, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1"));
  const limit = 15;
  const skip = (page - 1) * limit;

  const where = status && ["PENDING", "APPROVED", "REJECTED"].includes(status)
    ? { status: status as "PENDING" | "APPROVED" | "REJECTED" }
    : {};

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        seller: { select: { id: true, phone: true, telegramUsername: true, marketplaceUsername: true } },
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.report.count({ where }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports Moderation</h1>

      <div className="flex gap-2 mb-4">
        {[
          { label: "All", value: "" },
          { label: "Pending", value: "PENDING" },
          { label: "Approved", value: "APPROVED" },
          { label: "Rejected", value: "REJECTED" },
        ].map((t) => (
          <a
            key={t.label}
            href={t.value ? `/admin/reports?status=${t.value}` : "/admin/reports"}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              status === t.value || (!status && !t.value)
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {t.label}
          </a>
        ))}
      </div>

      <ReportModerationTable reports={reports} total={total} page={page} limit={limit} status={status} />
    </div>
  );
}
