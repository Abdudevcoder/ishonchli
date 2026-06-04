import { prisma } from "./prisma";
import { RiskLevel } from "@prisma/client";

export function calculateRiskLevel(score: number): RiskLevel {
  if (score >= 80) return RiskLevel.SAFE;
  if (score >= 50) return RiskLevel.MODERATE;
  if (score >= 20) return RiskLevel.HIGH;
  return RiskLevel.DANGEROUS;
}

export async function recalculateSellerTrust(sellerId: string) {
  const reports = await prisma.report.findMany({
    where: { sellerId, status: "APPROVED" },
    select: { type: true },
  });

  const positiveCount = reports.filter((r) => r.type === "POSITIVE").length;
  const negativeCount = reports.filter((r) => r.type === "FRAUD").length;

  // Count confirmed fraud (APPROVED FRAUD reports)
  const confirmedFraud = negativeCount;

  let score = 50 + positiveCount * 3 - negativeCount * 5 - confirmedFraud * 10;
  score = Math.max(0, Math.min(100, score));

  const riskLevel = calculateRiskLevel(score);

  // Suspicious: more than 3 complaints within 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentComplaints = await prisma.report.count({
    where: {
      sellerId,
      type: "FRAUD",
      createdAt: { gte: sevenDaysAgo },
    },
  });
  const suspiciousFlag = recentComplaints > 3;

  // Potential fraudster: more than 5 confirmed fraud reports
  const potentialFraudster = confirmedFraud > 5;

  await prisma.seller.update({
    where: { id: sellerId },
    data: { trustScore: score, riskLevel, suspiciousFlag, potentialFraudster },
  });

  return { score, riskLevel, suspiciousFlag, potentialFraudster };
}

export function getRiskColor(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case RiskLevel.SAFE: return "text-green-600 bg-green-50 border-green-200";
    case RiskLevel.MODERATE: return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case RiskLevel.HIGH: return "text-orange-600 bg-orange-50 border-orange-200";
    case RiskLevel.DANGEROUS: return "text-red-600 bg-red-50 border-red-200";
  }
}

export function getRiskLabel(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case RiskLevel.SAFE: return "Safe";
    case RiskLevel.MODERATE: return "Moderate Risk";
    case RiskLevel.HIGH: return "High Risk";
    case RiskLevel.DANGEROUS: return "Dangerous";
  }
}
