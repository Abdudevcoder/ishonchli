export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { safeDb } from "@/lib/safe-db";
import { StatisticsCharts } from "./StatisticsCharts";

export default async function StatisticsPage() {
  const [categoryDistribution, riskDistribution, recentActivity] = await safeDb(() => Promise.all([
    prisma.report.groupBy({
      by: ["category"],
      where: { type: "FRAUD" },
      _count: { _all: true },
    }),
    prisma.seller.groupBy({
      by: ["riskLevel"],
      _count: { _all: true },
    }),
    prisma.report.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) },
      },
      select: { createdAt: true, type: true, status: true },
      orderBy: { createdAt: "asc" },
    }),
  ]), [[], [], []]);

  // Group by month
  const monthlyMap: Record<string, { fraud: number; positive: number }> = {};
  for (const r of recentActivity) {
    const key = new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    if (!monthlyMap[key]) monthlyMap[key] = { fraud: 0, positive: 0 };
    if (r.type === "FRAUD") monthlyMap[key].fraud++;
    else monthlyMap[key].positive++;
  }
  const monthly = Object.entries(monthlyMap).map(([month, counts]) => ({ month, ...counts }));

  const catData = categoryDistribution.map((c) => ({
    name: c.category.replace(/_/g, " "),
    value: c._count._all,
  }));

  const riskData = riskDistribution.map((r) => ({
    name: r.riskLevel,
    value: r._count._all,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Statistics</h1>
      <StatisticsCharts monthly={monthly} categories={catData} risks={riskData} />
    </div>
  );
}
