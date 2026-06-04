"use client";

import Link from "next/link";
import { RiskLevel } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { useTranslations, useLocale } from "next-intl";

interface SellerCardProps {
  seller: {
    id: string;
    phone?: string | null;
    telegramUsername?: string | null;
    marketplaceUsername?: string | null;
    trustScore: number;
    riskLevel: RiskLevel;
    suspiciousFlag: boolean;
    potentialFraudster: boolean;
  };
}

const riskVariant: Record<RiskLevel, "success" | "warning" | "danger" | "default"> = {
  SAFE: "success",
  MODERATE: "warning",
  HIGH: "danger",
  DANGEROUS: "danger",
};

const riskKeys: Record<RiskLevel, "safe" | "moderate" | "high" | "dangerous"> = {
  SAFE: "safe",
  MODERATE: "moderate",
  HIGH: "high",
  DANGEROUS: "dangerous",
};

export function SellerCard({ seller }: SellerCardProps) {
  const t = useTranslations("trust");
  const tSeller = useTranslations("seller");
  const locale = useLocale();

  return (
    <Link
      href={`/${locale}/sellers/${seller.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm truncate">
                {seller.telegramUsername ? `@${seller.telegramUsername}` : seller.marketplaceUsername ?? seller.phone ?? "Unknown Seller"}
              </p>
              <p className="text-xs text-gray-400">{seller.phone}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <Badge variant={riskVariant[seller.riskLevel]}>{t(riskKeys[seller.riskLevel])}</Badge>
            {seller.suspiciousFlag && <Badge variant="danger">⚠ {tSeller("suspicious")}</Badge>}
            {seller.potentialFraudster && <Badge variant="danger">🚨 {tSeller("potential_fraudster")}</Badge>}
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className={`text-2xl font-bold ${seller.trustScore >= 80 ? "text-green-600" : seller.trustScore >= 50 ? "text-yellow-600" : seller.trustScore >= 20 ? "text-orange-600" : "text-red-600"}`}>
            {seller.trustScore}
          </div>
          <div className="text-xs text-gray-400">{tSeller("trust_score")}</div>
        </div>
      </div>
    </Link>
  );
}
