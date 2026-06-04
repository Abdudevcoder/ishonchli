import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalSellers,
    totalReports,
    approvedReports,
    rejectedReports,
    fraudReports,
    newReportsToday,
    reportsPerMonth,
    categoryDistribution,
    trustDistribution,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.seller.count(),
    prisma.report.count(),
    prisma.report.count({ where: { status: "APPROVED" } }),
    prisma.report.count({ where: { status: "REJECTED" } }),
    prisma.report.count({ where: { type: "FRAUD", status: "APPROVED" } }),
    prisma.report.count({ where: { createdAt: { gte: today } } }),
    // Reports per last 6 months
    prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT TO_CHAR(DATE_TRUNC('month', "createdAt"), 'Mon YYYY') as month,
             COUNT(*) as count
      FROM "Report"
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY DATE_TRUNC('month', "createdAt")
    `,
    prisma.report.groupBy({
      by: ["category"],
      where: { type: "FRAUD" },
      _count: { _all: true },
    }),
    // Trust score distribution
    prisma.$queryRaw<{ level: string; count: bigint }[]>`
      SELECT "riskLevel" as level, COUNT(*) as count
      FROM "Seller"
      GROUP BY "riskLevel"
    `,
  ]);

  return NextResponse.json({
    stats: { totalUsers, totalSellers, totalReports, approvedReports, rejectedReports, fraudReports, newReportsToday },
    reportsPerMonth: reportsPerMonth.map((r) => ({ month: r.month, count: Number(r.count) })),
    categoryDistribution: categoryDistribution.map((c) => ({ category: c.category, count: c._count._all })),
    trustDistribution: trustDistribution.map((t) => ({ level: t.level, count: Number(t.count) })),
  });
}
