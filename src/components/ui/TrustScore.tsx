"use client";

import { RiskLevel } from "@prisma/client";
import { useTranslations } from "next-intl";

interface TrustScoreProps {
  score: number;
  riskLevel: RiskLevel;
  size?: "sm" | "md" | "lg";
}

const colors = {
  SAFE: { bar: "bg-green-500", text: "text-green-600", bg: "bg-green-50 border-green-200" },
  MODERATE: { bar: "bg-yellow-400", text: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
  HIGH: { bar: "bg-orange-500", text: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  DANGEROUS: { bar: "bg-red-500", text: "text-red-600", bg: "bg-red-50 border-red-200" },
};

const riskKeys: Record<RiskLevel, "safe" | "moderate" | "high" | "dangerous"> = {
  SAFE: "safe",
  MODERATE: "moderate",
  HIGH: "high",
  DANGEROUS: "dangerous",
};

export function TrustScore({ score, riskLevel, size = "md" }: TrustScoreProps) {
  const t = useTranslations("trust");
  const c = colors[riskLevel];
  const isLg = size === "lg";

  return (
    <div className={`rounded-lg border p-4 ${c.bg} ${isLg ? "p-6" : ""}`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`font-semibold ${c.text} ${isLg ? "text-lg" : "text-sm"}`}>
          Trust Score
        </span>
        <span className={`font-bold ${c.text} ${isLg ? "text-4xl" : "text-2xl"}`}>
          {score}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div className={`h-2 rounded-full transition-all ${c.bar}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${c.bg} ${c.text}`}>
        {t(riskKeys[riskLevel])}
      </span>
    </div>
  );
}
