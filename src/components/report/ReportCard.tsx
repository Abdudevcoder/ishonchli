"use client";

import Link from "next/link";
import { ReportCategory, ReportStatus, ReportType } from "@prisma/client";
import { Badge } from "@/components/ui/Badge";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

interface ReportCardProps {
  report: {
    id: string;
    category: ReportCategory;
    description: string;
    status: ReportStatus;
    type: ReportType;
    rating?: number | null;
    createdAt: Date | string;
    seller: {
      id: string;
      phone?: string | null;
      telegramUsername?: string | null;
      marketplaceUsername?: string | null;
    };
    user: { name: string };
    _count?: { comments: number; votes: number };
  };
}

const statusVariant: Record<ReportStatus, "default" | "success" | "warning" | "danger"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

export function ReportCard({ report }: ReportCardProps) {
  const t = useTranslations("report");
  const tCat = useTranslations("categories");
  const tStatus = useTranslations("status");
  const locale = useLocale();

  const sellerName = report.seller.telegramUsername
    ? `@${report.seller.telegramUsername}`
    : report.seller.marketplaceUsername ?? report.seller.phone ?? "Unknown";

  const date = new Date(report.createdAt).toLocaleDateString();

  return (
    <Link
      href={`/${locale}/reports/${report.id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={report.type === "FRAUD" ? "danger" : "success"}>
            {report.type === "FRAUD" ? t("fraud") : t("positive")}
          </Badge>
          {report.type === "FRAUD" && (
            <Badge variant="default">{tCat(report.category)}</Badge>
          )}
          <Badge variant={statusVariant[report.status]}>{tStatus(report.status)}</Badge>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">{date}</span>
      </div>

      <p className="text-sm text-gray-800 mb-3 line-clamp-2">{report.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-3">
          <span>Seller: <span className="font-medium text-gray-700">{sellerName}</span></span>
          <span>{report.user.name}</span>
        </div>
        {report._count && (
          <div className="flex items-center gap-3">
            <span>{report._count.comments}</span>
            <span>{report._count.votes}</span>
          </div>
        )}
      </div>

      {report.type === "POSITIVE" && report.rating && (
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} className={`w-3.5 h-3.5 ${i < report.rating! ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      )}
    </Link>
  );
}
